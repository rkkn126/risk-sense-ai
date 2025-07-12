import os
import json
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .cache_service import get_cached_data, set_cached_data

# Initialize Mistral AI client
mistral_api_key = os.environ.get('MISTRAL_API_KEY')
mistral_client = MistralClient(api_key=mistral_api_key)

# Use the specified model
MISTRAL_MODEL = "mistral-small-3.1-24b-instruct:free"

def get_mistral_insights(country_code, query, news_articles=None, economic_indicators=None):
    """
    Get AI insights about a country based on provided data
    
    Args:
        country_code: ISO country code
        query: User query
        news_articles: News articles data (optional)
        economic_indicators: Economic indicators data (optional)
        
    Returns:
        AI insights
    """
    cache_key = f"ai_insights_{country_code}_{query}"
    cached_data = get_cached_data(cache_key, 3600)  # Cache for 1 hour
    
    if cached_data:
        return cached_data
    
    try:
        # Prepare context data
        context = f"Country: {country_code}\nQuery: {query}\n\n"
        
        # Add economic data if available
        if economic_indicators:
            context += "Economic Indicators:\n"
            for indicator in economic_indicators:
                context += f"- {indicator['indicator']}: {indicator['value']} ({indicator['year']})\n"
            context += "\n"
        
        # Add news data if available
        if news_articles:
            context += "Recent News Headlines:\n"
            for i, article in enumerate(news_articles[:5]):  # Limit to 5 articles
                context += f"- {article['title']} ({article['source']})\n"
            context += "\n"
        
        # Prepare the prompt
        prompt = f"""
You are an expert investment advisor. Based on the following information:

{context}

Provide an analysis of the investment climate and potential opportunities or risks in this country.
Also, suggest 3 follow-up questions an investor might want to ask.

Format your response as JSON with the following structure:
{{
  "analysis": "Your detailed analysis here",
  "followUpQuestions": [
    {{"question": "First follow-up question"}},
    {{"question": "Second follow-up question"}},
    {{"question": "Third follow-up question"}}
  ]
}}
"""
        
        # Call Mistral AI API
        chat_response = mistral_client.chat(
            model=MISTRAL_MODEL,
            messages=[
                ChatMessage(role="user", content=prompt)
            ]
        )
        
        # Parse the response
        response_content = chat_response.choices[0].message.content
        
        try:
            # Try to parse as JSON
            insights = json.loads(response_content)
        except json.JSONDecodeError:
            # Fallback if response is not valid JSON
            insights = {
                "analysis": response_content,
                "followUpQuestions": [
                    {"question": "What sectors are showing the strongest growth?"},
                    {"question": "How has the regulatory environment changed in the past year?"},
                    {"question": "What is the projected GDP growth for next year?"}
                ]
            }
        
        # Cache the result
        set_cached_data(cache_key, insights, 3600)  # Cache for 1 hour
        
        return insights
    except Exception as e:
        print(f"Error getting AI insights: {str(e)}")
        return {
            "analysis": "Unable to generate AI insights at this time.",
            "followUpQuestions": [
                {"question": "What sectors are showing the strongest growth?"},
                {"question": "How has the regulatory environment changed in the past year?"},
                {"question": "What is the projected GDP growth for next year?"}
            ]
        }

def get_p3_recommendations(country_code, query):
    """
    Get P3 (Predict, Prevent, Protect) recommendations
    
    Args:
        country_code: ISO country code
        query: User query
        
    Returns:
        P3 recommendations
    """
    cache_key = f"p3_{country_code}_{query}"
    cached_data = get_cached_data(cache_key, 3600)  # Cache for 1 hour
    
    if cached_data:
        return cached_data
    
    try:
        # Prepare the prompt
        prompt = f"""
You are a strategic risk management expert. For the country {country_code} and the query "{query}", 
provide a comprehensive P3 (Predict, Prevent, Protect) framework analysis.

For each category:
1. PREDICT: Identify potential risks, challenges, or disruptions that may affect investments or operations.
2. PREVENT: Suggest strategies to mitigate identified risks before they materialize.
3. PROTECT: Recommend actions to minimize impact if risks do materialize.

Format your response as JSON with the following structure:
{{
  "predict": "Detailed prediction analysis here, formatted as a paragraph of at least 150 words",
  "prevent": "Detailed prevention strategies here, formatted as a paragraph of at least 150 words",
  "protect": "Detailed protection recommendations here, formatted as a paragraph of at least 150 words"
}}
"""
        
        # Call Mistral AI API
        chat_response = mistral_client.chat(
            model=MISTRAL_MODEL,
            messages=[
                ChatMessage(role="user", content=prompt)
            ]
        )
        
        # Parse the response
        response_content = chat_response.choices[0].message.content
        
        try:
            # Try to parse as JSON
            p3_data = json.loads(response_content)
        except json.JSONDecodeError:
            # If not valid JSON, try to extract sections from text
            predict_section = "Unable to generate prediction analysis."
            prevent_section = "Unable to generate prevention strategies."
            protect_section = "Unable to generate protection recommendations."
            
            # Simple text parsing (will be imperfect but better than nothing)
            if "PREDICT" in response_content:
                predict_start = response_content.find("PREDICT")
                prevent_start = response_content.find("PREVENT")
                if prevent_start > predict_start:
                    predict_section = response_content[predict_start:prevent_start].strip()
                    predict_section = predict_section.replace("PREDICT:", "").strip()
            
            if "PREVENT" in response_content:
                prevent_start = response_content.find("PREVENT")
                protect_start = response_content.find("PROTECT")
                if protect_start > prevent_start:
                    prevent_section = response_content[prevent_start:protect_start].strip()
                    prevent_section = prevent_section.replace("PREVENT:", "").strip()
            
            if "PROTECT" in response_content:
                protect_start = response_content.find("PROTECT")
                protect_section = response_content[protect_start:].strip()
                protect_section = protect_section.replace("PROTECT:", "").strip()
            
            p3_data = {
                "predict": predict_section,
                "prevent": prevent_section,
                "protect": protect_section
            }
        
        # Cache the result
        set_cached_data(cache_key, p3_data, 3600)  # Cache for 1 hour
        
        return p3_data
    except Exception as e:
        print(f"Error getting P3 recommendations: {str(e)}")
        return {
            "predict": "Unable to generate prediction analysis at this time.",
            "prevent": "Unable to generate prevention strategies at this time.",
            "protect": "Unable to generate protection recommendations at this time."
        }