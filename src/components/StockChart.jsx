import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { sma, ema, rsi, macd, vwap } from '../utils/indicators';
import axios from 'axios';
import io from 'socket.io-client';

export default function StockChart({ symbol, indicators, range }) {
  const chartContainerRef = useRef();
  const chart = useRef();
  const candlestickSeries = useRef();
  const volumeSeries = useRef();
  const indicatorSeries = useRef({});
  const socket = useRef();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
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
    candlestickSeries.current = chart.current.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderUpColor: '#4caf50',
      borderDownColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });

    // Create volume series
    volumeSeries.current = chart.current.addHistogramSeries({
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

    // Handle resize
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    socket.current = io('http://localhost:3001');
    
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.current.emit('subscribe', [symbol]);
    });

    socket.current.on('priceUpdate', (data) => {
      if (data.symbol === symbol && candlestickSeries.current) {
        const timestamp = Math.floor(new Date(data.data.timestamp).getTime() / 1000);
        const updatedData = {
          time: timestamp,
          open: data.data.open,
          high: data.data.high,
          low: data.data.low,
          close: data.data.close
        };
        
        candlestickSeries.current.update(updatedData);
        
        if (volumeSeries.current) {
          volumeSeries.current.update({
            time: timestamp,
            value: data.data.volume,
            color: data.data.close >= data.data.open ? '#4caf5080' : '#f4433680'
          });
        }
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [symbol]);

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

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for', symbol, 'with range', range);
        
        // Fetch combined historical and simulated data
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
        
        const chartData = convertDataForChart(apiData);
        setChartData(chartData);
        
        if (candlestickSeries.current && chartData.length > 0) {
          candlestickSeries.current.setData(chartData);
        }
        
        if (volumeSeries.current && chartData.length > 0) {
          const volumeData = chartData.map(item => ({
            time: item.time,
            value: item.volume,
            color: item.close >= item.open ? '#4caf5080' : '#f4433680'
          }));
          volumeSeries.current.setData(volumeData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stock data:', error);
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol, range]);

  // Update indicators
  useEffect(() => {
    if (!chartData.length || loading) return;

    // Clear existing indicator series
    Object.values(indicatorSeries.current).forEach(series => {
      if (series && chart.current) {
        chart.current.removeSeries(series);
      }
    });
    indicatorSeries.current = {};

    // Add new indicators
    indicators.forEach(indicator => {
      let indicatorData = [];
      let series;

      switch (indicator) {
        case 'SMA':
          indicatorData = sma(chartData, 20).map((value, index) => ({
            time: chartData[index].time,
            value: value
          })).filter(item => item.value !== null);
          
          if (indicatorData.length > 0) {
            series = chart.current.addLineSeries({
              color: '#ff9800',
              lineWidth: 2,
              title: 'SMA(20)'
            });
          }
          break;

        case 'EMA':
          indicatorData = ema(chartData, 20).map((value, index) => ({
            time: chartData[index].time,
            value: value
          })).filter(item => item.value !== null);
          
          if (indicatorData.length > 0) {
            series = chart.current.addLineSeries({
              color: '#2196f3',
              lineWidth: 2,
              title: 'EMA(20)'
            });
          }
          break;

        case 'VWAP':
          indicatorData = vwap(chartData).map((value, index) => ({
            time: chartData[index].time,
            value: value
          })).filter(item => item.value !== null);
          
          if (indicatorData.length > 0) {
            series = chart.current.addLineSeries({
              color: '#9c27b0',
              lineWidth: 2,
              title: 'VWAP'
            });
          }
          break;

        default:
          break;
      }

      if (series && indicatorData.length) {
        series.setData(indicatorData);
        indicatorSeries.current[indicator] = series;
      }
    });
  }, [indicators, chartData, loading]);

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
      style={{ width: '100%', height: '100%' }}
    />
  );
}