import React from "react";

const INDICATORS = [
  { id: "SMA", name: "Simple Moving Average", description: "20-period moving average" },
  { id: "EMA", name: "Exponential Moving Average", description: "12-period exponential moving average" },
  { id: "RSI", name: "Relative Strength Index", description: "14-period RSI" },
  { id: "MACD", name: "MACD", description: "Moving Average Convergence Divergence" },
  { id: "VWAP", name: "VWAP", description: "Volume Weighted Average Price" }
];

export default function IndicatorSelector({ indicators, setIndicators }) {
  function toggle(indicatorId) {
    setIndicators(prev =>
      prev.includes(indicatorId) ? prev.filter(i => i !== indicatorId) : [...prev, indicatorId]
    );
  }

  return (
    <div className="indicator-selector">
      <h3 className="indicator-title">Technical Indicators</h3>
      <div className="indicator-options">
        {INDICATORS.map((indicator) => (
          <div key={indicator.id} className="indicator-option">
            <input
              type="checkbox"
              id={indicator.id}
              checked={indicators.includes(indicator.id)}
              onChange={() => toggle(indicator.id)}
            />
            <label htmlFor={indicator.id}>
              <strong>{indicator.name}</strong>
              <br />
              <small>{indicator.description}</small>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}