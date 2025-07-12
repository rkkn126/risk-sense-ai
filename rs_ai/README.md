# RS_AI - Risk Sense AI

A Python-based application that provides comprehensive investment analysis through intelligent data aggregation and advanced visualization technologies.

## Features

- AI-powered analysis of countries, markets, and investment opportunities
- Economic data visualization from World Bank sources
- News sentiment analysis
- Climate risk assessment
- P3 (Predict, Prevent, Protect) strategic framework
- Project risk scenarios analysis
- Company risk ratings with AI adjustment
- Smart Recommendations for the Nordic Investment Bank (NIB)

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (with Bootstrap and Chart.js)
- **AI Services**: 
  - Mistral AI for intelligent recommendations generation
  - OpenRouter API for flexible AI model access

## Setup Instructions

1. Clone the repository
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the project root with the following environment variables:
   ```
   NEWS_API_KEY=your_news_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Run the application:
   ```
   python run.py
   ```
5. Open your browser at `http://localhost:5000` (should open automatically)

## API Keys

The application requires the following API keys:

- **News API**: Register at https://newsapi.org
- **Mistral AI**: Register at https://console.mistral.ai
- **OpenRouter API**: Register at https://openrouter.ai

## Usage

1. Select a country from the dropdown
2. Enter an investment query or topic
3. Click "Analyze" to generate insights
4. Navigate through the different tabs to explore various aspects of the analysis
5. Use the left navigation to switch between Risk Sense AI and Smart Recommendations

## License

This project is for demonstration purposes only.