import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .cache_service import get_cached_data, set_cached_data
import json
import random

# Initialize Mistral AI client
mistral_api_key = os.environ.get('MISTRAL_API_KEY')
mistral_client = MistralClient(api_key=mistral_api_key)

# Use the specified model
MISTRAL_MODEL = "mistral-small-3.1-24b-instruct:free"

# Project status constants
PROJECT_STATUS = {
    "FUNDED": "funded",
    "ON_HOLD": "on_hold",
    "PROPOSED": "proposed"
}

# Risk level constants
RISK_LEVEL = {
    "LOW": "low",
    "MEDIUM": "medium",
    "HIGH": "high",
    "CRITICAL": "critical"
}

# Project sectors
PROJECT_SECTORS = [
    "energy",
    "infrastructure",
    "agriculture",
    "technology",
    "healthcare",
    "education",
    "water",
    "finance"
]

# Sample projects for each country
# In a real application, this would come from a database
SAMPLE_PROJECTS = {
    "default": [
        {
            "id": "p1",
            "name": "Renewable Energy Grid Integration",
            "description": "Upgrading the national grid to support higher penetration of renewable energy sources",
            "status": PROJECT_STATUS["FUNDED"],
            "sector": "energy",
            "budget": 120,
            "startDate": "2023-06-15",
            "expectedEndDate": "2025-12-31",
            "currentRisk": RISK_LEVEL["MEDIUM"],
            "riskFactors": ["Regulatory changes", "Technology integration challenges"],
            "impactAnalysis": "This project is critical for meeting the country's climate goals."
        },
        {
            "id": "p2",
            "name": "Rural Broadband Expansion",
            "description": "Expanding high-speed internet access to rural communities",
            "status": PROJECT_STATUS["ON_HOLD"],
            "sector": "technology",
            "budget": 85,
            "startDate": "2023-03-01",
            "expectedEndDate": "2024-12-31",
            "currentRisk": RISK_LEVEL["HIGH"],
            "riskFactors": ["Funding constraints", "Geographic challenges"],
            "impactAnalysis": "This project would reduce the digital divide and support remote work opportunities."
        },
        {
            "id": "p3",
            "name": "Sustainable Agriculture Initiative",
            "description": "Supporting farmers in adopting sustainable farming practices",
            "status": PROJECT_STATUS["PROPOSED"],
            "sector": "agriculture",
            "budget": 45,
            "startDate": "2024-01-15",
            "expectedEndDate": "2026-01-15",
            "currentRisk": RISK_LEVEL["LOW"],
            "riskFactors": ["Weather variability", "Adoption barriers"],
            "impactAnalysis": "This project could significantly reduce agricultural emissions while maintaining productivity."
        }
    ]
}

def get_projects_risk_analysis(country_code, query):
    """
    Get projects with risk analysis for a specific country
    
    Args:
        country_code: ISO country code
        query: User query
        
    Returns:
        List of projects with risk analysis
    """
    cache_key = f"projects_{country_code}_{query}"
    cached_data = get_cached_data(cache_key, 3600)  # Cache for 1 hour
    
    if cached_data:
        return cached_data
    
    try:
        # Get projects for the country (or default if not available)
        projects = SAMPLE_PROJECTS.get(country_code, SAMPLE_PROJECTS["default"])
        
        # Clone the projects to avoid modifying the original data
        projects_copy = json.loads(json.dumps(projects))
        
        # Update projects with AI risk analysis based on the query
        enhanced_projects = enhance_projects_with_ai(projects_copy, country_code, query)
        
        # Cache the result
        set_cached_data(cache_key, enhanced_projects, 3600)  # Cache for 1 hour
        
        return enhanced_projects
    except Exception as e:
        print(f"Error getting projects risk analysis: {str(e)}")
        return []

def enhance_projects_with_ai(projects, country_code, query):
    """
    Enhance projects with AI-generated risk analysis
    
    Args:
        projects: List of projects
        country_code: ISO country code
        query: User query
        
    Returns:
        Enhanced projects with AI-generated risk analysis
    """
    try:
        # Prepare context for AI
        context = f"Country: {country_code}\nQuery: {query}\n\nProjects:\n"
        
        for project in projects:
            context += f"- {project['name']} ({project['sector']}): {project['description']}\n"
        
        # Prepare the prompt
        prompt = f"""
You are an expert risk analyst for investment projects. Based on the following information:

{context}

For each project mentioned, analyze potential risks and provide:
1. An updated risk level (low, medium, high, or critical)
2. Key risk factors specific to each project (3-5 factors)
3. A brief impact analysis

Format your response as JSON with an array of objects, one for each project, with these fields:
1. "name": The project name
2. "currentRisk": The risk level as a string ("low", "medium", "high", or "critical")
3. "previousRisk": The original risk level (set this to the same as currentRisk for now)
4. "riskFactors": An array of strings with specific risk factors
5. "impactAnalysis": A one-paragraph analysis of the project's impact and risk profile

Ensure your response is valid JSON.
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
            # Try to extract and parse JSON
            # Look for JSON content
            json_start = response_content.find('{')
            json_end = response_content.rfind('}')
            
            if json_start >= 0 and json_end > json_start:
                json_content = response_content[json_start:json_end+1]
                ai_analysis = json.loads(json_content)
                
                # If AI returned an array directly
                if isinstance(ai_analysis, list):
                    ai_projects = ai_analysis
                # If AI wrapped the array in an object
                elif isinstance(ai_analysis, dict) and any(key in ai_analysis for key in ['projects', 'analysis', 'results']):
                    for key in ['projects', 'analysis', 'results']:
                        if key in ai_analysis and isinstance(ai_analysis[key], list):
                            ai_projects = ai_analysis[key]
                            break
                    else:
                        # Couldn't find an array, use first value if it's a dict with projects
                        first_key = next(iter(ai_analysis))
                        if isinstance(ai_analysis[first_key], list):
                            ai_projects = ai_analysis[first_key]
                        else:
                            raise ValueError("Could not find project array in AI response")
                else:
                    raise ValueError("Unexpected AI response format")
                
                # Update projects with AI analysis
                for i, project in enumerate(projects):
                    if i < len(ai_projects):
                        ai_project = ai_projects[i]
                        
                        # Store the previous risk level
                        project['previousRisk'] = project['currentRisk']
                        
                        # Update with AI analysis if available
                        if 'currentRisk' in ai_project and ai_project['currentRisk'] in RISK_LEVEL.values():
                            project['currentRisk'] = ai_project['currentRisk']
                        
                        if 'riskFactors' in ai_project and isinstance(ai_project['riskFactors'], list):
                            project['riskFactors'] = ai_project['riskFactors']
                        
                        if 'impactAnalysis' in ai_project:
                            project['impactAnalysis'] = ai_project['impactAnalysis']
                
                return projects
            else:
                raise ValueError("Could not find JSON content in AI response")
        except Exception as e:
            print(f"Error parsing AI response: {str(e)}")
            print(f"AI response: {response_content}")
            
            # Fallback: update projects with random risk changes
            return update_projects_risk(projects)
    except Exception as e:
        print(f"Error enhancing projects with AI: {str(e)}")
        
        # Fallback: update projects with random risk changes
        return update_projects_risk(projects)

def update_projects_risk(projects):
    """
    Update projects with random risk changes (fallback method)
    
    Args:
        projects: List of projects
        
    Returns:
        Updated projects with risk changes
    """
    risk_levels = list(RISK_LEVEL.values())
    
    for project in projects:
        # Store the previous risk level
        project['previousRisk'] = project['currentRisk']
        
        # Randomly adjust risk level
        current_index = risk_levels.index(project['currentRisk'])
        
        # 30% chance of risk level change
        if random.random() < 0.3:
            # 50% chance of increase, 50% chance of decrease
            if random.random() < 0.5 and current_index < len(risk_levels) - 1:
                # Increase risk level
                project['currentRisk'] = risk_levels[current_index + 1]
            elif current_index > 0:
                # Decrease risk level
                project['currentRisk'] = risk_levels[current_index - 1]
    
    return projects