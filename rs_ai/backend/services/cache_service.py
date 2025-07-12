import time

# Simple in-memory cache
cache = {}

def get_cached_data(key, max_age=3600):
    """
    Get data from cache if it exists and is not expired
    
    Args:
        key: Cache key
        max_age: Maximum age of cached data in seconds (default: 1 hour)
        
    Returns:
        Cached data or None if not found or expired
    """
    if key in cache:
        cached_item = cache[key]
        current_time = time.time()
        
        # Check if cache is expired
        if current_time - cached_item['timestamp'] < max_age:
            return cached_item['data']
    
    return None

def set_cached_data(key, data, max_age=3600):
    """
    Store data in cache
    
    Args:
        key: Cache key
        data: Data to store
        max_age: Maximum age of cached data in seconds (default: 1 hour)
    """
    cache[key] = {
        'data': data,
        'timestamp': time.time(),
        'max_age': max_age
    }

def clear_cache(key_prefix=None):
    """
    Clear cache entries
    
    Args:
        key_prefix: If provided, only clear entries that start with this prefix
    """
    if key_prefix is None:
        cache.clear()
    else:
        keys_to_remove = [k for k in cache.keys() if k.startswith(key_prefix)]
        for key in keys_to_remove:
            del cache[key]

def get_cache_stats():
    """
    Get statistics about the cache
    
    Returns:
        Dictionary with cache statistics
    """
    return {
        'size': len(cache),
        'keys': list(cache.keys())
    }