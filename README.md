# Risk Sense AI - Smart Investment Analysis

![Risk Sense AI](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green)

An advanced global investment insights platform leveraging intelligent data aggregation, real-time AI analysis, and interactive visualization technologies to provide comprehensive economic intelligence.

## 🚀 Features

### P3 Framework (Predict, Prevent, Protect)
- **Predict**: AI-powered economic forecasting and trend analysis
- **Prevent**: Risk identification and mitigation strategies  
- **Protect**: Investment protection recommendations

### Multi-Source Intelligence
- Real-time economic data from World Bank API
- AI-enhanced analysis using Mistral AI via OpenRouter
- News sentiment analysis for market context
- Environmental and climate risk assessment
- Credit ratings and natural disaster risk data

### Interactive Visualizations
- Economic indicator charts (GDP, unemployment, inflation)
- Comparative analysis dashboards
- Risk assessment matrices
- Investment opportunity mapping

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **Shadcn/UI** for styling
- **TanStack Query** for data fetching
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend
- **Node.js 20** with Express.js
- **TypeScript** for type safety
- **In-memory storage** for development
- **RESTful API** architecture

### APIs & Data Sources
- **World Bank API** - Economic indicators
- **News API** - Real-time news analysis
- **OpenRouter API** - Mistral AI integration
- **CDP** - Climate data
- **Wikipedia** - Credit ratings & disaster risk data

## 📋 Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **API Keys** (see Environment Setup)

## 🔧 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/risk-sense-ai.git
   cd risk-sense-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   NEWS_API_KEY=your_news_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:5000](http://localhost:5000)

### Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   docker-compose up -d
   ```

2. **Using Docker directly**
   ```bash
   docker build -t risk-sense-ai .
   docker run -p 5000:5000 --env-file .env risk-sense-ai
   ```

## 🔑 API Keys Setup

### Required API Keys

1. **News API**
   - Visit [newsapi.org](https://newsapi.org/)
   - Sign up for free account
   - Get your API key

2. **OpenRouter API**
   - Visit [openrouter.ai](https://openrouter.ai/)
   - Create account and get API key
   - Used for Mistral AI model access

## 📚 Usage

1. **Select a country** from the dropdown
2. **Enter your investment query** (e.g., "renewable energy", "economic outlook")
3. **Explore analysis results** across multiple tabs:
   - **Overview**: GDP, credit ratings, disaster risk
   - **Economic**: Detailed economic indicators
   - **News**: Sentiment analysis of recent news
   - **AI Insights**: AI-generated investment analysis
   - **P3 Strategy**: Predict/Prevent/Protect recommendations
   - **Risk Ratings**: Company risk assessments
   - **Risk Scenarios**: Project risk analysis

## 🏗️ Project Structure

```
risk-sense-ai/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── lib/               # Utilities and data
│   │   └── hooks/             # Custom React hooks
├── server/                    # Backend Express application
│   ├── routes.ts              # API endpoints
│   ├── index.ts               # Server configuration
│   └── services/              # Business logic services
├── shared/                    # Shared type definitions
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker orchestration
└── Techreferencestack.md      # Technical documentation
```

## 🚢 Deployment

### Cloud Platforms
- **Vercel** (Recommended for Node.js)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS ECS** (using Docker)
- **Google Cloud Run** (using Docker)

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
NEWS_API_KEY=your_api_key
OPENROUTER_API_KEY=your_api_key
```

## 📖 Documentation

- [Technical Reference Stack](./Techreferencestack.md) - Complete technical documentation
- [API Documentation](#api-endpoints) - Backend API reference

## 🔗 API Endpoints

- `GET /api/countries` - List of available countries
- `POST /api/analyze` - Main analysis endpoint
- `GET /api/economic/gdp-growth/:countryCode` - GDP growth data
- `GET /api/economic/unemployment/:countryCode` - Unemployment data
- `GET /api/nib/recommendations` - Investment recommendations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **World Bank** for economic data
- **News API** for news content
- **OpenRouter** for AI model access
- **Mistral AI** for intelligent analysis
- **Wikipedia** for reference data
- **Carbon Disclosure Project** for climate data

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Risk Sense AI** - Where Machines Think, and Humans Lead the Charge