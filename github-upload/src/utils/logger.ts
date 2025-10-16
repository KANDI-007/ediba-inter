import { config } from '../config/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  module?: string;
  action?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const currentLevel = this.getLogLevel(config.development.logLevel);
    return level >= currentLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    
    if (context) {
      return `[${timestamp}] ${levelName}: ${message} | Context: ${JSON.stringify(context)}`;
    }
    
    return `[${timestamp}] ${levelName}: ${message}`;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Sauvegarder dans localStorage pour persistance
    try {
      const existingLogs = JSON.parse(localStorage.getItem('ediba.logs') || '[]');
      const allLogs = [...existingLogs, entry];
      
      // Garder seulement les 500 derniers logs
      const recentLogs = allLogs.slice(-500);
      localStorage.setItem('ediba.logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }
  }

  debug(message: string, context?: any, userId?: string, module?: string, action?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
      userId,
      module,
      action
    };

    this.addLog(entry);
    
    if (config.development.debugMode) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: any, userId?: string, module?: string, action?: string): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
      userId,
      module,
      action
    };

    this.addLog(entry);
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: any, userId?: string, module?: string, action?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
      userId,
      module,
      action
    };

    this.addLog(entry);
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, context?: any, userId?: string, module?: string, action?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      context,
      userId,
      module,
      action
    };

    this.addLog(entry);
    console.error(this.formatMessage(LogLevel.ERROR, message, context));
  }

  // Méthodes utilitaires
  getLogs(level?: LogLevel, module?: string, userId?: string): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (module) {
      filteredLogs = filteredLogs.filter(log => log.module === module);
    }

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    return filteredLogs;
  }

  getLogsFromStorage(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('ediba.logs') || '[]');
    } catch (error) {
      this.error('Erreur lors de la lecture des logs depuis le stockage', { error });
      return [];
    }
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('ediba.logs');
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const allLogs = [...this.logs, ...this.getLogsFromStorage()];
    
    if (format === 'csv') {
      const headers = 'Timestamp,Level,Message,Context,UserId,Module,Action\n';
      const csvData = allLogs.map(log => 
        `"${log.timestamp}","${LogLevel[log.level]}","${log.message}","${JSON.stringify(log.context || {})}","${log.userId || ''}","${log.module || ''}","${log.action || ''}"`
      ).join('\n');
      
      return headers + csvData;
    }
    
    return JSON.stringify(allLogs, null, 2);
  }

  // Logs spécifiques à l'application
  logUserAction(userId: string, action: string, module: string, details?: any): void {
    this.info(`Action utilisateur: ${action}`, details, userId, module, action);
  }

  logSystemEvent(event: string, details?: any): void {
    this.info(`Événement système: ${event}`, details, undefined, 'system', event);
  }

  logError(error: Error, context?: any, userId?: string, module?: string): void {
    this.error(`Erreur: ${error.message}`, { 
      ...context, 
      stack: error.stack,
      name: error.name 
    }, userId, module, 'error');
  }

  logPerformance(operation: string, duration: number, context?: any): void {
    this.info(`Performance: ${operation} - ${duration}ms`, context, undefined, 'performance', operation);
  }
}

// Instance singleton
export const logger = new Logger();

// Hook pour utiliser le logger dans les composants React
export const useLogger = () => {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    logUserAction: logger.logUserAction.bind(logger),
    logSystemEvent: logger.logSystemEvent.bind(logger),
    logError: logger.logError.bind(logger),
    logPerformance: logger.logPerformance.bind(logger),
    getLogs: logger.getLogs.bind(logger),
    exportLogs: logger.exportLogs.bind(logger),
    clearLogs: logger.clearLogs.bind(logger)
  };
};