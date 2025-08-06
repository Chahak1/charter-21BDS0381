import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

export default function StockChart({ symbol, indicators, range }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false); // Start with false to test

  console.log('StockChart render:', { symbol, indicators, range, loading });

  // Initialize chart immediately
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    console.log('Creating chart...');
    
    try {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth || 800,
        height: chartContainerRef.current.clientHeight || 400,
        layout: {
          background: { color: '#131722' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2a2e39' },
          horzLines: { color: '#2a2e39' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#2a2e39',
        },
        timeScale: {
          borderColor: '#2a2e39',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Create candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50',
        downColor: '#f44336',
        borderUpColor: '#4caf50',
        borderDownColor: '#f44336',
        wickUpColor: '#4caf50',
        wickDownColor: '#f44336',
      });

      // Add sample data immediately to test
      const sampleData = [
        { time: Math.floor(Date.now() / 1000) - 86400 * 5, open: 100, high: 105, low: 95, close: 102 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 4, open: 102, high: 108, low: 98, close: 106 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 3, open: 106, high: 110, low: 102, close: 104 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 2, open: 104, high: 107, low: 100, close: 105 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 1, open: 105, high: 112, low: 103, close: 108 },
      ];
      
      candlestickSeries.setData(sampleData);
      console.log('Sample data set');

      chartRef.current = chart;

      // Now load real data
      loadRealData(candlestickSeries);

      return () => {
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, []);

  const loadRealData = async (candlestickSeries) => {
    try {
      console.log('Loading real data for', symbol);
      const response = await axios.get(`http://localhost:3001/api/stocks/combined/${symbol}`);
      const apiData = response.data;
      
      console.log('Got real data:', apiData.length, 'records');
      
      // Convert to chart format
      const chartData = apiData.slice(0, 100).map(item => ({
        time: Math.floor(new Date(item.timestamp).getTime() / 1000),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      })).sort((a, b) => a.time - b.time);
      
      console.log('Setting real data:', chartData.length, 'records');
      candlestickSeries.setData(chartData);
      
    } catch (error) {
      console.error('Error loading real data:', error);
    }
  };

  console.log('Rendering chart container, loading:', loading);

  return (
    <div 
      ref={chartContainerRef} 
      className="chart-wrapper"
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#131722'
      }}
    />
  );
}