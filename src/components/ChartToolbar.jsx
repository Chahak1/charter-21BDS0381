import React from 'react';

export default function ChartToolbar({ onRangeChange, currentRange }) {
  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <div className="chart-toolbar">
      <div className="toolbar-group">
        <span style={{ fontSize: '12px', color: '#868993' }}>Time:</span>
        {timeRanges.map((range) => (
          <button
            key={range}
            className={`toolbar-button ${currentRange === range ? 'active' : ''}`}
            onClick={() => onRangeChange(range)}
          >
            {range}
          </button>
        ))}
      </div>
      
      <div className="toolbar-group">
        <button className="toolbar-button">Candlestick</button>
        <button className="toolbar-button">Line</button>
        <button className="toolbar-button">Area</button>
      </div>
      
      <div className="toolbar-group">
        <button className="toolbar-button">Volume</button>
        <button className="toolbar-button">Full Screen</button>
      </div>
    </div>
  );
}