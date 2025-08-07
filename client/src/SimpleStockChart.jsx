import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SimpleStockChart({ symbol, range }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching simple chart data for ${symbol}`);
        
        const res = await axios.get(`/api/stocks/combined/${symbol.toLowerCase()}`);
        const data = res.data;

        console.log("Simple chart - raw data:", data);

        if (!data || data.length === 0) {
          setError(`No data available for ${symbol}`);
          setChartData([]);
          return;
        }

        // Simple processing - just use the data as is
        const processedData = data.map((item, index) => ({
          name: `${index + 1}`,
          price: item.close,
          volume: item.volume,
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));

        console.log("Simple chart - processed data:", processedData.slice(0, 3));
        setChartData(processedData);
      } catch (err) {
        console.error("Simple chart error:", err);
        setError(`Failed to load data: ${err.message}`);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading chart for {symbol}...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        No chart data available for {symbol}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h3>Simple Chart for {symbol} ({chartData.length} points)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value, name) => [`$${value}`, 'Price']}
            labelFormatter={(label) => `Point ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}