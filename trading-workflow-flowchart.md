# Trading Platform Workflow - System Architecture

```mermaid
graph TD
    subgraph "PRESENTATION TIER"
        A[🖥️ Web Browser]
        B[📱 React Frontend]
    end
    
    subgraph "APPLICATION TIER"
        C[📊 Trading Dashboard]
        D[📈 Chart Container]
        E[📋 Watchlist Panel]
        F[📊 Stock Stats Panel]
        G[🔧 Chart Toolbar]
        H[🎯 Indicator Selector]
    end
    
    subgraph "BUSINESS LOGIC TIER"
        I[🖥️ Express Server]
        J[📡 WebSocket Service]
        K[📊 Stock Data Service]
        L[📈 Technical Indicators]
        M[🔐 Signature Verifier]
    end
    
    subgraph "DATA TIER"
        N[📊 Historical Data CSV]
        O[🔄 Simulated Data CSV]
        P[📋 Market Data Cache]
    end
    
    subgraph "INTEGRATION TIER"
        Q[📡 Market Data APIs]
        R[⛓️ Blockchain Network]
        S[🔧 Hardhat Framework]
    end

    %% User Flow
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    
    %% Chart Interactions
    D --> G
    D --> H
    G --> D
    H --> D
    
    %% Data Requests
    D --> I
    E --> I
    F --> I
    
    %% Real-time Updates
    I --> J
    J --> D
    
    %% Data Processing
    I --> K
    K --> N
    K --> O
    K --> P
    
    %% Technical Analysis
    D --> L
    L --> D
    
    %% External Integrations
    K --> Q
    I --> M
    M --> R
    S --> R
    
    %% Data Flow Back to Frontend
    K --> I
    L --> I
    I --> B
    
    classDef tier1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef tier2 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef tier3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef tier4 fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef tier5 fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A,B tier1
    class C,D,E,F,G,H tier2
    class I,J,K,L,M tier3
    class N,O,P tier4
    class Q,R,S tier5
```

## Trading Platform Workflow Description

### 🖥️ **PRESENTATION TIER**
- **Web Browser**: User interface access point
- **React Frontend**: Main application interface with interactive components

### 📊 **APPLICATION TIER** 
- **Trading Dashboard**: Central hub for all trading activities
- **Chart Container**: Main charting interface for stock visualization
- **Watchlist Panel**: Stock selection and monitoring interface
- **Stock Stats Panel**: Real-time statistics and metrics display
- **Chart Toolbar**: Time range and chart configuration controls
- **Indicator Selector**: Technical analysis indicator selection

### ⚙️ **BUSINESS LOGIC TIER**
- **Express Server**: Main application server handling requests
- **WebSocket Service**: Real-time data streaming service
- **Stock Data Service**: Data aggregation and processing engine
- **Technical Indicators**: SMA, EMA, RSI, MACD, VWAP calculators
- **Signature Verifier**: Blockchain-based authentication system

### 💾 **DATA TIER**
- **Historical Data CSV**: Historical market data storage
- **Simulated Data CSV**: Generated trading simulation data
- **Market Data Cache**: In-memory data caching layer

### 🔗 **INTEGRATION TIER**
- **Market Data APIs**: External market data feed integration
- **Blockchain Network**: Smart contract deployment and interaction
- **Hardhat Framework**: Blockchain development and testing environment

## Key Workflow Patterns

1. **User Interaction Flow**: Browser → React Frontend → Trading Dashboard → Chart Components
2. **Data Request Flow**: Components → Express Server → Stock Data Service → Data Sources
3. **Real-time Updates**: WebSocket Service ↔ Chart Container (bidirectional streaming)
4. **Technical Analysis**: Chart Container ↔ Technical Indicators (dynamic calculations)
5. **Blockchain Integration**: Express Server → Signature Verifier → Blockchain Network