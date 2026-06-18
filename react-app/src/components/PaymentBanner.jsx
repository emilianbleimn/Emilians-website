import { useCallback, useEffect, useState } from 'react';

// Zeigt nach der Rückkehr von Stripe (?payment=success|cancel) einen Hinweis
// und räumt den Query-Parameter anschließend wieder aus der URL.
export default function PaymentBanner() {
  const [state, setState] = useState(null); // 'success' | 'cancel' | null

  const dismiss = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('payment');
    params.delete('session_id');
    const qs = params.toString();
    const clean = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    window.history.replaceState({}, document.title, clean);
    setState(null);
  }, []);

  useEffect(() => {
    const pay = new URLSearchParams(window.location.search).get('payment');
    if (pay !== 'success' && pay !== 'cancel') return undefined;
    setState(pay);
    if (pay === 'success') {
      const t = window.setTimeout(dismiss, 9000);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [dismiss]);

  if (!state) return null;

  return (
    <div className={`pay-banner is-${state === 'success' ? 'success' : 'cancel'}`} role="status">
      <span className="pay-banner-text">
        {state === 'success'
          ? '✓ Vielen Dank! Dein Abo ist aktiviert – du erhältst gleich eine Bestätigung per E-Mail.'
          : 'Bezahlung abgebrochen – du kannst es jederzeit erneut versuchen.'}
      </span>
      <button type="button" className="pay-banner-close" aria-label="Hinweis schließen" onClick={dismiss}>
        &times;
      </button>
    </div>
  );
}
