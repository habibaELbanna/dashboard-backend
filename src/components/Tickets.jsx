import './Tickets.css';

export default function Tickets({ tickets }) {
  return (
    <div className="tk__card">
      <div className="tk__header">
        <h3 className="tk__title">Open Tickets</h3>
        <span className="tk__count">7</span>
      </div>
      <div className="tk__list">
        {tickets.map((item, idx) => (
          <div key={idx} className={`tk__row ${idx < tickets.length - 1 ? 'tk__row--border' : ''}`}>
            <p className="tk__text">{item.title}</p>
            <span className="tk__priority" style={{ color: item.color }}>{item.priority}</span>
            <span className="tk__time">{item.time}</span>
          </div>
        ))}
      </div>
      <div className="tk__footer">
        <button className="tk__viewall">View all tickets →</button>
      </div>
    </div>
  );
}
