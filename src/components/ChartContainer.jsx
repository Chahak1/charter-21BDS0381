import React, { useState, useEffect } from 'react';
import ChartToolbar from './ChartToolbar';
import StockChart from './StockChart';
import IndicatorSelector from './IndicatorSelector';

export default function ChartContainer({ selectedStock }) {
  const [indicators, setIndicators] = useState(['SMA']);
  const [range, setRange] = useState('1D');

  console.log('ChartContainer render:', { selectedStock, indicators, range });
  console.log('ChartContainer indicators length:', indicators.length);
  console.log('ChartContainer indicators content:', indicators);

  // Initialize indicators if they're empty
  useEffect(() => {
    if (indicators.length === 0) {
      console.log('Indicators empty, reinitializing...');
      setIndicators(['SMA']);
    }
  }, [indicators]);

  // Reset indicators when stock changes to ensure they re-render
  useEffect(() => {
    console.log('Stock changed to:', selectedStock);
  }, [selectedStock]);

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