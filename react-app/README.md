# EB Web Studio — React-Version

Die gleiche Website wie im Hauptordner, aber als **React-App (Vite)** – sauber in
Komponenten und Hooks aufgeteilt. Gleiches Design (dieselbe `styles.css`),
gleiche Inhalte, gleiche Funktionen (Theme-Umschalter, Logo-Splash, Formulare
mit Web3Forms + mailto-Fallback, Scroll-Animationen, Zahlen-Hochzählen).

## Schnellstart

```bash
cd react-app
npm install
npm run dev
```

Dann im Browser öffnen: http://localhost:5173

## Befehle

| Befehl            | Wirkung                                   |
|-------------------|-------------------------------------------|
| `npm run dev`     | Entwicklungsserver mit Hot-Reload         |
| `npm run build`   | Produktions-Build nach `dist/`            |
| `npm run preview` | Den Build lokal testen                    |

## Aufbau

```
react-app/
├─ index.html            # Einstieg (Theme-Script, kritisches CSS, Logo-Splash)
├─ public/favicon.svg
└─ src/
   ├─ main.jsx           # Mountet die App, importiert styles.css
   ├─ App.jsx            # Setzt alle Sektionen zusammen
   ├─ styles.css         # Komplettes Design (Schwarz & Gold)
   ├─ data.js            # Inhalte (Pakete, Ablauf, FAQ, Referenzen …)
   ├─ hooks/
   │  ├─ useTheme.js        # Light/Dark mit localStorage
   │  ├─ useScrollReveal.js # Einblenden beim Scrollen
   │  └─ useWeb3Form.js     # Formular-Versand + mailto-Fallback
   └─ components/        # Header, Hero, Marquee, Stats, Services, Why,
                         # Process, Pricing, Referenzen, RequestForm,
                         # Faq, Contact, Footer, BackToTop, SectionHead
```

## Kontaktformulare aktivieren

Wie bei der statischen Version: einen kostenlosen **Access Key** von
[web3forms.com](https://web3forms.com) holen und in `src/hooks/useWeb3Form.js`
sowie in den Formular-Komponenten den Platzhalter `YOUR_WEB3FORMS_ACCESS_KEY`
ersetzen. Ohne Key öffnet sich automatisch das E-Mail-Programm (mailto).

## Veröffentlichen

`npm run build` erzeugt einen statischen `dist/`-Ordner, den du überall
hosten kannst (z. B. GitHub Pages, Netlify oder Vercel).
