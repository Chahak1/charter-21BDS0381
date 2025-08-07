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
        // Since our sample data is from Jan 1, 2024, we'll use that as the base date
        const dataStartDate = new Date('2024-01-01');
        let startTime;

        switch (range) {
          case "1D":
            // Show all data for 1D since we only have intraday data
            startTime = null;
            break;
          case "1W":
            startTime = new Date(dataStartDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "1M":
            startTime = new Date(dataStartDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "3M":
            startTime = new Date(dataStartDate.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case "1Y":
            startTime = new Date(dataStartDate.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          case "ALL":
          default:
            startTime = null;
        }

        if (startTime) {
          console.log("Filtering data from:", startTime, "Data before filter:", data.length);
          data = data.filter((item) => new Date(item.timestamp) >= startTime);
          console.log("Data after filter:", data.length);
        } else {
          console.log("No time filtering applied, showing all data:", data.length);
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

  console.log("Chart render - data length:", chartData.length);
  console.log("Chart render - sample data:", chartData.slice(0, 2));

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      {/* Debug info */}
      <div style={{ padding: '10px', background: '#f0f0f0', fontSize: '12px', marginBottom: '10px' }}>
        <strong>Debug:</strong> {chartData.length} data points | 
        Range: {range} | 
        Sample: {chartData.length > 0 ? `$${chartData[0]?.close} -> $${chartData[chartData.length-1]?.close}` : 'No data'}
      </div>
      
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
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Price line */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#3b82f6' }}
            connectNulls={false}
          />
          
          {/* High/Low lines */}
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="#dc2626" 
            strokeWidth={1}
            strokeDasharray="2 2"
            dot={false}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="#059669" 
            strokeWidth={1}
            strokeDasharray="2 2"
            dot={false}
            connectNulls={false}
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
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={10}
            tickFormatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M`}
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