# Risk Sense AI - Complete User Manual

## Table of Contents
1. [Application Overview](#application-overview)
2. [User Interface Guide](#user-interface-guide)
3. [Features and Functionality](#features-and-functionality)
4. [Data Sources](#data-sources)
5. [AI Models and Logic](#ai-models-and-logic)
6. [Technical Architecture](#technical-architecture)
7. [Software Components](#software-components)
8. [UI Design System](#ui-design-system)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)

---

## Application Overview

Risk Sense AI is an advanced global investment insights platform that provides comprehensive economic intelligence through AI-powered analysis, real-time data aggregation, and interactive visualizations.

### Core Purpose
- **Investment Analysis**: AI-driven country risk assessments
- **Economic Intelligence**: Real-time economic indicators and trends
- **News Impact Analysis**: Sentiment analysis of current events
- **Climate Risk Assessment**: Environmental factors in investment decisions
- **Strategic Recommendations**: AI-generated investment strategies

### Target Users
- Investment professionals
- Financial analysts
- Risk managers
- Economic researchers
- Government policy makers

---

## User Interface Guide

### Main Navigation
The application features a two-panel layout:

**Left Navigation Panel:**
- **Risk Sense**: Main analysis dashboard
- **Smart Recommendations - NIB**: AI-powered investment insights

**Main Content Area:**
- Country selection dropdown
- Query input field
- Multi-tab analysis results

### How to Use the Application

#### Step 1: Select Country
1. Click the country dropdown
2. Search or scroll to find your target country
3. Select from 200+ available countries

#### Step 2: Enter Query
1. Type your analysis question in the query field
2. Examples:
   - "Renewable energy investment opportunities"
   - "Economic outlook and risks"
   - "Infrastructure development potential"
   - "Climate change impact assessment"

#### Step 3: View Results
Analysis results are organized across multiple tabs:

**Overview Tab:**
- Country basic information
- Population and GDP data
- Government structure
- Economic summary

**Economic Tab:**
- GDP growth charts
- Unemployment trends
- Inflation data
- Comparative regional analysis

**News Tab:**
- Recent news articles
- Sentiment analysis
- Impact scoring
- Source diversity

**AI Analysis Tab:**
- Comprehensive AI insights
- Risk assessments
- Investment recommendations
- Follow-up questions

**Climate Tab:**
- CDP renewable energy data
- Environmental targets
- Climate risk metrics
- Sustainability indicators

**P3 Strategy Tab:**
- Predict: Future trend analysis
- Prevent: Risk mitigation strategies
- Protect: Asset protection recommendations

**Risk Assessment Tab:**
- Project risk analysis
- Investment scenarios
- Risk level classifications
- Mitigation strategies

**Risk Rating Tab:**
- Credit ratings
- Disaster risk rankings
- Country stability metrics
- Comparative risk analysis

---

## Features and Functionality

### Core Features

#### 1. Real-Time Economic Data
- **Source**: World Bank API
- **Coverage**: 200+ countries
- **Indicators**: GDP, unemployment, inflation, trade
- **Visualization**: Interactive charts and graphs

#### 2. News Analysis
- **Source**: News API
- **Processing**: AI sentiment analysis
- **Coverage**: Global news sources
- **Features**: Impact scoring, trend identification

#### 3. AI-Powered Insights
- **Model**: Mistral AI via OpenRouter
- **Capabilities**: Strategic analysis, risk assessment
- **Output**: Structured recommendations with reasoning

#### 4. Climate Intelligence
- **Source**: Carbon Disclosure Project (CDP)
- **Data**: Renewable energy targets, environmental commitments
- **Analysis**: Climate risk integration

#### 5. Interactive Visualizations
- **Charts**: GDP trends, unemployment data
- **Maps**: Risk heat maps
- **Comparisons**: Regional benchmarking

#### 6. Export Capabilities
- **PDF Reports**: Complete analysis export
- **Chart Images**: Individual visualization export
- **Data Export**: Raw data download

### Advanced Features

#### Multi-Language Support
- Interface available in multiple languages
- News analysis in regional languages
- Localized data formatting

#### Responsive Design
- Mobile-optimized interface
- Tablet-friendly layouts
- Desktop full-feature experience

#### Real-Time Updates
- Live data refresh
- Dynamic content updates
- Automatic cache management

---

## Data Sources

### Primary Data Sources

#### 1. World Bank Open Data
- **Source**: World Bank Open Data (data.worldbank.org)
- **Type**: Economic indicators
- **Access**: Public, no API key required
- **Coverage**: Global economic data for 200+ countries
- **Update Frequency**: Annual/Quarterly
- **Data Points**: GDP, population, trade, development indicators

#### 2. News API
- **Type**: Current events and news
- **Access**: API key required (newsapi.org)
- **Coverage**: Global news sources
- **Update Frequency**: Real-time
- **Data Points**: Headlines, content, source, publication date

#### 3. OpenRouter/Mistral AI
- **Type**: AI analysis and insights
- **Access**: API key required (openrouter.ai)
- **Model**: mistralai/mistral-small-3.1-24b-instruct
- **Capabilities**: Text analysis, strategic recommendations

#### 4. Carbon Disclosure Project (CDP)
- **Type**: Climate and environmental data
- **Access**: Local dataset (cdp_data.json)
- **Coverage**: Renewable energy targets
- **Update Frequency**: Annual updates

### Static Datasets

#### Credit Ratings Database
- **Source**: Standard & Poor's (S&P) Global Ratings via Wikipedia
- **Reference**: List of countries by credit rating
- **Coverage**: Country credit ratings for 150+ countries
- **Agencies**: S&P Global Ratings methodology
- **Update**: Manual updates required from Wikipedia sources

#### Natural Disaster Risk Index
- **Source**: World Risk Index (WRI) via Wikipedia
- **Reference**: List of countries by natural disaster risk
- **Coverage**: Natural disaster risk rankings for 193 countries
- **Metrics**: WRI rank, exposure score, vulnerability score
- **Update**: Annual research updates from official WRI publications

---

## AI Models and Logic

### Mistral AI Integration

#### Model Specifications
- **Name**: mistral-small-3.1-24b-instruct
- **Parameters**: 24 billion
- **Capabilities**: 
  - Text analysis and summarization
  - Strategic reasoning
  - Risk assessment
  - Recommendation generation

#### Analysis Logic Flow

**Step 1: Data Aggregation**
```
User Query → Parallel API Calls → Data Collection
├── Economic Data (World Bank)
├── News Articles (News API)
├── Climate Data (CDP)
└── Historical Context
```

**Step 2: AI Processing**
```
Aggregated Data → Mistral AI → Structured Analysis
├── Risk Assessment
├── Opportunity Identification
├── Strategic Recommendations
└── Follow-up Questions
```

**Step 3: Response Generation**
```
AI Analysis → Formatting → User Interface
├── Overview Summary
├── Detailed Insights
├── Visual Elements
└── Actionable Recommendations
```

### Sentiment Analysis Logic

#### News Sentiment Processing
1. **Article Collection**: Gather recent news by country/topic
2. **Content Analysis**: Extract key themes and sentiment indicators
3. **Scoring Algorithm**: 
   - Positive sentiment: 0-1 scale
   - Negative sentiment: 0-1 scale
   - Neutral sentiment: Remainder
4. **Impact Assessment**: Weight by source credibility and recency

#### Economic Impact Integration
- **Market Indicators**: GDP growth correlation
- **Political Stability**: Government confidence metrics
- **Investment Climate**: Foreign investment trends

### P3 Strategy Framework

#### Predict Component
- **Trend Analysis**: Historical data pattern recognition
- **Forecasting**: Economic projection models
- **Scenario Planning**: Multiple outcome possibilities

#### Prevent Component
- **Risk Identification**: Potential threat assessment
- **Mitigation Strategies**: Preventive measure recommendations
- **Early Warning Systems**: Monitoring frameworks

#### Protect Component
- **Asset Protection**: Investment safeguarding strategies
- **Diversification**: Risk distribution recommendations
- **Insurance Strategies**: Risk transfer mechanisms

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
├─────────────────────────────────────────────────────────┤
│                  API Gateway (Express)                  │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                         │
│  ┌─────────────┬─────────────┬─────────────┬──────────┐  │
│  │World Bank   │News Service │AI Service   │CDP Service│  │
│  │Service      │             │             │          │  │
│  └─────────────┴─────────────┴─────────────┴──────────┘  │
├─────────────────────────────────────────────────────────┤
│                  External APIs                          │
│  ┌─────────────┬─────────────┬─────────────┬──────────┐  │
│  │World Bank   │News API     │OpenRouter   │Local Data│  │
│  │API          │             │(Mistral AI) │Files     │  │
│  └─────────────┴─────────────┴─────────────┴──────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Input → Frontend → API Routes → Services → External APIs
    ↓           ↓          ↓          ↓           ↓
Query Processing → Validation → Data Fetching → AI Analysis
    ↓
Response Aggregation → Formatting → Caching → User Interface
```

### Caching Strategy

#### Memory Cache Implementation
- **Location**: `server/services/cacheService.ts`
- **TTL**: 15 minutes for API responses
- **Strategy**: LRU (Least Recently Used)
- **Benefits**: Reduced API calls, improved response times

#### Cache Keys Structure
```
country_analysis_{countryCode}_{queryHash}
gdp_growth_{countryCode}
unemployment_{countryCode}
news_sentiment_{countryCode}_{topic}
ai_recommendations_{sector}_{date}
```

---

## Software Components

### Frontend Stack

#### React Framework
- **Version**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter (lightweight routing)

#### UI Component Library
- **Base**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui component system
- **Icons**: Lucide React icons

#### State Management
- **API State**: TanStack Query (React Query)
- **Local State**: React hooks (useState, useEffect)
- **Form State**: React Hook Form with Zod validation

#### Data Visualization
- **Charts**: Recharts library
- **Chart Types**: Line charts, bar charts, area charts
- **Responsive**: Mobile-optimized visualizations

### Backend Stack

#### Server Framework
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Module System**: ES Modules

#### Data Processing
- **HTTP Client**: node-fetch
- **Validation**: Zod schemas
- **Error Handling**: Comprehensive error middleware

#### Development Tools
- **TypeScript Compiler**: TSC
- **Runtime**: TSX (TypeScript execution)
- **Build Tool**: ESBuild
- **Process Manager**: PM2 (production)

### Database and Storage

#### In-Memory Storage
- **Implementation**: MemStorage class
- **Interface**: IStorage abstraction
- **Data Types**: Users, analyses, countries
- **Persistence**: Session-based (no permanent storage)

#### Schema Management
- **ORM**: Drizzle ORM
- **Schema**: Shared TypeScript types
- **Validation**: Zod integration
- **Migration**: Drizzle Kit

### API Integration Layer

#### Service Architecture
```
┌─────────────────────────────────────────────────────┐
│                 Service Layer                       │
├─────────────────────────────────────────────────────┤
│ worldBankService.ts  │ newsService.ts              │
│ mistralService.ts    │ cdpService.ts               │
│ nibService.ts        │ projectService.ts           │
│ cacheService.ts      │ openRouterService.ts        │
└─────────────────────────────────────────────────────┘
```

#### Error Handling Strategy
- **Retry Logic**: Automatic retry for transient failures
- **Fallback Data**: Graceful degradation
- **Error Logging**: Comprehensive error tracking
- **User Feedback**: Clear error messages

---

## UI Design System

### Design Philosophy

#### Principles
- **Clarity**: Clear information hierarchy
- **Efficiency**: Quick access to insights
- **Responsiveness**: Multi-device compatibility
- **Accessibility**: WCAG compliant design

#### Color Scheme
- **Primary**: Blue (#1e40af) - Trust and professionalism
- **Secondary**: Gray scale - Neutral backgrounds
- **Accent**: Green (#10b981) - Positive indicators
- **Warning**: Orange (#f59e0b) - Caution indicators
- **Error**: Red (#ef4444) - Risk indicators

### Layout System

#### Grid Structure
- **Desktop**: 12-column grid system
- **Tablet**: 8-column responsive grid
- **Mobile**: Single column with stacking

#### Navigation Design
- **Left Sidebar**: Primary navigation
- **Top Header**: Application branding
- **Breadcrumbs**: Current location context
- **Tab Navigation**: Content organization

### Component Design

#### Interactive Elements
- **Buttons**: Rounded corners, hover states
- **Forms**: Clean input fields with validation
- **Dropdowns**: Searchable country selection
- **Cards**: Content containers with shadows

#### Data Visualization
- **Charts**: Consistent color schemes
- **Tables**: Sortable and filterable
- **Metrics**: Large number displays
- **Progress**: Loading and completion states

### Responsive Design

#### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

#### Mobile Optimizations
- **Touch Targets**: Minimum 44px tap areas
- **Scrolling**: Smooth scroll behavior
- **Navigation**: Collapsible mobile menu
- **Content**: Stacked layout priority

---

## API Documentation

### Public Endpoints

#### GET /api/countries
Returns list of available countries for analysis.

**Response Format:**
```json
[
  {
    "code": "US",
    "name": "United States"
  }
]
```

#### POST /api/analyze
Performs comprehensive country analysis.

**Request Format:**
```json
{
  "countryCode": "US",
  "query": "Economic outlook and investment opportunities"
}
```

**Response Format:**
```json
{
  "countryCode": "US",
  "countryName": "United States",
  "overview": {
    "population": "331.9 million",
    "gdp": "$26.9 trillion",
    "government": "Federal Republic"
  },
  "economic": {
    "gdpGrowth": "2.1%",
    "unemployment": "3.7%",
    "inflation": "3.2%"
  },
  "news": {
    "sentiment": {
      "positive": 0.45,
      "negative": 0.25,
      "neutral": 0.30
    },
    "articles": []
  },
  "ai": {
    "analysis": "Comprehensive analysis text...",
    "recommendations": [],
    "followUpQuestions": []
  }
}
```

#### GET /api/economic/gdp-growth/:countryCode
Returns GDP growth data for visualization.

#### GET /api/economic/unemployment/:countryCode
Returns unemployment trend data.

#### GET /api/nib/recommendations
Returns NIB-specific investment recommendations.

### Error Handling

#### Standard Error Response
```json
{
  "message": "Error description",
  "details": "Additional error context",
  "code": "ERROR_CODE"
}
```

#### Common Error Codes
- `COUNTRY_NOT_FOUND`: Invalid country code
- `API_KEY_MISSING`: Required API key not configured
- `RATE_LIMIT_EXCEEDED`: API rate limit reached
- `EXTERNAL_API_ERROR`: Third-party service unavailable

---

## Troubleshooting

### Common Issues

#### API Key Problems
**Symptom**: "API key not configured" error
**Solution**: 
1. Check `.env` file exists
2. Verify API key format
3. Restart application after changes

#### Data Loading Issues
**Symptom**: Empty charts or missing data
**Solution**:
1. Check internet connectivity
2. Verify external API status
3. Clear browser cache

#### Performance Issues
**Symptom**: Slow response times
**Solution**:
1. Check cache service status
2. Monitor API rate limits
3. Optimize query complexity

### Debug Mode

#### Enable Debug Logging
Set environment variable:
```bash
DEBUG=true npm run dev
```

#### Common Debug Commands
```bash
# Check API endpoints
curl http://localhost:5000/api/countries

# Verify environment variables
echo $NEWS_API_KEY

# Check server logs
tail -f server.log
```

### Support Resources

#### Documentation Files
- `README.md` - Quick start guide
- `DEPLOYMENT_GUIDE.md` - Hosting instructions
- `CONTRIBUTING.md` - Development guidelines
- `CHANGELOG.md` - Version history

#### External Documentation
- [World Bank API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [News API](https://newsapi.org/docs)
- [OpenRouter](https://openrouter.ai/docs)
- [Mistral AI](https://docs.mistral.ai/)

---

*This manual covers all aspects of the Risk Sense AI application. For technical support or feature requests, refer to the project repository.*