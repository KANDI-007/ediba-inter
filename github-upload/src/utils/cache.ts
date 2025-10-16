import { config } from '../config/environment';
import { logger } from './logger';

// Interface pour les entrées de cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

// Interface pour les options de cache
interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  maxSize?: number; // Taille maximale du cache
  strategy?: 'lru' | 'fifo' | 'lfu'; // Stratégie d'éviction
}

// Interface pour les statistiques de cache
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  memoryUsage: number;
}

class CacheService<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private stats = {
    hits: 0,
    misses: 0
  };
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes par défaut
      maxSize: options.maxSize || 1000,
      strategy: options.strategy || 'lru'
    };
  }

  /**
   * Met une valeur en cache
   */
  set(key: string, value: T, customTTL?: number): void {
    const ttl = customTTL || this.options.ttl;
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now
    };

    // Vérifier la taille du cache
    if (this.cache.size >= this.options.maxSize) {
      this.evictEntry();
    }

    this.cache.set(key, entry);
    logger.debug(`Cache set: ${key}`, { ttl, size: this.cache.size });
  }

  /**
   * Récupère une valeur du cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    const now = Date.now();
    
    // Vérifier l'expiration
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;
    
    logger.debug(`Cache hit: ${key}`, { 
      accessCount: entry.accessCount,
      age: now - entry.timestamp 
    });

    return entry.data;
  }

  /**
   * Vérifie si une clé existe dans le cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  /**
   * Vide le cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
    logger.info('Cache cleared');
  }

  /**
   * Nettoie les entrées expirées
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info(`Cache cleanup: ${cleanedCount} expired entries removed`);
    }
    
    return cleanedCount;
  }

  /**
   * Évince une entrée selon la stratégie
   */
  private evictEntry(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;

    switch (this.options.strategy) {
      case 'lru':
        // Least Recently Used
        keyToEvict = Array.from(this.cache.entries())
          .reduce((oldest, [key, entry]) => 
            entry.lastAccessed < oldest[1].lastAccessed ? [key, entry] : oldest
          )[0];
        break;
        
      case 'lfu':
        // Least Frequently Used
        keyToEvict = Array.from(this.cache.entries())
          .reduce((least, [key, entry]) => 
            entry.accessCount < least[1].accessCount ? [key, entry] : least
          )[0];
        break;
        
      case 'fifo':
        // First In, First Out
        keyToEvict = Array.from(this.cache.entries())
          .reduce((oldest, [key, entry]) => 
            entry.timestamp < oldest[1].timestamp ? [key, entry] : oldest
          )[0];
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      logger.debug(`Cache evicted: ${keyToEvict} (${this.options.strategy})`);
    }
  }

  /**
   * Obtient les statistiques du cache
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    // Estimation de l'utilisation mémoire
    const memoryUsage = this.cache.size * 1024; // Estimation approximative
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate,
      memoryUsage
    };
  }

  /**
   * Obtient toutes les clés du cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtient la taille du cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Exporte le cache
   */
  export(): string {
    const data = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      data: entry.data,
      timestamp: entry.timestamp,
      expiresAt: entry.expiresAt,
      accessCount: entry.accessCount,
      lastAccessed: entry.lastAccessed
    }));
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Importe un cache
   */
  import(data: string): void {
    try {
      const entries = JSON.parse(data);
      this.cache.clear();
      
      entries.forEach((entry: any) => {
        this.cache.set(entry.key, {
          data: entry.data,
          timestamp: entry.timestamp,
          expiresAt: entry.expiresAt,
          accessCount: entry.accessCount,
          lastAccessed: entry.lastAccessed
        });
      });
      
      logger.info(`Cache imported: ${entries.length} entries`);
    } catch (error) {
      logger.error('Erreur lors de l\'import du cache', { error });
    }
  }
}

// Instances de cache spécialisées
export const documentCache = new CacheService<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 500,
  strategy: 'lru'
});

export const userCache = new CacheService<any>({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 100,
  strategy: 'lru'
});

export const reportCache = new CacheService<any>({
  ttl: 60 * 60 * 1000, // 1 heure
  maxSize: 50,
  strategy: 'lfu'
});

// Hook pour utiliser le cache
export const useCache = <T = any>(options?: CacheOptions) => {
  const cache = new CacheService<T>(options);
  
  return {
    set: cache.set.bind(cache),
    get: cache.get.bind(cache),
    has: cache.has.bind(cache),
    delete: cache.delete.bind(cache),
    clear: cache.clear.bind(cache),
    cleanup: cache.cleanup.bind(cache),
    getStats: cache.getStats.bind(cache),
    keys: cache.keys.bind(cache),
    size: cache.size.bind(cache),
    export: cache.export.bind(cache),
    import: cache.import.bind(cache)
  };
};

// Hook pour le cache de documents
export const useDocumentCache = () => {
  return {
    setDocument: (id: string, document: any) => documentCache.set(id, document),
    getDocument: (id: string) => documentCache.get(id),
    hasDocument: (id: string) => documentCache.has(id),
    deleteDocument: (id: string) => documentCache.delete(id),
    clearDocuments: () => documentCache.clear(),
    getDocumentStats: () => documentCache.getStats()
  };
};

// Hook pour le cache des utilisateurs
export const useUserCache = () => {
  return {
    setUser: (id: string, user: any) => userCache.set(id, user),
    getUser: (id: string) => userCache.get(id),
    hasUser: (id: string) => userCache.has(id),
    deleteUser: (id: string) => userCache.delete(id),
    clearUsers: () => userCache.clear(),
    getUserStats: () => userCache.getStats()
  };
};

// Hook pour le cache des rapports
export const useReportCache = () => {
  return {
    setReport: (id: string, report: any) => reportCache.set(id, report),
    getReport: (id: string) => reportCache.get(id),
    hasReport: (id: string) => reportCache.has(id),
    deleteReport: (id: string) => reportCache.delete(id),
    clearReports: () => reportCache.clear(),
    getReportStats: () => reportCache.getStats()
  };
};
