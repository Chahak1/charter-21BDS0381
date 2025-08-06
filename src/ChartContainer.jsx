import React from "react";
import StockChart from "./StockChart";

export default function ChartContainer({ selectedStock, isFullScreen, onFullScreenToggle, indicators, range, dataType, setDataType }) {
  return (
    <section style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <StockChart
          symbol={selectedStock}
          indicators={indicators}
          range={range}
          dataType={dataType}
          setDataType={setDataType}
          isFullScreen={isFullScreen}
          onFullScreenToggle={onFullScreenToggle}
        />
      </div>
    </section>
  );
}
