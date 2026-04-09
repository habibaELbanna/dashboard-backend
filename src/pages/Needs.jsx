import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';


import './Needs.css';
import PageLayout from '../components/PageLayout';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function formatBudget(min, max) {
  if (!min && !max) return '—';
  const fmt = n => n >= 1000 ? `${Math.round(n/1000)}K` : n;
  if (min && max) return `EGP ${fmt(min)}–${fmt(max)}`;
  if (min) return `EGP ${fmt(min)}+`;
  return `EGP up to ${fmt(max)}`;
}
function getInitials(name) {
  if (!name) return '??';
  const words = name.trim().split(' ');
  return words.length >= 2 ? (words[0][0]+words[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    open:    { label:'OPEN',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
    closed:  { label:'CLOSED',  color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
    expired: { label:'EXPIRED', color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)' },
    flagged: { label:'FLAGGED', color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)' },
  };
  const m = map[status?.toLowerCase()] || map.closed;
  return <span className="nd__status" style={{ color:m.color, background:m.bg, border:`1px solid ${m.border}` }}>{m.label}</span>;
}

// Star — orange when active, blue outline when inactive
function StarBtn({ active, onClick }) {
  return (
    <button className="nd__star" onClick={onClick} title={active ? 'Remove from featured' : 'Mark as featured'}>
      {active
        ? <span style={{ color:'#FFA500', fontSize:'17px', lineHeight:1 }}>★</span>
        : <span style={{ color:'#00A7E5', fontSize:'17px', lineHeight:1 }}>☆</span>
      }
    </button>
  );
}

function NeedModal({ need, onClose }) {
  if (!need) return null;
  return (
    <div className="nd__overlay" onClick={onClose}>
      <div className="nd__modal" onClick={e => e.stopPropagation()}>
        <div className="nd__modal-header">
          <h3 className="nd__modal-title">Need Details</h3>
          <button className="nd__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="nd__modal-body">
          <div className="nd__modal-badges">
            <StatusBadge status={need.status} />
            <span className="nd__modal-cat-badge">{need.category}</span>
            {need.is_featured && <span className="nd__modal-featured">⭐ FEATURED</span>}
          </div>
          <h2 className="nd__modal-need-title">{need.title}</h2>
          <div className="nd__modal-poster">
            <div className="nd__modal-avatar">{getInitials(need.buyer_name)}</div>
            <div>
              <p className="nd__modal-poster-name">{need.buyer_name}</p>
              <p className="nd__modal-poster-tag">Verified Buyer</p>
            </div>
            <span className="nd__modal-posted">Posted {formatDate(need.created_at)}</span>
          </div>
          <div className="nd__modal-grid">
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">BUDGET</p><p className="nd__modal-grid-val">{need.budget}</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">QUANTITY</p><p className="nd__modal-grid-val">{need.quantity ? `${need.quantity} ${need.unit||''}` : '—'}</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">DEADLINE</p><p className="nd__modal-grid-val">{formatDate(need.deadline)}</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">PROPOSALS</p><p className="nd__modal-grid-val">{need.proposals_count ?? 0}</p></div>
          </div>
          {need.description_en && (
            <div>
              <p className="nd__modal-section-label">DESCRIPTION</p>
              <p className="nd__modal-desc">{need.description_en}</p>
            </div>
          )}
          <div className="nd__modal-tags">
            {need.category && <span className="nd__modal-tag">{need.category}</span>}
            {need.location && <span className="nd__modal-tag">{need.location}</span>}
            {need.status && <span className="nd__modal-tag">{need.status.toUpperCase()}</span>}
            {need.urgency_level && <span className="nd__modal-tag">{need.urgency_level.toUpperCase()}</span>}
          </div>
          {need.is_featured && (
            <div>
              <p className="nd__modal-section-label">FEATURED PLACEMENT</p>
              <div className="nd__modal-featured-box">CURRENTLY FEATURED</div>
              <p className="nd__modal-remove-featured">Remove from featured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Needs() {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [counts, setCounts]       = useState({ total:0, open:0, expired:0, featured:0 });
  const [selected, setSelected]   = useState([]);
  const [modalNeed, setModalNeed] = useState(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [{ count: total }, { count: open }, { count: expired }, { count: featured }] = await Promise.all([
          supabase.from('needs').select('*', { count:'exact', head:true }),
          supabase.from('needs').select('*', { count:'exact', head:true }).eq('status','open'),
          supabase.from('needs').select('*', { count:'exact', head:true }).eq('status','expired'),
          supabase.from('needs').select('*', { count:'exact', head:true }).eq('is_featured', true),
        ]);
        setCounts({ total:total||0, open:open||0, expired:expired||0, featured:featured||0 });
      } catch { /* keep defaults */ }
    }
    fetchCounts();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Fetch needs (base columns only — no inline joins)
      let query = supabase
        .from('needs')
        .select(`
          id, title_en, title_ar, status, is_featured,
          deadline, budget_min, budget_max_egp,
          quantity, unit, urgency_level, description_en, created_at,
          category_id, governorate_id, buyer_company_id
        `)
        .order('created_at', { ascending: false })
        .range((page-1)*PER_PAGE, page*PER_PAGE-1);

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (search) query = query.ilike('title_en', `%${search}%`);

      const { data: needRows, error } = await query;
      if (error) throw error;
      if (!needRows || needRows.length === 0) { setData([]); setLoading(false); return; }

      // Step 2: Collect IDs for all related lookups
      const catIds     = [...new Set(needRows.map(r => r.category_id).filter(Boolean))];
      const govIds     = [...new Set(needRows.map(r => r.governorate_id).filter(Boolean))];
      const companyIds = [...new Set(needRows.map(r => r.buyer_company_id).filter(Boolean))];
      const needIds    = needRows.map(r => r.id);

      // Step 3: Parallel fetch of all lookup tables
      const [catsRes, govsRes, companiesRes, propsRes] = await Promise.all([
        catIds.length     ? supabase.from('categories').select('id, name_en').in('id', catIds)     : { data: [] },
        govIds.length     ? supabase.from('governorates').select('id, name_en').in('id', govIds)   : { data: [] },
        companyIds.length ? supabase.from('companies').select('id, name_en').in('id', companyIds) : { data: [] },
        needIds.length    ? supabase.from('proposals').select('need_id').in('need_id', needIds)   : { data: [] },
      ]);

      // Step 4: Build lookup maps
      const catMap      = {};
      const govMap      = {};
      const companyMap  = {};
      const propCounts  = {};

      (catsRes.data    || []).forEach(c => { catMap[c.id]     = c.name_en; });
      (govsRes.data    || []).forEach(g => { govMap[g.id]     = g.name_en; });
      (companiesRes.data || []).forEach(c => { companyMap[c.id] = c.name_en; });
      (propsRes.data   || []).forEach(p => { propCounts[p.need_id] = (propCounts[p.need_id]||0)+1; });

      // Step 5: Assemble final rows
      setData(needRows.map(r => ({
        ...r,
        title:           r.title_en || r.title_ar || '—',
        category:        catMap[r.category_id]      || '—',
        location:        govMap[r.governorate_id]   || '—',
        buyer_name:      companyMap[r.buyer_company_id] || '—',
        budget:          formatBudget(r.budget_min, r.budget_max_egp),
        proposals_count: propCounts[r.id] || 0,
      })));
    } catch (err) {
      console.error('Needs fetch error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSelect   = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll      = () => setSelected(s => s.length === data.length ? [] : data.map(n => n.id));
  const toggleFeatured = async (id, current) => {
    setData(d => d.map(x => x.id === id ? { ...x, is_featured: !x.is_featured } : x));
    try { await supabase.from('needs').update({ is_featured: !current }).eq('id', id); }
    catch { fetchData(); }
  };

  const STATS = [
    { label:'TOTAL NEEDS',    value: counts.total?.toLocaleString()    || '0', sub:'↑ 14% this month',             subColor:'#10B981' },
    { label:'OPEN NEEDS',     value: counts.open?.toLocaleString()     || '0', sub:'Active and accepting proposals', subColor:'#6B7280' },
    { label:'EXPIRED NEEDS',  value: counts.expired?.toLocaleString()  || '0', sub:'↓ 5% this month',              subColor:'#EF4444' },
    { label:'FEATURED NEEDS', value: counts.featured?.toLocaleString() || '0', sub:'Paid placements active',       subColor:'#FFA500' },
  ];

  return (
    <PageLayout title="Needs" subtitle="Monitor and manage all posted procurement needs">
        <div className="nd__content">

          <div className="nd__stats">
            {STATS.map((s,i) => (
              <div key={i} className="nd__stat-card">
                <p className="nd__stat-label">{s.label}</p>
                <p className="nd__stat-value">{s.value}</p>
                <p className="nd__stat-sub" style={{ color:s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="nd__filters">
            <div className="nd__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="nd__search" placeholder="Search by title, category…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="nd__select" value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="all">Status: All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>
            <button className="nd__clear" onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}>Clear filters</button>
            <span className="nd__showing nd__col-hide-sm">Showing 1–{data.length} of {counts.total}</span>
          </div>

          {selected.length > 0 && (
            <div className="nd__bulk">
              <span className="nd__bulk-count">{selected.length} needs selected</span>
              <button className="nd__bulk-btn nd__bulk-btn--feature">Feature Selected</button>
              <button className="nd__bulk-btn nd__bulk-btn--clear" onClick={() => setSelected([])}>Clear selection</button>
            </div>
          )}

          <div className="nd__table-wrap">
            {loading ? <div className="nd__loading">Loading…</div> : data.length === 0 ? (
              <div className="nd__loading">No needs found.</div>
            ) : (
              <table className="nd__table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className="nd__cb" checked={selected.length===data.length && data.length>0} onChange={toggleAll} /></th>
                    <th>NEED</th>
                    <th className="nd__col-hide-sm">BUYER</th>
                    <th className="nd__col-hide-md">CATEGORY</th>
                    <th className="nd__col-hide-sm">BUDGET</th>
                    <th className="nd__col-hide-md">PROPOSALS</th>
                    <th>STATUS</th>
                    <th className="nd__col-hide-sm">DEADLINE</th>
                    <th className="nd__col-hide-md">FEATURED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id} className={selected.includes(row.id) ? 'nd__row--selected' : ''}>
                      <td><input type="checkbox" className="nd__cb" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                      <td>
                        <p className="nd__need-title">{row.title}</p>
                        <p className="nd__need-sub">{row.category} · {row.location}</p>
                      </td>
                      <td className="nd__col-hide-sm">
                        <div className="nd__buyer">
                          <div className="nd__avatar">{getInitials(row.buyer_name)}</div>
                          <span className="nd__buyer-name">{row.buyer_name}</span>
                        </div>
                      </td>
                      <td className="nd__muted nd__col-hide-md">{row.category}</td>
                      <td className="nd__muted nd__col-hide-sm">{row.budget}</td>
                      <td className="nd__muted nd__col-hide-md">{row.proposals_count}</td>
                      <td><StatusBadge status={row.status} /></td>
                      <td className="nd__muted nd__col-hide-sm">{formatDate(row.deadline)}</td>
                      <td className="nd__col-hide-md">
                        <StarBtn active={row.is_featured} onClick={() => toggleFeatured(row.id, row.is_featured)} />
                      </td>
                      <td>
                        <button className="nd__action-btn" onClick={() => setModalNeed(row)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="nd__pagination">
            <span className="nd__pg-info nd__col-hide-sm">Showing 1–{data.length} of {counts.total}</span>
            <div className="nd__pg-controls">
              <button className="nd__pg-btn" onClick={() => setPage(p => Math.max(1,p-1))}>‹</button>
              {[1,2,3].map(n => <button key={n} className={`nd__pg-btn ${page===n?'nd__pg-btn--active':''}`} onClick={() => setPage(n)}>{n}</button>)}
              <span className="nd__pg-dots">…</span>
              <button className="nd__pg-btn" onClick={() => setPage(p => p+1)}>›</button>
            </div>
            <div className="nd__pg-rows">
              <span className="nd__col-hide-sm">Rows per page</span>
              <select className="nd__pg-select"><option>20</option><option>50</option></select>
            </div>
          </div>
        </div>
      <NeedModal need={modalNeed} onClose={() => setModalNeed(null)} />
    </PageLayout>
  );
}
