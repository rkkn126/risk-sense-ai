import fetch from 'node-fetch';
import { NewsItem, FollowUpQuestion } from '@shared/schema';

// Get API key from environment variable - using OpenRouter to access Mistral models
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

interface AIResponse {
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

interface MistralInsights {
  analysis: string;
  followUpQuestions: FollowUpQuestion[];
}

interface P3Recommendation {
  predict: string;
  prevent: string;
  protect: string;
}

export async function getP3Recommendations(
  countryCode: string,
  countryInfo: any,
  economicData: any,
  newsArticles: NewsItem[],
  cdpData: any,
  query: string
): Promise<P3Recommendation> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured");
  }

  try {
    // Prepare data for the prompt
    const countryInfoStr = JSON.stringify(countryInfo, null, 2);
    const economicDataStr = JSON.stringify(economicData, null, 2);
    
    // Format news data - limited to avoid too large tokens
    const formattedNews = newsArticles.slice(0, 5).map(article => ({
      title: article.title,
      source: article.source,
      description: article.description
    }));
    const newsDataStr = JSON.stringify(formattedNews, null, 2);

    // Include CDP data if available
    let cdpDataStr = "No climate data available";
    if (cdpData && cdpData.hasData) {
      cdpDataStr = JSON.stringify(cdpData, null, 2);
    }

    // Create P3 specific prompt
    const prompt = `
You are an investment risk expert with the task of providing strategic P3 (Predict, Prevent, Protect) recommendations for investments in ${countryInfo.name}.
Based on the data provided, deliver comprehensive strategic recommendations for investors focused on the country.

Country Information:
${countryInfoStr}

Economic Data:
${economicDataStr}

Recent News:
${newsDataStr}

Climate & Renewable Energy Data:
${cdpDataStr}

User's Investment Query:
${query}

Please provide a detailed P3 (Predict, Prevent, Protect) analysis in JSON format ONLY.

Your task is to analyze the data and generate:
1. PREDICT: Identify potential investment risks in ${countryInfo.name} (political instability, economic volatility, etc.)
2. PREVENT: Offer strategic preventative measures and mitigating actions
3. PROTECT: Recommend concrete protective actions for safeguarding investments

Your response must be ONLY a valid JSON object with three keys. Use the following exact structure:

{
  "predict": "<h3>Investment Risk Analysis for ${countryInfo.name}</h3><p>Analysis of potential risks...</p>",
  "prevent": "<h3>Prevention Strategies</h3><p>Strategic measures to mitigate risks...</p>",
  "protect": "<h3>Protection Recommendations</h3><p>Actions to safeguard investments...</p>"
}

Important requirements:
1. Each value must contain properly formatted HTML with <h3>, <p>, <ul>, and <li> tags.
2. Do not include any text, explanations or notes outside the JSON object.
3. Make sure to escape quotes inside the HTML content with backslashes.
4. Each section should be comprehensive (300+ words).
5. Return ONLY a valid, parseable JSON object.
`;

    // Call OpenRouter API to access Mistral model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://replit.com', // Required by OpenRouter
        'X-Title': 'Investment Risk Analysis' // Helpful for OpenRouter stats
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct", // Access via OpenRouter
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as AIResponse;
    const content = data.choices[0].message.content;

    try {
      // Parse the JSON response
      // Sometimes the AI might return additional text before or after the JSON
      // Look for JSON-like content between curly braces
      const jsonMatch = content.match(/{[\s\S]*?}/);
      let p3Data: P3Recommendation;
      
      if (jsonMatch) {
        try {
          p3Data = JSON.parse(jsonMatch[0]);
          
          // Validate that all required fields are present
          if (!p3Data.predict || !p3Data.prevent || !p3Data.protect) {
            throw new Error("Missing required fields in P3 data");
          }
        } catch (innerError) {
          console.error("JSON parsing error:", innerError);
          throw innerError;
        }
      } else {
        // If no JSON-like content is found, just use the raw content
        // Split the content into thirds for the three sections
        const contentParts = content.split(/\n\n/).filter(part => part.trim());
        const predictPart = contentParts.slice(0, Math.floor(contentParts.length / 3)).join('\n\n');
        const preventPart = contentParts.slice(Math.floor(contentParts.length / 3), Math.floor(2 * contentParts.length / 3)).join('\n\n');
        const protectPart = contentParts.slice(Math.floor(2 * contentParts.length / 3)).join('\n\n');
        
        p3Data = {
          predict: `<h3>Risk Analysis</h3><p>${predictPart}</p>`,
          prevent: `<h3>Prevention Strategies</h3><p>${preventPart}</p>`,
          protect: `<h3>Protection Recommendations</h3><p>${protectPart}</p>`
        };
      }
      
      return p3Data;
    } catch (error) {
      console.error("Failed to parse P3 recommendations:", error);
      console.log("Raw content:", content);
      
      // Fallback with a structured error response
      return {
        predict: "<h3>Risk Analysis</h3><p>We encountered an issue processing the risk analysis. The AI model didn't return properly structured data. Please try again with more specific parameters.</p>",
        prevent: "<h3>Prevention Strategies</h3><p>We encountered an issue generating prevention strategies. The AI model didn't return properly structured data. Please try again with more specific parameters.</p>",
        protect: "<h3>Protection Recommendations</h3><p>We encountered an issue developing protection recommendations. The AI model didn't return properly structured data. Please try again with more specific parameters.</p>"
      };
    }
  } catch (error) {
    console.error("Error calling OpenRouter AI API for P3:", error);
    throw new Error(`Failed to get P3 recommendations: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getMistralInsights(
  countryCode: string,
  countryInfo: any,
  economicData: any,
  newsArticles: NewsItem[],
  query: string,
  isFollowUp = false
): Promise<MistralInsights> {
  // Fallback content in case of API failure
  const fallbackContent = `
<h2>Analysis of ${countryInfo.name} - ${query}</h2>
<p>Here is an overview of ${countryInfo.name} based on the available data:</p>

<h3>Economic Overview</h3>
<p>GDP: ${economicData.gdp || 'Data not available'}</p>
<p>GDP Per Capita: ${economicData.gdpPerCapita || 'Data not available'}</p>

<h3>Key Insights</h3>
<ul>
  <li>Economic indicators suggest ${countryInfo.name} has a ${economicData.gdpGrowth !== undefined ? (economicData.gdpGrowth > 0 ? 'growing' : 'challenging') : 'developing'} economy.</li>
  <li>Recent news indicates there may be opportunities in several sectors.</li>
  <li>Consider consulting more detailed analysis for investment decisions.</li>
</ul>
`;

  // Fallback questions
  const fallbackQuestions = [
    { question: `What are the major economic sectors in ${countryInfo.name}?` },
    { question: `How has COVID-19 impacted ${countryInfo.name}'s economy?` },
    { question: `What are the key investment risks in ${countryInfo.name}?` }
  ];
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured");
  }

  try {
    // Prepare data for the prompt
    const countryInfoStr = JSON.stringify(countryInfo, null, 2);
    const economicDataStr = JSON.stringify(economicData, null, 2);
    
    // Format news data - limited to avoid too large tokens
    const formattedNews = newsArticles.slice(0, 5).map(article => ({
      title: article.title,
      source: article.source,
      description: article.description
    }));
    const newsDataStr = JSON.stringify(formattedNews, null, 2);

    // Create prompt based on whether this is a follow-up question
    let prompt: string;
    
    if (isFollowUp) {
      prompt = `
You are an expert global analyst with access to economic data and country information.
A user is asking a follow-up question about ${countryInfo.name}.

Country Information:
${countryInfoStr}

Economic Data:
${economicDataStr}

User's Question:
${query}

Please provide a detailed, insightful response to the user's question based on the provided data.
Format your response using simple HTML elements like <h3>, <p>, <ul>, and <li> for better readability.
`;
    } else {
      prompt = `
You are an expert global analyst with access to economic data, news, and country information.
You need to provide an in-depth analysis of ${countryInfo.name} based on the following data and the user's query.

Country Information:
${countryInfoStr}

Economic Data:
${economicDataStr}

Recent News:
${newsDataStr}

User's Query:
${query}

Please provide:
1. A comprehensive analysis addressing the user's query
2. Key insights based on the economic data
3. Relevant connections to recent news events
4. Any notable trends or patterns you observe

Format your response using simple HTML elements like <h2>, <h3>, <p>, <ul>, and <li> for better readability.

After your analysis, please return three follow-up questions that the user might want to ask next.
IMPORTANT: Format your entire response as a JSON object with this exact structure:

{
  "analysis": "Your full HTML-formatted analysis here...",
  "followUpQuestions": [
    {"question": "First follow-up question?"},
    {"question": "Second follow-up question?"},
    {"question": "Third follow-up question?"}
  ]
}

Make sure to escape any quotes within your HTML analysis with backslashes.
`;
    }

    // Call OpenRouter API to access Mistral model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://replit.com', // Required by OpenRouter
        'X-Title': 'Country Analysis App'      // Helpful for OpenRouter stats
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct", // Access via OpenRouter
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as AIResponse;
    const content = data.choices[0].message.content;

    let analysis = content;
    let followUpQuestions: FollowUpQuestion[] = [];

    // Try to parse the response as JSON first
    if (!isFollowUp) {
      try {
        // Clean up the content before parsing
        // Remove any leading/trailing whitespace and unexpected characters
        let cleanedContent = content.trim();
        
        // Check if the content starts with a comma or other invalid characters
        if (cleanedContent.startsWith(',')) {
          cleanedContent = cleanedContent.substring(1).trim();
        }
        
        // Check for escape sequences that might be causing issues
        cleanedContent = cleanedContent.replace(/\\"/g, '"')
                                      .replace(/\\\\/g, '\\')
                                      .replace(/\\n/g, ' ');
        
        // Attempt multiple parsing strategies
        let parsedResponse = null;
        let parsingSucceeded = false;
        
        // Strategy 1: Direct parse if it's already valid JSON
        try {
          parsedResponse = JSON.parse(cleanedContent);
          parsingSucceeded = true;
        } catch (directParseError) {
          console.log("Direct JSON parse failed, trying alternative strategies");
          
          // Strategy 2: Look for JSON object within curly braces
          try {
            const jsonMatch = cleanedContent.match(/{[\s\S]*?}/);
            if (jsonMatch) {
              parsedResponse = JSON.parse(jsonMatch[0]);
              parsingSucceeded = true;
            } else {
              throw new Error("No JSON object found in content");
            }
          } catch (jsonMatchError) {
            console.log("JSON matching failed, trying final strategy");
            
            // Strategy 3: Remove any non-JSON parts at the beginning or end
            try {
              // Find the first '{' and last '}'
              const firstBrace = cleanedContent.indexOf('{');
              const lastBrace = cleanedContent.lastIndexOf('}');
              
              if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
                const jsonCandidate = cleanedContent.substring(firstBrace, lastBrace + 1);
                parsedResponse = JSON.parse(jsonCandidate);
                parsingSucceeded = true;
              } else {
                throw new Error("Could not extract valid JSON object");
              }
            } catch (extractError) {
              console.log("All JSON extraction strategies failed");
            }
          }
        }
        
        // Process the successfully parsed response
        if (parsingSucceeded && parsedResponse) {
          if (parsedResponse.analysis && parsedResponse.followUpQuestions) {
            // Successfully parsed the structured JSON
            analysis = parsedResponse.analysis;
            followUpQuestions = parsedResponse.followUpQuestions;
          } else if (parsedResponse.analysis) {
            // Has analysis but no questions
            analysis = parsedResponse.analysis;
            
            // Fallback questions
            followUpQuestions = [
              { question: `How does ${countryInfo.name}'s economy compare to neighboring countries?` },
              { question: `What are the main challenges facing ${countryInfo.name} in the next 5 years?` },
              { question: `What industries are growing fastest in ${countryInfo.name}?` }
            ];
          } else {
            // JSON exists but completely unexpected structure
            console.warn("JSON response has unexpected structure:", parsedResponse);
            
            // Use raw content or any fragment we can find
            analysis = parsedResponse.content || 
                     parsedResponse.text || 
                     parsedResponse.message || 
                     cleanedContent;
            
            // Default fallback questions
            followUpQuestions = [
              { question: `How does ${countryInfo.name}'s economy compare to neighboring countries?` },
              { question: `What are the main challenges facing ${countryInfo.name} in the next 5 years?` },
              { question: `What industries are growing fastest in ${countryInfo.name}?` }
            ];
          }
        } else {
          // All JSON parsing attempts failed, use the raw content but don't throw an error
          console.warn("JSON parsing failed with all strategies, using cleaned content");
          
          // Clean up the content further by removing any partial JSON
          let processedContent = cleanedContent;
            
          // Remove any JSON-like syntax that might confuse the frontend
          processedContent = processedContent.replace(/^\s*\{\s*/, "");  // Opening brace
          processedContent = processedContent.replace(/\s*\}\s*$/, "");  // Closing brace
          processedContent = processedContent.replace(/"analysis"\s*:\s*/, ""); // analysis field
          processedContent = processedContent.replace(/,\s*"followUpQuestions"\s*:.+$/, ""); // followUpQuestions field
            
          // Remove quotes at beginning and end if wrapped in quotes
          processedContent = processedContent.replace(/^"/, "");
          processedContent = processedContent.replace(/"$/, "");
            
          // Unescape special characters
          processedContent = processedContent.replace(/\\"/g, '"');
          processedContent = processedContent.replace(/\\n/g, '\n');
          processedContent = processedContent.replace(/\\t/g, '\t');
          
          analysis = processedContent;
        }
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        
        // Use the raw content without trying to parse it as JSON
        let processedContent = content
                         .replace(/```json/g, '')
                         .replace(/```/g, '')
                         .trim();
        
        // Apply the same cleanup as above
        processedContent = processedContent.replace(/^\s*\{\s*/, "");  // Opening brace
        processedContent = processedContent.replace(/\s*\}\s*$/, "");  // Closing brace
        processedContent = processedContent.replace(/"analysis"\s*:\s*/, ""); // analysis field
        processedContent = processedContent.replace(/,\s*"followUpQuestions"\s*:.+$/, ""); // followUpQuestions field
        
        // Remove quotes at beginning and end if wrapped in quotes
        processedContent = processedContent.replace(/^"/, "");
        processedContent = processedContent.replace(/"$/, "");
        
        // Unescape special characters
        processedContent = processedContent.replace(/\\n/g, '\n')
                         .replace(/\\"/g, '"')
                         .replace(/\\'/g, "'")
                         .replace(/\\\\/g, "\\");
                        
        analysis = processedContent;
        
        // Fallback questions when parsing fails
        followUpQuestions = [
          { question: `What is the investment outlook for ${countryInfo.name} in the next year?` },
          { question: `What are the biggest economic risks in ${countryInfo.name}?` },
          { question: `How does ${countryInfo.name}'s regulatory environment impact investors?` }
        ];
      }
    }

    return {
      analysis,
      followUpQuestions
    };
  } catch (error) {
    console.error("Error calling OpenRouter AI API:", error);
    
    // Instead of throwing, return our fallback content to ensure the frontend always has something to display
    console.log("Using fallback content for AI insights due to API error");
    return {
      analysis: fallbackContent,
      followUpQuestions: fallbackQuestions
    };
  }
}
