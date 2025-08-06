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
async function getStockData(symbol, dataType = 'historical') {
  try {
    const filePath = path.join(__dirname, 'data', dataType, `${symbol}.csv`);
    
    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const data = await readCSVFile(filePath);
    
    // Transform data to match expected format
    return data.map(row => ({
      timestamp: row.timestamp,
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume),
      adjusted_close: row.adjusted_close ? parseFloat(row.adjusted_close) : null,
      dividend_amount: row.dividend_amount ? parseFloat(row.dividend_amount) : null,
      split_coefficient: row.split_coefficient ? parseFloat(row.split_coefficient) : null
    }));
  } catch (error) {
    console.error(`Error reading CSV for ${symbol}:`, error);
    throw error;
  }
}

// API endpoint for historical stock data
app.get('/api/stocks/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockData(symbol, 'historical');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for simulated stock data
app.get('/api/stocks/simulated/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockData(symbol, 'simulated');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for combined stock data (defaults to historical)
app.get('/api/stocks/combined/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { type = 'historical' } = req.query;
    const data = await getStockData(symbol, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get available symbols
app.get('/api/stocks/symbols', async (req, res) => {
  try {
    const historicalDir = path.join(__dirname, 'data', 'historical');
    const simulatedDir = path.join(__dirname, 'data', 'simulated');
    
    const historicalFiles = await fs.readdir(historicalDir);
    const simulatedFiles = await fs.readdir(simulatedDir);
    
    const historicalSymbols = historicalFiles
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
    
    const simulatedSymbols = simulatedFiles
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
    
    res.json({
      historical: historicalSymbols,
      simulated: simulatedSymbols,
      all: [...new Set([...historicalSymbols, ...simulatedSymbols])]
    });
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