import Pagination from './Pagination';
import './VerificationTable.css';

const TYPE_STYLE = {
  BUYER:  { color:'#00A7E5', bg:'rgba(0,167,229,0.12)',  border:'rgba(0,167,229,0.3)'  },
  VENDOR: { color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
};

export default function VerificationTable({ requests, loading, search, onSearch, onApprove, onReject, total, page, onPage }) {
  const filtered = requests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vt__wrap">
      <div className="vt__filters">
        <div className="vt__search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="vt__search" placeholder="Search by name, company, email…" value={search} onChange={e => onSearch(e.target.value)}/>
        </div>
        <select className="vt__select"><option>Status: All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        <select className="vt__select"><option>Verified: All</option><option>Verified</option><option>Unverified</option></select>
        <select className="vt__select"><option>Location: All</option><option>Cairo</option><option>Giza</option><option>Alexandria</option></select>
        <button className="vt__clear" onClick={() => onSearch('')}>Clear filters</button>
        <span className="vt__showing vt__hide-sm">Showing 1–{filtered.length} of {total}</span>
      </div>

      <div className="vt__table-wrap">
        {loading ? <div className="vt__loading">Loading…</div> : (
          <table className="vt__table">
            <thead>
              <tr>
                <th></th>
                <th>COMPANY / USER</th>
                <th>TYPE</th>
                <th className="vt__hide-sm">CATEGORY</th>
                <th className="vt__hide-sm">LOCATION</th>
                <th className="vt__hide-sm">DOCUMENTS</th>
                <th className="vt__hide-sm">SUBMITTED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const t = TYPE_STYLE[row.type] || TYPE_STYLE.VENDOR;
                return (
                  <tr key={row.id}>
                    <td>
                      <div className="vt__av">{row.initials}</div>
                    </td>
                    <td>
                      <p className="vt__name">{row.name}</p>
                      <p className="vt__email">{row.email}</p>
                    </td>
                    <td>
                      <span className="vt__type" style={{ color:t.color, background:t.bg, border:`1px solid ${t.border}` }}>{row.type}</span>
                    </td>
                    <td className="vt__muted vt__hide-sm">{row.category || '—'}</td>
                    <td className="vt__muted vt__hide-sm">{row.location}</td>
                    <td className="vt__hide-sm">
                      <span className={`vt__docs ${row.docCount === 0 ? 'vt__docs--none' : 'vt__docs--has'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        {row.docCount} {row.docCount === 1 ? 'doc' : 'docs'}
                      </span>
                    </td>
                    <td className="vt__muted vt__hide-sm">{row.time}</td>
                    <td>
                      <div className="vt__actions">
                        <button className="vt__approve-btn" onClick={() => onApprove(row.id)}>Approve</button>
                        <button className="vt__reject-btn"  onClick={() => onReject(row.id)}>Reject</button>
                        <button className="vt__view-btn">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={8} className="vt__loading">No requests found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} total={total} perPage={10} onChange={onPage} />
    </div>
  );
}
