import React, { useState } from "react";

export default function ChartToolbar({ onRangeChange }) {
  const [activeRange, setActiveRange] = useState("1D");
  const ranges = [
    { key: "1D", label: "1D" },
    { key: "5D", label: "5D" },
    { key: "1M", label: "1M" },
    { key: "6M", label: "6M" },
    { key: "1Y", label: "1Y" },
    { key: "ALL", label: "ALL" }
  ];

  const handleRangeChange = (range) => {
    setActiveRange(range);
    onRangeChange(range);
  };

  return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: "12px 16px", 
      borderBottom: "1px solid #e1e4e8",
      backgroundColor: "#ffffff",
      borderRadius: "8px 8px 0 0"
    }}>
      {/* Left Side - Chart Type & Symbol */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ 
          fontSize: "16px", 
          fontWeight: "600", 
          color: "#24292e" 
        }}>
          📈 Trading Chart
        </div>
        
        {/* Chart Type Selector */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button style={{
            padding: "6px 12px",
            border: "1px solid #d1d5da",
            borderRadius: "4px",
            backgroundColor: "#f6f8fa",
            fontSize: "12px",
            cursor: "pointer",
            color: "#24292e"
          }}>
            📊 Candlestick
          </button>
        </div>
      </div>

      {/* Center - Time Range Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#f6f8fa",
        padding: "4px",
        borderRadius: "6px",
        border: "1px solid #e1e4e8"
      }}>
        {ranges.map(range => (
          <button 
            key={range.key} 
            onClick={() => handleRangeChange(range.key)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeRange === range.key ? "#2962ff" : "transparent",
              color: activeRange === range.key ? "white" : "#586069",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "40px"
            }}
            onMouseOver={(e) => {
              if (activeRange !== range.key) {
                e.target.style.backgroundColor = "#e1e4e8";
                e.target.style.color = "#24292e";
              }
            }}
            onMouseOut={(e) => {
              if (activeRange !== range.key) {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#586069";
              }
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Right Side - Additional Tools */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Drawing Tools */}
        <button style={{
          padding: "8px 12px",
          border: "1px solid #d1d5da",
          borderRadius: "4px",
          backgroundColor: "white",
          fontSize: "12px",
          cursor: "pointer",
          color: "#586069",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          ✏️ Draw
        </button>

        {/* Settings */}
        <button style={{
          padding: "8px 12px",
          border: "1px solid #d1d5da",
          borderRadius: "4px",
          backgroundColor: "white",
          fontSize: "12px",
          cursor: "pointer",
          color: "#586069",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          ⚙️ Settings
        </button>

        {/* Fullscreen */}
        <button style={{
          padding: "8px 12px",
          border: "1px solid #d1d5da",
          borderRadius: "4px",
          backgroundColor: "white",
          fontSize: "12px",
          cursor: "pointer",
          color: "#586069",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          ⛶ Fullscreen
        </button>
      </div>
    </div>
  );
}
