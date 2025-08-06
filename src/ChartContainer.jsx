import React, { useState } from "react";
import ChartToolbar from "./ChartToolbar";
import StockChart from "./StockChart";
import IndicatorSelector from "./IndicatorSelector";

export default function ChartContainer({ selectedStock, isFullScreen, setIsFullScreen }) {
  const [indicators, setIndicators] = useState([]);
  const [range, setRange] = useState("1D"); // default range

  return (
    <section style={{ height: "100vh", width: "100%" }}>
      <ChartToolbar onRangeChange={setRange} currentRange={range} />
      <IndicatorSelector indicators={indicators} setIndicators={setIndicators} />
      <StockChart 
        symbol={selectedStock} 
        indicators={indicators} 
        range={range}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
      />
    </section>
  );
}
