# Stock Chart Application with Technical Indicators

A React-based stock chart application with comprehensive technical indicators and interactive features.

## Features Implemented

### ✅ Technical Indicators
- **RSI (Relative Strength Index)** - Shows overbought/oversold conditions with 30/70 levels
- **MACD (Moving Average Convergence Divergence)** - Displays MACD line, signal line, and histogram
- **Bollinger Bands** - Upper, middle, and lower bands with standard deviation
- **SMA (Simple Moving Average)** - 20-period moving average
- **EMA (Exponential Moving Average)** - 20-period exponential moving average
- **VWAP (Volume Weighted Average Price)** - Volume-weighted price indicator

### ✅ Chart Controls
- **Candlestick Chart** - Traditional candlestick representation
- **Line Chart** - Simple line chart view
- **Area Chart** - Filled area chart
- **Volume Chart** - Volume-based chart view
- **Full Screen Mode** - Toggle full-screen display
- **Time Range Selection** - 1D, 5D, 1M, 6M, 1Y options

### ✅ UI Improvements
- **Removed Left Sidebar** - Cleaner interface without the sidebar
- **Clickable Controls** - All chart controls are now fully functional
- **Responsive Design** - Works on different screen sizes
- **Modern Styling** - Clean, professional appearance

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the backend API server (for mock stock data):
   ```bash
   npm run server
   ```

2. In a new terminal, start the React development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   - React App: http://localhost:3000
   - API Server: http://localhost:3001

## Usage

1. **Select Indicators**: Use the checkboxes to enable/disable technical indicators
2. **Change Chart Type**: Click on Candlestick, Line, Area, or Volume buttons
3. **Adjust Time Range**: Select from 1D, 5D, 1M, 6M, or 1Y options
4. **Full Screen**: Click the "Full Screen" button to expand the chart
5. **View Indicators**: RSI and MACD charts appear below the main chart when selected

## Technical Details

- **Frontend**: React 18 with Chart.js for visualization
- **Backend**: Express.js server providing mock stock data
- **Indicators**: Custom implementations of RSI, MACD, Bollinger Bands, SMA, EMA, and VWAP
- **Data**: Mock stock data with realistic price movements and volume

## API Endpoints

- `GET /api/stocks/combined/:symbol` - Returns stock data for the specified symbol
- `GET /health` - Health check endpoint

## File Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Application styles
├── ChartContainer.jsx      # Chart container with controls
├── ChartToolbar.jsx        # Time range selection toolbar
├── IndicatorSelector.jsx   # Indicator selection checkboxes
├── StockChart.jsx          # Main chart component with indicators
├── indicators.js           # Technical indicator calculations
└── index.js               # React app entry point
```

## Future Enhancements

- Real-time data integration
- Additional technical indicators
- Chart annotations and drawing tools
- Export functionality
- Multiple stock comparison
- Custom indicator parameters
