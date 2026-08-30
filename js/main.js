// Logica applicazione: routing (hash-based), rendering viste, modal Buy/Lost,
// celebrazione finale. Nessun framework: DOM diretto.
// Usa costanti/funzioni di data.js e state.js (caricati prima di questo file
// tramite <script> classici, senza moduli ES: nessun problema CORS/file://).

const THEMES = [
  { id: 'nero-blu', label: 'Nero / Blu' },
  { id: 'giallo-rosso', label: 'Giallo / Rosso' },
  { id: 'bianco-nero', label: 'Bianco / Nero' },
  { id: 'blu-rosso', label: 'Blu / Rosso' },
  { id: 'rosso-nero', label: 'Rosso / Nero' },
  { id: 'azzurro', label: 'Azzurro' },
];

const LOGOS = ['🛡️', '🦁', '🐺', '🦅', '⭐', '🔥', '👑', '🐉', '⚔️', '🐎'];

const app = document.getElementById('app');

let setupChoice = { theme: THEMES[0].id, logo: LOGOS[0] };

function applyTheme() {
  const team = getState().team;
  document.body.dataset.theme = team ? team.theme : THEMES[0].id;
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// ---------- Routing ----------
function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (!hash) return { view: 'home' };
  const parts = hash.split('/');
  if (parts[0] === 'ruolo' && parts[1]) return { view: 'ruolo', role: parts[1].toUpperCase() };
  return { view: 'home' };
}

function navigate(hash) {
  location.hash = hash;
}

function render() {
  applyTheme();
  if (!hasTeam()) {
    renderSetup();
    return;
  }
  const route = currentRoute();
  if (route.view === 'ruolo' && ROLE_LABELS[route.role]) {
    renderRole(route.role);
  } else {
    renderHome();
  }
}

window.addEventListener('hashchange', render);

// ---------- Setup view ----------
function renderSetup() {
  document.body.dataset.theme = setupChoice.theme;
  app.innerHTML = `
    <div class="setup-card">
      <h2>Crea la tua squadra</h2>
      <div class="field">
        <label for="team-name">Nome squadra</label>
        <input type="text" id="team-name" maxlength="30" placeholder="Es. Fanta Leoni FC" />
      </div>
      <div class="field">
        <label>Colori squadra</label>
        <div class="swatch-grid" id="theme-grid"></div>
      </div>
      <div class="field">
        <label>Logo</label>
        <div class="picker-grid" id="logo-grid"></div>
      </div>
      <div class="field">
        <label for="credits-total">Crediti disponibili</label>
        <input type="number" id="credits-total" min="1" step="1" value="500" />
      </div>
      <div id="setup-error" class="error-text hidden"></div>
      <button class="btn-primary" id="setup-submit">Crea squadra</button>
    </div>
  `;

  const themeGrid = document.getElementById('theme-grid');
  THEMES.forEach((t) => {
    const el = document.createElement('div');
    el.className = 'swatch' + (setupChoice.theme === t.id ? ' selected' : '');
    el.dataset.theme = t.id;
    el.title = t.label;
    el.addEventListener('click', () => {
      setupChoice.theme = t.id;
      document.body.dataset.theme = t.id;
      renderSetup();
    });
    themeGrid.appendChild(el);
  });

  const logoGrid = document.getElementById('logo-grid');
  LOGOS.forEach((emoji) => {
    const el = document.createElement('div');
    el.className = 'picker-item' + (setupChoice.logo === emoji ? ' selected' : '');
    el.textContent = emoji;
    el.addEventListener('click', () => {
      setupChoice.logo = emoji;
      renderSetup();
    });
    logoGrid.appendChild(el);
  });

  // ripristina eventuali valori gia' inseriti (nome/crediti) dopo un re-render
  document.getElementById('setup-submit').addEventListener('click', () => {
    const name = document.getElementById('team-name').value.trim();
    const creditsTotal = parseInt(document.getElementById('credits-total').value, 10);
    const errorBox = document.getElementById('setup-error');
    if (!name) {
      errorBox.textContent = 'Inserisci il nome della squadra.';
      errorBox.classList.remove('hidden');
      return;
    }
    if (!Number.isInteger(creditsTotal) || creditsTotal <= 0) {
      errorBox.textContent = 'Inserisci un numero di crediti valido.';
      errorBox.classList.remove('hidden');
      return;
    }
    createTeam({
      name,
      theme: setupChoice.theme,
      logo: setupChoice.logo,
      creditsTotal,
    });
    navigate('#/home');
    render();
  });
}

// ---------- Home view ----------
function headerHtml(showBack, backHash) {
  const team = getState().team;
  return `
    <div class="team-header">
      ${showBack ? `<button class="back-btn" id="back-btn">← Squadra</button>` : `<span class="emoji-badge">${team.logo}</span>`}
      <div class="team-meta">
        <h1>${esc(team.name)}</h1>
        <div class="credits">Crediti: ${getState().creditsRemaining} / ${team.creditsTotal}</div>
      </div>
      ${!showBack ? `<button class="settings-btn" id="settings-btn" title="Modifica squadra">⚙️</button>` : ''}
    </div>
  `;
}

function renderHome() {
  const state = getState();
  const complete = isAuctionComplete();

  const roleCards = Object.keys(ROLE_LABELS).map((role) => {
    const count = rosterCountByRole(role);
    const required = ROSTER_REQUIREMENTS[role];
    const roster = boughtPlayersByRole(role)
      .map((r) => {
        const p = getPlayer(r.id);
        return `<li><span>${esc(p ? p.name : r.id)}</span><span class="credits">${r.credits}</span></li>`;
      })
      .join('');
    const done = count >= required;
    return `
      <div class="role-card">
        <h3>${ROLE_LABELS[role]} ${done ? '✅' : ''}</h3>
        <div class="role-progress">${count} / ${required} acquistati</div>
        <ul class="role-roster">${roster || '<li class="empty-hint" style="padding:4px 0">Nessun giocatore</li>'}</ul>
        <button class="btn-start" data-role="${role}">${done ? 'Vedi Elenco' : (count > 0 ? 'Continua asta' : "Inizia l'asta")}</button>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    ${headerHtml(false)}
    <div class="role-grid">${roleCards}</div>
  `;

  app.querySelectorAll('.btn-start').forEach((btn) => {
    btn.addEventListener('click', () => navigate(`#/ruolo/${btn.dataset.role}`));
  });

  document.getElementById('settings-btn').addEventListener('click', openTeamSettings);

  if (complete && !wasCelebrated()) {
    markCelebrated();
    showCelebration();
  }
}

// ---------- Modifica dati squadra (nome, colori, icone) ----------
function openTeamSettings() {
  const team = getState().team;
  const choice = { name: team.name, theme: team.theme, logo: team.logo };
  let mode = 'edit'; // 'edit' | 'confirm-reset'

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);

  function renderContent() {
    if (mode === 'confirm-reset') {
      overlay.innerHTML = `
        <div class="modal-box" style="max-width:360px;">
          <h3>⚠️ Reset totale</h3>
          <p style="font-size:.95rem;color:#444;">
            Questa azione cancellera' <strong>definitivamente</strong> squadra, tema, crediti
            e tutti i giocatori acquistati o persi finora. Non si puo' annullare. Vuoi
            continuare?
          </p>
          <div class="modal-actions">
            <button class="btn-lost" id="confirm-reset-yes">Si, cancella tutto</button>
            <button class="btn-close" id="confirm-reset-no">Annulla</button>
          </div>
        </div>
      `;
      overlay.querySelector('#confirm-reset-yes').addEventListener('click', () => {
        resetAll();
        overlay.remove();
        location.hash = '';
        render();
      });
      overlay.querySelector('#confirm-reset-no').addEventListener('click', () => {
        mode = 'edit';
        renderContent();
      });
      return;
    }

    overlay.innerHTML = `
      <div class="modal-box" style="text-align:left;max-width:400px;">
        <h3 style="text-align:center;">Modifica squadra</h3>
        <div class="field">
          <label for="settings-name">Nome squadra</label>
          <input type="text" id="settings-name" maxlength="30" value="${esc(choice.name)}" />
        </div>
        <div class="field">
          <label>Colori squadra</label>
          <div class="swatch-grid" id="settings-theme-grid"></div>
        </div>
        <div class="field">
          <label>Logo</label>
          <div class="picker-grid" id="settings-logo-grid"></div>
        </div>
        <div id="settings-error" class="error-text hidden"></div>
        <div class="modal-actions">
          <button class="btn-buy" id="settings-save">Salva</button>
          <button class="btn-close" id="settings-close">Annulla</button>
        </div>
        <div class="danger-zone">
          <button class="btn-danger" id="settings-reset">Reset</button>
          <div class="danger-hint">Cancella squadra, crediti e rosa in modo permanente</div>
        </div>
      </div>
    `;

    const themeGrid = overlay.querySelector('#settings-theme-grid');
    THEMES.forEach((t) => {
      const el = document.createElement('div');
      el.className = 'swatch' + (choice.theme === t.id ? ' selected' : '');
      el.dataset.theme = t.id;
      el.title = t.label;
      el.addEventListener('click', () => {
        choice.theme = t.id;
        document.body.dataset.theme = t.id;
        renderContent();
      });
      themeGrid.appendChild(el);
    });

    const logoGrid = overlay.querySelector('#settings-logo-grid');
    LOGOS.forEach((emoji) => {
      const el = document.createElement('div');
      el.className = 'picker-item' + (choice.logo === emoji ? ' selected' : '');
      el.textContent = emoji;
      el.addEventListener('click', () => {
        choice.logo = emoji;
        renderContent();
      });
      logoGrid.appendChild(el);
    });

    overlay.querySelector('#settings-name').addEventListener('input', (e) => {
      choice.name = e.target.value;
    });

    overlay.querySelector('#settings-save').addEventListener('click', () => {
      const name = overlay.querySelector('#settings-name').value.trim();
      const errorBox = overlay.querySelector('#settings-error');
      if (!name) {
        errorBox.textContent = 'Inserisci il nome della squadra.';
        errorBox.classList.remove('hidden');
        return;
      }
      updateTeamInfo({ name, theme: choice.theme, logo: choice.logo });
      overlay.remove();
      applyTheme();
      render();
    });
    overlay.querySelector('#settings-close').addEventListener('click', () => {
      applyTheme(); // ripristina il tema salvato, annullando eventuali anteprime
      overlay.remove();
    });
    overlay.querySelector('#settings-reset').addEventListener('click', () => {
      mode = 'confirm-reset';
      renderContent();
    });
  }

  renderContent();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && mode === 'edit') {
      applyTheme();
      overlay.remove();
    }
  });
}

// ---------- Role view ----------
function renderRole(role) {
  const players = playersByRole(role);
  const count = rosterCountByRole(role);
  const required = ROSTER_REQUIREMENTS[role];
  const roleComplete = count >= required;

  const sections = FASCIA_ORDER.map((fascia) => {
    const group = players.filter((p) => p.fascia === fascia);
    if (!group.length) return '';
    const rows = group.map((p) => playerRowHtml(p, roleComplete)).join('');
    return `
      <div class="fascia-section">
        <div class="fascia-title">${FASCIA_LABELS[fascia]}</div>
        ${rows}
      </div>
    `;
  }).join('');

  app.innerHTML = `
    ${headerHtml(true)}
    <div class="role-count-banner">
      <span>${ROLE_LABELS[role]}</span>
      <span class="role-count ${roleComplete ? 'complete' : ''}">${count} / ${required}</span>
    </div>
    ${sections}
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate('#/home'));

  app.querySelectorAll('button.select-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });
  app.querySelectorAll('.edit-stats-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStatsEditor(btn.dataset.id);
    });
  });
}

function effectiveStats(p) {
  const patch = getStatsPatch(p.id);
  return { ...p, ...(patch || {}) };
}

function playerRowHtml(rawPlayer, roleComplete) {
  const p = effectiveStats(rawPlayer);
  const status = getPlayerStatus(p.id);
  const rigoristaBadge = p.rigorista
    ? `<span class="rigorista-badge" title="${p.rigorista === 'principale' ? 'Rigorista principale' : 'Vice rigorista'}">${p.rigorista === 'principale' ? 'R' : 'r'}</span>`
    : '';

  let rowClass = 'player-row';
  let creditTag = '';
  let clickable = true;
  if (status?.status === 'bought') {
    rowClass += ' bought';
    creditTag = `<span class="credit-tag">${status.credits}</span>`;
    clickable = false;
  } else if (status?.status === 'lost') {
    rowClass += ' lost';
    creditTag = `<span class="credit-tag">${status.credits}</span>`;
    clickable = false;
  } else if (roleComplete) {
    // ruolo gia' completo: i giocatori ancora disponibili non sono piu' acquistabili
    rowClass += ' role-full';
    clickable = false;
  }

  const inner = `
    <span class="name">${esc(p.name)}${p.team ? ` <small style="opacity:.6">(${esc(p.team)})</small>` : ''}</span>
    <span class="stat" title="Media voto">${p.mediaVoto}</span>
    <span class="stat" title="Bonus">${esc(p.bonus)}</span>
    <span class="stat" title="Malus">${esc(p.malus)}</span>
    ${rigoristaBadge}
  `;

  return `
    <div class="${rowClass}">
      ${clickable
        ? `<button type="button" class="select-btn" data-id="${p.id}">${inner}</button>`
        : `<div class="select-btn" style="display:flex;align-items:center;gap:8px;flex:1;">${inner}</div>`}
      ${creditTag}
      <button type="button" class="edit-stats-btn" data-id="${p.id}" title="Modifica statistiche">✏️</button>
    </div>
  `;
}

// ---------- Modal Buy/Lost/Close ----------
function openModal(playerId) {
  const p = getPlayer(playerId);
  if (!p) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>${esc(p.name)}</h3>
      <div style="font-size:.85rem;color:#666;">Crediti residui: ${getState().creditsRemaining}</div>
      <input type="number" id="modal-credits" min="1" step="1" placeholder="Crediti" />
      <div id="modal-error" class="error-text hidden"></div>
      <div class="modal-actions">
        <button class="btn-buy" id="modal-buy">Buy</button>
        <button class="btn-lost" id="modal-lost">Lost</button>
        <button class="btn-close" id="modal-close">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const errorBox = overlay.querySelector('#modal-error');
  const input = overlay.querySelector('#modal-credits');

  function readCredits() {
    const val = parseInt(input.value, 10);
    if (!Number.isInteger(val) || val <= 0) {
      errorBox.textContent = 'Inserisci un numero di crediti valido (intero positivo).';
      errorBox.classList.remove('hidden');
      return null;
    }
    return val;
  }

  overlay.querySelector('#modal-buy').addEventListener('click', () => {
    const credits = readCredits();
    if (credits === null) return;
    try {
      buyPlayer(playerId, credits);
      overlay.remove();
      renderRole(p.role);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.remove('hidden');
    }
  });

  overlay.querySelector('#modal-lost').addEventListener('click', () => {
    const credits = readCredits();
    if (credits === null) return;
    markLost(playerId, credits);
    overlay.remove();
    renderRole(p.role);
  });

  overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ---------- Editor statistiche manuale ----------
function openStatsEditor(playerId) {
  const p = getPlayer(playerId);
  if (!p) return;
  const current = effectiveStats(p);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Modifica statistiche</h3>
      <div style="font-weight:600;margin-bottom:6px;">${esc(p.name)}</div>
      <div class="stats-edit-box">
        <div><label>Media voto</label><input type="text" id="edit-mv" value="${esc(current.mediaVoto)}" /></div>
        <div><label>Bonus</label><input type="text" id="edit-bonus" value="${esc(current.bonus)}" /></div>
        <div><label>Malus</label><input type="text" id="edit-malus" value="${esc(current.malus)}" /></div>
      </div>
      <div class="field" style="text-align:left;">
        <label for="edit-rigorista">Rigorista</label>
        <select id="edit-rigorista" style="width:100%;padding:8px;border-radius:8px;">
          <option value="">Nessuno</option>
          <option value="principale" ${current.rigorista === 'principale' ? 'selected' : ''}>Principale</option>
          <option value="vice" ${current.rigorista === 'vice' ? 'selected' : ''}>Vice</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn-buy" id="stats-save">Salva</button>
        <button class="btn-close" id="stats-close">Annulla</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#stats-save').addEventListener('click', () => {
    const mediaVoto = overlay.querySelector('#edit-mv').value.trim();
    const bonus = overlay.querySelector('#edit-bonus').value.trim();
    const malus = overlay.querySelector('#edit-malus').value.trim();
    const rigorista = overlay.querySelector('#edit-rigorista').value || null;
    updatePlayerStats(playerId, { mediaVoto, bonus, malus, rigorista });
    overlay.remove();
    renderRole(p.role);
  });
  overlay.querySelector('#stats-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ---------- Celebrazione finale ----------
function showCelebration() {
  const overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.innerHTML = `
    <div class="celebration-box">
      <h2>🎉 Asta completata! 🎉</h2>
      <p>Complimenti, hai costruito la tua rosa completa. Ora tocca al campo!</p>
      <button class="btn-primary" id="celebration-close">Evviva!</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const colors = ['#f2b134', '#e63946', '#2e9e4d', '#3d6fd1', '#f1faee', '#ff70a6'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    overlay.appendChild(piece);
  }

  overlay.querySelector('#celebration-close').addEventListener('click', () => overlay.remove());
}

render();
