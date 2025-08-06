import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

// Indicator functions defined directly in the component
function sma(data, window) {
  const closes = data.map(row => parseFloat(row.close));
  return closes.map((_, idx, arr) =>
    idx < window - 1
      ? null
      : arr.slice(idx - window + 1, idx + 1).reduce((a, b) => a + b, 0) / window
  );
}

function ema(data, window) {
  const k = 2 / (window + 1);
  const closes = data.map(row => parseFloat(row.close));
  const result = [];

  closes.forEach((price, idx) => {
    if (idx === 0) {
      result.push(price);
    } else {
      const prev = result[result.length - 1];
      result.push(price * k + prev * (1 - k));
    }
  });

  return result.map((val, idx) => (idx < window - 1 ? null : val));
}

function rsi(data, period = 14) {
  const closes = data.map(row => parseFloat(row.close));
  const gains = [], losses = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      gains.push(diff);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(-diff);
    }
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rsis = [null, ...Array(period - 1).fill(null)];

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsis.push(100 - 100 / (1 + rs));
  }

  return rsis;
}

function macd(data, shortWindow = 12, longWindow = 26, signalWindow = 9) {
  const shortEMA = ema(data, shortWindow);
  const longEMA = ema(data, longWindow);
  const macdLine = shortEMA.map((val, idx) =>
    val !== null && longEMA[idx] !== null ? val - longEMA[idx] : null
  );
  const signalLine = ema(macdLine.map(v => ({ close: v ?? 0 })), signalWindow);
  const histogram = macdLine.map((val, idx) =>
    val !== null && signalLine[idx] !== null ? val - signalLine[idx] : null
  );

  return { macdLine, signalLine, histogram };
}

function vwap(data) {
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  return data.map((row, idx) => {
    const typicalPrice = (parseFloat(row.high) + parseFloat(row.low) + parseFloat(row.close)) / 3;
    const volume = parseFloat(row.volume);
    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;
    return cumulativeVolume === 0 ? null : cumulativeTPV / cumulativeVolume;
  });
}

function bollingerBands(data, period = 20, stdDev = 2) {
  const closes = data.map(row => parseFloat(row.close));
  const smaValues = sma(data, period);
  
  const upperBand = [];
  const lowerBand = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      upperBand.push(null);
      lowerBand.push(null);
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upperBand.push(mean + (stdDev * standardDeviation));
      lowerBand.push(mean - (stdDev * standardDeviation));
    }
  }
  
  return { upperBand, middleBand: smaValues, lowerBand };
}

export default function StockChart({ symbol, indicators, range, isFullScreen, onFullScreenToggle }) {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("candlestick");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);







  useEffect(() => {
    console.log("Fetching stock data for", symbol, "with range", range);

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/stocks/combined/${symbol}`);
        let data = res.data;

        console.log("Fetched data:", data);

        // Filter data based on selected range
        const now = new Date();
        let startTime;

        switch (range) {
          case "1D":
            startTime = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
            break;
          case "5D":
            startTime = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
            break;
          case "1M":
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "6M":
            startTime = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case "1Y":
            startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startTime = null;
        }

        if (startTime) {
          data = data.filter((item) => new Date(item.timestamp) >= startTime);
        }

        console.log("Filtered data:", data);
        setChartData(data);
      } catch (err) {
        console.error("Failed to load stock data:", err);
        // Create mock data for testing
        const mockData = Array.from({ length: 100 }, (_, i) => ({
          timestamp: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString(),
          open: 100 + Math.random() * 20,
          high: 105 + Math.random() * 20,
          low: 95 + Math.random() * 20,
          close: 100 + Math.random() * 20,
          volume: 1000000 + Math.random() * 500000
        }));
        setChartData(mockData);
      }
    };

    fetchData();
  }, [symbol, range]);

  useEffect(() => {
    if (!chartData.length || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const labels = chartData.map(item => new Date(item.timestamp).toLocaleDateString());
    const prices = chartData.map(item => parseFloat(item.close));

    const datasets = [];

    // Add main price data based on chart type
    if (chartType === "candlestick") {
      // For candlesticks, we'll use bars with custom colors
      const candlestickData = chartData.map(item => {
        const open = parseFloat(item.open);
        const close = parseFloat(item.close);
        return {
          x: new Date(item.timestamp).toLocaleDateString(),
          y: close,
          open: open,
          close: close,
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          color: close >= open ? "#10B981" : "#EF4444" // Green for up, red for down
        };
      });

      datasets.push({
        label: "Price",
        data: candlestickData,
        backgroundColor: candlestickData.map(d => d.color),
        borderColor: candlestickData.map(d => d.color),
        type: "bar",
        borderWidth: 1,
        borderRadius: 2
      });
    } else if (chartType === "line") {
      datasets.push({
        label: "Price",
        data: prices,
        borderColor: "#2962FF",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4
      });
    } else if (chartType === "area") {
      datasets.push({
        label: "Price",
        data: prices,
        borderColor: "#2962FF",
        backgroundColor: "rgba(41, 98, 255, 0.2)",
        tension: 0.1,
        type: "line",
        borderWidth: 2,
        fill: true
      });
    } else if (chartType === "volume") {
      const volumeData = chartData.map(item => parseFloat(item.volume));
      datasets.push({
        label: "Volume",
        data: volumeData,
        backgroundColor: "rgba(245, 158, 11, 0.6)",
        borderColor: "#F59E0B",
        type: "bar",
        borderWidth: 1,
        borderRadius: 2
      });
    }

    // Add indicators
    if (indicators.includes("SMA")) {
      const smaValues = sma(chartData, 20);
      datasets.push({
        label: "SMA (20)",
        data: smaValues,
        borderColor: "#dc2626",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line"
      });
    }

    if (indicators.includes("EMA")) {
      const emaValues = ema(chartData, 20);
      datasets.push({
        label: "EMA (20)",
        data: emaValues,
        borderColor: "#ea580c",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line"
      });
    }

    if (indicators.includes("VWAP")) {
      const vwapValues = vwap(chartData);
      datasets.push({
        label: "VWAP",
        data: vwapValues,
        borderColor: "#059669",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line"
      });
    }

    if (indicators.includes("BB")) {
      const bbValues = bollingerBands(chartData, 20, 2);
      datasets.push(
        {
          label: "BB Upper",
          data: bbValues.upperBand,
          borderColor: "#7c3aed",
          backgroundColor: "transparent",
          tension: 0.1,
          type: "line"
        },
        {
          label: "BB Middle",
          data: bbValues.middleBand,
          borderColor: "#6b7280",
          backgroundColor: "transparent",
          tension: 0.1,
          type: "line"
        },
        {
          label: "BB Lower",
          data: bbValues.lowerBand,
          borderColor: "#7c3aed",
          backgroundColor: "transparent",
          tension: 0.1,
          type: "line"
        }
      );
    }

    chartInstance.current = new Chart(ctx, {
      type: chartType === "candlestick" ? "bar" : "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#374151",
              font: {
                size: 12
              }
            }
          },
          title: {
            display: false
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#F8FAFC",
            bodyColor: "#D1D5DB",
            borderColor: "#374151",
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              color: "#E5E7EB",
              borderColor: "#E5E7EB"
            },
            ticks: {
              color: "#6B7280",
              maxRotation: 0
            }
          },
          y: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              color: "#E5E7EB",
              borderColor: "#E5E7EB"
            },
            ticks: {
              color: "#6B7280",
              callback: function(value) {
                return "$" + value.toFixed(2);
              }
            }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, indicators, chartType, symbol]);

  // Handle chart resize when full screen changes
  useEffect(() => {
    if (chartInstance.current) {
      setTimeout(() => {
        chartInstance.current.resize();
      }, 100);
    }
  }, [isFullScreen]);

  // RSI Chart
  const renderRSI = () => {
    if (!indicators.includes("RSI") || !chartData.length) return null;

    const rsiValues = rsi(chartData, 14);
    const labels = chartData.map(item => new Date(item.timestamp).toLocaleDateString());

    return (
      <div style={{ height: "150px", marginTop: "20px" }}>
        <h4>RSI (14)</h4>
        <canvas
          ref={(canvas) => {
            if (canvas) {
              const ctx = canvas.getContext("2d");
              if (window.rsiChart) window.rsiChart.destroy();
              window.rsiChart = new Chart(ctx, {
                type: "line",
                data: {
                  labels,
                  datasets: [{
                    label: "RSI",
                    data: rsiValues,
                    borderColor: "#dc2626",
                    backgroundColor: "transparent",
                    tension: 0.1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      grid: {
                        color: (context) => {
                          const value = context.tick.value;
                          return value === 30 || value === 70 ? "#ef4444" : "#e5e7eb";
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }
              });
            }
          }}
          width={400}
          height={150}
        />
      </div>
    );
  };

  // MACD Chart
  const renderMACD = () => {
    if (!indicators.includes("MACD") || !chartData.length) return null;

    const macdData = macd(chartData, 12, 26, 9);
    const labels = chartData.map(item => new Date(item.timestamp).toLocaleDateString());

    return (
      <div style={{ height: "150px", marginTop: "20px" }}>
        <h4>MACD</h4>
        <canvas
          ref={(canvas) => {
            if (canvas) {
              const ctx = canvas.getContext("2d");
              if (window.macdChart) window.macdChart.destroy();
              window.macdChart = new Chart(ctx, {
                type: "line",
                data: {
                  labels,
                  datasets: [
                    {
                      label: "MACD Line",
                      data: macdData.macdLine,
                      borderColor: "#2563eb",
                      backgroundColor: "transparent",
                      tension: 0.1
                    },
                    {
                      label: "Signal Line",
                      data: macdData.signalLine,
                      borderColor: "#dc2626",
                      backgroundColor: "transparent",
                      tension: 0.1
                    },
                    {
                      label: "Histogram",
                      data: macdData.histogram,
                      borderColor: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.3)",
                      type: "bar"
                    }
                  ]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true
                    }
                  }
                }
              });
            }
          }}
          width={400}
          height={150}
        />
      </div>
    );
  };

  return (
    <div style={{ 
      height: "100%", 
      width: "100%",
      backgroundColor: "white"
    }}>
      {/* Chart Controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #eee",
        background: "#f8fafc",
        gap: "10px"
      }}>
        <button
          onClick={() => setChartType("candlestick")}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: chartType === "candlestick" ? "#2563eb" : "white",
            color: chartType === "candlestick" ? "white" : "#374151",
            cursor: "pointer"
          }}
        >
          Candlestick
        </button>
        <button
          onClick={() => setChartType("line")}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: chartType === "line" ? "#2563eb" : "white",
            color: chartType === "line" ? "white" : "#374151",
            cursor: "pointer"
          }}
        >
          Line
        </button>
        <button
          onClick={() => setChartType("area")}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: chartType === "area" ? "#2563eb" : "white",
            color: chartType === "area" ? "white" : "#374151",
            cursor: "pointer"
          }}
        >
          Area
        </button>
        <button
          onClick={() => setChartType("volume")}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: chartType === "volume" ? "#2563eb" : "white",
            color: chartType === "volume" ? "white" : "#374151",
            cursor: "pointer"
          }}
        >
          Volume
        </button>

      </div>

      {/* Main Chart */}
      <div style={{ height: isFullScreen ? "calc(100vh - 200px)" : "400px", padding: "20px", flex: 1 }}>
        <canvas ref={chartRef} />
      </div>

      {/* Indicator Charts */}
      <div style={{ padding: "0 20px 20px" }}>
        {renderRSI()}
        {renderMACD()}
      </div>
    </div>
  );
}
