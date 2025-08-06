const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Stock symbols
const STOCKS = ['AAPL', 'TSLA', 'IBM', 'UL', 'WMT', 'MSFT', 'GOOG'];

// Generate sample historical data
function generateHistoricalData(symbol, days = 365) {
  const data = [];
  let currentPrice = Math.random() * 200 + 100;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const change = (Math.random() - 0.5) * 10;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 10000000 + 1000000);
    const adjustedClose = close * (0.95 + Math.random() * 0.1);
    
    currentPrice = close;

    data.push({
      timestamp: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      adjusted_close: parseFloat(adjustedClose.toFixed(2)),
      volume,
      dividend_amount: Math.random() < 0.1 ? parseFloat((Math.random() * 2).toFixed(2)) : 0,
      split_coefficient: Math.random() < 0.05 ? 2.0 : 1.0
    });
  }

  return data;
}

// Generate sample simulated (intraday) data
function generateSimulatedData(symbol, hours = 6.5) {
  const data = [];
  let currentPrice = Math.random() * 200 + 100;
  const today = new Date();
  today.setHours(9, 30, 0, 0); // Market open time

  const minutes = hours * 60;
  for (let i = 0; i < minutes; i++) {
    const time = new Date(today.getTime() + i * 60000);
    
    const change = (Math.random() - 0.5) * 2;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 1;
    const low = Math.min(open, close) - Math.random() * 1;
    const volume = Math.floor(Math.random() * 100000 + 10000);
    
    currentPrice = close;

    data.push({
      timestamp: time.toISOString().slice(0, 19).replace('T', ' '),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume
    });
  }

  return data;
}

// Store data in memory (in production, use a database)
const stockData = {};
STOCKS.forEach(symbol => {
  stockData[symbol] = {
    historical: generateHistoricalData(symbol),
    simulated: generateSimulatedData(symbol)
  };
});

// API Routes
app.get('/api/stocks/historical/:symbol', (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();
  
  if (!stockData[upperSymbol]) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  
  res.json(stockData[upperSymbol].historical);
});

app.get('/api/stocks/simulated/:symbol', (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();
  
  if (!stockData[upperSymbol]) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  
  res.json(stockData[upperSymbol].simulated);
});

app.get('/api/stocks/combined/:symbol', (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();
  
  if (!stockData[upperSymbol]) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  
  const combined = [
    ...stockData[upperSymbol].historical,
    ...stockData[upperSymbol].simulated
  ];
  
  res.json(combined);
});

app.get('/api/stocks/all', (req, res) => {
  const summary = STOCKS.map(symbol => {
    const data = stockData[symbol];
    const latestData = data.simulated[data.simulated.length - 1] || data.historical[data.historical.length - 1];
    const previousData = data.simulated[data.simulated.length - 2] || data.historical[data.historical.length - 2];
    
    const change = latestData.close - previousData.close;
    const changePercent = (change / previousData.close) * 100;
    
    return {
      symbol,
      price: latestData.close,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: latestData.volume,
      high: latestData.high,
      low: latestData.low
    };
  });
  
  res.json(summary);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('stockData', stockData);
  
  socket.on('subscribe', (symbols) => {
    console.log('Client subscribed to:', symbols);
    socket.join(symbols);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time price updates
setInterval(() => {
  STOCKS.forEach(symbol => {
    const data = stockData[symbol];
    const lastSimulated = data.simulated[data.simulated.length - 1];
    
    // Generate new data point
    const now = new Date();
    const change = (Math.random() - 0.5) * 2;
    const open = lastSimulated.close;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.5;
    const low = Math.min(open, close) - Math.random() * 0.5;
    const volume = Math.floor(Math.random() * 50000 + 5000);
    
    const newDataPoint = {
      timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume
    };
    
    // Update the last data point instead of adding new ones continuously
    data.simulated[data.simulated.length - 1] = newDataPoint;
    
    // Emit update to subscribed clients
    io.emit('priceUpdate', {
      symbol,
      data: newDataPoint
    });
  });
}, 1000); // Update every second

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`Stock data server running on port ${PORT}`);
  console.log(`Available stocks: ${STOCKS.join(', ')}`);
});