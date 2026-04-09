import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';


import './Users.css';
import PageLayout from '../components/PageLayout';

function getInitials(name) {
  if (!name) return '??';
  const words = name.trim().split(' ');
  return words.length >= 2 ? (words[0][0]+words[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}
function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function StatusBadge({ status }) {
  const s = (status || 'active').toLowerCase();
  const map = {
    active:    { label:'ACTIVE',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
    suspended: { label:'SUSPENDED', color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
    pending:   { label:'PENDING',   color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)'  },
  };
  const m = map[s] || map.active;
  return <span className="us__status" style={{ color:m.color, background:m.bg, border:`1px solid ${m.border}` }}>{m.label}</span>;
}

function UserProfileModal({ user, tab, onClose }) {
  if (!user) return null;
  const metric      = tab === 'buyers' ? (user.needs_count ?? '—') : (user.projects ?? '—');
  const metricLabel = tab === 'buyers' ? 'Needs' : 'Projects';
  return (
    <div className="us__overlay" onClick={onClose}>
      <div className="us__modal" onClick={e => e.stopPropagation()}>
        <div className="us__modal-header">
          <h3 className="us__modal-title">User Profile</h3>
          <button className="us__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="us__modal-body">
          <div className="us__modal-avatar-wrap">
            <div className="us__modal-avatar">{getInitials(user.display_name)}</div>
            <h4 className="us__modal-name">{user.display_name}</h4>
            <StatusBadge status={user.status} />
          </div>
          <div className="us__modal-stats">
            <div className="us__modal-stat"><span className="us__modal-stat-val">{metric}</span><span className="us__modal-stat-label">{metricLabel}</span></div>
            <div className="us__modal-stat"><span className="us__modal-stat-val">{user.rating || '—'}</span><span className="us__modal-stat-label">Rating</span></div>
            <div className="us__modal-stat"><span className="us__modal-stat-val">{user.joined_year || '—'}</span><span className="us__modal-stat-label">Joined</span></div>
          </div>
          <div className="us__modal-info">
            <div className="us__modal-row"><span className="us__modal-key">Email</span><span className="us__modal-val">{user.email || '—'}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Phone</span><span className="us__modal-val">{user.phone || '—'}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Location</span><span className="us__modal-val">{user.location || '—'}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Verified</span><span className="us__modal-val">{user.is_verified ? '✓ Verified' : 'Not verified'}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">{metricLabel}</span><span className="us__modal-val">{metric}</span></div>
          </div>
          <div className="us__modal-actions">
            <button className="us__modal-btn us__modal-btn--primary">Send Message</button>
            <button className="us__modal-btn us__modal-btn--verify">Verify Manually</button>
            <button className="us__modal-btn us__modal-btn--default">Reset Password</button>
            <button className="us__modal-btn us__modal-btn--suspend">Suspend User</button>
            <button className="us__modal-btn us__modal-btn--delete">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [tab, setTab]             = useState('buyers');
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [counts, setCounts]       = useState({ total:0, buyers:0, vendors:0, suspended:0 });
  const [selected, setSelected]   = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [{ count: total }, { count: buyers }, { count: vendors }, { count: suspended }] = await Promise.all([
          supabase.from('profiles').select('*', { count:'exact', head:true }).neq('role','admin'),
          supabase.from('profiles').select('*', { count:'exact', head:true }).eq('role','buyer'),
          supabase.from('profiles').select('*', { count:'exact', head:true }).eq('role','vendor'),
          supabase.from('profiles').select('*', { count:'exact', head:true }).eq('status','suspended'),
        ]);
        setCounts({ total:total||0, buyers:buyers||0, vendors:vendors||0, suspended:suspended||0 });
      } catch { /* keep defaults */ }
    }
    fetchCounts();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const role = tab === 'buyers' ? 'buyer' : 'vendor';

      // Step 1: fetch profiles
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, phone, status, is_verified, created_at')
        .eq('role', role)
        .order('created_at', { ascending: false })
        .range((page-1)*PER_PAGE, page*PER_PAGE-1);

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (search) query = query.ilike('full_name', `%${search}%`);

      const { data: profiles, error } = await query;
      if (error) throw error;
      if (!profiles || profiles.length === 0) { setData([]); setLoading(false); return; }

      // Step 2: fetch companies owned by these profiles
      const profileIds = profiles.map(p => p.id);
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name_en, is_verified, governorate_id, owner_id')
        .in('owner_id', profileIds);

      const companyByOwner = {};
      (companies||[]).forEach(c => { companyByOwner[c.owner_id] = c; });

      // Step 3: fetch governorates
      const govIds = [...new Set((companies||[]).map(c => c.governorate_id).filter(Boolean))];
      let govMap = {};
      if (govIds.length > 0) {
        const { data: govs } = await supabase
          .from('governorates').select('id, name_en').in('id', govIds);
        (govs||[]).forEach(g => { govMap[g.id] = g.name_en; });
      }

      // Step 4: fetch buyer_profiles or vendor_profiles
      const companyIds = (companies||[]).map(c => c.id);
      let statsMap = {};
      if (companyIds.length > 0) {
        const table  = tab === 'buyers' ? 'buyer_profiles' : 'vendor_profiles';
        const fields = tab === 'buyers'
          ? 'company_id, total_needs_posted'
          : 'company_id, rating, projects_completed, specializations';
        const { data: stats } = await supabase.from(table).select(fields).in('company_id', companyIds);
        (stats||[]).forEach(s => { statsMap[s.company_id] = s; });
      }

      // Step 5: assemble rows
      setData(profiles.map(p => {
        const co    = companyByOwner[p.id] || {};
        const stats = statsMap[co.id]      || {};
        return {
          id:           p.id,
          display_name: co.name_en || p.full_name,
          full_name:    p.full_name,
          email:        p.email,
          phone:        p.phone,
          status:       p.status,
          is_verified:  co.is_verified ?? p.is_verified,
          created_at:   p.created_at,
          joined_year:  p.created_at ? new Date(p.created_at).getFullYear() : '—',
          location:     govMap[co.governorate_id] || '—',
          needs_count:  stats.total_needs_posted ?? '—',
          projects:     stats.projects_completed ?? '—',
          rating:       stats.rating ?? '—',
          category:     stats.specializations?.[0] || '—',
        };
      }));
    } catch (err) {
      console.error('Users fetch error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [tab, page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(s => s.length === data.length ? [] : data.map(d => d.id));

  const STATS = [
    { label:'TOTAL USERS',        value: counts.total?.toLocaleString()     || '0', sub:'↑ 8% this month',  subColor:'#10B981' },
    { label:'TOTAL BUYERS',       value: counts.buyers?.toLocaleString()    || '0', sub:'↑ 11% this month', subColor:'#10B981' },
    { label:'TOTAL VENDORS',      value: counts.vendors?.toLocaleString()   || '0', sub:'↑ 6% this month',  subColor:'#10B981' },
    { label:'SUSPENDED ACCOUNTS', value: counts.suspended?.toLocaleString() || '0', sub:'↑ 2 this week',   subColor:'#EF4444' },
  ];

  return (
    <PageLayout title="Users" subtitle="Manage all registered buyers and vendors">
        <div className="us__content">

          <div className="us__stats">
            {STATS.map((s,i) => (
              <div key={i} className="us__stat-card">
                <p className="us__stat-label">{s.label}</p>
                <p className="us__stat-value">{s.value}</p>
                <p className="us__stat-sub" style={{ color:s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="us__tabs">
            {['buyers','vendors'].map(t => (
              <button key={t} className={`us__tab ${tab===t?'us__tab--active':''}`}
                onClick={() => { setTab(t); setSelected([]); setPage(1); }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
                <span className="us__tab-count">{t==='buyers' ? counts.buyers : counts.vendors}</span>
              </button>
            ))}
          </div>

          <div className="us__filters">
            <div className="us__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="us__search" placeholder="Search by name, email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="us__select" value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <button className="us__clear" onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}>Clear filters</button>
            <span className="us__showing">Showing 1–{data.length} of {tab==='buyers' ? counts.buyers : counts.vendors}</span>
          </div>

          {selected.length > 0 && (
            <div className="us__bulk">
              <span className="us__bulk-count">{selected.length} users selected</span>
              <button className="us__bulk-btn us__bulk-btn--verify">Verify</button>
              <button className="us__bulk-btn us__bulk-btn--suspend">Suspend</button>
              <button className="us__bulk-btn us__bulk-btn--delete">Delete</button>
            </div>
          )}

          <div className="us__table-wrap">
            {loading ? <div className="us__loading">Loading…</div> : data.length === 0 ? (
              <div className="us__loading">No {tab} found.</div>
            ) : (
              <table className="us__table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className="us__cb" checked={selected.length===data.length && data.length>0} onChange={toggleAll} /></th>
                    <th></th>
                    <th>{tab==='buyers' ? 'BUYER' : 'VENDOR'}</th>
                    <th className="us__col-hide-sm">EMAIL</th>
                    <th className="us__col-hide-sm">LOCATION</th>
                    {tab==='vendors' && <><th className="us__col-hide-md">CATEGORY</th><th className="us__col-hide-md">RATING</th><th className="us__col-hide-md">VERIFIED</th></>}
                    {tab==='buyers'  && <th className="us__col-hide-md">NEEDS</th>}
                    <th>STATUS</th>
                    <th className="us__col-hide-sm">JOINED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id} className={selected.includes(row.id) ? 'us__row--selected' : ''}>
                      <td><input type="checkbox" className="us__cb" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                      <td><div className="us__avatar">{getInitials(row.display_name)}</div></td>
                      <td className="us__name-cell">{row.display_name}</td>
                      <td className="us__muted us__col-hide-sm">{row.email}</td>
                      <td className="us__muted us__col-hide-sm">{row.location}</td>
                      {tab==='vendors' && (
                        <>
                          <td className="us__muted us__col-hide-md">{row.category}</td>
                          <td className="us__muted us__col-hide-md">{row.rating}</td>
                          <td className="us__col-hide-md">{row.is_verified ? <span className="us__verified">✓ Verified</span> : <span className="us__muted">—</span>}</td>
                        </>
                      )}
                      {tab==='buyers' && <td className="us__muted us__col-hide-md">{row.needs_count}</td>}
                      <td><StatusBadge status={row.status} /></td>
                      <td className="us__muted us__col-hide-sm">{formatDate(row.created_at)}</td>
                      <td>
                        <div className="us__actions">
                          <button className="us__action-btn" onClick={() => setModalUser(row)} title="View">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="us__action-btn us__col-hide-sm" title="Message">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          </button>
                          <button className="us__action-btn us__col-hide-sm" title="More">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="us__pagination">
            <span className="us__pg-info us__col-hide-sm">Showing 1–{data.length} of {tab==='buyers' ? counts.buyers : counts.vendors}</span>
            <div className="us__pg-controls">
              <button className="us__pg-btn" onClick={() => setPage(p => Math.max(1,p-1))}>‹</button>
              {[1,2,3].map(n => <button key={n} className={`us__pg-btn ${page===n?'us__pg-btn--active':''}`} onClick={() => setPage(n)}>{n}</button>)}
              <span className="us__pg-dots">…</span>
              <button className="us__pg-btn" onClick={() => setPage(p => p+1)}>›</button>
            </div>
            <div className="us__pg-rows">
              <span className="us__col-hide-sm">Rows per page</span>
              <select className="us__pg-select"><option>20</option><option>50</option></select>
            </div>
          </div>

        </div>
      <UserProfileModal user={modalUser} tab={tab} onClose={() => setModalUser(null)} />
    </PageLayout>
  );
}