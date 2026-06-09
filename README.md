# EB Web Studio — Website

Eine moderne, professionelle One-Page-Website für ein Webdesign-Business.
Farbwelt: **Babyblau & Weiß**, clean und einheitlich. Voll responsiv (Handy,
Tablet, Desktop), ohne externes Framework — nur HTML, CSS und etwas JavaScript.

## Funktionen

- Sticky-Navigation mit mobilem Menü
- Hero-Bereich mit Call-to-Action
- Leistungen, Ablauf, Preise, Referenzen & Kundenstimmen
- **Anfrage-Formular** (ausführlich – für Website-Wünsche)
- **Kontaktformular** (kurz – für Fragen)
- FAQ-Bereich (aufklappbar)
- Scroll-Animationen, „Nach oben"-Button
- SEO- & Social-Media-Meta-Tags, eigenes Favicon

## Dateien

| Datei         | Inhalt                                  |
|---------------|------------------------------------------|
| `index.html`  | Struktur & Inhalte der Seite            |
| `styles.css`  | Komplettes Design (Babyblau/Weiß)       |
| `script.js`   | Menü, Animationen, Formular-Logik       |
| `favicon.svg` | Browser-Symbol                          |

## Lokal ansehen

Einfach `index.html` im Browser öffnen. Für eine realistischere Vorschau
einen kleinen Server starten:

```bash
# Python
python3 -m http.server 8000
# danach im Browser: http://localhost:8000
```

## Kontaktformulare aktivieren (wichtig)

Die Formulare nutzen **zwei Wege**, damit dich Nachrichten zuverlässig erreichen:

1. **Web3Forms** (Hauptweg, echte E-Mail ohne eigenen Server) — empfohlen
2. **mailto-Fallback** — öffnet automatisch das E-Mail-Programm des Besuchers,
   falls noch kein Schlüssel hinterlegt ist oder der Versand scheitert.

**Solange kein Schlüssel eingetragen ist, funktioniert bereits der
mailto-Fallback.** Für echte, nahtlose E-Mails so vorgehen:

1. Auf [https://web3forms.com](https://web3forms.com) gehen, deine E-Mail
   (`emilianbleimn@gmail.com`) eingeben und den kostenlosen **Access Key**
   erhalten.
2. In `index.html` an **beiden** Stellen den Platzhalter ersetzen:

   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```

   → den Wert `YOUR_WEB3FORMS_ACCESS_KEY` durch deinen echten Key austauschen.

Fertig — ab dann landen Anfragen direkt in deinem Postfach.

> Die Empfänger-Adresse für den mailto-Fallback steht oben in `script.js`
> (`CONTACT_EMAIL`).

## Inhalte anpassen

- **Name/Branding:** „EB Web Studio" in `index.html` (und das Favicon) ändern.
- **Preise/Pakete:** Abschnitt `id="preise"` in `index.html`.
- **Texte/Leistungen/FAQ:** direkt im jeweiligen Abschnitt in `index.html`.
- **Farben:** zentral oben in `styles.css` unter `:root` (`--baby`, `--blue` …).

## Veröffentlichen

Die Seite ist statisch und läuft überall — z. B. kostenlos über
**GitHub Pages**, **Netlify** oder **Vercel**. Bei GitHub Pages genügt es,
den Branch in den Repository-Einstellungen als Quelle zu wählen.
