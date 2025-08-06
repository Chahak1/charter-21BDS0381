const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Stock data service functions
const baseDataDir = path.join(__dirname, 'data');

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return resolve([]);
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Convert string values to numbers where appropriate
        const processedData = {
          timestamp: data.timestamp,
          open: parseFloat(data.open),
          high: parseFloat(data.high),
          low: parseFloat(data.low),
          close: parseFloat(data.close),
          volume: parseInt(data.volume)
        };
        results.push(processedData);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Stock routes
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toLowerCase();
    const filePath = path.join(baseDataDir, `${symbol}.csv`);
    
    console.log(`Fetching data for ${symbol} from ${filePath}`);
    
    const data = await readCSV(filePath);
    
    if (data.length === 0) {
      return res.status(404).json({ error: `No data found for symbol: ${symbol}` });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Get combined data (for backward compatibility with existing frontend)
app.get('/api/stocks/combined/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toLowerCase();
    const filePath = path.join(baseDataDir, `${symbol}.csv`);
    
    console.log(`Fetching combined data for ${symbol} from ${filePath}`);
    
    const data = await readCSV(filePath);
    
    if (data.length === 0) {
      return res.status(404).json({ error: `No data found for symbol: ${symbol}` });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching combined stock data:', error);
    res.status(500).json({ error: 'Failed to fetch combined stock data' });
  }
});

// Get list of available stocks
app.get('/api/stocks', (req, res) => {
  try {
    const files = fs.readdirSync(baseDataDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', '').toUpperCase());
    
    res.json(files);
  } catch (error) {
    console.error('Error listing stocks:', error);
    res.status(500).json({ error: 'Failed to list available stocks' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stock chart server is running' });
});

// Serve static files from client build (if available)
const clientBuildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Stock chart server running on port ${PORT}`);
  console.log(`Available stocks: ${fs.readdirSync(baseDataDir).filter(f => f.endsWith('.csv')).map(f => f.replace('.csv', '')).join(', ')}`);
});

module.exports = app;