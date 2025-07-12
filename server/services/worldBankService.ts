import fetch from 'node-fetch';
import { CountryOption, EconomicIndicator } from '@shared/schema';

// World Bank API base URL
const WB_API_BASE = 'https://api.worldbank.org/v2';

// Fetch list of countries
export async function getCountries(): Promise<CountryOption[]> {
  try {
    const response = await fetch(`${WB_API_BASE}/country?format=json&per_page=300`);
    
    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }
    
    const data = await response.json();
    const countries = data[1].filter((c: any) => c.region.id !== "NA");
    
    return countries.map((country: any) => ({
      code: country.id,
      name: country.name
    }));
  } catch (error) {
    console.error("Error fetching countries from World Bank:", error);
    throw error;
  }
}

// Get general country data
export async function getCountryData(countryCode: string, indicators?: string[]): Promise<any> {
  try {
    // Basic country information
    const countryResponse = await fetch(`${WB_API_BASE}/country/${countryCode}?format=json`);
    
    if (!countryResponse.ok) {
      throw new Error(`World Bank API error: ${countryResponse.status}`);
    }
    
    const countryData = await countryResponse.json();
    const country = countryData[1][0];
    
    // Population data - fetch multiple years and use the most recent non-null value
    const populationResponse = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/SP.POP.TOTL?format=json&per_page=5`
    );
    const populationData = await populationResponse.json();
    let population = null;
    if (populationData[1] && Array.isArray(populationData[1])) {
      // Find the most recent non-null value
      population = populationData[1].find(item => item.value !== null);
    }
    
    // GDP data - fetch multiple years and use the most recent non-null value
    const gdpResponse = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&per_page=5`
    );
    const gdpData = await gdpResponse.json();
    let gdp = null;
    if (gdpData[1] && Array.isArray(gdpData[1])) {
      // Find the most recent non-null value
      gdp = gdpData[1].find(item => item.value !== null);
    }
    
    // GDP per capita data - fetch multiple years and use the most recent non-null value
    const gdpPerCapitaResponse = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/NY.GDP.PCAP.CD?format=json&per_page=5`
    );
    const gdpPerCapitaData = await gdpPerCapitaResponse.json();
    let gdpPerCapita = null;
    if (gdpPerCapitaData[1] && Array.isArray(gdpPerCapitaData[1])) {
      // Find the most recent non-null value
      gdpPerCapita = gdpPerCapitaData[1].find(item => item.value !== null);
    }
    
    // Format population
    const populationValue = population ? population.value : "N/A";
    const formattedPopulation = typeof populationValue === 'number' 
      ? (populationValue >= 1e6 
         ? `${(populationValue / 1e6).toFixed(1)} million` 
         : `${(populationValue / 1e3).toFixed(1)} thousand`)
      : populationValue;
    
    // Format GDP
    const gdpValue = gdp ? gdp.value : "N/A";
    const formattedGDP = typeof gdpValue === 'number'
      ? `$${(gdpValue >= 1e12 
         ? (gdpValue / 1e12).toFixed(2) + " trillion" 
         : (gdpValue / 1e9).toFixed(2) + " billion")}`
      : gdpValue;
    
    // Format GDP per capita
    const gdpPerCapitaValue = gdpPerCapita ? gdpPerCapita.value : "N/A";
    const formattedGDPPerCapita = typeof gdpPerCapitaValue === 'number'
      ? `$${Math.round(gdpPerCapitaValue).toLocaleString()}`
      : gdpPerCapitaValue;
    
    // Prepare economic indicators if requested
    let economicIndicators: EconomicIndicator[] = [];
    let summary = [
      `${country.name} is a ${country.incomeLevel.value} country located in ${country.region.value}.`,
      `With a GDP of ${formattedGDP}, it has various economic and development characteristics.`,
      `The country's capital city is ${country.capitalCity} and it has a ${country.incomeLevel.value} economy.`
    ];
    
    let analysis = [
      `${country.name}'s economic position as a ${country.incomeLevel.value} economy reflects its current development status.`,
      `Recent economic data shows some important trends and indicators that provide insights into the country's financial health.`,
      `Regional and global economic factors continue to influence ${country.name}'s economic trajectory.`
    ];
    
    if (indicators && indicators.length > 0) {
      // Fetch more detailed economic data
      // GDP growth
      const gdpGrowthResponse = await fetch(
        `${WB_API_BASE}/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=2`
      );
      const gdpGrowthData = await gdpGrowthResponse.json();
      const gdpGrowth = gdpGrowthData[1] ? gdpGrowthData[1][0] : null;
      const prevGdpGrowth = gdpGrowthData[1] && gdpGrowthData[1].length > 1 ? gdpGrowthData[1][1] : null;
      
      // Unemployment
      const unemploymentResponse = await fetch(
        `${WB_API_BASE}/country/${countryCode}/indicator/SL.UEM.TOTL.ZS?format=json&per_page=2`
      );
      const unemploymentData = await unemploymentResponse.json();
      const unemployment = unemploymentData[1] ? unemploymentData[1][0] : null;
      const prevUnemployment = unemploymentData[1] && unemploymentData[1].length > 1 ? unemploymentData[1][1] : null;
      
      // Inflation
      const inflationResponse = await fetch(
        `${WB_API_BASE}/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=2`
      );
      const inflationData = await inflationResponse.json();
      const inflation = inflationData[1] ? inflationData[1][0] : null;
      const prevInflation = inflationData[1] && inflationData[1].length > 1 ? inflationData[1][1] : null;
      
      // Trade balance
      const tradeResponse = await fetch(
        `${WB_API_BASE}/country/${countryCode}/indicator/NE.RSB.GNFS.ZS?format=json&per_page=2`
      );
      const tradeData = await tradeResponse.json();
      const trade = tradeData[1] ? tradeData[1][0] : null;
      const prevTrade = tradeData[1] && tradeData[1].length > 1 ? tradeData[1][1] : null;
      
      // Add to economic indicators
      if (gdp) {
        economicIndicators.push({
          indicator: "GDP (nominal)",
          value: formattedGDP,
          year: gdp.date || "N/A",
          change: {
            value: gdpGrowth && typeof gdpGrowth.value === 'number' ? `${gdpGrowth.value.toFixed(1)}%` : "N/A",
            direction: gdpGrowth && prevGdpGrowth && gdpGrowth.value > prevGdpGrowth.value ? "up" : "down"
          },
          globalRank: country.gdpRank || "N/A"
        });
      }
      
      if (gdpPerCapita) {
        economicIndicators.push({
          indicator: "GDP per capita",
          value: formattedGDPPerCapita,
          year: gdpPerCapita.date || "N/A",
          change: {
            value: gdpGrowth && typeof gdpGrowth.value === 'number' ? `${gdpGrowth.value.toFixed(1)}%` : "N/A",
            direction: gdpGrowth && prevGdpGrowth && gdpGrowth.value > prevGdpGrowth.value ? "up" : "down"
          },
          globalRank: "N/A"
        });
      }
      
      if (unemployment) {
        economicIndicators.push({
          indicator: "Unemployment Rate",
          value: `${unemployment.value?.toFixed(1)}%` || "N/A",
          year: unemployment.date || "N/A",
          change: {
            value: unemployment && prevUnemployment ? 
              `${(unemployment.value - prevUnemployment.value).toFixed(1)}%` : "N/A",
            direction: unemployment && prevUnemployment && unemployment.value < prevUnemployment.value ? "up" : "down"
          },
          globalRank: "N/A"
        });
      }
      
      if (inflation) {
        economicIndicators.push({
          indicator: "Inflation Rate",
          value: `${inflation.value?.toFixed(1)}%` || "N/A",
          year: inflation.date || "N/A",
          change: {
            value: inflation && prevInflation ? 
              `${(inflation.value - prevInflation.value).toFixed(1)}%` : "N/A",
            direction: inflation && prevInflation && inflation.value > prevInflation.value ? "up" : "down"
          },
          globalRank: "N/A"
        });
      }
      
      if (trade) {
        economicIndicators.push({
          indicator: "Trade Balance",
          value: `${trade.value?.toFixed(1)}% of GDP` || "N/A",
          year: trade.date || "N/A",
          change: {
            value: trade && prevTrade ? 
              `${(trade.value - prevTrade.value).toFixed(1)}%` : "N/A",
            direction: trade && prevTrade && trade.value > prevTrade.value ? "up" : "down"
          },
          globalRank: "N/A"
        });
      }
      
      // Better summary
      summary = [
        `${country.name} is a ${country.incomeLevel.value} country located in ${country.region.value}.`,
        `With a GDP of ${formattedGDP}, the country has experienced ${gdpGrowth && gdpGrowth.value !== null ? (gdpGrowth.value > 0 ? 'positive' : 'negative') : 'varying'} economic growth recently.`,
        `Key economic indicators suggest ${gdpGrowth && gdpGrowth.value !== null && inflation && inflation.value !== null && unemployment && unemployment.value !== null ? (gdpGrowth.value > 2 && inflation.value < 5 && unemployment.value < 7 ? 'a relatively stable economy' : 'some economic challenges') : 'a mixed economic picture'}.`
      ];
      
      // Better analysis
      analysis = [
        `${country.name}'s economy ${gdpGrowth && gdpGrowth.value !== null ? (gdpGrowth.value > 0 ? `is growing at ${gdpGrowth.value.toFixed(1)}%` : `is contracting at ${Math.abs(gdpGrowth.value).toFixed(1)}%`) : 'shows mixed growth patterns'}.`,
        `${unemployment && unemployment.value !== null ? `The unemployment rate of ${unemployment.value.toFixed(1)}% ${prevUnemployment && unemployment.value < prevUnemployment.value ? 'has improved from previous periods' : 'remains a concern'}` : 'Employment data shows mixed results'}.`,
        `${inflation && inflation.value !== null ? `Inflation ${inflation.value > 3 ? 'remains elevated' : 'is relatively controlled'} at ${inflation.value.toFixed(1)}%` : 'Price stability shows varying patterns'}.`,
        `As a ${country.incomeLevel.value} economy, ${country.name} faces ${country.incomeLevel.id === 'HIC' ? 'challenges typical of advanced economies' : 'development hurdles that require strategic policy responses'}.`
      ];
    }
    
    return {
      name: country.name,
      code: country.id,
      region: country.region.value,
      incomeLevel: country.incomeLevel.value,
      capital: country.capitalCity,
      longitude: country.longitude,
      latitude: country.latitude,
      population: formattedPopulation,
      populationYear: population ? population.date : "N/A",
      gdp: formattedGDP,
      gdpPerCapita: formattedGDPPerCapita,
      government: country.governmentType || "N/A",
      indicators: economicIndicators,
      summary,
      analysis
    };
  } catch (error) {
    console.error("Error fetching country data from World Bank:", error);
    throw error;
  }
}

// Get GDP growth data for charts
export async function getGDPGrowthData(countryCode: string) {
  try {
    const response = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=5`
    );
    
    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data[1] || !Array.isArray(data[1])) {
      return [];
    }
    
    // Reverse to get chronological order and map to chart format
    return data[1].reverse().map((item: any) => ({
      name: item.date,
      value: item.value
    }));
  } catch (error) {
    console.error("Error fetching GDP growth data:", error);
    throw error;
  }
}

// Get unemployment data for charts
export async function getUnemploymentData(countryCode: string) {
  try {
    const response = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/SL.UEM.TOTL.ZS?format=json&per_page=5`
    );
    
    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data[1] || !Array.isArray(data[1])) {
      return [];
    }
    
    // Reverse to get chronological order and map to chart format
    return data[1].reverse().map((item: any) => ({
      name: item.date,
      value: item.value
    }));
  } catch (error) {
    console.error("Error fetching unemployment data:", error);
    throw error;
  }
}

// Get country comparison data
export async function getCountryComparison(countryCode: string, indicator: string = "gdp") {
  try {
    // Get country information to determine region
    const countryResponse = await fetch(`${WB_API_BASE}/country/${countryCode}?format=json`);
    
    if (!countryResponse.ok) {
      console.warn(`Could not fetch country data: ${countryResponse.status}`);
      // Return placeholder data
      return [{
        name: "Country",
        value: 100,
        average: 90
      }];
    }
    
    const countryData = await countryResponse.json();
    const country = countryData[1][0];
    const regionCode = country.region.id;
    
    // Map indicator string to World Bank indicator code
    let indicatorCode;
    switch (indicator.toLowerCase()) {
      case "gdp":
        indicatorCode = "NY.GDP.MKTP.CD";
        break;
      case "gdppercapita":
        indicatorCode = "NY.GDP.PCAP.CD";
        break;
      case "unemployment":
        indicatorCode = "SL.UEM.TOTL.ZS";
        break;
      case "inflation":
        indicatorCode = "FP.CPI.TOTL.ZG";
        break;
      default:
        indicatorCode = "NY.GDP.MKTP.CD"; // Default to GDP
    }
    
    // Get data for the specific country
    const countryDataResponse = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=1`
    );
    
    if (!countryDataResponse.ok) {
      console.warn(`Could not fetch country indicator data: ${countryDataResponse.status}`);
      // Return placeholder with just the country name
      return [{
        name: country.name,
        value: 100,
        average: 90
      }];
    }
    
    const countryIndicatorData = await countryDataResponse.json();
    const countryValue = countryIndicatorData[1] && countryIndicatorData[1][0] ? countryIndicatorData[1][0].value : 0;
    
    // Get regional average
    const regionResponse = await fetch(
      `${WB_API_BASE}/region/${regionCode}/indicator/${indicatorCode}?format=json&per_page=1`
    );
    
    if (!regionResponse.ok) {
      console.warn(`Could not fetch region data: ${regionResponse.status}`);
      // Fallback to country average
      return [{
        name: country.name,
        value: countryValue,
        average: countryValue * 0.9 // Fallback approximation for the region
      }];
    }
    
    try {
      const regionData = await regionResponse.json();
      const regionValue = regionData[1] && regionData[1][0] ? regionData[1][0].value : 0;
      
      // Get data for other comparable countries in the region
      const regionCountriesResponse = await fetch(
        `${WB_API_BASE}/region/${regionCode}/country?format=json&per_page=100`
      );
      
      if (!regionCountriesResponse.ok) {
        console.warn(`Could not fetch region countries: ${regionCountriesResponse.status}`);
        return [{
          name: country.name,
          value: countryValue,
          average: regionValue
        }];
      }
      
      const regionCountriesData = await regionCountriesResponse.json();
      
      // Filter to get 4 comparable countries (excluding the current one)
      const comparableCountries = regionCountriesData[1]
        .filter((c: any) => c.id !== countryCode)
        .filter((c: any) => c.incomeLevel && c.incomeLevel.id === country.incomeLevel.id)
        .slice(0, 4);
      
      // Get data for each comparable country
      const comparableData = await Promise.all(
        comparableCountries.map(async (c: any) => {
          try {
            const response = await fetch(
              `${WB_API_BASE}/country/${c.id}/indicator/${indicatorCode}?format=json&per_page=1`
            );
            
            if (!response.ok) {
              console.warn(`Could not fetch data for country ${c.name}: ${response.status}`);
              return {
                name: c.name,
                value: 0,
                average: regionValue
              };
            }
            
            const data = await response.json();
            const value = data[1] && data[1][0] ? data[1][0].value : 0;
            
            return {
              name: c.name,
              value,
              average: regionValue
            };
          } catch (err) {
            console.warn(`Error processing country ${c.name}:`, err);
            return {
              name: c.name,
              value: 0,
              average: regionValue
            };
          }
        })
      );
      
      // Combine the target country with comparable countries
      return [
        {
          name: country.name,
          value: countryValue,
          average: regionValue
        },
        ...comparableData
      ];
    } catch (jsonError) {
      console.error("Error parsing JSON from region response:", jsonError);
      // Return just the country data as fallback
      return [{
        name: country.name,
        value: countryValue,
        average: countryValue * 0.9
      }];
    }
  } catch (error) {
    console.error("Error fetching comparison data:", error);
    // Return placeholder data as last resort
    return [{
      name: "Error fetching data",
      value: 0,
      average: 0
    }];
  }
}
