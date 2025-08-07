// Mock data generation for testing
function generateMockStockData(symbol, days = 30) {
  const data = [];
  const now = new Date();
  const basePrice = 100; // Starting price
  let currentPrice = basePrice;
  
  for (let i = days * 24 * 60; i >= 0; i -= 15) { // 15-minute intervals
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    
    // Generate realistic OHLC data
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 0.01 * currentPrice;
    const low = Math.min(open, close) - Math.random() * 0.01 * currentPrice;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    data.push({
      timestamp: timestamp.toISOString(),
      open: open.toFixed(2),
      high: high.toFixed(2), 
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: volume.toString()
    });
    
    currentPrice = close;
  }
  
  return data.reverse(); // Chronological order
}

// Stock data service with fallback to mock data
export class StockDataService {
  static async fetchStockData(symbol) {
    try {
      // Try to fetch from actual API first
      const response = await fetch(`http://localhost:3000/api/stocks/combined/${symbol}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Fetched real data for ${symbol}:`, data.slice(0, 3));
        return data;
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.warn(`Failed to fetch real data for ${symbol}, using mock data:`, error.message);
      
      // Generate mock data as fallback
      const mockData = generateMockStockData(symbol, 7); // 7 days of data
      console.log(`Generated mock data for ${symbol}:`, mockData.slice(0, 3));
      return mockData;
    }
  }
  
  static async fetchRealTimePrice(symbol) {
    try {
      const response = await fetch(`http://localhost:3000/api/stocks/price/${symbol}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch real-time price for ${symbol}:`, error.message);
    }
    
    // Return mock real-time price
    return {
      symbol,
      price: (100 + Math.random() * 50).toFixed(2),
      change: ((Math.random() - 0.5) * 10).toFixed(2),
      changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
      timestamp: new Date().toISOString()
    };
  }
  
  static async fetchStockInfo(symbol) {
    try {
      const response = await fetch(`http://localhost:3000/api/stocks/info/${symbol}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch stock info for ${symbol}:`, error.message);
    }
    
    // Return mock stock info
    return {
      symbol,
      name: `${symbol} Corporation`,
      sector: 'Technology',
      marketCap: '1.5T',
      peRatio: (15 + Math.random() * 20).toFixed(2),
      dividendYield: (Math.random() * 5).toFixed(2) + '%',
      description: `${symbol} is a leading technology company.`
    };
  }
}

export default StockDataService;
