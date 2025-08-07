import React from "react";

export default function StockStatsPanel({ symbol }) {
  const stats = {
    AAPL: { price: "150.25", change: "+2.31", volume: "45.2M", marketCap: "2.45T" },
    GOOGL: { price: "2750.80", change: "-15.42", volume: "12.8M", marketCap: "1.68T" },
    MSFT: { price: "305.15", change: "+5.67", volume: "28.4M", marketCap: "2.28T" },
    TSLA: { price: "245.60", change: "+8.90", volume: "89.1M", marketCap: "780.2B" },
    AMZN: { price: "3280.45", change: "-12.35", volume: "18.6M", marketCap: "1.34T" }
  };

  const currentStats = stats[symbol] || stats.AAPL;

  return (
    <div style={{ padding: "16px" }}>
      <h3 style={{ 
        margin: "0 0 16px 0", 
        fontSize: "16px", 
        fontWeight: "600",
        color: "#24292e"
      }}>
        {symbol} Statistics
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Current Price */}
        <div style={{
          padding: "12px",
          backgroundColor: "#f6f8fa",
          borderRadius: "6px",
          border: "1px solid #e1e4e8"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#586069",
            marginBottom: "4px"
          }}>
            Current Price
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#24292e"
            }}>
              ${currentStats.price}
            </span>
            <span style={{
              fontSize: "14px",
              fontWeight: "500",
              color: currentStats.change.startsWith("+") ? "#28a745" : "#dc3545"
            }}>
              {currentStats.change}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px"
        }}>
          <div style={{
            padding: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #e1e4e8",
            borderRadius: "4px"
          }}>
            <div style={{
              fontSize: "11px",
              color: "#586069",
              marginBottom: "4px"
            }}>
              Volume
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {currentStats.volume}
            </div>
          </div>

          <div style={{
            padding: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #e1e4e8",
            borderRadius: "4px"
          }}>
            <div style={{
              fontSize: "11px",
              color: "#586069",
              marginBottom: "4px"
            }}>
              Market Cap
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {currentStats.marketCap}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          padding: "12px",
          backgroundColor: "#fff5f5",
          borderRadius: "6px",
          border: "1px solid #fed7d7"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#c53030",
            fontWeight: "500"
          }}>
            📊 Real-time data
          </div>
          <div style={{
            fontSize: "11px",
            color: "#666",
            marginTop: "4px"
          }}>
            Market data provided for demonstration
          </div>
        </div>
      </div>
    </div>
  );
}