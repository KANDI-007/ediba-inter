import { config } from '../config/environment';
import { logger } from './logger';

// Interface pour les tentatives de connexion
interface LoginAttempt {
  ip: string;
  username: string;
  timestamp: number;
  success: boolean;
  userAgent?: string;
}

// Interface pour les règles de sécurité
interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  threshold: number;
  action: 'block' | 'warn' | 'log';
}

class SecurityService {
  private loginAttempts: LoginAttempt[] = [];
  private blockedIPs: Set<string> = new Set();
  private securityRules: SecurityRule[] = [];
  private maxAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private maxAttemptsPerHour = 10;

  constructor() {
    this.initializeSecurityRules();
    this.loadBlockedIPs();
  }

  /**
   * Initialise les règles de sécurité par défaut
   */
  private initializeSecurityRules(): void {
    this.securityRules = [
      {
        id: 'max_login_attempts',
        name: 'Tentatives de connexion excessives',
        description: 'Bloque après 5 tentatives échouées',
        enabled: true,
        threshold: 5,
        action: 'block'
      },
      {
        id: 'suspicious_activity',
        name: 'Activité suspecte',
        description: 'Détecte les activités anormales',
        enabled: true,
        threshold: 3,
        action: 'warn'
      },
      {
        id: 'data_export_limits',
        name: 'Limites d\'export de données',
        description: 'Limite les exports de données sensibles',
        enabled: true,
        threshold: 10,
        action: 'log'
      }
    ];
  }

  /**
   * Charge les IPs bloquées depuis le localStorage
   */
  private loadBlockedIPs(): void {
    try {
      const stored = localStorage.getItem('ediba.security.blocked_ips');
      if (stored) {
        const ips = JSON.parse(stored);
        this.blockedIPs = new Set(ips);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des IPs bloquées', { error });
    }
  }

  /**
   * Sauvegarde les IPs bloquées dans le localStorage
   */
  private saveBlockedIPs(): void {
    try {
      const ips = Array.from(this.blockedIPs);
      localStorage.setItem('ediba.security.blocked_ips', JSON.stringify(ips));
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des IPs bloquées', { error });
    }
  }

  /**
   * Enregistre une tentative de connexion
   */
  recordLoginAttempt(ip: string, username: string, success: boolean, userAgent?: string): void {
    const attempt: LoginAttempt = {
      ip,
      username,
      timestamp: Date.now(),
      success,
      userAgent
    };

    this.loginAttempts.push(attempt);

    // Nettoyer les anciennes tentatives (plus de 24h)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.loginAttempts = this.loginAttempts.filter(attempt => attempt.timestamp > oneDayAgo);

    // Vérifier les règles de sécurité
    this.checkSecurityRules(ip, username);

    // Sauvegarder les tentatives
    this.saveLoginAttempts();
  }

  /**
   * Vérifie les règles de sécurité
   */
  private checkSecurityRules(ip: string, username: string): void {
    const recentAttempts = this.getRecentAttempts(ip, 15 * 60 * 1000); // 15 minutes
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);

    // Règle: Trop de tentatives échouées
    if (failedAttempts.length >= this.maxAttempts) {
      this.blockIP(ip, 'Trop de tentatives de connexion échouées');
      logger.warn('IP bloquée pour tentatives excessives', { ip, username, attempts: failedAttempts.length });
    }

    // Règle: Trop de tentatives par heure
    const hourlyAttempts = this.getRecentAttempts(ip, 60 * 60 * 1000); // 1 heure
    if (hourlyAttempts.length >= this.maxAttemptsPerHour) {
      this.blockIP(ip, 'Trop de tentatives par heure');
      logger.warn('IP bloquée pour trop de tentatives par heure', { ip, username, attempts: hourlyAttempts.length });
    }
  }

  /**
   * Bloque une IP
   */
  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip);
    this.saveBlockedIPs();
    
    logger.warn('IP bloquée', { ip, reason });
    
    // Programmer le déblocage automatique
    setTimeout(() => {
      this.unblockIP(ip);
    }, this.lockoutDuration);
  }

  /**
   * Débloque une IP
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.saveBlockedIPs();
    
    logger.info('IP débloquée', { ip });
  }

  /**
   * Vérifie si une IP est bloquée
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Obtient les tentatives récentes pour une IP
   */
  private getRecentAttempts(ip: string, timeWindow: number): LoginAttempt[] {
    const cutoff = Date.now() - timeWindow;
    return this.loginAttempts.filter(attempt => 
      attempt.ip === ip && attempt.timestamp > cutoff
    );
  }

  /**
   * Sauvegarde les tentatives de connexion
   */
  private saveLoginAttempts(): void {
    try {
      // Garder seulement les 1000 dernières tentatives
      const recentAttempts = this.loginAttempts.slice(-1000);
      localStorage.setItem('ediba.security.login_attempts', JSON.stringify(recentAttempts));
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des tentatives de connexion', { error });
    }
  }

  /**
   * Valide les données d'entrée
   */
  validateInput(input: string, type: 'email' | 'phone' | 'text' | 'number'): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'phone':
        return /^[\+]?[0-9\s\-\(\)]{8,}$/.test(input);
      case 'text':
        return input.length > 0 && input.length <= 1000;
      case 'number':
        return !isNaN(Number(input)) && Number(input) >= 0;
      default:
        return false;
    }
  }

  /**
   * Nettoie les données d'entrée
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
      .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer les liens javascript
      .replace(/on\w+\s*=/gi, '') // Supprimer les événements
      .trim();
  }

  /**
   * Vérifie la force du mot de passe
   */
  validatePasswordStrength(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Le mot de passe doit contenir au moins 8 caractères');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Le mot de passe doit contenir au moins une minuscule');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Le mot de passe doit contenir au moins une majuscule');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Le mot de passe doit contenir au moins un chiffre');
    } else {
      score += 1;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push('Le mot de passe doit contenir au moins un caractère spécial');
    } else {
      score += 1;
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  /**
   * Génère un token CSRF
   */
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Vérifie un token CSRF
   */
  verifyCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }

  /**
   * Détecte les activités suspectes
   */
  detectSuspiciousActivity(userId: string, action: string, context: any): boolean {
    // Vérifier les actions répétitives
    const recentActions = this.getRecentUserActions(userId, 5 * 60 * 1000); // 5 minutes
    const sameActionCount = recentActions.filter(a => a.action === action).length;

    if (sameActionCount > 10) {
      logger.warn('Activité suspecte détectée: actions répétitives', { userId, action, count: sameActionCount });
      return true;
    }

    // Vérifier les exports de données excessifs
    if (action === 'export_data' && context?.size > 1000000) { // 1MB
      logger.warn('Activité suspecte détectée: export de données volumineux', { userId, action, size: context.size });
      return true;
    }

    return false;
  }

  /**
   * Obtient les actions récentes d'un utilisateur
   */
  private getRecentUserActions(userId: string, timeWindow: number): any[] {
    // Cette méthode devrait être implémentée avec le système de logging
    // Pour l'instant, retourner un tableau vide
    return [];
  }

  /**
   * Obtient les statistiques de sécurité
   */
  getSecurityStats(): any {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    
    const recentAttempts = this.loginAttempts.filter(attempt => attempt.timestamp > last24h);
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    
    return {
      totalAttempts: recentAttempts.length,
      failedAttempts: failedAttempts.length,
      blockedIPs: this.blockedIPs.size,
      successRate: recentAttempts.length > 0 ? 
        ((recentAttempts.length - failedAttempts.length) / recentAttempts.length) * 100 : 100
    };
  }

  /**
   * Nettoie les données de sécurité
   */
  cleanup(): void {
    // Nettoyer les anciennes tentatives
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.loginAttempts = this.loginAttempts.filter(attempt => attempt.timestamp > oneWeekAgo);
    
    // Sauvegarder les données nettoyées
    this.saveLoginAttempts();
    
    logger.info('Nettoyage des données de sécurité terminé');
  }
}

// Instance singleton
export const securityService = new SecurityService();

// Hook pour utiliser le service de sécurité
export const useSecurity = () => {
  return {
    recordLoginAttempt: securityService.recordLoginAttempt.bind(securityService),
    isIPBlocked: securityService.isIPBlocked.bind(securityService),
    blockIP: securityService.blockIP.bind(securityService),
    unblockIP: securityService.unblockIP.bind(securityService),
    validateInput: securityService.validateInput.bind(securityService),
    sanitizeInput: securityService.sanitizeInput.bind(securityService),
    validatePasswordStrength: securityService.validatePasswordStrength.bind(securityService),
    generateCSRFToken: securityService.generateCSRFToken.bind(securityService),
    verifyCSRFToken: securityService.verifyCSRFToken.bind(securityService),
    detectSuspiciousActivity: securityService.detectSuspiciousActivity.bind(securityService),
    getSecurityStats: securityService.getSecurityStats.bind(securityService),
    cleanup: securityService.cleanup.bind(securityService)
  };
};
