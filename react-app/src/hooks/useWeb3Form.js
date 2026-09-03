import { useCallback, useState } from 'react';

// Deine Kontakt-E-Mail (für den mailto-Fallback)
const CONTACT_EMAIL = 'emilian@ebsolutions.info';
// Solange kein echter Web3Forms-Key eingetragen ist, greift der mailto-Fallback.
const PLACEHOLDER_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

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

      const keyField = form.elements.namedItem('access_key');
      const key = keyField ? keyField.value.trim() : '';

      // Fallback: kein echter Key -> direkt mailto
      if (!key || key === PLACEHOLDER_KEY) {
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
