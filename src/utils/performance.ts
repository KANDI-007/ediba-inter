import { logger } from './logger';

// Interface pour les métriques de performance
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: any;
}

// Interface pour les rapports de performance
interface PerformanceReport {
  timestamp: string;
  metrics: PerformanceMetric[];
  summary: {
    totalDuration: number;
    averageDuration: number;
    slowestOperation: string;
    fastestOperation: string;
  };
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private activeTimers: Map<string, number> = new Map();
  private maxMetrics = 1000;

  /**
   * Démarre un timer de performance
   */
  startTimer(name: string, metadata?: any): void {
    const startTime = performance.now();
    this.activeTimers.set(name, startTime);
    
    this.metrics.push({
      name,
      startTime,
      metadata
    });

    logger.debug(`Timer démarré: ${name}`, { metadata });
  }

  /**
   * Arrête un timer de performance
   */
  endTimer(name: string): number | null {
    const startTime = this.activeTimers.get(name);
    if (!startTime) {
      logger.warn(`Timer non trouvé: ${name}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Mettre à jour la métrique
    const metric = this.metrics.find(m => m.name === name && !m.endTime);
    if (metric) {
      metric.endTime = endTime;
      metric.duration = duration;
    }

    this.activeTimers.delete(name);

    logger.debug(`Timer arrêté: ${name}`, { duration: `${duration.toFixed(2)}ms` });

    // Nettoyer les anciennes métriques
    this.cleanupMetrics();

    return duration;
  }

  /**
   * Mesure une fonction
   */
  async measureFunction<T>(
    name: string, 
    fn: () => Promise<T> | T, 
    metadata?: any
  ): Promise<T> {
    this.startTimer(name, metadata);
    
    try {
      const result = await fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      logger.error(`Erreur dans la fonction mesurée: ${name}`, { error });
      throw error;
    }
  }

  /**
   * Mesure le rendu d'un composant
   */
  measureComponentRender(componentName: string, renderFn: () => void): void {
    this.startTimer(`render_${componentName}`);
    renderFn();
    this.endTimer(`render_${componentName}`);
  }

  /**
   * Mesure une requête réseau
   */
  measureNetworkRequest(url: string, requestFn: () => Promise<any>): Promise<any> {
    return this.measureFunction(`network_${url}`, requestFn, { url });
  }

  /**
   * Mesure une opération de base de données
   */
  measureDatabaseOperation(operation: string, operationFn: () => Promise<any>): Promise<any> {
    return this.measureFunction(`db_${operation}`, operationFn, { operation });
  }

  /**
   * Obtient les métriques de performance
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Génère un rapport de performance
   */
  generateReport(): PerformanceReport {
    const completedMetrics = this.metrics.filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return {
        timestamp: new Date().toISOString(),
        metrics: [],
        summary: {
          totalDuration: 0,
          averageDuration: 0,
          slowestOperation: '',
          fastestOperation: ''
        }
      };
    }

    const totalDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const averageDuration = totalDuration / completedMetrics.length;
    
    const slowest = completedMetrics.reduce((max, m) => 
      (m.duration || 0) > (max.duration || 0) ? m : max
    );
    
    const fastest = completedMetrics.reduce((min, m) => 
      (m.duration || Infinity) < (min.duration || Infinity) ? m : min
    );

    return {
      timestamp: new Date().toISOString(),
      metrics: completedMetrics,
      summary: {
        totalDuration,
        averageDuration,
        slowestOperation: slowest.name,
        fastestOperation: fastest.name
      }
    };
  }

  /**
   * Nettoie les anciennes métriques
   */
  private cleanupMetrics(): void {
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Réinitialise les métriques
   */
  reset(): void {
    this.metrics = [];
    this.activeTimers.clear();
    logger.info('Métriques de performance réinitialisées');
  }

  /**
   * Exporte les métriques
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const report = this.generateReport();
    
    if (format === 'csv') {
      const headers = 'Name,StartTime,EndTime,Duration,Metadata\n';
      const csvData = report.metrics.map(m => 
        `"${m.name}","${m.startTime}","${m.endTime || ''}","${m.duration || ''}","${JSON.stringify(m.metadata || {})}"`
      ).join('\n');
      
      return headers + csvData;
    }
    
    return JSON.stringify(report, null, 2);
  }
}

// Instance singleton
export const performanceService = new PerformanceService();

// Hook pour utiliser le service de performance
export const usePerformance = () => {
  return {
    startTimer: performanceService.startTimer.bind(performanceService),
    endTimer: performanceService.endTimer.bind(performanceService),
    measureFunction: performanceService.measureFunction.bind(performanceService),
    measureComponentRender: performanceService.measureComponentRender.bind(performanceService),
    measureNetworkRequest: performanceService.measureNetworkRequest.bind(performanceService),
    measureDatabaseOperation: performanceService.measureDatabaseOperation.bind(performanceService),
    getMetrics: performanceService.getMetrics.bind(performanceService),
    generateReport: performanceService.generateReport.bind(performanceService),
    reset: performanceService.reset.bind(performanceService),
    exportMetrics: performanceService.exportMetrics.bind(performanceService)
  };
};

// HOC pour mesurer les performances des composants
export const withPerformance = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const { measureComponentRender } = usePerformance();
    
    return measureComponentRender(componentName, () => {
      return <Component {...props} />;
    });
  });
};

// Hook pour mesurer les performances des hooks
export const usePerformanceHook = (hookName: string) => {
  const { startTimer, endTimer } = usePerformance();
  
  return {
    measureHook: <T>(hookFn: () => T): T => {
      startTimer(`hook_${hookName}`);
      const result = hookFn();
      endTimer(`hook_${hookName}`);
      return result;
    }
  };
};
