import { useCallback, useState } from 'react';

// Deine Kontakt-E-Mail (für den mailto-Fallback)
const CONTACT_EMAIL = 'emilian@ebsolutions.info';
// Web3Forms-Zugangsschluessel - hier eintragen, gilt fuer beide Formulare.
// Kostenlos auf https://web3forms.com/ mit der eigenen E-Mail-Adresse holen.
// Solange der Platzhalter steht, greift der mailto-Fallback.
const WEB3FORMS_KEY = '14525eac-f521-42b4-8804-57315dee9576';

function keyGesetzt() {
  const k = (WEB3FORMS_KEY || '').trim();
  return k.length > 20 && !k.includes('HIER');
}

export { WEB3FORMS_KEY };

const SKIP_FIELDS = ['access_key', 'subject', 'from_name', 'botcheck', 'redirect'];

function buildMailto(form, subject) {
  const lines = [];
  Array.from(form.elements).forEach((el) => {
    if (!el.name || SKIP_FIELDS.includes(el.name)) return;
    if (el.type === 'checkbox' && !el.checked) return;
    const val = (el.value || '').trim();
    if (!val) return;
    lines.push(`${el.name}: ${val}`);
  });
  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`
  );
}

/**
 * Formular-Versand über Web3Forms mit automatischem mailto-Fallback.
 * Liefert Status, Sende-Flag und einen Submit-Handler zurück.
 */
export function useWeb3Form(subject) {
  const [status, setStatus] = useState({ message: '', type: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const form = e.currentTarget;

      // Honeypot: von Bots ausgefüllt -> still abbrechen
      if (form.botcheck && form.botcheck.checked) return;

      if (!keyGesetzt()) {
        setStatus({ message: 'Dein E-Mail-Programm öffnet sich – bitte die Nachricht dort absenden.', type: 'info' });
        window.location.href = buildMailto(form, subject);
        return;
      }

      setSending(true);
      setStatus({ message: 'Wird gesendet …', type: 'info' });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
        .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
        .then(({ ok, json }) => {
          setSending(false);
          if (ok && json.success) {
            setStatus({
              message: '✓ Vielen Dank! Deine Nachricht ist angekommen. Ich melde mich innerhalb von 24 Stunden.',
              type: 'ok',
            });
            form.reset();
          } else {
            setStatus({ message: 'Sende-Dienst nicht erreichbar – dein E-Mail-Programm öffnet sich als Alternative.', type: 'info' });
            window.location.href = buildMailto(form, subject);
          }
        })
        .catch(() => {
          setSending(false);
          setStatus({ message: 'Verbindung fehlgeschlagen – dein E-Mail-Programm öffnet sich als Alternative.', type: 'info' });
          window.location.href = buildMailto(form, subject);
        });
    },
    [subject]
  );

  return { status, sending, handleSubmit };
}
