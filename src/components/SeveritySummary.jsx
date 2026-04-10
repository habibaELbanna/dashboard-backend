import './SeveritySummary.css';

const ITEMS = [
  { label:'CRITICAL', count:7,   color:'#EF4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)',   pct:5  },
  { label:'HIGH',     count:48,  color:'#FFA500', bg:'rgba(255,165,0,0.12)',   border:'rgba(255,165,0,0.3)',   pct:35 },
  { label:'MEDIUM',   count:94,  color:'#6B7280', bg:'rgba(107,114,128,0.12)', border:'rgba(107,114,128,0.3)', pct:70 },
  { label:'INFO',     count:135, color:'#00A7E5', bg:'rgba(0,167,229,0.12)',   border:'rgba(0,167,229,0.3)',   pct:100},
];

export default function SeveritySummary() {
  return (
    <div className="ss2__card">
      <div className="ss2__header">
        <h3 className="ss2__title">Severity Summary</h3>
      </div>
      <div className="ss2__list">
        {ITEMS.map((item,i) => (
          <div key={i} className="ss2__row">
            <span className="ss2__badge" style={{ color:item.color, background:item.bg, border:`1px solid ${item.border}` }}>{item.label}</span>
            <span className="ss2__count">{item.count}</span>
            <div className="ss2__bar"><div className="ss2__fill" style={{ width:`${item.pct}%`, background:item.color }}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}
