import React, { useState } from "react";
import ChartToolbar from "./ChartToolbar";
import StockChart from "./StockChart";
import IndicatorSelector from "./IndicatorSelector";

export default function ChartContainer({ selectedStock }) {
  const [indicators, setIndicators] = useState([]);
  const [range, setRange] = useState("1D"); // default range

  return (
    <section style={{ height: "80vh", width: "100%" }}>
      <ChartToolbar onRangeChange={setRange} />
      <IndicatorSelector indicators={indicators} setIndicators={setIndicators} />
      <StockChart symbol={selectedStock} indicators={indicators} range={range} />
    </section>
  );
}
