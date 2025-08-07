import Chart from "chart.js/auto";
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import { sma, ema, rsi, macd, vwap } from "./indicators";

// Register financial chart elements
Chart.register(CandlestickController, CandlestickElement, OhlcController, OhlcElement);

let chartInstance;

export function initChart(container, rawData, indicators = []) {
  if (chartInstance) chartInstance.destroy();

  const ctx = document.createElement("canvas");
  container.innerHTML = "";
  container.appendChild(ctx);

  // Prepare data for candlestick chart
  const candlestickData = rawData.map(d => ({
    x: new Date(d.timestamp),
    o: parseFloat(d.open || d.close),
    h: parseFloat(d.high || d.close),
    l: parseFloat(d.low || d.close),
    c: parseFloat(d.close)
  }));

  const datasets = [];

  // Main candlestick dataset
  datasets.push({
    label: 'Price',
    type: 'candlestick',
    data: candlestickData,
    borderColor: {
      up: '#26a69a',     // Green for bullish candles
      down: '#ef5350',   // Red for bearish candles
      unchanged: '#999'
    },
    backgroundColor: {
      up: 'rgba(38, 166, 154, 0.8)',
      down: 'rgba(239, 83, 80, 0.8)',
      unchanged: 'rgba(153, 153, 153, 0.8)'
    },
    borderWidth: 1,
    barThickness: 'flex',
    maxBarThickness: 8
  });

  // Add indicators
  if (indicators.includes("SMA")) {
    const smaData = sma(rawData, 14);
    datasets.push({
      label: "SMA (14)",
      type: "line",
      data: smaData.map((val, idx) => ({
        x: new Date(rawData[idx].timestamp),
        y: val
      })).filter(point => point.y !== null),
      borderColor: "#2196F3",
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      yAxisID: 'y'
    });
  }

  if (indicators.includes("EMA")) {
    const emaData = ema(rawData, 14);
    datasets.push({
      label: "EMA (14)",
      type: "line",
      data: emaData.map((val, idx) => ({
        x: new Date(rawData[idx].timestamp),
        y: val
      })).filter(point => point.y !== null),
      borderColor: "#FF9800",
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      yAxisID: 'y'
    });
  }

  if (indicators.includes("VWAP")) {
    const vwapData = vwap(rawData);
    datasets.push({
      label: "VWAP",
      type: "line", 
      data: vwapData.map((val, idx) => ({
        x: new Date(rawData[idx].timestamp),
        y: val
      })).filter(point => point.y !== null),
      borderColor: "#9C27B0",
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      yAxisID: 'y'
    });
  }

  // RSI requires separate scale (0-100)
  if (indicators.includes("RSI")) {
    const rsiData = rsi(rawData, 14);
    datasets.push({
      label: "RSI (14)",
      type: "line",
      data: rsiData.map((val, idx) => ({
        x: new Date(rawData[idx].timestamp),
        y: val
      })).filter(point => point.y !== null),
      borderColor: "#FF5722",
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      yAxisID: 'y1'
    });
  }

  const scales = {
    x: {
      type: 'time',
      time: {
        unit: 'minute',
        displayFormats: {
          minute: 'HH:mm',
          hour: 'MMM dd HH:mm',
          day: 'MMM dd',
          week: 'MMM dd',
          month: 'MMM yyyy'
        }
      },
      grid: {
        color: '#f0f0f0',
        borderColor: '#e0e0e0'
      },
      ticks: {
        color: '#666',
        maxTicksLimit: 8
      }
    },
    y: {
      type: 'linear',
      position: 'right',
      grid: {
        color: '#f0f0f0',
        borderColor: '#e0e0e0'
      },
      ticks: {
        color: '#666',
        callback: function(value) {
          return '$' + value.toFixed(2);
        }
      }
    }
  };

  // Add RSI scale if RSI indicator is active
  if (indicators.includes("RSI")) {
    scales.y1 = {
      type: 'linear',
      position: 'left',
      min: 0,
      max: 100,
      grid: {
        display: false
      },
      ticks: {
        color: '#FF5722',
        callback: function(value) {
          return value.toFixed(0);
        }
      }
    };
  }

  chartInstance = new Chart(ctx, {
    type: 'candlestick',
    data: {
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          position: "top",
          align: 'start',
          labels: {
            color: '#333',
            usePointStyle: true,
            pointStyle: 'line',
            font: {
              size: 12,
              weight: '500'
            },
            generateLabels: function(chart) {
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return labels.map(label => {
                if (label.text === 'Price') {
                  label.pointStyle = 'rect';
                }
                return label;
              });
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#333',
          borderWidth: 1,
          cornerRadius: 6,
          callbacks: {
            title: function(context) {
              return new Date(context[0].parsed.x).toLocaleString();
            },
            label: function(context) {
              const dataset = context.dataset;
              if (dataset.type === 'candlestick') {
                const data = context.parsed;
                return [
                  `Open: $${data.o?.toFixed(2)}`,
                  `High: $${data.h?.toFixed(2)}`,
                  `Low: $${data.l?.toFixed(2)}`,
                  `Close: $${data.c?.toFixed(2)}`
                ];
              } else {
                return `${dataset.label}: ${context.parsed.y?.toFixed(2)}`;
              }
            }
          }
        }
      },
      scales: scales,
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      }
    }
  });

  return () => chartInstance?.destroy();
}
