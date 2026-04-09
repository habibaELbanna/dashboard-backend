import './FlaggedPanel.css';

export default function FlaggedPanel({ flagged, reported, flaggedCount, reportedCount }) {
  return (
    <div className="fp__wrap">

      {/* Flagged Messages */}
      <div className="fp__panel">
        <div className="fp__header">
          <h3 className="fp__title">Flagged Messages</h3>
          <span className="fp__badge-red">{flaggedCount || flagged.length}</span>
        </div>
        <div className="fp__flagged-list">
          {flagged.map(item => (
            <div key={item.id} className="fp__flagged-row">
              <div className="fp__av">{item.initials}</div>
              <div className="fp__flagged-info">
                <p className="fp__flagged-name">{item.name}</p>
                <p className="fp__flagged-text">{item.text}</p>
                <p className="fp__flagged-time">{item.time}</p>
              </div>
              <button className="fp__review-btn">Review</button>
            </div>
          ))}
        </div>
        <button className="fp__view-all">View all {flaggedCount || flagged.length} flagged →</button>
      </div>

      {/* Reported Conversations */}
      <div className="fp__panel">
        <div className="fp__header">
          <h3 className="fp__title">Reported Conversations</h3>
          <span className="fp__badge-red">{reportedCount || reported.length}</span>
        </div>
        <div className="fp__reported-list">
          {reported.map(item => (
            <div key={item.id} className="fp__reported-row">
              <p className="fp__reported-names">{item.names}</p>
              <p className="fp__reported-reason">{item.reason}</p>
              <p className="fp__reported-by">Reported by {item.reporter}</p>
              <div className="fp__reported-actions">
                <button className="fp__resolve-btn">Resolve</button>
                <button className="fp__dismiss-btn">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
