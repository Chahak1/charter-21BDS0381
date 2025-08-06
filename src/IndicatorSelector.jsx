import React from "react";
const INDICATORS = ["SMA", "EMA", "RSI", "MACD", "VWAP", "BB"];
export default function IndicatorSelector({ indicators, setIndicators }) {
  function toggle(ind) {
    setIndicators(prev =>
      prev.includes(ind) ? prev.filter(i=>i!==ind) : [...prev, ind]
    );
  }
  return (
    <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
      {INDICATORS.map((ind) =>
        <label key={ind} style={{display:"flex", alignItems:"center", gap:"4px", fontSize:"12px"}}>
          <input
            type="checkbox"
            checked={indicators.includes(ind)}
            onChange={()=>toggle(ind)}
            style={{margin:0}}
          />
          {ind}
        </label>
      )}
    </div>
  );
}