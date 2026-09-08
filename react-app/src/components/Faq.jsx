import SectionHead from './SectionHead.jsx';
import { faqs } from '../data.js';

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container narrow">
        <SectionHead
          eyebrow="FAQ"
          title="Häufige Fragen"
          sub="Noch offene Fragen? Schreib mir einfach – ich helfe gern weiter."
        />
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item reveal" key={i}>
              <summary>{f.q}</summary>
              <div className="faq-a"><p>{f.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
