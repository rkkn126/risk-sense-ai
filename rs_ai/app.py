#!/usr/bin/env python
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import services
from backend.services.world_bank_service import get_countries, get_gdp_growth_data, get_unemployment_data, get_country_comparison
from backend.services.news_service import get_news_articles, analyze_news_sentiment
from backend.services.mistral_service import get_mistral_insights, get_p3_recommendations
from backend.services.cdp_service import get_cdp_renewable_data
from backend.services.project_service import get_projects_risk_analysis
from backend.services.nib_service import get_nib_recommendations

# Initialize Flask app
app = Flask(__name__, static_folder='frontend/static')
CORS(app)

# API Routes
@app.route('/api/countries', methods=['GET'])
def countries():
    try:
        result = get_countries()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analysis', methods=['POST'])
def analysis():
    try:
        data = request.json
        country_code = data.get('countryCode')
        query = data.get('query')
        
        # Placeholder for the full analysis response
        # In a real application, you would process this data and return the results
        result = {
            'countryCode': country_code,
            'query': query,
            'overview': {
                'population': '10.4 million',
                'populationYear': '2023',
                'gdp': '450 billion USD',
                'gdpPerCapita': '43,000 USD',
                'government': 'Parliamentary Democracy',
                'summary': [
                    'Strong economy with focus on innovation',
                    'High level of education and research',
                    'Export-oriented industrial sector'
                ]
            },
            'economic': {
                'indicators': [
                    {
                        'indicator': 'GDP Growth',
                        'value': '2.8%',
                        'year': '2023',
                        'change': {
                            'value': '0.5%',
                            'direction': 'up'
                        },
                        'globalRank': '45'
                    },
                    {
                        'indicator': 'Inflation',
                        'value': '3.1%',
                        'year': '2023',
                        'change': {
                            'value': '0.2%',
                            'direction': 'down'
                        }
                    },
                    {
                        'indicator': 'Unemployment',
                        'value': '5.2%',
                        'year': '2023',
                        'change': {
                            'value': '0.8%',
                            'direction': 'down'
                        },
                        'globalRank': '38'
                    }
                ]
            },
            'news': {
                'articles': [],
                'sentiment': {
                    'neutral': 60,
                    'positive': 25,
                    'negative': 15,
                    'summary': 'Overall neutral to positive sentiment in recent news coverage'
                }
            },
            'aiInsights': {
                'analysis': 'Based on the economic indicators and news sentiment, this country presents a moderate investment opportunity with reasonable risks.',
                'followUpQuestions': [
                    {'question': 'What sectors are showing the strongest growth?'},
                    {'question': 'How has the regulatory environment changed in the past year?'},
                    {'question': 'What is the projected GDP growth for next year?'}
                ]
            }
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/gdp/<country_code>', methods=['GET'])
def gdp_growth(country_code):
    try:
        result = get_gdp_growth_data(country_code)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/unemployment/<country_code>', methods=['GET'])
def unemployment(country_code):
    try:
        result = get_unemployment_data(country_code)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/comparison/<country_code>', methods=['GET'])
def country_comparison(country_code):
    try:
        indicator = request.args.get('indicator', 'gdp')
        result = get_country_comparison(country_code, indicator)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/question', methods=['POST'])
def follow_up_question():
    try:
        data = request.json
        country_code = data.get('countryCode')
        question = data.get('question')
        
        # In a real application, you would process this question with an AI model
        # and return a response
        response = "This is a placeholder response for your question about " + question
        
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cdp/<country_code>', methods=['GET'])
def cdp_data(country_code):
    try:
        result = get_cdp_renewable_data(country_code)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/p3/<country_code>', methods=['GET'])
def p3_strategy(country_code):
    try:
        query = request.args.get('query', '')
        result = get_p3_recommendations(country_code, query)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<country_code>', methods=['GET'])
def projects(country_code):
    try:
        query = request.args.get('query', '')
        result = get_projects_risk_analysis(country_code, query)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/nib', methods=['GET'])
def nib_recommendations():
    try:
        result = get_nib_recommendations()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)