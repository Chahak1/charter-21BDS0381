import React, { useEffect, useState } from "react";
export default function StockStatsPanel({ symbol }) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    fetch(`/api/stocks/${symbol}/summary`).then(r=>r.json()).then(setStats);
  }, [symbol]);
  return (
    <div style={{padding: "12px"}}>
      <h3>{symbol}</h3>
      {stats ? (
        <>
          <div>Price: {stats.price}</div>
          <div>Change: {stats.change} ({stats.pct}%)</div>
          {/* Expand with further performance/seasonal as needed */}
        </>
      ) : <>Loading...</>}
    </div>
  );
}