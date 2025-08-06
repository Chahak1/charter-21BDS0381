import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

// Import indicators with explicit path
const indicatorsModule = require('./indicators.js');
const { sma, ema, rsi, macd, vwap, bollingerBands } = indicatorsModule;

export default function TradingViewStyle({ symbol, indicators, range }) {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("candlestick");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W", "1M"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/stocks/combined/${symbol}`);
        let data = res.data;

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
        borderColor: "#2962FF",
        backgroundColor: "rgba(41, 98, 255, 0.1)",
        tension: 0.1,
        type: chartType === "candlestick" ? "bar" : "line",
        borderWidth: 2
      }
    ];

    // Add indicators
    if (indicators.includes("SMA")) {
      const smaValues = sma(chartData, 20);
      datasets.push({
        label: "SMA (20)",
        data: smaValues,
        borderColor: "#FF6B6B",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line",
        borderWidth: 1
      });
    }

    if (indicators.includes("EMA")) {
      const emaValues = ema(chartData, 20);
      datasets.push({
        label: "EMA (20)",
        data: emaValues,
        borderColor: "#4ECDC4",
        backgroundColor: "transparent",
        tension: 0.1,
        type: "line",
        borderWidth: 1
      });
    }

    if (indicators.includes("BB")) {
      const bbValues = bollingerBands(chartData, 20, 2);
      datasets.push(
        {
          label: "BB Upper",
          data: bbValues.upperBand,
          borderColor: "#9C27B0",
          backgroundColor: "rgba(156, 39, 176, 0.1)",
          tension: 0.1,
          type: "line",
          borderWidth: 1
        },
        {
          label: "BB Middle",
          data: bbValues.middleBand,
          borderColor: "#607D8B",
          backgroundColor: "transparent",
          tension: 0.1,
          type: "line",
          borderWidth: 1
        },
        {
          label: "BB Lower",
          data: bbValues.lowerBand,
          borderColor: "#9C27B0",
          backgroundColor: "rgba(156, 39, 176, 0.1)",
          tension: 0.1,
          type: "line",
          borderWidth: 1
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
              color: "#D1D5DB",
              font: {
                size: 12
              }
            }
          },
          title: {
            display: false
          },
        },
        scales: {
          x: {
            grid: {
              color: "#374151",
              borderColor: "#374151"
            },
            ticks: {
              color: "#D1D5DB"
            }
          },
          y: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              color: "#374151",
              borderColor: "#374151"
            },
            ticks: {
              color: "#D1D5DB"
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

  return (
    <div style={{ 
      height: "100vh", 
      width: "100%",
      backgroundColor: "#1E293B",
      color: "#F8FAFC",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Toolbar - TradingView Style */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderBottom: "1px solid #374151",
        background: "#0F172A",
        gap: "8px"
      }}>
        {/* Symbol Display */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 12px",
          background: "#1E293B",
          borderRadius: "4px",
          border: "1px solid #374151"
        }}>
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>{symbol}</span>
          <span style={{ color: "#10B981", fontSize: "14px" }}>+2.45%</span>
        </div>

        {/* Timeframe Selector */}
        <div style={{
          display: "flex",
          background: "#1E293B",
          borderRadius: "4px",
          border: "1px solid #374151"
        }}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              style={{
                padding: "6px 12px",
                border: "none",
                background: selectedTimeframe === tf ? "#2962FF" : "transparent",
                color: selectedTimeframe === tf ? "white" : "#D1D5DB",
                cursor: "pointer",
                fontSize: "12px",
                borderRadius: selectedTimeframe === tf ? "4px" : "0"
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type Buttons */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setChartType("candlestick")}
            style={{
              padding: "6px 12px",
              border: "1px solid #374151",
              borderRadius: "4px",
              background: chartType === "candlestick" ? "#2962FF" : "#1E293B",
              color: chartType === "candlestick" ? "white" : "#D1D5DB",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Candles
          </button>
          <button
            onClick={() => setChartType("line")}
            style={{
              padding: "6px 12px",
              border: "1px solid #374151",
              borderRadius: "4px",
              background: chartType === "line" ? "#2962FF" : "#1E293B",
              color: chartType === "line" ? "white" : "#D1D5DB",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("area")}
            style={{
              padding: "6px 12px",
              border: "1px solid #374151",
              borderRadius: "4px",
              background: chartType === "area" ? "#2962FF" : "#1E293B",
              color: chartType === "area" ? "white" : "#D1D5DB",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Area
          </button>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right side tools */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{
            padding: "6px 12px",
            border: "1px solid #374151",
            borderRadius: "4px",
            background: "#1E293B",
            color: "#D1D5DB",
            cursor: "pointer",
            fontSize: "12px"
          }}>
            📊
          </button>
          <button style={{
            padding: "6px 12px",
            border: "1px solid #374151",
            borderRadius: "4px",
            background: "#1E293B",
            color: "#D1D5DB",
            cursor: "pointer",
            fontSize: "12px"
          }}>
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ flex: 1, position: "relative" }}>
        <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Bottom Panel - Indicators */}
      <div style={{
        height: "120px",
        borderTop: "1px solid #374151",
        background: "#0F172A",
        padding: "12px",
        display: "flex",
        gap: "12px"
      }}>
        {/* RSI Panel */}
        {indicators.includes("RSI") && (
          <div style={{
            flex: 1,
            background: "#1E293B",
            borderRadius: "4px",
            padding: "8px",
            border: "1px solid #374151"
          }}>
            <div style={{ fontSize: "12px", color: "#D1D5DB", marginBottom: "4px" }}>RSI (14)</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10B981" }}>65.4</div>
            <div style={{ fontSize: "10px", color: "#6B7280" }}>Neutral</div>
          </div>
        )}

        {/* MACD Panel */}
        {indicators.includes("MACD") && (
          <div style={{
            flex: 1,
            background: "#1E293B",
            borderRadius: "4px",
            padding: "8px",
            border: "1px solid #374151"
          }}>
            <div style={{ fontSize: "12px", color: "#D1D5DB", marginBottom: "4px" }}>MACD</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2962FF" }}>0.45</div>
            <div style={{ fontSize: "10px", color: "#6B7280" }}>Bullish</div>
          </div>
        )}

        {/* Volume Panel */}
        <div style={{
          flex: 1,
          background: "#1E293B",
          borderRadius: "4px",
          padding: "8px",
          border: "1px solid #374151"
        }}>
          <div style={{ fontSize: "12px", color: "#D1D5DB", marginBottom: "4px" }}>Volume</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#F59E0B" }}>2.4M</div>
          <div style={{ fontSize: "10px", color: "#6B7280" }}>+12.5%</div>
        </div>

        {/* Price Panel */}
        <div style={{
          flex: 1,
          background: "#1E293B",
          borderRadius: "4px",
          padding: "8px",
          border: "1px solid #374151"
        }}>
          <div style={{ fontSize: "12px", color: "#D1D5DB", marginBottom: "4px" }}>Price</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#F8FAFC" }}>$145.67</div>
          <div style={{ fontSize: "10px", color: "#10B981" }}>+$3.45</div>
        </div>
      </div>
    </div>
  );
}