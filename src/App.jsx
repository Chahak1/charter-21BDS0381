import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChartContainer from "./ChartContainer";
import WatchlistPanel from "./WatchlistPanel";
import StockStatsPanel from "./StockStatsPanel";

export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");

  return (
    <div className="app-root" style={{
      display: "flex",
      height: "100vh",
      backgroundColor: "#f6f8fa",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
    }}>
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        display: "flex",
        gap: "12px",
        padding: "12px",
        overflow: "hidden"
      }}>
        {/* Chart Area - Takes up most space */}
        <div style={{ 
          flex: 3, 
          display: "flex", 
          flexDirection: "column",
          minWidth: "600px"
        }}>
          <ChartContainer selectedStock={selectedStock} />
        </div>

        {/* Right Panel - Watchlist and Stats */}
        <aside style={{ 
          flex: 1, 
          minWidth: "320px",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{
            backgroundColor: "white",
            border: "1px solid #e1e4e8",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <WatchlistPanel 
              onSelect={setSelectedStock} 
              selected={selectedStock} 
            />
          </div>
          
          <div style={{
            backgroundColor: "white",
            border: "1px solid #e1e4e8",
            borderRadius: "8px",
            overflow: "hidden",
            flex: 1
          }}>
            <StockStatsPanel symbol={selectedStock} />
          </div>
        </aside>
      </main>
    </div>
  );
}