import React, { useState } from "react";
import TradingViewStyle from "./TradingViewStyle";
import "./App.css";

export default function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [indicators, setIndicators] = useState(["SMA", "EMA", "RSI", "MACD", "BB"]);
  const [range, setRange] = useState("1D");

  return (
    <div className="app-root" style={{height:"100vh"}}>
      <TradingViewStyle 
        symbol={selectedStock} 
        indicators={indicators}
        range={range}
      />
    </div>
  );
}