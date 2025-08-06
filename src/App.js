import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChartContainer from './components/ChartContainer';
import WatchlistPanel from './components/WatchlistPanel';
import StockStatsPanel from './components/StockStatsPanel';
import './index.css';

export default function App() {
  const [selectedStock, setSelectedStock] = useState('AAPL');

  console.log('App render:', { selectedStock });

  const handleStockSelect = (symbol) => {
    console.log('App: Stock selection changed to:', symbol);
    setSelectedStock(symbol);
  };

  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-content">
        <div className="chart-container">
          <ChartContainer selectedStock={selectedStock} />
        </div>
      </div>
      <div className="right-panel">
        <WatchlistPanel onSelect={handleStockSelect} selected={selectedStock} />
        <StockStatsPanel symbol={selectedStock} />
      </div>
    </div>
  );
}