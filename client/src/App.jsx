import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChartContainer from "./ChartContainer";
import WatchlistPanel from "./WatchlistPanel";
import StockStatsPanel from "./StockStatsPanel";
import "./App.css";
export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-content">
        <div className="chart-section">
          <ChartContainer selectedStock={selectedStock} />
        </div>
        <aside className="right-panel">
          <WatchlistPanel onSelect={setSelectedStock} selected={selectedStock} />
          <StockStatsPanel symbol={selectedStock} />
        </aside>
      </main>
    </div>
  );
}