import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Eye
} from 'lucide-react';
import { useActivity, ActivityLog } from '../../contexts/ActivityContext';
import { useAuth } from '../../contexts/AuthContext';
import ActivityDetailsModal from '../ActivityDetailsModal';
import ActivityStatsWidget from '../ActivityStatsWidget';

const ActivityLogModule: React.FC = () => {
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
  const itemsPerPage = 20;

  // ✅ État pour stocker les activités filtrées
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>(activities);

  // ✅ Mettre à jour automatiquement filteredActivities si activities change
  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

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

    return { total, today, successful, failed, uniqueUsers };
  }, [activities]);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'connexion': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'déconnexion': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'création': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'modification': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suppression': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'consultation': return <Eye className="w-4 h-4 text-gray-500" />;
      case 'export': return <Download className="w-4 h-4 text-purple-500" />;
      case 'paiement': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'erreur': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'connexion': return 'bg-green-100 text-green-800';
      case 'déconnexion': return 'bg-gray-100 text-gray-800';
      case 'création': return 'bg-blue-100 text-blue-800';
      case 'modification': return 'bg-yellow-100 text-yellow-800';
      case 'suppression': return 'bg-red-100 text-red-800';
      case 'consultation': return 'bg-gray-100 text-gray-800';
      case 'export': return 'bg-purple-100 text-purple-800';
      case 'paiement': return 'bg-green-100 text-green-800';
      case 'erreur': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Journal d'Activité</h1>
            <p className="text-sky-100">Traçabilité des actions utilisateurs</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportActivities('csv')}
              className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            {hasPermission('settings.manage') && (
              <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer les activités de plus de 90 jours ?')) {
                    clearOldActivities(90);
                  }
                }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Nettoyer anciennes
                </button>
                <button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les activités ? Cette action est irréversible.')) {
                      clearAllActivities();
                    }
                  }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                  Tout supprimer
              </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-sky-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total activités</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              <p className="text-gray-600">Aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.successful}</p>
              <p className="text-gray-600">Réussies</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              <p className="text-gray-600">Échouées</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <User className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
              <p className="text-gray-600">Utilisateurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ActivityStatsWidget />
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher dans les activités..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les utilisateurs</option>
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Liste des activités */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities
                .filter(activity => {
                  const matchesSearch = !searchTerm || 
                    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    activity.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    activity.userName.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  const matchesUser = selectedUser === 'all' || activity.userName === selectedUser;
                  const matchesModule = selectedModule === 'all' || activity.module === selectedModule;
                  
                  return matchesSearch && matchesUser && matchesModule;
                })
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((activity) => {
                  const { date, time } = formatTimestamp(activity.timestamp);
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getActionIcon(activity.action)}
                          <span className="ml-2 text-sm font-medium text-gray-900">{activity.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.userName}</div>
                        <div className="text-sm text-gray-500">{activity.userRole}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.module}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={activity.details}>
                          {activity.details}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.success ? 'Succès' : 'Échec'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
          setSelectedActivity(activity);
          setShowDetailsModal(true);
        }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
            <p className="text-gray-500">Aucune activité ne correspond aux critères de recherche.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredActivities.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * itemsPerPage >= filteredActivities.length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                  {' '}à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredActivities.length)}
                  </span>
                  {' '}sur{' '}
                  <span className="font-medium">{filteredActivities.length}</span>
                  {' '}régultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * itemsPerPage >= filteredActivities.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
};

export default ActivityLogModule;
