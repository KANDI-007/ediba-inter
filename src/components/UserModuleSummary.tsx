import React from 'react';
import { Users, UserCheck, Crown, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface UserModuleSummaryProps {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentLogins: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  className?: string;
}

const UserModuleSummary: React.FC<UserModuleSummaryProps> = ({
  totalUsers,
  activeUsers,
  adminUsers,
  recentLogins,
  inactiveUsers,
  newUsersThisMonth,
  className = ''
}) => {
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const inactivePercentage = totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0;
  const adminPercentage = totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Résumé des utilisateurs</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Système actif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          <p className="text-sm text-gray-600">Total utilisateurs</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
          <p className="text-sm text-gray-600">Actifs ({activePercentage}%)</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
          <p className="text-sm text-gray-600">Administrateurs ({adminPercentage}%)</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{recentLogins}</p>
          <p className="text-sm text-gray-600">Connexions (7j)</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Barre de progression de l'activité */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Utilisateurs actifs</span>
            <span>{activePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${activePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Barre de progression des administrateurs */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Administrateurs</span>
            <span>{adminPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${adminPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Alertes */}
        {inactivePercentage > 50 && (
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Taux d'inactivité élevé
              </p>
              <p className="text-sm text-yellow-700">
                {inactivePercentage}% des utilisateurs sont inactifs
              </p>
            </div>
          </div>
        )}

        {newUsersThisMonth > 0 && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Croissance positive
              </p>
              <p className="text-sm text-green-700">
                {newUsersThisMonth} nouveaux utilisateurs ce mois
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModuleSummary;
