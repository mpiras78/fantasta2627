// Elenco seriali validi per l'attivazione dell'app (schermata richiesta al primo avvio).
//
// IMPORTANTE: questo file deve restare sincronizzato con `sn/list.txt`, che e' la lista
// "leggibile" tenuta nel repository. Il browser non legge `sn/list.txt` a runtime (stesso
// motivo per cui `js/data.js` e' generato da `giocatori.md`): i seriali vanno quindi copiati
// qui manualmente ogni volta che `sn/list.txt` cambia.
const VALID_SERIALS = [
  '7K2Q-9XZP-4LMN-6VBT',
  'A1C3-E5G7-J9L2-N4P6',
  'Q8W3-E5R7-T2Y4-U6I1',
  'Z9X8-C7V6-B5N4-M3K2',
  'H4J6-K8L2-P4Q6-R8S2',
  '3F5G-7H9J-1K3L-5M7N',
  'D2F4-G6H8-J1K3-L5M7',
  '8T6R-4E2W-9Q7A-5S3D',
  'V1B3-N5M7-X9Z2-C4V6',
  '2P4Q-6R8S-1T3U-5W7Y',
];

// Normalizza un seriale per il confronto: maiuscolo, senza spazi/trattini,
// cosi' l'utente puo' digitarlo con o senza separatori.
function normalizeSerial(value) {
  return String(value || '').toUpperCase().replace(/[\s-]/g, '');
}

const NORMALIZED_VALID_SERIALS = VALID_SERIALS.map(normalizeSerial);

function isValidSerial(value) {
  const normalized = normalizeSerial(value);
  return normalized.length > 0 && NORMALIZED_VALID_SERIALS.includes(normalized);
}
