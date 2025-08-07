# Technical Documentation

## 🏗️ System Architecture

### High-Level Architecture Diagram
```
                    ┌─────────────────────────────────┐
                    │         Frontend Layer         │
                    │    React + TypeScript          │
                    │    • Component Library         │
                    │    • State Management          │
                    │    • Real-time Updates         │
                    └─────────────────┬───────────────┘
                                      │ HTTPS/WSS
                    ┌─────────────────┴───────────────┐
                    │        API Gateway              │
                    │    • Authentication             │
                    │    • Rate Limiting              │
                    │    • Load Balancing             │
                    └─────────────────┬───────────────┘
                                      │
        ┌─────────────────┬───────────┼──────────┬─────────────────┐
        │                 │           │          │                 │
   ┌────▼─────┐    ┌─────▼─────┐ ┌───▼────┐ ┌──▼────┐    ┌──────▼──────┐
   │ GenAI    │    │ Charting  │ │Trading │ │ User  │    │   External  │
   │ Service  │    │ Service   │ │Service │ │ Mgmt  │    │   APIs      │
   │          │    │           │ │        │ │       │    │             │
   │• News    │    │• Charts   │ │• Orders│ │• Auth │    │• News APIs  │
   │• AI      │    │• Tech     │ │• Port  │ │• Prefs│    │• Market Data│
   │• PDF     │    │• Alerts   │ │• Risk  │ │• Social│   │• Gemini AI │
   └─────┬────┘    └─────┬─────┘ └───┬────┘ └───┬───┘    └──────┬──────┘
         │               │           │          │               │
         └───────────────┼───────────┼──────────┼───────────────┘
                         │           │          │
                    ┌────▼───────────▼──────────▼────┐
                    │         Data Layer            │
                    │  • PostgreSQL (Primary)       │
                    │  • Redis (Cache)              │
                    │  • MongoDB (Logs)             │
                    │  • S3 (File Storage)          │
                    └───────────────────────────────┘
```

### Microservices Architecture

#### 1. GenAI Service
**Purpose**: Handles news processing and AI-powered analysis
- **Responsibilities**:
  - News aggregation from multiple sources
  - Sentiment analysis processing
  - AI briefing generation via Gemini API
  - PDF document processing
- **Technology Stack**: Python, FastAPI, Celery, NLP libraries
- **Scaling**: Auto-scaling based on API queue length

#### 2. Charting Service
**Purpose**: Real-time market data and technical analysis
- **Responsibilities**:
  - Market data ingestion and processing
  - Technical indicator calculations
  - Support/resistance level detection
  - WebSocket connections for real-time updates
- **Technology Stack**: Node.js, Express, WebSocket, Technical Analysis libraries
- **Scaling**: Horizontal scaling with load balancing

#### 3. Trading Service
**Purpose**: Virtual trading simulation and portfolio management
- **Responsibilities**:
  - Order management and execution simulation
  - Portfolio tracking and P&L calculations
  - Risk assessment and position sizing
  - Performance analytics
- **Technology Stack**: Node.js, TypeScript, Bull Queue
- **Scaling**: Database read replicas for query performance

#### 4. User Management Service
**Purpose**: Authentication, authorization, and user preferences
- **Responsibilities**:
  - User registration and authentication
  - Profile management and preferences
  - Social features (leaderboards, competitions)
  - Subscription and billing management
- **Technology Stack**: Node.js, JWT, OAuth2
- **Scaling**: Stateless design with token-based auth

---

## 🔗 API Specifications

### Authentication
All API endpoints require authentication via JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### GenAI Service APIs

#### GET /api/genai/news
Fetch news articles with sentiment analysis
```json
{
  "symbol": "AAPL",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "relevance_threshold": 70,
  "sources": ["alpha_vantage", "newsapi", "polygon"]
}
```

Response:
```json
{
  "articles": [
    {
      "id": "news_123",
      "headline": "Apple Reports Strong Q4 Earnings",
      "summary": "Apple exceeded expectations...",
      "source": "Reuters",
      "published_at": "2024-01-15T10:30:00Z",
      "relevance_score": 85,
      "sentiment": {
        "classification": "bullish",
        "confidence": 0.87,
        "score": 0.72
      },
      "url": "https://reuters.com/article/123"
    }
  ],
  "total_count": 45,
  "average_sentiment": 0.34
}
```

#### POST /api/genai/briefing
Generate AI-powered market briefing
```json
{
  "symbol": "AAPL",
  "news_ids": ["news_123", "news_124", "news_125"],
  "analysis_type": "comprehensive"
}
```

Response:
```json
{
  "briefing": {
    "market_sentiment": "bullish",
    "confidence_level": "high",
    "key_catalysts": [
      "Strong Q4 earnings beat expectations",
      "iPhone 15 sales exceeding forecasts",
      "Services revenue growth acceleration"
    ],
    "risk_factors": [
      "Supply chain disruptions in China",
      "Competitive pressure in smartphone market"
    ],
    "price_target_analysis": "Current technical levels suggest...",
    "generated_at": "2024-01-15T11:00:00Z"
  }
}
```

### Charting Service APIs

#### GET /api/charts/data
Fetch historical price data
```json
{
  "symbol": "AAPL",
  "interval": "1min",
  "range": "1day",
  "indicators": ["sma_20", "rsi_14", "macd"]
}
```

Response:
```json
{
  "symbol": "AAPL",
  "data": [
    {
      "timestamp": "2024-01-15T09:30:00Z",
      "open": 185.50,
      "high": 186.25,
      "low": 185.10,
      "close": 185.95,
      "volume": 1250000,
      "indicators": {
        "sma_20": 184.75,
        "rsi_14": 62.3,
        "macd": {
          "macd": 1.25,
          "signal": 1.18,
          "histogram": 0.07
        }
      }
    }
  ],
  "market_status": "open",
  "last_updated": "2024-01-15T09:30:15Z"
}
```

#### GET /api/charts/analysis
Get price analysis and trade setups
```json
{
  "symbol": "AAPL",
  "timeframe": "3weeks",
  "proximity_threshold": 3.0
}
```

Response:
```json
{
  "analysis": {
    "current_price": 185.95,
    "support_levels": [182.50, 180.25, 178.00],
    "resistance_levels": [188.75, 192.30, 195.80],
    "trade_setups": [
      {
        "type": "bounce_buy",
        "trigger_price": 182.50,
        "confidence": 0.78,
        "proximity": 1.9,
        "description": "Price approaching key support level"
      }
    ]
  }
}
```

### Trading Service APIs

#### POST /api/trading/orders
Place a new order
```json
{
  "symbol": "AAPL",
  "side": "buy",
  "type": "limit",
  "quantity": 100,
  "price": 185.50,
  "stop_loss": 180.00,
  "take_profit": 195.00,
  "time_in_force": "GTC"
}
```

Response:
```json
{
  "order": {
    "id": "order_123",
    "status": "pending",
    "filled_quantity": 0,
    "remaining_quantity": 100,
    "average_price": null,
    "created_at": "2024-01-15T10:45:00Z",
    "updated_at": "2024-01-15T10:45:00Z"
  }
}
```

#### GET /api/trading/portfolio
Get portfolio summary
```json
{
  "portfolio": {
    "total_value": 105750.25,
    "cash_balance": 25750.25,
    "invested_amount": 80000.00,
    "total_pnl": 5750.25,
    "daily_pnl": 250.75,
    "positions": [
      {
        "symbol": "AAPL",
        "quantity": 100,
        "average_cost": 180.00,
        "current_price": 185.95,
        "market_value": 18595.00,
        "unrealized_pnl": 595.00,
        "pnl_percentage": 3.31
      }
    ],
    "performance_metrics": {
      "sharpe_ratio": 1.45,
      "max_drawdown": -2.15,
      "win_rate": 0.68,
      "total_trades": 25
    }
  }
}
```

---

## 💾 Data Models

### User Model
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### News Article Model
```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    headline TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source VARCHAR(100) NOT NULL,
    author VARCHAR(255),
    published_at TIMESTAMP NOT NULL,
    url TEXT,
    relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
    sentiment_classification VARCHAR(20) CHECK (sentiment_classification IN ('bullish', 'bearish', 'neutral')),
    sentiment_score DECIMAL(5,4) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    sentiment_confidence DECIMAL(5,4) CHECK (sentiment_confidence >= 0 AND sentiment_confidence <= 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_symbol_published (symbol, published_at DESC),
    INDEX idx_relevance_sentiment (relevance_score, sentiment_classification)
);
```

### Market Data Model
```sql
CREATE TABLE market_data (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    interval VARCHAR(10) NOT NULL, -- '1min', '5min', '1hour', '1day'
    open_price DECIMAL(12,4) NOT NULL,
    high_price DECIMAL(12,4) NOT NULL,
    low_price DECIMAL(12,4) NOT NULL,
    close_price DECIMAL(12,4) NOT NULL,
    volume BIGINT NOT NULL,
    adjusted_close DECIMAL(12,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symbol, timestamp, interval),
    INDEX idx_symbol_timestamp (symbol, timestamp DESC),
    INDEX idx_symbol_interval (symbol, interval, timestamp DESC)
);
```

### Order Model
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    side VARCHAR(4) CHECK (side IN ('buy', 'sell')),
    order_type VARCHAR(20) CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(12,4),
    stop_price DECIMAL(12,4),
    time_in_force VARCHAR(10) DEFAULT 'GTC',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'partially_filled', 'cancelled', 'expired')),
    filled_quantity INTEGER DEFAULT 0,
    average_price DECIMAL(12,4),
    commission DECIMAL(12,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    filled_at TIMESTAMP,
    INDEX idx_user_symbol (user_id, symbol),
    INDEX idx_status_created (status, created_at DESC)
);
```

### Portfolio Position Model
```sql
CREATE TABLE portfolio_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    average_cost DECIMAL(12,4) NOT NULL,
    total_cost DECIMAL(12,4) NOT NULL,
    realized_pnl DECIMAL(12,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, symbol),
    INDEX idx_user_positions (user_id)
);
```

---

## 🚀 Deployment Architecture

### Cloud Infrastructure (AWS)

#### Production Environment
```yaml
# Infrastructure as Code (Terraform)
resource "aws_ecs_cluster" "trading_platform" {
  name = "trading-platform-prod"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_service" "genai_service" {
  name            = "genai-service"
  cluster         = aws_ecs_cluster.trading_platform.id
  task_definition = aws_ecs_task_definition.genai.arn
  desired_count   = 3
  
  load_balancer {
    target_group_arn = aws_lb_target_group.genai.arn
    container_name   = "genai-service"
    container_port   = 8000
  }
  
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
}
```

#### Database Configuration
```yaml
# RDS PostgreSQL Primary
resource "aws_db_instance" "primary" {
  identifier             = "trading-platform-primary"
  engine                 = "postgres"
  engine_version         = "14.9"
  instance_class         = "db.r6g.xlarge"
  allocated_storage      = 500
  max_allocated_storage  = 1000
  storage_encrypted      = true
  
  multi_az               = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"
  
  performance_insights_enabled = true
  monitoring_interval         = 60
}

# Read Replicas for Query Performance
resource "aws_db_instance" "read_replica" {
  count                   = 2
  identifier              = "trading-platform-replica-${count.index + 1}"
  replicate_source_db     = aws_db_instance.primary.id
  instance_class          = "db.r6g.large"
  publicly_accessible     = false
  auto_minor_version_upgrade = false
}
```

#### Redis Cache Configuration
```yaml
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "trading-platform-cache"
  description                = "Redis cache for trading platform"
  
  node_type                  = "cache.r6g.large"
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  num_cache_clusters         = 3
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}
```

### Container Orchestration

#### Docker Compose (Development)
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - api-gateway

  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/trading_platform
    depends_on:
      - postgres
      - redis

  genai-service:
    build: ./services/genai
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEWS_API_KEY=${NEWS_API_KEY}
    depends_on:
      - postgres
      - redis

  charting-service:
    build: ./services/charting
    environment:
      - MARKET_DATA_API_KEY=${MARKET_DATA_API_KEY}
    depends_on:
      - postgres

  trading-service:
    build: ./services/trading
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=trading_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          npm install
          npm run test:coverage
          npm run lint
          npm run security-audit

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Push Docker Images
        run: |
          docker build -t trading-platform/genai:${{ github.sha }} ./services/genai
          docker push trading-platform/genai:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster trading-platform-prod \
            --service genai-service \
            --task-definition genai:${{ github.sha }}
```

### Monitoring & Observability

#### Application Monitoring
```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'trading-platform'
    static_configs:
      - targets: ['localhost:8000', 'localhost:8001', 'localhost:8002']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

#### Logging Configuration
```yaml
# Fluentd Configuration
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>

<match trading-platform.**>
  @type elasticsearch
  host elasticsearch
  port 9200
  index_name trading-platform
  type_name logs
  logstash_format true
</match>
```

### Security Configuration

#### API Gateway Security
```yaml
# Rate Limiting
rate_limit:
  requests_per_minute: 1000
  burst_size: 100
  
# CORS Configuration
cors:
  allowed_origins:
    - "https://tradingplatform.com"
    - "https://app.tradingplatform.com"
  allowed_methods: ["GET", "POST", "PUT", "DELETE"]
  allowed_headers: ["Authorization", "Content-Type"]

# JWT Configuration
jwt:
  secret_key: ${JWT_SECRET}
  expiration: 24h
  refresh_expiration: 7d
```

#### Database Security
```sql
-- Create application user with limited privileges
CREATE USER trading_app WITH PASSWORD 'secure_password';

-- Grant specific permissions
GRANT CONNECT ON DATABASE trading_platform TO trading_app;
GRANT USAGE ON SCHEMA public TO trading_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO trading_app;

-- Enable row-level security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_orders ON orders FOR ALL TO trading_app USING (user_id = current_user_id());
```