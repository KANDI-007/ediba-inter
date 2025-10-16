import React, { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';

interface NotificationPermissionRequestProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const NotificationPermissionRequest: React.FC<NotificationPermissionRequestProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [showRequest, setShowRequest] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return;
    }

    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    // Afficher la demande seulement si l'autorisation est "default"
    if (currentPermission === 'default') {
      setShowRequest(true);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        console.log('✅ Permission de notification accordée');
        setShowRequest(false);
        onPermissionGranted?.();
        
        // Afficher une notification de test
        new Notification('EDIBA INTER', {
          body: 'Les notifications sont maintenant activées !',
          icon: '/icon-ei-blue.svg',
          tag: 'permission-granted'
        });
      } else {
        console.log('❌ Permission de notification refusée');
        setShowRequest(false);
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
  };

  const dismissRequest = () => {
    setShowRequest(false);
  };

  if (!showRequest || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Activer les notifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Recevez des notifications en temps réel pour les appels entrants et les activités importantes.
            </p>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={requestPermission}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Bell className="w-3 h-3 mr-1" />
                Activer
              </button>
              
              <button
                onClick={dismissRequest}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md transition-colors"
              >
                <BellOff className="w-3 h-3 mr-1" />
                Plus tard
              </button>
            </div>
          </div>
          
          <button
            onClick={dismissRequest}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
