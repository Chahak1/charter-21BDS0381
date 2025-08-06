import React, { useState } from "react";
import StockChart from "./StockChart";
import IndicatorSelector from "./IndicatorSelector";

export default function ChartContainer({ selectedStock }) {
  const [indicators, setIndicators] = useState([]);
  const [range, setRange] = useState("1D");

  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{selectedStock} Stock Chart</h2>
        <div className="chart-controls">
          {timeRanges.map(timeRange => (
            <button
              key={timeRange}
              className={`time-range-btn ${range === timeRange ? 'active' : ''}`}
              onClick={() => setRange(timeRange)}
            >
              {timeRange}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrapper">
        <StockChart symbol={selectedStock} indicators={indicators} range={range} />
      </div>
      <IndicatorSelector indicators={indicators} setIndicators={setIndicators} />
    </div>
  );
}
