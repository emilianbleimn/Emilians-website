import { Fragment } from 'react';

const ITEMS = ['Persönlich', 'Modern', 'Ehrlich', 'Durchdacht', 'Individuell', 'Zuverlässig', 'Fair'];

function Track({ hidden }) {
  return (
    <div className="marquee-track" aria-hidden={hidden || undefined}>
      {ITEMS.map((word, i) => (
        <Fragment key={i}>
          <span>{word}</span>
          <span className="m-dot">✦</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Was uns auszeichnet">
      <Track />
      <Track hidden />
    </section>
  );
}
