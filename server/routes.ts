import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analysisRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { getMistralInsights, getP3Recommendations } from "./services/mistralService";
import { getCountries, getCountryData, getGDPGrowthData, getUnemploymentData, getCountryComparison } from "./services/worldBankService";
import { getNewsArticles, analyzeNewsSentiment } from "./services/newsService";
import { getCDPRenewableSummary } from "./services/cdpService";
import { getProjectsRiskAnalysis } from "./services/projectService";
import { getNIBRecommendations } from "./services/nibService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fetch all countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await getCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ 
        message: "Failed to fetch countries",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Main analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate request
      const validatedData = analysisRequestSchema.parse(req.body);
      const { countryCode, query } = validatedData;

      // Import cache service
      const { getCachedData, setCachedData } = await import('./services/cacheService');
      
      // Generate cache key
      const cacheKey = `analyze:${countryCode}:${query.toLowerCase().trim()}`;
      
      // Check cache first (cache for 30 minutes)
      const cachedData = getCachedData(cacheKey, 30 * 60 * 1000);
      if (cachedData) {
        console.log(`Using cached analysis data for ${countryCode}`);
        return res.json(cachedData);
      }
      
      console.log(`Starting fresh analysis for ${countryCode} with query: ${query}`);
      
      // Fetch all data in parallel for better performance
      console.log("Fetching data in parallel...");
      const [countryInfo, economicData, newsArticles] = await Promise.all([
        getCountryData(countryCode),
        getCountryData(countryCode, ["GDP", "GNI", "inflation", "unemployment"]),
        getNewsArticles(countryCode, query)
      ]);
      
      // Process sentiment and AI insights in parallel
      console.log("Processing analysis in parallel...");
      const [sentiment, aiInsights] = await Promise.all([
        analyzeNewsSentiment(newsArticles),
        getMistralInsights(countryCode, countryInfo, economicData, newsArticles, query)
      ]);
      
      // Prepare response
      const result = {
        countryCode,
        countryName: countryInfo.name,
        query,
        overview: {
          population: countryInfo.population,
          populationYear: countryInfo.populationYear,
          gdp: economicData.gdp,
          gdpPerCapita: economicData.gdpPerCapita,
          government: countryInfo.government,
          summary: economicData.summary
        },
        economicData: {
          indicators: economicData.indicators,
          analysis: economicData.analysis
        },
        newsData: {
          items: newsArticles,
          sentiment
        },
        aiInsights: {
          content: aiInsights.analysis,
          followUpQuestions: aiInsights.followUpQuestions
        }
      };
      
      // Cache the result for faster future access
      setCachedData(cacheKey, result);
      console.log(`Analysis for ${countryCode} completed and cached`);
      
      res.json(result);
    } catch (error) {
      console.error("Error generating analysis:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          details: fromZodError(error).message 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to generate analysis",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // GDP Growth data
  app.get("/api/economic/gdp-growth/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const data = await getGDPGrowthData(countryCode);
      res.json(data);
    } catch (error) {
      console.error("Error fetching GDP data:", error);
      res.status(500).json({ 
        message: "Failed to fetch GDP growth data",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Unemployment data
  app.get("/api/economic/unemployment/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const data = await getUnemploymentData(countryCode);
      res.json(data);
    } catch (error) {
      console.error("Error fetching unemployment data:", error);
      res.status(500).json({ 
        message: "Failed to fetch unemployment data",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Country comparison data
  app.get("/api/economic/comparison/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const indicator = req.query.indicator as string || "gdp";
      const data = await getCountryComparison(countryCode, indicator);
      res.json(data);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      res.status(500).json({ 
        message: "Failed to fetch comparison data",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Follow-up question to AI
  app.post("/api/ai/follow-up", async (req, res) => {
    try {
      const { countryCode, question } = req.body;
      
      if (!countryCode || !question) {
        return res.status(400).json({ message: "Country code and question are required" });
      }
      
      // Import cache service
      const { getCachedData, setCachedData } = await import('./services/cacheService');
      
      // Generate cache key
      const cacheKey = `follow-up:${countryCode}:${question.toLowerCase().trim()}`;
      
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log(`Using cached follow-up response for question about ${countryCode}`);
        return res.json(cachedData);
      }
      
      console.log(`New follow-up question for ${countryCode}: ${question}`);
      
      // Get country details and economic data for context in parallel
      const [countryInfo, economicData] = await Promise.all([
        getCountryData(countryCode),
        getCountryData(countryCode, ["GDP", "GNI"])
      ]);
      
      // Get AI response to the follow-up question
      const response = await getMistralInsights(
        countryCode, 
        countryInfo, 
        economicData, 
        [], 
        question,
        true // Flag indicating this is a follow-up question
      );
      
      // Cache the result
      setCachedData(cacheKey, response.analysis);
      console.log('Follow-up response cached successfully');
      
      res.json(response.analysis);
    } catch (error) {
      console.error("Error processing follow-up question:", error);
      res.status(500).json({ 
        message: "Failed to process question",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // CDP Renewable Energy Data
  app.get("/api/cdp/renewable/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      // Import cache service
      const { getCachedData, setCachedData } = await import('./services/cacheService');
      
      // Generate cache key
      const cacheKey = `cdp:${countryCode}`;
      
      // Check cache first (CDP data changes infrequently, so cache for 6 hours)
      const cachedData = getCachedData(cacheKey, 6 * 60 * 60 * 1000);
      if (cachedData) {
        console.log(`Using cached CDP data for ${countryCode}`);
        return res.json(cachedData);
      }
      
      console.log(`Fetching fresh CDP data for ${countryCode}`);
      const data = await getCDPRenewableSummary(countryCode);
      
      // Cache the result
      setCachedData(cacheKey, data);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching CDP renewable data:", error);
      res.status(500).json({ 
        message: "Failed to fetch renewable energy data",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // P3 (Predict, Prevent, Protect) Investment Recommendations
  app.post("/api/p3/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const { query } = req.body;
      
      console.log(`P3 request received for ${countryCode} with query: ${query}`);
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Check if OpenRouter API key is available
      if (!process.env.OPENROUTER_API_KEY) {
        console.error("OpenRouter API key is missing");
        return res.status(500).json({ 
          message: "OpenRouter API key is not configured",
          details: "API key is required for AI-powered recommendations" 
        });
      }
      
      // Import cache service
      const { getCachedData, setCachedData } = await import('./services/cacheService');
      
      // Generate cache key based on country code and normalized query
      const cacheKey = `p3:${countryCode}:${query.toLowerCase().trim()}`;
      
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log(`Using cached P3 data for ${countryCode}`);
        return res.json(cachedData);
      }
      
      // Cache miss - fetch fresh data
      
      // Get all the data we need for comprehensive P3 analysis in parallel to speed up
      console.log("Fetching all required data...");
      const [countryInfo, economicData, newsArticles, cdpData] = await Promise.all([
        getCountryData(countryCode),
        getCountryData(countryCode, ["GDP", "GNI", "inflation", "unemployment"]),
        getNewsArticles(countryCode, query),
        getCDPRenewableSummary(countryCode).catch(err => {
          console.warn(`No CDP data available for ${countryCode}: ${err.message}`);
          return null;
        })
      ]);
      
      console.log("Generating P3 recommendations...");
      // Get P3 recommendations
      const p3Recommendations = await getP3Recommendations(
        countryCode,
        countryInfo,
        economicData,
        newsArticles,
        cdpData,
        query
      );
      
      console.log("P3 recommendations generated successfully");
      // Use fallback values if any section is missing
      const response = {
        predict: p3Recommendations.predict || "<h3>Risk Analysis</h3><p>No risk analysis could be generated. Please try with different parameters.</p>",
        prevent: p3Recommendations.prevent || "<h3>Prevention Strategies</h3><p>No prevention strategies could be generated. Please try with different parameters.</p>",
        protect: p3Recommendations.protect || "<h3>Protection Recommendations</h3><p>No protection recommendations could be generated. Please try with different parameters.</p>"
      };
      
      // Cache the successful response
      setCachedData(cacheKey, response);
      
      res.json(response);
    } catch (error) {
      console.error("Error generating P3 recommendations:", error);
      // Send a structured fallback response even on error
      res.status(500).json({ 
        message: "Failed to generate investment recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
        predict: "<h3>Risk Analysis Error</h3><p>We encountered an issue processing the risk analysis. Please try again with more specific parameters.</p>",
        prevent: "<h3>Prevention Strategies Error</h3><p>We encountered an issue generating prevention strategies. Please try again with more specific parameters.</p>",
        protect: "<h3>Protection Recommendations Error</h3><p>We encountered an issue developing protection recommendations. Please try again with more specific parameters.</p>"
      });
    }
  });

  // Project Risk Analysis
  app.get("/api/projects/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const query = req.query.query as string || "investment";
      
      console.log(`Project risk analysis requested for ${countryCode}`);
      
      // Import cache service
      const { getCachedData, setCachedData } = await import('./services/cacheService');
      
      // Generate cache key
      const cacheKey = `projects:${countryCode}:${query.toLowerCase().trim()}`;
      
      // Check cache first (cache for 1 hour)
      const cachedData = getCachedData(cacheKey, 60 * 60 * 1000);
      if (cachedData) {
        console.log(`Using cached project risk data for ${countryCode}`);
        return res.json(cachedData);
      }
      
      console.log(`Generating fresh project risk analysis for ${countryCode}`);
      const projects = await getProjectsRiskAnalysis(countryCode, query);
      
      // Cache the result for faster future access
      setCachedData(cacheKey, projects);
      console.log(`Project risk analysis for ${countryCode} completed and cached`);
      
      res.json(projects);
    } catch (error) {
      console.error("Error generating project risk analysis:", error);
      res.status(500).json({ 
        message: "Failed to generate project risk analysis",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // NIB AI-Powered Investment Recommendations
  app.get("/api/nib/recommendations", async (req, res) => {
    try {
      console.log("Fetching NIB AI recommendations");
      
      // Check if OpenRouter API key is available
      if (!process.env.OPENROUTER_API_KEY) {
        console.error("OpenRouter API key is missing");
        return res.status(500).json({ 
          message: "OpenRouter API key is not configured",
          details: "API key is required for AI-powered recommendations" 
        });
      }
      
      const nibRecommendations = await getNIBRecommendations();
      
      console.log("NIB AI recommendations generated successfully");
      res.json(nibRecommendations);
    } catch (error) {
      console.error("Error generating NIB AI recommendations:", error);
      res.status(500).json({ 
        message: "Failed to generate NIB recommendations",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
