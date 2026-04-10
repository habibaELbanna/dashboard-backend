import './AppScreenList.css';

const SCREENS = [
  'Splash Screen','Onboarding 1','Onboarding 2','Onboarding 3','Sign Up',
  'Login','Forgot Password','Browse Needs','Browse Vendors','Discover — Swipe',
  'Need Details','Vendor Profile','Messages List','Chat Thread',
  'Profile Screen','Notifications','Settings','Search & Filters','My Proposals',
];

export default function AppScreenList({ selected, onSelect }) {
  return (
    <div className="asl__card">
      <div className="asl__header">
        <h3 className="asl__title">App Screens</h3>
        <button className="asl__add-btn">+ Add Screen</button>
      </div>
      <p className="asl__hint">Drag to reorder · Click to edit</p>
      <div className="asl__list">
        {SCREENS.map((screen, i) => (
          <div key={i} className={`asl__item ${selected===screen?'asl__item--active':''}`} onClick={() => onSelect(screen)}>
            <span className="asl__drag">⋮⋮</span>
            <span className="asl__num">{i+1}</span>
            <span className="asl__name">{screen}</span>
            <span className="asl__dot"/>
            <button className="asl__icon-btn" onClick={e => e.stopPropagation()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button className="asl__icon-btn asl__icon-btn--danger" onClick={e => e.stopPropagation()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button className="asl__add-screen-btn">+ Add New Screen</button>
    </div>
  );
}
