import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useActivity, ActivityLog } from '../contexts/ActivityContext';

const ActivityLiveFeed: React.FC = () => {
  const { activities } = useActivity();
  const [liveActivities, setLiveActivities] = useState<ActivityLog[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (isLive) {
      // Filtrer les activités des 5 dernières minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentActivities = activities.filter(activity => 
        new Date(activity.timestamp) > fiveMinutesAgo
      );
      setLiveActivities(recentActivities);
    }
  }, [activities, isLive]);

  const getActivityIcon = (action: string, success: boolean) => {
    if (!success) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    
    switch (action.toLowerCase()) {
      case 'connexion':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'création':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'modification':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suppression':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'consultation':
        return <Activity className="w-4 h-4 text-gray-500" />;
      case 'export':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'paiement':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'erreur':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `Il y a ${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)}min`;
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Flux d'activité en direct</h3>
            <div className={`ml-3 w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isLive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isLive ? 'En direct' : 'Pause'}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {liveActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {isLive ? 'Aucune activité récente' : 'Flux en pause'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveActivities
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((activity) => (
                <div
                  key={activity.id}
                  className={`border rounded-lg p-3 transition-all duration-200 ${getActivityColor(activity.action, activity.success)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.action, activity.success)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 truncate">
                        {activity.details}
                      </p>
                      <div className="flex items-center mt-2">
                        <User className="w-3 h-3 text-gray-400 mr-1" />
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
                </div>
              ))}
          </div>
        )}
        
        {liveActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Affichage des activités des 5 dernières minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLiveFeed;
