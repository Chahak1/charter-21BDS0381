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
      const std = Math.sqrt(variance);
      
      upperBand.push(mean + stdDev * std);
      lowerBand.push(mean - stdDev * std);
    }
  }
  
  return { upperBand, middleBand: smaValues, lowerBand };
}

export default function StockChart({ symbol, indicators, range, isFullScreen, onFullScreenToggle }) {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("candlestick");
  const [dataSource, setDataSource] = useState(""); // Track data source
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log("Fetching stock data for", symbol, "with range", range);

    const fetchData = async () => {
      try {
        console.log("Making API call to:", `http://localhost:3001/api/stocks/${symbol}`);
        const res = await axios.get(`http://localhost:3001/api/stocks/${symbol}`);
        let data = res.data;

        console.log("API Response status:", res.status);
        console.log("Fetched data length:", data ? data.length : 0);
        console.log("First few records:", data ? data.slice(0, 3) : "No data");

        // Use CSV data as-is
        if (data && data.length > 0) {
          // Sort data by timestamp to ensure proper order
          data = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          console.log("✅ Using CSV data:", data.length, "records");
          console.log("📊 Data source: CSV files for", symbol);
          setChartData(data);
          setDataSource("CSV");
        } else {
          console.log("⚠️ No CSV data found, using mock data");
          // Create mock data for testing if no CSV data
          const mockData = Array.from({ length: 100 }, (_, i) => ({
            timestamp: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString(),
            open: 100 + Math.random() * 20,
            high: 105 + Math.random() * 20,
            low: 95 + Math.random() * 20,
            close: 100 + Math.random() * 20,
            volume: 1000000 + Math.random() * 500000
          }));
          setChartData(mockData);
          setDataSource("Mock");
        }
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
        setDataSource("Mock");
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
        borderColor: "#2563eb",
        backgroundColor: "transparent",
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    } else if (chartType === "area") {
      datasets.push({
        label: "Price",
        data: prices,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.1
      });
    } else if (chartType === "volume") {
      const volumes = chartData.map(item => parseFloat(item.volume));
      datasets.push({
        label: "Volume",
        data: volumes,
        backgroundColor: "rgba(251, 146, 60, 0.8)",
        borderColor: "#fb923c",
        borderWidth: 1,
        type: "bar"
      });
    }

    // Add indicators
    if (indicators.includes("SMA")) {
      const smaValues = sma(chartData, 20);
      datasets.push({
        label: "SMA (20)",
        data: smaValues,
        borderColor: "#8b5cf6",
        backgroundColor: "transparent",
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    }

    if (indicators.includes("EMA")) {
      const emaValues = ema(chartData, 20);
      datasets.push({
        label: "EMA (20)",
        data: emaValues,
        borderColor: "#06b6d4",
        backgroundColor: "transparent",
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    }

    if (indicators.includes("VWAP")) {
      const vwapValues = vwap(chartData);
      datasets.push({
        label: "VWAP",
        data: vwapValues,
        borderColor: "#f59e0b",
        backgroundColor: "transparent",
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    }

    if (indicators.includes("BB")) {
      const bb = bollingerBands(chartData);
      datasets.push(
        {
          label: "BB Upper",
          data: bb.upperBand,
          borderColor: "#10b981",
          backgroundColor: "transparent",
          borderWidth: 1,
          fill: false,
          tension: 0.1
        },
        {
          label: "BB Middle",
          data: bb.middleBand,
          borderColor: "#6b7280",
          backgroundColor: "transparent",
          borderWidth: 1,
          fill: false,
          tension: 0.1
        },
        {
          label: "BB Lower",
          data: bb.lowerBand,
          borderColor: "#10b981",
          backgroundColor: "transparent",
          borderWidth: 1,
          fill: false,
          tension: 0.1
        }
      );
    }

    chartInstance.current = new Chart(ctx, {
      type: chartType === "candlestick" ? "bar" : "line",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: '#e5e7eb'
            },
            ticks: {
              color: '#6b7280',
              maxRotation: 0
            }
          },
          y: {
            display: true,
            position: 'right',
            grid: {
              color: '#e5e7eb'
            },
            ticks: {
              color: '#6b7280',
              callback: function(value) {
                return '$' + value.toFixed(2);
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#374151',
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#6b7280',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return label + ': $' + value.toFixed(2);
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType, indicators]);

  const renderRSI = () => {
    if (!indicators.includes("RSI") || !chartData.length) return null;

    const rsiValues = rsi(chartData);
    const labels = chartData.map(item => new Date(item.timestamp).toLocaleDateString());

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>RSI (14)</h4>
        <Chart
          type="line"
          data={{
            labels: labels,
            datasets: [{
              label: "RSI",
              data: rsiValues,
              borderColor: "#8b5cf6",
              backgroundColor: "transparent",
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false
              },
              y: {
                min: 0,
                max: 100,
                grid: {
                  color: '#e5e7eb'
                },
                ticks: {
                  color: '#6b7280'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }}
          width={400}
          height={150}
        />
      </div>
    );
  };

  const renderMACD = () => {
    if (!indicators.includes("MACD") || !chartData.length) return null;

    const macdData = macd(chartData);
    const labels = chartData.map(item => new Date(item.timestamp).toLocaleDateString());

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>MACD</h4>
        <Chart
          type="line"
          data={{
            labels: labels,
            datasets: [
              {
                label: "MACD Line",
                data: macdData.macdLine,
                borderColor: "#2563eb",
                backgroundColor: "transparent",
                borderWidth: 2,
                fill: false,
                tension: 0.1
              },
              {
                label: "Signal Line",
                data: macdData.signalLine,
                borderColor: "#ef4444",
                backgroundColor: "transparent",
                borderWidth: 2,
                fill: false,
                tension: 0.1
              },
              {
                label: "Histogram",
                data: macdData.histogram,
                backgroundColor: macdData.histogram.map(val => val >= 0 ? "rgba(34, 197, 94, 0.6)" : "rgba(239, 68, 68, 0.6)"),
                borderColor: macdData.histogram.map(val => val >= 0 ? "#22c55e" : "#ef4444"),
                borderWidth: 1,
                type: "bar"
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false
              },
              y: {
                grid: {
                  color: '#e5e7eb'
                },
                ticks: {
                  color: '#6b7280'
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#374151',
                  usePointStyle: true
                }
              }
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
        {/* Data Source Indicator */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: dataSource === "CSV" ? "#dcfce7" : "#fef3c7",
          border: `1px solid ${dataSource === "CSV" ? "#22c55e" : "#f59e0b"}`
        }}>
          <span style={{ 
            fontSize: "12px", 
            fontWeight: "500",
            color: dataSource === "CSV" ? "#166534" : "#92400e"
          }}>
            {dataSource === "CSV" ? "📊 CSV Data" : "⚠️ Mock Data"}
          </span>
        </div>

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
