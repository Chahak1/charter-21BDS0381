import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StockStatsPanel({ symbol }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockStats = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        // Fetch historical data to calculate stats
        const response = await axios.get(`http://localhost:3001/api/stocks/historical/${symbol}`);
        const data = response.data;
        
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          const previous = data[data.length - 2] || latest;
          
          const currentPrice = parseFloat(latest.close);
          const previousPrice = parseFloat(previous.close);
          const change = currentPrice - previousPrice;
          const changePercent = ((change / previousPrice) * 100);
          
          setStats({
            price: currentPrice.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            volume: latest.volume?.toLocaleString() || "N/A",
            high: parseFloat(latest.high).toFixed(2),
            low: parseFloat(latest.low).toFixed(2),
            open: parseFloat(latest.open).toFixed(2),
            close: parseFloat(latest.close).toFixed(2)
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stock stats:', error);
        setStats({
          price: "N/A",
          change: "N/A",
          changePercent: "N/A",
          volume: "N/A",
          high: "N/A",
          low: "N/A",
          open: "N/A",
          close: "N/A"
        });
        setLoading(false);
      }
    };

    fetchStockStats();
  }, [symbol]);

  if (loading) {
    return (
      <div style={{padding: "12px"}}>
        <h3>{symbol}</h3>
        <div>Loading stats...</div>
      </div>
    );
  }

  return (
    <div style={{padding: "12px"}}>
      <h3 style={{ margin: "0 0 12px 0", color: "#1f2937" }}>{symbol}</h3>
      <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Price:</span>
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>${stats.price}</span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Change:</span>
          <span style={{ 
            color: parseFloat(stats.change) >= 0 ? "#10b981" : "#ef4444",
            fontWeight: "bold"
          }}>
            {parseFloat(stats.change) >= 0 ? "+" : ""}{stats.change} ({stats.changePercent}%)
          </span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Volume:</span>
          <span>{stats.volume}</span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>High:</span>
          <span style={{ color: "#10b981" }}>${stats.high}</span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Low:</span>
          <span style={{ color: "#ef4444" }}>${stats.low}</span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Open:</span>
          <span>${stats.open}</span>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px" 
        }}>
          <span style={{ fontWeight: "500" }}>Close:</span>
          <span>${stats.close}</span>
        </div>
      </div>
    </div>
  );
}