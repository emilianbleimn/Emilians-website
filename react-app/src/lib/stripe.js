// Stripe-Konfiguration & Checkout-Hilfen für das Website-Abo.
// Der "publishable" Schlüssel ist bewusst öffentlich (Frontend-tauglich).
// Für den Live-Betrieb über eine .env überschreiben (siehe .env.example):
//   VITE_STRIPE_PUBLISHABLE_KEY, VITE_PAYMENTS_API

export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51Tjj5rJCNQMuzoGxAf2OeR2KLdkVQwe9QqF5gnhtqKUPOHrgFmq9BWSSO6Ofu86q5EISXEoYs4PmGTBBMnJdR0Uy00YQTbZHUt';

export const PAYMENTS_API =
  import.meta.env.VITE_PAYMENTS_API || 'http://localhost:4242';

let stripePromise;

// Stripe.js bei Bedarf laden (verbessert u. a. die Betrugserkennung).
export function getStripe() {
  if (stripePromise) return stripePromise;
  stripePromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { resolve(null); return; }
    if (window.Stripe) { resolve(window.Stripe(STRIPE_PUBLISHABLE_KEY)); return; }

    const ready = () => resolve(window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null);
    const existing = document.querySelector('script[src^="https://js.stripe.com/v3"]');
    if (existing) {
      existing.addEventListener('load', ready);
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/';
    s.async = true;
    s.onload = ready;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return stripePromise;
}

// Startet den Checkout: Session am Backend erstellen und zu Stripe weiterleiten.
export async function startSubscriptionCheckout() {
  const base = window.location.origin + window.location.pathname;
  const res = await fetch(`${PAYMENTS_API}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      successUrl: `${base}?payment=success`,
      cancelUrl: `${base}?payment=cancel`,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(data.error || 'Checkout konnte nicht gestartet werden.');
  }

  const stripe = await getStripe().catch(() => null);
  if (stripe) {
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) throw new Error(error.message);
  } else if (data.url) {
    window.location.href = data.url; // Fallback, falls Stripe.js nicht lädt
  } else {
    throw new Error('Stripe konnte nicht geladen werden.');
  }
}
