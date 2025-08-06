const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Generate mock stock data
function generateMockStockData(symbol, days = 100) {
  const data = [];
  let basePrice = 100 + Math.random() * 50; // Random base price between 100-150
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movements
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility;
    basePrice = basePrice * (1 + change);
    
    const open = basePrice;
    const high = open * (1 + Math.random() * 0.03);
    const low = open * (1 - Math.random() * 0.03);
    const close = low + Math.random() * (high - low);
    const volume = 1000000 + Math.random() * 5000000;
    
    data.push({
      timestamp: date.toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(volume)
    });
  }
  
  return data;
}

// API endpoint for stock data
app.get('/api/stocks/combined/:symbol', (req, res) => {
  const { symbol } = req.params;
  const mockData = generateMockStockData(symbol);
  
  res.json(mockData);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stock API server is running' });
});

app.listen(port, () => {
  console.log(`Stock API server running at http://localhost:${port}`);
});