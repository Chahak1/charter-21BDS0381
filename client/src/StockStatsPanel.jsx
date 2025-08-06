import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StockStatsPanel({ symbol }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/stocks/${symbol.toLowerCase()}`);
        const data = response.data;
        
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          const previous = data[data.length - 2] || latest;
          
          const change = latest.close - previous.close;
          const changePercent = ((change / previous.close) * 100).toFixed(2);
          
          setStats({
            price: latest.close.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent,
            high: latest.high.toFixed(2),
            low: latest.low.toFixed(2),
            volume: latest.volume.toLocaleString(),
            open: latest.open.toFixed(2)
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [symbol]);

  if (loading) {
    return (
      <div className="stats-panel">
        <h3 className="stats-title">{symbol} Stats</h3>
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-panel">
        <h3 className="stats-title">{symbol} Stats</h3>
        <div className="error">Failed to load stats</div>
      </div>
    );
  }

  return (
    <div className="stats-panel">
      <h3 className="stats-title">{symbol} Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Price</div>
          <div className="stat-value">${stats.price}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Change</div>
          <div className={`stat-value ${parseFloat(stats.change) >= 0 ? 'positive' : 'negative'}`}>
            {parseFloat(stats.change) >= 0 ? '+' : ''}${stats.change} ({stats.changePercent}%)
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">High</div>
          <div className="stat-value">${stats.high}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Low</div>
          <div className="stat-value">${stats.low}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Open</div>
          <div className="stat-value">${stats.open}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Volume</div>
          <div className="stat-value">{stats.volume}</div>
        </div>
      </div>
    </div>
  );
}