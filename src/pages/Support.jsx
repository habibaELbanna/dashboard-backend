import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import Pagination from '../components/Pagination';
import TicketBreakdown from '../components/TicketBreakdown';
import './Support.css';

const FB_TICKETS = [
  { id:'T-1047', title:'Proposal not received after payment', user:'Ahmed Hassan',   initials:'AH', type:'BUG',      priority:'critical', status:'open',        assigned:'Sara (Admin)', time:'2 hrs ago' },
  { id:'T-1046', title:'Payment issue — Delta Corp',          user:'Delta Group',    initials:'DG', type:'BILLING',  priority:'high',     status:'in_progress', assigned:'MK (Admin)',  time:'3 hrs ago' },
  { id:'T-1045', title:'Profile verification taking too long',user:'PowerGen Egypt', initials:'PE', type:'ACCOUNT',  priority:'medium',   status:'open',        assigned:'',            time:'4 hrs ago' },
  { id:'T-1044', title:'Wrong category shown on browse feed', user:'Nour Khaled',    initials:'NK', type:'BUG',      priority:'low',      status:'open',        assigned:'SA (Admin)',  time:'5 hrs ago' },
  { id:'T-1043', title:'Cannot upload proposal attachments',  user:'BuildRight',     initials:'BR', type:'BUG',      priority:'high',     status:'in_progress', assigned:'MK (Admin)',  time:'6 hrs ago' },
  { id:'T-1042', title:'Vendor not responding to messages',   user:'Horizon Group',  initials:'HG', type:'OTHER',    priority:'medium',   status:'open',        assigned:'',            time:'8 hrs ago' },
  { id:'T-1041', title:'Promo code not working at checkout',  user:'Safeguard RE',   initials:'SR', type:'BILLING',  priority:'high',     status:'in_progress', assigned:'SA (Admin)',  time:'10 hrs ago'},
  { id:'T-1040', title:'Need expired before deadline',        user:'Office Line',    initials:'OL', type:'BUG',      priority:'medium',   status:'open',        assigned:'',            time:'12 hrs ago'},
  { id:'T-1039', title:'Account suspended without reason',    user:'MediSource',     initials:'MS', type:'ACCOUNT',  priority:'critical', status:'in_progress', assigned:'SA (Admin)',  time:'1 day ago' },
  { id:'T-1038', title:'Proposal submitted twice by mistake', user:'TechSupply',     initials:'TS', type:'PROPOSAL', priority:'low',      status:'open',        assigned:'',            time:'1 day ago' },
  { id:'T-1037', title:'Cannot change account email address', user:'FastVend',       initials:'FV', type:'ACCOUNT',  priority:'medium',   status:'resolved',    assigned:'MK (Admin)',  time:'2 days ago'},
  { id:'T-1036', title:'Browse feed not loading on mobile',   user:'AlphaTech',      initials:'AT', type:'BUG',      priority:'high',     status:'resolved',    assigned:'SA (Admin)',  time:'2 days ago'},
];

const PRIORITY_STYLE = {
  critical:{ label:'CRITICAL', color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
  high:    { label:'HIGH',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)'  },
  medium:  { label:'MEDIUM',   color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
  low:     { label:'LOW',      color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
};
const STATUS_STYLE = {
  open:       { label:'OPEN',        color:'#00A7E5', bg:'rgba(0,167,229,0.12)',   border:'rgba(0,167,229,0.3)'   },
  in_progress:{ label:'IN PROGRESS', color:'#10B981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.3)'  },
  resolved:   { label:'RESOLVED',    color:'#6B7280', bg:'rgba(107,114,128,0.12)', border:'rgba(107,114,128,0.3)' },
};
const TYPE_STYLE = {
  BUG:     { color:'#EF4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)'   },
  BILLING: { color:'#FFA500', bg:'rgba(255,165,0,0.1)',   border:'rgba(255,165,0,0.25)'   },
  ACCOUNT: { color:'#00A7E5', bg:'rgba(0,167,229,0.1)',   border:'rgba(0,167,229,0.25)'   },
  PROPOSAL:{ color:'#10B981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)'  },
  OTHER:   { color:'#6B7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.25)' },
};

export default function Support() {
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [counts,   setCounts]   = useState({ open:0, inProgress:0, resolvedToday:0, avgTime:'6.4 hrs' });
  const [tabFilter,setTabFilter]= useState('all');
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [{ count:open }, { count:inProgress }, { count:resolved }] = await Promise.all([
          supabase.from('support_tickets').select('*', { count:'exact', head:true }).eq('status','open'),
          supabase.from('support_tickets').select('*', { count:'exact', head:true }).eq('status','in_progress'),
          supabase.from('support_tickets').select('*', { count:'exact', head:true }).eq('status','resolved'),
        ]);
        setCounts({ open:open||47, inProgress:inProgress||18, resolvedToday:resolved||12, avgTime:'6.4 hrs' });
      } catch { setCounts({ open:47, inProgress:18, resolvedToday:12, avgTime:'6.4 hrs' }); }
    }
    fetchCounts();
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('support_tickets')
        .select('id, title, status, priority, ticket_type, created_at, assigned_to')
        .order('created_at', { ascending:false })
        .range((page-1)*12, page*12-1);
      if (tabFilter !== 'all') query = query.eq('status', tabFilter);
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('empty');
      setTickets(data.map(t => ({
        id:       `T-${t.id}`,
        title:    t.title || '—',
        user:     '—', initials:'?',
        type:     (t.ticket_type||'BUG').toUpperCase(),
        priority: t.priority || 'medium',
        status:   t.status || 'open',
        assigned: t.assigned_to || '',
        time:     timeAgo(t.created_at),
      })));
    } catch { setTickets(FB_TICKETS); }
    finally { setLoading(false); }
  }, [page, tabFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  function timeAgo(str) {
    if (!str) return '—';
    const m = Math.floor((Date.now() - new Date(str)) / 60000);
    if (m < 60) return `${m} min ago`;
    if (m < 1440) return `${Math.floor(m/60)} hrs ago`;
    return `${Math.floor(m/1440)} days ago`;
  }

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key:'all',        label:'All Tickets',  count: counts.open + counts.inProgress },
    { key:'open',       label:'Open',         count: counts.open },
    { key:'in_progress',label:'In Progress',  count: counts.inProgress },
    { key:'resolved',   label:'Resolved',     count: null },
  ];

  const STATS = [
    { label:'OPEN TICKETS',      value: counts.open?.toLocaleString()||'0',         sub:'↑ 5 this week',     subColor:'#EF4444' },
    { label:'IN PROGRESS',       value: counts.inProgress?.toLocaleString()||'0',   sub:'Assigned to agents', subColor:'#6B7280' },
    { label:'RESOLVED TODAY',    value: counts.resolvedToday?.toLocaleString()||'0', sub:'↑ 3 vs yesterday',  subColor:'#10B981' },
    { label:'AVG. RESOLUTION TIME', value: counts.avgTime,                          sub:'Target under 8 hours',subColor:'#10B981'},
  ];

  return (
    <PageLayout title="Support" subtitle="Manage buyer and vendor support tickets and disputes">
      <div className="sp__content">
        <PageStats stats={STATS} />

        {/* Tabs */}
        <div className="sp__tabs">
          {TABS.map(t => (
            <button key={t.key} className={`sp__tab ${tabFilter===t.key?'sp__tab--active':''}`} onClick={() => { setTabFilter(t.key); setPage(1); }}>
              {t.label}
              {t.count !== null && <span className="sp__tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="sp__filters">
          <div className="sp__search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="sp__search" placeholder="Search by ticket ID, user, subject…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <select className="sp__select"><option>Priority: All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
          <select className="sp__select"><option>Type: All</option><option>Bug</option><option>Billing</option><option>Account</option><option>Proposal</option></select>
          <select className="sp__select"><option>Assigned: All</option><option>Unassigned</option></select>
          <button className="sp__clear" onClick={() => setSearch('')}>Clear filters</button>
        </div>

        {/* Table */}
        <div className="sp__table-wrap">
          {loading ? <div className="sp__loading">Loading…</div> : (
            <table className="sp__table">
              <thead>
                <tr>
                  <th>TICKET</th>
                  <th className="sp__hide-sm">USER</th>
                  <th>TYPE</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th className="sp__hide-sm">ASSIGNED</th>
                  <th className="sp__hide-sm">CREATED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => {
                  const pr = PRIORITY_STYLE[row.priority] || PRIORITY_STYLE.medium;
                  const st = STATUS_STYLE[row.status]     || STATUS_STYLE.open;
                  const tp = TYPE_STYLE[row.type]         || TYPE_STYLE.OTHER;
                  return (
                    <tr key={row.id}>
                      <td>
                        <p className="sp__ticket-id">#{row.id}</p>
                        <p className="sp__ticket-title">{row.title}</p>
                        <p className="sp__ticket-sub">{row.type.charAt(0)+row.type.slice(1).toLowerCase()}</p>
                      </td>
                      <td className="sp__hide-sm">
                        <div className="sp__user">
                          <div className="sp__av">{row.initials}</div>
                          <span className="sp__user-name">{row.user}</span>
                        </div>
                      </td>
                      <td><span className="sp__badge" style={{ color:tp.color, background:tp.bg, border:`1px solid ${tp.border}` }}>{row.type}</span></td>
                      <td><span className="sp__badge" style={{ color:pr.color, background:pr.bg, border:`1px solid ${pr.border}` }}>{pr.label}</span></td>
                      <td><span className="sp__badge" style={{ color:st.color, background:st.bg, border:`1px solid ${st.border}` }}>{st.label}</span></td>
                      <td className="sp__hide-sm sp__muted">{row.assigned || <span style={{color:'#EF4444'}}>Unassigned</span>}</td>
                      <td className="sp__hide-sm sp__muted">{row.time}</td>
                      <td>
                        <button className="sp__action-btn">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <Pagination page={page} total={counts.open + counts.inProgress} perPage={12} onChange={setPage} />

        <TicketBreakdown />
      </div>
    </PageLayout>
  );
}
