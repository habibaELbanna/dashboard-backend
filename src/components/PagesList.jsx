import './PagesList.css';

const PAGES_TREE = {
  MAIN:           ['Home','About SELA','How It Works','Pricing','Contact Us'],
  AUTHENTICATION: ['Login','Sign Up','Forgot Password'],
  'VENDOR PAGES': ['Browse Needs','Need Details','My Proposals'],
  'BUYER PAGES':  ['Browse Vendors','Vendor Profile','Post a Need'],
};

export default function PagesList({ selected, onSelect, hasUnsaved }) {
  return (
    <div className="pl__panel">
      <div className="pl__header">
        <span>Pages</span>
        <span className="pl__count">24</span>
      </div>
      <div className="pl__search">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input className="pl__search-input" placeholder="Search pages…"/>
      </div>
      <div className="pl__list">
        {Object.entries(PAGES_TREE).map(([group, pages]) => (
          <div key={group}>
            <p className="pl__group">{group}</p>
            {pages.map(page => (
              <button key={page}
                className={`pl__item ${selected===page ? 'pl__item--active' : ''}`}
                onClick={() => onSelect(page)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
                <span>{page}</span>
                {hasUnsaved && selected === page && <span className="pl__dot"/>}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginLeft:'auto'}}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
