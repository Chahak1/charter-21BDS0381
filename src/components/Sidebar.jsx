import React, { useState } from 'react';

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState('chart');

  const icons = [
    { id: 'chart', symbol: '📈', title: 'Chart' },
    { id: 'watchlist', symbol: '👁', title: 'Watchlist' },
    { id: 'alerts', symbol: '🔔', title: 'Alerts' },
    { id: 'news', symbol: '📰', title: 'News' },
    { id: 'screener', symbol: '🔍', title: 'Screener' },
    { id: 'calendar', symbol: '📅', title: 'Calendar' }
  ];

  return (
    <div className="sidebar">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`sidebar-icon ${activeIcon === icon.id ? 'active' : ''}`}
          onClick={() => setActiveIcon(icon.id)}
          title={icon.title}
        >
          <span style={{ fontSize: '16px' }}>{icon.symbol}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;