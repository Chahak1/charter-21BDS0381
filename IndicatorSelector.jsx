import React from "react";
const INDICATORS = ["SMA", "EMA", "RSI", "MACD", "VWAP"];
export default function IndicatorSelector({ indicators, setIndicators }) {
  function toggle(ind) {
    setIndicators(prev =>
      prev.includes(ind) ? prev.filter(i=>i!==ind) : [...prev, ind]
    );
  }
  return (
    <div style={{margin:"10px 0"}}>
      <b>Indicators:</b>
      {INDICATORS.map((ind) =>
        <label key={ind} style={{marginLeft:10}}>
          <input
            type="checkbox"
            checked={indicators.includes(ind)}
            onChange={()=>toggle(ind)}
          />
          {ind}
        </label>
      )}
    </div>
  );
}