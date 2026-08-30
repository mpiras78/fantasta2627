# Fantasta2627

App web (mobile-friendly) per gestire l'asta del fantacalcio 2026/27: creazione squadra (nome,
tema colore, logo, immagine, crediti), asta per ruolo con elenco giocatori diviso per fascia,
gestione Buy/Lost con crediti, riepilogo rosa/crediti sempre visibile e celebrazione finale a
rosa completa (3 portieri, 8 difensori, 8 centrocampisti, 6 attaccanti).

Nessun framework, nessuna build: solo HTML/CSS/JS con moduli ES e persistenza in
`localStorage` del browser (funziona su un solo dispositivo per volta).

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
  rigorista), generato a mano a partire da `giocatori.md`.
- `js/state.js` — stato applicazione e persistenza in `localStorage`.
- `js/main.js` — routing, rendering delle viste e logica dell'asta (Buy/Lost/Close).
- `giocatori.md` — fonte dati originale dei giocatori (di riferimento, non letta a runtime).

## Aggiornare l'elenco giocatori

Al momento non esiste una pipeline automatica che legge `giocatori.md` e rigenera
`js/data.js`: quando `giocatori.md` viene aggiornato, occorre modificare manualmente la
costante `GROUPS` in `js/data.js` seguendo lo stesso formato
`[nome, squadra, mediaVoto, bonus, malus, rigorista?]` (l'ultimo campo è opzionale:
`'principale'`, `'vice'` oppure omesso se non rigorista).

In alternativa, dall'interfaccia di ogni giocatore è disponibile un'icona ✏️ per correggere a
mano media voto, bonus, malus e rigorista senza toccare il codice (utile per correzioni
puntuali durante l'asta).

