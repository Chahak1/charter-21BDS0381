import React from "react";

export default function WatchlistPanel({ onSelect, selected }) {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: "150.25", change: "+2.31" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "2750.80", change: "-15.42" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "305.15", change: "+5.67" },
    { symbol: "TSLA", name: "Tesla Inc.", price: "245.60", change: "+8.90" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "3280.45", change: "-12.35" }
  ];

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
            onClick={() => onSelect(stock.symbol)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: selected === stock.symbol ? "#f1f8ff" : "transparent",
              border: selected === stock.symbol ? "1px solid #2962ff" : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              if (selected !== stock.symbol) {
                e.target.style.backgroundColor = "#f6f8fa";
              }
            }}
            onMouseOut={(e) => {
              if (selected !== stock.symbol) {
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
                color: stock.change.startsWith("+") ? "#28a745" : "#dc3545"
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
                {stock.name}
              </span>
              <span style={{
                fontSize: "12px",
                color: "#24292e",
                fontWeight: "500"
              }}>
                ${stock.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}