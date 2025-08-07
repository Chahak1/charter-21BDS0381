import React, { useState } from "react";
import ChartToolbar from "./ChartToolbar";
import StockChart from "./StockChart";
import IndicatorSelector from "./IndicatorSelector";

export default function ChartContainer({ selectedStock }) {
  const [indicators, setIndicators] = useState([]);
  const [range, setRange] = useState("1D");

  return (
    <div style={{ 
      height: "100%", 
      width: "100%", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#ffffff",
      border: "1px solid #e1e4e8",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      {/* Main Toolbar */}
      <ChartToolbar onRangeChange={setRange} />
      
      {/* Secondary Toolbar with Indicators */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #e1e4e8",
        backgroundColor: "#f6f8fa",
        minHeight: "60px"
      }}>
        {/* Left side - Stock Symbol and Price Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#24292e"
          }}>
            {selectedStock}
          </div>
          <div style={{
            fontSize: "14px",
            color: "#586069"
          }}>
            Real-time data
          </div>
        </div>

        {/* Right side - Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IndicatorSelector 
            indicators={indicators} 
            setIndicators={setIndicators} 
          />
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ 
        flex: 1, 
        padding: "0",
        backgroundColor: "#ffffff",
        position: "relative"
      }}>
        <StockChart 
          symbol={selectedStock} 
          indicators={indicators} 
          range={range} 
        />
      </div>

      {/* Bottom Info Bar */}
      <div style={{
        padding: "8px 16px",
        borderTop: "1px solid #e1e4e8",
        backgroundColor: "#f6f8fa",
        fontSize: "12px",
        color: "#586069",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>Chart powered by Chart.js</span>
        <span>Data: Real-time market data</span>
      </div>
    </div>
  );
}
