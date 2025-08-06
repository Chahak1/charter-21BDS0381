import React, { useState, useEffect } from "react";
import ChartContainer from "./ChartContainer";
import WatchlistPanel from "./WatchlistPanel";
import StockStatsPanel from "./StockStatsPanel";
import IndicatorSelector from "./IndicatorSelector";
import axios from "axios";
import "./App.css";

export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [indicators, setIndicators] = useState(["SMA", "EMA", "RSI", "MACD", "BB"]);
  const [range, setRange] = useState("1D");
  const [dataType, setDataType] = useState("historical"); // NEW: Track data type
  const [availableSymbols, setAvailableSymbols] = useState([]);

  useEffect(() => {
    // Fetch available symbols and set default stock
    const fetchSymbols = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stocks/symbols');
        const symbols = response.data.all || [];
        setAvailableSymbols(symbols);
        
        // Set the first available symbol as default
        if (symbols.length > 0 && !symbols.includes(selectedStock)) {
          setSelectedStock(symbols[0]);
        }
      } catch (error) {
        console.error('Failed to fetch symbols:', error);
      }
    };

    fetchSymbols();
  }, []);

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
            {availableSymbols.length > 0 && (
              <span style={{ color: "#10B981", fontSize: "14px" }}>+2.45%</span>
            )}
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
              dataType={dataType}
              setDataType={setDataType}
            />
          </div>
          {!isFullScreen && (
            <aside 
              style={{ flex: 1, minWidth: "340px", borderLeft: "1px solid #eee" }}
            >
              <WatchlistPanel onSelect={setSelectedStock} selected={selectedStock} />
              <StockStatsPanel symbol={selectedStock} dataType={dataType} />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}