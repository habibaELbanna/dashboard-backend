import './TicketBreakdown.css';

const PRIORITY = [
  { label:'CRITICAL', count:8,  color:'#EF4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)',  pct:17 },
  { label:'HIGH',     count:14, color:'#FFA500', bg:'rgba(255,165,0,0.12)',   border:'rgba(255,165,0,0.3)',  pct:30 },
  { label:'MEDIUM',   count:18, color:'#6B7280', bg:'rgba(107,114,128,0.12)', border:'rgba(107,114,128,0.3)',pct:38 },
  { label:'LOW',      count:7,  color:'#00A7E5', bg:'rgba(0,167,229,0.12)',   border:'rgba(0,167,229,0.3)',  pct:15 },
];
const TYPES = [
  { label:'Bug',      count:18, pct:70 },
  { label:'Billing',  count:9,  pct:50 },
  { label:'Account',  count:11, pct:60 },
  { label:'Proposal', count:6,  pct:30 },
  { label:'Other',    count:3,  pct:15 },
];
const AGENTS = [
  { initials:'SA', name:'Sara Admin',    detail:'12 open · 8 resolved',    time:'4.2 hrs' },
  { initials:'MK', name:'Mohamed K.',    detail:'6 open · 14 resolved',    time:'5.8 hrs' },
  { initials:'!',  name:'Unassigned',    detail:'29 unassigned tickets',   time:'',        warn:true },
];
const QUICK_ACTIONS = ['Assign All Unassigned','Export Open Tickets','Send Status Update'];

export default function TicketBreakdown() {
  return (
    <div className="tb__grid">
      {/* Priority Breakdown */}
      <div className="tb__card">
        <h3 className="tb__card-title">Priority Breakdown</h3>
        <div className="tb__priority-list">
          {PRIORITY.map((p,i) => (
            <div key={i} className="tb__priority-row">
              <span className="tb__priority-badge" style={{ color:p.color, background:p.bg, border:`1px solid ${p.border}` }}>{p.label}</span>
              <div className="tb__priority-bar"><div className="tb__priority-fill" style={{ width:`${p.pct*3}px`, background:p.color }}/></div>
              <span className="tb__priority-count">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Types */}
      <div className="tb__card">
        <h3 className="tb__card-title">Ticket Types</h3>
        <div className="tb__types-list">
          {TYPES.map((t,i) => (
            <div key={i} className="tb__type-row">
              <span className="tb__type-label">{t.label}</span>
              <div className="tb__type-bar"><div className="tb__type-fill" style={{ width:`${t.pct}%` }}/></div>
              <span className="tb__type-count">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance */}
      <div className="tb__card">
        <h3 className="tb__card-title">Agent Performance</h3>
        <div className="tb__agents-list">
          {AGENTS.map((a,i) => (
            <div key={i} className="tb__agent-row">
              <div className={`tb__agent-av ${a.warn?'tb__agent-av--warn':''}`}>{a.initials}</div>
              <div className="tb__agent-info">
                <p className="tb__agent-name" style={{ color: a.warn ? '#EF4444' : '#fff' }}>{a.name}</p>
                <p className="tb__agent-detail">{a.detail}</p>
              </div>
              {a.time && <span className="tb__agent-time">{a.time}</span>}
              {a.warn && <span className="tb__agent-warn">Needs attention</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="tb__card tb__quick">
        <h3 className="tb__card-title">Quick Actions</h3>
        <div className="tb__quick-list">
          {QUICK_ACTIONS.map((a,i) => (
            <button key={i} className="tb__quick-btn">{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
