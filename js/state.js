// Gestione stato applicazione + persistenza in localStorage.
// Un solo oggetto di stato salvato con una chiave, ricaricato ad ogni avvio.
// Usa ROSTER_REQUIREMENTS e ROLE_LABELS definiti in data.js (caricato prima di questo file).

const STORAGE_KEY = 'fantasta2627:v1';

const defaultState = () => ({
  version: 1,
  team: null, // { name, theme, logo, creditsTotal }
  creditsRemaining: 0,
  players: {}, // id -> { status: 'bought' | 'lost', credits: number }
  celebrated: false, // true dopo aver mostrato il popup di asta completata
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (err) {
    console.warn('Stato salvato non leggibile, reset.', err);
    return defaultState();
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getState() {
  return state;
}

function hasTeam() {
  return !!state.team;
}

function createTeam({ name, theme, logo, creditsTotal }) {
  state.team = { name, theme, logo, creditsTotal };
  state.creditsRemaining = creditsTotal;
  state.players = {};
  state.celebrated = false;
  persist();
}

// Aggiorna solo i dati "cosmetici" della squadra (nome, tema, logo),
// senza toccare crediti/giocatori gia' scelti.
function updateTeamInfo({ name, theme, logo }) {
  state.team = { ...state.team, name, theme, logo };
  persist();
}

function resetAll() {
  state = defaultState();
  persist();
}

function getPlayerStatus(id) {
  return state.players[id] || null; // null => disponibile
}

function buyPlayer(id, credits) {
  const role = id.split('-')[0].toUpperCase();
  if (rosterCountByRole(role) >= ROSTER_REQUIREMENTS[role]) {
    throw new Error('Hai gia\' selezionato tutti i giocatori richiesti per questo ruolo (' + ROSTER_REQUIREMENTS[role] + ').');
  }
  if (!Number.isInteger(credits) || credits <= 0) {
    throw new Error('Inserisci un numero di crediti valido (intero positivo).');
  }
  if (credits > state.creditsRemaining) {
    throw new Error('Crediti insufficienti: hai a disposizione solo ' + state.creditsRemaining + '.');
  }
  state.players[id] = { status: 'bought', credits };
  state.creditsRemaining -= credits;
  persist();
}

function markLost(id, credits) {
  if (!Number.isInteger(credits) || credits <= 0) {
    throw new Error('Inserisci un numero di crediti valido (intero positivo).');
  }
  state.players[id] = { status: 'lost', credits };
  persist();
}

function updatePlayerStats(playerId, patch) {
  state.statsPatches = state.statsPatches || {};
  state.statsPatches[playerId] = { ...(state.statsPatches[playerId] || {}), ...patch };
  persist();
}

function getStatsPatch(playerId) {
  return (state.statsPatches || {})[playerId] || null;
}

function rosterCountByRole(role) {
  return Object.entries(state.players).filter(
    ([id, info]) => info.status === 'bought' && id.startsWith(role.toLowerCase() + '-')
  ).length;
}

function boughtPlayersByRole(role) {
  return Object.entries(state.players)
    .filter(([id, info]) => info.status === 'bought' && id.startsWith(role.toLowerCase() + '-'))
    .map(([id, info]) => ({ id, ...info }));
}

function isRoleComplete(role) {
  return rosterCountByRole(role) >= ROSTER_REQUIREMENTS[role];
}

function isAuctionComplete() {
  return Object.keys(ROLE_LABELS).every((role) => isRoleComplete(role));
}

function markCelebrated() {
  state.celebrated = true;
  persist();
}

function wasCelebrated() {
  return !!state.celebrated;
}
