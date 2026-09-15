export default function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="section-head reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </div>
  );
}
