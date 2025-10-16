import React, { useMemo } from 'react';
import { User, Clock, CheckCircle, XCircle, TrendingUp, Award } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const ActivityUserStats: React.FC = () => {
  const { activities } = useActivity();

  const userStats = useMemo(() => {
    const userData: Record<string, {
      userName: string;
      userRole: string;
      totalActivities: number;
      successfulActivities: number;
      failedActivities: number;
      lastActivity: string;
      modules: Record<string, number>;
      actions: Record<string, number>;
    }> = {};

    activities.forEach(activity => {
      if (!userData[activity.userId]) {
        userData[activity.userId] = {
          userName: activity.userName,
          userRole: activity.userRole,
          totalActivities: 0,
          successfulActivities: 0,
          failedActivities: 0,
          lastActivity: activity.timestamp,
          modules: {},
          actions: {}
        };
      }

      const user = userData[activity.userId];
      user.totalActivities++;
      
      if (activity.success) {
        user.successfulActivities++;
      } else {
        user.failedActivities++;
      }

      if (new Date(activity.timestamp) > new Date(user.lastActivity)) {
        user.lastActivity = activity.timestamp;
      }

      user.modules[activity.module] = (user.modules[activity.module] || 0) + 1;
      user.actions[activity.action] = (user.actions[activity.action] || 0) + 1;
    });

    return Object.values(userData)
      .map(user => ({
        ...user,
        successRate: user.totalActivities > 0 
          ? Math.round((user.successfulActivities / user.totalActivities) * 100) 
          : 0,
        topModule: Object.entries(user.modules)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
        topAction: Object.entries(user.actions)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
      }))
      .sort((a, b) => b.totalActivities - a.totalActivities);
  }, [activities]);

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'comptable': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-green-100 text-green-800',
      'lecture': 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 168) return `Il y a ${Math.floor(diffInHours / 24)}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Statistiques par utilisateur</h3>
          <User className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="p-6">
        {userStats.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune donnée utilisateur disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userStats.map((user, index) => (
              <div key={user.userName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {index === 0 && (
                      <Award className="w-5 h-5 text-yellow-500 mr-2" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.userName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.userRole)}`}>
                        {user.userRole}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{user.totalActivities}</div>
                    <div className="text-sm text-gray-600">activités</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.successfulActivities}</div>
                      <div className="text-xs text-gray-600">Réussies</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.failedActivities}</div>
                      <div className="text-xs text-gray-600">Échouées</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">Taux de réussite:</span>
                    <span className={`ml-1 font-semibold ${getSuccessRateColor(user.successRate)}`}>
                      {user.successRate}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{formatLastActivity(user.lastActivity)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Module préféré: <strong>{user.topModule}</strong></span>
                    <span>Action principale: <strong>{user.topAction}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityUserStats;
