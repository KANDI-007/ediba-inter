// Configuration de l'environnement
export const config = {
  // Application
  app: {
    name: import.meta.env.VITE_APP_NAME || 'EDIBA-INTER',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Application de gestion de facturation',
  },

  // Entreprise
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || 'EDIBA INTER SARL U',
    address: import.meta.env.VITE_COMPANY_ADDRESS || '123 Avenue de la Paix, Lomé, Togo',
    phone: import.meta.env.VITE_COMPANY_PHONE || '+228 12 34 56 78',
    email: import.meta.env.VITE_COMPANY_EMAIL || 'contact@edibainter.com',
    website: import.meta.env.VITE_COMPANY_WEBSITE || 'https://edibainter.com',
  },

  // API
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },

  // Sécurité
  security: {
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 heure
  },

  // PWA
  pwa: {
    name: import.meta.env.VITE_PWA_NAME || 'EDIBA-INTER',
    shortName: import.meta.env.VITE_PWA_SHORT_NAME || 'EDIBA',
    themeColor: import.meta.env.VITE_PWA_THEME_COLOR || '#3b82f6',
    backgroundColor: import.meta.env.VITE_PWA_BACKGROUND_COLOR || '#1e40af',
  },

  // Développement
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Base de données
  database: {
    type: import.meta.env.VITE_DB_TYPE || 'localStorage',
    backupInterval: parseInt(import.meta.env.VITE_DB_BACKUP_INTERVAL || '86400000'), // 24 heures
  },

  // Notifications
  notifications: {
    enabled: import.meta.env.VITE_NOTIFICATION_ENABLED !== 'false',
    duration: parseInt(import.meta.env.VITE_NOTIFICATION_DURATION || '5000'),
  },

  // Rapports
  reports: {
    cacheDuration: parseInt(import.meta.env.VITE_REPORT_CACHE_DURATION || '3600000'), // 1 heure
    maxSize: parseInt(import.meta.env.VITE_MAX_REPORT_SIZE || '10485760'), // 10MB
  },

  // Impression
  printing: {
    defaultQuality: import.meta.env.VITE_DEFAULT_PRINT_QUALITY || 'high',
    defaultFormat: import.meta.env.VITE_DEFAULT_PAGE_FORMAT || 'A4',
    defaultMargin: parseInt(import.meta.env.VITE_DEFAULT_MARGIN || '20'),
  },
};

// Validation de la configuration
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.security.encryptionKey || config.security.encryptionKey === 'default-key-change-in-production') {
    errors.push('VITE_ENCRYPTION_KEY doit être défini en production');
  }

  if (config.api.timeout < 1000) {
    errors.push('VITE_API_TIMEOUT doit être d\'au moins 1000ms');
  }

  if (config.security.sessionTimeout < 300000) { // 5 minutes
    errors.push('VITE_SESSION_TIMEOUT doit être d\'au moins 5 minutes');
  }

  if (errors.length > 0) {
    console.warn('Configuration invalide:', errors);
  }

  return errors.length === 0;
};

// Export par défaut
export default config;
