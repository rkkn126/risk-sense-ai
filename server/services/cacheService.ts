/**
 * Simple in-memory cache service
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry<any>;
}

// Default cache duration: 1 hour
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000;

// Main cache storage
const memoryCache: Cache = {};

export function getCachedData<T>(
  cacheKey: string,
  cacheDuration: number = DEFAULT_CACHE_DURATION
): T | null {
  const cachedEntry = memoryCache[cacheKey];
  
  if (!cachedEntry) {
    return null;
  }
  
  // Check if the cached data is still valid
  if (Date.now() - cachedEntry.timestamp > cacheDuration) {
    // Expired - remove it from cache
    delete memoryCache[cacheKey];
    return null;
  }
  
  // Return valid cached data
  return cachedEntry.data;
}

export function setCachedData<T>(
  cacheKey: string,
  data: T
): void {
  memoryCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
}

export function clearCache(keyPrefix?: string): void {
  if (keyPrefix) {
    // Clear only keys with matching prefix
    Object.keys(memoryCache).forEach(key => {
      if (key.startsWith(keyPrefix)) {
        delete memoryCache[key];
      }
    });
  } else {
    // Clear entire cache
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });
  }
}

export function getCacheStats(): { size: number, keys: string[] } {
  return {
    size: Object.keys(memoryCache).length,
    keys: Object.keys(memoryCache)
  };
}