import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, CountryOption } from "./types";
import { AnalysisRequest } from "@shared/schema";

// Fetch list of countries
export async function getCountries(): Promise<CountryOption[]> {
  const res = await fetch("/api/countries");
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  return res.json();
}

// Submit analysis request
export async function submitAnalysis(data: AnalysisRequest): Promise<AnalysisResult> {
  const res = await apiRequest("POST", "/api/analyze", data);
  return res.json();
}

// Get GDP growth data for a country
export async function getGDPGrowthData(countryCode: string): Promise<any> {
  const res = await fetch(`/api/economic/gdp-growth/${countryCode}`);
  if (!res.ok) {
    throw new Error("Failed to fetch GDP growth data");
  }
  return res.json();
}

// Get unemployment data for a country
export async function getUnemploymentData(countryCode: string): Promise<any> {
  const res = await fetch(`/api/economic/unemployment/${countryCode}`);
  if (!res.ok) {
    throw new Error("Failed to fetch unemployment data");
  }
  return res.json();
}

// Get country comparison data
export async function getCountryComparison(countryCode: string, indicator: string): Promise<any> {
  const res = await fetch(`/api/economic/comparison/${countryCode}?indicator=${indicator}`);
  if (!res.ok) {
    throw new Error("Failed to fetch comparison data");
  }
  return res.json();
}

// Ask follow-up question to AI
export async function askFollowUpQuestion(countryCode: string, question: string): Promise<string> {
  const res = await apiRequest("POST", "/api/ai/follow-up", { countryCode, question });
  return res.json();
}

// Get CDP renewable energy data for a country
export async function getCDPRenewableData(countryCode: string): Promise<any> {
  const res = await fetch(`/api/cdp/renewable/${countryCode}`);
  if (!res.ok) {
    throw new Error("Failed to fetch renewable energy data");
  }
  return res.json();
}

// Get P3 (Predict, Prevent, Protect) investment recommendations for a country
export async function getP3Recommendations(countryCode: string, query: string): Promise<any> {
  try {
    const res = await apiRequest("POST", `/api/p3/${countryCode}`, { query });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`P3 API error: ${res.status} - ${errorText}`);
      
      // Return a structured fallback response
      return {
        predict: `<h3>Risk Analysis</h3><p>We encountered an issue analyzing investment risks. Server responded with status ${res.status}.</p>`,
        prevent: `<h3>Prevention Strategies</h3><p>We encountered an issue generating prevention strategies. Server responded with status ${res.status}.</p>`,
        protect: `<h3>Protection Recommendations</h3><p>We encountered an issue developing protection recommendations. Server responded with status ${res.status}.</p>`
      };
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching P3 recommendations:", error);
    
    // Provide a structured fallback response even in case of error
    return {
      predict: "<h3>Risk Analysis Error</h3><p>We encountered an issue processing the risk analysis. Please try again with more specific parameters.</p>",
      prevent: "<h3>Prevention Strategies Error</h3><p>We encountered an issue generating prevention strategies. Please try again with more specific parameters.</p>",
      protect: "<h3>Protection Recommendations Error</h3><p>We encountered an issue developing protection recommendations. Please try again with more specific parameters.</p>"
    };
  }
}

// Get projects with risk analysis for a country
export async function getProjectsWithRiskAnalysis(countryCode: string): Promise<any> {
  try {
    const res = await apiRequest("GET", `/api/projects/${countryCode}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching projects with risk analysis:', error);
    throw error;
  }
}

// Get AI-powered NIB investment recommendations
export async function getNIBRecommendations(): Promise<any> {
  try {
    const res = await apiRequest("GET", '/api/nib/recommendations');
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching NIB AI recommendations:', error);
    throw error;
  }
}
