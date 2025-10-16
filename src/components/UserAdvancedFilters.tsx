import React, { useState } from 'react';
import { Filter, X, Calendar, Users, Shield, Clock } from 'lucide-react';

interface UserAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    dateRange: { start: string; end: string };
    roleFilter: string[];
    statusFilter: string[];
    lastLoginRange: { start: string; end: string };
  }) => void;
  className?: string;
}

const UserAdvancedFilters: React.FC<UserAdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  className = ''
}) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    roleFilter: [] as string[],
    statusFilter: [] as string[],
    lastLoginRange: { start: '', end: '' }
  });

  const roles = [
    { value: 'admin', label: 'Administrateur', color: 'bg-red-100 text-red-800' },
    { value: 'comptable', label: 'Comptable', color: 'bg-blue-100 text-blue-800' },
    { value: 'commercial', label: 'Commercial', color: 'bg-green-100 text-green-800' },
    { value: 'lecture', label: 'Lecture seule', color: 'bg-gray-100 text-gray-800' }
  ];

  const statuses = [
    { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
    { value: 'recent', label: 'Récent', color: 'bg-blue-100 text-blue-800' }
  ];

  const handleRoleToggle = (role: string) => {
    setFilters(prev => ({
      ...prev,
      roleFilter: prev.roleFilter.includes(role)
        ? prev.roleFilter.filter(r => r !== role)
        : [...prev.roleFilter, role]
    }));
  };

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      statusFilter: prev.statusFilter.includes(status)
        ? prev.statusFilter.filter(s => s !== status)
        : [...prev.statusFilter, status]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      roleFilter: [],
      statusFilter: [],
      lastLoginRange: { start: '', end: '' }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-12 sm:w-12">
                  <Filter className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  Filtres avancés
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Filtre par rôles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rôles
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleRoleToggle(role.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        filters.roleFilter.includes(role.value)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {role.label}
                        </span>
                        {filters.roleFilter.includes(role.value) && (
                          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Statut
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusToggle(status.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        filters.statusFilter.includes(status.value)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {status.label}
                        </span>
                        {filters.statusFilter.includes(status.value) && (
                          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par date de création */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date de création
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Du</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Au</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Filtre par dernière connexion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dernière connexion
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Du</label>
                    <input
                      type="date"
                      value={filters.lastLoginRange.start}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        lastLoginRange: { ...prev.lastLoginRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Au</label>
                    <input
                      type="date"
                      value={filters.lastLoginRange.end}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        lastLoginRange: { ...prev.lastLoginRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleApply}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Appliquer les filtres
            </button>
            <button
              onClick={handleReset}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Réinitialiser
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAdvancedFilters;
