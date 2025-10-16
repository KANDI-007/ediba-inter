import React, { useMemo } from 'react';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const ActivityTimeChart: React.FC = () => {
  const { activities } = useActivity();

  const timeStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Activités par heure (dernières 24h)
    const hourlyStats: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyStats[i] = 0;
    }
    
    // Activités par jour (derniers 7 jours)
    const dailyStats: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      dailyStats[date.toISOString().slice(0, 10)] = 0;
    }
    
    // Activités par mois (derniers 12 mois)
    const monthlyStats: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyStats[date.toISOString().slice(0, 7)] = 0;
    }

    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      
      // Heure
      if (activityDate >= new Date(today.getTime() - 24 * 60 * 60 * 1000)) {
        const hour = activityDate.getHours();
        hourlyStats[hour]++;
      }
      
      // Jour
      const dayKey = activityDate.toISOString().slice(0, 10);
      if (dailyStats.hasOwnProperty(dayKey)) {
        dailyStats[dayKey]++;
      }
      
      // Mois
      const monthKey = activityDate.toISOString().slice(0, 7);
      if (monthlyStats.hasOwnProperty(monthKey)) {
        monthlyStats[monthKey]++;
      }
    });

    return {
      hourly: Object.entries(hourlyStats).map(([hour, count]) => ({
        hour: parseInt(hour),
        count,
        label: `${hour}h`
      })),
      daily: Object.entries(dailyStats).map(([date, count]) => ({
        date,
        count,
        label: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
      })),
      monthly: Object.entries(monthlyStats).map(([month, count]) => ({
        month,
        count,
        label: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      }))
    };
  }, [activities]);

  const maxCount = Math.max(
    ...timeStats.hourly.map(h => h.count),
    ...timeStats.daily.map(d => d.count),
    ...timeStats.monthly.map(m => m.count)
  );

  const getBarHeight = (count: number) => {
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };

  const getBarColor = (count: number) => {
    if (count === 0) return 'bg-gray-200';
    if (count < maxCount * 0.3) return 'bg-blue-300';
    if (count < maxCount * 0.6) return 'bg-blue-400';
    if (count < maxCount * 0.8) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Activités par période</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-8">
          {/* Activités par heure (dernières 24h) */}
          <div>
            <div className="flex items-center mb-4">
              <Clock className="w-4 h-4 text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Dernières 24 heures</h4>
            </div>
            <div className="flex items-end justify-between h-32 space-x-1">
              {timeStats.hourly.map(({ hour, count, label }) => (
                <div key={hour} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-sm h-24 flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${getBarColor(count)}`}
                      style={{ height: `${getBarHeight(count)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {label}
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités par jour (derniers 7 jours) */}
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="w-4 h-4 text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Derniers 7 jours</h4>
            </div>
            <div className="flex items-end justify-between h-32 space-x-2">
              {timeStats.daily.map(({ date, count, label }) => (
                <div key={date} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-sm h-24 flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${getBarColor(count)}`}
                      style={{ height: `${getBarHeight(count)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {label}
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités par mois (derniers 12 mois) */}
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Derniers 12 mois</h4>
            </div>
            <div className="flex items-end justify-between h-32 space-x-1">
              {timeStats.monthly.map(({ month, count, label }) => (
                <div key={month} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-sm h-24 flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${getBarColor(count)}`}
                      style={{ height: `${getBarHeight(count)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {label}
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-sm mr-2"></div>
              <span>Aucune activité</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded-sm mr-2"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
              <span>Moyen</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
              <span>Élevé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeChart;
