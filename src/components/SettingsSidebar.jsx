import './SettingsSidebar.css';

const RECENT_CHANGES = [
  { label:'AR 3D Preview',     time:'2 hrs ago',  status:'ENABLED',  color:'#10B981' },
  { label:'Multi-proposal',    time:'1 day ago',  status:'DISABLED', color:'#EF4444' },
  { label:'Maintenance Mode',  time:'3 days ago', status:'DISABLED', color:'#EF4444' },
  { label:'New Registrations', time:'1 week ago', status:'ENABLED',  color:'#10B981' },
];

export default function SettingsSidebar({ onCount, offCount, unsaved }) {
  return (
    <div className="ss__wrap">

      {/* Toggle summary */}
      <div className="ss__panel">
        <h3 className="ss__panel-title">Toggle Summary</h3>
        <div className="ss__summary">
          <div className="ss__sum-row">
            <span>Features ON</span>
            <span className="ss__sum-val" style={{color:'#10B981'}}>{onCount} <span className="ss__dot" style={{background:'#10B981'}}/></span>
          </div>
          <div className="ss__sum-row">
            <span>Features OFF</span>
            <span className="ss__sum-val" style={{color:'#EF4444'}}>{offCount} <span className="ss__dot" style={{background:'#EF4444'}}/></span>
          </div>
          <div className="ss__sum-row">
            <span>Unsaved Changes</span>
            <span className="ss__sum-val" style={{color:'#FFA500'}}>{unsaved} <span className="ss__dot" style={{background:'#FFA500'}}/></span>
          </div>
        </div>
      </div>

      {/* Platform status */}
      <div className="ss__panel">
        <div className="ss__panel-header">
          <h3 className="ss__panel-title">Platform Status</h3>
          <span className="ss__live">● Live</span>
        </div>
        <div className="ss__status-list">
          {[
            { label:'Web Platform', value:'Online', color:'#10B981' },
            { label:'Mobile App',   value:'Online', color:'#10B981' },
            { label:'API',          value:'124ms',  color:'#10B981' },
            { label:'Database',     value:'Healthy',color:'#10B981' },
            { label:'CDN',          value:'Active', color:'#10B981' },
          ].map((s,i) => (
            <div key={i} className="ss__status-row">
              <span className="ss__status-lbl">{s.label}</span>
              <span className="ss__status-val">{s.value} <span className="ss__dot" style={{background:s.color}}/></span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent changes */}
      <div className="ss__panel">
        <h3 className="ss__panel-title">Recent Changes</h3>
        <div className="ss__changes">
          {RECENT_CHANGES.map((c,i) => (
            <div key={i} className="ss__change-row">
              <div>
                <p className="ss__change-lbl">{c.label}</p>
                <p className="ss__change-time">{c.time}</p>
              </div>
              <span className="ss__change-badge" style={{color:c.color, background:`${c.color}20`, border:`1px solid ${c.color}44`}}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
