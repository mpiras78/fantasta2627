// Dati giocatori per l'asta Fantasta 2026/27.
//
// Nomi, ruoli, fasce, squadra, Media Voto (MV), Bonus, Malus e Status
// Rigorista (stagione 2025/26) sono presi da giocatori.md. Il campo
// "rigorista" e' tri-stato: 'principale' (rigorista designato, incl. varianti
// "Primo Rigorista" / "Co-Rigorista" / "Specialista"), 'vice' (vice
// rigorista, incl. "in caso d'emergenza") o null (giocatori.md riporta "No").
// Correggibile a mano dall'interfaccia (icona matita sulla riga del
// giocatore) oppure tramite STATS_OVERRIDES qui sotto.

const ROLE_LABELS = {
  P: 'Portieri',
  D: 'Difensori',
  C: 'Centrocampisti',
  A: 'Attaccanti',
};

const ROSTER_REQUIREMENTS = { P: 3, D: 8, C: 8, A: 6 };

const FASCIA_LABELS = {
  top: 'Top',
  f1: 'Prima fascia',
  f2: 'Seconda fascia',
  f3: 'Terza fascia',
  jolly: 'Jolly / Ultimi slot',
};

const FASCIA_ORDER = ['top', 'f1', 'f2', 'f3', 'jolly'];

// Sorgente dati: role -> fascia -> elenco [nome, squadra, mediaVoto, bonus, malus].
// "bonus" e "malus" restano testo descrittivo (come in giocatori.md), per non
// perdere dettaglio (es. "10 Clean Sheet, 1 Rigore Parato").
const GROUPS = [
  ['P', 'top', [
    ['Butez', 'Como', 6.15, '10 Clean Sheet, 1 Rigore Parato', '-38 Gol Subiti, 2 Ammonizioni'],
    ['Maignan', 'Milan', 6.28, '14 Clean Sheet, 2 Rigori Parati', '-32 Gol Subiti, 1 Ammonizione'],
    ['Martinez', 'Inter', 6.20, '8 Clean Sheet', '-14 Gol Subiti, 1 Ammonizione'],
    ['Svilar', 'Roma', 6.35, '12 Clean Sheet, 2 Rigori Parati', '-36 Gol Subiti, 3 Ammonizioni'],
  ]],
  ['P', 'f1', [
    ['Carnesecchi', 'Atalanta', 6.30, '13 Clean Sheet, 2 Rigori Parati', '-33 Gol Subiti, 2 Ammonizioni'],
    ['De Gea', 'Fiorentina', 6.20, '11 Clean Sheet, 1 Rigore Parato', '-37 Gol Subiti, 2 Ammonizioni'],
    ['Mandas', 'Lazio', 6.10, '4 Clean Sheet', '-12 Gol Subiti, 1 Ammonizione'],
    ['Meret', 'Napoli', 6.25, '16 Clean Sheet, 1 Rigore Parato', '-26 Gol Subiti, 0 Ammonizioni'],
    ['Vicario', 'Tottenham / Mercato', 6.18, '9 Clean Sheet', '-41 Gol Subiti, 2 Ammonizioni'],
  ]],
  ['P', 'f2', [
    ['Caprile', 'Napoli', 6.10, '3 Clean Sheet', '-6 Gol Subiti, 0 Ammonizioni'],
    ['Falcone', 'Lecce', 6.35, '8 Clean Sheet, 3 Rigori Parati', '-52 Gol Subiti, 4 Ammonizioni'],
    ['Muric', 'Sassuolo', 6.05, '7 Clean Sheet', '-46 Gol Subiti, 3 Ammonizioni'],
    ['Okoye', 'Udinese', 6.12, '9 Clean Sheet, 1 Rigore Parato', '-44 Gol Subiti, 2 Ammonizioni'],
    ['Skorupski', 'Bologna', 6.15, '10 Clean Sheet', '-38 Gol Subiti, 2 Ammonizioni'],
  ]],
  ['P', 'f3', [
    ['Bijlow', 'Genoa', 6.08, '6 Clean Sheet', '-35 Gol Subiti, 1 Ammonizione'],
    ['Palmisani', 'Frosinone/Prestito', 5.95, '2 Clean Sheet', '-18 Gol Subiti, 1 Ammonizione'],
    ['Perri', 'Lazio', 6.00, '3 Clean Sheet', '-11 Gol Subiti, 1 Ammonizione'],
    ['Stankovic', 'Venezia', 6.10, '5 Clean Sheet, 1 Rigore Parato', '-48 Gol Subiti, 3 Ammonizioni'],
    ['Thiam', 'Empoli', 6.02, '4 Clean Sheet', '-39 Gol Subiti, 2 Ammonizioni'],
  ]],
  ['P', 'jolly', [
    ['Corvi', 'Parma', 6.00, '1 Clean Sheet', '-4 Gol Subiti, 0 Ammonizioni'],
    ['Daffara', 'Juventus', 6.00, '1 Clean Sheet', '-2 Gol Subiti, 0 Ammonizioni'],
    ['Desplanches', 'Palermo', 6.05, '3 Clean Sheet', '-15 Gol Subiti, 1 Ammonizione'],
    ['Milinkovic-Savic', 'Torino', 6.18, '11 Clean Sheet, 1 Rigore Parato', '-39 Gol Subiti, 3 Ammonizioni'],
    ['Motta', 'Lazio', 5.90, '0 Clean Sheet', '-5 Gol Subiti, 0 Ammonizioni'],
    ['Provedel', 'Lazio', 6.22, '10 Clean Sheet', '-28 Gol Subiti, 1 Ammonizione'],
    ['Turati', 'Monza', 6.10, '7 Clean Sheet, 1 Rigore Parato', '-49 Gol Subiti, 2 Ammonizioni'],
  ]],

  ['D', 'top', [
    ['Bisseck', 'Inter', 6.30, '4 Gol, 2 Assist', '3 Ammonizioni'],
    ['Bremer', 'Juventus', 6.40, '3 Gol, 1 Assist', '4 Ammonizioni'],
    ['Dimarco', 'Inter', 6.45, '5 Gol, 8 Assist', '2 Ammonizioni'],
    ['Mancini', 'Roma', 6.25, '3 Gol, 2 Assist', '9 Ammonizioni, 1 Espulsione'],
    ['Wesley', 'Roma', 6.20, '2 Gol, 4 Assist', '5 Ammonizioni'],
  ]],
  ['D', 'f1', [
    ['Akanji', 'Inter', 6.30, '2 Gol, 1 Assist', '2 Ammonizioni'],
    ['Bastoni', 'Inter', 6.38, '1 Gol, 5 Assist', '4 Ammonizioni'],
    ['Cambiaso', 'Juventus', 6.20, '2 Gol, 4 Assist', '3 Ammonizioni'],
    ['Chalobah', 'Milan', 6.15, '2 Gol, 0 Assist', '4 Ammonizioni'],
    ['Di Lorenzo', 'Napoli', 6.25, '3 Gol, 4 Assist', '3 Ammonizioni'],
    ['Kalulu', 'Juventus', 6.18, '1 Gol, 2 Assist', '3 Ammonizioni'],
    ['Molina', 'Atalanta', 6.15, '2 Gol, 3 Assist', '4 Ammonizioni'],
    ['Ndicka', 'Roma', 6.20, '2 Gol, 1 Assist', '6 Ammonizioni'],
    ['Pavlovic', 'Milan', 6.18, '5 Gol, 1 Assist', '8 Ammonizioni, 1 Espulsione'],
    ['Ostigard', 'Genoa', 6.10, '3 Gol, 0 Assist', '7 Ammonizioni'],
    ['Kempf', 'Como', 6.25, '2 Gol, 1 Assist', '4 Ammonizioni'],
    ['Ramon', 'Espanyol/Mercato', 6.05, '1 Gol, 1 Assist', '5 Ammonizioni'],
    ['Rrahmani', 'Napoli', 6.35, '2 Gol, 1 Assist', '2 Ammonizioni'],
    ['Scalvini', 'Atalanta', 6.22, '2 Gol, 1 Assist', '3 Ammonizioni'],
    ['Solet', 'Udinese', 6.15, '1 Gol, 2 Assist', '5 Ammonizioni'],
    ['Spence', 'Genoa', 6.08, '1 Gol, 3 Assist', '4 Ammonizioni'],
    ['Spinazzola', 'Napoli', 6.12, '1 Gol, 4 Assist', '2 Ammonizioni'],
    ['Yan Couto', 'Como', 6.10, '1 Gol, 5 Assist', '4 Ammonizioni'],
  ]],
  ['D', 'f2', [
    ['Buongiorno', 'Napoli', 6.32, '1 Gol, 1 Assist', '5 Ammonizioni'],
    ['Dodò', 'Fiorentina', 6.15, '0 Gol, 5 Assist', '3 Ammonizioni'],
    ['Gila', 'Lazio', 6.18, '1 Gol, 0 Assist', '6 Ammonizioni'],
    ['Haps', 'Venezia', 5.95, '1 Gol, 2 Assist', '5 Ammonizioni'],
    ['Hermoso', 'Roma', 6.10, '1 Gol, 1 Assist', '5 Ammonizioni, 1 Espulsione'],
    ['Hien', 'Atalanta', 6.20, '0 Gol, 1 Assist', '8 Ammonizioni'],
    ['Idzes', 'Sassuolo', 6.10, '1 Gol, 0 Assist', '3 Ammonizioni'],
    ['Kristensen', 'Eintracht/Mercato', 6.05, '1 Gol, 2 Assist', '4 Ammonizioni'],
    ['Lucumi', 'Bologna', 6.12, '0 Gol, 1 Assist', '6 Ammonizioni'],
    ['Mina', 'Cagliari', 6.15, '2 Gol, 0 Assist', '10 Ammonizioni, 1 Espulsione', 'vice'],
    ['Miranda', 'Bologna', 6.08, '1 Gol, 3 Assist', '4 Ammonizioni'],
    ['Norton-Cuffy', 'Genoa', 6.00, '1 Gol, 2 Assist', '3 Ammonizioni'],
    ['Tiago Gabriel', 'Lecce', 6.02, '0 Gol, 1 Assist', '3 Ammonizioni'],
  ]],
  ['D', 'f3', [
    ['Ahanor', 'Atalanta', 6.05, '0 Gol, 1 Assist', '1 Ammonizione'],
    ['Bellanova', 'Atalanta', 6.12, '1 Gol, 4 Assist', '4 Ammonizioni'],
    ['Bernasconi', 'Atalanta', 6.00, '0 Gol, 1 Assist', '2 Ammonizioni'],
    ['Celik', 'Roma', 5.98, '0 Gol, 2 Assist', '4 Ammonizioni'],
    ['Coco', 'Torino', 6.08, '2 Gol, 0 Assist', '7 Ammonizioni'],
    ['Comuzzo', 'Fiorentina', 6.15, '0 Gol, 0 Assist', '5 Ammonizioni'],
    ['Delprato', 'Parma', 6.05, '2 Gol, 1 Assist', '4 Ammonizioni'],
    ['Doekhi', 'Union Berlino/Mercato', 6.10, '2 Gol, 0 Assist', '3 Ammonizioni'],
    ['Dragusin', 'Tottenham/Mercato', 6.08, '1 Gol, 0 Assist', '3 Ammonizioni'],
    ['Gabbia', 'Milan', 6.15, '2 Gol, 0 Assist', '3 Ammonizioni'],
    ['Heggem', 'Bologna', 5.79, '0 Gol, 0 Assist', '4 Ammonizioni'],
    ['Holm', 'Bologna', 6.00, '1 Gol, 2 Assist', '5 Ammonizioni'],
    ['Jimenez', 'Milan', 5.95, '0 Gol, 1 Assist', '3 Ammonizioni'],
    ['Kabasele', 'Udinese', 5.98, '1 Gol, 0 Assist', '5 Ammonizioni'],
    ['Kaiki', 'Cruzeiro/Mercato', 5.90, '0 Gol, 1 Assist', '2 Ammonizioni'],
    ['Kelly', 'Newcastle/Mercato', 6.02, '0 Gol, 1 Assist', '3 Ammonizioni'],
    ['Koulierakis', 'Wolfsburg/Mercato', 6.05, '1 Gol, 0 Assist', '6 Ammonizioni'],
    ['Marusic', 'Lazio', 5.95, '1 Gol, 1 Assist', '4 Ammonizioni'],
    ['Nuno Tavares', 'Lazio', 6.18, '0 Gol, 7 Assist', '5 Ammonizioni, 1 Espulsione'],
    ['Obrador', 'Benfica/Mercato', 5.90, '0 Gol, 1 Assist', '2 Ammonizioni'],
    ['Olivera', 'Napoli', 6.02, '0 Gol, 2 Assist', '3 Ammonizioni'],
    ['Provstgaard', 'Vejle/Mercato', 5.95, '1 Gol, 0 Assist', '3 Ammonizioni'],
    ['Rensch', 'Roma', 6.05, '1 Gol, 2 Assist', '3 Ammonizioni'],
    ['Stones', 'Man City/Mercato', 6.20, '1 Gol, 1 Assist', '2 Ammonizioni'],
    ['Sutalo', 'Ajax/Mercato', 6.00, '0 Gol, 0 Assist', '4 Ammonizioni'],
    ['Troilo', 'Parma', 5.90, '0 Gol, 0 Assist', '2 Ammonizioni'],
    ['Valle', 'Celtic/Mercato', 5.95, '0 Gol, 2 Assist', '3 Ammonizioni'],
    ['Vasquez', 'Genoa', 6.10, '1 Gol, 1 Assist', '8 Ammonizioni'],
    ['Viery', 'Sampdoria', 5.88, '0 Gol, 0 Assist', '1 Ammonizione'],
    ['Zanoli', 'Genoa', 5.92, '0 Gol, 2 Assist', '3 Ammonizioni'],
    ['Zappacosta', 'Atalanta', 6.10, '2 Gol, 3 Assist', '2 Ammonizioni'],
    ['Zortea', 'Cagliari', 6.08, '2 Gol, 3 Assist', '4 Ammonizioni'],
  ]],
  ['D', 'jolly', [
    ['Akpoguma', 'Hoffenheim', 5.85, '0 Gol', '5 Ammonizioni'],
    ['Bella-Kotchap', 'Southampton', 5.90, '0 Gol', '3 Ammonizioni'],
    ['Birindelli', 'Monza', 5.88, '1 Gol, 1 Assist', '6 Ammonizioni'],
    ['Bracaglia', 'Frosinone', 5.80, '0 Gol', '2 Ammonizioni'],
    ['Candé', 'Metz', 5.85, '0 Gol', '4 Ammonizioni'],
    ['Comert', 'Valladolid', 5.82, '0 Gol', '5 Ammonizioni'],
    ['Correia', 'Gil Vicente', 5.85, '0 Gol, 1 Assist', '3 Ammonizioni'],
    ['Doig', 'Sassuolo', 5.95, '0 Gol, 2 Assist', '4 Ammonizioni'],
    ['Favasuli', 'Bari', 5.88, '0 Gol', '3 Ammonizioni'],
    ['Fortini', 'Fiorentina', 5.90, '0 Gol', '1 Ammonizione'],
    ['Gallo', 'Lecce', 5.92, '0 Gol, 2 Assist', '5 Ammonizioni'],
    ['Gaspar', 'Lecce', 6.00, '1 Gol, 0 Assist', '6 Ammonizioni'],
    ['Kamara', 'Udinese', 5.90, '1 Gol, 1 Assist', '5 Ammonizioni'],
    ['Mangas', 'Vitoria Guimaraes', 5.85, '0 Gol', '3 Ammonizioni'],
    ['Marcandalli', 'Genoa', 5.88, '0 Gol', '2 Ammonizioni'],
    ['Ndiaye', 'Brest', 5.82, '0 Gol', '4 Ammonizioni'],
    ['Obert', 'Cagliari', 5.88, '0 Gol, 1 Assist', '3 Ammonizioni'],
    ['Oyono', 'Frosinone', 5.85, '0 Gol, 1 Assist', '4 Ammonizioni'],
    ['Rodriguez', 'Rayo', 5.80, '0 Gol', '2 Ammonizioni'],
    ['Schingstienne', 'OH Leuven', 5.82, '0 Gol', '3 Ammonizioni'],
    ['Smolcic', 'Eintracht', 5.85, '0 Gol', '3 Ammonizioni'],
    ['Sverko', 'Venezia', 5.88, '0 Gol', '5 Ammonizioni'],
    ['Tchato', 'Montpellier', 5.80, '0 Gol', '2 Ammonizioni'],
    ['Valeri', 'Parma', 5.98, '1 Gol, 3 Assist', '3 Ammonizioni'],
    ['Van der Brempt', 'Como', 5.92, '0 Gol, 1 Assist', '3 Ammonizioni'],
    ['Veiga', 'Villarreal', 5.85, '0 Gol', '2 Ammonizioni'],
    ['Walukiewicz', 'Torino', 5.90, '0 Gol', '4 Ammonizioni'],
    ['Zappa', 'Cagliari', 5.92, '1 Gol, 1 Assist', '4 Ammonizioni'],
    ['Zé Pedro', 'Porto', 5.85, '0 Gol', '3 Ammonizioni'],
  ]],

  ['C', 'top', [
    ['Calhanoglu', 'Inter', 6.44, '8 Gol, 5 Assist', '4 Ammonizioni, 1 Rigore Sbagliato', 'principale'],
    ['McTominay', 'Napoli', 6.45, '7 Gol, 3 Assist', '3 Ammonizioni'],
    ['Orsolini', 'Bologna', 6.40, '10 Gol, 4 Assist', '3 Ammonizioni', 'principale'],
    ['Nico Paz', 'Como', 6.50, '6 Gol, 7 Assist', '4 Ammonizioni', 'vice'],
    ['Pulisic', 'Milan', 6.52, '11 Gol, 8 Assist', '2 Ammonizioni', 'vice'],
    ['Rabiot', 'Marseille/Mercato', 6.30, '5 Gol, 3 Assist', '5 Ammonizioni'],
  ]],
  ['C', 'f1', [
    ['Atta', 'Fiorentina', 6.20, '3 Gol, 2 Assist', '3 Ammonizioni'],
    ['Barella', 'Inter', 6.35, '3 Gol, 6 Assist', '5 Ammonizioni'],
    ['Baturina', 'Como', 6.25, '4 Gol, 4 Assist', '2 Ammonizioni'],
    ['Da Cunha', 'Como', 6.20, '4 Gol, 3 Assist', '3 Ammonizioni', 'vice'],
    ['De Bruyne', 'Man City/Mercato', 6.60, '6 Gol, 10 Assist', '1 Ammonizione', 'principale'],
    ['Frattesi', 'Inter', 6.28, '6 Gol, 2 Assist', '2 Ammonizioni'],
    ['Kessié', 'Al-Ahli/Mercato', 6.25, '5 Gol, 2 Assist', '4 Ammonizioni', 'principale'],
    ['Koné', 'Roma', 6.30, '2 Gol, 3 Assist', '6 Ammonizioni'],
    ['Mastantuono', 'River/Mercato', 6.22, '3 Gol, 3 Assist', '2 Ammonizioni'],
    ['McKennie', 'Juventus', 6.25, '5 Gol, 6 Assist', '3 Ammonizioni'],
    ['Modric', 'Real Madrid/Mercato', 6.40, '2 Gol, 6 Assist', '1 Ammonizione', 'vice'],
    ['Moreira', 'Strasburgo/Mercato', 6.15, '3 Gol, 2 Assist', '3 Ammonizioni'],
    ['Mora', 'Porto/Mercato', 6.18, '2 Gol, 3 Assist', '2 Ammonizioni'],
    ['Perrone', 'Como', 6.30, '3 Gol, 4 Assist', '5 Ammonizioni'],
    ['Politano', 'Napoli', 6.22, '5 Gol, 5 Assist', '2 Ammonizioni', 'vice'],
    ['Rowe', 'Marseille/Mercato', 6.15, '4 Gol, 2 Assist', '2 Ammonizioni'],
    ['Sucic', 'Real Sociedad/Mercato', 6.18, '3 Gol, 3 Assist', '3 Ammonizioni'],
    ['Taylor', 'Ipswich/Mercato', 6.12, '2 Gol, 3 Assist', '4 Ammonizioni'],
    ['Thorstvedt', 'Sassuolo', 6.20, '6 Gol, 2 Assist', '5 Ammonizioni', 'vice'],
    ['Vlasic', 'Torino', 6.25, '5 Gol, 4 Assist', '3 Ammonizioni', 'principale'],
    ['Zaccagni', 'Lazio', 6.30, '7 Gol, 5 Assist', '6 Ammonizioni', 'principale'],
    ['Zaniolo', 'Atalanta', 6.10, '3 Gol, 2 Assist', '6 Ammonizioni, 1 Espulsione'],
    ['Zielinski', 'Inter', 6.20, '3 Gol, 3 Assist', '1 Ammonizione', 'vice'],
  ]],
  ['C', 'f2', [
    ['Alajbegovic', 'Bayer Lev./Mercato', 6.10, '2 Gol, 1 Assist', '1 Ammonizione'],
    ['Baldanzi', 'Roma', 6.15, '3 Gol, 2 Assist', '2 Ammonizioni'],
    ['Bernabé', 'Parma', 6.30, '4 Gol, 4 Assist', '4 Ammonizioni', 'vice'],
    ['Bernardeschi', 'Toronto/Mercato', 6.15, '4 Gol, 3 Assist', '5 Ammonizioni', 'principale'],
    ['Casadei', 'Leicester/Mercato', 6.10, '2 Gol, 1 Assist', '3 Ammonizioni'],
    ['Conceicao', 'Juventus', 6.28, '4 Gol, 5 Assist', '4 Ammonizioni'],
    ['Cristante', 'Roma', 6.12, '2 Gol, 2 Assist', '8 Ammonizioni'],
    ['De Roon', 'Atalanta', 6.18, '1 Gol, 2 Assist', '7 Ammonizioni'],
    ['Diouf', 'Lens/Mercato', 6.08, '2 Gol, 1 Assist', '4 Ammonizioni'],
    ['Ederson', 'Atalanta', 6.32, '4 Gol, 3 Assist', '6 Ammonizioni', 'vice'],
    ['Ekkelenkamp', 'Udinese', 6.12, '3 Gol, 2 Assist', '3 Ammonizioni'],
    ['Elmas', 'RB Lipsia/Mercato', 6.15, '3 Gol, 2 Assist', '2 Ammonizioni'],
    ['Fagioli', 'Juventus', 6.15, '1 Gol, 4 Assist', '3 Ammonizioni'],
    ['Gudmundsson', 'Fiorentina', 6.40, '8 Gol, 5 Assist', '3 Ammonizioni', 'principale'],
    ['Isaksen', 'Lazio', 6.12, '4 Gol, 3 Assist', '3 Ammonizioni'],
    ['Jesus Rodriguez', 'Betis/Mercato', 6.05, '1 Gol, 2 Assist', '2 Ammonizioni'],
    ['Lobotka', 'Napoli', 6.25, '0 Gol, 2 Assist', '2 Ammonizioni'],
    ['Locatelli', 'Juventus', 6.18, '1 Gol, 3 Assist', '5 Ammonizioni'],
    ['Mandragora', 'Fiorentina', 6.12, '3 Gol, 2 Assist', '6 Ammonizioni', 'vice'],
    ['Odgaard', 'Bologna', 6.15, '4 Gol, 2 Assist', '3 Ammonizioni'],
    ['Pasalic', 'Atalanta', 6.22, '5 Gol, 3 Assist', '2 Ammonizioni', 'vice'],
    ['Saelemaekers', 'Roma', 6.15, '3 Gol, 4 Assist', '4 Ammonizioni'],
    ['Samardzic', 'Atalanta', 6.25, '5 Gol, 4 Assist', '2 Ammonizioni', 'vice'],
  ]],
  ['C', 'f3', [
    ['Adopo', 'Cagliari', 6.00, '1 Gol, 1 Assist', '5 Ammonizioni'],
    ['Berisha', 'Lecce', 6.05, '1 Gol, 2 Assist', '3 Ammonizioni', 'vice'],
    ['Busio', 'Venezia', 6.20, '4 Gol, 3 Assist', '4 Ammonizioni', 'principale'],
    ['Chukwueze', 'Milan', 6.08, '3 Gol, 2 Assist', '1 Ammonizione'],
    ['Cissé', 'Verona', 6.02, '1 Gol, 1 Assist', '3 Ammonizioni'],
    ['Fazzini', 'Empoli', 6.15, '3 Gol, 2 Assist', '4 Ammonizioni', 'vice'],
    ['Ferguson', 'Bologna', 6.20, '3 Gol, 2 Assist', '3 Ammonizioni', 'vice'],
    ['Gaetano', 'Cagliari', 6.12, '4 Gol, 3 Assist', '2 Ammonizioni', 'principale'],
    ['Gandelman', 'Gent/Mercato', 6.05, '2 Gol, 1 Assist', '2 Ammonizioni'],
    ['Jones', 'Liverpool/Mercato', 6.18, '2 Gol, 3 Assist', '2 Ammonizioni'],
    ['Karlstrom', 'Udinese', 6.05, '0 Gol, 1 Assist', '4 Ammonizioni'],
    ['Keita', 'Parma', 6.00, '1 Gol, 1 Assist', '6 Ammonizioni'],
    ['Loftus-Cheek', 'Milan', 6.10, '3 Gol, 1 Assist', '3 Ammonizioni'],
    ['Luis Henrique', 'Marseille/Mercato', 6.12, '2 Gol, 3 Assist', '1 Ammonizione'],
    ['Matic', 'Sassuolo', 6.08, '0 Gol, 2 Assist', '5 Ammonizioni'],
    ['Moro', 'Bologna', 6.02, '1 Gol, 2 Assist', '3 Ammonizioni'],
    ['Ndour', 'Besiktas/Mercato', 6.05, '1 Gol, 1 Assist', '3 Ammonizioni'],
    ['Nicolussi Caviglia', 'Venezia', 6.12, '2 Gol, 3 Assist', '4 Ammonizioni', 'vice'],
    ['Oulai', 'Bastia/Mercato', 5.95, '1 Gol, 0 Assist', '2 Ammonizioni'],
    ['Pessina', 'Monza', 6.10, '3 Gol, 2 Assist', '4 Ammonizioni', 'principale'],
    ['Pisilli', 'Roma', 6.15, '2 Gol, 1 Assist', '2 Ammonizioni'],
    ['Thuram', 'Juventus', 6.22, '2 Gol, 3 Assist', '3 Ammonizioni'],
  ]],
  ['C', 'jolly', [
    ['Akinsanmiro', 'Sampdoria', 5.95, '1 Gol', '3 Ammonizioni'],
    ['Amorim', 'Sporting/Mercato', 5.90, '0 Gol', '2 Ammonizioni'],
    ['Basic', 'Lazio', 5.85, '0 Gol', '2 Ammonizioni'],
    ['Cacciamani', 'Torino', 5.88, '0 Gol', '1 Ammonizione'],
    ['Calò', 'Cosenza', 5.92, '1 Gol, 2 Assist', '4 Ammonizioni', 'vice'],
    ['Cambiaghi', 'Bologna', 6.05, '2 Gol, 3 Assist', '2 Ammonizioni'],
    ['Cancellieri', 'Parma', 6.02, '3 Gol, 1 Assist', '4 Ammonizioni, 1 Espulsione'],
    ['Cataldi', 'Fiorentina', 6.00, '1 Gol, 1 Assist', '4 Ammonizioni', 'vice'],
    ['Chakvetadze', 'Watford', 5.95, '1 Gol, 2 Assist', '2 Ammonizioni'],
    ['Coulibaly', 'Lecce', 5.90, '0 Gol, 1 Assist', '6 Ammonizioni'],
    ['Dele-Bashiru', 'Lazio', 6.00, '2 Gol, 1 Assist', '2 Ammonizioni'],
    ['Diallo', 'Metz', 5.88, '0 Gol', '3 Ammonizioni'],
    ['Ellertsson', 'Venezia', 5.95, '1 Gol, 1 Assist', '3 Ammonizioni'],
    ['Ethan-Meichtry', 'Servette', 5.85, '0 Gol', '1 Ammonizione'],
    ['Fitz-Jim', 'Ajax', 5.92, '1 Gol', '2 Ammonizioni'],
    ['Folorunsho', 'Fiorentina', 6.02, '2 Gol, 1 Assist', '5 Ammonizioni'],
    ['Gorter', 'Ajax', 5.80, '0 Gol', '1 Ammonizione'],
    ['Ilic', 'Torino', 6.05, '2 Gol, 2 Assist', '4 Ammonizioni', 'vice'],
    ['Kike Perez', 'Rayo', 5.88, '0 Gol', '3 Ammonizioni'],
    ['Koutsoupias', 'Catanzaro', 5.90, '1 Gol', '3 Ammonizioni'],
    ['Lipani', 'Sassuolo', 5.92, '0 Gol', '2 Ammonizioni'],
    ['Milla', 'Alcorcon', 5.85, '0 Gol', '2 Ammonizioni'],
    ['Oristanio', 'Venezia', 6.08, '3 Gol, 3 Assist', '4 Ammonizioni'],
    ['Piotrowski', 'Ludogorets', 5.90, '1 Gol', '3 Ammonizioni', 'vice'],
    ['Pobega', 'Bologna', 5.95, '1 Gol, 1 Assist', '4 Ammonizioni'],
    ['Ricci', 'Torino', 6.15, '1 Gol, 3 Assist', '5 Ammonizioni'],
    ['Rovella', 'Lazio', 6.18, '0 Gol, 2 Assist', '7 Ammonizioni'],
    ['Schmid', 'Brema', 6.00, '1 Gol, 2 Assist', '2 Ammonizioni', 'vice'],
    ['Sohm', 'Parma', 6.02, '2 Gol, 2 Assist', '4 Ammonizioni'],
    ['Sow', 'Wolfsburg', 5.90, '0 Gol', '3 Ammonizioni'],
    ['Traoré', 'Auxerre', 5.92, '1 Gol, 1 Assist', '2 Ammonizioni'],
    ['Unai Gomez', 'Athletic', 5.95, '1 Gol', '2 Ammonizioni'],
    ['Winks', 'Leicester', 6.00, '0 Gol, 1 Assist', '3 Ammonizioni'],
  ]],

  ['A', 'top', [
    ['Lautaro Martinez', 'Inter', 6.34, '16 Gol, 4 Assist', '3 Ammonizioni, 1 Rigore Sbagliato', 'principale'],
    ['Malen', 'Aston Villa/Mercato', 6.38, '13 Gol, 5 Assist', '2 Ammonizioni', 'vice'],
    ['Thuram', 'Inter', 6.42, '14 Gol, 7 Assist', '2 Ammonizioni', 'vice'],
  ]],
  ['A', 'f1', [
    ['Davis', 'Udinese', 6.18, '7 Gol, 3 Assist', '4 Ammonizioni', 'principale'],
    ['Douvikas', 'Como', 6.25, '10 Gol, 2 Assist', '2 Ammonizioni', 'principale'],
    ['Dovbyk', 'Roma', 6.30, '12 Gol, 3 Assist', '2 Ammonizioni', 'vice'],
    ['Dybala', 'Roma', 6.45, '9 Gol, 6 Assist', '1 Ammonizione', 'principale'],
    ['Hojlund', 'Napoli', 6.35, '11 Gol, 3 Assist', '3 Ammonizioni', 'principale'],
    ['Kean', 'Fiorentina', 6.38, '13 Gol, 2 Assist', '5 Ammonizioni', 'vice'],
    ['Kolo Muani', 'PSG/Mercato', 6.28, '9 Gol, 4 Assist', '2 Ammonizioni', 'vice'],
    ['Gonçalo Ramos', 'Milan', 6.32, '12 Gol, 2 Assist', '2 Ammonizioni', 'principale'],
    ['Scamacca', 'Atalanta', 6.50, '11 Gol, 4 Assist', '3 Ammonizioni', 'principale'],
    ['Simeone', 'Napoli', 6.15, '6 Gol, 2 Assist', '2 Ammonizioni'],
    ['Yildiz', 'Juventus', 6.35, '8 Gol, 6 Assist', '2 Ammonizioni', 'vice'],
  ]],
  ['A', 'f2', [
    ['Alisson Santos', 'Sporting/Mercato', 6.10, '4 Gol, 2 Assist', '2 Ammonizioni'],
    ['Boga', 'Nizza/Mercato', 6.15, '5 Gol, 4 Assist', '1 Ammonizione'],
    ['Castro', 'Bologna', 6.22, '8 Gol, 3 Assist', '3 Ammonizioni', 'vice'],
    ['De Ketelaere', 'Atalanta', 6.35, '7 Gol, 8 Assist', '2 Ammonizioni', 'vice'],
    ['Berardi', 'Sassuolo', 6.40, '9 Gol, 6 Assist', '3 Ammonizioni', 'principale'],
    ['Colombo', 'Empoli', 6.10, '6 Gol, 2 Assist', '3 Ammonizioni', 'vice'],
    ['Laurienté', 'Sassuolo', 6.20, '7 Gol, 5 Assist', '4 Ammonizioni', 'vice'],
    ['Pinamonti', 'Genoa', 6.15, '9 Gol, 2 Assist', '4 Ammonizioni', 'principale'],
    ['Raspadori', 'Napoli', 6.12, '5 Gol, 3 Assist', '1 Ammonizione', 'vice'],
    ['P. Esposito', 'Spezia/Mercato', 6.20, '8 Gol, 2 Assist', '3 Ammonizioni', 'principale'],
    ['S. Esposito', 'Empoli', 6.18, '6 Gol, 4 Assist', '4 Ammonizioni', 'principale'],
    ['Soulé', 'Roma', 6.22, '6 Gol, 5 Assist', '3 Ammonizioni', 'vice'],
  ]],
  ['A', 'f3', [
    ['A. Adams', 'Torino', 6.12, '6 Gol, 2 Assist', '2 Ammonizioni', 'vice'],
    ['C. Adams', 'Torino', 6.15, '7 Gol, 3 Assist', '2 Ammonizioni', 'vice'],
    ['Bonny', 'Parma', 6.18, '6 Gol, 4 Assist', '3 Ammonizioni', 'principale'],
    ['Borrelli', 'Brescia', 6.05, '5 Gol, 1 Assist', '5 Ammonizioni', 'principale'],
    ['Cutrone', 'Como', 6.20, '8 Gol, 3 Assist', '3 Ammonizioni', 'vice'],
    ['Diao', 'Betis/Mercato', 6.08, '4 Gol, 2 Assist', '1 Ammonizione'],
    ['Elphege', 'Grenoble', 6.00, '3 Gol, 1 Assist', '2 Ammonizioni'],
    ['Krstovic', 'Lecce', 6.10, '8 Gol, 1 Assist', '5 Ammonizioni', 'principale'],
    ['Maldini', 'Monza', 6.22, '6 Gol, 3 Assist', '3 Ammonizioni', 'vice'],
    ['Noslin', 'Lazio', 6.10, '5 Gol, 2 Assist', '3 Ammonizioni'],
    ['Pellegrino', 'Parma', 6.02, '3 Gol, 1 Assist', '2 Ammonizioni'],
    ['Stulic', 'Charleroi', 6.00, '4 Gol, 1 Assist', '3 Ammonizioni', 'vice'],
    ['Touré', 'Atalanta', 6.08, '4 Gol, 2 Assist', '2 Ammonizioni'],
    ['Vitinha', 'Genoa', 6.10, '5 Gol, 2 Assist', '3 Ammonizioni', 'vice'],
    ['Yeboah', 'Venezia', 6.05, '4 Gol, 3 Assist', '2 Ammonizioni'],
    ['Zapata', 'Torino', 6.28, '9 Gol, 2 Assist', '2 Ammonizioni', 'principale'],
  ]],
  ['A', 'jolly', [
    ['Bowie', 'Hibernian', 5.88, '2 Gol', '2 Ammonizioni'],
    ['Camarda', 'Milan', 6.05, '2 Gol, 1 Assist', '1 Ammonizione'],
    ['Dia', 'Lazio', 6.15, '6 Gol, 2 Assist', '2 Ammonizioni', 'vice'],
    ['Ekhator', 'Genoa', 6.02, '2 Gol, 1 Assist', '1 Ammonizione'],
    ['Fatah', 'Willem II', 5.85, '1 Gol', '1 Ammonizione'],
    ['Geubbels', 'St. Gallen', 5.92, '2 Gol', '2 Ammonizioni'],
    ['Ghedjemis', 'Frosinone', 5.90, '1 Gol, 1 Assist', '2 Ammonizioni'],
    ['Kevin Carlos', 'Yverdon', 5.95, '2 Gol', '3 Ammonizioni', 'vice'],
    ['Kvernadze', 'Frosinone', 5.92, '1 Gol, 1 Assist', '3 Ammonizioni'],
    ['Mendy', 'Caen', 5.85, '1 Gol', '1 Ammonizione'],
    ['Ngonge', 'Napoli', 6.05, '3 Gol, 1 Assist', '2 Ammonizioni'],
    ['Mota', 'Monza', 6.10, '5 Gol, 2 Assist', '4 Ammonizioni', 'vice'],
    ["N'Dri", 'OH Leuven', 5.88, '1 Gol', '2 Ammonizioni'],
    ['Osmajic', 'Preston', 5.90, '2 Gol', '3 Ammonizioni'],
    ['Piccoli', 'Cagliari', 6.12, '7 Gol, 1 Assist', '4 Ammonizioni', 'vice'],
    ['Raimondo', 'Venezia', 6.00, '3 Gol, 1 Assist', '2 Ammonizioni'],
    ['Ratkov', 'RB Salisburgo', 5.92, '2 Gol', '2 Ammonizioni'],
    ['Romero', 'Cruz Azul', 5.85, '1 Gol', '1 Ammonizione'],
    ['Rrahmani', 'Sparta Praga', 5.95, '2 Gol', '2 Ammonizioni'],
    ['Varela', 'Porto', 5.88, '1 Gol', '2 Ammonizioni'],
  ]],
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Override manuali facoltativi (chiave = nome esatto come in giocatori.md).
// rigorista puo' essere: 'principale' | 'vice' | null/undefined (nessuno).
const STATS_OVERRIDES = {
  // 'Lautaro Martinez': { rigorista: 'principale' },
};

function buildPlayers() {
  const idCount = new Map();
  const list = [];
  for (const [role, fascia, entries] of GROUPS) {
    for (const entry of entries) {
      const [name, team, mediaVoto, bonus, malus, rigorista] = entry;
      const baseId = `${role.toLowerCase()}-${slugify(name)}`;
      const n = (idCount.get(baseId) || 0) + 1;
      idCount.set(baseId, n);
      const id = n > 1 ? `${baseId}-${n}` : baseId;
      const override = STATS_OVERRIDES[name];
      list.push({
        id,
        name,
        team,
        role,
        fascia,
        mediaVoto: override?.mediaVoto ?? mediaVoto ?? 'NA',
        bonus: override?.bonus ?? bonus ?? 'NA',
        malus: override?.malus ?? malus ?? 'NA',
        // 'principale' | 'vice' | null
        rigorista: override?.rigorista ?? rigorista ?? null,
      });
    }
  }
  return list;
}

const PLAYERS = buildPlayers();

function playersByRole(role) {
  return PLAYERS.filter((p) => p.role === role);
}

function getPlayer(id) {
  return PLAYERS.find((p) => p.id === id);
}
