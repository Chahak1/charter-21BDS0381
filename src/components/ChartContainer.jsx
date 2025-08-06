import React, { useState } from 'react';
import ChartToolbar from './ChartToolbar';
import StockChart from './StockChart';
import IndicatorSelector from './IndicatorSelector';

export default function ChartContainer({ selectedStock }) {
  const [indicators, setIndicators] = useState(['SMA']);
  const [range, setRange] = useState('1D');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChartToolbar onRangeChange={setRange} currentRange={range} />
      <IndicatorSelector 
        indicators={indicators} 
        setIndicators={setIndicators} 
      />
      <div className="chart-area">
        <StockChart 
          symbol={selectedStock} 
          indicators={indicators} 
          range={range} 
        />
      </div>
    </div>
  );
}