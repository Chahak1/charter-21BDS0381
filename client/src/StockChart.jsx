import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar
} from 'recharts';

export default function StockChart({ symbol, range, indicators = [] }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching stock data for", symbol, "with range", range);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`/api/stocks/combined/${symbol.toLowerCase()}`);
        let data = res.data;

        console.log("Fetched data:", data);

        if (!data || data.length === 0) {
          setError(`No data available for ${symbol}`);
          setChartData([]);
          return;
        }

        // Filter data based on selected range
        const now = new Date();
        let startTime;

        switch (range) {
          case "1D":
            startTime = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
            break;
          case "1W":
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "1M":
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "3M":
            startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
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

        // Process data for chart
        const processedData = data.map((item, index) => ({
          ...item,
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          date: new Date(item.timestamp).toLocaleDateString(),
          datetime: new Date(item.timestamp),
          index: index
        }));

        console.log("Filtered data:", processedData);
        setChartData(processedData);
      } catch (err) {
        console.error("Failed to load stock data:", err);
        setError(`Failed to load data for ${symbol}: ${err.message}`);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.date} {data.time}</p>
          <p style={{ margin: '4px 0', color: '#059669' }}>Open: ${data.open?.toFixed(2)}</p>
          <p style={{ margin: '4px 0', color: '#dc2626' }}>High: ${data.high?.toFixed(2)}</p>
          <p style={{ margin: '4px 0', color: '#3b82f6' }}>Low: ${data.low?.toFixed(2)}</p>
          <p style={{ margin: '4px 0', color: '#6366f1' }}>Close: ${data.close?.toFixed(2)}</p>
          <p style={{ margin: '4px 0', color: '#64748b' }}>Volume: {data.volume?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading">
        Loading chart data for {symbol}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="error">
        No data available for {symbol}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="time"
            stroke="#64748b"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Price line */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
          
          {/* High/Low area */}
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="#dc2626" 
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="#059669" 
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Volume chart */}
      <ResponsiveContainer width="100%" height="20%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="time"
            stroke="#64748b"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#64748b"
            fontSize={10}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Bar 
            dataKey="volume" 
            fill="#8884d8" 
            opacity={0.6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}