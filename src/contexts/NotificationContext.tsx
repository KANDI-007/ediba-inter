import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  module?: string;
  action?: string;
  metadata?: Record<string, any>;
  persistent?: boolean; // Les notifications persistantes ne disparaissent pas automatiquement
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  getNotificationsByType: (type: Notification['type']) => Notification[];
  getNotificationsByModule: (module: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'ediba.notifications';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Charger les notifications depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }, []);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Nettoyer les anciennes notifications (plus de 30 jours)
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setNotifications(prev => 
      prev.filter(notification => 
        new Date(notification.timestamp) > thirtyDaysAgo
      )
    );
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      userId: user?.username
    };

    setNotifications(prev => [notification, ...prev.slice(0, 99)]); // Garder seulement les 100 dernières notifications

    // Auto-suppression des notifications non persistantes après 5 secondes
    if (!notification.persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = (): number => {
    return notifications.filter(notification => !notification.read).length;
  };

  const getNotificationsByType = (type: Notification['type']): Notification[] => {
    return notifications.filter(notification => notification.type === type);
  };

  const getNotificationsByModule = (module: string): Notification[] => {
    return notifications.filter(notification => notification.module === module);
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadCount,
    getNotificationsByType,
    getNotificationsByModule
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Hook pour créer des notifications typées
export const useNotificationCreator = () => {
  const { addNotification } = useNotifications();
  
  return {
    showSuccess: (title: string, message: string, persistent = false) => 
      addNotification({ type: 'success', title, message, persistent }),
    
    showError: (title: string, message: string, persistent = true) => 
      addNotification({ type: 'error', title, message, persistent }),
    
    showWarning: (title: string, message: string, persistent = false) => 
      addNotification({ type: 'warning', title, message, persistent }),
    
    showInfo: (title: string, message: string, persistent = false) => 
      addNotification({ type: 'info', title, message, persistent }),
    
    showPaymentReminder: (clientName: string, amount: number, daysOverdue: number) => 
      addNotification({
        type: 'warning',
        title: 'Rappel de paiement',
        message: `${clientName} a une facture impayée de ${amount.toLocaleString('fr-FR')} FCFA (${daysOverdue} jours de retard)`,
        module: 'Facturation',
        action: 'payment_reminder',
        persistent: true,
        metadata: { clientName, amount, daysOverdue }
      }),
    
    showInvoiceOverdue: (invoiceId: string, clientName: string, daysOverdue: number) => 
      addNotification({
        type: 'error',
        title: 'Facture en retard',
        message: `La facture ${invoiceId} de ${clientName} est en retard de ${daysOverdue} jours`,
        module: 'Facturation',
        action: 'invoice_overdue',
        persistent: true,
        metadata: { invoiceId, clientName, daysOverdue }
      }),
    
    showNewInvoice: (invoiceId: string, clientName: string, amount: number) => 
      addNotification({
        type: 'success',
        title: 'Nouvelle facture créée',
        message: `Facture ${invoiceId} créée pour ${clientName} (${amount.toLocaleString('fr-FR')} FCFA)`,
        module: 'Facturation',
        action: 'invoice_created',
        metadata: { invoiceId, clientName, amount }
      }),
    
    showPaymentReceived: (invoiceId: string, amount: number) => 
      addNotification({
        type: 'success',
        title: 'Paiement reçu',
        message: `Paiement de ${amount.toLocaleString('fr-FR')} FCFA reçu pour la facture ${invoiceId}`,
        module: 'Facturation',
        action: 'payment_received',
        metadata: { invoiceId, amount }
      }),
    
    showSystemAlert: (title: string, message: string) => 
      addNotification({
        type: 'info',
        title,
        message,
        module: 'Système',
        action: 'system_alert',
        persistent: true
      })
  };
};
