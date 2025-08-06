import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WatchlistPanel({ onSelect, selected }) {
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stocks/symbols');
        setAvailableSymbols(response.data.all || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch symbols:', error);
        // Fallback to default symbols if API fails
        setAvailableSymbols(["AAPL", "MSFT", "GOOG", "IBM", "TSLA", "UL", "WMT"]);
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  if (loading) {
    return (
      <div style={{padding: "10px 5px", borderBottom:"1px solid #eee"}}>
        <b>Watchlist</b>
        <div>Loading symbols...</div>
      </div>
    );
  }

  return (
    <div style={{padding: "10px 5px", borderBottom:"1px solid #eee"}}>
      <b>Watchlist</b>
      <ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
        {availableSymbols.map(sym => (
          <li key={sym}
            onClick={() => onSelect(sym)}
            style={{
              cursor: "pointer",
              color: sym === selected ? "#2563eb" : "#374151",
              fontWeight: sym === selected ? "bold" : "normal",
              padding: "8px 12px",
              margin: "2px 0",
              borderRadius: "4px",
              backgroundColor: sym === selected ? "#eff6ff" : "transparent",
              transition: "all 0.2s ease"
            }}>
            {sym}
          </li>
        ))}
      </ul>
    </div>
  );
}