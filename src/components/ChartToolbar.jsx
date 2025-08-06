import React from 'react';

export default function ChartToolbar({ onRangeChange, currentRange }) {
  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  console.log('ChartToolbar render:', { currentRange });

  const handleRangeChange = (range) => {
    console.log('Range change requested:', range);
    console.log('onRangeChange function:', typeof onRangeChange);
    if (onRangeChange) {
      onRangeChange(range);
      console.log('Range change called successfully');
    } else {
      console.error('onRangeChange is not a function!');
    }
  };

  return (
    <div className="chart-toolbar">
      <div className="toolbar-group">
        <span style={{ fontSize: '12px', color: '#868993' }}>Time:</span>
        {timeRanges.map((range) => (
          <button
            key={range}
            className={`toolbar-button ${currentRange === range ? 'active' : ''}`}
            onClick={() => handleRangeChange(range)}
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