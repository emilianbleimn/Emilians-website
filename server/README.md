# EB Motion — Checkout-Server (Stripe)

Kleiner Backend-Dienst, der **Stripe-Checkout-Sessions** für das Website-Abo
(129 €/Monat) erstellt. Beide Frontends (die statische `index.html` und die
React-App in `react-app/`) rufen ihn an, der Besucher wird dann zur sicheren,
von Stripe gehosteten Bezahlseite weitergeleitet.

> **Wichtig:** Der **geheime** Schlüssel (`sk_…`) lebt ausschließlich hier auf
> dem Server. Im Frontend steht nur der **veröffentlichbare** Schlüssel
> (`pk_…`), der gefahrlos öffentlich sein darf.

## Einrichtung

```bash
cd server
npm install
cp .env.example .env      # danach .env ausfüllen
npm start                 # läuft auf http://localhost:4242
```

In `.env` mindestens `STRIPE_SECRET_KEY` eintragen (aus dem Stripe-Dashboard →
*Entwickler → API-Schlüssel*, Testmodus beginnt mit `sk_test_…`).

**Ohne weiteres Setup lauffähig:** Ist keine `STRIPE_PRICE_ID` gesetzt, baut der
Server das Abo automatisch aus den `PRICE_*`-Werten (Standard 129 €/Monat). Für
den Live-Betrieb empfiehlt sich ein im Dashboard angelegtes Produkt mit fester
Price-ID.

## Endpunkte

| Methode | Pfad                       | Zweck                                            |
|---------|----------------------------|--------------------------------------------------|
| `POST`  | `/create-checkout-session` | Erstellt die Abo-Session, liefert `{ id, url }`. |
| `POST`  | `/webhook`                 | Stripe-Events (optional, Signatur-geprüft).      |
| `GET`   | `/health`                  | Status-Check (`{ ok, configured }`).             |

`POST /create-checkout-session` akzeptiert optional `{ successUrl, cancelUrl }`.
Erlaubt sind nur URLs auf den in `ALLOWED_ORIGINS` freigegebenen Adressen.

## Webhook lokal testen (optional)

```bash
stripe listen --forward-to localhost:4242/webhook
# das angezeigte Signing-Secret als STRIPE_WEBHOOK_SECRET in .env eintragen
```

## Deployment

Überall lauffähig, wo Node läuft (Render, Railway, Fly.io, eigener Server …).
Die Variablen aus `.env.example` dort als Umgebungsvariablen setzen und in
`ALLOWED_ORIGINS` die echte Domain ergänzen. Im Frontend dann die Server-Adresse
anpassen (`PAYMENTS_API` in `script.js` bzw. `VITE_PAYMENTS_API` in der React-App).
