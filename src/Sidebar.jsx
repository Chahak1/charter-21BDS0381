import React, { useState } from "react";

export default function Sidebar() {
    const [active, setActive] = useState(null);


  return (
    
    <nav style={{width: "50px", background: "#f7f8fa", borderRight:"1px solid #eee"}}>
      <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", alignItems:"center"}}>
        <li><button title="Draw"><span>🖊️</span></button></li>
        <li><button title="Indicators"><span>🔍</span></button></li>
        <li><button title="Alert"><span>🔔</span></button></li>
        <li><button title="Replay"><span>⏯️</span></button></li>
        <li><button onClick={() => setActive("draw")} className={active === "draw" ? "active" : ""}>🖊️</button></li>
        {/* add more icons as needed */}
      </ul>
    </nav>
  );
}