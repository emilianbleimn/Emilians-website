import SectionHead from './SectionHead.jsx';
import { steps } from '../data.js';

export default function Process() {
  return (
    <section className="section" id="ablauf">
      <div className="container">
        <SectionHead
          eyebrow="Ablauf"
          title="In 4 Schritten zur fertigen Website"
          sub="Klar strukturiert und entspannt – du weißt jederzeit, was als Nächstes passiert."
        />
        <ol className="steps">
          {steps.map((s) => (
            <li className="step reveal" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
