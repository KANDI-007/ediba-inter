import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserModal from '../UserModal';
import UserAvatar from '../UserAvatar';
import RoleBadge from '../RoleBadge';
import UserStatus from '../UserStatus';
import UserStatsCard from '../UserStatsCard';
import UserSearchBar from '../UserSearchBar';
import UserNotification from '../UserNotification';
import { useUserNotifications } from '../../hooks/useUserNotifications';
import UserLoadingSpinner from '../UserLoadingSpinner';
import UserCardSkeleton from '../UserCardSkeleton';
import UserTableSkeleton from '../UserTableSkeleton';
import UserDeleteConfirm from '../UserDeleteConfirm';
import UserDashboardStats from '../UserDashboardStats';
import UserAdvancedFilters from '../UserAdvancedFilters';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Shield, 
  UserCheck, 
  Clock, 
  Mail, 
  Crown,
  Briefcase,
  BookOpen,
  Calculator,
  Grid,
  List,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Zap
} from 'lucide-react';

const UsersModule: React.FC = () => {
  const { users, addUser, deleteUser, hasPermission } = useAuth() as any;
  const { notifications, removeNotification, showSuccess, showError } = useUserNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'lastLogin' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const canManage = hasPermission('users.manage');

  // Filtrage et tri des utilisateurs
  const filteredUsers = useMemo(() => {
    let filtered = (users || []).filter((user: any) => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.user.lastLogin) ||
                           (statusFilter === 'inactive' && !user.user.lastLogin);
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Tri
    filtered.sort((a: any, b: any) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.user.fullName || a.username).toLowerCase();
          bValue = (b.user.fullName || b.username).toLowerCase();
          break;
        case 'role':
          aValue = a.user.role;
          bValue = b.user.role;
          break;
        case 'lastLogin':
          aValue = new Date(a.user.lastLogin || 0).getTime();
          bValue = new Date(b.user.lastLogin || 0).getTime();
          break;
        case 'created':
          aValue = new Date(a.user.createdAt || 0).getTime();
          bValue = new Date(b.user.createdAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  // Statistiques des utilisateurs
  const stats = useMemo(() => {
    const totalUsers = users?.length || 0;
    const activeUsers = users?.filter((u: any) => u.user.lastLogin)?.length || 0;
    const adminUsers = users?.filter((u: any) => u.user.role === 'admin')?.length || 0;
    const recentLogins = users?.filter((u: any) => {
      if (!u.user.lastLogin) return false;
      const lastLogin = new Date(u.user.lastLogin);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastLogin > weekAgo;
    })?.length || 0;
    const inactiveUsers = totalUsers - activeUsers;
    const newUsersThisMonth = users?.filter((u: any) => {
      if (!u.user.createdAt) return false;
      const createdAt = new Date(u.user.createdAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return createdAt > monthAgo;
    })?.length || 0;
    const lastMonthUsers = Math.max(0, totalUsers - newUsersThisMonth);

    return { 
      totalUsers, 
      activeUsers, 
      adminUsers, 
      recentLogins, 
      inactiveUsers, 
      newUsersThisMonth, 
      lastMonthUsers 
    };
  }, [users]);

  // Configuration des rôles
  const roleConfig = {
    admin: { 
      label: 'Administrateur', 
      color: 'bg-red-500', 
      icon: Crown, 
      description: 'Accès complet au système',
      gradient: 'from-red-500 to-red-600'
    },
    comptable: { 
      label: 'Comptable', 
      color: 'bg-blue-500', 
      icon: Calculator, 
      description: 'Gestion comptable et financière',
      gradient: 'from-blue-500 to-blue-600'
    },
    commercial: { 
      label: 'Commercial', 
      color: 'bg-green-500', 
      icon: Briefcase, 
      description: 'Gestion commerciale et clients',
      gradient: 'from-green-500 to-green-600'
    },
    lecture: { 
      label: 'Lecture seule', 
      color: 'bg-gray-500', 
      icon: BookOpen, 
      description: 'Consultation uniquement',
      gradient: 'from-gray-500 to-gray-600'
    }
  };

  const getRoleConfig = (role: string) => roleConfig[role as keyof typeof roleConfig] || roleConfig.lecture;

  const handleAddUser = async (userData: any) => {
    setIsLoading(true);
    try {
      addUser(userData);
      setShowAddModal(false);
      showSuccess('Utilisateur créé', `L'utilisateur "${userData.username}" a été créé avec succès.`);
    } catch (error) {
      showError('Erreur', 'Impossible de créer l\'utilisateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    setIsLoading(true);
    try {
      // Pour l'instant, on utilise addUser qui remplace l'utilisateur existant
      addUser(userData);
      setEditingUser(null);
      showSuccess('Utilisateur modifié', `L'utilisateur "${userData.username}" a été modifié avec succès.`);
    } catch (error) {
      showError('Erreur', 'Impossible de modifier l\'utilisateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    try {
      deleteUser(userToDelete.username);
      showSuccess('Utilisateur supprimé', `L'utilisateur "${userToDelete.username}" a été supprimé avec succès.`);
    } catch (error) {
      showError('Erreur', 'Impossible de supprimer l\'utilisateur.');
    } finally {
      setIsLoading(false);
      setUserToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleAdvancedFilters = (filters: any) => {
    // Implémentation des filtres avancés
    console.log('Filtres avancés appliqués:', filters);
  };

  const formatLastLogin = (lastLogin: string | undefined) => {
    if (!lastLogin) return 'Jamais connecté';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 168) return `Il y a ${Math.floor(diffInHours / 24)}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusColor = (lastLogin: string | undefined) => {
    if (!lastLogin) return 'text-gray-500 bg-gray-100';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return 'text-green-600 bg-green-100';
    if (diffInHours < 168) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec statistiques */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-600 mt-1">Gérez les accès et permissions de votre équipe</p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Nouvel Utilisateur
              </button>
            )}
          </div>

          {/* Statistiques */}
          <UserDashboardStats
            totalUsers={stats.totalUsers}
            activeUsers={stats.activeUsers}
            adminUsers={stats.adminUsers}
            recentLogins={stats.recentLogins}
            inactiveUsers={stats.inactiveUsers}
            newUsersThisMonth={stats.newUsersThisMonth}
            lastMonthUsers={stats.lastMonthUsers}
          />
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Barre de recherche et filtres */}
        <div className="mb-6">
          <UserSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onClearFilters={handleClearFilters}
          />
          
          {/* Bouton de filtres avancés */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres avancés
            </button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisateurs ({filteredUsers.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  <UserCardSkeleton count={8} />
                ) : (
                  filteredUsers.map((user: any) => {
                  return (
                    <div key={user.username} className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-200 hover:border-gray-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <UserAvatar 
                            role={user.user.role}
                            name={user.user.fullName || user.username}
                            size="lg"
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{user.user.fullName || user.username}</h4>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
      {canManage && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <RoleBadge role={user.user.role} size="sm" />
                          <UserStatus lastLogin={user.user.lastLogin} size="sm" />
                        </div>
                        
                        {user.user.email && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">{user.user.email}</span>
        </div>
      )}

                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{formatLastLogin(user.user.lastLogin)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {isLoading ? (
                <UserTableSkeleton rows={5} />
              ) : (
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user: any) => {
                    return (
                      <tr key={user.username} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserAvatar 
                              role={user.user.role}
                              name={user.user.fullName || user.username}
                              size="md"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.user.fullName || user.username}</div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <RoleBadge role={user.user.role} size="sm" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.user.email || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <UserStatus lastLogin={user.user.lastLogin} size="sm" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatLastLogin(user.user.lastLogin)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {canManage ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
                    );
                  })}
          </tbody>
        </table>
              )}
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Aucun utilisateur ne correspond à vos critères de recherche.' 
                  : 'Commencez par ajouter votre premier utilisateur.'}
              </p>
              {canManage && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />

      <UserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleUpdateUser}
        editingUser={editingUser}
      />

      {/* Notifications */}
      {notifications.map((notification) => (
        <UserNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Confirmation de suppression */}
      <UserDeleteConfirm
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        username={userToDelete?.username || ''}
        userFullName={userToDelete?.user?.fullName}
      />

      {/* Filtres avancés */}
      <UserAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={handleAdvancedFilters}
      />
    </div>
  );
};

export default UsersModule;