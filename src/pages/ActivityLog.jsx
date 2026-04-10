import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import Pagination from '../components/Pagination';
import SeveritySummary from '../components/SeveritySummary';
import './ActivityLog.css';

const FB_LOGS = [
  { id:1,  action:'Created promo code RAMADAN25',             category:'MARKETING',    target:'RAMADAN25',            ip:'102.45.67.9',  severity:'info'     },
  { id:2,  action:'Sent platform announcement — Maintenance alert', category:'SETTINGS', target:'All Users',           ip:'197.48.12.4',  severity:'high'     },
  { id:3,  action:'Deleted need — Corporate Gift Boxes (expired)',  category:'NEEDS',   target:'Corporate Gift Boxes', ip:'41.32.87.21',  severity:'high'     },
  { id:4,  action:'Responded to support ticket #T-1047',      category:'SUPPORT',      target:'#T-1047',              ip:'197.48.90.3',  severity:'info'     },
  { id:5,  action:'Invited new admin — Youssef Mostafa',      category:'ROLES',        target:'Youssef Mostafa',      ip:'197.48.12.4',  severity:'critical' },
  { id:6,  action:'Featured vendor — NileTrans Logistics',    category:'MARKETING',    target:'NileTrans Logistics',  ip:'156.214.42.8', severity:'medium'   },
  { id:7,  action:'Updated email template — Welcome Email',   category:'SETTINGS',     target:'Welcome Email',        ip:'102.45.67.9',  severity:'info'     },
  { id:8,  action:'Manually verified buyer — Sara Kamal',     category:'VERIFICATION', target:'Sara Kamal',           ip:'196.12.34.77', severity:'high'     },
  { id:9,  action:'Logged in from new IP address',            category:'AUTH',         target:'197.48.12.4',          ip:'197.48.12.4',  severity:'critical' },
  { id:10, action:'Logged in',                                category:'AUTH',         target:'41.32.87.21',          ip:'41.32.87.21',  severity:'info'     },
];

const FB_LOGINS = [
  { initials:'SA', name:'Sara Ahmed',    ip:'197.48.12.4',    time:'08:03 AM', status:'success' },
  { initials:'MK', name:'Mohamed Kamal', ip:'41.32.87.21',    time:'07:58 AM', status:'success' },
  { initials:'NA', name:'Nadia Ashraf',  ip:'156.214.42.8',   time:'08:15 AM', status:'success' },
  { initials:'SA', name:'Sara Ahmed',    ip:'203.12.44.91',   time:'Yesterday 11:42 PM', status:'failed' },
  { initials:'KH', name:'Khalid Hassan', ip:'102.45.67.9',    time:'Yesterday 09:21 AM', status:'success' },
  { initials:'RM', name:'Rania Mahmoud', ip:'196.12.34.77',   time:'Yesterday 08:47 AM', status:'success' },
];

const SEVERITY_STYLE = {
  critical:{ label:'CRITICAL', color:'#EF4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)'   },
  high:    { label:'HIGH',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',   border:'rgba(255,165,0,0.3)'   },
  medium:  { label:'MEDIUM',   color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)' },
  info:    { label:'INFO',     color:'#00A7E5', bg:'rgba(0,167,229,0.12)',   border:'rgba(0,167,229,0.3)'   },
};

const CAT_STYLE = {
  MARKETING:    { color:'#00A7E5', bg:'rgba(0,167,229,0.1)',   border:'rgba(0,167,229,0.25)'   },
  SETTINGS:     { color:'#6B7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.25)' },
  NEEDS:        { color:'#10B981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)'  },
  SUPPORT:      { color:'#FFA500', bg:'rgba(255,165,0,0.1)',   border:'rgba(255,165,0,0.25)'   },
  ROLES:        { color:'#EF4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)'   },
  VERIFICATION: { color:'#10B981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)'  },
  AUTH:         { color:'#6B7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.25)' },
};

export default function ActivityLog() {
  const [logs,    setLogs]    = useState([]);
  const [logins,  setLogins]  = useState(FB_LOGINS);
  const [loading, setLoading] = useState(true);
  const [counts,  setCounts]  = useState({ today:284, activeAdmins:3, critical:7, total:48291 });
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('id, action, category, target, ip_address, severity, created_at, admin_id')
        .order('created_at', { ascending: false })
        .range((page-1)*10, page*10-1);
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('empty');

      setLogs(data.map(l => ({
        id:       l.id,
        action:   l.action || '—',
        category: (l.category||'AUTH').toUpperCase(),
        target:   l.target || '—',
        ip:       l.ip_address || '—',
        severity: l.severity || 'info',
      })));
    } catch { setLogs(FB_LOGS); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase())
  );

  const STATS = [
    { label:'TOTAL ACTIONS TODAY', value: counts.today?.toLocaleString()||'0',        sub:'↑ 12% vs yesterday',  subColor:'#10B981' },
    { label:'ACTIVE ADMINS NOW',   value: counts.activeAdmins?.toString()||'0',       sub:'Sara · Mohamed · Nadia', subColor:'#00A7E5' },
    { label:'CRITICAL ACTIONS',    value: counts.critical?.toString()||'0',           sub:'Require attention',   subColor:'#EF4444' },
    { label:'LOG ENTRIES TOTAL',   value: counts.total?.toLocaleString()||'0',        sub:'Since platform launch',subColor:'#6B7280' },
  ];

  return (
    <PageLayout title="Activity Log" subtitle="Full audit trail of all admin actions across the platform">
      <div className="al__content">
        <PageStats stats={STATS} />

        <div className="al__grid">
          {/* Left: log table */}
          <div className="al__left">
            <div className="al__filters">
              <div className="al__search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input className="al__search" placeholder="Search actions, categories…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <select className="al__select"><option>Category: All</option><option>Auth</option><option>Marketing</option><option>Settings</option><option>Needs</option><option>Roles</option></select>
              <select className="al__select"><option>Severity: All</option><option>Critical</option><option>High</option><option>Medium</option><option>Info</option></select>
              <button className="al__clear" onClick={() => setSearch('')}>Clear filters</button>
            </div>

            <div className="al__table-wrap">
              {loading ? <div className="al__loading">Loading…</div> : (
                <table className="al__table">
                  <tbody>
                    {filtered.map(row => {
                      const sv = SEVERITY_STYLE[row.severity] || SEVERITY_STYLE.info;
                      const ct = CAT_STYLE[row.category]      || CAT_STYLE.AUTH;
                      return (
                        <tr key={row.id}>
                          <td className="al__action-col">
                            <p className="al__action-text">{row.action}</p>
                          </td>
                          <td><span className="al__badge" style={{ color:ct.color, background:ct.bg, border:`1px solid ${ct.border}` }}>{row.category}</span></td>
                          <td className="al__muted al__hide-sm">{row.target}</td>
                          <td className="al__muted al__hide-md">{row.ip}</td>
                          <td><span className="al__badge" style={{ color:sv.color, background:sv.bg, border:`1px solid ${sv.border}` }}>{sv.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <Pagination page={page} total={counts.total} perPage={10} onChange={setPage} />
          </div>

          {/* Right: severity + recent logins */}
          <div className="al__right">
            <SeveritySummary />

            <div className="al__logins-card">
              <h3 className="al__logins-title">Recent Logins</h3>
              {logins.map((l,i) => (
                <div key={i} className="al__login-row">
                  <div className="al__login-av">{l.initials}</div>
                  <div className="al__login-info">
                    <p className="al__login-name">{l.name}</p>
                    <p className="al__login-ip">{l.ip}</p>
                  </div>
                  <div className="al__login-right">
                    <p className="al__login-time">{l.time}</p>
                    <span className={`al__login-dot ${l.status==='failed'?'al__login-dot--fail':''}`}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
