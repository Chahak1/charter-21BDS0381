const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Function to read CSV file and return data
async function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to get stock data from CSV files
async function getStockData(symbol) {
  try {
    const filePath = path.join(__dirname, 'data', 'stocks', `${symbol}.csv`);
    
    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const data = await readCSVFile(filePath);
    
    // Transform data to match expected format
    const transformedData = data.map(row => ({
      timestamp: row.timestamp,
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume)
    }));
    
    // Sort data by timestamp to ensure proper order
    transformedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    console.log(`✅ Loaded ${transformedData.length} records for ${symbol}`);
    console.log(`📊 Data range: ${transformedData[0]?.timestamp} to ${transformedData[transformedData.length - 1]?.timestamp}`);
    
    return transformedData;
  } catch (error) {
    console.error(`Error reading CSV for ${symbol}:`, error);
    throw error;
  }
}

// API endpoint to get available symbols
app.get('/api/stocks/symbols', async (req, res) => {
  try {
    const stocksDir = path.join(__dirname, 'data', 'stocks');
    
    // Check if directory exists
    if (!await fs.pathExists(stocksDir)) {
      return res.status(404).json({ error: 'Stocks directory not found' });
    }
    
    const files = await fs.readdir(stocksDir);
    
    const symbols = files
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
    
    res.json({
      symbols: symbols,
      all: symbols
    });
  } catch (error) {
    console.error('Error reading symbols:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for stock data
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockData(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stock API server is running' });
});

app.listen(port, () => {
  console.log(`Stock API server running at http://localhost:${port}`);
});