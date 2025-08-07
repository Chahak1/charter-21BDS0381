import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DataTest({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`DataTest: Fetching data for ${symbol}`);
        
        const response = await axios.get(`/api/stocks/combined/${symbol.toLowerCase()}`);
        console.log(`DataTest: Response for ${symbol}:`, response.data);
        
        setData(response.data);
      } catch (err) {
        console.error(`DataTest: Error fetching ${symbol}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <div style={{padding: '10px', background: '#f0f0f0'}}>Loading data test...</div>;
  
  if (error) return <div style={{padding: '10px', background: '#fee', color: 'red'}}>Error: {error}</div>;
  
  if (!data) return <div style={{padding: '10px', background: '#fef0e0'}}>No data received</div>;

  return (
    <div style={{padding: '10px', background: '#f0f8ff', margin: '10px 0', border: '1px solid #ccc'}}>
      <h4>Data Test for {symbol}</h4>
      <p>Records received: {data.length}</p>
      <p>First record: {JSON.stringify(data[0], null, 2)}</p>
      <p>Last record: {JSON.stringify(data[data.length - 1], null, 2)}</p>
    </div>
  );
}