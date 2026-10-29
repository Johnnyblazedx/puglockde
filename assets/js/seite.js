/* Baut Startseite und Turnierseite aus data/projekte.js bzw. turniere/<id>/daten.js auf. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function leer(v) { return v == null || (Array.isArray(v) ? v.length === 0 : String(v).trim() === ""); }
  function $(sel) { return document.querySelector(sel); }
  function setHtml(sel, html) { var el = $(sel); if (el) el.innerHTML = html; }

  var KRONE = '<svg class="krone" viewBox="0 0 18 14" aria-hidden="true"><path fill="currentColor" d="M1 3l4 4 4-6 4 6 4-4-2 10H3z"/></svg>';

  // ---------- Startseite ----------
  function projekte() {
    var liste = window.PROJEKTE || [];
    var labels = { aktuell: "Aktuell", geplant: "Geplant", vorbei: "Vorbei" };
    setHtml("#projekte", liste.map(function (p) {
      var tag = p.link ? "a" : "div";
      var href = p.link ? ' href="' + esc(p.link) + '"' : "";
      return "<" + tag + ' class="kachel"' + href + ">" +
        '<span class="status ' + esc(p.status) + '">' + esc(labels[p.status] || p.status) + "</span>" +
        "<h3>" + esc(p.titel) + "</h3><p>" + esc(p.beschreibung) + "</p>" +
        (leer(p.datum) ? "" : '<div class="datum">' + esc(p.datum) + "</div>") +
        "</" + tag + ">";
    }).join(""));
  }

  // ---------- Turnierseite ----------
  function sieger(sp) {
    if (sp.punkteA == null || sp.punkteB == null || sp.punkteA === sp.punkteB) return null;
    return sp.punkteA > sp.punkteB ? "a" : "b";
  }

  function spielHtml(titel, teamA, teamB, sp, extraKlasse) {
    var s = sieger(sp);
    function zeile(team, seite, punkte) {
      var gewonnen = s === seite;
      return '<div class="team' + (gewonnen ? " sieger" : "") + '"><span>' + (gewonnen ? KRONE : "") +
        esc(team ? team.name : "offen") + '</span><span class="punkte">' + (punkte == null ? "–" : esc(punkte)) + "</span></div>";
    }
    return '<div class="spiel ' + (extraKlasse || "") + '"><div class="titel">' + esc(titel) + "</div>" +
      zeile(teamA, "a", sp.punkteA) + zeile(teamB, "b", sp.punkteB) + "</div>";
  }

  function countdown(startIso) {
    var el = $("#countdown");
    if (!el) return;
    var ziel = new Date(startIso).getTime();
    if (isNaN(ziel)) { el.hidden = true; return; }
    function tick() {
      var rest = Math.max(0, ziel - Date.now());
      if (rest === 0) { el.innerHTML = '<div><b>LIVE</b><span>jetzt auf Twitch</span></div>'; return; }
      var t = Math.floor(rest / 86400000), h = Math.floor(rest / 3600000) % 24,
          m = Math.floor(rest / 60000) % 60, s = Math.floor(rest / 1000) % 60;
      el.innerHTML = [[t, "Tage"], [h, "Std"], [m, "Min"], [s, "Sek"]].map(function (x) {
        return "<div><b>" + String(x[0]).padStart(2, "0") + "</b><span>" + x[1] + "</span></div>";
      }).join("");
      setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    tick();
  }

  // Videos erst nach Klick laden (Zwei-Klick-Loesung): vorher gehen keine Daten an YouTube/TikTok
  var PLATTFORMEN = {
    youtube: { name: "YouTube", src: function (id) { return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&playsinline=1"; } },
    tiktok: { name: "TikTok", src: function (id) { return "https://www.tiktok.com/player/v1/" + encodeURIComponent(id) + "?autoplay=1&description=1&music_info=1&rel=0"; } }
  };

  function videos(liste) {
    var box = $("#videos");
    if (!box) return;
    liste = (liste || []).filter(function (v) { return PLATTFORMEN[v.plattform] && !leer(v.id); });
    if (!liste.length) { var block = $("#videos-block"); if (block) block.hidden = true; return; }
    box.innerHTML = liste.map(function (v, i) {
      var p = PLATTFORMEN[v.plattform];
      return '<figure class="video">' +
        '<div class="video-rahmen" data-nr="' + i + '">' +
        '<button type="button" class="video-start" aria-label="' + p.name + '-Video abspielen">' +
        '<span class="video-play" aria-hidden="true"></span>' +
        '<span class="video-plattform">' + p.name + "</span>" +
        '<span class="video-hinweis">Beim Abspielen werden Daten an ' + p.name + " übertragen.</span>" +
        "</button></div>" +
        '<figcaption><a href="' + esc(v.link) + '" target="_blank" rel="noopener">Auf ' + p.name + " ansehen ↗</a></figcaption>" +
        "</figure>";
    }).join("");
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".video-start");
      if (!btn) return;
      var rahmen = btn.parentNode, v = liste[+rahmen.getAttribute("data-nr")], p = PLATTFORMEN[v.plattform];
      rahmen.innerHTML = '<iframe src="' + esc(p.src(v.id)) + '" title="' + p.name + '-Video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share" allowfullscreen></iframe>';
    });
  }

  function turnier() {
    var t = window.TURNIER;
    if (!t) return;

    document.title = t.name + " – " + t.datumText;
    setHtml("#t-name", esc(t.name) + '<span class="zeile2">' + esc(t.untertitel) + "</span>");

    var fakten = [
      ["Datum", t.datumText], ["Beginn", t.uhrzeitText], ["Check-in", t.checkIn],
      ["Format", t.format], ["Region", t.region]
    ];
    setHtml("#fakten", fakten.map(function (f) {
      return '<div class="fakt"><dt>' + f[0] + "</dt><dd" + (leer(f[1]) ? ' class="offen">folgt' : ">" + esc(f[1])) + "</dd></div>";
    }).join(""));
    countdown(t.start);

    videos(t.videos);

    // Anmeldung
    var a = t.anmeldung || {};
    var btn = leer(a.link)
      ? '<span class="btn btn-primaer" aria-disabled="true">Anmeldung folgt</span>'
      : '<a class="btn btn-primaer" href="' + esc(a.link) + '" target="_blank" rel="noopener">Jetzt anmelden</a>';
    var twitch = '<a class="btn btn-sekundaer" href="' + esc(t.twitch) + '" target="_blank" rel="noopener">' +
      '<img src="../../assets/img/twitch.png" alt="" width="22" height="22">' + esc(t.twitch.replace(/^https?:\/\//, "")) + "</a>";
    setHtml("#aktionen", btn + twitch);

    var anmeldeInfos = [["Anmeldeschluss", a.schluss], ["Plätze", a.plaetze]].filter(function (x) { return !leer(x[1]); });
    setHtml("#anmeldung-infos",
      (anmeldeInfos.length ? '<dl class="fakten">' + anmeldeInfos.map(function (x) {
        return '<div class="fakt"><dt>' + x[0] + "</dt><dd>" + esc(x[1]) + "</dd></div>";
      }).join("") + "</dl>" : "") +
      (leer(a.hinweis)
        ? (leer(a.link) ? '<p class="offen-text">Die Anmeldung ist noch nicht geöffnet. Folge dem Kanal auf Twitch, dann verpasst du den Start nicht.</p>' : "")
        : "<p>" + esc(a.hinweis) + "</p>") +
      '<div class="aktionen">' + btn + "</div>");

    // Ablauf
    setHtml("#ablauf", leer(t.ablauf)
      ? '<p class="offen-text">Der genaue Ablauf folgt in Kürze.</p>'
      : '<ol class="schritte">' + t.ablauf.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>");

    // Turnierbaum
    var sp = t.spiele, teams = t.teams;
    var hf1 = sp.halbfinale1, hf2 = sp.halbfinale2;
    var s1 = sieger(hf1), s2 = sieger(hf2);
    var finA = s1 ? teams[s1 === "a" ? hf1.a : hf1.b] : null;
    var finB = s2 ? teams[s2 === "a" ? hf2.a : hf2.b] : null;
    setHtml("#baum",
      '<div class="runde">' + spielHtml("Halbfinale 1", teams[hf1.a], teams[hf1.b], hf1) +
      spielHtml("Halbfinale 2", teams[hf2.a], teams[hf2.b], hf2) + "</div>" +
      '<div class="verbinder" aria-hidden="true"></div>' +
      '<div class="runde">' + spielHtml("Finale", finA, finB, sp.finale, "finale") + "</div>");

    // Teams
    setHtml("#teams", teams.map(function (tm) {
      return '<div class="team-karte"><h3>' + esc(tm.name) + "</h3>" +
        "<p>Kapitän: " + (leer(tm.kapitaen) ? "folgt" : esc(tm.kapitaen)) + "</p>" +
        (leer(tm.spieler) ? "" : "<p>" + tm.spieler.map(esc).join(", ") + "</p>") + "</div>";
    }).join(""));
  }

  projekte();
  turnier();
  var jahr = $("#jahr"); if (jahr) jahr.textContent = new Date().getFullYear();
})();
