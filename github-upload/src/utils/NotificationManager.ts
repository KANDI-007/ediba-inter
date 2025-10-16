// Utilitaire pour gérer les notifications push d'Espace EDIBA
export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.checkPermission();
    this.registerServiceWorker();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Vérifier les permissions de notification
  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      console.log('🔔 Permission de notification:', this.permission);
    } else {
      console.warn('⚠️ Ce navigateur ne supporte pas les notifications');
    }
  }

  // Enregistrer le service worker
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        console.log('🔧 Tentative d\'enregistrement du Service Worker...');
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw-notifications.js');
        console.log('✅ Service Worker enregistré:', this.serviceWorkerRegistration);
        
        // Attendre que le service worker soit prêt
        await navigator.serviceWorker.ready;
        console.log('✅ Service Worker prêt');
        
        // Écouter les messages du service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('💬 Message du Service Worker:', event.data);
          this.handleServiceWorkerMessage(event.data);
        });
        
        // Écouter les erreurs du service worker
        navigator.serviceWorker.addEventListener('error', (event) => {
          console.error('❌ Erreur Service Worker:', event);
        });
        
      } catch (error) {
        console.error('❌ Erreur enregistrement Service Worker:', error);
        console.error('❌ Détails de l\'erreur:', error.message);
      }
    } else {
      console.warn('⚠️ Ce navigateur ne supporte pas les Service Workers');
    }
  }

  // Demander la permission de notification
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('🔔 Permission demandée:', this.permission);
      return this.permission === 'granted';
    } catch (error) {
      console.error('❌ Erreur demande permission:', error);
      return false;
    }
  }

  // Envoyer une notification d'appel entrant
  public async sendCallNotification(callData: {
    callerId: string;
    callerName: string;
    callType: 'audio' | 'video';
    callId: string;
  }): Promise<void> {
    console.log('📱 Tentative d\'envoi de notification d\'appel:', callData);
    
    if (this.permission !== 'granted') {
      console.log('🔔 Permission non accordée, demande...');
      const granted = await this.requestPermission();
      if (!granted) {
        console.log('🔔 Permission refusée, notification impossible');
        return;
      }
    }

    if (!this.serviceWorkerRegistration) {
      console.error('❌ Service Worker non enregistré');
      console.log('🔧 Tentative de réenregistrement...');
      await this.registerServiceWorker();
      
      if (!this.serviceWorkerRegistration) {
        console.error('❌ Impossible d\'enregistrer le Service Worker');
        return;
      }
    }

    try {
      const notificationData = {
        title: `Appel entrant de ${callData.callerName}`,
        body: `Vous recevez un appel ${callData.callType === 'video' ? 'vidéo' : 'vocal'} de ${callData.callerName}`,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CjxwYXRoIGQ9Ik0yMiAxNi45MnYzYTIgMiAwIDAgMS0yLjE4IDIgMTguNjYgMTguNjYgMCAwIDEtOS0zIDM0IDM0IDAgMCAxLTQuNDktNC40OWExOC42NiAxOC42NiAwIDAgMS0zLTlBMiAyIDAgMCAxIDQuMDcgMTFoM2EyIDIgMCAwIDEgMiAxLjggMi4xNyAyLjE3IDAgMCAwIDEuNTQgMiA4IDggMCAwIDAgNC4zMyA0LjMzIDIuMTcgMi4xNyAwIDAgMCAyLTEuNTQgMiAyIDAgMCAxIDEuOCAyWiIvPgo8L3N2Zz4KPC9zdmc+',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iOCIgZmlsbD0iIzYzNjZGMiIvPgo8c3ZnIHg9IjE4IiB5PSIxOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KPHBhdGggZD0iTTIyIDE2LjkyVjE5YTJBMiAwIDAgMSAxOS44MiAyMSAxOC42NiAxOC42NiAwIDAgMSAxMC44MiAxOCAzNCAzNCAwIDAgMSA2LjMzIDEzLjUxQTE4LjY2IDE4LjY2IDAgMCAxIDMuMzMgNC41MUEyIDIgMCAwIDEgNS4zMSAySDguMzFBMiAyIDAgMCAxIDEwLjMxIDMuOCAyLjE3IDIuMTcgMCAwIDAgMTEuODUgNS44NEE4IDggMCAwIDAgMTYuMTggMTAuMTcgMi4xNyAyLjE3IDAgMCAwIDE4LjE4IDguNjNBMS45OSAxLjk5IDAgMCAxIDIwLjE4IDEwLjYzWiIvPgo8L3N2Zz4KPC9zdmc+',
        tag: 'ediba-call',
        requireInteraction: true,
        actions: [
          {
            action: 'accept',
            title: 'Accepter',
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJsMiAyIDQtNCIgc3Ryb2tlPSIjMTBCODY0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4='
          },
          {
            action: 'reject',
            title: 'Refuser',
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDZsLTYgNi02LTYiIHN0cm9rZT0iI0VGMjQ0NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+'
          }
        ],
        data: {
          callerId: callData.callerId,
          callerName: callData.callerName,
          callType: callData.callType,
          callId: callData.callId,
          url: '/chat',
          timestamp: Date.now()
        }
      };

      console.log('📱 Données de notification:', notificationData);
      console.log('📱 Service Worker registration:', this.serviceWorkerRegistration);
      
      await this.serviceWorkerRegistration.showNotification(
        notificationData.title,
        notificationData
      );
      
      console.log('✅ Notification d\'appel envoyée avec succès');
    } catch (error) {
      console.error('❌ Erreur envoi notification:', error);
      console.error('❌ Détails de l\'erreur:', error.message);
    }
  }

  // Fermer les notifications d'appel
  public async closeCallNotifications(): Promise<void> {
    if (this.serviceWorkerRegistration) {
      try {
        const notifications = await this.serviceWorkerRegistration.getNotifications({
          tag: 'ediba-call'
        });
        
        notifications.forEach(notification => {
          notification.close();
        });
        
        console.log('🔔 Notifications d\'appel fermées');
      } catch (error) {
        console.error('❌ Erreur fermeture notifications:', error);
      }
    }
  }

  // Gérer les messages du service worker
  private handleServiceWorkerMessage(data: any): void {
    console.log('💬 Traitement message Service Worker:', data);
    
    if (data.type === 'ACCEPT_CALL') {
      // Émettre un événement personnalisé pour accepter l'appel
      window.dispatchEvent(new CustomEvent('notificationAcceptCall', {
        detail: {
          callId: data.callId,
          callerId: data.callerId
        }
      }));
    } else if (data.type === 'REJECT_CALL') {
      // Émettre un événement personnalisé pour refuser l'appel
      window.dispatchEvent(new CustomEvent('notificationRejectCall', {
        detail: {
          callId: data.callId,
          callerId: data.callerId
        }
      }));
    }
  }

  // Vérifier si les notifications sont supportées
  public isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Obtenir le statut des permissions
  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Obtenir l'enregistrement du service worker
  public getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
    return this.serviceWorkerRegistration;
  }
}

// Instance singleton
export const notificationManager = NotificationManager.getInstance();
