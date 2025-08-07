# Trading Platform Workflow Diagram

```mermaid
graph TB
    %% User Interface Layer
    subgraph "Frontend (React)"
        A[User Interface] --> B[App.jsx]
        B --> C[Sidebar]
        B --> D[ChartContainer]
        B --> E[WatchlistPanel]
        B --> F[StockStatsPanel]
        
        D --> G[ChartToolbar]
        D --> H[IndicatorSelector]
        D --> I[StockChart]
        
        I --> J[MultiLineChart]
    end
    
    %% API Layer
    subgraph "Backend Services"
        K[Express Server] --> L[Stock Routes]
        L --> M[Stock Controller]
        M --> N[Stock Data Service]
        
        %% WebSocket for Real-time Data
        K --> O[WebSocket Service]
        O --> P[Real-time Data Stream]
    end
    
    %% Data Layer
    subgraph "Data Sources"
        Q[(Historical Data CSV)]
        R[(Simulated Data CSV)]
        S[External Market APIs]
    end
    
    %% Technical Analysis
    subgraph "Technical Indicators"
        T[SMA Calculator]
        U[EMA Calculator]
        V[RSI Calculator]
        W[MACD Calculator]
        X[VWAP Calculator]
    end
    
    %% Blockchain Layer
    subgraph "Blockchain Components"
        Y[Signature Verifier Contract]
        Z[Lock Contract]
        AA[Hardhat Framework]
    end
    
    %% Chart Library
    subgraph "Visualization"
        BB[Chart Library]
        CC[Data Formatter]
    end
    
    %% Workflow Connections
    A --> |User selects stock| E
    E --> |Stock selection change| I
    A --> |User selects indicators| H
    H --> |Indicator configuration| I
    A --> |User changes time range| G
    G --> |Range change| I
    
    %% Data Flow
    I --> |HTTP Request| L
    M --> |Fetch combined data| N
    N --> |Read historical| Q
    N --> |Read simulated| R
    N --> |Combine & sort data| I
    
    %% Real-time Updates
    I --> |WebSocket connection| O
    O --> |Load sim data| R
    O --> |Stream updates| I
    
    %% Technical Analysis Flow
    I --> |Apply indicators| T
    I --> |Apply indicators| U
    I --> |Apply indicators| V
    I --> |Apply indicators| W
    I --> |Apply indicators| X
    
    %% Chart Rendering
    I --> |Render data| BB
    BB --> |Format data| CC
    CC --> |Display charts| J
    
    %% External Data
    S --> |Market data feed| N
    
    %% Blockchain Integration
    AA --> |Deploy contracts| Y
    AA --> |Deploy contracts| Z
    Y --> |Signature verification| K
    
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef data fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef indicators fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef blockchain fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef visualization fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    
    class A,B,C,D,E,F,G,H,I,J frontend
    class K,L,M,N,O,P backend
    class Q,R,S data
    class T,U,V,W,X indicators
    class Y,Z,AA blockchain
    class BB,CC visualization
```

## System Architecture Overview

### User Workflow
1. **Stock Selection**: User selects a stock symbol from the watchlist
2. **Time Range**: User chooses time range (1D, 1W, 1M, 3M)
3. **Indicator Selection**: User selects technical indicators (SMA, EMA, RSI, MACD, VWAP)
4. **Real-time Updates**: System streams live data via WebSocket
5. **Chart Visualization**: Interactive charts display stock data with indicators

### Data Flow
1. **Historical Data**: Loads from CSV files in `/data/historical/`
2. **Simulated Data**: Loads from CSV files in `/data/simulated/`
3. **Combined Processing**: Merges and sorts data by timestamp
4. **Technical Analysis**: Applies selected indicators to price data
5. **Real-time Streaming**: WebSocket sends periodic updates
6. **Chart Rendering**: Visualizes data using chart library

### Key Components
- **Frontend**: React-based dashboard with modular components
- **Backend**: Express server with RESTful APIs and WebSocket support
- **Data Layer**: CSV-based historical and simulated market data
- **Technical Analysis**: Built-in indicator calculations
- **Blockchain**: Smart contracts for signature verification
- **Visualization**: Interactive charting with multiple timeframes

### Security Features
- Modular signature verification algorithm
- Smart contract integration for authentication
- Hardhat framework for blockchain development and testing