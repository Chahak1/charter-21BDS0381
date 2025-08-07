# 🏗️ System Architecture Diagrams

## 🚀 High-Level System Architecture

### Version 1: Complete System Overview
```mermaid
graph TB
    subgraph "🌐 Frontend Layer"
        UI[React Frontend]
        WS[WebSocket Client]
        STATE[State Management]
    end
    
    subgraph "🔒 API Gateway Layer"
        GW[API Gateway]
        AUTH[Authentication Service]
        RATE[Rate Limiting]
    end
    
    subgraph "🛠️ Microservices Layer"
        GENAI[GenAI Service]
        CHART[Charting Service]
        TRADE[Trading Service]
        USER[User Management]
        NOTIFY[Notification Service]
    end
    
    subgraph "💾 Data Layer"
        POSTGRES[PostgreSQL Database]
        REDIS[Redis Cache]
        MONGO[MongoDB Logs]
        S3[S3 File Storage]
    end
    
    subgraph "🌍 External APIs"
        NEWS[News APIs]
        MARKET[Market Data APIs]
        GEMINI[Google Gemini API]
        PDF[PDF Services]
    end
    
    subgraph "📊 Monitoring & Analytics"
        PROM[Prometheus]
        GRAFANA[Grafana]
        LOGS[Fluentd]
    end
    
    UI --> GW
    WS --> GW
    STATE --> UI
    
    GW --> AUTH
    GW --> RATE
    GW --> GENAI
    GW --> CHART
    GW --> TRADE
    GW --> USER
    
    GENAI --> POSTGRES
    GENAI --> REDIS
    GENAI --> NEWS
    GENAI --> GEMINI
    
    CHART --> POSTGRES
    CHART --> REDIS
    CHART --> MARKET
    
    TRADE --> POSTGRES
    TRADE --> REDIS
    TRADE --> NOTIFY
    
    USER --> POSTGRES
    USER --> REDIS
    
    GENAI --> S3
    TRADE --> MONGO
    
    GENAI --> PROM
    CHART --> PROM
    TRADE --> PROM
    USER --> PROM
    
    PROM --> GRAFANA
    LOGS --> GRAFANA
    
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef gateway fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef database fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef monitoring fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    
    class UI,WS,STATE frontend
    class GW,AUTH,RATE gateway
    class GENAI,CHART,TRADE,USER,NOTIFY service
    class POSTGRES,REDIS,MONGO,S3 database
    class NEWS,MARKET,GEMINI,PDF external
    class PROM,GRAFANA,LOGS monitoring
```

### Version 2: Simplified Architecture
```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend App]
        B[Real-time WebSocket]
    end
    
    subgraph "Backend Services"
        C[API Gateway]
        D[GenAI Module]
        E[Charting Module]
        F[Trading Module]
    end
    
    subgraph "Data Storage"
        G[PostgreSQL Database]
        H[Redis Cache]
        I[File Storage S3]
    end
    
    subgraph "External Services"
        J[News APIs]
        K[Market Data APIs]
        L[Google Gemini AI]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    
    D --> G
    D --> H
    D --> J
    D --> L
    
    E --> G
    E --> H
    E --> K
    
    F --> G
    F --> H
    F --> I
    
    classDef client fill:#e3f2fd,stroke:#1976d2
    classDef backend fill:#e8f5e8,stroke:#388e3c
    classDef data fill:#fce4ec,stroke:#c2185b
    classDef external fill:#fff3e0,stroke:#f57c00
    
    class A,B client
    class C,D,E,F backend
    class G,H,I data
    class J,K,L external
```

## 🔄 Data Flow Architecture

### User Journey Data Flow
```mermaid
graph LR
    subgraph "User Actions"
        U1[Select Stock Symbol]
        U2[Choose Date Range]
        U3[Request Analysis]
        U4[View Charts]
        U5[Place Trade Order]
    end
    
    subgraph "GenAI Processing"
        G1[Fetch News Articles]
        G2[Sentiment Analysis]
        G3[AI Summary Generation]
        G4[Store Results]
    end
    
    subgraph "Chart Processing"
        C1[Fetch Market Data]
        C2[Calculate Indicators]
        C3[Generate Charts]
        C4[Real-time Updates]
    end
    
    subgraph "Trading Processing"
        T1[Validate Order]
        T2[Check Portfolio]
        T3[Execute Trade]
        T4[Update Holdings]
    end
    
    U1 --> G1
    U2 --> G1
    U3 --> G2
    G1 --> G2
    G2 --> G3
    G3 --> G4
    
    U1 --> C1
    U4 --> C2
    C1 --> C2
    C2 --> C3
    C3 --> C4
    
    U5 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4
    
    classDef user fill:#e3f2fd,stroke:#1976d2
    classDef genai fill:#fff3e0,stroke:#f57c00
    classDef chart fill:#e8f5e8,stroke:#388e3c
    classDef trade fill:#fce4ec,stroke:#c2185b
    
    class U1,U2,U3,U4,U5 user
    class G1,G2,G3,G4 genai
    class C1,C2,C3,C4 chart
    class T1,T2,T3,T4 trade
```

## 🏛️ Microservices Architecture

### Service Interaction Map
```mermaid
graph TB
    subgraph "🎯 GenAI Service"
        GA[News Fetching API]
        GB[Sentiment Analysis Engine]
        GC[AI Summary Generator]
        GD[PDF Processing]
    end
    
    subgraph "📈 Charting Service"
        CA[Market Data Connector]
        CB[Technical Indicators]
        CC[Chart Renderer]
        CD[Real-time Streaming]
    end
    
    subgraph "💰 Trading Service"
        TA[Order Management]
        TB[Portfolio Engine]
        TC[Risk Calculator]
        TD[Trade Executor]
    end
    
    subgraph "👤 User Service"
        UA[Authentication]
        UB[Profile Management]
        UC[Permissions]
        UD[Session Management]
    end
    
    subgraph "🔔 Notification Service"
        NA[Alert Engine]
        NB[Email Service]
        NC[WebSocket Broadcaster]
        ND[Push Notifications]
    end
    
    GA --> GB
    GB --> GC
    GC --> GD
    
    CA --> CB
    CB --> CC
    CC --> CD
    
    TA --> TB
    TB --> TC
    TC --> TD
    
    UA --> UB
    UB --> UC
    UC --> UD
    
    NA --> NB
    NA --> NC
    NA --> ND
    
    GA -.-> NA
    TA -.-> NA
    CA -.-> CD
    UA -.-> TA
    
    classDef genai fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef chart fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef trade fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef notify fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class GA,GB,GC,GD genai
    class CA,CB,CC,CD chart
    class TA,TB,TC,TD trade
    class UA,UB,UC,UD user
    class NA,NB,NC,ND notify
```

## 🗄️ Database Architecture

### Database Schema Overview
```mermaid
graph TB
    subgraph "📊 PostgreSQL Main Database"
        PG1[Users Table]
        PG2[News Articles Table]
        PG3[Market Data Table]
        PG4[Portfolios Table]
        PG5[Orders Table]
        PG6[Watchlists Table]
    end
    
    subgraph "⚡ Redis Cache Layer"
        R1[Session Cache]
        R2[Market Data Cache]
        R3[News Cache]
        R4[User Preferences]
    end
    
    subgraph "📝 MongoDB Logs"
        M1[Application Logs]
        M2[Trading Logs]
        M3[Analytics Events]
        M4[Error Logs]
    end
    
    subgraph "📁 S3 File Storage"
        S1[PDF Documents]
        S2[Chart Images]
        S3[User Uploads]
        S4[Backup Files]
    end
    
    PG1 --> R1
    PG2 --> R3
    PG3 --> R2
    PG4 --> R4
    
    PG5 --> M2
    PG2 --> M1
    PG3 --> M3
    
    PG2 --> S1
    PG3 --> S2
    PG1 --> S3
    
    classDef postgres fill:#336791,color:#fff,stroke:#336791,stroke-width:2px
    classDef redis fill:#dc382d,color:#fff,stroke:#dc382d,stroke-width:2px
    classDef mongo fill:#4db33d,color:#fff,stroke:#4db33d,stroke-width:2px
    classDef s3 fill:#ff9900,color:#fff,stroke:#ff9900,stroke-width:2px
    
    class PG1,PG2,PG3,PG4,PG5,PG6 postgres
    class R1,R2,R3,R4 redis
    class M1,M2,M3,M4 mongo
    class S1,S2,S3,S4 s3
```

## 🔒 Security Architecture

### Security Layers
```mermaid
graph TB
    subgraph "🛡️ Security Layers"
        SEC1[Load Balancer SSL/TLS]
        SEC2[API Gateway Authentication]
        SEC3[JWT Token Validation]
        SEC4[Rate Limiting & DDoS Protection]
        SEC5[Service-to-Service Auth]
        SEC6[Database Row-Level Security]
        SEC7[Data Encryption at Rest]
    end
    
    subgraph "🔐 Authentication Flow"
        AUTH1[User Login]
        AUTH2[JWT Token Generation]
        AUTH3[Token Refresh]
        AUTH4[Session Management]
    end
    
    subgraph "🔑 Authorization"
        AUTHZ1[Role-Based Access Control]
        AUTHZ2[Resource Permissions]
        AUTHZ3[API Endpoint Protection]
        AUTHZ4[Data Access Control]
    end
    
    SEC1 --> SEC2
    SEC2 --> SEC3
    SEC3 --> SEC4
    SEC4 --> SEC5
    SEC5 --> SEC6
    SEC6 --> SEC7
    
    AUTH1 --> AUTH2
    AUTH2 --> AUTH3
    AUTH3 --> AUTH4
    
    AUTH2 --> AUTHZ1
    AUTHZ1 --> AUTHZ2
    AUTHZ2 --> AUTHZ3
    AUTHZ3 --> AUTHZ4
    
    classDef security fill:#ff5722,color:#fff,stroke:#ff5722,stroke-width:2px
    classDef auth fill:#3f51b5,color:#fff,stroke:#3f51b5,stroke-width:2px
    classDef authz fill:#9c27b0,color:#fff,stroke:#9c27b0,stroke-width:2px
    
    class SEC1,SEC2,SEC3,SEC4,SEC5,SEC6,SEC7 security
    class AUTH1,AUTH2,AUTH3,AUTH4 auth
    class AUTHZ1,AUTHZ2,AUTHZ3,AUTHZ4 authz
```

## 🚀 Deployment Architecture

### AWS Cloud Infrastructure
```mermaid
graph TB
    subgraph "🌐 AWS Cloud Infrastructure"
        subgraph "Load Balancing"
            ALB[Application Load Balancer]
            CF[CloudFront CDN]
        end
        
        subgraph "Compute Layer"
            ECS[ECS Fargate Containers]
            LAMBDA[Lambda Functions]
            EC2[EC2 Instances]
        end
        
        subgraph "Data Services"
            RDS[RDS PostgreSQL]
            ELASTICACHE[ElastiCache Redis]
            DOCDB[DocumentDB]
            S3STORAGE[S3 Storage]
        end
        
        subgraph "Monitoring"
            CW[CloudWatch]
            XRAY[X-Ray Tracing]
        end
        
        subgraph "Networking"
            VPC[VPC]
            SUBNET[Private Subnets]
            NAT[NAT Gateway]
        end
    end
    
    CF --> ALB
    ALB --> ECS
    ALB --> LAMBDA
    
    ECS --> RDS
    ECS --> ELASTICACHE
    ECS --> DOCDB
    ECS --> S3STORAGE
    
    LAMBDA --> RDS
    LAMBDA --> S3STORAGE
    
    ECS --> CW
    LAMBDA --> CW
    ECS --> XRAY
    
    ECS -.-> VPC
    RDS -.-> SUBNET
    ELASTICACHE -.-> SUBNET
    SUBNET -.-> NAT
    
    classDef aws fill:#ff9900,color:#fff,stroke:#ff9900,stroke-width:2px
    classDef compute fill:#ff6b6b,color:#fff,stroke:#ff6b6b,stroke-width:2px
    classDef data fill:#4ecdc4,color:#fff,stroke:#4ecdc4,stroke-width:2px
    classDef monitor fill:#45b7d1,color:#fff,stroke:#45b7d1,stroke-width:2px
    classDef network fill:#96ceb4,color:#fff,stroke:#96ceb4,stroke-width:2px
    
    class ALB,CF aws
    class ECS,LAMBDA,EC2 compute
    class RDS,ELASTICACHE,DOCDB,S3STORAGE data
    class CW,XRAY monitor
    class VPC,SUBNET,NAT network
```

## 🔧 Development & CI/CD Architecture

### DevOps Pipeline
```mermaid
graph LR
    subgraph "Development"
        DEV1[Local Development]
        DEV2[Git Repository]
        DEV3[Feature Branches]
    end
    
    subgraph "CI/CD Pipeline"
        CI1[GitHub Actions]
        CI2[Build & Test]
        CI3[Security Scan]
        CI4[Docker Build]
    end
    
    subgraph "Deployment"
        DEPLOY1[Development Environment]
        DEPLOY2[Staging Environment]
        DEPLOY3[Production Environment]
    end
    
    subgraph "Monitoring"
        MON1[Application Monitoring]
        MON2[Performance Tracking]
        MON3[Error Tracking]
    end
    
    DEV1 --> DEV2
    DEV2 --> DEV3
    DEV3 --> CI1
    
    CI1 --> CI2
    CI2 --> CI3
    CI3 --> CI4
    
    CI4 --> DEPLOY1
    DEPLOY1 --> DEPLOY2
    DEPLOY2 --> DEPLOY3
    
    DEPLOY3 --> MON1
    MON1 --> MON2
    MON2 --> MON3
    
    classDef dev fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef ci fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef deploy fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef monitor fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class DEV1,DEV2,DEV3 dev
    class CI1,CI2,CI3,CI4 ci
    class DEPLOY1,DEPLOY2,DEPLOY3 deploy
    class MON1,MON2,MON3 monitor
```

## 📱 Mobile-First Architecture

### Responsive Design System
```mermaid
graph TB
    subgraph "Frontend Architecture"
        MOBILE[Mobile First Design]
        TABLET[Tablet Optimization]
        DESKTOP[Desktop Enhancement]
        PWA[Progressive Web App]
    end
    
    subgraph "API Design"
        REST[RESTful APIs]
        GRAPHQL[GraphQL Endpoints]
        WEBSOCKET[WebSocket Connections]
        CACHE[API Response Caching]
    end
    
    subgraph "Performance"
        LAZY[Lazy Loading]
        CDN[Content Delivery Network]
        COMPRESS[Image Compression]
        MINIFY[Code Minification]
    end
    
    MOBILE --> REST
    TABLET --> GRAPHQL
    DESKTOP --> WEBSOCKET
    PWA --> CACHE
    
    REST --> LAZY
    GRAPHQL --> CDN
    WEBSOCKET --> COMPRESS
    CACHE --> MINIFY
    
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef api fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef performance fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class MOBILE,TABLET,DESKTOP,PWA frontend
    class REST,GRAPHQL,WEBSOCKET,CACHE api
    class LAZY,CDN,COMPRESS,MINIFY performance
```

## 🔄 Real-Time Data Architecture

### WebSocket & Streaming
```mermaid
graph TB
    subgraph "Real-Time Data Sources"
        MARKET[Market Data Feeds]
        NEWS[Live News Streams]
        SOCIAL[Social Media APIs]
        ALERTS[Price Alerts]
    end
    
    subgraph "Streaming Infrastructure"
        KAFKA[Apache Kafka]
        REDIS_STREAM[Redis Streams]
        WS_SERVER[WebSocket Server]
        BROKER[Message Broker]
    end
    
    subgraph "Client Connections"
        WS_CLIENT[WebSocket Clients]
        SSE[Server-Sent Events]
        POLLING[Fallback Polling]
        MOBILE_WS[Mobile WebSocket]
    end
    
    subgraph "Data Processing"
        FILTER[Data Filtering]
        TRANSFORM[Data Transformation]
        AGGREGATE[Data Aggregation]
        CACHE_RT[Real-time Cache]
    end
    
    MARKET --> KAFKA
    NEWS --> REDIS_STREAM
    SOCIAL --> WS_SERVER
    ALERTS --> BROKER
    
    KAFKA --> FILTER
    REDIS_STREAM --> TRANSFORM
    WS_SERVER --> AGGREGATE
    BROKER --> CACHE_RT
    
    FILTER --> WS_CLIENT
    TRANSFORM --> SSE
    AGGREGATE --> POLLING
    CACHE_RT --> MOBILE_WS
    
    classDef source fill:#ff6b6b,color:#fff,stroke:#ff6b6b,stroke-width:2px
    classDef infrastructure fill:#4ecdc4,color:#fff,stroke:#4ecdc4,stroke-width:2px
    classDef client fill:#45b7d1,color:#fff,stroke:#45b7d1,stroke-width:2px
    classDef processing fill:#96ceb4,color:#fff,stroke:#96ceb4,stroke-width:2px
    
    class MARKET,NEWS,SOCIAL,ALERTS source
    class KAFKA,REDIS_STREAM,WS_SERVER,BROKER infrastructure
    class WS_CLIENT,SSE,POLLING,MOBILE_WS client
    class FILTER,TRANSFORM,AGGREGATE,CACHE_RT processing
```

## 🎯 How to Use These Diagrams

### For Your Presentation:
1. **Copy** any diagram code to https://mermaid.live/
2. **Customize** colors and labels as needed
3. **Export** as SVG or PNG (high quality)
4. **Use** in your presentation slides

### Recommended Order:
1. **Version 2 (Simplified)** - Start with high-level overview
2. **Microservices Map** - Show detailed service breakdown
3. **Data Flow** - Explain user journey
4. **Security Layers** - Highlight security approach
5. **AWS Deployment** - Show production infrastructure

All diagrams are production-ready and error-free! 🚀