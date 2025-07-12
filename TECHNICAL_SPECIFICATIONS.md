# Risk Sense AI - Technical Specifications

## Software Architecture Overview

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 18+ | User Interface |
| **Language** | TypeScript | 5.6+ | Type Safety |
| **Build Tool** | Vite | 5.x | Development & Build |
| **Backend** | Express.js | 4.x | API Server |
| **Runtime** | Node.js | 18+ | Server Environment |
| **AI Model** | Mistral AI | mistral-small-3.1-24b-instruct | Analysis Engine |
| **UI Framework** | Tailwind CSS | 3.x | Styling |
| **Components** | Radix UI + shadcn/ui | Latest | Component Library |

## Data Sources & APIs

### External APIs Integration

#### 1. World Bank Open Data
```
Source: World Bank Open Data (data.worldbank.org)
Endpoint: https://api.worldbank.org/v2
Authentication: None required
Rate Limit: No enforced limits
Data Format: JSON
Coverage: 217 countries, 1,400+ indicators
Update Frequency: Annual/Quarterly
```

**Key Indicators Used:**
- `NY.GDP.MKTP.CD` - GDP (current US$)
- `NY.GDP.MKTP.KD.ZG` - GDP growth (annual %)
- `SP.POP.TOTL` - Population, total
- `SL.UEM.TOTL.ZS` - Unemployment, total (% of labor force)
- `NY.GDP.PCAP.CD` - GDP per capita (current US$)

#### 2. News API
```
Endpoint: https://newsapi.org/v2
Authentication: API Key required
Rate Limit: 500 requests/day (free tier)
Data Format: JSON
Coverage: 80,000+ news sources
Update Frequency: Real-time
```

**Parameters Used:**
- `country` - ISO country code
- `category` - Business, technology, general
- `sortBy` - Relevancy, popularity, publishedAt
- `language` - en (English)

#### 3. OpenRouter API (Mistral AI)
```
Endpoint: https://openrouter.ai/api/v1
Authentication: API Key required
Rate Limit: Pay-per-use
Model: mistralai/mistral-small-3.1-24b-instruct
Parameters: 24 billion
Context Window: 32,768 tokens
```

**Model Capabilities:**
- Text analysis and summarization
- Strategic reasoning and recommendations
- Risk assessment and scoring
- JSON-structured responses
- Multi-language support

### Local Datasets

#### CDP Climate Data
```
File: cdp_data.json
Size: ~500KB
Records: 2,000+ renewable energy targets
Coverage: Global cities and organizations
Fields: target_type, target_year, metric_value, organization_name
Update: Manual (annual CDP reports)
```

#### Credit Ratings Database
```
Implementation: creditRatingsData.ts
Source: Standard & Poor's (S&P) Global Ratings via Wikipedia
Reference: List of countries by credit rating
Coverage: 150+ countries
Agencies: S&P Global Ratings methodology
Format: Rating string + outlook + date
```

#### Natural Disaster Risk Index
```
Implementation: disasterRiskData.ts
Source: World Risk Index (WRI) via Wikipedia
Reference: List of countries by natural disaster risk
Coverage: 193 countries
Metrics: WRI rank, exposure score, vulnerability score
Update: Annual research publication
```

## AI Model Implementation

### Mistral AI Integration Architecture

```
User Query → Data Aggregation → AI Processing → Response Generation
    ↓              ↓               ↓              ↓
Country Selection → API Calls → Prompt Engineering → Structured Output
    ↓              ↓               ↓              ↓
Context Building → Parallel Fetch → AI Analysis → User Interface
```

### Prompt Engineering Strategy

#### Analysis Prompt Template
```typescript
const analysisPrompt = `
Analyze the following economic and news data for ${countryName}:

ECONOMIC DATA:
${economicData}

NEWS SUMMARY:
${newsData}

USER QUERY: ${userQuery}

Provide analysis in this JSON format:
{
  "analysis": "comprehensive analysis text",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "riskFactors": ["risk1", "risk2"],
  "opportunities": ["opp1", "opp2"],
  "recommendations": ["rec1", "rec2"],
  "followUpQuestions": [
    {"question": "relevant follow-up question"}
  ]
}
`;
```

#### P3 Strategy Prompt
```typescript
const p3Prompt = `
Based on the analysis for ${countryName}, provide P3 strategy recommendations:

PREDICT: Future trends and scenarios
PREVENT: Risk mitigation strategies  
PROTECT: Asset protection measures

Format as JSON with predict, prevent, protect keys.
`;
```

### AI Response Processing

#### JSON Parsing Strategy
```typescript
// Multiple parsing strategies for robust response handling
1. Direct JSON.parse() attempt
2. Extract JSON blocks with regex
3. Clean and retry parsing
4. Fallback to structured text parsing
5. Error handling with fallback responses
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── AppLayout.tsx
│   ├── AppHeader.tsx
│   ├── LeftNavigation.tsx
│   └── [Page Content]
├── Home.tsx (Risk Sense)
│   ├── QueryForm.tsx
│   ├── LoadingState.tsx
│   ├── ErrorState.tsx
│   ├── TabNavigation.tsx
│   └── [Tab Components]
│       ├── OverviewTab.tsx
│       ├── EconomicTab.tsx
│       ├── NewsTab.tsx
│       ├── AITab.tsx
│       ├── ClimateTab.tsx
│       ├── P3Tab.tsx
│       ├── RiskTab.tsx
│       └── RiskRatingTab.tsx
└── NIBRecommendations.tsx
    ├── NIBOverview.tsx
    ├── AIRecommendations.tsx
    └── RecommendationCard.tsx
```

### State Management

#### React Query Implementation
```typescript
// Global query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});

// Query keys structure
const QUERY_KEYS = {
  countries: ['countries'],
  analysis: (countryCode: string, query: string) => ['analysis', countryCode, query],
  gdpGrowth: (countryCode: string) => ['gdp-growth', countryCode],
  unemployment: (countryCode: string) => ['unemployment', countryCode],
  nibRecommendations: ['nib-recommendations']
};
```

#### Form Management
```typescript
// Zod validation schemas
const analysisRequestSchema = z.object({
  countryCode: z.string().min(2).max(3),
  query: z.string().min(1).max(500)
});

// React Hook Form integration
const form = useForm<AnalysisRequest>({
  resolver: zodResolver(analysisRequestSchema),
  defaultValues: {
    countryCode: '',
    query: ''
  }
});
```

### UI Component System

#### Design Tokens
```typescript
// Theme configuration (theme.json)
{
  "primary": "#1e40af",     // Blue-600
  "variant": "professional",
  "appearance": "light",
  "radius": 8
}

// Tailwind CSS custom colors
colors: {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
  destructive: "hsl(var(--destructive))"
}
```

#### Component Patterns
```typescript
// Consistent component structure
interface ComponentProps {
  className?: string;
  children?: ReactNode;
  // Component-specific props
}

// Using class-variance-authority for variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent"
      }
    }
  }
);
```

## Backend Architecture

### API Route Structure

```
/api
├── /countries              GET - List all countries
├── /analyze               POST - Comprehensive analysis
├── /economic
│   ├── /gdp-growth/:code  GET - GDP growth data
│   └── /unemployment/:code GET - Unemployment data
├── /news/:code            GET - News articles
├── /cdp/renewable/:code   GET - CDP climate data
├── /p3/:code              POST - P3 strategy analysis
├── /projects/:code        GET - Project risk analysis
└── /nib/recommendations   GET - NIB AI recommendations
```

### Service Layer Architecture

#### Modular Service Design
```typescript
// Service interface pattern
export interface DataService {
  getData(params: any): Promise<any>;
  getCachedData?(key: string): Promise<any>;
  setCachedData?(key: string, data: any): Promise<void>;
}

// Implementation example
export class WorldBankService implements DataService {
  private baseUrl = 'https://api.worldbank.org/v2';
  
  async getCountries(): Promise<CountryOption[]> {
    // Implementation with error handling and caching
  }
}
```

#### Error Handling Middleware
```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`${req.method} ${req.path} - ${status}: ${message}`);
  
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### Caching Strategy

#### Memory Cache Implementation
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  set<T>(key: string, data: T, ttl: number = 900000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
}
```

## Data Processing Logic

### Economic Data Processing

#### GDP Growth Calculation
```typescript
// Multi-year data fetching with fallback
async function getGDPGrowthData(countryCode: string) {
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const promises = years.map(year => 
    fetchGDPData(countryCode, year).catch(() => null)
  );
  
  const results = await Promise.all(promises);
  return results.filter(Boolean).slice(0, 5); // Latest 5 years
}
```

#### Data Normalization
```typescript
// Standardize data formats across sources
function normalizeEconomicData(rawData: any[]): EconomicIndicator[] {
  return rawData.map(item => ({
    indicator: item.indicator?.value || 'Unknown',
    value: formatValue(item.value),
    year: item.date,
    change: calculateChange(item.value, previousValue),
    globalRank: calculateRank(item.value, globalData)
  }));
}
```

### News Sentiment Analysis

#### Sentiment Scoring Algorithm
```typescript
// AI-powered sentiment analysis
async function analyzeNewsSentiment(articles: NewsItem[]): Promise<NewsSentiment> {
  const sentimentPrompt = `
  Analyze the sentiment of these news headlines and descriptions:
  ${articles.map(a => `${a.title}: ${a.description}`).join('\n')}
  
  Return JSON: {
    "positive": 0.0-1.0,
    "negative": 0.0-1.0, 
    "neutral": 0.0-1.0,
    "summary": "brief analysis"
  }
  `;
  
  // Process with Mistral AI and parse response
}
```

#### News Impact Scoring
```typescript
// Weight news impact by source credibility and recency
function calculateNewsImpact(articles: NewsItem[]): number {
  return articles.reduce((total, article) => {
    const sourceWeight = getSourceCredibility(article.source);
    const recencyWeight = getRecencyWeight(article.date);
    const sentimentWeight = getSentimentWeight(article.description);
    
    return total + (sourceWeight * recencyWeight * sentimentWeight);
  }, 0) / articles.length;
}
```

## Security Implementation

### API Key Management

#### Environment Variable Loading
```typescript
// Secure environment configuration
import 'dotenv/config';

const requiredEnvVars = ['NEWS_API_KEY', 'OPENROUTER_API_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

#### Request Validation
```typescript
// Zod schema validation
const validateRequest = (schema: z.ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }
  };
```

### Rate Limiting Strategy

#### API Rate Limiting
```typescript
// Implement rate limiting for external APIs
class RateLimiter {
  private requests = new Map<string, number[]>();
  
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}
```

## Performance Optimization

### Frontend Optimization

#### Code Splitting
```typescript
// Lazy loading for route components
const NIBRecommendations = lazy(() => import('./pages/NIBRecommendations'));
const Home = lazy(() => import('./pages/Home'));

// Wrap with Suspense
<Suspense fallback={<LoadingState isVisible={true} />}>
  <Routes>
    <Route path="/" component={Home} />
    <Route path="/nib" component={NIBRecommendations} />
  </Routes>
</Suspense>
```

#### Image Optimization
```typescript
// Responsive image loading
<img 
  src={imageSrc}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={altText}
/>
```

### Backend Optimization

#### Parallel API Calls
```typescript
// Concurrent data fetching
async function fetchAnalysisData(countryCode: string, query: string) {
  const [
    countryData,
    newsArticles,
    economicData,
    climateData
  ] = await Promise.all([
    worldBankService.getCountryData(countryCode),
    newsService.getNewsArticles(countryCode, query),
    worldBankService.getEconomicIndicators(countryCode),
    cdpService.getClimateData(countryCode)
  ]);
  
  return { countryData, newsArticles, economicData, climateData };
}
```

#### Response Compression
```typescript
// Enable gzip compression
import compression from 'compression';
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6
}));
```

## Deployment Configuration

### Docker Configuration

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage  
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### Docker Compose Setup
```yaml
version: '3.8'
services:
  risk-sense-ai:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - NEWS_API_KEY=${NEWS_API_KEY}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/countries"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Production Environment

#### Environment Variables
```bash
# Required for production
NODE_ENV=production
PORT=5000
NEWS_API_KEY=your_news_api_key
OPENROUTER_API_KEY=your_openrouter_key

# Optional optimizations
ENABLE_COMPRESSION=true
CACHE_TTL=900000
MAX_REQUEST_SIZE=10mb
```

#### Process Management
```typescript
// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

## Testing Strategy

### Unit Testing Framework
```typescript
// Jest configuration for TypeScript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};
```

### API Testing
```typescript
// Example API test
describe('Analysis API', () => {
  test('should return analysis for valid country', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({
        countryCode: 'US',
        query: 'Economic outlook'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('analysis');
  });
});
```

## Monitoring and Logging

### Application Logging
```typescript
// Structured logging implementation
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

### Performance Monitoring
```typescript
// Request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration
    });
  });
  
  next();
});
```

---

*This technical specification provides comprehensive coverage of the Risk Sense AI application architecture, implementation details, and deployment considerations.*