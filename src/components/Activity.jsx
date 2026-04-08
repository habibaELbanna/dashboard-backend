import './Activity.css';

export default function Activity({ activities }) {
  return (
    <div className="ac__card">
      <div className="ac__header">
        <h3 className="ac__title">Recent Activity</h3>
        <button className="ac__viewall">View all</button>
      </div>
      <div className="ac__list">
        {activities.map((item, idx) => (
          <div key={item.id} className={`ac__row ${idx < activities.length - 1 ? 'ac__row--border' : ''}`}>
            <div className="ac__avatar">{item.avatar}</div>
            <p className="ac__text">{item.text}</p>
            <span className="ac__time">{item.time}</span>
            <span className="ac__badge" style={{ color: item.badge.color, background: item.badge.bg }}>
              {item.badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
