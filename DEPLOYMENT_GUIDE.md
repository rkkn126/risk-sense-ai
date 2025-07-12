# Risk Sense AI - Complete Deployment Guide

## Package Contents

This package contains everything needed to deploy Risk Sense AI privately:

### Core Application Files
- **Frontend**: React TypeScript application (`client/`)
- **Backend**: Node.js Express API server (`server/`)
- **Python Replica**: Alternative Python implementation (`rs_ai/`)
- **Shared**: Common types and schemas (`shared/`)

### Configuration Files
- `package.json` - Node.js dependencies
- `vite.config.ts` - Frontend build configuration
- `tailwind.config.ts` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database configuration

### Docker Deployment
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-service deployment
- `.dockerignore` - Build optimization

### Environment Setup
- `.env.example` - Environment template
- `replit.nix` - Nix package configuration

### Documentation
- `README.md` - Project overview and setup
- `CONTRIBUTING.md` - Development guidelines
- `CHANGELOG.md` - Version history
- `LICENSE` - MIT license
- `Techreferencestack.md` - Technical specifications

## Required API Keys

### 1. News API
- **Website**: https://newsapi.org/
- **Free Tier**: 500 requests/day
- **Variable**: `NEWS_API_KEY`

### 2. OpenRouter API (Mistral AI)
- **Website**: https://openrouter.ai/
- **Pay-per-use**: ~$0.001-0.01 per request
- **Variable**: `OPENROUTER_API_KEY`

### 3. No API Key Required
- **World Bank API**: Free economic data
- **CDP Data**: Local climate dataset

## Deployment Options

### Option 1: Node.js Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. **Build Container**
   ```bash
   docker build -t risk-sense-ai .
   ```

2. **Run with Environment**
   ```bash
   docker run -p 5000:5000 \
     -e NEWS_API_KEY=your_key \
   -e OPENROUTER_API_KEY=your_key \
     risk-sense-ai
   ```

3. **Or Use Docker Compose**
   ```bash
   docker-compose up
   ```

### Option 3: Python Alternative

1. **Install Python Dependencies**
   ```bash
   cd rs_ai
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**
   ```bash
   export NEWS_API_KEY=your_key
   export OPENROUTER_API_KEY=your_key
   ```

3. **Run Python Server**
   ```bash
   python app.py
   ```

## Cloud Hosting Platforms

### Recommended Platforms
- **Railway**: Simple deployment with Git integration
- **Render**: Free tier available, automatic HTTPS
- **DigitalOcean**: App Platform with scaling options
- **AWS**: EC2 or Elastic Beanstalk
- **Google Cloud**: Cloud Run for containers
- **Azure**: Container Instances

### Environment Variables for Cloud
```
NEWS_API_KEY=your_news_api_key
OPENROUTER_API_KEY=your_openrouter_key
NODE_ENV=production
PORT=5000
```

## Features Included

### Data Sources
- **World Bank API**: Real-time economic indicators
- **News API**: Current news analysis and sentiment
- **OpenRouter/Mistral AI**: Intelligent insights and recommendations
- **CDP Dataset**: Climate and environmental data
- **Credit Ratings**: Country risk assessments
- **Disaster Risk Data**: Natural disaster risk metrics

### User Interface
- **Responsive Design**: Mobile, tablet, desktop optimized
- **Interactive Charts**: Economic data visualization
- **Multi-tab Analysis**: Organized insights across categories
- **AI Recommendations**: Smart investment strategies
- **Export Features**: PDF and image generation

### Technical Features
- **TypeScript**: Type-safe development
- **React Query**: Efficient data fetching
- **Tailwind CSS**: Modern styling
- **Express.js**: Robust API server
- **Docker Ready**: Containerized deployment
- **Production Optimized**: Built for scaling

## Security Considerations

- **API Keys**: Store securely in environment variables
- **HTTPS**: Enable SSL/TLS in production
- **Rate Limiting**: Consider API usage limits
- **CORS**: Configure for your domain
- **Error Handling**: Comprehensive error responses

## Support and Maintenance

- **Updates**: Regular dependency updates recommended
- **Monitoring**: Log API usage and errors
- **Scaling**: Horizontal scaling supported
- **Backup**: Regular backup of configuration

## License

MIT License - See LICENSE file for details.

## Version Information

- **Current Version**: 1.0.0
- **Node.js**: 18+ required
- **Docker**: Optional but recommended
- **Python**: 3.8+ for alternative implementation

For technical support or questions, refer to the documentation files included in this package.