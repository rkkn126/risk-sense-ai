import requests
import json
from .cache_service import get_cached_data, set_cached_data

# Base URL for World Bank API
BASE_URL = "https://api.worldbank.org/v2"

def get_countries():
    """Get list of countries from World Bank API"""
    cache_key = "countries"
    cached_data = get_cached_data(cache_key)
    
    if cached_data:
        return cached_data
    
    try:
        response = requests.get(
            f"{BASE_URL}/country?format=json&per_page=300"
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Extract relevant country information and filter out aggregates
        countries = []
        for country in data[1]:
            # Skip aggregates and regions
            if country.get("region", {}).get("value") != "Aggregates":
                countries.append({
                    "code": country.get("id"),
                    "name": country.get("name")
                })
        
        # Sort by country name
        countries.sort(key=lambda x: x["name"])
        
        # Cache the data
        set_cached_data(cache_key, countries, 86400)  # Cache for 24 hours
        
        return countries
    except Exception as e:
        print(f"Error fetching countries: {str(e)}")
        return []

def get_gdp_growth_data(country_code):
    """Get GDP growth data for a specific country"""
    cache_key = f"gdp_growth_{country_code}"
    cached_data = get_cached_data(cache_key)
    
    if cached_data:
        return cached_data
    
    try:
        # Indicator for GDP growth (annual %)
        indicator = "NY.GDP.MKTP.KD.ZG"
        
        response = requests.get(
            f"{BASE_URL}/country/{country_code}/indicator/{indicator}?format=json&per_page=20&date=2000:2023"
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Format the data for chart display
        chart_data = []
        for entry in data[1]:
            if entry.get("value") is not None:
                chart_data.append({
                    "name": entry.get("date"),
                    "value": entry.get("value")
                })
        
        # Reverse to get chronological order
        chart_data.reverse()
        
        # Cache the data
        set_cached_data(cache_key, chart_data, 86400)  # Cache for 24 hours
        
        return chart_data
    except Exception as e:
        print(f"Error fetching GDP growth data: {str(e)}")
        return []

def get_unemployment_data(country_code):
    """Get unemployment data for a specific country"""
    cache_key = f"unemployment_{country_code}"
    cached_data = get_cached_data(cache_key)
    
    if cached_data:
        return cached_data
    
    try:
        # Indicator for Unemployment, total (% of total labor force)
        indicator = "SL.UEM.TOTL.ZS"
        
        response = requests.get(
            f"{BASE_URL}/country/{country_code}/indicator/{indicator}?format=json&per_page=20&date=2000:2023"
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Format the data for chart display
        chart_data = []
        for entry in data[1]:
            if entry.get("value") is not None:
                chart_data.append({
                    "name": entry.get("date"),
                    "value": entry.get("value")
                })
        
        # Reverse to get chronological order
        chart_data.reverse()
        
        # Cache the data
        set_cached_data(cache_key, chart_data, 86400)  # Cache for 24 hours
        
        return chart_data
    except Exception as e:
        print(f"Error fetching unemployment data: {str(e)}")
        return []

def get_country_comparison(country_code, indicator="gdp"):
    """Get comparative data for a country versus regional and global averages"""
    cache_key = f"comparison_{country_code}_{indicator}"
    cached_data = get_cached_data(cache_key)
    
    if cached_data:
        return cached_data
    
    try:
        # Map indicator text to World Bank indicator code
        indicator_map = {
            "gdp": "NY.GDP.MKTP.KD.ZG",  # GDP growth (annual %)
            "inflation": "FP.CPI.TOTL.ZG",  # Inflation, consumer prices (annual %)
            "unemployment": "SL.UEM.TOTL.ZS",  # Unemployment, total (% of total labor force)
            "fdi": "BX.KLT.DINV.WD.GD.ZS",  # Foreign direct investment, net inflows (% of GDP)
            "trade": "NE.TRD.GNFS.ZS"  # Trade (% of GDP)
        }
        
        # Default to GDP if indicator is not in the map
        wb_indicator = indicator_map.get(indicator, "NY.GDP.MKTP.KD.ZG")
        
        # Get country data
        response = requests.get(
            f"{BASE_URL}/country/{country_code}/indicator/{wb_indicator}?format=json&per_page=5&date=2018:2023"
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Get regional and global data (this would require additional API calls in a real implementation)
        # For this example, we'll use placeholder values
        comparison_data = []
        
        # Get the most recent year with data
        recent_year = None
        country_value = None
        
        for entry in data[1]:
            if entry.get("value") is not None:
                recent_year = entry.get("date")
                country_value = entry.get("value")
                break
        
        if recent_year and country_value is not None:
            # Add country data
            comparison_data.append({
                "name": data[1][0].get("country", {}).get("value", "Country"),
                "value": country_value,
                "average": 0  # Will be replaced with actual average
            })
            
            # Add regional and global data (placeholders)
            region_value = country_value * 0.9  # Simulate regional value as 90% of country value
            global_value = country_value * 0.8  # Simulate global value as 80% of country value
            
            comparison_data.append({
                "name": "Regional Average",
                "value": region_value,
                "average": country_value
            })
            
            comparison_data.append({
                "name": "Global Average",
                "value": global_value,
                "average": country_value
            })
            
            # Calculate the average for reference line
            average = sum(item["value"] for item in comparison_data) / len(comparison_data)
            for item in comparison_data:
                item["average"] = average
        
        # Cache the data
        set_cached_data(cache_key, comparison_data, 86400)  # Cache for 24 hours
        
        return comparison_data
    except Exception as e:
        print(f"Error fetching comparison data: {str(e)}")
        return []