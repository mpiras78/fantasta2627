#!/usr/bin/env node
// Rigenera js/data.js a partire da giocatori.md.
//
// Uso: node scripts/build-players.mjs
// (da eseguire dalla root del repository, o da qualsiasi cartella: i percorsi
// sono calcolati in automatico rispetto alla posizione di questo script).
//
// Lo script legge giocatori.md, estrae ruolo/fascia/nome/squadra/media voto/
// bonus/malus/rigorista per ogni giocatore e riscrive js/data.js mantenendo
// esattamente la stessa struttura usata dal resto dell'app (script classico,
// nessun modulo ES, cosi' funziona sia via file:// sia su GitHub Pages).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const INPUT_FILE = path.join(ROOT_DIR, 'giocatori.md');
const OUTPUT_FILE = path.join(ROOT_DIR, 'js', 'data.js');

const ROLE_MAP = {
  PORTIERI: 'P',
  DIFENSORI: 'D',
  CENTROCAMPISTI: 'C',
  ATTACCANTI: 'A',
};

const FASCIA_MAP = {
  Top: 'top',
  'Prima Fascia': 'f1',
  'Seconda Fascia': 'f2',
  'Terza Fascia': 'f3',
  'Jolly / Riserve': 'jolly',
  'Ultimi Slot': 'jolly',
};

// Riga giocatore, es:
// * **Butez (Como):** MV 6.15 | **Bonus:** 10 Clean Sheet, 1 Rigore Parato | **Malus:** -38 Gol Subiti, 2 Ammonizioni | **Rigorista:** No
const PLAYER_LINE_RE =
  /^\*\s+\*\*(.+?)\s*\((.+?)\)\s*:\*\*\s*MV\s*([\d.]+)\s*\|\s*\*\*Bonus:\*\*\s*(.*?)\s*\|\s*\*\*Malus:\*\*\s*(.*?)\s*\|\s*\*\*Rigorista:\*\*\s*(.*)$/;

function classifyRigorista(rawValue) {
  const val = rawValue.trim();
  if (/^SI\b/i.test(val)) return 'principale';
  if (/^Vice/i.test(val)) return 'vice';
  return null; // "No" (con o senza note tra parentesi) => nessun rigorista
}

function parseGiocatoriMd(content) {
  const lines = content.split(/\r?\n/);
  let currentRole = null;
  let currentFascia = null;
  // groups: Map "ROLE|fascia" -> array di tuple giocatore, con ordine di inserimento
  const groupOrder = [];
  const groupMap = new Map();

  function ensureGroup(role, fascia) {
    const key = role + '|' + fascia;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
      groupOrder.push(key);
    }
    return groupMap.get(key);
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      const found = Object.keys(ROLE_MAP).find((k) => line.includes(k));
      currentRole = found ? ROLE_MAP[found] : null;
      currentFascia = null;
      continue;
    }

    if (line.startsWith('### ')) {
      const label = line.replace(/^###\s*/, '').replace(/\*\*/g, '').trim();
      currentFascia = FASCIA_MAP[label] || null;
      if (!currentFascia) {
        console.warn('Fascia non riconosciuta, ignorata: "' + label + '"');
      }
      continue;
    }

    if (line.startsWith('* ') && currentRole && currentFascia) {
      const m = line.match(PLAYER_LINE_RE);
      if (!m) {
        console.warn('Riga giocatore non riconosciuta, ignorata: ' + line);
        continue;
      }
      const [, name, team, mvRaw, bonus, malus, rigoristaRaw] = m;
      const mediaVoto = parseFloat(mvRaw);
      const rigorista = classifyRigorista(rigoristaRaw);
      const tuple = rigorista
        ? [name.trim(), team.trim(), mediaVoto, bonus.trim(), malus.trim(), rigorista]
        : [name.trim(), team.trim(), mediaVoto, bonus.trim(), malus.trim()];
      ensureGroup(currentRole, currentFascia).push(tuple);
    }
  }

  return groupOrder.map((key) => {
    const [role, fascia] = key.split('|');
    return { role, fascia, entries: groupMap.get(key) };
  });
}

function formatGroups(groups) {
  const lines = [];
  lines.push('const GROUPS = [');
  for (const { role, fascia, entries } of groups) {
    lines.push("  ['" + role + "', '" + fascia + "', [");
    for (const entry of entries) {
      lines.push('    ' + JSON.stringify(entry) + ',');
    }
    lines.push('  ]],');
  }
  lines.push('];');
  return lines.join('\n');
}

function buildDataJs(groups, overridesLines) {
  const groupsBlock = formatGroups(groups);
  const lines = [
    "// Dati giocatori per l'asta Fantasta 2026/27.",
    '//',
    '// FILE GENERATO AUTOMATICAMENTE da scripts/build-players.mjs a partire da',
    '// giocatori.md. Non modificare a mano la costante GROUPS: aggiorna',
    '// giocatori.md e rilancia "node scripts/build-players.mjs".',
    '//',
    '// Il campo "rigorista" e\' tri-stato: \'principale\' (rigorista designato),',
    "// 'vice' (vice rigorista) o assente/null (giocatori.md riporta \"No\").",
    '// Correzioni manuali "al volo" restano possibili dall\'interfaccia (icona',
    "// matita), salvate in localStorage, oppure tramite STATS_OVERRIDES qui sotto",
    '// (che sopravvive alla rigenerazione di questo file).',
    '',
    'const ROLE_LABELS = {',
    "  P: 'Portieri',",
    "  D: 'Difensori',",
    "  C: 'Centrocampisti',",
    "  A: 'Attaccanti',",
    '};',
    '',
    'const ROSTER_REQUIREMENTS = { P: 3, D: 8, C: 8, A: 6 };',
    '',
    'const FASCIA_LABELS = {',
    "  top: 'Top',",
    "  f1: 'Prima fascia',",
    "  f2: 'Seconda fascia',",
    "  f3: 'Terza fascia',",
    "  jolly: 'Jolly / Ultimi slot',",
    '};',
    '',
    "const FASCIA_ORDER = ['top', 'f1', 'f2', 'f3', 'jolly'];",
    '',
    '// Sorgente dati: role -> fascia -> elenco [nome, squadra, mediaVoto, bonus, malus, rigorista?].',
    groupsBlock,
    '',
    'function slugify(name) {',
    '  return name',
    '    .toLowerCase()',
    "    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')",
    "    .replace(/[^a-z0-9]+/g, '-')",
    "    .replace(/(^-|-$)/g, '');",
    '}',
    '',
    'function normalizeName(name) {',
    '  return name',
    '    .toLowerCase()',
    "    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')",
    "    .replace(/\\s+/g, ' ')",
    '    .trim();',
    '}',
    '',
    "// Override manuali facoltativi (chiave = nome esatto come in giocatori.md).",
    "// rigorista puo' essere: 'principale' | 'vice' | null/undefined (nessuno).",
    "// Questo blocco viene preservato automaticamente dallo script ad ogni",
    '// rigenerazione (letto dalla versione precedente di js/data.js, se presente).',
    ...overridesLines,
    '',
    'function buildPlayers() {',
    '  const idCount = new Map();',
    '  const list = [];',
    '  for (const [role, fascia, entries] of GROUPS) {',
    '    for (const entry of entries) {',
    '      const [name, team, mediaVoto, bonus, malus, rigorista] = entry;',
    "      const baseId = role.toLowerCase() + '-' + slugify(name);",
    '      const n = (idCount.get(baseId) || 0) + 1;',
    '      idCount.set(baseId, n);',
    "      const id = n > 1 ? baseId + '-' + n : baseId;",
    '      const override = STATS_OVERRIDES[name];',
    '      list.push({',
    '        id,',
    '        name,',
    '        team,',
    '        role,',
    '        fascia,',
    "        mediaVoto: override?.mediaVoto ?? mediaVoto ?? 'NA',",
    "        bonus: override?.bonus ?? bonus ?? 'NA',",
    "        malus: override?.malus ?? malus ?? 'NA',",
    '        rigorista: override?.rigorista ?? rigorista ?? null,',
    '      });',
    '    }',
    '  }',
    '  return list;',
    '}',
    '',
    'const PLAYERS = buildPlayers();',
    '',
    'function playersByRole(role) {',
    '  return PLAYERS.filter((p) => p.role === role);',
    '}',
    '',
    'function getPlayer(id) {',
    '  return PLAYERS.find((p) => p.id === id);',
    '}',
    '',
  ];
  return lines.join('\n');
}

// Estrae il blocco "const STATS_OVERRIDES = { ... };" dal js/data.js esistente,
// cosi' da preservarlo (con eventuali correzioni manuali gia' fatte) anche
// dopo una rigenerazione completa. Se il file non esiste o non contiene il
// blocco, viene usato un template vuoto.
function extractExistingOverridesLines(outputFile) {
  const fallback = [
    'const STATS_OVERRIDES = {',
    "  // 'Lautaro Martinez': { rigorista: 'principale' },",
    '};',
  ];
  if (!fs.existsSync(outputFile)) return fallback;
  const oldContent = fs.readFileSync(outputFile, 'utf8');
  const startMarker = 'const STATS_OVERRIDES = {';
  const startIdx = oldContent.indexOf(startMarker);
  if (startIdx === -1) return fallback;
  const afterStart = oldContent.slice(startIdx);
  const endMatch = afterStart.match(/\n};/);
  if (!endMatch) return fallback;
  const block = afterStart.slice(0, endMatch.index + endMatch[0].length);
  return block.split('\n');
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error('File non trovato: ' + INPUT_FILE);
    process.exit(1);
  }
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  const groups = parseGiocatoriMd(content);

  const totalPlayers = groups.reduce((sum, g) => sum + g.entries.length, 0);
  if (totalPlayers === 0) {
    console.error('Nessun giocatore estratto da giocatori.md: controlla il formato del file.');
    process.exit(1);
  }

  const overridesLines = extractExistingOverridesLines(OUTPUT_FILE);
  const output = buildDataJs(groups, overridesLines);
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

  console.log('OK: js/data.js rigenerato con ' + totalPlayers + ' giocatori in ' + groups.length + ' gruppi ruolo/fascia.');
  const principale = groups.reduce((s, g) => s + g.entries.filter((e) => e[5] === 'principale').length, 0);
  const vice = groups.reduce((s, g) => s + g.entries.filter((e) => e[5] === 'vice').length, 0);
  console.log('Rigoristi: ' + principale + ' principali, ' + vice + ' vice.');
}

main();
