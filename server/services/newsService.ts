import fetch from 'node-fetch';
import { NewsItem, NewsSentiment } from '@shared/schema';
import { getMistralInsights } from './mistralService';

// Get API key from environment variable
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

// Get news articles for a country
export async function getNewsArticles(countryCode: string, query: string): Promise<NewsItem[]> {
  try {
    if (!NEWS_API_KEY) {
      throw new Error("News API key is not configured");
    }
    
    // Get country name from the World Bank API
    const countryResponse = await fetch(`https://api.worldbank.org/v2/country/${countryCode}?format=json`);
    const countryData = await countryResponse.json();
    const countryName = countryData[1][0].name;
    
    // Prepare search query
    const searchQuery = `${countryName} ${query}`;
    
    // Call News API
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&language=en&pageSize=10`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // When no articles were found
    if (!data.articles || data.articles.length === 0) {
      return [];
    }
    
    // Format articles for our app
    return data.articles.map((article: any) => {
      // Generate tags based on article content
      const tags = generateTags(article.title, article.description, query);
      
      // Format the date
      const publishedDate = new Date(article.publishedAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let formattedDate;
      if (diffDays === 0) {
        formattedDate = "Today";
      } else if (diffDays === 1) {
        formattedDate = "Yesterday";
      } else if (diffDays < 7) {
        formattedDate = `${diffDays} days ago`;
      } else if (diffDays < 30) {
        formattedDate = `${Math.floor(diffDays / 7)} weeks ago`;
      } else {
        formattedDate = publishedDate.toLocaleDateString();
      }
      
      return {
        title: article.title,
        source: article.source.name,
        date: formattedDate,
        description: article.description || "No description available",
        url: article.url,
        imageUrl: article.urlToImage,
        tags
      };
    });
  } catch (error) {
    console.error("Error fetching news articles:", error);
    throw error;
  }
}

// Generate tags based on article content
function generateTags(title: string, description: string, query: string): string[] {
  const content = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  
  // Economic keywords
  if (content.includes('economy') || content.includes('economic') || content.includes('gdp') || 
      content.includes('growth') || content.includes('recession')) {
    tags.push('Economy');
  }
  
  // Technology keywords
  if (content.includes('tech') || content.includes('technology') || content.includes('digital') || 
      content.includes('innovation') || content.includes('startup')) {
    tags.push('Technology');
  }
  
  // Policy keywords
  if (content.includes('policy') || content.includes('regulation') || content.includes('law') || 
      content.includes('government') || content.includes('reform')) {
    tags.push('Monetary Policy');
  }
  
  // Real estate keywords
  if (content.includes('real estate') || content.includes('housing') || content.includes('property') || 
      content.includes('mortgage') || content.includes('home')) {
    tags.push('Real Estate');
  }
  
  // Employment keywords
  if (content.includes('job') || content.includes('employment') || content.includes('unemployment') || 
      content.includes('labor') || content.includes('workforce')) {
    tags.push('Employment');
  }
  
  // Trade keywords
  if (content.includes('trade') || content.includes('export') || content.includes('import') || 
      content.includes('tariff') || content.includes('global')) {
    tags.push('Trade');
  }
  
  // If no tags were found, add a general one based on the query
  if (tags.length === 0) {
    // Extract main topic from query
    const queryWords = query.split(' ');
    const mainTopic = queryWords.find(word => word.length > 3) || 'General';
    tags.push(mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1));
  }
  
  return tags;
}

// Analyze news sentiment
export async function analyzeNewsSentiment(articles: NewsItem[]): Promise<NewsSentiment> {
  try {
    if (articles.length === 0) {
      return {
        neutral: 60,
        positive: 20,
        negative: 20,
        summary: "No recent news articles were found for analysis."
      };
    }
    
    // This would normally use NLP or the Mistral API for sentiment analysis
    // For this implementation, we'll use a simple rule-based approach
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    // Positive and negative keywords
    const positiveWords = ['growth', 'increase', 'gain', 'improved', 'positive', 'success', 'recovery', 'up', 
                         'rising', 'opportunity', 'profit', 'progress', 'strong', 'benefit', 'advance'];
    
    const negativeWords = ['decline', 'decrease', 'loss', 'crisis', 'concern', 'negative', 'fail', 'down', 
                          'falling', 'problem', 'deficit', 'weak', 'risk', 'threat', 'challenge'];
    
    // Count sentiment in each article
    articles.forEach(article => {
      const content = `${article.title} ${article.description}`.toLowerCase();
      
      let positiveScore = positiveWords.reduce((score, word) => {
        return score + (content.includes(word) ? 1 : 0);
      }, 0);
      
      let negativeScore = negativeWords.reduce((score, word) => {
        return score + (content.includes(word) ? 1 : 0);
      }, 0);
      
      if (positiveScore > negativeScore) {
        positive++;
      } else if (negativeScore > positiveScore) {
        negative++;
      } else {
        neutral++;
      }
    });
    
    // Calculate percentages
    const total = articles.length;
    const positivePercent = (positive / total) * 100;
    const negativePercent = (negative / total) * 100;
    const neutralPercent = (neutral / total) * 100;
    
    // Generate summary
    let sentimentTrend;
    if (positivePercent > 40) {
      sentimentTrend = "predominantly positive";
    } else if (negativePercent > 40) {
      sentimentTrend = "predominantly negative";
    } else {
      sentimentTrend = "mostly neutral";
    }
    
    const topicWords = articles.map(a => a.tags).flat();
    const topicCounts: Record<string, number> = {};
    
    topicWords.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    
    // Get top 3 topics
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
      
    const summary = `Recent news coverage shows ${sentimentTrend} sentiment (${Math.round(neutralPercent)}% neutral, ${Math.round(positivePercent)}% positive, ${Math.round(negativePercent)}% negative). Key topics in the reporting include ${topTopics.join(", ")}.`;
    
    return {
      neutral: neutralPercent,
      positive: positivePercent,
      negative: negativePercent,
      summary
    };
  } catch (error) {
    console.error("Error analyzing news sentiment:", error);
    
    // Return a default sentiment if analysis fails
    return {
      neutral: 60,
      positive: 20,
      negative: 20,
      summary: "Unable to perform sentiment analysis on the available news articles."
    };
  }
}
