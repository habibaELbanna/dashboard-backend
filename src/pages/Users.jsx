import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './Users.css';

const STATS = [
  { label: 'TOTAL USERS',        value: '12,847', sub: '↑ 8% this month',  subColor: '#10B981' },
  { label: 'TOTAL BUYERS',       value: '4,210',  sub: '↑ 11% this month', subColor: '#10B981' },
  { label: 'TOTAL VENDORS',      value: '8,637',  sub: '↑ 6% this month',  subColor: '#10B981' },
  { label: 'SUSPENDED ACCOUNTS', value: '34',     sub: '↑ 2 this week',    subColor: '#EF4444' },
];

const BUYERS = [
  { id:1, initials:'MC', name:'Masr Construction Co.', email:'masr@constructions.eg', location:'Cairo, Egypt', needs:34, status:'ACTIVE', joined:'12 Jan 2025' },
  { id:2, initials:'DG', name:'Delta Group',            email:'delta@group.com',       location:'Giza',         needs:18, status:'ACTIVE', joined:'3 Feb 2025' },
  { id:3, initials:'HG', name:'Horizon Group',          email:'info@horizon.eg',       location:'Alexandria',   needs:9,  status:'SUSPENDED', joined:'14 Feb 2025' },
  { id:4, initials:'NK', name:'Nour Khaled',            email:'nour.k@email.com',      location:'Cairo',        needs:4,  status:'ACTIVE', joined:'20 Feb 2025' },
  { id:5, initials:'OL', name:'Office Line',            email:'office@line.eg',        location:'6th October',  needs:7,  status:'PENDING', joined:'22 Feb 2025' },
  { id:6, initials:'SR', name:'Safeguard Real Estate',  email:'sr@safe.eg',            location:'New Cairo',    needs:12, status:'ACTIVE', joined:'1 Mar 2025' },
  { id:7, initials:'BT', name:'BuildTech Partners',     email:'bt@partners.eg',        location:'Cairo',        needs:6,  status:'ACTIVE', joined:'3 Mar 2025' },
  { id:8, initials:'EG', name:'Egyptian Foods Co.',     email:'eg@foods.com',          location:'Alexandria',   needs:2,  status:'SUSPENDED', joined:'5 Mar 2025' },
  { id:9, initials:'MK', name:'Mohamed Kamal',          email:'m.kamal@email.com',     location:'Giza',         needs:1,  status:'PENDING', joined:'8 Mar 2025' },
  { id:10,initials:'RL', name:'Ramadan Logistics',      email:'rl@logistics.eg',       location:'Cairo',        needs:21, status:'ACTIVE', joined:'10 Mar 2025' },
];

const VENDORS = [
  { id:1, initials:'BR', name:'BuildRight Construction', email:'build@right.eg',   location:'Cairo',       category:'Construction',  proposals:89,  verified:true,  status:'ACTIVE',    joined:'5 Jan 2025' },
  { id:2, initials:'TS', name:'TechSupply Co.',          email:'tech@supply.eg',   location:'Cairo',       category:'Technology',    proposals:67,  verified:true,  status:'ACTIVE',    joined:'10 Jan 2025' },
  { id:3, initials:'OS', name:'Office Solutions Ltd',    email:'os@solutions.eg',  location:'Giza',        category:'Office Supplies',proposals:134, verified:true,  status:'ACTIVE',    joined:'15 Jan 2025' },
  { id:4, initials:'NL', name:'NileTrans Logistics',     email:'nile@trans.eg',    location:'6th October', category:'Logistics',     proposals:52,  verified:true,  status:'ACTIVE',    joined:'20 Jan 2025' },
  { id:5, initials:'PE', name:'PowerGen Egypt',          email:'power@gen.eg',     location:'New Cairo',   category:'Energy',        proposals:41,  verified:false, status:'PENDING',   joined:'25 Jan 2025' },
  { id:6, initials:'MS', name:'MediSource',              email:'medi@source.eg',   location:'Alexandria',  category:'Healthcare',    proposals:29,  verified:false, status:'SUSPENDED', joined:'1 Feb 2025' },
  { id:7, initials:'AV', name:'AlphaVend',               email:'alpha@vend.eg',    location:'Cairo',       category:'Marketing',     proposals:18,  verified:true,  status:'ACTIVE',    joined:'5 Feb 2025' },
  { id:8, initials:'GS', name:'GreenSupply Co.',         email:'green@supply.eg',  location:'Giza',        category:'Construction',  proposals:7,   verified:false, status:'PENDING',   joined:'8 Feb 2025' },
  { id:9, initials:'DT', name:'DataTech Egypt',          email:'data@tech.eg',     location:'Cairo',       category:'Technology',    proposals:44,  verified:true,  status:'ACTIVE',    joined:'12 Feb 2025' },
  { id:10,initials:'FV', name:'FastVend',                email:'fast@vend.eg',     location:'Alexandria',  category:'Logistics',     proposals:11,  verified:false, status:'ACTIVE',    joined:'15 Feb 2025' },
];

function StatusBadge({ status }) {
  const map = {
    ACTIVE:    { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    SUSPENDED: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
    PENDING:   { color: '#FFA500', bg: 'rgba(255,165,0,0.12)',  border: 'rgba(255,165,0,0.3)' },
  };
  const s = map[status] || map.ACTIVE;
  return (
    <span className="us__status" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  );
}

function UserProfileModal({ user, tab, onClose }) {
  if (!user) return null;
  return (
    <div className="us__overlay" onClick={onClose}>
      <div className="us__modal" onClick={e => e.stopPropagation()}>
        <div className="us__modal-header">
          <h3 className="us__modal-title">User Profile</h3>
          <button className="us__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="us__modal-body">
          <div className="us__modal-avatar-wrap">
            <div className="us__modal-avatar">{user.initials}</div>
            <h4 className="us__modal-name">{user.name}</h4>
            <StatusBadge status={user.status} />
          </div>
          <div className="us__modal-stats">
            <div className="us__modal-stat"><span className="us__modal-stat-val">{tab === 'buyers' ? user.needs : user.proposals}</span><span className="us__modal-stat-label">{tab === 'buyers' ? 'Needs' : 'Proposals'}</span></div>
            <div className="us__modal-stat"><span className="us__modal-stat-val">4.8</span><span className="us__modal-stat-label">Rating</span></div>
            <div className="us__modal-stat"><span className="us__modal-stat-val">2025</span><span className="us__modal-stat-label">Joined</span></div>
          </div>
          <div className="us__modal-info">
            <div className="us__modal-row"><span className="us__modal-key">Email</span><span className="us__modal-val">{user.email}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Phone</span><span className="us__modal-val">+20 123 456 7890</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Location</span><span className="us__modal-val">{user.location}</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Last Active</span><span className="us__modal-val">2 hours ago</span></div>
            <div className="us__modal-row"><span className="us__modal-key">Total Needs</span><span className="us__modal-val">{tab === 'buyers' ? user.needs : user.proposals}</span></div>
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
  const [tab, setTab] = useState('buyers');
  const [selected, setSelected] = useState([]);
  const [modalUser, setModalUser] = useState(null);

  const data = tab === 'buyers' ? BUYERS : VENDORS;

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === data.length ? [] : data.map(d => d.id));

  return (
    <div className="us__layout">
      <Sidebar />
      <div className="us__main">
        <Topbar title="Users" subtitle="Manage all registered buyers and vendors" />
        <div className="us__content">

          {/* Stats */}
          <div className="us__stats">
            {STATS.map((s, i) => (
              <div key={i} className="us__stat-card">
                <p className="us__stat-label">{s.label}</p>
                <p className="us__stat-value">{s.value}</p>
                <p className="us__stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="us__tabs">
            <button className={`us__tab ${tab === 'buyers' ? 'us__tab--active' : ''}`} onClick={() => { setTab('buyers'); setSelected([]); }}>
              Buyers <span className="us__tab-count">4,210</span>
            </button>
            <button className={`us__tab ${tab === 'vendors' ? 'us__tab--active' : ''}`} onClick={() => { setTab('vendors'); setSelected([]); }}>
              Vendors <span className="us__tab-count">8,637</span>
            </button>
          </div>

          {/* Filters */}
          <div className="us__filters">
            <div className="us__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="us__search" placeholder="Search by name, email, company…" />
            </div>
            <select className="us__select"><option>Status: All</option><option>Active</option><option>Suspended</option><option>Pending</option></select>
            <select className="us__select"><option>Verified: All</option><option>Verified</option><option>Unverified</option></select>
            <select className="us__select"><option>Location: All</option><option>Cairo</option><option>Giza</option><option>Alexandria</option></select>
            <button className="us__clear">Clear filters</button>
            <span className="us__showing">Showing 1–20 of {tab === 'buyers' ? '4,210' : '8,637'}</span>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="us__bulk">
              <span className="us__bulk-count">{selected.length} users selected</span>
              <button className="us__bulk-btn us__bulk-btn--verify">Verify</button>
              <button className="us__bulk-btn us__bulk-btn--suspend">Suspend</button>
              <button className="us__bulk-btn us__bulk-btn--delete">Delete</button>
            </div>
          )}

          {/* Table */}
          <div className="us__table-wrap">
            <table className="us__table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="us__cb" checked={selected.length === data.length} onChange={toggleAll} /></th>
                  <th></th>
                  <th>{tab === 'buyers' ? 'BUYER' : 'VENDOR'}</th>
                  <th>EMAIL</th>
                  <th>LOCATION</th>
                  {tab === 'vendors' && <><th>CATEGORY</th><th>PROPOSALS</th><th>VERIFIED</th></>}
                  {tab === 'buyers' && <th>NEEDS POSTED</th>}
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className={selected.includes(row.id) ? 'us__row--selected' : ''}>
                    <td><input type="checkbox" className="us__cb" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                    <td><div className="us__avatar">{row.initials}</div></td>
                    <td className="us__name-cell">{row.name}</td>
                    <td className="us__muted">{row.email}</td>
                    <td className="us__muted">{row.location}</td>
                    {tab === 'vendors' && (
                      <>
                        <td className="us__muted">{row.category}</td>
                        <td className="us__muted">{row.proposals}</td>
                        <td>{row.verified ? <span className="us__verified">✓ Verified</span> : <span className="us__muted">—</span>}</td>
                      </>
                    )}
                    {tab === 'buyers' && <td className="us__muted">{row.needs}</td>}
                    <td><StatusBadge status={row.status} /></td>
                    <td className="us__muted">{row.joined}</td>
                    <td>
                      <div className="us__actions">
                        <button className="us__action-btn" title="View" onClick={() => setModalUser(row)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="us__action-btn" title="Message">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        </button>
                        <button className="us__action-btn" title="More">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="us__pagination">
            <span className="us__pg-info">Showing 1–20 of {tab === 'buyers' ? '4,210 buyers' : '8,637 vendors'}</span>
            <div className="us__pg-controls">
              <button className="us__pg-btn">‹</button>
              <button className="us__pg-btn us__pg-btn--active">1</button>
              <button className="us__pg-btn">2</button>
              <button className="us__pg-btn">3</button>
              <span className="us__pg-dots">…</span>
              <button className="us__pg-btn">211</button>
              <button className="us__pg-btn">›</button>
            </div>
            <div className="us__pg-rows">
              Rows per page <select className="us__pg-select"><option>20</option><option>50</option><option>100</option></select>
            </div>
          </div>

        </div>
      </div>

      <UserProfileModal user={modalUser} tab={tab} onClose={() => setModalUser(null)} />
    </div>
  );
}
