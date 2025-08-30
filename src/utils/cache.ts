// Caching system for improved performance

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // Set cache item with TTL
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  // Get cache item if not expired
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Delete cache item
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clear expired items
  clearExpired(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const items = Array.from(this.cache.values());
    
    return {
      totalItems: items.length,
      expiredItems: items.filter(item => now > item.expiresAt).length,
      validItems: items.filter(item => now <= item.expiresAt).length,
      oldestItem: items.length > 0 ? Math.min(...items.map(item => item.timestamp)) : null,
      newestItem: items.length > 0 ? Math.max(...items.map(item => item.timestamp)) : null
    };
  }

  // Cached fetch wrapper
  async cachedFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }

  // Preload data
  async preload<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<void> {
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
    } catch (error) {
      console.warn(`Failed to preload cache key: ${key}`, error);
    }
  }
}

export const cache = new CacheManager();

// Specific cache keys for the application
export const CACHE_KEYS = {
  PHONE_STATS: 'phone_stats',
  ALL_PHONES: 'all_phones',
  SEARCH_RESULTS: (imei: string) => `search_${imei}`,
  GEOLOCATION: (lat: number, lng: number) => `geo_${lat}_${lng}`,
  USER_LOCATION: 'user_location'
};

// Cache TTL configurations (in milliseconds)
export const CACHE_TTL = {
  PHONE_STATS: 2 * 60 * 1000, // 2 minutes
  ALL_PHONES: 1 * 60 * 1000, // 1 minute
  SEARCH_RESULTS: 5 * 60 * 1000, // 5 minutes
  GEOLOCATION: 10 * 60 * 1000, // 10 minutes
  USER_LOCATION: 30 * 60 * 1000 // 30 minutes
};