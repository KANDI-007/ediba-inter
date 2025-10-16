import React, { useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const ActivityModuleChart: React.FC = () => {
  const { activities } = useActivity();

  const moduleStats = useMemo(() => {
    const moduleCounts: Record<string, number> = {};
    const actionCounts: Record<string, number> = {};
    const successCounts: Record<string, { success: number; failed: number }> = {};

    activities.forEach(activity => {
      // Compter par module
      moduleCounts[activity.module] = (moduleCounts[activity.module] || 0) + 1;
      
      // Compter par action
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
      
      // Compter les succès/échecs par module
      if (!successCounts[activity.module]) {
        successCounts[activity.module] = { success: 0, failed: 0 };
      }
      if (activity.success) {
        successCounts[activity.module].success++;
      } else {
        successCounts[activity.module].failed++;
      }
    });

    return {
      modules: Object.entries(moduleCounts)
        .map(([module, count]) => ({ module, count }))
        .sort((a, b) => b.count - a.count),
      actions: Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count),
      successRates: Object.entries(successCounts)
        .map(([module, counts]) => ({
          module,
          success: counts.success,
          failed: counts.failed,
          total: counts.success + counts.failed,
          successRate: counts.success + counts.failed > 0 
            ? Math.round((counts.success / (counts.success + counts.failed)) * 100) 
            : 0
        }))
        .sort((a, b) => b.total - a.total)
    };
  }, [activities]);

  const getModuleColor = (module: string) => {
    const colors = {
      'Facturation': 'bg-blue-500',
      'Décharges': 'bg-green-500',
      'Clients': 'bg-purple-500',
      'Suppliers': 'bg-orange-500',
      'Rapports': 'bg-pink-500',
      'Authentification': 'bg-indigo-500',
      'Paramètres': 'bg-gray-500'
    };
    return colors[module as keyof typeof colors] || 'bg-gray-400';
  };

  const getActionColor = (action: string) => {
    const colors = {
      'Création': 'bg-green-500',
      'Modification': 'bg-yellow-500',
      'Suppression': 'bg-red-500',
      'Consultation': 'bg-blue-500',
      'Export': 'bg-purple-500',
      'Paiement': 'bg-green-600',
      'Connexion': 'bg-indigo-500',
      'Déconnexion': 'bg-gray-500',
      'Erreur': 'bg-red-600'
    };
    return colors[action as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Répartition des activités</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Activités par module */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Par module</h4>
            <div className="space-y-2">
              {moduleStats.modules.slice(0, 5).map(({ module, count }) => (
                <div key={module} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getModuleColor(module)} mr-3`}></div>
                    <span className="text-sm text-gray-700">{module}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${getModuleColor(module)}`}
                        style={{ 
                          width: `${(count / moduleStats.modules[0].count) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités par action */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Par action</h4>
            <div className="space-y-2">
              {moduleStats.actions.slice(0, 5).map(({ action, count }) => (
                <div key={action} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getActionColor(action)} mr-3`}></div>
                    <span className="text-sm text-gray-700">{action}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${getActionColor(action)}`}
                        style={{ 
                          width: `${(count / moduleStats.actions[0].count) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taux de réussite par module */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Taux de réussite par module</h4>
            <div className="space-y-2">
              {moduleStats.successRates.slice(0, 5).map(({ module, successRate, total }) => (
                <div key={module} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getModuleColor(module)} mr-3`}></div>
                    <span className="text-sm text-gray-700">{module}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${successRate >= 90 ? 'bg-green-500' : successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {successRate}% ({total})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModuleChart;
