# Stock Chart Visualization Dashboard

A real-time stock chart visualization application built with React and Node.js, featuring live data updates, financial indicators, and a TradingView-inspired interface.

![Stock Chart Dashboard](https://via.placeholder.com/800x400/131722/d1d4dc?text=Stock+Chart+Dashboard)

## Features

### 📈 **Live Stock Charts**
- Real-time candlestick charts using Lightweight Charts library
- Volume indicators with color-coded bars
- Interactive crosshair and price scale
- Multiple time ranges (1D, 1W, 1M, 3M, 1Y, ALL)

### 📊 **Financial Indicators**
- Simple Moving Average (SMA)
- Exponential Moving Average (EMA) 
- Volume Weighted Average Price (VWAP)
- Relative Strength Index (RSI) - *coming soon*
- MACD - *coming soon*
- Bollinger Bands - *coming soon*

### 📱 **Live Data & Updates**
- WebSocket integration for real-time price updates
- Live watchlist with price changes and percentages
- Historical and simulated intraday data
- Automatic data refresh every second

### 🎨 **Modern UI**
- Dark theme similar to TradingView
- Responsive design for desktop and mobile
- Interactive sidebar with navigation icons
- Comprehensive stock statistics panel

### 📋 **Stock Coverage**
The application tracks 7 major stocks:
- **AAPL** - Apple Inc.
- **TSLA** - Tesla Inc.
- **IBM** - IBM Corp.
- **UL** - Unilever PLC
- **WMT** - Walmart Inc.
- **MSFT** - Microsoft Corp.
- **GOOG** - Alphabet Inc.

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Lightweight Charts** - Professional trading charts
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with dark theme

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket server
- **CORS** - Cross-origin resource sharing
- **CSV Parser** - Data processing

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Modern web browser

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd stock-chart-app
```

### 2. Install Dependencies

**Main Application:**
```bash
npm install
```

**Server:**
```bash
cd server
npm install
cd ..
```

### 3. Start the Application

**Option A: Run Both Services Together**
```bash
npm run dev
```

**Option B: Run Services Separately**

Terminal 1 (Backend Server):
```bash
cd server
npm start
```

Terminal 2 (React App):
```bash
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## API Endpoints

### Stock Data
- `GET /api/stocks/all` - Get all stocks with current prices
- `GET /api/stocks/historical/:symbol` - Get historical data for a stock
- `GET /api/stocks/simulated/:symbol` - Get simulated intraday data
- `GET /api/stocks/combined/:symbol` - Get combined historical + simulated data

### Health
- `GET /health` - Server health check

## Data Format

### Historical Data
```json
{
  "timestamp": "2025-01-02",
  "open": 187.15,
  "high": 188.44,
  "low": 183.885,
  "close": 185.64,
  "adjusted_close": 184.305493247853,
  "volume": 82488674,
  "dividend_amount": 0.0,
  "split_coefficient": 1.0
}
```

### Simulated Data
```json
{
  "timestamp": "2025-06-30 09:31:00",
  "open": 211.4693,
  "high": 212.1114,
  "low": 211.3598,
  "close": 211.9969,
  "volume": 585361
}
```

## Usage Guide

### 1. **Selecting Stocks**
- Click on any stock in the watchlist panel to view its chart
- Selected stock is highlighted in blue
- Price changes are color-coded (green = up, red = down)

### 2. **Time Ranges**
- Use toolbar buttons to change chart timeframe
- Available ranges: 1D, 1W, 1M, 3M, 1Y, ALL
- Chart automatically updates with filtered data

### 3. **Financial Indicators**
- Click indicator tags to toggle them on/off
- Active indicators are highlighted in blue
- Multiple indicators can be displayed simultaneously

### 4. **Chart Interaction**
- Hover over chart to see crosshair with price/time
- Scroll to zoom in/out on time axis
- Drag to pan across different time periods

### 5. **Live Updates**
- Prices update automatically every second
- WebSocket connection shows real-time changes
- No need to refresh the page

## Project Structure

```
stock-chart-app/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── ChartContainer.jsx   # Main chart wrapper
│   │   ├── ChartToolbar.jsx     # Time range controls
│   │   ├── IndicatorSelector.jsx # Indicator toggles
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── StockChart.jsx       # Main chart component
│   │   ├── StockStatsPanel.jsx  # Statistics panel
│   │   └── WatchlistPanel.jsx   # Stock list panel
│   ├── utils/
│   │   └── indicators.js        # Financial calculations
│   ├── App.js                   # Main app component
│   ├── index.js                 # App entry point
│   └── index.css               # Global styles
├── server/
│   ├── server.js               # Express server
│   └── package.json            # Server dependencies
├── package.json                # Main dependencies
└── README.md                   # This file
```

## Development

### Adding New Stocks
1. Add symbol to `STOCKS` array in `server/server.js`
2. Stock data will be automatically generated
3. Restart the server to see new stock

### Adding New Indicators
1. Implement calculation in `src/utils/indicators.js`
2. Add to `availableIndicators` in `IndicatorSelector.jsx`
3. Add case in `StockChart.jsx` switch statement

### Customizing Styling
- Modify `src/index.css` for global styles
- Colors follow TradingView theme palette
- CSS variables can be used for easy theme switching

## Troubleshooting

### Common Issues

**1. Blank Page**
- Check if both frontend and backend are running
- Verify ports 3000 and 3001 are not in use by other apps
- Check browser console for errors

**2. No Real-time Updates**
- Ensure WebSocket connection is established
- Check network tab for WebSocket connection
- Verify server is running on port 3001

**3. Chart Not Loading**
- Check API endpoints are responding
- Verify data format matches expected structure
- Look for console errors in browser

**4. Dependency Issues**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 16+

## Performance

### Optimizations Implemented
- Efficient chart updates using lightweight-charts
- WebSocket for minimal data transfer
- Component memoization for React renders
- Data filtering on server side
- Automatic cleanup of intervals and connections

### Memory Management
- Proper cleanup of WebSocket connections
- Chart instance disposal on unmount
- Interval clearing to prevent memory leaks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) for the charting library
- [TradingView](https://tradingview.com) for UI/UX inspiration
- [Socket.IO](https://socket.io/) for real-time communication

---

**Happy Trading! 📈📊**
