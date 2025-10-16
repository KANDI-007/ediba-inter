import React from 'react';
import { Users, UserCheck, Crown, Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface UserDashboardStatsProps {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentLogins: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  lastMonthUsers: number;
  className?: string;
}

const UserDashboardStats: React.FC<UserDashboardStatsProps> = ({
  totalUsers,
  activeUsers,
  adminUsers,
  recentLogins,
  inactiveUsers,
  newUsersThisMonth,
  lastMonthUsers,
  className = ''
}) => {
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const inactivePercentage = totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0;
  const adminPercentage = totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0;
  const recentLoginsPercentage = totalUsers > 0 ? Math.round((recentLogins / totalUsers) * 100) : 0;
  
  const userGrowthRate = lastMonthUsers > 0 ? 
    Math.round(((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100) : 0;
  const isGrowthPositive = userGrowthRate >= 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Utilisateurs</p>
              <p className="text-3xl font-bold mt-1">{totalUsers}</p>
              <p className="text-blue-200 text-xs mt-1">Utilisateurs enregistrés</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Utilisateurs Actifs</p>
              <p className="text-3xl font-bold mt-1">{activeUsers}</p>
              <p className="text-green-200 text-xs mt-1">{activePercentage}% du total</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Administrateurs</p>
              <p className="text-3xl font-bold mt-1">{adminUsers}</p>
              <p className="text-purple-200 text-xs mt-1">{adminPercentage}% du total</p>
            </div>
            <Crown className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Connexions (7j)</p>
              <p className="text-3xl font-bold mt-1">{recentLogins}</p>
              <p className="text-orange-200 text-xs mt-1">{recentLoginsPercentage}% du total</p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Utilisateurs Inactifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inactiveUsers}</p>
              <p className="text-gray-500 text-xs mt-1">{inactivePercentage}% du total</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{newUsersThisMonth}</p>
              <div className="flex items-center mt-1">
                {isGrowthPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isGrowthPositive ? '+' : ''}{userGrowthRate}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Taux d'activité</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activePercentage}%</p>
              <p className="text-gray-500 text-xs mt-1">Utilisateurs connectés</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de répartition des rôles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des rôles</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Comptables</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((totalUsers - adminUsers - inactiveUsers) * 0.3)} utilisateurs
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Commerciaux</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((totalUsers - adminUsers - inactiveUsers) * 0.4)} utilisateurs
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Administrateurs</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {adminUsers} utilisateurs
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Lecture seule</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((totalUsers - adminUsers - inactiveUsers) * 0.3)} utilisateurs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardStats;
