import './Charts.css';

const barHeights = [65, 78, 82, 71, 88, 92, 85, 90, 95, 88, 92, 98];

const categories = [
  { name: 'Construction', pct: 38 },
  { name: 'Technology', pct: 24 },
  { name: 'Office Supplies', pct: 16 },
  { name: 'Logistics', pct: 12 },
  { name: 'Energy', pct: 6 },
  { name: 'Other', pct: 4 },
];

const health = [
  { name: 'API Response Time', value: '124ms', color: '#10B981' },
  { name: 'Uptime', value: '99.98%', color: '#10B981' },
  { name: 'Failed Logins Today', value: '3', color: '#10B981' },
  { name: 'Reported Content', value: '12', color: '#FFA500' },
  { name: 'Pending Actions', value: '31', color: '#FFA500' },
];

export default function Charts() {
  return (
    <div className="ch__grid">

      {/* User Growth */}
      <div className="ch__card">
        <div className="ch__card-header">
          <h3 className="ch__title">User Growth</h3>
          <span className="ch__period">Last 30 days</span>
        </div>
        <div className="ch__bar-chart">
          {barHeights.map((h, i) => (
            <div key={i} className="ch__bar-group">
              <div className="ch__bar ch__bar--buyers" style={{ height: `${h}px` }} />
              <div className="ch__bar ch__bar--vendors" style={{ height: `${h * 0.6}px` }} />
            </div>
          ))}
        </div>
        <div className="ch__legend">
          <div className="ch__legend-item">
            <div className="ch__legend-dot ch__legend-dot--buyers" />
            <span>Buyers</span>
          </div>
          <div className="ch__legend-item">
            <div className="ch__legend-dot ch__legend-dot--vendors" />
            <span>Vendors</span>
          </div>
        </div>
      </div>

      {/* Needs by Category */}
      <div className="ch__card">
        <h3 className="ch__title">Needs by Category</h3>
        <div className="ch__categories">
          {categories.map((cat, i) => (
            <div key={i} className="ch__cat-row">
              <span className="ch__cat-name">{cat.name}</span>
              <div className="ch__cat-bar">
                <div className="ch__cat-fill" style={{ width: `${cat.pct}%` }} />
              </div>
              <span className="ch__cat-pct">{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Health */}
      <div className="ch__card">
        <h3 className="ch__title">Platform Health</h3>
        <div className="ch__health">
          {health.map((item, i) => (
            <div key={i} className={`ch__health-row ${i < health.length - 1 ? 'ch__health-row--border' : ''}`}>
              <span className="ch__health-name">{item.name}</span>
              <div className="ch__health-right">
                <span className="ch__health-value">{item.value}</span>
                <div className="ch__health-dot" style={{ background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
