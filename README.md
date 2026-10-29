# Deadlock PUG – Website

Statische Seite (HTML/CSS/JS, kein Build-Schritt) für GitHub Pages. Gleiche Farben und Schrift wie der Trailer.

## Aufbau

```
index.html                 Startseite mit allen Projekten
data/projekte.js           Projekt-Kacheln der Startseite
turniere/2026-11/          Turnier am 06.11.26
  index.html               Turnierseite
  daten.js                 alle Turnierangaben, Teams und Ergebnisse
assets/css/style.css       Design
assets/js/seite.js         baut Startseite und Turnierseiten aus den Daten auf
assets/fonts/              Barlow Condensed (SIL Open Font License, siehe OFL.txt)
```

## Pflegen

- **Turnierangaben, Anmeldung, Ablauf, Teams, Ergebnisse:** nur `turniere/2026-11/daten.js` ändern.
  Leere Felder erscheinen auf der Seite als „folgt“. Ergebnisse als Zahlen eintragen – der Sieger
  bekommt die Krone und rückt automatisch ins Finale.
- **Neues Turnier:** Ordner `turniere/2026-11` kopieren (z. B. `turniere/2027-01`), `daten.js` anpassen
  und in `data/projekte.js` eine Kachel ergänzen (altes Turnier auf `status: "vorbei"` setzen).

## Lokal ansehen

Im Projektordner (eine Ebene über `website`):

```
powershell -ExecutionPolicy Bypass -File .\website-vorschau.ps1
```

Dann http://localhost:8080/ öffnen.

## Auf GitHub Pages veröffentlichen

1. Auf GitHub ein neues Repository anlegen, z. B. `puglockde`.
2. Den Inhalt dieses Ordners `website` hochladen (nur diesen Ordner, nicht das Video-Projekt).
3. Repository → Settings → Pages → „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
4. Nach ca. einer Minute ist die Seite unter https://johnnyblazedx.github.io/puglockde/ erreichbar.
   Eine eigene Domain lässt sich später unter Settings → Pages → Custom domain eintragen.
