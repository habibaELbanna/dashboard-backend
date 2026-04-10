import './AppSidebar.css';

const PUSH_NOTIFS = [
  { label:'Maintenance Alert', tag:'ALL',     delivered:'12,847', time:'2 hrs ago' },
  { label:'New Feature',       tag:'VENDORS', delivered:'8,637',  time:'1 day'     },
  { label:'Weekly Digest',     tag:'ALL',     delivered:'11,204', time:'5 days'    },
];

const CONTENT_REPORTS = [
  { tag:'SPAM',          desc:'Vendor promoting fake products…'  },
  { tag:'INAPPROPRIATE', desc:'Offensive language in message…'   },
  { tag:'FAKE',          desc:'Need posting is not genuine…'     },
];

const TAG_STYLE = {
  ALL:         { color:'#6B7280', bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.3)' },
  VENDORS:     { color:'#10B981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)'  },
  SPAM:        { color:'#EF4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)'   },
  INAPPROPRIATE:{ color:'#FFA500',bg:'rgba(255,165,0,0.15)',   border:'rgba(255,165,0,0.3)'   },
  FAKE:        { color:'#6B7280', bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.3)' },
};

export default function AppSidebar() {
  return (
    <div className="asb__wrap">

      {/* Version info */}
      <div className="asb__card">
        <div className="asb__version-row">
          <span className="asb__os-dot asb__os-dot--ios"/>
          <span className="asb__os-name">iOS</span>
          <span className="asb__version">v2.4.1</span>
          <span className="asb__status asb__status--live">Live</span>
        </div>
        <div className="asb__version-row">
          <span className="asb__os-dot asb__os-dot--android"/>
          <span className="asb__os-name">Android</span>
          <span className="asb__version">v2.4.0</span>
          <span className="asb__status asb__status--pending">Pending</span>
        </div>
        <div className="asb__force-row">
          <span className="asb__force-label">Force Update</span>
          <div className="asb__toggle-sm"/>
        </div>
        <button className="asb__manage-btn">Manage Version →</button>
      </div>

      {/* Push Notifications */}
      <div className="asb__card">
        <div className="asb__card-header">
          <h3 className="asb__card-title">Push Notifications</h3>
          <button className="asb__send-btn">Send New</button>
        </div>
        <div className="asb__notif-list">
          {PUSH_NOTIFS.map((n,i) => {
            const ts = TAG_STYLE[n.tag] || TAG_STYLE.ALL;
            return (
              <div key={i} className="asb__notif-row">
                <div>
                  <p className="asb__notif-label">{n.label}</p>
                  <div className="asb__notif-meta">
                    <span className="asb__tag" style={{ color:ts.color, background:ts.bg, border:`1px solid ${ts.border}` }}>{n.tag}</span>
                    <span className="asb__notif-delivered">{n.delivered} delivered</span>
                  </div>
                </div>
                <span className="asb__notif-time">{n.time}</span>
              </div>
            );
          })}
        </div>
        <button className="asb__view-all-btn">View all notifications →</button>
      </div>

      {/* Content Reports */}
      <div className="asb__card">
        <div className="asb__card-header">
          <h3 className="asb__card-title">Content Reports</h3>
          <span className="asb__badge-red">12</span>
        </div>
        <div className="asb__report-list">
          {CONTENT_REPORTS.map((r,i) => {
            const ts = TAG_STYLE[r.tag] || TAG_STYLE.SPAM;
            return (
              <div key={i} className="asb__report-row">
                <div>
                  <span className="asb__tag" style={{ color:ts.color, background:ts.bg, border:`1px solid ${ts.border}` }}>{r.tag}</span>
                  <p className="asb__report-desc">{r.desc}</p>
                </div>
                <button className="asb__review-btn">Review</button>
              </div>
            );
          })}
        </div>
        <button className="asb__view-all-btn">View all 12 →</button>
      </div>

    </div>
  );
}
