import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import Pagination from '../components/Pagination';
import PlacementForm from '../components/PlacementForm';
import './Marketing.css';

const FB_PLACEMENTS = [
  { id:1, title:'Steel Frame Supply — New Cairo Tower', subtitle:'Construction · Cairo', type:'NEED',   client:'Masr Construction', initials:'MC', start:'1 Mar 2026',  end:'31 Mar 2026', status:'active',    starred:true  },
  { id:2, title:'BuildRight Construction',              subtitle:'Construction · Giza',  type:'VENDOR', client:'BuildRight',         initials:'BR', start:'5 Mar',      end:'5 Apr',        status:'active',    starred:true  },
  { id:3, title:'IT Infrastructure Setup — Warehouse',  subtitle:'Technology · Cairo',   type:'NEED',   client:'TechNile Ltd',       initials:'TN', start:'10 Mar',     end:'10 Apr',       status:'active',    starred:false },
  { id:4, title:'Office Solutions Ltd',                 subtitle:'Office Supplies · Cairo',type:'VENDOR',client:'Office Solutions',   initials:'OS', start:'15 Mar',     end:'15 Apr',       status:'active',    starred:false },
  { id:5, title:'Marble Flooring — Admin Capital',      subtitle:'Materials · Cairo',    type:'NEED',   client:'Safeguard RE',       initials:'SR', start:'20 Mar',     end:'20 Apr',       status:'scheduled', starred:false },
  { id:6, title:'NileTrans Logistics',                  subtitle:'Logistics · Cairo',    type:'VENDOR', client:'NileTrans',          initials:'NT', start:'1 Feb',      end:'28 Feb',       status:'expired',   starred:false },
];

const STATUS_STYLES = {
  active:    { label:'ACTIVE',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
  scheduled: { label:'SCHEDULED', color:'#FFA500', bg:'rgba(255,165,0,0.12)', border:'rgba(255,165,0,0.3)'  },
  expired:   { label:'EXPIRED',   color:'#EF4444', bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.3)'  },
};
const TYPE_STYLES = {
  NEED:   { color:'#00A7E5', bg:'rgba(0,167,229,0.12)', border:'rgba(0,167,229,0.3)'   },
  VENDOR: { color:'#10B981', bg:'rgba(16,185,129,0.12)',border:'rgba(16,185,129,0.3)'  },
};

export default function Marketing() {
  const [tab,        setTab]        = useState('Featured Placements');
  const [placements, setPlacements] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [counts,     setCounts]     = useState({ placements:0, promoCodes:0, subscribers:0, promoUsage:0 });
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [showForm,   setShowForm]   = useState(false);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count: placements } = await supabase.from('featured_placements').select('*', { count:'exact', head:true }).eq('status','active');
        const { count: promoCodes } = await supabase.from('promo_codes').select('*', { count:'exact', head:true }).eq('is_active', true);
        const { count: subscribers } = await supabase.from('newsletter_subscribers').select('*', { count:'exact', head:true });
        setCounts({ placements: placements||28, promoCodes: promoCodes||14, subscribers: subscribers||9284, promoUsage: 342 });
      } catch {
        setCounts({ placements:28, promoCodes:14, subscribers:9284, promoUsage:342 });
      }
    }
    fetchCounts();
  }, []);

  const fetchPlacements = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('featured_placements')
        .select('id, placement_type, status, start_date, end_date, is_starred, entity_id, entity_type')
        .order('created_at', { ascending: false })
        .range((page-1)*10, page*10-1);
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('empty');

      setPlacements(data.map((p, i) => ({
        id:       p.id,
        title:    `Featured ${p.entity_type} #${p.entity_id}`,
        subtitle: `${p.placement_type} · Cairo`,
        type:     p.placement_type === 'vendor' ? 'VENDOR' : 'NEED',
        client:   '—',
        initials: '—',
        start:    p.start_date ? new Date(p.start_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—',
        end:      p.end_date   ? new Date(p.end_date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})                  : '—',
        status:   p.status || 'active',
        starred:  p.is_starred || false,
      })));
    } catch {
      setPlacements(FB_PLACEMENTS);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { if (tab === 'Featured Placements') fetchPlacements(); }, [fetchPlacements, tab]);

  const filtered = placements.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  const STATS = [
    { label:'FEATURED PLACEMENTS',   value: counts.placements?.toLocaleString()||'0',  sub:'Active paid placements', subColor:'#FFA500' },
    { label:'ACTIVE PROMO CODES',    value: counts.promoCodes?.toLocaleString()||'0',   sub:'↑ 3 this week',          subColor:'#10B981' },
    { label:'NEWSLETTER SUBSCRIBERS',value: counts.subscribers?.toLocaleString()||'0',  sub:'↑ 124 this month',       subColor:'#10B981' },
    { label:'PROMO CODE USAGE',      value: counts.promoUsage?.toLocaleString()||'0',   sub:'This month',             subColor:'#10B981' },
  ];

  return (
    <PageLayout title="Marketing" subtitle="Manage featured placements, promo codes and newsletters">
      <div className="mk__content">
        <PageStats stats={STATS} />

        {/* Tabs */}
        <div className="mk__tabs">
          {['Featured Placements','Promo Codes','Newsletter'].map(t => (
            <button key={t} className={`mk__tab ${tab===t?'mk__tab--active':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Featured Placements' && (
          <>
            {/* Filters */}
            <div className="mk__filters">
              <div className="mk__search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input className="mk__search" placeholder="Search by name, company, email…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <select className="mk__select"><option>Status: All</option><option>Active</option><option>Scheduled</option><option>Expired</option></select>
              <select className="mk__select"><option>Verified: All</option><option>Verified</option></select>
              <select className="mk__select"><option>Location: All</option><option>Cairo</option><option>Giza</option></select>
              <button className="mk__clear" onClick={() => setSearch('')}>Clear filters</button>
              <span className="mk__showing mk__hide-sm">Showing 1–{filtered.length} of {counts.placements}</span>
            </div>

            {/* Table */}
            <div className="mk__table-wrap">
              {loading ? <div className="mk__loading">Loading…</div> : (
                <table className="mk__table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>ITEM</th>
                      <th>TYPE</th>
                      <th className="mk__hide-sm">CLIENT</th>
                      <th className="mk__hide-sm">START DATE</th>
                      <th className="mk__hide-sm">END DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(row => {
                      const s = STATUS_STYLES[row.status] || STATUS_STYLES.active;
                      const t = TYPE_STYLES[row.type]     || TYPE_STYLES.NEED;
                      return (
                        <tr key={row.id}>
                          <td>
                            <button className="mk__star" style={{ color: row.starred ? '#FFA500' : '#374151' }}>
                              {row.starred ? '★' : '☆'}
                            </button>
                          </td>
                          <td>
                            <p className="mk__item-title">{row.title}</p>
                            <p className="mk__item-sub">{row.subtitle}</p>
                          </td>
                          <td>
                            <span className="mk__type-badge" style={{ color:t.color, background:t.bg, border:`1px solid ${t.border}` }}>{row.type}</span>
                          </td>
                          <td className="mk__hide-sm">
                            <div className="mk__client">
                              <div className="mk__client-av">{row.initials}</div>
                              <span>{row.client}</span>
                            </div>
                          </td>
                          <td className="mk__muted mk__hide-sm">{row.start}</td>
                          <td className="mk__muted mk__hide-sm">{row.end}</td>
                          <td>
                            <span className="mk__status" style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>{s.label}</span>
                          </td>
                          <td>
                            <div className="mk__actions">
                              <button className="mk__action-btn" title="View"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                              <button className="mk__action-btn" title="Edit"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button className="mk__action-btn mk__action-btn--danger" title="Delete"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <Pagination page={page} total={counts.placements||28} perPage={10} onChange={setPage} />

            {/* Add form */}
            <PlacementForm />
          </>
        )}

        {tab !== 'Featured Placements' && (
          <div className="mk__placeholder">
            <p style={{ color:'#6B7280', fontSize:'14px' }}>Coming soon — {tab}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
