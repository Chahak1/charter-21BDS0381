import React, { useState, useEffect } from 'react';

export default function StockStatsPanel({ symbol }) {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    // Simulate fetching stock statistics
    const mockStats = {
      open: (Math.random() * 200 + 100).toFixed(2),
      high: (Math.random() * 250 + 150).toFixed(2),
      low: (Math.random() * 150 + 80).toFixed(2),
      volume: Math.floor(Math.random() * 10000000).toLocaleString(),
      avgVolume: Math.floor(Math.random() * 5000000).toLocaleString(),
      marketCap: `${(Math.random() * 2000 + 500).toFixed(0)}B`,
      peRatio: (Math.random() * 30 + 10).toFixed(2),
      eps: (Math.random() * 10 + 1).toFixed(2),
      dividend: (Math.random() * 3).toFixed(2),
      yield: (Math.random() * 4).toFixed(2)
    };

    const mockPerformance = {
      '1D': { value: (Math.random() - 0.5) * 5, label: '1D' },
      '1W': { value: (Math.random() - 0.5) * 8, label: '1W' },
      '1M': { value: (Math.random() - 0.5) * 15, label: '1M' },
      '3M': { value: (Math.random() - 0.5) * 25, label: '3M' },
      '6M': { value: (Math.random() - 0.5) * 35, label: '6M' },
      '1Y': { value: (Math.random() - 0.5) * 50, label: '1Y' }
    };

    setStats(mockStats);
    setPerformance(mockPerformance);
  }, [symbol]);

  if (!stats || !performance) {
    return <div className="stats-panel loading">Loading...</div>;
  }

  return (
    <div className="stats-panel">
      <div className="stats-header">{symbol} Statistics</div>
      
      <div className="stat-row">
        <span className="stat-label">Open</span>
        <span className="stat-value">${stats.open}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">High</span>
        <span className="stat-value">${stats.high}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">Low</span>
        <span className="stat-value">${stats.low}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">Volume</span>
        <span className="stat-value">{stats.volume}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">Avg Volume</span>
        <span className="stat-value">{stats.avgVolume}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">Market Cap</span>
        <span className="stat-value">{stats.marketCap}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">P/E Ratio</span>
        <span className="stat-value">{stats.peRatio}</span>
      </div>
      
      <div className="stat-row">
        <span className="stat-label">EPS</span>
        <span className="stat-value">${stats.eps}</span>
      </div>
      
      <div className="performance-section">
        <div className="stats-header">Performance</div>
        <div className="performance-grid">
          {Object.entries(performance).map(([key, data]) => (
            <div key={key} className="performance-item">
              <div className="performance-label">{data.label}</div>
              <div className={`performance-value ${data.value >= 0 ? 'positive' : 'negative'}`}>
                {data.value >= 0 ? '+' : ''}{data.value.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}