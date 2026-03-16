const CACHE_PREFIX = 'phone_cache_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage full — clear oldest entries
    clearExpiredCache();
    try {
      sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Still full — ignore
    }
  }
}

function clearExpiredCache(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const entry = JSON.parse(sessionStorage.getItem(key)!);
        if (Date.now() - entry.timestamp > entry.ttl) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }
  }
  keysToRemove.forEach((k) => sessionStorage.removeItem(k));
}
