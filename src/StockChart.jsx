import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { sma, ema, rsi, macd, vwap, bollingerBands } from "./indicators";

export default function StockChart({ symbol, indicators, range, isFullScreen, setIsFullScreen }) {
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

    const datasets = [
      {
        label: "Price",
        data: prices,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.1,
        type: chartType === "candlestick" ? "bar" : "line"
      }
    ];

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
          },
          title: {
            display: true,
            text: `${symbol} Stock Chart`,
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
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
      height: isFullScreen ? "100vh" : "100%", 
      width: isFullScreen ? "100vw" : "100%",
      position: isFullScreen ? "fixed" : "relative",
      top: isFullScreen ? 0 : "auto",
      left: isFullScreen ? 0 : "auto",
      zIndex: isFullScreen ? 9999 : "auto",
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
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: isFullScreen ? "#dc2626" : "white",
            color: isFullScreen ? "white" : "#374151",
            cursor: "pointer",
            marginLeft: "auto"
          }}
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </div>

      {/* Main Chart */}
      <div style={{ height: isFullScreen ? "calc(100vh - 200px)" : "400px", padding: "20px" }}>
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
