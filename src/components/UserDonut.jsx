import './UserDonut.css';

export default function UserDonut({ total, vendors, buyers }) {
  const vendorPct = total ? Math.round(vendors/total*100) : 67;
  const buyerPct  = total ? Math.round(buyers/total*100)  : 33;
  return (
    <div className="ud__card">
      <h3 className="ud__title">User Distribution</h3>
      <div className="ud__center">
        <svg viewBox="0 0 120 120" className="ud__svg">
          <circle cx="60" cy="60" r="44" fill="none" stroke="#1a1a1a" strokeWidth="18"/>
          <circle cx="60" cy="60" r="44" fill="none" stroke="#00A7E5" strokeWidth="18"
            strokeDasharray={`${0.67*276} ${0.33*276}`} strokeDashoffset="69"/>
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(0,167,229,0.25)" strokeWidth="18"
            strokeDasharray={`${0.33*276} ${0.67*276}`} strokeDashoffset={`${69-0.67*276}`}/>
          <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{total?.toLocaleString()||'0'}</text>
          <text x="60" y="67" textAnchor="middle" fill="#6B7280" fontSize="7">Total Users</text>
        </svg>
      </div>
      <div className="ud__legend">
        <div className="ud__leg-row"><span className="ud__dot" style={{background:'#00A7E5'}}/>Vendors {vendors?.toLocaleString()||0} ({vendorPct}%)</div>
        <div className="ud__leg-row"><span className="ud__dot" style={{background:'rgba(0,167,229,0.3)'}}/>Buyers {buyers?.toLocaleString()||0} ({buyerPct}%)</div>
      </div>
    </div>
  );
}
