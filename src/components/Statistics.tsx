/** Results stat band — a dark Deep Space Royal accent section with four outcome
 *  figures. Ported from the original static site. */
const STATS = [
  { num: "+312%", label: "Peak organic traffic growth" },
  { num: "247", label: "Editorial links earned" },
  { num: "84/84", label: "Local markets launched" },
  { num: "24h", label: "Response on every email" },
];

export function Statistics() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="eyebrow">By the numbers</span>
          <h2>Outcomes we&apos;ve <span className="highlight">engineered</span></h2>
        </div>
        <div className="stat-band">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
