import { useState } from 'react';
import './PlacementForm.css';

export default function PlacementForm() {
  const [type,     setType]     = useState('need');
  const [start,    setStart]    = useState('');
  const [end,      setEnd]      = useState('');
  const [position, setPosition] = useState('');
  const [notes,    setNotes]    = useState('');

  const duration = start && end
    ? Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000))
    : null;

  return (
    <div className="pf__card">
      <h3 className="pf__title">Add Featured Placement</h3>

      <div className="pf__field">
        <label className="pf__label">Placement Type <span className="pf__req">*</span></label>
        <div className="pf__type-btns">
          <button className={`pf__type-btn ${type==='need'?'pf__type-btn--active':''}`} onClick={() => setType('need')}>Featured Need</button>
          <button className={`pf__type-btn ${type==='vendor'?'pf__type-btn--active':''}`} onClick={() => setType('vendor')}>Featured Vendor</button>
        </div>
      </div>

      <div className="pf__field">
        <label className="pf__label">Search Need / Vendor <span className="pf__req">*</span></label>
        <div className="pf__search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="pf__search" placeholder="Type to search…"/>
        </div>
        <div className="pf__selected">
          <span className="pf__selected-star">★</span>
          <div>
            <p className="pf__selected-name">Steel Frame Supply</p>
            <p className="pf__selected-sub">Construction · Cairo</p>
          </div>
          <button className="pf__selected-remove">✕</button>
        </div>
      </div>

      <div className="pf__row2">
        <div className="pf__field">
          <label className="pf__label">Start Date <span className="pf__req">*</span></label>
          <input type="date" className="pf__input" value={start} onChange={e => setStart(e.target.value)}/>
        </div>
        <div className="pf__field">
          <label className="pf__label">End Date <span className="pf__req">*</span></label>
          <input type="date" className="pf__input" value={end} onChange={e => setEnd(e.target.value)}/>
        </div>
      </div>

      {duration !== null && (
        <div className="pf__duration">Duration: {duration} days</div>
      )}

      <div className="pf__field">
        <label className="pf__label">Display Position</label>
        <input className="pf__input" placeholder="" value={position} onChange={e => setPosition(e.target.value)}/>
      </div>

      <div className="pf__field">
        <label className="pf__label">Internal Notes</label>
        <textarea className="pf__textarea" placeholder="Optional notes about this placement…" value={notes} onChange={e => setNotes(e.target.value)} rows={3}/>
      </div>

      <button className="pf__submit">Add Featured Placement</button>
    </div>
  );
}
