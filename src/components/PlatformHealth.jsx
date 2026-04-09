import './PlatformHealth.css';

const HEALTH_ITEMS = [
  { label:'API Response Time',     value:'124ms',  color:'#10B981' },
  { label:'Server Uptime',         value:'99.98%', color:'#10B981' },
  { label:'Mobile App Sessions',   value:'8,421',  color:'#10B981' },
  { label:'Failed Login Attempts', value:'14',     color:'#10B981' },
  { label:'Flagged Content Today', value:'12',     color:'#EF4444' },
  { label:'Pending Verifications', value:'23',     color:'#FFA500' },
  { label:'Support Tickets Open',  value:'7',      color:'#FFA500' },
  { label:'Critical Errors Today', value:'0',      color:'#10B981' },
];

export default function PlatformHealth() {
  return (
    <div className="ph__card">
      <div className="ph__header">
        <h3 className="ph__title">Platform Health</h3>
        <span className="ph__live">● Live</span>
      </div>
      <div className="ph__list">
        {HEALTH_ITEMS.map((item, i) => (
          <div key={i} className="ph__row">
            <span className="ph__label">{item.label}</span>
            <div className="ph__right">
              <span className="ph__value">{item.value}</span>
              <span className="ph__dot" style={{ background: item.color }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
