import React from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const UserModuleFinal: React.FC = () => {
  const users = [
    {
      id: 1,
      username: 'admin',
      fullName: 'Administrateur Principal',
      email: 'admin@ediba.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      avatar: 'AP',
      joinDate: '2024-01-01',
      permissions: ['all'],
      location: 'Lomé, Togo',
      phone: '+228 90 12 34 56'
    },
    {
      id: 2,
      username: 'comptable1',
      fullName: 'Jean Dupont',
      email: 'jean.dupont@ediba.com',
      role: 'comptable',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      avatar: 'JD',
      joinDate: '2024-01-05',
      permissions: ['comptabilite', 'facturation'],
      location: 'Lomé, Togo',
      phone: '+228 90 23 45 67'
    },
    {
      id: 3,
      username: 'commercial1',
      fullName: 'Marie Martin',
      email: 'marie.martin@ediba.com',
      role: 'commercial',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      avatar: 'MM',
      joinDate: '2024-01-10',
      permissions: ['commercial', 'clients'],
      location: 'Lomé, Togo',
      phone: '+228 90 34 56 78'
    },
    {
      id: 4,
      username: 'lecture1',
      fullName: 'Pierre Durand',
      email: 'pierre.durand@ediba.com',
      role: 'lecture',
      status: 'inactive',
      lastLogin: null,
      avatar: 'PD',
      joinDate: '2024-01-12',
      permissions: ['lecture'],
      location: 'Lomé, Togo',
      phone: '+228 90 45 67 89'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'comptable': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'lecture': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'comptable': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'commercial': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'lecture': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Jamais connecté';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-sm text-gray-600">Interface moderne et intuitive</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {users.length}
                </p>
                <p className="text-sm text-gray-600">Utilisateurs totaux</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +25% ce mois
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Activity className="w-4 h-4 mr-1" />
              +15% ce mois
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-sm text-gray-600">Administrateurs</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Stable
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-sm text-gray-600">Connexions (7j)</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% cette semaine
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm">
                <option>Tous les rôles</option>
                <option>Administrateur</option>
                <option>Comptable</option>
                <option>Commercial</option>
                <option>Lecture seule</option>
              </select>
              
              <select className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm">
                <option>Tous les statuts</option>
                <option>Actif</option>
                <option>Inactif</option>
              </select>
              
              <button className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton d'ajout */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <UserPlus className="w-5 h-5" />
            <span className="font-semibold">Nouvel utilisateur</span>
          </button>
        </div>

        {/* Grille d'utilisateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 ${getAvatarColor(user.role)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{user.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Rejoint le {new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {formatLastLogin(user.lastLogin)}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Voir
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm">
                  <Edit className="w-4 h-4 inline mr-1" />
                  Modifier
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-red-700 bg-gradient-to-r from-red-100 to-red-200 rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-200 shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Affichage de 1 à {users.length} sur {users.length} utilisateurs
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
              Précédent
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg shadow-lg">
              1
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
              2
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
              3
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModuleFinal;
