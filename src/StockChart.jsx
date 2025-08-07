import React, { useState, useEffect, useRef } from "react";
import { StockDataService } from "./stockDataService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import { initChart } from "./chartlib";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
);

export default function StockChart({ symbol, indicators, range }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    console.log("Fetching stock data for", symbol, "with range", range);
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Use the enhanced data service
        let data = await StockDataService.fetchStockData(symbol);

        console.log("Fetched data:", data.slice(0, 3));

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
          case "1W":
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "1M":
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "6M":
            startTime = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case "3M":
            startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case "1Y":
            startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          case "ALL":
            startTime = null;
            break;
          default:
            startTime = null;
        }

        if (startTime) {
          data = data.filter((item) => new Date(item.timestamp) >= startTime);
        }

        console.log("Filtered data:", data.slice(0, 3), `Total: ${data.length} records`);
        setChartData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load stock data:", err);
        setError(`Failed to load data for ${symbol}: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range]);

  useEffect(() => {
    if (chartData.length > 0 && chartContainerRef.current) {
      console.log("Initializing chart with", chartData.length, "data points and indicators:", indicators);
      try {
        // Use the existing chart library with indicators
        const cleanup = initChart(chartContainerRef.current, chartData, indicators);
        return cleanup;
      } catch (err) {
        console.error("Failed to initialize chart:", err);
        setError(`Failed to render chart: ${err.message}`);
      }
    }
  }, [chartData, indicators]);

  if (loading) {
    return (
      <div style={{ 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #e3e3e3",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 10px"
          }}></div>
          <div style={{ color: "#666", fontSize: "14px" }}>
            Loading chart data for {symbol}...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#fff5f5",
        border: "1px solid #fed7d7",
        borderRadius: "4px",
        color: "#c53030"
      }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "18px", marginBottom: "8px" }}>⚠️</div>
          <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
            Error Loading Chart
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: "12px",
              padding: "6px 12px",
              backgroundColor: "#c53030",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        color: "#6c757d"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "8px" }}>📊</div>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            No data available for {symbol}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>
            Try selecting a different time range or stock symbol
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      backgroundColor: "white",
      position: "relative",
      minHeight: "400px"
    }}>
      <div 
        ref={chartContainerRef} 
        style={{ 
          width: "100%", 
          height: "100%",
          minHeight: "400px"
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
