import Chart from "chart.js/auto";
import { sma, ema, rsi } from "./indicators";

let chartInstance;

export function initChart(container, rawData, indicators = []) {
  if (chartInstance) chartInstance.destroy();

  const ctx = document.createElement("canvas");
  container.innerHTML = ""; // clear
  container.appendChild(ctx);

  const labels = rawData.map(d => d.timestamp);
  const closePrices = rawData.map(d => parseFloat(d.close));

  const datasets = [{
    label: "Price",
    data: closePrices,
    borderColor: "black",
    tension: 0.1,
  }];

  if (indicators.includes("SMA")) {
    datasets.push({
      label: "SMA (14)",
      data: sma(rawData, 14),
      borderColor: "blue",
      tension: 0.1,
    });
  }

  if (indicators.includes("EMA")) {
    datasets.push({
      label: "EMA (14)",
      data: ema(rawData, 14),
      borderColor: "red",
      tension: 0.1,
    });
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        x: { display: true, title: { display: true, text: "Time" } },
        y: { display: true, title: { display: true, text: "Price" } },
      },
    },
  });

  return () => chartInstance?.destroy();
}
