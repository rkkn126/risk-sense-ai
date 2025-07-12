# Risk Sense AI - Technology Reference Stack

## Application Overview
**Risk Sense AI** is an advanced global investment insights platform that leverages intelligent data aggregation, real-time AI analysis, and interactive visualization technologies to provide comprehensive economic intelligence.

## Core Technology Stack

### Frontend Technologies
- **React 18** - Component-based UI framework for building interactive user interfaces
- **TypeScript** - Type-safe JavaScript development with static type checking
- **Vite** - Fast build tool and development server with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/UI** - Modern component library built on Radix UI primitives
- **TanStack Query (React Query)** - Data fetching, caching, and synchronization
- **Wouter** - Lightweight client-side routing (5KB alternative to React Router)
- **Recharts** - Composable charting library built on D3.js
- **Framer Motion** - Production-ready motion library for React animations
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Backend Technologies
- **Node.js 20** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Server-side type safety and development experience
- **TSX** - TypeScript execution environment for Node.js
- **In-Memory Storage** - Development-focused data persistence
- **Node-fetch** - HTTP client for API requests

### Development Tools
- **ESBuild** - Fast JavaScript bundler and minifier
- **PostCSS** - CSS transformation and processing
- **Autoprefixer** - CSS vendor prefix automation
- **Drizzle ORM** - Type-safe SQL ORM (configured but using in-memory storage)

## API Integrations & Data Sources

### Real-Time Data APIs

#### 1. World Bank Open Data
- **Source:** World Bank Open Data (data.worldbank.org)
- **Endpoint:** `https://api.worldbank.org/v2`
- **Purpose:** Economic indicators, GDP, population, unemployment, inflation
- **Implementation:** `server/services/worldBankService.ts`
- **Data Type:** Real-time official economic statistics

#### 2. News API
- **Endpoint:** `https://newsapi.org`
- **Purpose:** Real-time news articles by country and topic
- **Implementation:** `server/services/newsService.ts`
- **Authentication:** `NEWS_API_KEY` environment variable
- **Data Type:** Live news content with sentiment analysis

#### 3. OpenRouter API (Mistral AI)
- **Endpoint:** `https://openrouter.ai/api/v1`
- **Model:** `mistralai/mistral-small-3.1-24b-instruct`
- **Purpose:** AI-powered analysis, insights, and recommendations
- **Implementation:** 
  - `server/services/openRouterService.ts`
  - `server/services/mistralService.ts`
  - `server/services/nibService.ts`
- **Authentication:** `OPENROUTER_API_KEY` environment variable
- **Data Type:** AI-generated investment analysis and strategic recommendations

#### 4. Carbon Disclosure Project (CDP)
- **Purpose:** Climate and environmental sustainability data
- **Implementation:** `server/services/cdpService.ts`
- **Data Source:** `cdp_data.json` (static dataset)
- **Data Type:** Real environmental disclosure data

### Reference Data Sources

#### Wikipedia-Sourced Data
1. **Credit Ratings**
   - **Source:** Standard & Poor's (S&P) Global Ratings via Wikipedia
   - **Reference:** [List of countries by credit rating](https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating)
   - **File:** `client/src/lib/creditRatingsData.ts`
   - **Content:** S&P Global Ratings sovereign credit ratings
   - **Attribution:** Properly attributed with source links in UI

2. **Natural Disaster Risk**
   - **Source:** World Risk Index (WRI) via Wikipedia
   - **Reference:** [List of countries by natural disaster risk](https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk)
   - **File:** `client/src/lib/disasterRiskData.ts`
   - **Content:** World Risk Index (WRI) rankings and scores
   - **Attribution:** Properly attributed with source links in UI

### Locally Created Data

#### Demonstration Data
1. **Project Portfolio Data**
   - **File:** `client/src/lib/projectData.ts`
   - **Purpose:** Sample investment projects for risk analysis demonstration
   - **Content:** Synthetic project data with risk assessments
   - **Status:** Clearly marked as representative examples

2. **Sample Risk Scenarios**
   - **File:** `client/src/lib/sampleRiskData.ts`
   - **Purpose:** Template risk analysis frameworks
   - **Content:** Risk assessment methodologies and scoring systems

## Application Architecture

### File Structure
```
Risk Sense AI/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── AppLayout.tsx        # Main application layout
│   │   │   ├── QueryForm.tsx        # Country/query input form
│   │   │   ├── TabNavigation.tsx    # Tab switching interface
│   │   │   └── tabs/                # Analysis result tabs
│   │   │       ├── OverviewTab.tsx  # GDP, credit ratings, disaster risk
│   │   │       ├── EconomicTab.tsx  # Economic indicators & charts
│   │   │       ├── NewsTab.tsx      # News analysis & sentiment
│   │   │       ├── AIInsightsTab.tsx # AI-generated insights
│   │   │       ├── P3Tab.tsx        # Predict/Prevent/Protect framework
│   │   │       ├── RiskRatingsTab.tsx # Company risk assessments
│   │   │       └── RiskScenariosTab.tsx # Project risk scenarios
│   │   ├── pages/                   # Application pages
│   │   │   ├── Home.tsx             # Main analysis interface
│   │   │   └── NIBRecommendations.tsx # Investment recommendations
│   │   ├── lib/                     # Utilities and data
│   │   │   ├── api.ts               # Frontend API client
│   │   │   ├── types.ts             # TypeScript type definitions
│   │   │   ├── creditRatingsData.ts # S&P credit ratings (Wikipedia)
│   │   │   ├── disasterRiskData.ts  # Natural disaster risk (Wikipedia)
│   │   │   ├── projectData.ts       # Sample investment projects
│   │   │   └── utils.ts             # Utility functions
│   │   └── hooks/                   # Custom React hooks
├── server/                          # Backend Express application
│   ├── routes.ts                    # API endpoint definitions
│   ├── index.ts                     # Express server configuration
│   └── services/                    # Business logic services
│       ├── worldBankService.ts      # World Bank API integration
│       ├── newsService.ts           # News API integration
│       ├── mistralService.ts        # Mistral AI analysis
│       ├── nibService.ts            # NIB investment recommendations
│       ├── cdpService.ts            # Climate data processing
│       ├── openRouterService.ts     # OpenRouter API client
│       ├── projectService.ts        # Project risk analysis
│       └── cacheService.ts          # In-memory caching
├── shared/                          # Shared type definitions
│   └── schema.ts                    # Common data schemas
└── Configuration Files
    ├── package.json                 # Dependencies and scripts
    ├── vite.config.ts              # Build tool configuration
    ├── tailwind.config.ts          # CSS framework configuration
    ├── tsconfig.json               # TypeScript compiler options
    └── drizzle.config.ts           # Database ORM configuration
```

### Data Flow Architecture

1. **User Input** → QueryForm component captures country and analysis topic
2. **API Request** → Frontend sends request to `/api/analyze` endpoint
3. **Parallel Data Fetching:**
   - World Bank API (economic indicators)
   - News API (relevant articles)
   - AI Analysis via OpenRouter (Mistral model)
4. **Data Processing** → Backend services process and format data
5. **Response Caching** → Results cached in memory for performance
6. **Frontend Display** → Tab-based interface with interactive charts

### Key Features

#### P3 Framework (Predict, Prevent, Protect)
- **Predict:** AI-powered economic forecasting and trend analysis
- **Prevent:** Risk identification and mitigation strategies
- **Protect:** Investment protection recommendations

#### Multi-Source Intelligence
- Real-time economic data from authoritative sources
- AI-enhanced analysis and strategic insights
- News sentiment analysis for market context
- Environmental and climate risk assessment

#### Interactive Visualizations
- Economic indicator charts (GDP, unemployment, inflation)
- Comparative analysis dashboards
- Risk assessment matrices
- Investment opportunity mapping

## Environment Configuration

### Required Environment Variables
```bash
NEWS_API_KEY=<Your News API key>
OPENROUTER_API_KEY=<Your OpenRouter API key>
```

### Development Setup
```bash
npm install          # Install dependencies
npm run dev          # Start development server
```

### Production Considerations
- In-memory storage suitable for demonstration
- Real deployment would require persistent database
- API rate limiting considerations for external services
- Caching strategies for performance optimization

## Data Attribution & Transparency

The application maintains strict data integrity by:
- Clearly attributing all external data sources
- Providing direct links to Wikipedia sources in UI tooltips
- Distinguishing between real-time data and reference data
- Marking demonstration content as representative examples
- Ensuring all AI-generated content is clearly labeled

This technology stack provides a robust foundation for delivering intelligent investment analysis while maintaining transparency about data sources and methodologies.