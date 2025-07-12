import os
import json
from .cache_service import get_cached_data, set_cached_data

# In a production environment, this would come from a database or a real API
# For this example, we'll load from a JSON file
CDP_DATA_PATH = "cdp_data.json"

def get_cdp_renewable_data(country_code):
    """
    Get CDP renewable energy targets for a specific country
    
    Args:
        country_code: ISO country code
        
    Returns:
        CDP renewable energy data
    """
    cache_key = f"cdp_renewable_{country_code}"
    cached_data = get_cached_data(cache_key, 86400)  # Cache for 24 hours
    
    if cached_data:
        return cached_data
    
    try:
        # Get country name from code
        country_name = get_country_name_from_code(country_code)
        if not country_name:
            return {
                "hasData": False,
                "message": f"No CDP data available for country code {country_code}"
            }
        
        # Load CDP data
        cdp_data = load_cdp_data()
        
        # Filter data for the specific country
        country_data = [item for item in cdp_data if item.get("country", "").lower() == country_name.lower()]
        
        if not country_data:
            return {
                "hasData": False,
                "message": f"No CDP data available for {country_name}"
            }
        
        # Extract city list
        city_list = sorted(list(set([item.get("city", "") for item in country_data if item.get("city")])))
        
        # Calculate metrics
        total_targets = len(country_data)
        cities_with_targets = len(city_list)
        target_years = [int(item.get("target_year", 0)) for item in country_data if item.get("target_year", "").isdigit()]
        average_target_year = sum(target_years) / len(target_years) if target_years else 0
        
        # Extract renewable percentages
        renewable_percentages = []
        for item in country_data:
            percentage = item.get("percentage_of_total_energy", "")
            if percentage and percentage.replace(".", "", 1).isdigit():
                renewable_percentages.append(float(percentage))
        
        average_renewable_percentage = sum(renewable_percentages) / len(renewable_percentages) if renewable_percentages else 0
        
        # Extract target types
        target_types = list(set([item.get("target_type", "") for item in country_data if item.get("target_type")]))
        
        # Prepare response
        response = {
            "hasData": True,
            "countryName": country_name,
            "citiesWithTargets": cities_with_targets,
            "cityList": city_list[:10],  # Limit to 10 cities
            "totalTargets": total_targets,
            "averageTargetYear": round(average_target_year) if average_target_year else None,
            "averageRenewablePercentage": round(average_renewable_percentage, 1) if average_renewable_percentage else None,
            "targetTypes": target_types
        }
        
        # Cache the result
        set_cached_data(cache_key, response, 86400)  # Cache for 24 hours
        
        return response
    except Exception as e:
        print(f"Error getting CDP renewable data: {str(e)}")
        return {
            "hasData": False,
            "message": f"Error processing CDP data: {str(e)}"
        }

def load_cdp_data():
    """
    Load CDP data from file
    
    Returns:
        List of CDP data items
    """
    try:
        if os.path.exists(CDP_DATA_PATH):
            with open(CDP_DATA_PATH, 'r') as f:
                return json.load(f)
        else:
            # Fallback to sample data
            return []
    except Exception as e:
        print(f"Error loading CDP data: {str(e)}")
        return []

def get_country_name_from_code(country_code):
    """
    Map ISO country codes to full country names used in CDP data
    
    Args:
        country_code: ISO country code
        
    Returns:
        Country name or None if not found
    """
    # Map of common country codes to names
    country_map = {
        'USA': 'United States',
        'GBR': 'United Kingdom',
        'DEU': 'Germany',
        'FRA': 'France',
        'JPN': 'Japan',
        'CHN': 'China',
        'IND': 'India',
        'BRA': 'Brazil',
        'CAN': 'Canada',
        'AUS': 'Australia',
        'RUS': 'Russia',
        'KOR': 'South Korea',
        'ITA': 'Italy',
        'ESP': 'Spain',
        'MEX': 'Mexico',
        # Add more mappings as needed
    }
    
    return country_map.get(country_code)