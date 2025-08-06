const STOCKS = ["AAPL", "GOOG", "UL", "TSLA", "MSFT", "WMT", "IBM"];
export default function WatchlistPanel({ onSelect, selected }) {
  return (
    <div style={{padding: "10px 5px", borderBottom:"1px solid #eee"}}>
      <b>Watchlist</b>
      <ul>
        {STOCKS.map(sym=>(
          <li key={sym}
            onClick={()=>onSelect(sym)}
            style={{
              cursor: "pointer",
              color: sym===selected ? "blue" : "#222",
              fontWeight: sym===selected ? "bold" : "normal"
            }}>
            {sym}
          </li>
        ))}
      </ul>
    </div>
  );
}