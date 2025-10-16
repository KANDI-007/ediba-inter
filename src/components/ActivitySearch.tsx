import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useActivity, ActivityLog } from '../contexts/ActivityContext';

interface ActivitySearchProps {
  onResults: (activities: ActivityLog[]) => void;
}

const ActivitySearch: React.FC<ActivitySearchProps> = ({ onResults }) => {
  const { activities } = useActivity();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    user: '',
    module: '',
    action: '',
    success: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Recherche textuelle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(term) ||
        activity.module.toLowerCase().includes(term) ||
        activity.details.toLowerCase().includes(term) ||
        activity.userName.toLowerCase().includes(term) ||
        activity.userRole.toLowerCase().includes(term)
      );
    }

    // Filtres
    if (filters.user) {
      filtered = filtered.filter(activity => activity.userName === filters.user);
    }
    if (filters.module) {
      filtered = filtered.filter(activity => activity.module === filters.module);
    }
    if (filters.action) {
      filtered = filtered.filter(activity => activity.action === filters.action);
    }
    if (filters.success !== '') {
      filtered = filtered.filter(activity => 
        activity.success === (filters.success === 'true')
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) <= new Date(filters.dateTo)
      );
    }

    return filtered;
  }, [activities, searchTerm, filters]);

  // Notifier les résultats
  React.useEffect(() => {
    onResults(filteredActivities);
  }, [filteredActivities, onResults]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      user: '',
      module: '',
      action: '',
      success: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(value => value !== '');

  // Obtenir les options uniques
  const users = [...new Set(activities.map(a => a.userName))].sort();
  const modules = [...new Set(activities.map(a => a.module))].sort();
  const actions = [...new Set(activities.map(a => a.action))].sort();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche principale */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans les activités..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showFilters 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur</label>
                <select
                  value={filters.user}
                  onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les utilisateurs</option>
                  {users.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                <select
                  value={filters.module}
                  onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les modules</option>
                  {modules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les actions</option>
                  {actions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={filters.success}
                  onChange={(e) => setFilters(prev => ({ ...prev, success: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="true">Réussies</option>
                  <option value="false">Échouées</option>
                </select>
              </div>

              {/* Date de début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''} trouvée{filteredActivities.length !== 1 ? 's' : ''}
            </div>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Filtres actifs:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {filters.user && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Utilisateur: {filters.user}
                  </span>
                )}
                {filters.module && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Module: {filters.module}
                  </span>
                )}
                {filters.action && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Action: {filters.action}
                  </span>
                )}
                {filters.success && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    Statut: {filters.success === 'true' ? 'Réussi' : 'Échoué'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySearch;
