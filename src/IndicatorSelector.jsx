import React, { useState } from "react";

const INDICATORS = [
  { key: "SMA", name: "Simple Moving Average", icon: "📈" },
  { key: "EMA", name: "Exponential Moving Average", icon: "📊" },
  { key: "RSI", name: "Relative Strength Index", icon: "⚡" },
  { key: "MACD", name: "MACD", icon: "🔀" },
  { key: "VWAP", name: "Volume Weighted Average Price", icon: "📊" },
  { key: "BOLLINGER", name: "Bollinger Bands", icon: "🎯" },
  { key: "STOCHASTIC", name: "Stochastic", icon: "🌊" }
];

export default function IndicatorSelector({ indicators, setIndicators }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggle(ind) {
    setIndicators(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  }

  return (
    <div style={{ 
      position: "relative",
      display: "inline-block"
    }}>
      {/* Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#2962ff",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "background-color 0.2s ease"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#1e53e5"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#2962ff"}
      >
        📊 Indicators ({indicators.length})
        <span style={{ 
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease"
        }}>▼</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: "0",
          backgroundColor: "white",
          border: "1px solid #e1e4e8",
          borderRadius: "6px",
          boxShadow: "0 8px 24px rgba(140, 149, 159, 0.2)",
          zIndex: 1000,
          minWidth: "280px",
          maxHeight: "400px",
          overflowY: "auto"
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e1e4e8",
            backgroundColor: "#f6f8fa",
            borderRadius: "6px 6px 0 0"
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: "14px", 
              fontWeight: "600",
              color: "#24292e"
            }}>
              Technical Indicators
            </h4>
          </div>

          {/* Indicator List */}
          <div style={{ padding: "8px 0" }}>
            {INDICATORS.map((indicator) => {
              const isActive = indicators.includes(indicator.key);
              return (
                <div
                  key={indicator.key}
                  onClick={() => toggle(indicator.key)}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: isActive ? "#f1f8ff" : "transparent",
                    borderLeft: isActive ? "3px solid #2962ff" : "3px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "#f6f8fa";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: `2px solid ${isActive ? "#2962ff" : "#d1d5da"}`,
                    borderRadius: "3px",
                    backgroundColor: isActive ? "#2962ff" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}>
                    {isActive && (
                      <span style={{ 
                        color: "white", 
                        fontSize: "10px",
                        fontWeight: "bold"
                      }}>✓</span>
                    )}
                  </div>

                  {/* Icon */}
                  <span style={{ fontSize: "16px" }}>
                    {indicator.icon}
                  </span>

                  {/* Indicator Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#24292e",
                      marginBottom: "2px"
                    }}>
                      {indicator.key}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#586069"
                    }}>
                      {indicator.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid #e1e4e8",
            backgroundColor: "#f6f8fa",
            borderRadius: "0 0 6px 6px"
          }}>
            <button
              onClick={() => setIndicators([])}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #d1d5da",
                color: "#586069",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                marginRight: "8px"
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: "#2962ff",
                border: "none",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Active Indicators Display */}
      {indicators.length > 0 && (
        <div style={{
          marginTop: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px"
        }}>
          {indicators.map((ind) => {
            const indicator = INDICATORS.find(i => i.key === ind);
            return (
              <span
                key={ind}
                style={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {indicator?.icon} {ind}
                <button
                  onClick={() => toggle(ind)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1976d2",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "0 2px",
                    marginLeft: "2px"
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}