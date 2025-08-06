export default function ChartToolbar({ onRangeChange, currentRange }) {
  const ranges = ["1D", "5D", "1M", "6M", "1Y"];
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee",
      background: "#f4f7fb"
    }}>
      {ranges.map(range => (
        <button 
          key={range} 
          onClick={() => onRangeChange(range)}
          style={{
            padding: "8px 16px",
            margin: "0 4px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: currentRange === range ? "#2563eb" : "white",
            color: currentRange === range ? "white" : "#374151",
            cursor: "pointer",
            fontWeight: currentRange === range ? "bold" : "normal"
          }}
        >
          {range}
        </button>
      ))}
      <span style={{ marginLeft: "20px" }}>
        {/* Toolbar actions, search, etc */}
      </span>
    </div>
  );
}
