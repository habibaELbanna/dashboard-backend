import './Pagination.css';

export default function Pagination({ page, total, perPage, onChange }) {
  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  return (
    <div className="pgn__wrap">
      <span className="pgn__info pgn__hide-sm">Showing {from}–{to} of {total?.toLocaleString() || 0}</span>
      <div className="pgn__controls">
        <button className="pgn__btn" onClick={() => onChange(Math.max(1, page - 1))}>‹</button>
        {[1, 2, 3].map(n => (
          <button key={n} className={`pgn__btn ${page === n ? 'pgn__btn--active' : ''}`} onClick={() => onChange(n)}>{n}</button>
        ))}
        <span className="pgn__dots">…</span>
        <button className="pgn__btn" onClick={() => onChange(page + 1)}>›</button>
      </div>
      <div className="pgn__rows">
        <span className="pgn__hide-sm">Rows per page</span>
        <select className="pgn__select">
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
    </div>
  );
}
