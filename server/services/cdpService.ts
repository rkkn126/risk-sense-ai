import fetch from 'node-fetch';

// CDP Data API base URL
const CDP_API_BASE = 'https://data.cdp.net/resource/kuuu-937k.json';

// Type definitions for CDP data
interface CDPRenewableTarget {
  country: string;
  city: string;
  organization_name: string;
  target_sector: string;
  target_type: string;
  target_year?: string;
  base_year?: string;
  metric_used_to_measure_target?: string;
  metric_value_in_base_year?: string;
  metric_value_in_target?: string;
  metric_value_in_most_recent?: string;
  percentage_of_total_energy?: string;
  population?: string;
  population_year?: string;
}

/**
 * Get CDP renewable energy targets for a specific country
 */
export async function getCDPRenewableTargets(countryCode: string): Promise<CDPRenewableTarget[]> {
  try {
    // Map country code to full country name for CDP API (which uses full names)
    const countryName = getCountryNameFromCode(countryCode);
    if (!countryName) {
      console.warn(`No country name mapping found for country code: ${countryCode}`);
      return [];
    }

    // Build query URL with country filter
    // URL encode the country name for the query
    const encodedCountry = encodeURIComponent(countryName);
    const url = `${CDP_API_BASE}?$where=country="${encodedCountry}"&$limit=10`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Error fetching CDP data: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json() as CDPRenewableTarget[];
    
    // Filter to only include renewable energy targets
    return data.filter(target => 
      target.target_sector && target.target_sector.toLowerCase().includes('renewable')
    );
  } catch (error) {
    console.error("Error fetching CDP renewable targets:", error);
    return [];
  }
}

/**
 * Get CDP renewable energy summary data by country
 */
export async function getCDPRenewableSummary(countryCode: string): Promise<any> {
  try {
    const targets = await getCDPRenewableTargets(countryCode);
    
    if (targets.length === 0) {
      return {
        hasData: false,
        message: "No renewable energy targets found for this country in the CDP database."
      };
    }
    
    // Calculate average target completion year
    const targetYears = targets
      .filter(t => t.target_year)
      .map(t => parseInt(t.target_year || "0"))
      .filter(year => year > 0);
    
    const avgTargetYear = targetYears.length > 0 
      ? Math.round(targetYears.reduce((sum, year) => sum + year, 0) / targetYears.length) 
      : null;
    
    // Get cities with renewable targets
    const cities = targets.map(t => t.city).filter(Boolean);
    const uniqueCities = [...new Set(cities)];
    
    // Get percentage values where available
    const percentages = targets
      .filter(t => t.percentage_of_total_energy)
      .map(t => parseFloat(t.percentage_of_total_energy || "0"))
      .filter(p => !isNaN(p));
    
    const avgPercentage = percentages.length > 0
      ? Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length)
      : null;
    
    return {
      hasData: true,
      countryName: targets[0]?.country || "",
      citiesWithTargets: uniqueCities.length,
      cityList: uniqueCities,
      totalTargets: targets.length,
      averageTargetYear: avgTargetYear,
      averageRenewablePercentage: avgPercentage,
      targetTypes: [...new Set(targets.map(t => t.target_type).filter(Boolean))]
    };
  } catch (error) {
    console.error("Error getting CDP renewable summary:", error);
    return {
      hasData: false,
      message: "Error processing renewable energy target data."
    };
  }
}

/**
 * Map ISO country codes to full country names used in CDP data
 */
function getCountryNameFromCode(countryCode: string): string | null {
  const countryMap: Record<string, string> = {
    "USA": "United States of America",
    "GBR": "United Kingdom of Great Britain and Northern Ireland",
    "CAN": "Canada",
    "AUS": "Australia",
    "DEU": "Germany",
    "FRA": "France",
    "JPN": "Japan",
    "ITA": "Italy",
    "ESP": "Spain",
    "NLD": "Netherlands",
    "BRA": "Brazil",
    "ARG": "Argentina",
    "MEX": "Mexico",
    "ZAF": "South Africa",
    "IND": "India",
    "CHN": "China",
    "AFG": "Afghanistan",
    // Add more country code mappings as needed
  };
  
  return countryMap[countryCode] || null;
}