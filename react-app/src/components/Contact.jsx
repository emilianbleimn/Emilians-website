import { useWeb3Form } from '../hooks/useWeb3Form.js';

const SUBJECT = 'Neue Nachricht über EB Motion';

export default function Contact() {
  const { status, sending, handleSubmit } = useWeb3Form(SUBJECT);

  return (
    <section className="section section-alt" id="kontakt">
      <div className="container two-col contact-col">
        <div className="contact-info reveal">
          <span className="eyebrow">Kontakt</span>
          <h2>Du hast eine Frage?</h2>
          <p className="section-sub">
            Schreib mir – ob kurze Frage oder erstes Kennenlernen. Ich antworte in der Regel
            innerhalb von 24 Stunden.
          </p>
          <ul className="contact-list">
            <li>
              <span className="contact-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
              <div><strong>E-Mail</strong><a href="mailto:emilianbleimn@gmail.com">emilianbleimn@gmail.com</a></div>
            </li>
            <li>
              <span className="contact-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></span>
              <div><strong>Antwortzeit</strong><span>Innerhalb von 24 Stunden</span></div>
            </li>
            <li>
              <span className="contact-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg></span>
              <div><strong>Unverbindlich</strong><span>Erstgespräch & Angebot kostenlos</span></div>
            </li>
          </ul>
        </div>

        <form className={`form card-form reveal${sending ? ' is-sending' : ''}`} onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" defaultValue="YOUR_WEB3FORMS_ACCESS_KEY" />
          <input type="hidden" name="subject" defaultValue={SUBJECT} />
          <input type="hidden" name="from_name" defaultValue="EB Motion Website" />
          <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="field"><label htmlFor="c-name">Name *</label><input id="c-name" name="Name" type="text" required autoComplete="name" placeholder="Dein Name" /></div>
          <div className="field"><label htmlFor="c-email">E-Mail *</label><input id="c-email" name="E-Mail" type="email" required autoComplete="email" placeholder="dein@beispiel.de" /></div>
          <div className="field"><label htmlFor="c-message">Nachricht *</label><textarea id="c-message" name="Nachricht" rows="5" required placeholder="Wie kann ich dir helfen?"></textarea></div>
          <label className="consent">
            <input type="checkbox" required />
            <span>Ich bin mit der Speicherung meiner Angaben zur Bearbeitung einverstanden. *</span>
          </label>
          <button type="submit" className="btn btn-primary btn-block">Nachricht senden</button>
          <p className={`form-status${status.type ? ` ${status.type}` : ''}`} role="status" aria-live="polite">{status.message}</p>
        </form>
      </div>
    </section>
  );
}
