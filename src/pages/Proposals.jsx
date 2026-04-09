import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './Proposals.css';

const STATS = [
  { label: 'TOTAL PROPOSALS', value: '8,921', sub: '↑ 5% this month',  subColor: '#10B981' },
  { label: 'PENDING REVIEW',  value: '312',   sub: 'Awaiting buyer decision', subColor: '#6B7280' },
  { label: 'ACCEPTED',        value: '1,847', sub: '↑ 9% this month',  subColor: '#10B981' },
  { label: 'REJECTED',        value: '2,103', sub: '24% rejection rate', subColor: '#EF4444' },
];

const PROPOSALS = [
  { id:4821, cat:'Construction', location:'Cairo',      vendor:'BuildRight Construction', buyer:'Masr Construction Co.',  need:'Steel Frame Supply — New Cairo',      amount:'EGP 280,000', status:'PENDING',   submitted:'10 Mar 2026' },
  { id:4819, cat:'Technology',   location:'Alexandria', vendor:'TechSupply Co.',           buyer:'TechNile Ltd',           need:'IT Infrastructure Setup',             amount:'EGP 145,000', status:'ACCEPTED',  submitted:'9 Mar 2026'  },
  { id:4815, cat:'Office Supplies',location:'Cairo',   vendor:'Office Solutions Ltd',     buyer:'Delta Group',            need:'Office Furniture Supply',             amount:'EGP 62,000',  status:'PENDING',   submitted:'8 Mar 2026'  },
  { id:4810, cat:'Logistics',    location:'Giza',       vendor:'NileTrans Logistics',      buyer:'Ramadan Logistics',      need:'Generator Rental',                    amount:'EGP 55,000',  status:'REJECTED',  submitted:'7 Mar 2026'  },
  { id:4805, cat:'Energy',       location:'Cairo',      vendor:'PowerGen Egypt',           buyer:'AlNour Developers',      need:'Electrical Wiring',                   amount:'EGP 98,000',  status:'ACCEPTED',  submitted:'6 Mar 2026'  },
  { id:4801, cat:'Healthcare',   location:'Alexandria', vendor:'MediSource',               buyer:'MediCare Group',         need:'Medical Equipment Supply',            amount:'EGP 195,000', status:'PENDING',   submitted:'5 Mar 2026'  },
  { id:4798, cat:'Other',        location:'Cairo',      vendor:'AlphaVend',                buyer:'Horizon Group',          need:'Catering Service',                    amount:'EGP 38,000',  status:'WITHDRAWN', submitted:'4 Mar 2026'  },
  { id:4792, cat:'Construction', location:'Giza',       vendor:'GreenSupply Co.',          buyer:'Safeguard Real Estate',  need:'Marble Flooring',                     amount:'EGP 420,000', status:'ACCEPTED',  submitted:'3 Mar 2026'  },
  { id:4788, cat:'Technology',   location:'Cairo',      vendor:'DataTech Egypt',           buyer:'TechNile Ltd',           need:'CCTV Security System',                amount:'EGP 72,000',  status:'REJECTED',  submitted:'2 Mar 2026'  },
];

function StatusBadge({ status }) {
  const map = {
    PENDING:   { color: '#FFA500', bg: 'rgba(255,165,0,0.12)',  border: 'rgba(255,165,0,0.3)'  },
    ACCEPTED:  { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    REJECTED:  { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)'  },
    WITHDRAWN: { color: '#6B7280', bg: 'rgba(107,114,128,0.12)',border: 'rgba(107,114,128,0.3)'},
  };
  const s = map[status] || map.PENDING;
  return <span className="pr__status" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{status}</span>;
}

function ProposalModal({ proposal, onClose }) {
  if (!proposal) return null;
  const vendorInitials = proposal.vendor.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const buyerInitials  = proposal.buyer.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
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
              <div className="pr__modal-party-avatar">{vendorInitials}</div>
              <p className="pr__modal-party-name">{proposal.vendor}</p>
              <p className="pr__modal-party-sub">{proposal.cat} · {proposal.location}</p>
              <span className="pr__modal-view-link">View Profile</span>
            </div>
            <div className="pr__modal-party">
              <p className="pr__modal-party-label">BUYER</p>
              <div className="pr__modal-party-avatar">{buyerInitials}</div>
              <p className="pr__modal-party-name">{proposal.buyer}</p>
              <p className="pr__modal-party-sub">Real Estate Development</p>
              <span className="pr__modal-view-link">View Profile</span>
            </div>
          </div>

          <div className="pr__modal-need-section">
            <p className="pr__modal-section-label">NEED</p>
            <p className="pr__modal-need-title">{proposal.need}</p>
            <p className="pr__modal-need-sub">{proposal.cat} · {proposal.location}</p>
            <span className="pr__modal-view-link">View Need</span>
          </div>

          <div className="pr__modal-grid">
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">AMOUNT</p><p className="pr__modal-grid-val">{proposal.amount}</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">QUANTITY</p><p className="pr__modal-grid-val">850 tons</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">DELIVERY DATE</p><p className="pr__modal-grid-val">15 Apr 2026</p></div>
            <div className="pr__modal-grid-item"><p className="pr__modal-grid-label">SUBMITTED</p><p className="pr__modal-grid-val">{proposal.submitted}</p></div>
          </div>

          <div>
            <p className="pr__modal-section-label">PROPOSAL MESSAGE</p>
            <div className="pr__modal-message">
              We are pleased to submit our proposal for the steel frame supply for the New Cairo Tower project. Our company has over 15 years of experience in large-scale construction projects across Egypt. We guarantee delivery within the specified timeframe and all materials meet international quality standards (ISO 9001).
            </div>
          </div>

          <div>
            <p className="pr__modal-section-label">ATTACHMENTS</p>
            <div className="pr__modal-files">
              <div className="pr__modal-file"><span>📄 technical-specifications.pdf</span><span className="pr__modal-file-size">2.4 MB</span></div>
              <div className="pr__modal-file"><span>📄 compliance-certificate.pdf</span><span className="pr__modal-file-size">1.8 MB</span></div>
              <div className="pr__modal-file"><span>📄 company-profile.pdf</span><span className="pr__modal-file-size">3.2 MB</span></div>
            </div>
          </div>

          <div>
            <p className="pr__modal-section-label">TIMELINE</p>
            <div className="pr__modal-timeline">
              <div className="pr__modal-timeline-item"><span className="pr__modal-tl-dot" /><div><p className="pr__modal-tl-title">Proposal submitted</p><p className="pr__modal-tl-time">{proposal.submitted} at 2:30 PM</p></div></div>
              <div className="pr__modal-timeline-item"><span className="pr__modal-tl-dot" /><div><p className="pr__modal-tl-title">Buyer viewed proposal</p><p className="pr__modal-tl-time">{proposal.submitted} at 4:15 PM</p></div></div>
              <div className="pr__modal-timeline-item"><span className="pr__modal-tl-dot" /><div><p className="pr__modal-tl-title">Status updated to {proposal.status}</p><p className="pr__modal-tl-time">{proposal.submitted} at 4:20 PM</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Proposals() {
  const [modalProposal, setModalProposal] = useState(null);

  return (
    <div className="pr__layout">
      <Sidebar />
      <div className="pr__main">
        <Topbar title="Proposals" subtitle="Monitor all submitted proposals across the platform" />
        <div className="pr__content">

          {/* Stats */}
          <div className="pr__stats">
            {STATS.map((s, i) => (
              <div key={i} className="pr__stat-card">
                <p className="pr__stat-label">{s.label}</p>
                <p className="pr__stat-value">{s.value}</p>
                <p className="pr__stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="pr__filters">
            <div className="pr__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="pr__search" placeholder="Search by name, email, company…" />
            </div>
            <select className="pr__select"><option>Status: All</option><option>Pending</option><option>Accepted</option><option>Rejected</option><option>Withdrawn</option></select>
            <select className="pr__select"><option>Verified: All</option></select>
            <select className="pr__select"><option>Location: All</option><option>Cairo</option><option>Giza</option><option>Alexandria</option></select>
            <button className="pr__clear">Clear filters</button>
            <span className="pr__showing">Showing 1–20 of 8,637</span>
          </div>

          {/* Table */}
          <div className="pr__table-wrap">
            <table className="pr__table">
              <thead>
                <tr>
                  <th>PROPOSAL</th>
                  <th>VENDOR</th>
                  <th>BUYER</th>
                  <th>NEED TITLE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>SUBMITTED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {PROPOSALS.map(row => (
                  <tr key={row.id}>
                    <td>
                      <p className="pr__proposal-id">Proposal #{row.id}</p>
                      <p className="pr__proposal-sub">{row.cat} · {row.location}</p>
                    </td>
                    <td className="pr__white">{row.vendor}</td>
                    <td className="pr__white">{row.buyer}</td>
                    <td className="pr__muted">{row.need}</td>
                    <td className="pr__amount">{row.amount}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td className="pr__muted">{row.submitted}</td>
                    <td>
                      <button className="pr__action-btn" onClick={() => setModalProposal(row)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pr__pagination">
            <span className="pr__pg-info">Showing 1–20 of 8,637 vendors</span>
            <div className="pr__pg-controls">
              <button className="pr__pg-btn">‹</button>
              <button className="pr__pg-btn pr__pg-btn--active">1</button>
              <button className="pr__pg-btn">2</button>
              <button className="pr__pg-btn">3</button>
              <span className="pr__pg-dots">…</span>
              <button className="pr__pg-btn">211</button>
              <button className="pr__pg-btn">›</button>
            </div>
            <div className="pr__pg-rows">Rows per page <select className="pr__pg-select"><option>20</option><option>50</option></select></div>
          </div>

        </div>
      </div>
      <ProposalModal proposal={modalProposal} onClose={() => setModalProposal(null)} />
    </div>
  );
}
