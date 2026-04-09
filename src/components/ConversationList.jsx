import Pagination from './Pagination';
import './ConversationList.css';

export default function ConversationList({ conversations, loading, search, onSearch, total, page, onPage }) {
  const filtered = conversations.filter(c =>
    `${c.participant_a} ${c.participant_b}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cl__wrap">
      <div className="cl__filters">
        <div className="cl__search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="cl__search" placeholder="Search by user, keyword…" value={search} onChange={e => onSearch(e.target.value)} />
        </div>
        <select className="cl__select"><option>Status: All</option><option>Active</option><option>Flagged</option></select>
        <button className="cl__clear" onClick={() => onSearch('')}>Clear filters</button>
        <span className="cl__showing cl__hide-sm">Showing 1–{filtered.length} of {total?.toLocaleString()||0}</span>
      </div>

      <div className="cl__table-wrap">
        {loading ? <div className="cl__loading">Loading…</div> : (
          <table className="cl__table">
            <thead>
              <tr>
                <th>PARTICIPANTS</th>
                <th className="cl__hide-sm">LAST MESSAGE</th>
                <th>MESSAGES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="cl__participants">
                      <div className="cl__av cl__av--a">{row.initials_a}</div>
                      <div className="cl__av cl__av--b">{row.initials_b}</div>
                      <span className="cl__pnames">{row.participant_a} → {row.participant_b}</span>
                    </div>
                  </td>
                  <td className="cl__muted cl__hide-sm">{row.last_message}</td>
                  <td className="cl__count">{row.message_count}</td>
                  <td>
                    <button className="cl__action-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={4} className="cl__loading">No conversations found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} total={total} perPage={20} onChange={onPage} />
    </div>
  );
}
