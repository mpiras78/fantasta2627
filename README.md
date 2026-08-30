# Fantasta2627

App web (mobile-friendly) per gestire l'asta del fantacalcio 2026/27: creazione squadra (nome,
tema colore, logo, crediti), asta per ruolo con elenco giocatori diviso per fascia,
gestione Buy/Lost con crediti, riepilogo rosa/crediti sempre visibile e celebrazione finale a
rosa completa (3 portieri, 8 difensori, 8 centrocampisti, 6 attaccanti).

Nessun framework, nessuna build: solo HTML/CSS/JS con script classici (nessun modulo ES) e
persistenza in `localStorage` del browser (funziona su un solo dispositivo per volta).

## Come aprirla

L'app è fatta con script JS classici (nessun modulo ES), quindi funziona **subito** anche
aprendo `index.html` con un doppio click dal file system (`file://`), senza bisogno di
Python, Node o altri strumenti.

Per pubblicarla e usarla da smartphone/tablet basta **GitHub Pages**:
1. Crea un repository su GitHub e carica tutti i file (`index.html`, `css/`, `js/`, ecc.).
2. Vai su Settings → Pages del repository, seleziona il branch (es. `main`) e la cartella
   root (`/`).
3. GitHub pubblicherà il sito su un indirizzo tipo
   `https://<utente>.github.io/<repo>/`, apribile da qualsiasi smartphone/tablet con
   connessione internet.

## Struttura

- `index.html` — entry point della pagina (carica in ordine `js/data.js`, `js/state.js`,
  `js/main.js` come script classici).
- `css/style.css` — stili e temi colore squadra.
- `js/data.js` — elenco giocatori (ruolo, fascia, squadra, media voto, bonus, malus,
  rigorista), generato da `scripts/build-players.mjs` a partire da `giocatori.md`.
- `js/state.js` — stato applicazione e persistenza in `localStorage`.
- `js/main.js` — routing, rendering delle viste e logica dell'asta (Buy/Lost/Close).
- `giocatori.md` — fonte dati originale dei giocatori (di riferimento, non letta a runtime).
- `scripts/build-players.mjs` — script Node per rigenerare `js/data.js` a partire da
  `giocatori.md` (vedi sezione sotto).

## Aggiornare l'elenco giocatori

Quando `giocatori.md` viene aggiornato, rigenera `js/data.js` con lo script incluso
(richiede [Node.js](https://nodejs.org/) installato sul computer — serve solo per questo,
non per usare l'app):

```
node scripts/build-players.mjs
```

Lo script legge `giocatori.md`, estrae per ogni giocatore ruolo, fascia, squadra, media
voto, bonus, malus e status rigorista, e riscrive `js/data.js` mantenendone intatta la
struttura (nessuna build necessaria per l'app: il file resta un normale script JS letto
direttamente dal browser). Eventuali correzioni manuali già presenti in `STATS_OVERRIDES`
vengono preservate automaticamente ad ogni rigenerazione.

In alternativa, dall'interfaccia di ogni giocatore è disponibile un'icona ✏️ per correggere a
mano media voto, bonus, malus e rigorista senza toccare il codice (utile per correzioni
puntuali durante l'asta, salvate solo in locale nel browser).

