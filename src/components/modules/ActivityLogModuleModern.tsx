import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  Download, 
  Trash2,
  RefreshCw,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useActivity, ActivityLog } from '../../contexts/ActivityContext';
import { useAuth } from '../../contexts/AuthContext';
import ActivityLogStatsCard from '../ActivityLogStatsCard';
import ActivityLogCard from '../ActivityLogCard';
import ActivityLogSearchBar from '../ActivityLogSearchBar';
import ActivityLogChart from '../ActivityLogChart';
import ActivityDetailsModal from '../ActivityDetailsModal';

const ActivityLogModuleModern: React.FC = () => {
  const { activities, clearOldActivities, clearAllActivities, exportActivities } = useActivity();
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [chartPeriod, setChartPeriod] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const itemsPerPage = 20;

  // Obtenir la liste unique des utilisateurs, modules et actions
  const users = useMemo(() => {
    return [...new Set(activities.map(a => a.userName))].sort();
  }, [activities]);

  const modules = useMemo(() => {
    return [...new Set(activities.map(a => a.module))].sort();
  }, [activities]);

  const actions = useMemo(() => {
    return [...new Set(activities.map(a => a.action))].sort();
  }, [activities]);

  // Statistiques globales
  const stats = useMemo(() => {
    const total = activities.length;
    const today = activities.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length;
    const successful = activities.filter(a => a.success).length;
    const failed = activities.filter(a => !a.success).length;
    const uniqueUsers = new Set(activities.map(a => a.userId)).size;
    const thisWeek = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }).length;
    const thisMonth = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return activityDate >= monthAgo;
    }).length;

    return { total, today, successful, failed, uniqueUsers, thisWeek, thisMonth };
  }, [activities]);

  // Filtrage des activités
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = !searchTerm || 
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser = selectedUser === 'all' || activity.userName === selectedUser;
      const matchesModule = selectedModule === 'all' || activity.module === selectedModule;
      const matchesAction = selectedAction === 'all' || activity.action === selectedAction;

      const matchesDateRange = (!dateRange.start || new Date(activity.timestamp) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(activity.timestamp) <= new Date(dateRange.end));

      return matchesSearch && matchesUser && matchesModule && matchesAction && matchesDateRange;
    });
  }, [activities, searchTerm, selectedUser, selectedModule, selectedAction, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calcul des tendances
  const trends = useMemo(() => {
    const lastWeek = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return activityDate >= twoWeeksAgo && activityDate < oneWeekAgo;
    }).length;

    const thisWeek = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return activityDate >= oneWeekAgo;
    }).length;

    const weekGrowth = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return {
      weekGrowth: Math.round(weekGrowth * 10) / 10,
      successRate: stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0
    };
  }, [activities, stats]);

  const handleViewDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    exportActivities('csv');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedUser('all');
    setSelectedModule('all');
    setSelectedAction('all');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDeleteActivity = (activity: ActivityLog) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      // Implémenter la suppression d'une activité spécifique
      console.log('Suppression de l\'activité:', activity.id);
    }
  };

  const handleExportActivity = (activity: ActivityLog) => {
    // Implémenter l'export d'une activité spécifique
    console.log('Export de l\'activité:', activity.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Journal d'Activité</h1>
                <p className="text-sm text-gray-600">Traçabilité et monitoring des actions utilisateurs</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Liste
                </button>
              </div>

              {/* Chart Period */}
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hour">Par heure</option>
                <option value="day">Par jour</option>
                <option value="week">Par semaine</option>
                <option value="month">Par mois</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActivityLogStatsCard
              title="Total des activités"
              value={stats.total.toLocaleString()}
              change={trends.weekGrowth}
              changeType={trends.weekGrowth > 0 ? 'positive' : trends.weekGrowth < 0 ? 'negative' : 'neutral'}
              icon={Activity}
              color="bg-blue-500"
              gradient="from-blue-500 to-blue-600"
              description="Toutes les activités enregistrées"
              trend={{ value: trends.weekGrowth, period: 'vs semaine dernière' }}
            />
            
            <ActivityLogStatsCard
              title="Aujourd'hui"
              value={stats.today.toString()}
              change={stats.today > 0 ? 100 : 0}
              changeType="positive"
              icon={Clock}
              color="bg-green-500"
              gradient="from-green-500 to-green-600"
              description="Activités d'aujourd'hui"
            />
            
            <ActivityLogStatsCard
              title="Taux de succès"
              value={`${trends.successRate}%`}
              change={trends.successRate - 85}
              changeType={trends.successRate > 85 ? 'positive' : 'negative'}
              icon={CheckCircle}
              color="bg-purple-500"
              gradient="from-purple-500 to-purple-600"
              description="Activités réussies"
            />
            
            <ActivityLogStatsCard
              title="Utilisateurs actifs"
              value={stats.uniqueUsers.toString()}
              change={stats.uniqueUsers > 0 ? 100 : 0}
              changeType="positive"
              icon={Users}
              color="bg-orange-500"
              gradient="from-orange-500 to-orange-600"
              description="Utilisateurs uniques"
            />
          </div>

          {/* Search and Filters */}
          <ActivityLogSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedUser={selectedUser}
            onUserChange={setSelectedUser}
            selectedModule={selectedModule}
            onModuleChange={setSelectedModule}
            selectedAction={selectedAction}
            onActionChange={setSelectedAction}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onClearFilters={handleClearFilters}
            onExport={handleExport}
            onRefresh={handleRefresh}
            users={users}
            modules={modules}
            actions={actions}
            totalResults={filteredActivities.length}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLogChart
              activities={activities}
              type="bar"
              period={chartPeriod}
            />
            
            <ActivityLogChart
              activities={activities}
              type="line"
              period={chartPeriod}
            />
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
                    <p className="text-sm text-gray-500">
                      {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Page {currentPage} sur {totalPages}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {paginatedActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
                  <p className="text-gray-500">Ajustez vos filtres pour voir plus de résultats</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedActivities.map((activity) => (
                    <ActivityLogCard
                      key={activity.id}
                      activity={activity}
                      onViewDetails={handleViewDetails}
                      onExport={handleExportActivity}
                      onDelete={hasPermission('settings.manage') ? handleDeleteActivity : undefined}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredActivities.length)} sur {filteredActivities.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Details Modal */}
      {showDetailsModal && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default ActivityLogModuleModern;
