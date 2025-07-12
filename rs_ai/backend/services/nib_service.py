import os
import json
import requests
from datetime import datetime
from .cache_service import get_cached_data, set_cached_data

# Initialize OpenRouter client
openrouter_api_key = os.environ.get('OPENROUTER_API_KEY')

# Use the specified model
MODEL = "mistralai/mistral-small-3.1-24b-instruct:free"

def get_nib_recommendations():
    """
    Get NIB recommendations
    
    Returns:
        NIB recommendations
    """
    cache_key = "nib_recommendations"
    cached_data = get_cached_data(cache_key, 7200)  # Cache for 2 hours
    
    if cached_data:
        return cached_data
    
    try:
        # Get basic NIB info
        basic_info = get_nib_basic_info()
        
        # Get AI recommendations
        sustainable_recommendation = generate_ai_recommendation(
            "Sustainable Finance",
            """Generate an AI investment recommendation for sustainable finance projects in Nordic and Baltic regions.
            Focus on green finance, renewable energy, and sustainable infrastructure projects."""
        )
        
        infrastructure_recommendation = generate_ai_recommendation(
            "Infrastructure Development",
            """Generate an AI investment recommendation for infrastructure development projects in Nordic and Baltic regions.
            Focus on transportation, energy networks, and digital infrastructure."""
        )
        
        innovation_recommendation = generate_ai_recommendation(
            "Innovation Finance",
            """Generate an AI investment recommendation for innovation finance projects in Nordic and Baltic regions.
            Focus on technology startups, research and development, and digital transformation."""
        )
        
        # Combine into final result
        result = {
            "basic": basic_info,
            "aiRecommendations": {
                "sustainable": sustainable_recommendation,
                "infrastructure": infrastructure_recommendation,
                "innovation": innovation_recommendation
            },
            "analysisDate": datetime.now().strftime("%Y-%m-%d"),
            "modelDisclaimer": f"Recommendations generated using {MODEL}. These are AI-generated suggestions for informational purposes only and should not be considered financial advice."
        }
        
        # Cache the result
        set_cached_data(cache_key, result, 7200)  # Cache for 2 hours
        
        return result
    except Exception as e:
        print(f"Error getting NIB recommendations: {str(e)}")
        return create_fallback_nib_recommendations()

def get_nib_basic_info():
    """
    Get basic NIB information
    
    Returns:
        Basic NIB information
    """
    return {
        "yearInBrief": {
            "title": "Nordic Investment Bank - Year in Brief",
            "description": "The Nordic Investment Bank (NIB) is an international financial institution owned by eight member countries: Denmark, Estonia, Finland, Iceland, Latvia, Lithuania, Norway and Sweden. NIB finances private and public projects in and outside the member countries.",
            "keyHighlights": [
                {
                    "title": "Loans Disbursed",
                    "value": "EUR 4.2 billion",
                    "description": "Total amount of loans disbursed in the previous year",
                    "sourceUrl": "https://www.nib.int/financial-report"
                },
                {
                    "title": "New Agreements Signed",
                    "value": "39",
                    "description": "Number of new loan agreements signed",
                    "sourceUrl": "https://www.nib.int/loans/agreed-loans"
                },
                {
                    "title": "Green Bond Issuance",
                    "value": "EUR 1.5 billion",
                    "description": "Total green bonds issued",
                    "sourceUrl": "https://www.nib.int/investors/funding/funding-programmes"
                }
            ],
            "factSheets": [
                {
                    "title": "Impact Report",
                    "description": "Annual impact report focusing on climate and society impacts",
                    "link": "https://www.nib.int/releases/nib-s-annual-impact-report-2023-addressing-climate-change-and-supporting-sustainable-growth"
                },
                {
                    "title": "Financial Report",
                    "description": "Annual financial report with key performance indicators",
                    "link": "https://www.nib.int/financial-report"
                },
                {
                    "title": "Sustainability Policy",
                    "description": "NIB's approach to sustainable financing",
                    "link": "https://www.nib.int/sustainability"
                }
            ]
        },
        "quickLinks": [
            {
                "title": "Loan Products",
                "icon": "currency-dollar",
                "description": "Explore our loan products and services",
                "link": "https://www.nib.int/loans"
            },
            {
                "title": "Investment Criteria",
                "icon": "check-circle",
                "description": "Learn about our investment criteria and focus areas",
                "link": "https://www.nib.int/loans/loan-products"
            },
            {
                "title": "Application Process",
                "icon": "file-text",
                "description": "Step-by-step guide to the loan application process",
                "link": "https://www.nib.int/loans/how-to-borrow"
            },
            {
                "title": "Sustainable Investments",
                "icon": "leaf",
                "description": "Our approach to sustainable financing",
                "link": "https://www.nib.int/sustainability"
            }
        ]
    }

def generate_ai_recommendation(sector, prompt):
    """
    Generate AI recommendation for a specific sector
    
    Args:
        sector: Investment sector
        prompt: Prompt for the AI model
        
    Returns:
        AI recommendation
    """
    try:
        # Enhance the prompt
        full_prompt = f"""
You are an investment advisor for the Nordic Investment Bank. Your task is to provide a detailed
investment recommendation for {sector} in the Nordic and Baltic regions.

{prompt}

Format your response as a valid JSON object with the following fields:
1. "title": A concise, specific project title (e.g., "Green Hydrogen Production in Denmark")
2. "description": A one-sentence project description
3. "industry": The specific industry within {sector}
4. "riskLevel": Risk assessment ("Low", "Medium", or "High")
5. "opportunityLevel": Opportunity assessment ("Low", "Medium", or "High")
6. "analysis": A detailed 120-150 word analysis of market conditions, risks, and opportunities
7. "keyRecommendation": A specific, actionable investment recommendation including suggested amount

The response should be a valid JSON object containing only these fields.
"""
        
        headers = {
            "Authorization": f"Bearer {openrouter_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": MODEL,
            "messages": [
                {"role": "user", "content": full_prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            response_data = response.json()
            content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            try:
                # Parse as JSON
                recommendation = json.loads(content)
                
                # Validate required fields
                required_fields = ["title", "description", "industry", "riskLevel", "opportunityLevel", "analysis", "keyRecommendation"]
                for field in required_fields:
                    if field not in recommendation:
                        recommendation[field] = f"Missing {field}"
                
                return recommendation
            except json.JSONDecodeError:
                print(f"Invalid JSON from AI: {content}")
                return create_fallback_recommendation(sector)
        else:
            print(f"Error from OpenRouter API: {response.status_code} - {response.text}")
            return create_fallback_recommendation(sector)
    except Exception as e:
        print(f"Error generating AI recommendation: {str(e)}")
        return create_fallback_recommendation(sector)

def create_fallback_recommendation(sector):
    """
    Create fallback recommendation if AI fails
    
    Args:
        sector: Investment sector
        
    Returns:
        Fallback recommendation
    """
    sector_titles = {
        "Sustainable Finance": "Green Energy Investment Fund",
        "Infrastructure Development": "Urban Transportation Modernization",
        "Innovation Finance": "Digital Healthcare Initiative"
    }
    
    return {
        "title": sector_titles.get(sector, f"{sector} Initiative"),
        "description": f"A strategic investment in {sector} across Nordic and Baltic regions",
        "industry": sector,
        "riskLevel": "Medium",
        "opportunityLevel": "High",
        "analysis": f"The {sector} sector in Nordic and Baltic countries presents significant growth opportunities due to supportive government policies, strong institutional frameworks, and innovative business environment. While there are challenges related to market competition and regulatory complexity, the long-term outlook remains positive due to increasing demand for sustainable solutions and digital transformation.",
        "keyRecommendation": f"Invest 20-25% of portfolio in {sector} projects with focus on cross-border collaborations and public-private partnerships."
    }

def create_fallback_nib_recommendations():
    """
    Create fallback NIB recommendations if the entire process fails
    
    Returns:
        Fallback NIB recommendations
    """
    return {
        "basic": get_nib_basic_info(),
        "aiRecommendations": {
            "sustainable": create_fallback_recommendation("Sustainable Finance"),
            "infrastructure": create_fallback_recommendation("Infrastructure Development"),
            "innovation": create_fallback_recommendation("Innovation Finance")
        },
        "analysisDate": datetime.now().strftime("%Y-%m-%d"),
        "modelDisclaimer": f"Recommendations generated using {MODEL}. These are AI-generated suggestions for informational purposes only and should not be considered financial advice."
    }