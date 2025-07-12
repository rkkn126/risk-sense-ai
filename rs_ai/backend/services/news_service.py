import os
import requests
from newsapi import NewsApiClient
from .cache_service import get_cached_data, set_cached_data

# Initialize NewsAPI client
news_api_key = os.environ.get('NEWS_API_KEY')
newsapi = NewsApiClient(api_key=news_api_key)

def get_news_articles(country_code, query):
    """
    Get news articles related to a country and query
    
    Args:
        country_code: ISO country code
        query: Search query
        
    Returns:
        List of news articles
    """
    cache_key = f"news_{country_code}_{query}"
    cached_data = get_cached_data(cache_key, 3600)  # Cache for 1 hour
    
    if cached_data:
        return cached_data
    
    try:
        # Get country name for better search results
        country_name = get_country_name(country_code)
        
        # Build search query
        search_query = f"{country_name} {query}"
        
        # Get articles from NewsAPI
        response = newsapi.get_everything(
            q=search_query,
            language='en',
            sort_by='relevancy',
            page=1,
            page_size=10
        )
        
        articles = []
        
        for article in response.get('articles', []):
            # Generate tags from title and description
            tags = generate_tags(
                article.get('title', ''),
                article.get('description', ''),
                query
            )
            
            # Format article data
            articles.append({
                'title': article.get('title'),
                'source': article.get('source', {}).get('name'),
                'date': article.get('publishedAt')[:10],  # YYYY-MM-DD
                'description': article.get('description'),
                'url': article.get('url'),
                'imageUrl': article.get('urlToImage'),
                'tags': tags
            })
        
        # Cache the result
        set_cached_data(cache_key, articles, 3600)  # Cache for 1 hour
        
        return articles
    except Exception as e:
        print(f"Error fetching news articles: {str(e)}")
        return []

def analyze_news_sentiment(articles):
    """
    Analyze sentiment of news articles
    
    Args:
        articles: List of news articles
        
    Returns:
        Sentiment analysis results
    """
    # In a real application, you would use a more sophisticated
    # sentiment analysis approach, possibly using an AI service
    
    # For this example, we'll use a simple approach
    positive_keywords = [
        'growth', 'profit', 'success', 'positive', 'increase',
        'improve', 'gain', 'benefit', 'opportunity', 'innovation'
    ]
    
    negative_keywords = [
        'decline', 'loss', 'fail', 'negative', 'decrease',
        'risk', 'threat', 'crisis', 'problem', 'debt'
    ]
    
    # Initialize counters
    positive_count = 0
    negative_count = 0
    neutral_count = 0
    
    # Count occurences of positive and negative keywords
    for article in articles:
        title = article.get('title', '').lower()
        description = article.get('description', '').lower()
        content = title + ' ' + description
        
        article_positive = 0
        article_negative = 0
        
        for keyword in positive_keywords:
            if keyword in content:
                article_positive += 1
        
        for keyword in negative_keywords:
            if keyword in content:
                article_negative += 1
        
        # Classify article sentiment
        if article_positive > article_negative:
            positive_count += 1
        elif article_negative > article_positive:
            negative_count += 1
        else:
            neutral_count += 1
    
    # Calculate percentages
    total = max(1, len(articles))  # Avoid division by zero
    positive_percent = round((positive_count / total) * 100)
    negative_percent = round((negative_count / total) * 100)
    neutral_percent = round((neutral_count / total) * 100)
    
    # Generate summary
    if positive_percent > negative_percent and positive_percent > neutral_percent:
        summary = "Generally positive sentiment in recent news coverage"
    elif negative_percent > positive_percent and negative_percent > neutral_percent:
        summary = "Predominantly negative sentiment in recent news coverage"
    else:
        summary = "Mostly neutral sentiment in recent news coverage"
    
    return {
        'positive': positive_percent,
        'negative': negative_percent,
        'neutral': neutral_percent,
        'summary': summary
    }

def generate_tags(title, description, query):
    """
    Generate tags from article title and description
    
    Args:
        title: Article title
        description: Article description
        query: Original search query
        
    Returns:
        List of tags
    """
    # Combine title and description
    text = (title + " " + description).lower()
    
    # Potential tag categories
    economic_tags = ['economy', 'gdp', 'growth', 'inflation', 'recession', 'market', 'trade']
    political_tags = ['government', 'policy', 'election', 'reform', 'regulation', 'law']
    business_tags = ['business', 'company', 'investment', 'startup', 'corporation', 'industry']
    social_tags = ['society', 'health', 'education', 'culture', 'employment', 'welfare']
    
    # Find matches
    tags = []
    
    # Add query as a tag if it's not too long
    if len(query) < 20:
        tags.append(query)
    
    # Check for tag matches
    for tag in economic_tags + political_tags + business_tags + social_tags:
        if tag in text and tag not in tags and len(tags) < 5:
            tags.append(tag)
    
    return tags

def get_country_name(country_code):
    """
    Get country name from country code
    
    Args:
        country_code: ISO country code
        
    Returns:
        Country name
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
        'MEX': 'Mexico'
    }
    
    return country_map.get(country_code, country_code)