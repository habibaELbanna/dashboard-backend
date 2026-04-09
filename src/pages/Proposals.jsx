import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';


import './Proposals.css';
import PageLayout from '../components/PageLayout';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function formatAmount(n) {
  if (!n) return '—';
  return `EGP ${Number(n).toLocaleString()}`;
}
function getInitials(name) {
  if (!name) return '??';
  const words = name.trim().split(' ');
  return words.length >= 2 ? (words[0][0]+words[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    pending:     { label:'PENDING',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)'  },
    accepted:    { label:'ACCEPTED',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
    rejected:    { label:'REJECTED',    color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
    withdrawn:   { label:'WITHDRAWN',   color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
    shortlisted: { label:'SHORTLISTED', color:'#00A7E5', bg:'rgba(0,167,229,0.12)',  border:'rgba(0,167,229,0.3)'  },
  };
  const m = map[status?.toLowerCase()] || map.pending;
  return <span className="pr__status" style={{ color:m.color, background:m.bg, border:`1px solid ${m.border}` }}>{m.label}</span>;
}

function ProposalModal({ proposal, onClose }) {
  if (!proposal) return null;
  return (
    <div className="pr__overlay" onClick={onClose}>
      <div className="pr__modal" onClick={e => e.stopPropagation()}>
        <div className="pr__modal-header">
          <h3 className="pr__modal-title">Proposal Details</h3>
          <button className="pr__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pr__modal-body">
          <div className="pr__modal-top">
            <h2 className="pr__modal-id">Proposal #{proposal.id}</h2>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="pr__modal-parties">
            <div className="pr__modal-party">
              <p className="pr__modal-party-label">VENDOR</p>
              <div className="pr__modal-party-avatar">{getInitials(proposal.vendor_name)}</div>
              <p className="pr__modal-party-name">{proposal.vendor_name}</p>
              <p className="pr__modal-party-sub">{proposal.vendor_location || '—'}</p>
              <span className="pr__modal-view-link">View Profile</span>
            </div>
            <div className="pr__modal-party">
              <p className="pr__modal-party-label">BUYER</p>
              <div className="pr__modal-party-avatar">{getInitials(proposal.buyer_name)}</div>
              <p className="pr__modal-party-name">{proposal.buyer_name}</p>
              <p className="pr__modal-party-sub">{proposal.buyer_location || '—'}</p>
              <span className="pr__modal-view-link">View Profile</span>
            </div>
          </div>
          <div className="pr__modal-need-section">
            <p className="pr__modal-section-label">NEED</p>
            <p className="pr__modal-need-title">{proposal.need_title}</p>
            <p className="pr__modal-need-sub">{proposal.need_category} · {proposal.need_location}</p>
            <span className="pr__modal-view-link">View Need</span>
          </div>
          <div className="pr__modal-grid">
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">QUOTED PRICE</p><p className="pr__modal-grid-val">{formatAmount(proposal.amount)}</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">DELIVERY</p><p className="pr__modal-grid-val">{proposal.delivery_days ? `${proposal.delivery_days} days` : '—'}</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">EST. DELIVERY</p><p className="pr__modal-grid-val">{formatDate(proposal.estimated_delivery)}</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">SUBMITTED</p><p className="pr__modal-grid-val">{formatDate(proposal.submitted_at)}</p></div>
          </div>
          {proposal.cover_letter && (
            <div>
              <p className="pr__modal-section-label">COVER LETTER</p>
              <div className="pr__modal-message">{proposal.cover_letter}</div>
            </div>
          )}
          {proposal.warranty_terms_en && (
            <div>
              <p className="pr__modal-section-label">WARRANTY TERMS</p>
              <div className="pr__modal-message">{proposal.warranty_terms_en}</div>
            </div>
          )}
          <div>
            <p className="pr__modal-section-label">TIMELINE</p>
            <div className="pr__modal-timeline">
              <div className="pr__modal-timeline-item"><span className="pr__modal-tl-dot" /><div><p className="pr__modal-tl-title">Proposal submitted</p><p className="pr__modal-tl-time">{formatDate(proposal.submitted_at)}</p></div></div>
              <div className="pr__modal-timeline-item"><span className="pr__modal-tl-dot" /><div><p className="pr__modal-tl-title">Status: {(proposal.status||'pending').toUpperCase()}</p><p className="pr__modal-tl-time">{formatDate(proposal.updated_at || proposal.submitted_at)}</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Proposals() {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [counts, setCounts]       = useState({ total:0, pending:0, accepted:0, rejected:0 });
  const [modalProposal, setModal] = useState(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [{ count: total }, { count: pending }, { count: accepted }, { count: rejected }] = await Promise.all([
          supabase.from('proposals').select('*', { count:'exact', head:true }),
          supabase.from('proposals').select('*', { count:'exact', head:true }).eq('proposal_status','pending'),
          supabase.from('proposals').select('*', { count:'exact', head:true }).eq('proposal_status','accepted'),
          supabase.from('proposals').select('*', { count:'exact', head:true }).eq('proposal_status','rejected'),
        ]);
        setCounts({ total: total||0, pending: pending||0, accepted: accepted||0, rejected: rejected||0 });
      } catch { /* keep defaults */ }
    }
    fetchCounts();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Fetch proposals base data
      let query = supabase
        .from('proposals')
        .select(`
          id, quoted_price, proposed_price_egp, proposal_status,
          delivery_days, estimated_delivery, cover_letter,
          warranty_terms_en, submitted_at, updated_at,
          need_id, vendor_company_id
        `)
        .order('submitted_at', { ascending: false })
        .range((page-1)*PER_PAGE, page*PER_PAGE-1);

      if (statusFilter !== 'all') query = query.eq('proposal_status', statusFilter);

      const { data: propRows, error: propErr } = await query;
      if (propErr) throw propErr;

      // Step 2: Fetch related needs (for title, category, location, buyer_company_id)
      const needIds    = [...new Set(propRows.map(p => p.need_id).filter(Boolean))];
      const vendorIds  = [...new Set(propRows.map(p => p.vendor_company_id).filter(Boolean))];

      let needMap = {}, companyMap = {}, categoryMap = {}, governorateMap = {};

      if (needIds.length > 0) {
        const { data: needs } = await supabase
          .from('needs')
          .select('id, title_en, category_id, governorate_id, buyer_company_id')
          .in('id', needIds);
        if (needs) needs.forEach(n => { needMap[n.id] = n; });

        // Collect all company IDs (vendor + buyer)
        const buyerIds = needs.map(n => n.buyer_company_id).filter(Boolean);
        const allCompanyIds = [...new Set([...vendorIds, ...buyerIds])];

        if (allCompanyIds.length > 0) {
          const { data: companies } = await supabase
            .from('companies')
            .select('id, name_en, governorate_id')
            .in('id', allCompanyIds);
          if (companies) companies.forEach(c => { companyMap[c.id] = c; });
        }

        // Fetch categories and governorates
        const catIds = [...new Set(needs.map(n => n.category_id).filter(Boolean))];
        const govIds = [...new Set([
          ...needs.map(n => n.governorate_id),
          ...Object.values(companyMap).map(c => c.governorate_id)
        ].filter(Boolean))];

        if (catIds.length > 0) {
          const { data: cats } = await supabase.from('categories').select('id, name_en').in('id', catIds);
          if (cats) cats.forEach(c => { categoryMap[c.id] = c.name_en; });
        }
        if (govIds.length > 0) {
          const { data: govs } = await supabase.from('governorates').select('id, name_en').in('id', govIds);
          if (govs) govs.forEach(g => { governorateMap[g.id] = g.name_en; });
        }
      }

      setData(propRows.map(p => {
        const need       = needMap[p.need_id] || {};
        const vendor     = companyMap[p.vendor_company_id] || {};
        const buyer      = companyMap[need.buyer_company_id] || {};
        return {
          ...p,
          vendor_name:    vendor.name_en || '—',
          vendor_location:governorateMap[vendor.governorate_id] || '—',
          buyer_name:     buyer.name_en || '—',
          buyer_location: governorateMap[buyer.governorate_id] || '—',
          need_title:     need.title_en || '—',
          need_category:  categoryMap[need.category_id] || '—',
          need_location:  governorateMap[need.governorate_id] || '—',
          amount:         p.quoted_price || p.proposed_price_egp,
          status:         p.proposal_status,
        };
      }));
    } catch (err) {
      console.error('Proposals fetch error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const STATS = [
    { label:'TOTAL PROPOSALS', value: counts.total?.toLocaleString()    || '0', sub:'↑ 5% this month',     subColor:'#10B981' },
    { label:'PENDING REVIEW',  value: counts.pending?.toLocaleString()  || '0', sub:'Awaiting buyer decision', subColor:'#6B7280' },
    { label:'ACCEPTED',        value: counts.accepted?.toLocaleString() || '0', sub:'↑ 9% this month',     subColor:'#10B981' },
    { label:'REJECTED',        value: counts.rejected?.toLocaleString() || '0', sub:'Rejected by buyers',  subColor:'#EF4444' },
  ];

  return (
    <PageLayout title="Proposals" subtitle="Monitor all submitted proposals across the platform">
        <div className="pr__content">

          <div className="pr__stats">
            {STATS.map((s,i) => (
              <div key={i} className="pr__stat-card">
                <p className="pr__stat-label">{s.label}</p>
                <p className="pr__stat-value">{s.value}</p>
                <p className="pr__stat-sub" style={{ color:s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="pr__filters">
            <div className="pr__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="pr__search" placeholder="Search by vendor, buyer, need…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="pr__select" value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <button className="pr__clear" onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}>Clear filters</button>
            <span className="pr__showing pr__col-hide-sm">Showing 1–{data.length} of {counts.total}</span>
          </div>

          <div className="pr__table-wrap">
            {loading ? <div className="pr__loading">Loading…</div> : data.length === 0 ? (
              <div className="pr__loading">No proposals found.</div>
            ) : (
              <table className="pr__table">
                <thead>
                  <tr>
                    <th>PROPOSAL</th>
                    <th>VENDOR</th>
                    <th className="pr__col-hide-sm">BUYER</th>
                    <th className="pr__col-hide-md">NEED TITLE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th className="pr__col-hide-sm">SUBMITTED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id}>
                      <td>
                        <p className="pr__proposal-id">Proposal #{row.id}</p>
                        <p className="pr__proposal-sub">{row.need_category} · {row.need_location}</p>
                      </td>
                      <td className="pr__white">{row.vendor_name}</td>
                      <td className="pr__white pr__col-hide-sm">{row.buyer_name}</td>
                      <td className="pr__muted pr__col-hide-md">{row.need_title}</td>
                      <td className="pr__amount">{formatAmount(row.amount)}</td>
                      <td><StatusBadge status={row.status} /></td>
                      <td className="pr__muted pr__col-hide-sm">{formatDate(row.submitted_at)}</td>
                      <td>
                        <button className="pr__action-btn" onClick={() => setModal(row)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pr__pagination">
            <span className="pr__pg-info pr__col-hide-sm">Showing 1–{data.length} of {counts.total}</span>
            <div className="pr__pg-controls">
              <button className="pr__pg-btn" onClick={() => setPage(p => Math.max(1,p-1))}>‹</button>
              {[1,2,3].map(n => <button key={n} className={`pr__pg-btn ${page===n?'pr__pg-btn--active':''}`} onClick={() => setPage(n)}>{n}</button>)}
              <span className="pr__pg-dots">…</span>
              <button className="pr__pg-btn" onClick={() => setPage(p => p+1)}>›</button>
            </div>
            <div className="pr__pg-rows">
              <span className="pr__col-hide-sm">Rows per page</span>
              <select className="pr__pg-select"><option>20</option><option>50</option></select>
            </div>
          </div>
        </div>
      <ProposalModal proposal={modalProposal} onClose={() => setModal(null)} />
    </PageLayout>
  );
}
