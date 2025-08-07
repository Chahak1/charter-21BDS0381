import React, { useState, useEffect } from "react";
import { StockDataService } from "./stockDataService";

export default function StockStatsPanel({ symbol }) {
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStockInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const info = await StockDataService.fetchStockInfo(symbol);
        setStockInfo(info);
      } catch (err) {
        setError(err.message);
        setStockInfo(null);
      } finally {
        setLoading(false);
      }
    };

    loadStockInfo();
  }, [symbol]);

  if (loading) {
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
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          color: "#586069",
          fontSize: "14px"
        }}>
          Loading statistics...
        </div>
      </div>
    );
  }

  if (error) {
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
        
        <div style={{
          padding: "12px",
          backgroundColor: "#fff5f5",
          borderRadius: "6px",
          border: "1px solid #fed7d7"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#c53030",
            fontWeight: "500",
            marginBottom: "4px"
          }}>
            ⚠️ Data Unavailable
          </div>
          <div style={{
            fontSize: "11px",
            color: "#666"
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

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
              ${stockInfo.currentPrice}
            </span>
            <span style={{
              fontSize: "14px",
              fontWeight: "500",
              color: stockInfo.change.startsWith("+") ? "#28a745" : "#dc3545"
            }}>
              {stockInfo.change} ({stockInfo.changePercent})
            </span>
          </div>
        </div>

        {/* Company Info */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
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
              Company
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {stockInfo.name}
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
              Sector
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {stockInfo.sector}
            </div>
          </div>
        </div>

        {/* Market Metrics */}
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
              Market Cap
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {stockInfo.marketCap}
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
              P/E Ratio
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292e"
            }}>
              {stockInfo.peRatio}
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div style={{
          padding: "12px",
          backgroundColor: "#f1f8ff",
          borderRadius: "6px",
          border: "1px solid #2962ff"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#2962ff",
            fontWeight: "500",
            marginBottom: "4px"
          }}>
            📊 CSV Data Source
          </div>
          <div style={{
            fontSize: "11px",
            color: "#666"
          }}>
            {stockInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
}