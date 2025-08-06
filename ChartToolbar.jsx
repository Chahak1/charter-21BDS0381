export default function ChartToolbar({ onRangeChange }) {
  const ranges = ["1D", "5D", "1M", "6M", "1Y"];
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee",
      background: "#f4f7fb"
    }}>
      {ranges.map(range => (
        <button key={range} onClick={() => onRangeChange(range)}>{range}</button>
      ))}
      <span style={{ marginLeft: "20px" }}>
        {/* Toolbar actions, search, etc */}
      </span>
    </div>
  );
}
