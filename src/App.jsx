import React, { useState } from "react";
import ChartContainer from "./ChartContainer";
import WatchlistPanel from "./WatchlistPanel";
import StockStatsPanel from "./StockStatsPanel";
import "./App.css";

export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  return (
    <div className="app-root" style={{display:"flex",height:"100vh"}}>
      <main style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 3, flexDirection: "column" }}>
          <ChartContainer selectedStock={selectedStock} />
        </div>
        <aside style={{ flex: 1, minWidth: "340px", borderLeft: "1px solid #eee" }}>
          <WatchlistPanel onSelect={setSelectedStock} selected={selectedStock} />
          <StockStatsPanel symbol={selectedStock} />
        </aside>
      </main>
    </div>
  );
}