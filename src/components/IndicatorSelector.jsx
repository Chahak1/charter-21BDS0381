import React from 'react';

export default function IndicatorSelector({ indicators, setIndicators }) {
  const availableIndicators = ['SMA', 'EMA', 'RSI', 'MACD', 'VWAP', 'Bollinger Bands'];

  const toggleIndicator = (indicator) => {
    if (indicators.includes(indicator)) {
      setIndicators(indicators.filter(ind => ind !== indicator));
    } else {
      setIndicators([...indicators, indicator]);
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