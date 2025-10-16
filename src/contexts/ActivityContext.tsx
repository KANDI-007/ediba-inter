import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  metadata?: Record<string, any>;
}

interface ActivityContextType {
  activities: ActivityLog[];
  logActivity: (action: string, module: string, details: string, metadata?: Record<string, any>, success?: boolean) => void;
  getActivitiesByUser: (userId: string) => ActivityLog[];
  getActivitiesByModule: (module: string) => ActivityLog[];
  getActivitiesByDateRange: (startDate: string, endDate: string) => ActivityLog[];
  clearOldActivities: (daysToKeep?: number) => void;
  clearAllActivities: () => void;
  exportActivities: (format: 'csv' | 'json') => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const STORAGE_KEY = 'ediba.activity.logs';

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const { user } = useAuth();

  // Charger les activités depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivities(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    }
  }, []);

  // Sauvegarder en continu + à la fermeture de l'app
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activities]);

  const logActivity = (
    action: string, 
    module: string, 
    details: string, 
    metadata?: Record<string, any>, 
    success: boolean = true
  ) => {
    if (!user) return;

    const activity: ActivityLog = {
      id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: user.username,
      userName: user.fullName,
      userRole: user.role,
      action,
      module,
      details,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      success,
      metadata
    };

    setActivities(prev => [activity, ...prev.slice(0, 499)]); // Garder seulement les 500 dernières activités
    
    console.log('📝 Activité enregistrée:', activity);
  };

  const getActivitiesByUser = (userId: string): ActivityLog[] => {
    return activities.filter(activity => activity.userId === userId);
  };

  const getActivitiesByModule = (module: string): ActivityLog[] => {
    return activities.filter(activity => activity.module === module);
  };

  const getActivitiesByDateRange = (startDate: string, endDate: string): ActivityLog[] => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return activityDate >= start && activityDate <= end;
    });
  };

  const clearOldActivities = (daysToKeep: number = 90) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    setActivities(prev => 
      prev.filter(activity => new Date(activity.timestamp) > cutoffDate)
    );
  };

  const clearAllActivities = () => {
    setActivities([]);
  };

  const exportActivities = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['ID', 'Date', 'Utilisateur', 'Rôle', 'Action', 'Module', 'Détails', 'Succès'];
      const csvContent = [
        headers.join(','),
        ...activities.map(activity => [
          activity.id,
          new Date(activity.timestamp).toLocaleString('fr-FR'),
          activity.userName,
          activity.userRole,
          `"${activity.action}"`,
          activity.module,
          `"${activity.details}"`,
          activity.success ? 'Oui' : 'Non'
        ].join(','))
      ].join('\n');

      const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal_activite_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(activities, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal_activite_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const value: ActivityContextType = {
    activities,
    logActivity,
    getActivitiesByUser,
    getActivitiesByModule,
    getActivitiesByDateRange,
    clearOldActivities,
    clearAllActivities,
    exportActivities
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

// Variante optionnelle: ne lève pas d'erreur si le provider n'est pas présent.
// Utile pour éviter les dépendances circulaires lors de l'initialisation.
export const useActivityOptional = () => {
  return useContext(ActivityContext);
};

// Hook pour logger automatiquement les activités
export const useActivityLogger = () => {
  const { logActivity } = useActivity();
  
  return {
    logLogin: (success: boolean) => logActivity('Connexion', 'Authentification', success ? 'Connexion réussie' : 'Échec de connexion', undefined, success),
    logLogout: () => logActivity('Déconnexion', 'Authentification', 'Déconnexion utilisateur'),
    logCreate: (module: string, itemName: string, itemId?: string) => logActivity('Création', module, `Création de ${itemName}${itemId ? ` (ID: ${itemId})` : ''}`, { itemId }),
    logUpdate: (module: string, itemName: string, itemId?: string) => logActivity('Modification', module, `Modification de ${itemName}${itemId ? ` (ID: ${itemId})` : ''}`, { itemId }),
    logDelete: (module: string, itemName: string, itemId?: string) => logActivity('Suppression', module, `Suppression de ${itemName}${itemId ? ` (ID: ${itemId})` : ''}`, { itemId }),
    logView: (module: string, itemName: string) => logActivity('Consultation', module, `Consultation de ${itemName}`),
    logExport: (module: string, format: string) => logActivity('Export', module, `Export des données au format ${format.toUpperCase()}`),
    logPayment: (amount: number, clientName: string) => logActivity('Paiement', 'Facturation', `Enregistrement d'un paiement de ${amount.toLocaleString('fr-FR')} FCFA pour ${clientName}`, { amount, clientName }),
    logSettings: (settingName: string) => logActivity('Configuration', 'Paramètres', `Modification du paramètre: ${settingName}`),
    logError: (module: string, error: string) => logActivity('Erreur', module, error, undefined, false)
  };
};
