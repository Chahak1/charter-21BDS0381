# Trading Platform Process Flowchart

```mermaid
flowchart TD
    Start([🚀 User Starts Trading Session]) --> Login{🔐 User Authenticated?}
    
    Login -->|No| Auth[📝 Authentication Process]
    Auth --> Login
    
    Login -->|Yes| Dashboard[📊 Load Trading Dashboard]
    
    Dashboard --> LoadData[📥 Fetch Market Data]
    LoadData --> DataSource{📋 Select Data Source}
    
    DataSource -->|Historical| HistoricalData[(📊 Load Historical CSV)]
    DataSource -->|Live| LiveData[(📡 Connect to Live Data)]
    DataSource -->|Simulated| SimulatedData[(🔄 Load Simulated CSV)]
    
    HistoricalData --> CombineData[🔄 Combine Data Sources]
    LiveData --> CombineData
    SimulatedData --> CombineData
    
    CombineData --> SelectStock{📈 User Selects Stock?}
    
    SelectStock -->|No| WaitSelection[⏳ Wait for Stock Selection]
    WaitSelection --> SelectStock
    
    SelectStock -->|Yes| ProcessStock[⚙️ Process Stock Data]
    
    ProcessStock --> TimeRange[⏰ Select Time Range<br/>1D | 1W | 1M | 3M]
    
    TimeRange --> ApplyIndicators{📊 Apply Technical Indicators?}
    
    ApplyIndicators -->|Yes| ProcessIndicators[📈 Calculate Selected Indicators<br/>SMA | EMA | RSI | MACD | VWAP]
    ApplyIndicators -->|No| RenderChart
    
    ProcessIndicators --> RenderChart[🎨 Render Chart with Data]
    
    RenderChart --> DisplayChart[📈 Display Interactive Chart]
    
    DisplayChart --> UserActions{👤 User Action Required?}
    
    UserActions -->|Change Stock| SelectStock
    UserActions -->|Change Timeframe| TimeRange
    UserActions -->|Modify Indicators| ApplyIndicators
    UserActions -->|View Stats| ShowStats[📊 Display Stock Statistics]
    UserActions -->|Update Watchlist| UpdateWatchlist[📋 Modify Watchlist]
    UserActions -->|Exit| Logout
    
    ShowStats --> UserActions
    UpdateWatchlist --> UserActions
    
    Logout{🚪 Logout Requested?} -->|Yes| SaveSession[💾 Save Session Data]
    SaveSession --> End([🛑 Session Terminated])
    
    Logout -->|No| UserActions
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef data fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class Start,End startEnd
    class Dashboard,LoadData,CombineData,ProcessStock,TimeRange,ProcessIndicators,RenderChart,DisplayChart,ShowStats,UpdateWatchlist,SaveSession,WaitSelection,Auth process
    class Login,DataSource,SelectStock,ApplyIndicators,UserActions,Logout decision
    class HistoricalData,LiveData,SimulatedData data
```

## Trading Platform Process Flow Description

### 🔄 **Simplified Workflow Process**

#### **1. Session Initialization**
- User starts trading session
- Simple authentication process
- Dashboard loading upon successful authentication

#### **2. Data Acquisition**
- Fetch market data from multiple sources
- Choose between Historical CSV, Live Data, or Simulated data
- Combine and process data sources

#### **3. Stock Selection & Analysis**
- User selects stock symbol from watchlist
- Choose time range from options: **1D | 1W | 1M | 3M**
- Apply technical indicators from available options: **SMA | EMA | RSI | MACD | VWAP**

#### **4. Visualization**
- Render interactive charts with processed data
- Display charts with selected indicators and time range

#### **5. User Interaction Loop**
- Continuous user actions (change stock, timeframe, indicators)
- View statistics and update watchlist
- Maintain session until logout

#### **6. Session Management**
- Save session data upon logout
- Proper session termination

### 📋 **Flowchart Symbols Used**
- **Ovals**: Start/End points
- **Rectangles**: Process steps (including consolidated options)
- **Diamonds**: Decision points
- **Cylinders**: Data storage/sources
- **Arrows**: Process flow direction

### 🎯 **Key Decision Points**
1. **Authentication**: Simple user credential verification
2. **Data Source Selection**: Choose appropriate data feed
3. **Stock Selection**: Wait for user stock choice
4. **Technical Analysis**: Apply selected indicators (all available in one step)
5. **User Actions**: Handle various user interactions

This flowchart provides a comprehensive view of the trading platform's business process from initial user authentication through active trading session management.