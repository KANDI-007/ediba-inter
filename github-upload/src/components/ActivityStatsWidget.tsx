import React, { useMemo } from 'react';
import { Activity, TrendingUp, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const ActivityStatsWidget: React.FC = () => {
  const { activities } = useActivity();

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayActivities = activities.filter(a => new Date(a.timestamp) >= today);
    const yesterdayActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      return activityDate >= yesterday && activityDate < today;
    });
    const weekActivities = activities.filter(a => new Date(a.timestamp) >= thisWeek);
    const monthActivities = activities.filter(a => new Date(a.timestamp) >= thisMonth);

    const successful = activities.filter(a => a.success).length;
    const failed = activities.filter(a => !a.success).length;
    const uniqueUsers = new Set(activities.map(a => a.userId)).size;

    // Calculer la tendance (comparaison avec hier)
    const todayCount = todayActivities.length;
    const yesterdayCount = yesterdayActivities.length;
    const trend = yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 0;

    return {
      total: activities.length,
      today: todayCount,
      week: weekActivities.length,
      month: monthActivities.length,
      successful,
      failed,
      uniqueUsers,
      trend: Math.round(trend)
    };
  }, [activities]);

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Statistiques d'activité</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.today}</div>
            <div className="text-sm text-gray-600">Aujourd'hui</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.week}</div>
            <div className="text-sm text-gray-600">Cette semaine</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.month}</div>
            <div className="text-sm text-gray-600">Ce mois</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tendance */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {getTrendIcon(stats.trend)}
              <span className="ml-2 text-sm font-medium text-gray-700">Tendance</span>
            </div>
            <span className={`text-sm font-semibold ${getTrendColor(stats.trend)}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend}%
            </span>
          </div>

          {/* Réussite/Échec */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="ml-3">
                <div className="text-lg font-semibold text-green-900">{stats.successful}</div>
                <div className="text-sm text-green-700">Réussies</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="ml-3">
                <div className="text-lg font-semibold text-red-900">{stats.failed}</div>
                <div className="text-sm text-red-700">Échouées</div>
              </div>
            </div>
          </div>

          {/* Utilisateurs actifs */}
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-blue-900">{stats.uniqueUsers}</div>
              <div className="text-sm text-blue-700">Utilisateurs actifs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatsWidget;
