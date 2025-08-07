import React from 'react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>📊 Stock Chart</h2>
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#watchlist">Watchlist</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#news">Market News</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>
    </div>
  );
}