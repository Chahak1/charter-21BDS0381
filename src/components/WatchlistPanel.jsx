import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

export default function WatchlistPanel({ onSelect, selected }) {
  const [watchlist, setWatchlist] = useState([]);
  const [socket, setSocket] = useState(null);
  const stocks = ['AAPL', 'TSLA', 'IBM', 'UL', 'WMT', 'MSFT', 'GOOG'];

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Fetch initial stock data
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stocks/all');
        setWatchlist(response.data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        // Fallback to initial mock data
        const initialWatchlist = stocks.map(symbol => ({
          symbol,
          price: Math.random() * 200 + 100,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.floor(Math.random() * 10000000),
          high: Math.random() * 250 + 150,
          low: Math.random() * 150 + 80
        }));
        setWatchlist(initialWatchlist);
      }
    };

    fetchInitialData();

    // Listen for real-time price updates
    newSocket.on('priceUpdate', (data) => {
      setWatchlist(prev => prev.map(stock => {
        if (stock.symbol === data.symbol) {
          const previousClose = stock.price;
          const newPrice = data.data.close;
          const change = newPrice - previousClose;
          const changePercent = (change / previousClose) * 100;
          
          return {
            ...stock,
            price: newPrice,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: data.data.volume,
            high: data.data.high,
            low: data.data.low
          };
        }
        return stock;
      }));
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Refresh data every 30 seconds as backup
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stocks/all');
        setWatchlist(response.data);
      } catch (error) {
        console.error('Failed to refresh stock data:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="watchlist-panel">
      <div className="watchlist-header">Watchlist</div>
      {watchlist.map((stock) => (
        <div
          key={stock.symbol}
          className={`watchlist-item ${selected === stock.symbol ? 'selected' : ''}`}
          onClick={() => onSelect(stock.symbol)}
        >
          <div>
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-price">${stock.price.toFixed(2)}</div>
          </div>
          <div>
            <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
            </div>
            <div className={`stock-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}