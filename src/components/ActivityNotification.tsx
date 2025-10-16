import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { ActivityLog } from '../contexts/ActivityContext';

interface ActivityNotificationProps {
  activity: ActivityLog;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ActivityNotification: React.FC<ActivityNotificationProps> = ({
  activity,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Délai pour l'animation de sortie
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getActivityIcon = (action: string, success: boolean) => {
    if (!success) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    switch (action.toLowerCase()) {
      case 'connexion':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'création':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'modification':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'suppression':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'export':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'paiement':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'erreur':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (action: string, success: boolean) => {
    if (!success) return 'border-red-200 bg-red-50';
    
    switch (action.toLowerCase()) {
      case 'connexion':
        return 'border-green-200 bg-green-50';
      case 'création':
        return 'border-blue-200 bg-blue-50';
      case 'modification':
        return 'border-yellow-200 bg-yellow-50';
      case 'suppression':
        return 'border-red-200 bg-red-50';
      case 'export':
        return 'border-purple-200 bg-purple-50';
      case 'paiement':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`border rounded-lg shadow-lg p-4 ${getActivityColor(activity.action, activity.success)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.action, activity.success)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 ml-2">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-1 truncate">
                {activity.details}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-600">
                  {activity.userName} • {activity.module}
                </span>
                {!activity.success && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Échec
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityNotification;
