import './ScreenEditor.css';

const EDITABLE_ELEMENTS = {
  'Browse Needs':     [{ icon:'T', label:'Page Title', value:'Browse Needs' }, { icon:'T', label:'Subtitle', value:'487 opportunities available' }, { icon:'⬜', label:'Header Background', value:'header-bg.png' }, { icon:'T', label:'Empty State Message', value:'No needs found…' }],
  'Browse Vendors':   [{ icon:'T', label:'Page Title', value:'Browse Vendors' }, { icon:'T', label:'Subtitle', value:'8,637 verified vendors' }, { icon:'⬜', label:'Header Background', value:'vendors-bg.png' }, { icon:'T', label:'Empty State Message', value:'No vendors found…' }],
  'Splash Screen':    [{ icon:'⬜', label:'Logo Image', value:'logo.svg' }, { icon:'T', label:'Tagline', value:'Connect. Procure. Grow.' }, { icon:'⬜', label:'Background', value:'splash-bg.png' }],
  'Login':            [{ icon:'T', label:'Title', value:'Welcome back' }, { icon:'T', label:'Subtitle', value:'Sign in to continue' }, { icon:'T', label:'CTA Button', value:'Sign In' }],
  'Sign Up':          [{ icon:'T', label:'Title', value:'Create Account' }, { icon:'T', label:'Subtitle', value:'Join SELA today' }, { icon:'T', label:'CTA Button', value:'Get Started' }],
};

function getElements(screen) {
  return EDITABLE_ELEMENTS[screen] || [
    { icon:'T', label:'Page Title', value:screen },
    { icon:'T', label:'Subtitle', value:'...' },
  ];
}

export default function ScreenEditor({ screen }) {
  const elements = getElements(screen);

  return (
    <div className="se__card">
      <div className="se__header">
        <h3 className="se__title">Screen Editor</h3>
        <span className="se__screen-badge">{screen}</span>
        <button className="se__save-btn">Save Changes</button>
      </div>

      {/* Phone mockup */}
      <div className="se__phone-wrap">
        <div className="se__phone">
          <div className="se__phone-notch"/>
          <div className="se__phone-screen">
            <div className="se__phone-bar">
              <span className="se__phone-title">{screen}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <div className="se__phone-block se__phone-block--active"/>
            <div className="se__phone-block"/>
            <div className="se__phone-block"/>
          </div>
        </div>
      </div>

      {/* Editable elements */}
      <div className="se__elements">
        <p className="se__elements-label">EDITABLE ELEMENTS</p>
        {elements.map((el, i) => (
          <div key={i} className="se__element-row">
            <span className="se__element-icon">{el.icon}</span>
            <span className="se__element-label">{el.label}</span>
            <span className="se__element-value">{el.value}</span>
            <button className="se__edit-btn">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
