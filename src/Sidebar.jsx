import React from "react";

export default function Sidebar() {
  return (
    <div style={{
      width: "60px",
      backgroundColor: "#24292e",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 0"
    }}>
      <div style={{
        fontSize: "20px",
        marginBottom: "24px",
        cursor: "pointer"
      }}>
        📈
      </div>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          backgroundColor: "#2962ff",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "16px"
        }}>
          📊
        </div>
        
        <div style={{
          width: "36px",
          height: "36px",
          backgroundColor: "transparent",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "16px",
          opacity: 0.6
        }}>
          📋
        </div>
        
        <div style={{
          width: "36px",
          height: "36px",
          backgroundColor: "transparent",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "16px",
          opacity: 0.6
        }}>
          ⚙️
        </div>
      </div>
    </div>
  );
}