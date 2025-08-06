import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function MultiLineChart({ data, labels, seriesNames }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (window.multiChart) window.multiChart.destroy();
    window.multiChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: seriesNames.map((name, i) => ({
          label: name, data: data[i], borderColor: ["red","blue","violet"][i], tension: 0.1
        }))
      }
    });
    return () => window.multiChart && window.multiChart.destroy();
  }, [data, labels, seriesNames]);
  return <canvas ref={canvasRef} width={270} height={110} />;
}