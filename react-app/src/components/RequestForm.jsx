import SectionHead from './SectionHead.jsx';
import { useWeb3Form } from '../hooks/useWeb3Form.js';

const SUBJECT = 'Neue Website-Anfrage über EB Solutions';

export default function RequestForm() {
  const { status, sending, handleSubmit } = useWeb3Form(SUBJECT);

  return (
    <section className="section section-cta" id="anfrage">
      <div className="cta-bg" aria-hidden="true"><span className="hero-glow"></span></div>
      <div className="container">
        <SectionHead
          eyebrow="Anfrage starten"
          title="Erzähl mir von deinem Projekt"
          sub="Fülle das Formular aus – ich melde mich innerhalb von 24 Stunden mit den nächsten Schritten. Unverbindlich & kostenlos."
        />

        <form className={`form card-form reveal${sending ? ' is-sending' : ''}`} onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" defaultValue="YOUR_WEB3FORMS_ACCESS_KEY" />
          <input type="hidden" name="subject" defaultValue={SUBJECT} />
          <input type="hidden" name="from_name" defaultValue="EB Solutions Website" />
          <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="form-grid">
            <div className="field"><label htmlFor="r-name">Name *</label><input id="r-name" name="Name" type="text" required autoComplete="name" placeholder="Max Mustermann" /></div>
            <div className="field"><label htmlFor="r-email">E-Mail *</label><input id="r-email" name="E-Mail" type="email" required autoComplete="email" placeholder="max@beispiel.de" /></div>
            <div className="field"><label htmlFor="r-phone">Telefon</label><input id="r-phone" name="Telefon" type="tel" autoComplete="tel" placeholder="Optional" /></div>
            <div className="field"><label htmlFor="r-company">Unternehmen</label><input id="r-company" name="Unternehmen" type="text" placeholder="Optional" /></div>
            <div className="field">
              <label htmlFor="r-timeline">Zeitrahmen</label>
              <select id="r-timeline" name="Zeitrahmen" defaultValue="">
                <option value="" disabled>Bitte wählen …</option>
                <option>So schnell wie möglich</option>
                <option>Innerhalb 1 Monat</option>
                <option>In 2 – 3 Monaten</option>
                <option>Flexibel</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="r-message">Projektbeschreibung *</label>
              <textarea id="r-message" name="Projektbeschreibung" rows="5" required placeholder="Worum geht es? Was soll deine Website können? Hast du schon Beispiele, die dir gefallen?"></textarea>
            </div>
          </div>

          <label className="consent">
            <input type="checkbox" required />
            <span>Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. *</span>
          </label>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Anfrage absenden</button>
          <p className={`form-status${status.type ? ` ${status.type}` : ''}`} role="status" aria-live="polite">{status.message}</p>
        </form>
      </div>
    </section>
  );
}
