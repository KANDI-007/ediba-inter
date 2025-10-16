import React from 'react';
import { Activity, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const RecentActivityWidget: React.FC = () => {
  const { activities } = useActivity();

  // Obtenir les 5 activités les plus récentes
  const recentActivities = activities.slice(0, 5);

  const getActionIcon = (action: string, success: boolean) => {
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
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Activités récentes</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="p-6">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(activity.action, activity.success)}
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
                  <p className="text-sm text-gray-600 truncate">
                    {activity.details}
                  </p>
                  <div className="flex items-center mt-1">
                    <User className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {activity.userName} • {activity.module}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {recentActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/activity-log"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tout le journal d'activité →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget;
