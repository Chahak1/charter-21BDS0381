# Stock Chart Application

A modern stock charting application built with React frontend and Express backend, featuring real-time stock data visualization and technical indicators.

## 🚀 Features

- **Interactive Stock Charts**: Real-time candlestick charts with volume indicators
- **7 Major Stocks**: AAPL, GOOG, TSLA, MSFT, WMT, IBM, UL
- **Time Range Selection**: 1D, 1W, 1M, 3M, 1Y, ALL
- **Technical Indicators**: SMA, EMA, RSI, MACD, VWAP
- **Live Statistics**: Price, change, volume, high/low
- **Responsive Design**: Modern UI with mobile support
- **Professional Layout**: Sidebar navigation, watchlist, and stats panel

## 📁 Project Structure

```
chart/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React entry point
│   │   ├── ChartContainer.jsx    # Chart container with controls
│   │   ├── StockChart.jsx        # Main chart component
│   │   ├── StockStatsPanel.jsx   # Stock statistics
│   │   ├── WatchlistPanel.jsx    # Stock watchlist
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── IndicatorSelector.jsx # Technical indicators
│   └── package.json         # React dependencies
├── server.js                # Express backend
├── data/                    # CSV stock data files
│   ├── aapl.csv
│   ├── goog.csv
│   ├── tsla.csv
│   ├── msft.csv
│   ├── wmt.csv
│   ├── ibm.csv
│   └── ul.csv
└── package.json             # Node dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Setup Data Files (Important!)

```bash
# Setup data files for cross-platform compatibility
npm run setup
```

### 3. Start the Application

#### Option A: Development Mode (Recommended)
```bash
# Start both backend and frontend simultaneously
npm run dev:both
```

#### Option B: Start with Setup (if data issues)
```bash
# Setup data and start development server
npm run setup:dev
```

#### Option C: Start Separately
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend (in another terminal)
npm run client
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎯 Usage

1. **Select Stocks**: Click on any stock in the watchlist panel
2. **Change Time Range**: Use the time range buttons (1D, 1W, 1M, 3M, 1Y, ALL)
3. **View Statistics**: Check real-time stats in the right panel
4. **Technical Indicators**: Enable/disable various technical indicators
5. **Interactive Charts**: Hover over chart points for detailed information

## 📊 API Endpoints

- `GET /api/stocks` - Get list of available stocks
- `GET /api/stocks/:symbol` - Get stock data for a specific symbol
- `GET /api/stocks/combined/:symbol` - Get combined stock data (backward compatibility)
- `GET /health` - Health check endpoint

## 🔧 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run dev:both` - Start both backend and frontend
- `npm run setup` - Setup data files for cross-platform compatibility
- `npm run setup:start` - Setup data and start production server
- `npm run setup:dev` - Setup data and start development server
- `npm run install:all` - Install all dependencies

### Frontend Scripts
- `npm run client` - Start React development server
- `npm run build` - Build production React app

## 📈 Stock Data

The application includes sample data for 7 major stocks:
- **AAPL** - Apple Inc.
- **GOOG** - Alphabet Inc.
- **TSLA** - Tesla Inc.
- **MSFT** - Microsoft Corp.
- **WMT** - Walmart Inc.
- **IBM** - IBM Corp.
- **UL** - Unilever PLC

## 🎨 UI Components

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop and mobile
- **Interactive Charts**: Built with Recharts library
- **Real-time Updates**: Live data visualization
- **Color-coded Data**: Green/red for gains/losses

## 🔮 Technical Indicators

- **SMA**: Simple Moving Average (20-period)
- **EMA**: Exponential Moving Average (12-period)
- **RSI**: Relative Strength Index (14-period)
- **MACD**: Moving Average Convergence Divergence
- **VWAP**: Volume Weighted Average Price

## 🚀 Production Deployment

1. Build the React app:
```bash
cd client
npm run build
cd ..
```

2. Start the production server:
```bash
npm start
```

The server will serve both the API and the built React app.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 3001 are available
2. **Dependencies**: Run `npm run install:all` to install all dependencies
3. **Data not loading**: Check that CSV files exist in the `data/` directory
4. **File not found errors**: Run `npm run setup` to ensure both uppercase and lowercase CSV files exist
5. **CORS issues**: Backend includes CORS middleware for development
6. **Windows/Linux file naming**: The server now automatically checks for both `AAPL.csv` and `aapl.csv` formats

### Getting Help

- Check the browser console for error messages
- Ensure both backend and frontend servers are running
- Verify API endpoints are accessible at http://localhost:3001/health
