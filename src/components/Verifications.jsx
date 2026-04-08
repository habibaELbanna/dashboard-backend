import './Verifications.css';

export default function Verifications({ verifications }) {
  return (
    <div className="vf__card">
      <div className="vf__header">
        <h3 className="vf__title">Pending Verifications</h3>
        <span className="vf__count">23</span>
      </div>
      <div className="vf__list">
        {verifications.map((item, idx) => (
          <div key={idx} className={`vf__row ${idx < verifications.length - 1 ? 'vf__row--border' : ''}`}>
            <div className="vf__avatar">{item.avatar}</div>
            <div className="vf__info">
              <p className="vf__name">{item.name}</p>
              <p className="vf__type">{item.type}</p>
            </div>
            <button className="vf__review-btn">Review</button>
          </div>
        ))}
      </div>
      <div className="vf__footer">
        <button className="vf__viewall">View all 23 →</button>
      </div>
    </div>
  );
}
