/*
  Turnierdaten – hier alles pflegen, die Seite baut sich daraus auf.
  Nur echte Angaben eintragen. Leere Felder ("" oder []) zeigen auf der Seite "folgt" bzw. "offen".
  Ergebnisse: punkteA/punkteB als Zahlen eintragen (z. B. 2 und 1), der Sieger wird automatisch ermittelt
  und ins Finale uebernommen.
*/
window.TURNIER = {
  name: "Deadlock Turnier",
  untertitel: "Live auf Twitch",
  region: "DE · AT · CH",

  // Beginn mit Zeitzone (November = Winterzeit, +01:00) – steuert den Countdown
  start: "2026-11-06T19:00:00+01:00",
  datumText: "Freitag 06.11.26",
  uhrzeitText: "19 Uhr",
  checkIn: "",
  format: "",

  twitch: "https://twitch.tv/johnnyblazedx",

  // Ankuendigungsvideos: plattform "youtube" oder "tiktok", id aus dem Link, link = Originalseite
  videos: [
    { plattform: "tiktok", id: "7702177872710061334", link: "https://www.tiktok.com/@johnnyblazedx/video/7702177872710061334" },
    { plattform: "youtube", id: "_My5zQ-HZsI", link: "https://www.youtube.com/shorts/_My5zQ-HZsI" }
  ],

  anmeldung: {
    link: "",          // z. B. Discord-Einladung oder Formular-Link; leer = Button "Anmeldung folgt"
    schluss: "",       // z. B. "Do 05.11. 20 Uhr"
    plaetze: "",       // z. B. "24 Spieler"
    hinweis: ""        // kurzer Satz unter dem Button
  },

  // Ablauf in Schritten, z. B. "Die Teamkapitaene waehlen abwechselnd ihre Spieler."
  ablauf: [],

  teams: [
    { name: "Team 1", kapitaen: "", spieler: [] },
    { name: "Team 2", kapitaen: "", spieler: [] },
    { name: "Team 3", kapitaen: "", spieler: [] },
    { name: "Team 4", kapitaen: "", spieler: [] }
  ],

  // a/b = Index in teams (0 = Team 1)
  spiele: {
    halbfinale1: { a: 0, b: 1, punkteA: null, punkteB: null },
    halbfinale2: { a: 2, b: 3, punkteA: null, punkteB: null },
    finale: { punkteA: null, punkteB: null }
  }
};
