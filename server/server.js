/**
 * EB Motion – Stripe Checkout Server
 * ----------------------------------
 * Kleiner Backend-Dienst, der Stripe-Checkout-Sessions für das Website-Abo
 * (129 €/Monat) erstellt. Der GEHEIME Stripe-Schlüssel bleibt ausschließlich
 * hier auf dem Server – er gehört niemals ins Frontend.
 *
 *   1.  npm install
 *   2.  .env.example  ->  .env  kopieren und ausfüllen (STRIPE_SECRET_KEY!)
 *   3.  npm start
 */
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import 'dotenv/config';

const {
  STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET,
  PRICE_AMOUNT = '12900',
  PRICE_CURRENCY = 'eur',
  PRICE_INTERVAL = 'month',
  PRODUCT_NAME = 'EB Motion – Website-Abo',
  ALLOWED_ORIGINS = 'http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173',
  PORT = '4242',
} = process.env;

const allowedOrigins = ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);

if (!STRIPE_SECRET_KEY) {
  console.warn(
    '\n⚠  STRIPE_SECRET_KEY fehlt. Lege eine .env an (siehe .env.example),\n' +
    '   sonst kann der Server keine Zahlung erstellen.\n'
  );
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const app = express();

// CORS: nur die freigegebenen Frontend-Adressen dürfen den Server ansprechen.
app.use(
  cors({
    origin(origin, cb) {
      // Anfragen ohne Origin (z. B. curl, Server-zu-Server) zulassen.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Origin nicht erlaubt: ' + origin));
    },
  })
);

/**
 * Stripe-Webhook (optional, aber empfohlen).
 * Braucht den ROHEN Body -> muss VOR express.json() registriert werden.
 */
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) return res.status(500).send('Server nicht konfiguriert.');

  let event;
  if (STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook-Signatur ungültig:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Ohne Secret nicht verifizierbar – nur fürs lokale Testen.
    try {
      event = JSON.parse(req.body.toString('utf8'));
    } catch {
      return res.status(400).send('Ungültiger Webhook-Body.');
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✓ Abo abgeschlossen:', event.data.object.id);
      // Hier könntest du z. B. eine Bestätigungs-E-Mail auslösen.
      break;
    case 'invoice.paid':
      console.log('✓ Zahlung erhalten:', event.data.object.id);
      break;
    case 'invoice.payment_failed':
      console.log('✗ Zahlung fehlgeschlagen:', event.data.object.id);
      break;
    default:
      break;
  }

  res.json({ received: true });
});

app.use(express.json());

// Einfacher Health-Check.
app.get('/health', (_req, res) => {
  res.json({ ok: true, configured: Boolean(stripe) });
});

// Rücksprung-URLs nur auf erlaubte Origins zulassen (verhindert Open-Redirects).
function safeReturnUrl(rawUrl, fallback) {
  try {
    const u = new URL(rawUrl);
    if (allowedOrigins.includes(u.origin)) return u.toString();
  } catch {
    /* ungültige URL -> Fallback */
  }
  return fallback;
}

/**
 * Erstellt eine Checkout-Session für das Abo und gibt { id, url } zurück.
 * Das Frontend leitet danach zu Stripe weiter.
 */
app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Server nicht konfiguriert: STRIPE_SECRET_KEY fehlt.' });
  }

  try {
    const reqOrigin =
      req.headers.origin && allowedOrigins.includes(req.headers.origin)
        ? req.headers.origin
        : allowedOrigins[0] || '';

    const successUrl = safeReturnUrl(req.body?.successUrl, `${reqOrigin}/?payment=success`);
    const cancelUrl = safeReturnUrl(req.body?.cancelUrl, `${reqOrigin}/?payment=cancel`);

    // Stripe ersetzt {CHECKOUT_SESSION_ID} durch die echte Session-ID.
    const successWithId = successUrl.includes('{CHECKOUT_SESSION_ID}')
      ? successUrl
      : successUrl + (successUrl.includes('?') ? '&' : '?') + 'session_id={CHECKOUT_SESSION_ID}';

    // Preis: entweder eine fertige Price-ID aus dem Dashboard ODER inline
    // definiert (praktisch zum Testen ganz ohne Dashboard-Produkt).
    const lineItem = STRIPE_PRICE_ID
      ? { price: STRIPE_PRICE_ID, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: PRICE_CURRENCY,
            product_data: { name: PRODUCT_NAME },
            unit_amount: Number(PRICE_AMOUNT),
            recurring: { interval: PRICE_INTERVAL },
          },
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [lineItem],
      success_url: successWithId,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Checkout-Fehler:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(Number(PORT), () => {
  console.log(`\n▶ EB Motion Checkout-Server: http://localhost:${PORT}`);
  console.log(`  Erlaubte Origins: ${allowedOrigins.join(', ')}`);
  console.log(`  Stripe konfiguriert: ${stripe ? 'ja' : 'NEIN (STRIPE_SECRET_KEY fehlt)'}\n`);
});
