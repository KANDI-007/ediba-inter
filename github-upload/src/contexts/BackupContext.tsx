import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext';
import { useActivityLogger } from './ActivityContext';

export interface BackupData {
  id: string;
  name: string;
  timestamp: string;
  size: number;
  type: 'full' | 'incremental';
  description?: string;
  data: {
    documents: any[];
    suppliers: any[];
    suppliersList: any[];
    supplierInvoices: any[];
    activities: any[];
    notifications: any[];
    fiscalYears: any[];
    companyDetails: any;
    userSession: any;
  };
  version: string;
  checksum: string;
}

interface BackupContextType {
  backups: BackupData[];
  createBackup: (name: string, description?: string, type?: 'full' | 'incremental') => Promise<BackupData>;
  restoreBackup: (backupId: string) => Promise<boolean>;
  deleteBackup: (backupId: string) => void;
  exportBackup: (backupId: string) => void;
  importBackup: (file: File) => Promise<boolean>;
  getBackupSize: (backup: BackupData) => string;
  scheduleAutoBackup: (interval: 'daily' | 'weekly' | 'monthly') => void;
  cancelAutoBackup: () => void;
  getStorageUsage: () => { used: number; total: number; percentage: number };
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

const STORAGE_KEY = 'ediba.backups';
const AUTO_BACKUP_KEY = 'ediba.auto.backup';

export const BackupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const { documents, suppliersList, supplierInvoices } = useData();
  const { logSettings } = useActivityLogger();

  // Charger les sauvegardes depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBackups(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
    }
  }, []);

  // Sauvegarder les sauvegardes dans le localStorage
  useEffect(() => {
    if (backups.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backups));
    }
  }, [backups]);

  // Nettoyer les anciennes sauvegardes (plus de 30 jours)
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setBackups(prev => 
      prev.filter(backup => 
        new Date(backup.timestamp) > thirtyDaysAgo
      )
    );
  }, []);

  const generateChecksum = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  };

  const collectAllData = () => {
    const allData = {
      documents,
      suppliers: [], // Legacy
      suppliersList,
      supplierInvoices,
      activities: JSON.parse(localStorage.getItem('ediba.activity.logs') || '[]'),
      notifications: JSON.parse(localStorage.getItem('ediba.notifications') || '[]'),
      fiscalYears: JSON.parse(localStorage.getItem('ediba.fiscal.years') || '[]'),
      companyDetails: JSON.parse(localStorage.getItem('ediba.company.details') || '{}'),
      userSession: JSON.parse(localStorage.getItem('ediba.user.session') || '{}')
    };
    return allData;
  };

  const createBackup = async (name: string, description?: string, type: 'full' | 'incremental' = 'full'): Promise<BackupData> => {
    const allData = collectAllData();
    const dataString = JSON.stringify(allData);
    const checksum = generateChecksum(dataString);
    
    const backup: BackupData = {
      id: `BACKUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      timestamp: new Date().toISOString(),
      size: new Blob([dataString]).size,
      type,
      description,
      data: allData,
      version: '1.0.0',
      checksum
    };

    setBackups(prev => [backup, ...prev.slice(0, 9)]); // Garder seulement les 10 dernières sauvegardes
    logSettings(`Sauvegarde créée: ${name}`);
    
    return backup;
  };

  const restoreBackup = async (backupId: string): Promise<boolean> => {
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Sauvegarde non trouvée');
      }

      // Vérifier l'intégrité
      const dataString = JSON.stringify(backup.data);
      const checksum = generateChecksum(dataString);
      if (checksum !== backup.checksum) {
        throw new Error('Sauvegarde corrompue');
      }

      // Restaurer les données
      localStorage.setItem('ediba.data.v1', JSON.stringify({
        documents: backup.data.documents,
        suppliers: backup.data.suppliers,
        suppliersList: backup.data.suppliersList,
        supplierInvoices: backup.data.supplierInvoices
      }));

      if (backup.data.activities) {
        localStorage.setItem('ediba.activity.logs', JSON.stringify(backup.data.activities));
      }

      if (backup.data.notifications) {
        localStorage.setItem('ediba.notifications', JSON.stringify(backup.data.notifications));
      }

      if (backup.data.fiscalYears) {
        localStorage.setItem('ediba.fiscal.years', JSON.stringify(backup.data.fiscalYears));
      }

      if (backup.data.companyDetails) {
        localStorage.setItem('ediba.company.details', JSON.stringify(backup.data.companyDetails));
      }

      logSettings(`Restauration de la sauvegarde: ${backup.name}`);
      
      // Recharger la page pour appliquer les changements
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  };

  const deleteBackup = (backupId: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== backupId));
    logSettings(`Sauvegarde supprimée: ${backupId}`);
  };

  const exportBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    const exportData = {
      ...backup,
      exportedAt: new Date().toISOString(),
      exportedBy: 'EDIBA-INTER'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ediba_backup_${backup.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logSettings(`Export de la sauvegarde: ${backup.name}`);
  };

  const importBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedBackup = JSON.parse(text);
      
      // Vérifier la structure
      if (!importedBackup.id || !importedBackup.data || !importedBackup.timestamp) {
        throw new Error('Format de sauvegarde invalide');
      }

      // Vérifier l'intégrité
      const dataString = JSON.stringify(importedBackup.data);
      const checksum = generateChecksum(dataString);
      if (checksum !== importedBackup.checksum) {
        throw new Error('Sauvegarde corrompue');
      }

      // Ajouter la sauvegarde importée
      const newBackup: BackupData = {
        ...importedBackup,
        id: `BACKUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Importé - ${importedBackup.name}`,
        timestamp: new Date().toISOString()
      };

      setBackups(prev => [newBackup, ...prev]);
      logSettings(`Import de la sauvegarde: ${importedBackup.name}`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  };

  const getBackupSize = (backup: BackupData): string => {
    const bytes = backup.size;
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const scheduleAutoBackup = (interval: 'daily' | 'weekly' | 'monthly') => {
    const intervals = {
      daily: 24 * 60 * 60 * 1000, // 24 heures
      weekly: 7 * 24 * 60 * 60 * 1000, // 7 jours
      monthly: 30 * 24 * 60 * 60 * 1000 // 30 jours
    };

    const schedule = {
      interval,
      nextBackup: new Date(Date.now() + intervals[interval]).toISOString(),
      enabled: true
    };

    localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(schedule));
    logSettings(`Sauvegarde automatique programmée: ${interval}`);
  };

  const cancelAutoBackup = () => {
    localStorage.removeItem(AUTO_BACKUP_KEY);
    logSettings('Sauvegarde automatique annulée');
  };

  const getStorageUsage = () => {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Estimation de la limite (5MB pour la plupart des navigateurs)
    const total = 5 * 1024 * 1024; // 5MB en bytes
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  };

  const value: BackupContextType = {
    backups,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    getBackupSize,
    scheduleAutoBackup,
    cancelAutoBackup,
    getStorageUsage
  };

  return (
    <BackupContext.Provider value={value}>
      {children}
    </BackupContext.Provider>
  );
};

export const useBackup = () => {
  const context = useContext(BackupContext);
  if (context === undefined) {
    throw new Error('useBackup must be used within a BackupProvider');
  }
  return context;
};
