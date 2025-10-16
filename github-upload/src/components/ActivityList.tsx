import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ActivityLog } from '../contexts/ActivityContext';

interface ActivityListProps {
  activities: ActivityLog[];
  onActivityClick: (activity: ActivityLog) => void;
  itemsPerPage?: number;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onActivityClick,
  itemsPerPage = 20
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ActivityLog>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activities, sortField, sortDirection]);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedActivities.slice(startIndex, endIndex);
  }, [sortedActivities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);

  const handleSort = (field: keyof ActivityLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getActivityIcon = (action: string, success: boolean) => {
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
      case 'erreur':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (action: string, success: boolean) => {
    if (!success) return 'bg-red-100 text-red-800';
    
    switch (action.toLowerCase()) {
      case 'connexion':
        return 'bg-green-100 text-green-800';
      case 'création':
        return 'bg-blue-100 text-blue-800';
      case 'modification':
        return 'bg-yellow-100 text-yellow-800';
      case 'suppression':
        return 'bg-red-100 text-red-800';
      case 'export':
        return 'bg-purple-100 text-purple-800';
      case 'paiement':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const SortButton: React.FC<{ field: keyof ActivityLog; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Liste des activités ({sortedActivities.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="action">Action</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="module">Module</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="userName">Utilisateur</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="timestamp">Date/Heure</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="success">Statut</SortButton>
              </th>
              <th className="px-6 py-3 text-left">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedActivities.map((activity) => {
              const { date, time } = formatTimestamp(activity.timestamp);
              return (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onActivityClick(activity)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getActivityIcon(activity.action, activity.success)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {activity.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{activity.module}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{activity.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{date}</div>
                    <div className="text-sm text-gray-500">{time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.action, activity.success)}`}>
                      {activity.success ? 'Réussi' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {activity.details}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, sortedActivities.length)} sur {sortedActivities.length} activités
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
