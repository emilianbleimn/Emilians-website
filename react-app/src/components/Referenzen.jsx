import SectionHead from './SectionHead.jsx';
import { folios, testimonials } from '../data.js';

export default function Referenzen() {
  return (
    <section className="section" id="referenzen">
      <div className="container">
        <SectionHead
          eyebrow="Referenzen"
          title="Beispiele & Stimmen"
          sub="Ein kleiner Einblick in die Art von Projekten, die ich umsetze."
        />

        <div className="portfolio">
          {folios.map((f, i) => (
            <article className="folio reveal" key={i}>
              <div className={`folio-img ${f.cls}`} aria-hidden="true"><span>{f.tag}</span></div>
              <div className="folio-body">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonials">
          {testimonials.map((t, i) => (
            <figure className="quote reveal" key={i}>
              <div className="stars" aria-label="5 von 5 Sternen">★★★★★</div>
              <blockquote>{t.quote}</blockquote>
              <figcaption>{t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
