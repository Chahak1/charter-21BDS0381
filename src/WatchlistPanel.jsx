import React, { useState, useEffect } from "react";
import { StockDataService } from "./stockDataService";

export default function WatchlistPanel({ onSelect, selected }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available symbols (you can modify this list based on your CSV files)
  const availableSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

  useEffect(() => {
    const loadStockData = async () => {
      setLoading(true);
      const stockData = [];

      for (const symbol of availableSymbols) {
        try {
          const priceData = await StockDataService.fetchRealTimePrice(symbol);
          stockData.push({
            symbol: symbol,
            name: `${symbol} Corporation`,
            price: priceData.price,
            change: priceData.change,
            changePercent: priceData.changePercent
          });
        } catch (error) {
          console.warn(`Failed to load data for ${symbol}:`, error.message);
          // Add symbol with error state
          stockData.push({
            symbol: symbol,
            name: `${symbol} Corporation`,
            price: "N/A",
            change: "N/A",
            changePercent: "N/A",
            error: true
          });
        }
      }

      setStocks(stockData);
      setLoading(false);
    };

    loadStockData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "16px" }}>
        <h3 style={{ 
          margin: "0 0 16px 0", 
          fontSize: "16px", 
          fontWeight: "600",
          color: "#24292e"
        }}>
          Watchlist
        </h3>
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          color: "#586069",
          fontSize: "14px"
        }}>
          Loading stock data...
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
        Watchlist
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => !stock.error && onSelect(stock.symbol)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: selected === stock.symbol ? "#f1f8ff" : "transparent",
              border: selected === stock.symbol ? "1px solid #2962ff" : "1px solid transparent",
              cursor: stock.error ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: stock.error ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (selected !== stock.symbol && !stock.error) {
                e.target.style.backgroundColor = "#f6f8fa";
              }
            }}
            onMouseOut={(e) => {
              if (selected !== stock.symbol && !stock.error) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4px"
            }}>
              <span style={{
                fontWeight: "600",
                fontSize: "14px",
                color: "#24292e"
              }}>
                {stock.symbol}
              </span>
              <span style={{
                fontSize: "14px",
                fontWeight: "500",
                color: stock.error ? "#586069" : 
                      stock.change === "N/A" ? "#586069" :
                      stock.change.startsWith("+") ? "#28a745" : "#dc3545"
              }}>
                {stock.change}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{
                fontSize: "12px",
                color: "#586069"
              }}>
                {stock.error ? "CSV file not found" : stock.name}
              </span>
              <span style={{
                fontSize: "12px",
                color: "#24292e",
                fontWeight: "500"
              }}>
                {stock.price === "N/A" ? "N/A" : `$${stock.price}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info about CSV files */}
      <div style={{
        marginTop: "16px",
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
          📁 CSV Data Required
        </div>
        <div style={{
          fontSize: "11px",
          color: "#666"
        }}>
          Place CSV files in the /public/data/ folder (e.g., AAPL.csv, GOOGL.csv)
        </div>
      </div>
    </div>
  );
}