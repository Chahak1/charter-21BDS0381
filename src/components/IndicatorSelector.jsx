import React from 'react';

export default function IndicatorSelector({ indicators, setIndicators }) {
  const availableIndicators = ['SMA', 'EMA', 'RSI', 'MACD', 'VWAP', 'Bollinger Bands'];

  console.log('IndicatorSelector render:', { indicators });

  const toggleIndicator = (indicator) => {
    console.log('Toggling indicator:', indicator);
    if (indicators.includes(indicator)) {
      const newIndicators = indicators.filter(ind => ind !== indicator);
      console.log('Removing indicator, new list:', newIndicators);
      setIndicators(newIndicators);
    } else {
      const newIndicators = [...indicators, indicator];
      console.log('Adding indicator, new list:', newIndicators);
      setIndicators(newIndicators);
    }
  };

  return (
    <div className="indicator-selector">
      <span style={{ fontSize: '12px', color: '#868993', marginRight: '8px' }}>
        Indicators:
      </span>
      {availableIndicators.map((indicator) => (
        <span
          key={indicator}
          className={`indicator-tag ${indicators.includes(indicator) ? 'active' : ''}`}
          onClick={() => toggleIndicator(indicator)}
        >
          {indicator}
        </span>
      ))}
      <button className="toolbar-button" style={{ marginLeft: '8px', fontSize: '11px' }}>
        + Add Indicator
      </button>
    </div>
  );
}