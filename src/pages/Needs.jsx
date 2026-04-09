import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './Needs.css';

const STATS = [
  { label: 'TOTAL NEEDS',    value: '1,342', sub: '↑ 14% this month',       subColor: '#10B981' },
  { label: 'OPEN NEEDS',     value: '894',   sub: 'Active and accepting proposals', subColor: '#6B7280' },
  { label: 'EXPIRED NEEDS',  value: '312',   sub: '↓ 5% this month',        subColor: '#EF4444' },
  { label: 'FEATURED NEEDS', value: '28',    sub: 'Paid placements active',  subColor: '#FFA500' },
];

const NEEDS = [
  { id:1, title:'Steel Frame Supply for New Cairo Tower Project',  cat:'Construction',    location:'Cairo',       buyer:'MC', buyerName:'Masr Construction Co.', category:'Construction',   budget:'EGP 200K–350K', proposals:7,  status:'OPEN',    deadline:'15 Mar 2026', featured:true  },
  { id:2, title:'Office Furniture Supply — HQ Renovation',        cat:'Office Supplies', location:'Giza',        buyer:'DG', buyerName:'Delta Group',           category:'Office Supplies', budget:'EGP 50K–80K',   proposals:3,  status:'OPEN',    deadline:'28 Mar 2026', featured:false },
  { id:3, title:'IT Infrastructure Setup — Warehouse',            cat:'Technology',      location:'Cairo',       buyer:'TN', buyerName:'TechNile Ltd',          category:'Technology',     budget:'EGP 120K–180K', proposals:12, status:'OPEN',    deadline:'1 Apr 2026',  featured:true  },
  { id:4, title:'Generator Rental — Site Compound',               cat:'Energy',          location:'Alexandria',  buyer:'AN', buyerName:'AlNour Developers',     category:'Energy',         budget:'EGP 40K–70K',   proposals:4,  status:'OPEN',    deadline:'20 Mar 2026', featured:false },
  { id:5, title:'CCTV & Security System — Warehouse',             cat:'Security',        location:'Cairo',       buyer:'NH', buyerName:'Nile Holdings',         category:'Security',       budget:'EGP 60K–90K',   proposals:2,  status:'OPEN',    deadline:'10 Apr 2026', featured:false },
  { id:6, title:'Catering Service — Annual Conference',           cat:'Services',        location:'Cairo',       buyer:'HG', buyerName:'Horizon Group',         category:'Services',       budget:'EGP 30K–45K',   proposals:9,  status:'CLOSED',  deadline:'25 Mar 2026', featured:false },
  { id:7, title:'Marble Flooring — Admin Capital Project',        cat:'Construction',    location:'New Cairo',   buyer:'SR', buyerName:'Safeguard Real Estate', category:'Construction',   budget:'EGP 300K–500K', proposals:5,  status:'OPEN',    deadline:'30 Mar 2026', featured:true  },
  { id:8, title:'Corporate Gift Boxes — Employee Event',          cat:'Corporate Gifts', location:'Giza',        buyer:'OL', buyerName:'Office Line',           category:'Corporate Gifts',budget:'EGP 15K–25K',   proposals:0,  status:'EXPIRED', deadline:'1 Mar 2026',  featured:false },
  { id:9, title:'Electrical Wiring — Heliopolis Compound',        cat:'Energy',          location:'Heliopolis',  buyer:'HR', buyerName:'Helios Real Estate',    category:'Energy',         budget:'EGP 80K–120K',  proposals:6,  status:'OPEN',    deadline:'5 Apr 2026',  featured:false },
  { id:10,title:'Medical Equipment Supply — New Clinic',          cat:'Healthcare',      location:'Alexandria',  buyer:'MG', buyerName:'MediCare Group',        category:'Healthcare',     budget:'EGP 150K–250K', proposals:3,  status:'FLAGGED', deadline:'12 Apr 2026', featured:false },
];

function StatusBadge({ status }) {
  const map = {
    OPEN:    { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    CLOSED:  { color: '#6B7280', bg: 'rgba(107,114,128,0.12)',border: 'rgba(107,114,128,0.3)'},
    EXPIRED: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
    FLAGGED: { color: '#FFA500', bg: 'rgba(255,165,0,0.12)',  border: 'rgba(255,165,0,0.3)' },
  };
  const s = map[status] || map.CLOSED;
  return <span className="nd__status" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{status}</span>;
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
            {need.featured && <span className="nd__modal-featured">⭐ FEATURED</span>}
          </div>
          <h2 className="nd__modal-need-title">{need.title}</h2>
          <div className="nd__modal-poster">
            <div className="nd__modal-avatar">{need.buyer}</div>
            <div>
              <p className="nd__modal-poster-name">{need.buyerName}</p>
              <p className="nd__modal-poster-tag">Verified Buyer</p>
            </div>
            <span className="nd__modal-posted">Posted 1 Mar 2026</span>
          </div>
          <div className="nd__modal-grid">
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">BUDGET</p><p className="nd__modal-grid-val">{need.budget}</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">QUANTITY</p><p className="nd__modal-grid-val">500 tons</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">DEADLINE</p><p className="nd__modal-grid-val">{need.deadline}</p></div>
            <div className="nd__modal-grid-item"><p className="nd__modal-grid-label">PROPOSALS</p><p className="nd__modal-grid-val">{need.proposals}</p></div>
          </div>
          <div>
            <p className="nd__modal-section-label">DESCRIPTION</p>
            <p className="nd__modal-desc">We are looking for a reliable supplier to provide steel frames for our New Cairo tower project. The project requires high-quality materials that meet international standards.</p>
            <div className="nd__modal-tags">
              <span className="nd__modal-tag">{need.category}</span>
              <span className="nd__modal-tag">{need.location}</span>
              <span className="nd__modal-tag">{need.status}</span>
            </div>
          </div>
          <div>
            <p className="nd__modal-section-label">ATTACHMENTS</p>
            <div className="nd__modal-files">
              <div className="nd__modal-file"><span>📎 requirements.pdf</span><span className="nd__modal-file-size">2.4 MB</span></div>
              <div className="nd__modal-file"><span>📎 specifications.docx</span><span className="nd__modal-file-size">1.8 MB</span></div>
            </div>
          </div>
          {need.featured && (
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
  const [selected, setSelected] = useState([]);
  const [modalNeed, setModalNeed] = useState(null);
  const [needs, setNeeds] = useState(NEEDS);

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === needs.length ? [] : needs.map(n => n.id));
  const toggleFeatured = (id) => setNeeds(n => n.map(x => x.id === id ? { ...x, featured: !x.featured } : x));

  return (
    <div className="nd__layout">
      <Sidebar />
      <div className="nd__main">
        <Topbar title="Needs" subtitle="Monitor and manage all posted procurement needs" />
        <div className="nd__content">

          {/* Stats */}
          <div className="nd__stats">
            {STATS.map((s, i) => (
              <div key={i} className="nd__stat-card">
                <p className="nd__stat-label">{s.label}</p>
                <p className="nd__stat-value">{s.value}</p>
                <p className="nd__stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="nd__filters">
            <div className="nd__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="nd__search" placeholder="Search by name, email, company…" />
            </div>
            <select className="nd__select"><option>Status: All</option><option>Open</option><option>Closed</option><option>Expired</option><option>Flagged</option></select>
            <select className="nd__select"><option>Verified: All</option><option>Verified</option><option>Unverified</option></select>
            <select className="nd__select"><option>Location: All</option><option>Cairo</option><option>Giza</option><option>Alexandria</option></select>
            <button className="nd__clear">Clear filters</button>
            <span className="nd__showing">Showing 1–20 of 8,637</span>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="nd__bulk">
              <span className="nd__bulk-count">{selected.length} needs selected</span>
              <button className="nd__bulk-btn nd__bulk-btn--feature">Feature Selected</button>
              <button className="nd__bulk-btn nd__bulk-btn--clear" onClick={() => setSelected([])}>Clear selection</button>
            </div>
          )}

          {/* Table */}
          <div className="nd__table-wrap">
            <table className="nd__table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="nd__cb" checked={selected.length === needs.length} onChange={toggleAll} /></th>
                  <th>NEED</th>
                  <th>BUYER</th>
                  <th>CATEGORY</th>
                  <th>BUDGET</th>
                  <th>PROPOSALS</th>
                  <th>STATUS</th>
                  <th>DEADLINE</th>
                  <th>FEATURED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {needs.map(row => (
                  <tr key={row.id} className={selected.includes(row.id) ? 'nd__row--selected' : ''}>
                    <td><input type="checkbox" className="nd__cb" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                    <td>
                      <p className="nd__need-title">{row.title}</p>
                      <p className="nd__need-sub">{row.cat} · {row.location}</p>
                    </td>
                    <td>
                      <div className="nd__buyer">
                        <div className="nd__avatar">{row.buyer}</div>
                        <span className="nd__buyer-name">{row.buyerName}</span>
                      </div>
                    </td>
                    <td className="nd__muted">{row.category}</td>
                    <td className="nd__muted">{row.budget}</td>
                    <td className="nd__muted">{row.proposals}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td className="nd__muted">{row.deadline}</td>
                    <td>
                      <button className="nd__star" onClick={() => toggleFeatured(row.id)}>
                        {row.featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td>
                      <button className="nd__action-btn" onClick={() => setModalNeed(row)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="nd__pagination">
            <span className="nd__pg-info">Showing 1–20 of 8,637 vendors</span>
            <div className="nd__pg-controls">
              <button className="nd__pg-btn">‹</button>
              <button className="nd__pg-btn nd__pg-btn--active">1</button>
              <button className="nd__pg-btn">2</button>
              <button className="nd__pg-btn">3</button>
              <span className="nd__pg-dots">…</span>
              <button className="nd__pg-btn">211</button>
              <button className="nd__pg-btn">›</button>
            </div>
            <div className="nd__pg-rows">Rows per page <select className="nd__pg-select"><option>20</option><option>50</option></select></div>
          </div>

        </div>
      </div>
      <NeedModal need={modalNeed} onClose={() => setModalNeed(null)} />
    </div>
  );
}
