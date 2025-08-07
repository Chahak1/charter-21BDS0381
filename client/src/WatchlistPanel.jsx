import React from 'react';

const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOG", name: "Alphabet Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "IBM", name: "IBM Corp." },
  { symbol: "UL", name: "Unilever PLC" }
];

export default function WatchlistPanel({ onSelect, selected }) {
  return (
    <div className="watchlist-panel">
      <h3 className="watchlist-title">Watchlist</h3>
      <div className="stock-list">
        {STOCKS.map(stock => (
          <div 
            key={stock.symbol}
            className={`stock-item ${stock.symbol === selected ? 'selected' : ''}`}
            onClick={() => onSelect(stock.symbol)}
          >
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}