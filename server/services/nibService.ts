// Define types for OpenRouter API
export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
import fetch from "node-fetch";

// Dynamic import for cache service to match the server pattern
async function getCacheService() {
  return await import('./cacheService');
}

// Define interface for OpenRouter response
interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Cache keys
const NIB_RECOMMENDATIONS_CACHE_KEY = "nib_recommendations_";

// NIB data structure
export interface NIBBasicInfo {
  yearInBrief: {
    title: string;
    description: string;
    keyHighlights: {
      title: string;
      value: string;
      description: string;
      sourceUrl: string;
    }[];
    factSheets: {
      title: string;
      description: string;
      link: string;
    }[];
  };
  quickLinks: {
    title: string;
    icon: string;
    description: string;
    link: string;
  }[];
}

export interface AIRecommendation {
  title: string;
  description: string;
  industry: string;
  riskLevel: string;
  opportunityLevel: string;
  analysis: string;
  keyRecommendation: string;
}

export interface NIBRecommendations {
  basic: NIBBasicInfo;
  aiRecommendations: {
    sustainable: AIRecommendation;
    infrastructure: AIRecommendation;
    innovation: AIRecommendation;
  };
  analysisDate: string;
}

// Function to get NIB basic information - in a real app this would fetch from API or scrape website
function getNIBBasicInfo(): NIBBasicInfo {
  return {
    yearInBrief: {
      title: "Our Year in Brief",
      description: "NIB is the international financial institution of the Nordic and Baltic countries. Our mission is to finance projects that improve productivity and benefit the environment of the Nordic and Baltic countries.",
      keyHighlights: [
        {
          title: "Lending",
          value: "EUR 5.6 billion",
          description: "NIB financed sustainable growth in its member countries with a total of EUR 5.6 billion in loans, half of them classified with a positive impact on the environment.",
          sourceUrl: "https://www.nib.int/who-we-are/our-year-in-brief"
        },
        {
          title: "Response to Covid-19",
          value: "EUR 1.6 billion",
          description: "Response Loans to alleviate the social and economic impact of the COVID-19 pandemic.",
          sourceUrl: "https://www.nib.int/who-we-are/our-year-in-brief"
        },
        {
          title: "Green Bonds",
          value: "EUR 800 million",
          description: "NIB issued its ninth and largest environmental bond, which was also the Bank's first seven-year EUR benchmark.",
          sourceUrl: "https://www.nib.int/who-we-are/our-year-in-brief"
        }
      ],
      factSheets: [
        {
          title: "Impact Report 2023",
          description: "Our investments and their impact on sustainable development",
          link: "https://www.nib.int/"
        },
        {
          title: "Annual Report 2023",
          description: "Financial performance and key achievements",
          link: "https://www.nib.int/who-we-are/our-year-in-brief"
        },
        {
          title: "NIB Strategy 2023-2025",
          description: "Our strategic framework for delivering on our mission",
          link: "https://www.nib.int/who-we-are/about"
        }
      ]
    },
    quickLinks: [
      {
        title: "What we finance",
        icon: "finance",
        description: "Learn about NIB's financing solutions and eligibility criteria",
        link: "https://www.nib.int/"
      },
      {
        title: "Green Bond Framework",
        icon: "sustainability",
        description: "Our approach to sustainable finance through green bonds",
        link: "https://www.nib.int/"
      },
      {
        title: "Member Countries",
        icon: "globe",
        description: "The Nordic and Baltic countries that own NIB",
        link: "https://www.nib.int/who-we-are/about"
      },
      {
        title: "Projects",
        icon: "projects",
        description: "Browse our financed projects across sectors",
        link: "https://www.nib.int/"
      }
    ]
  };
}

// This function reads NIB data and generates AI-powered investment recommendations
export async function getNIBRecommendations(): Promise<NIBRecommendations> {
  // Get cache service
  const { getCachedData, setCachedData } = await getCacheService();
  
  // Check cache first
  const cacheKey = NIB_RECOMMENDATIONS_CACHE_KEY;
  const cachedData = getCachedData<NIBRecommendations>(cacheKey, 24 * 60 * 60 * 1000); // Cache for 24 hours
  if (cachedData) {
    return cachedData;
  }

  // Fetch basic NIB data
  const basicInfo = getNIBBasicInfo();

  try {
    // Generate AI recommendations for each category
    const sustainableRec = await generateAIRecommendation("sustainable finance", 
      "Generate detailed investment recommendations for sustainable finance and green bonds in the Nordic and Baltic region based on NIB's mandate and focus areas. Include analysis of risks and opportunities.");
    
    const infrastructureRec = await generateAIRecommendation("infrastructure development", 
      "Generate detailed investment recommendations for infrastructure projects in the Nordic and Baltic region based on NIB's mandate and focus areas. Focus on transportation, energy, and digital connectivity. Include analysis of risks and opportunities.");
    
    const innovationRec = await generateAIRecommendation("innovation and technology", 
      "Generate detailed investment recommendations for innovation and technology sectors in the Nordic and Baltic region based on NIB's mandate and focus areas. Focus on digital transformation, clean technology, and bioeconomy. Include analysis of risks and opportunities.");

    // Create complete recommendations object
    const recommendations: NIBRecommendations = {
      basic: basicInfo,
      aiRecommendations: {
        sustainable: sustainableRec,
        infrastructure: infrastructureRec,
        innovation: innovationRec
      },
      analysisDate: new Date().toISOString()
    };

    // Cache the results
    setCachedData(cacheKey, recommendations);

    return recommendations;
  } catch (error) {
    console.error("Error generating NIB AI recommendations:", error);
    // Fallback to basic data if AI generation fails
    return {
      basic: basicInfo,
      aiRecommendations: {
        sustainable: createFallbackRecommendation("Sustainable Finance", "sustainable finance"),
        infrastructure: createFallbackRecommendation("Infrastructure Development", "infrastructure"),
        innovation: createFallbackRecommendation("Innovation & Technology", "innovation")
      },
      analysisDate: new Date().toISOString()
    };
  }
}

// This function uses Mistral AI to generate investment recommendations
async function generateAIRecommendation(sector: string, prompt: string): Promise<AIRecommendation> {
  try {
    // Create system prompt
    const systemPrompt = `You are an expert investment advisor specializing in Nordic and Baltic investments, with deep knowledge of the Nordic Investment Bank (NIB) and its mandate. 
    NIB finances projects that improve productivity and benefit the environment in the Nordic and Baltic countries.

    You will analyze ${sector} investment opportunities in the Nordic and Baltic region.
    
    Provide detailed, practical investment recommendations with:
    1. Title - a concise title for the recommendation
    2. Description - a brief 1-2 sentence description
    3. Industry - the specific industry segment
    4. Risk level - classify as Low, Medium, or High
    5. Opportunity level - classify as Low, Medium, or High
    6. Analysis - a detailed paragraph analyzing the current state and potential
    7. Key recommendation - a concise actionable recommendation
    
    IMPORTANT: You must respond with valid JSON only. Do not include any explanatory text or markdown formatting.
    Your entire response must be a single JSON object with these exact keys:
    {
      "title": "",
      "description": "",
      "industry": "",
      "riskLevel": "",
      "opportunityLevel": "",
      "analysis": "",
      "keyRecommendation": ""
    }
    
    Do not use code blocks, do not use backticks, and do not include any additional text before or after the JSON.
    `;

    // User prompt
    const userPrompt = prompt;

    // Prepare messages for OpenRouter API
    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ];

    // Call OpenRouter API (via Mistral model)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: messages,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} ${errorText}`);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const openRouterResponse = await response.json() as OpenRouterResponse;
    
    // Parse the JSON from the response
    let content = openRouterResponse.choices[0].message.content;
    console.log("AI Recommendation raw response:", content);
    
    try {
      // Handle the case where the response might be wrapped in markdown code blocks
      // First, try to extract content between ```json and ``` markers
      const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        content = jsonBlockMatch[1];
      } else if (content.includes('```')) {
        // Try to extract between any code block markers
        const codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          content = codeBlockMatch[1];
        }
      }
      
      // If we get an array instead of a single object, take the first item
      if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
        try {
          const parsedArray = JSON.parse(content);
          if (Array.isArray(parsedArray) && parsedArray.length > 0) {
            return parsedArray[0] as AIRecommendation;
          }
        } catch (e) {
          // If array parsing fails, continue with the original approach
        }
      }
      
      // Sometimes the model adds extra text before or after the JSON
      // Try to extract just the JSON object part
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const recommendationData = JSON.parse(content);
      return recommendationData as AIRecommendation;
    } catch (parseError) {
      console.error("Error parsing AI recommendation JSON:", parseError);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error(`Error generating AI recommendation for ${sector}:`, error);
    return createFallbackRecommendation(
      sector.charAt(0).toUpperCase() + sector.slice(1), 
      sector
    );
  }
}

// Create a fallback recommendation if AI generation fails
function createFallbackRecommendation(title: string, sector: string): AIRecommendation {
  return {
    title: title,
    description: `Investment opportunities in ${sector} across Nordic and Baltic countries.`,
    industry: sector,
    riskLevel: "Medium",
    opportunityLevel: "Medium",
    analysis: `Based on NIB's mandate, ${sector} represents a key area of focus with both challenges and opportunities. The Nordic and Baltic region continues to see development in this sector.`,
    keyRecommendation: `Consider targeted investments in ${sector} projects that align with NIB's dual mandate of productivity enhancement and environmental sustainability.`
  };
}