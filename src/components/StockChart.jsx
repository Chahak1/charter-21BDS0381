import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { sma, ema, vwap } from '../utils/indicators';
import axios from 'axios';
import io from 'socket.io-client';

export default function StockChart({ symbol, indicators, range }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const socketRef = useRef(null);
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log('StockChart render:', { symbol, indicators, range, loading });

  // Convert API data to chart format
  const convertDataForChart = (apiData) => {
    return apiData.map(item => {
      const timestamp = item.timestamp.includes(' ') 
        ? Math.floor(new Date(item.timestamp).getTime() / 1000)
        : Math.floor(new Date(item.timestamp).getTime() / 1000);
      
      return {
        time: timestamp,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume)
      };
    }).sort((a, b) => a.time - b.time);
  };

  // Initialize chart only once
  useEffect(() => {
    console.log('Chart init useEffect called');
    console.log('chartContainerRef.current:', !!chartContainerRef.current);
    console.log('chartRef.current:', !!chartRef.current);
    
    if (!chartContainerRef.current) {
      console.log('No chart container ref, returning');
      return;
    }
    
    if (chartRef.current) {
      console.log('Chart already exists, returning');
      return;
    }

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

      // Create volume series
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      // Store references
      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
      volumeSeriesRef.current = volumeSeries;

      console.log('Chart initialized successfully');

      // Add test data immediately to verify chart is working
      const testData = [
        { time: Math.floor(Date.now() / 1000) - 86400 * 5, open: 100, high: 105, low: 95, close: 102 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 4, open: 102, high: 108, low: 98, close: 106 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 3, open: 106, high: 110, low: 102, close: 104 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 2, open: 104, high: 107, low: 100, close: 105 },
        { time: Math.floor(Date.now() / 1000) - 86400 * 1, open: 105, high: 112, low: 103, close: 108 },
      ];
      
      candlestickSeries.setData(testData);
      console.log('Test data set to verify chart is working');

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          candlestickSeriesRef.current = null;
          volumeSeriesRef.current = null;
          indicatorSeriesRef.current = {};
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, []);

  // Load data when symbol or range changes
  useEffect(() => {
    console.log('Data loading useEffect called');
    console.log('symbol:', symbol);
    console.log('chartRef.current:', !!chartRef.current);
    console.log('range:', range);
    
    if (!symbol) {
      console.log('No symbol, returning');
      return;
    }
    
    if (!chartRef.current) {
      console.log('No chart ref, returning');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for', symbol, 'with range', range);
        
        const response = await axios.get(`http://localhost:3001/api/stocks/combined/${symbol}`);
        let apiData = response.data;
        
        console.log('Fetched data:', apiData.length, 'records');
        
        // Filter data based on selected range
        const now = new Date();
        let startTime;
        
        switch (range) {
          case '1D':
            startTime = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
            break;
          case '1W':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '1M':
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '3M':
            startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case '1Y':
            startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startTime = null;
        }
        
        if (startTime) {
          apiData = apiData.filter(item => new Date(item.timestamp) >= startTime);
        }
        
        console.log('Filtered data:', apiData.length, 'records');
        
        const formattedData = convertDataForChart(apiData);
        console.log('Formatted data:', formattedData.length, 'records');
        setChartData(formattedData);
        
        // Set chart data
        if (candlestickSeriesRef.current && formattedData.length > 0) {
          candlestickSeriesRef.current.setData(formattedData);
          console.log('Candlestick data set successfully');
        }
        
        if (volumeSeriesRef.current && formattedData.length > 0) {
          const volumeData = formattedData.map(item => ({
            time: item.time,
            value: item.volume,
            color: item.close >= item.open ? '#4caf5080' : '#f4433680'
          }));
          volumeSeriesRef.current.setData(volumeData);
          console.log('Volume data set successfully');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stock data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range]);

  // Update indicators when they change
  useEffect(() => {
    if (!chartData.length || !chartRef.current || loading) return;

    console.log('Updating indicators:', indicators);

    // Clear existing indicator series
    Object.values(indicatorSeriesRef.current).forEach(series => {
      if (series && chartRef.current) {
        try {
          chartRef.current.removeSeries(series);
        } catch (e) {
          console.warn('Error removing series:', e);
        }
      }
    });
    indicatorSeriesRef.current = {};

    // Add new indicators
    indicators.forEach(indicator => {
      if (!chartRef.current) return;

      let indicatorData = [];
      let series = null;

      try {
        switch (indicator) {
          case 'SMA':
            indicatorData = sma(chartData, 20).map((value, index) => ({
              time: chartData[index].time,
              value: value
            })).filter(item => item.value !== null && !isNaN(item.value));
            
            if (indicatorData.length > 0) {
              series = chartRef.current.addLineSeries({
                color: '#ff9800',
                lineWidth: 2,
                title: 'SMA(20)'
              });
              series.setData(indicatorData);
              indicatorSeriesRef.current[indicator] = series;
              console.log('SMA indicator added');
            }
            break;

          case 'EMA':
            indicatorData = ema(chartData, 20).map((value, index) => ({
              time: chartData[index].time,
              value: value
            })).filter(item => item.value !== null && !isNaN(item.value));
            
            if (indicatorData.length > 0) {
              series = chartRef.current.addLineSeries({
                color: '#2196f3',
                lineWidth: 2,
                title: 'EMA(20)'
              });
              series.setData(indicatorData);
              indicatorSeriesRef.current[indicator] = series;
              console.log('EMA indicator added');
            }
            break;

          case 'VWAP':
            indicatorData = vwap(chartData).map((value, index) => ({
              time: chartData[index].time,
              value: value
            })).filter(item => item.value !== null && !isNaN(item.value));
            
            if (indicatorData.length > 0) {
              series = chartRef.current.addLineSeries({
                color: '#9c27b0',
                lineWidth: 2,
                title: 'VWAP'
              });
              series.setData(indicatorData);
              indicatorSeriesRef.current[indicator] = series;
              console.log('VWAP indicator added');
            }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(`Error adding ${indicator} indicator:`, error);
      }
    });
  }, [indicators, chartData, loading]);

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    if (!symbol) return;

    try {
      const socket = io('http://localhost:3001');
      socketRef.current = socket;
      
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        socket.emit('subscribe', [symbol]);
      });

      socket.on('priceUpdate', (data) => {
        if (data.symbol === symbol && candlestickSeriesRef.current) {
          const timestamp = Math.floor(new Date(data.data.timestamp).getTime() / 1000);
          const updatedData = {
            time: timestamp,
            open: data.data.open,
            high: data.data.high,
            low: data.data.low,
            close: data.data.close
          };
          
          candlestickSeriesRef.current.update(updatedData);
          
          if (volumeSeriesRef.current) {
            volumeSeriesRef.current.update({
              time: timestamp,
              value: data.data.volume,
              color: data.data.close >= data.data.open ? '#4caf5080' : '#f4433680'
            });
          }
        }
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="loading">
        Loading {symbol} chart data...
      </div>
    );
  }

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