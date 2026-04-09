import './PageStats.css';

export default function PageStats({ stats }) {
  return (
    <div className="pst__grid">
      {stats.map((s, i) => (
        <div key={i} className="pst__card">
          <p className="pst__label">{s.label}</p>
          <p className="pst__value">{s.value}</p>
          <p className="pst__sub" style={{ color: s.subColor || '#6B7280' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
