import { config } from '../config/environment';
import { logger } from './logger';
import { performanceService } from './performance';

// Interface pour les métriques système
interface SystemMetrics {
  timestamp: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    fps: number;
    renderTime: number;
    loadTime: number;
  };
  user: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
  };
  errors: {
    count: number;
    rate: number;
    critical: number;
  };
}

// Interface pour les alertes
interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  metadata?: any;
}

// Interface pour les événements utilisateur
interface UserEvent {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: string;
  duration?: number;
  success: boolean;
  metadata?: any;
}

class MonitoringService {
  private metrics: SystemMetrics[] = [];
  private alerts: Alert[] = [];
  private userEvents: UserEvent[] = [];
  private maxMetrics = 1000;
  private maxAlerts = 500;
  private maxEvents = 2000;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor() {
    this.loadStoredData();
  }

  /**
   * Démarre le monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 30000); // Collecte toutes les 30 secondes

    logger.info('Monitoring démarré');
  }

  /**
   * Arrête le monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    logger.info('Monitoring arrêté');
  }

  /**
   * Collecte les métriques système
   */
  private collectMetrics(): void {
    try {
      const metrics: SystemMetrics = {
        timestamp: new Date().toISOString(),
        memory: this.getMemoryMetrics(),
        performance: this.getPerformanceMetrics(),
        user: this.getUserMetrics(),
        errors: this.getErrorMetrics()
      };

      this.metrics.push(metrics);
      this.cleanupMetrics();

      // Vérifier les seuils d'alerte
      this.checkAlertThresholds(metrics);

      // Sauvegarder les métriques
      this.saveMetrics();

    } catch (error) {
      logger.error('Erreur lors de la collecte des métriques', { error });
    }
  }

  /**
   * Obtient les métriques de mémoire
   */
  private getMemoryMetrics(): SystemMetrics['memory'] {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }

    // Fallback pour les navigateurs sans support memory
    return {
      used: 0,
      total: 0,
      percentage: 0
    };
  }

  /**
   * Obtient les métriques de performance
   */
  private getPerformanceMetrics(): SystemMetrics['performance'] {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

    return {
      fps: this.calculateFPS(),
      renderTime: this.calculateRenderTime(),
      loadTime
    };
  }

  /**
   * Calcule le FPS
   */
  private calculateFPS(): number {
    // Implémentation simplifiée du calcul FPS
    return 60; // Placeholder
  }

  /**
   * Calcule le temps de rendu
   */
  private calculateRenderTime(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (firstContentfulPaint) {
      return firstContentfulPaint.startTime;
    }
    
    if (firstPaint) {
      return firstPaint.startTime;
    }
    
    return 0;
  }

  /**
   * Obtient les métriques utilisateur
   */
  private getUserMetrics(): SystemMetrics['user'] {
    // Récupérer depuis le localStorage ou d'autres sources
    const activeUsers = this.getActiveUsersCount();
    const sessions = this.getSessionsCount();
    const pageViews = this.getPageViewsCount();

    return {
      activeUsers,
      sessions,
      pageViews
    };
  }

  /**
   * Obtient le nombre d'utilisateurs actifs
   */
  private getActiveUsersCount(): number {
    try {
      const sessions = JSON.parse(localStorage.getItem('ediba.user.sessions') || '[]');
      const now = Date.now();
      const activeThreshold = 5 * 60 * 1000; // 5 minutes
      
      return sessions.filter((session: any) => 
        now - new Date(session.lastActivity).getTime() < activeThreshold
      ).length;
    } catch {
      return 0;
    }
  }

  /**
   * Obtient le nombre de sessions
   */
  private getSessionsCount(): number {
    try {
      const sessions = JSON.parse(localStorage.getItem('ediba.user.sessions') || '[]');
      return sessions.length;
    } catch {
      return 0;
    }
  }

  /**
   * Obtient le nombre de vues de page
   */
  private getPageViewsCount(): number {
    try {
      const pageViews = JSON.parse(localStorage.getItem('ediba.analytics.page_views') || '[]');
      return pageViews.length;
    } catch {
      return 0;
    }
  }

  /**
   * Obtient les métriques d'erreurs
   */
  private getErrorMetrics(): SystemMetrics['errors'] {
    const errorLogs = this.getErrorLogs();
    const totalErrors = errorLogs.length;
    const criticalErrors = errorLogs.filter(log => log.level === 'error').length;
    const errorRate = this.calculateErrorRate();

    return {
      count: totalErrors,
      rate: errorRate,
      critical: criticalErrors
    };
  }

  /**
   * Obtient les logs d'erreurs
   */
  private getErrorLogs(): any[] {
    try {
      const logs = JSON.parse(localStorage.getItem('ediba.logs') || '[]');
      return logs.filter((log: any) => log.level === 'error' || log.level === 'warn');
    } catch {
      return [];
    }
  }

  /**
   * Calcule le taux d'erreur
   */
  private calculateErrorRate(): number {
    const errorLogs = this.getErrorLogs();
    const totalLogs = this.getTotalLogs();
    
    if (totalLogs === 0) return 0;
    
    return (errorLogs.length / totalLogs) * 100;
  }

  /**
   * Obtient le nombre total de logs
   */
  private getTotalLogs(): number {
    try {
      const logs = JSON.parse(localStorage.getItem('ediba.logs') || '[]');
      return logs.length;
    } catch {
      return 0;
    }
  }

  /**
   * Vérifie les seuils d'alerte
   */
  private checkAlertThresholds(metrics: SystemMetrics): void {
    // Alerte pour utilisation mémoire élevée
    if (metrics.memory.percentage > 80) {
      this.createAlert({
        type: 'warning',
        title: 'Utilisation mémoire élevée',
        message: `Utilisation mémoire: ${metrics.memory.percentage.toFixed(1)}%`,
        severity: 'medium',
        metadata: { memory: metrics.memory }
      });
    }

    // Alerte pour taux d'erreur élevé
    if (metrics.errors.rate > 10) {
      this.createAlert({
        type: 'error',
        title: 'Taux d\'erreur élevé',
        message: `Taux d'erreur: ${metrics.errors.rate.toFixed(1)}%`,
        severity: 'high',
        metadata: { errors: metrics.errors }
      });
    }

    // Alerte pour erreurs critiques
    if (metrics.errors.critical > 5) {
      this.createAlert({
        type: 'error',
        title: 'Erreurs critiques détectées',
        message: `${metrics.errors.critical} erreurs critiques`,
        severity: 'critical',
        metadata: { criticalErrors: metrics.errors.critical }
      });
    }
  }

  /**
   * Crée une alerte
   */
  createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alertData
    };

    this.alerts.push(alert);
    this.cleanupAlerts();

    logger.warn(`Alerte créée: ${alert.title}`, { alert });

    // Sauvegarder les alertes
    this.saveAlerts();
  }

  /**
   * Résout une alerte
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      logger.info(`Alerte résolue: ${alert.title}`, { alertId });
      this.saveAlerts();
    }
  }

  /**
   * Enregistre un événement utilisateur
   */
  recordUserEvent(userId: string, action: string, module: string, success: boolean, metadata?: any): void {
    const event: UserEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      module,
      timestamp: new Date().toISOString(),
      success,
      metadata
    };

    this.userEvents.push(event);
    this.cleanupUserEvents();

    logger.info(`Événement utilisateur enregistré: ${action}`, { userId, module, success });

    // Sauvegarder les événements
    this.saveUserEvents();
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
   * Nettoie les anciennes alertes
   */
  private cleanupAlerts(): void {
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }
  }

  /**
   * Nettoie les anciens événements
   */
  private cleanupUserEvents(): void {
    if (this.userEvents.length > this.maxEvents) {
      this.userEvents = this.userEvents.slice(-this.maxEvents);
    }
  }

  /**
   * Sauvegarde les métriques
   */
  private saveMetrics(): void {
    try {
      localStorage.setItem('ediba.monitoring.metrics', JSON.stringify(this.metrics));
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des métriques', { error });
    }
  }

  /**
   * Sauvegarde les alertes
   */
  private saveAlerts(): void {
    try {
      localStorage.setItem('ediba.monitoring.alerts', JSON.stringify(this.alerts));
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des alertes', { error });
    }
  }

  /**
   * Sauvegarde les événements utilisateur
   */
  private saveUserEvents(): void {
    try {
      localStorage.setItem('ediba.monitoring.user_events', JSON.stringify(this.userEvents));
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des événements utilisateur', { error });
    }
  }

  /**
   * Charge les données stockées
   */
  private loadStoredData(): void {
    try {
      const storedMetrics = localStorage.getItem('ediba.monitoring.metrics');
      if (storedMetrics) {
        this.metrics = JSON.parse(storedMetrics);
      }

      const storedAlerts = localStorage.getItem('ediba.monitoring.alerts');
      if (storedAlerts) {
        this.alerts = JSON.parse(storedAlerts);
      }

      const storedEvents = localStorage.getItem('ediba.monitoring.user_events');
      if (storedEvents) {
        this.userEvents = JSON.parse(storedEvents);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des données de monitoring', { error });
    }
  }

  /**
   * Obtient les métriques récentes
   */
  getRecentMetrics(hours: number = 24): SystemMetrics[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.metrics.filter(metric => 
      new Date(metric.timestamp).getTime() > cutoff
    );
  }

  /**
   * Obtient les alertes non résolues
   */
  getUnresolvedAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Obtient les événements utilisateur récents
   */
  getRecentUserEvents(hours: number = 24): UserEvent[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.userEvents.filter(event => 
      new Date(event.timestamp).getTime() > cutoff
    );
  }

  /**
   * Génère un rapport de monitoring
   */
  generateReport(): any {
    const recentMetrics = this.getRecentMetrics(24);
    const unresolvedAlerts = this.getUnresolvedAlerts();
    const recentEvents = this.getRecentUserEvents(24);

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalMetrics: this.metrics.length,
        totalAlerts: this.alerts.length,
        totalEvents: this.userEvents.length,
        unresolvedAlerts: unresolvedAlerts.length
      },
      recentMetrics: recentMetrics.slice(-10),
      alerts: unresolvedAlerts,
      events: recentEvents.slice(-50),
      performance: performanceService.generateReport()
    };
  }

  /**
   * Exporte les données de monitoring
   */
  exportData(format: 'json' | 'csv' = 'json'): string {
    const report = this.generateReport();
    
    if (format === 'csv') {
      // Implémentation CSV simplifiée
      return JSON.stringify(report, null, 2);
    }
    
    return JSON.stringify(report, null, 2);
  }
}

// Instance singleton
export const monitoringService = new MonitoringService();

// Hook pour utiliser le service de monitoring
export const useMonitoring = () => {
  return {
    startMonitoring: monitoringService.startMonitoring.bind(monitoringService),
    stopMonitoring: monitoringService.stopMonitoring.bind(monitoringService),
    createAlert: monitoringService.createAlert.bind(monitoringService),
    resolveAlert: monitoringService.resolveAlert.bind(monitoringService),
    recordUserEvent: monitoringService.recordUserEvent.bind(monitoringService),
    getRecentMetrics: monitoringService.getRecentMetrics.bind(monitoringService),
    getUnresolvedAlerts: monitoringService.getUnresolvedAlerts.bind(monitoringService),
    getRecentUserEvents: monitoringService.getRecentUserEvents.bind(monitoringService),
    generateReport: monitoringService.generateReport.bind(monitoringService),
    exportData: monitoringService.exportData.bind(monitoringService)
  };
};
