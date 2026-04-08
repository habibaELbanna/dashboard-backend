import './StatsGrid.css';

export default function StatsGrid({ stats }) {
  const cards = [
    {
      label: 'Total Users',
      value: stats?.users?.toLocaleString() || '12,847',
      sub: `${stats?.buyers?.toLocaleString() || '4,210'} buyers · ${stats?.vendors?.toLocaleString() || '8,637'} vendors`,
      badge: '↑ 8%', badgeUp: true,
    },
    {
      label: 'Active Needs',
      value: stats?.activeNeeds?.toLocaleString() || '1,342',
      sub: `${stats?.needsThisMonth || '487'} posted this month`,
      badge: '↑ 14%', badgeUp: true,
    },
    {
      label: 'Proposals Submitted',
      value: stats?.proposals?.toLocaleString() || '8,921',
      sub: `${stats?.pendingProposals || '312'} pending review`,
      badge: '↑ 5%', badgeUp: true,
    },
    {
      label: 'Platform Revenue',
      value: 'EGP 2.4M',
      sub: 'This month vs last',
      badge: '↓ 3%', badgeUp: false,
    },
  ];

  return (
    <div className="sg__grid">
      {cards.map((card, i) => (
        <div key={i} className="sg__card">
          <div className="sg__card-top">
            <span className="sg__label">{card.label}</span>
            <span className={`sg__badge ${card.badgeUp ? 'sg__badge--up' : 'sg__badge--down'}`}>
              {card.badge}
            </span>
          </div>
          <p className="sg__value">{card.value}</p>
          <p className="sg__sub">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
