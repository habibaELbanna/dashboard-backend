import './Topbar.css';
import logoSvg from '../Assets/logo.svg';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <header className="tb__topbar">
      <div className="tb__left">
        {/* Hamburger — only visible on mobile */}
        <button className="tb__hamburger" onClick={onMenuClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="tb__logo">
          <img src={logoSvg} alt="SELA" className="tb__logo-img" />
        </div>
        <div className="tb__divider" />
        <div className="tb__title-wrap">
          {title ? (
            <>
              <h2 className="tb__page-title">{title}</h2>
              {subtitle && <p className="tb__page-sub tb__hide-mobile">{subtitle}</p>}
            </>
          ) : (
            <>
              <h2 className="tb__greeting">Good morning, Admin</h2>
              <p className="tb__date tb__hide-mobile">{today}</p>
            </>
          )}
        </div>
      </div>

      <div className="tb__right">
        <div className="tb__search tb__hide-mobile">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search anything…" className="tb__search-input" />
        </div>
        <button className="tb__icon-btn">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="tb__notif-dot" />
        </button>
        <div className="tb__avatar">SA</div>
      </div>
    </header>
  );
}
