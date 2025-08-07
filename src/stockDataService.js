// CSV Parser utility function
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });
}

// Date parsing utility for various timestamp formats
function parseTimestamp(timestamp) {
  // Handle different formats:
  // "02-01-2025" -> daily data
  // "30-06-2025 11:40" -> intraday data
  
  if (timestamp.includes(' ')) {
    // Intraday format: "30-06-2025 11:40"
    const [datePart, timePart] = timestamp.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute);
  } else {
    // Daily format: "02-01-2025"
    const [day, month, year] = timestamp.split('-');
    return new Date(year, month - 1, day);
  }
}

// Stock data service that reads CSV files
export class StockDataService {
  static async fetchStockData(symbol) {
    try {
      console.log(`Fetching CSV data for ${symbol}...`);
      
      // Try to fetch CSV file from the data folder
      const response = await fetch(`/data/${symbol}.csv`);
      
      if (!response.ok) {
        throw new Error(`CSV file not found: ${symbol}.csv (${response.status})`);
      }
      
      const csvText = await response.text();
      console.log(`CSV data loaded for ${symbol}, first 200 chars:`, csvText.substring(0, 200));
      
      // Parse CSV data
      const rawData = parseCSV(csvText);
      console.log(`Parsed ${rawData.length} rows for ${symbol}`);
      
      // Convert to required format with proper date parsing
      const formattedData = rawData.map(row => ({
        timestamp: parseTimestamp(row.timestamp).toISOString(),
        open: parseFloat(row.open),
        high: parseFloat(row.high),
        low: parseFloat(row.low),
        close: parseFloat(row.close),
        volume: parseInt(row.volume, 10)
      })).filter(row => 
        !isNaN(row.open) && !isNaN(row.high) && 
        !isNaN(row.low) && !isNaN(row.close) && 
        !isNaN(row.volume)
      );
      
      console.log(`Successfully formatted ${formattedData.length} data points for ${symbol}`);
      console.log('Sample data:', formattedData.slice(0, 3));
      
      return formattedData;
      
    } catch (error) {
      console.error(`Failed to load CSV data for ${symbol}:`, error.message);
      throw new Error(`Unable to load data for ${symbol}. Please ensure ${symbol}.csv exists in the data folder.`);
    }
  }
  
  static async fetchRealTimePrice(symbol) {
    try {
      // Get the latest price from CSV data
      const data = await this.fetchStockData(symbol);
      if (data.length === 0) {
        throw new Error('No data available');
      }
      
      const latest = data[data.length - 1];
      const previous = data.length > 1 ? data[data.length - 2] : latest;
      
      const change = latest.close - previous.close;
      const changePercent = ((change / previous.close) * 100);
      
      return {
        symbol,
        price: latest.close.toFixed(2),
        change: (change >= 0 ? '+' : '') + change.toFixed(2),
        changePercent: (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%',
        timestamp: latest.timestamp
      };
    } catch (error) {
      console.warn(`Failed to fetch real-time price for ${symbol}:`, error.message);
      throw error;
    }
  }
  
  static async fetchStockInfo(symbol) {
    try {
      const priceData = await this.fetchRealTimePrice(symbol);
      
      return {
        symbol,
        name: `${symbol} Corporation`,
        sector: 'Technology',
        marketCap: 'N/A',
        peRatio: 'N/A',
        dividendYield: 'N/A',
        currentPrice: priceData.price,
        change: priceData.change,
        changePercent: priceData.changePercent,
        description: `Stock data for ${symbol} from CSV file.`
      };
    } catch (error) {
      console.warn(`Failed to fetch stock info for ${symbol}:`, error.message);
      throw error;
    }
  }
  
  // Get available stock symbols by checking CSV files
  static async getAvailableSymbols() {
    // This would require a backend endpoint to list CSV files
    // For now, return common symbols that might have CSV files
    return ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];
  }
}

export default StockDataService;
