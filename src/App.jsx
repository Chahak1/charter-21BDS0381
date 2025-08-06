import React, { useState } from "react";
import ChartContainer from "./ChartContainer";
import WatchlistPanel from "./WatchlistPanel";
import StockStatsPanel from "./StockStatsPanel";
import IndicatorSelector from "./IndicatorSelector";
import "./App.css";

export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [indicators, setIndicators] = useState(["SMA", "EMA", "RSI", "MACD", "BB"]);
  const [range, setRange] = useState("1D");

  const handleFullScreenToggle = () => {
    console.log("App: handleFullScreenToggle called, current isFullScreen:", isFullScreen);
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="app-root" style={{display:"flex",height:"100vh"}}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Controls Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
          gap: "20px"
        }}>
          {/* Time Interval Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: "500", color: "#374151" }}>Time:</span>
            <div style={{ display: "flex", background: "white", borderRadius: "6px", border: "1px solid #d1d5db" }}>
              {["1D", "5D", "1M", "6M", "1Y"].map((timeRange) => (
                <button
                  key={timeRange}
                  onClick={() => setRange(timeRange)}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    background: range === timeRange ? "#2563eb" : "transparent",
                    color: range === timeRange ? "white" : "#374151",
                    cursor: "pointer",
                    fontSize: "12px",
                    borderRadius: range === timeRange ? "6px" : "0"
                  }}
                >
                  {timeRange}
                </button>
              ))}
            </div>
          </div>

          {/* Indicator Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: "500", color: "#374151" }}>Indicators:</span>
            <IndicatorSelector indicators={indicators} setIndicators={setIndicators} />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Stock Symbol Display */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            background: "white",
            borderRadius: "6px",
            border: "1px solid #d1d5db"
          }}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedStock}</span>
            <span style={{ color: "#10B981", fontSize: "14px" }}>+2.45%</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ 
            flex: isFullScreen ? 1 : 3, 
            flexDirection: "column",
            width: isFullScreen ? "100%" : "auto"
          }}>
            <ChartContainer 
              selectedStock={selectedStock} 
              isFullScreen={isFullScreen}
              onFullScreenToggle={handleFullScreenToggle}
              indicators={indicators}
              range={range}
            />
          </div>
          {!isFullScreen && (
            <aside 
              style={{ flex: 1, minWidth: "340px", borderLeft: "1px solid #eee" }}
            >
              <WatchlistPanel onSelect={setSelectedStock} selected={selectedStock} />
              <StockStatsPanel symbol={selectedStock} />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}