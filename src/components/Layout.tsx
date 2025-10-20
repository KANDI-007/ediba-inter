import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  BarChart3, 
  FileCheck, 
  Menu, 
  X, 
  LogOut,
  Home,
  Settings,
  Bell,
  Calendar,
  Database,
  Activity,
  MessageCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';
import UserProfileMenu from './UserProfileMenu';
import UserProfileHeader from './UserProfileHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission, updateUserProfile, updateUserProfileImage } = useAuth();
  const { getUnreadCount } = useNotifications();

  // Fonction pour gérer le clic sur le logo
  const handleLogoClick = () => {
    // Fermer la sidebar mobile si elle est ouverte
    setSidebarOpen(false);
    // Naviguer vers le tableau de bord sans rechargement
    navigate('/dashboard');
    // Actualiser les données via le contexte sans recharger la page
    // Les données seront automatiquement mises à jour via les hooks React
  };

  // Navigation organisée par catégories logiques
  const navigationCategories = [
    {
      title: 'Principal',
      items: [
        { name: 'Tableau de Bord', href: '/dashboard', icon: Home, permission: 'dashboard.view' },
        { name: 'Facturation', href: '/invoices', icon: FileText, permission: 'invoices.view' },
        { name: 'Chat', href: '/chat', icon: MessageCircle, permission: 'chat.view' },
      ]
    },
    {
      title: 'Gestion',
      items: [
        { name: 'Répertoire d\'articles', href: '/articles', icon: Database, permission: 'reports.view' },
        { name: 'Clients', href: '/clients', icon: Users, permission: 'clients.view' },
        { name: 'Fournisseurs', href: '/suppliers', icon: Users, permission: 'suppliers.view' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Utilisateurs', href: '/users', icon: Users, permission: 'users.manage' },
        { name: 'Décharges', href: '/discharge', icon: FileCheck, permission: 'discharges.view' },
        { name: 'Exercices Fiscaux', href: '/fiscal-years', icon: Calendar, permission: 'fiscal.manage' },
      ]
    },
    {
      title: 'Rapports & Analyse',
      items: [
        { name: 'Rapports', href: '/reports', icon: BarChart3, permission: 'reports.view' },
        { name: 'Journal d\'Activité', href: '/activity-log', icon: Activity, permission: 'settings.manage' },
      ]
    },
    {
      title: 'Système',
      items: [
        { name: 'Sauvegardes', href: '/backups', icon: Database, permission: 'settings.manage' },
        { name: 'Paramètres', href: '/parameters', icon: Settings, permission: 'settings.manage' },
      ]
    }
  ];

  // Filtrer les éléments selon les permissions
  const filteredNavigation = navigationCategories.map(category => ({
    ...category,
    items: category.items.filter(item => hasPermission(item.permission))
  })).filter(category => category.items.length > 0);

  // Fonction pour obtenir le nom de la page actuelle
  const getCurrentPageName = () => {
    for (const category of filteredNavigation) {
      const item = category.items.find(item => item.href === location.pathname);
      if (item) return item.name;
    }
    return 'EDIBA-INTER';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl h-full">
          {/* Header mobile avec style premium */}
          <div className="relative flex h-20 items-center justify-between px-4 bg-gradient-to-br from-brand-blue via-blue-600 to-brand-green flex-shrink-0 overflow-hidden">
            {/* Effet de fond décoratif */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
            
            <button 
              onClick={handleLogoClick}
              className="relative flex items-center space-x-3 hover:scale-105 transition-all duration-300 cursor-pointer group z-10"
              title="Retour au tableau de bord"
            >
              {/* Logo dans un conteneur premium */}
              <div className="relative bg-white p-2 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl"></div>
                <div className="relative bg-white p-1.5 rounded-lg shadow-inner">
                  <img src="./logo-ediba.png" alt="EDIBA-INTER" className="h-6 w-auto" />
                </div>
                {/* Effet de brillance */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
              </div>
              
              {/* Nom de l'entreprise avec style premium */}
              <div className="flex flex-col space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black text-white tracking-wide drop-shadow-lg">EDIBA</span>
                  <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                  <span className="text-lg font-bold text-white/90 tracking-wide drop-shadow-lg">INTER</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/90 font-medium tracking-wide">Solutions Intégrées</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 z-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Navigation mobile organisée par catégories */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto min-h-0">
            {filteredNavigation.map((category) => (
              <div key={category.title} className="space-y-2">
                {/* Titre de catégorie */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
                
                {/* Items de navigation */}
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-blue to-brand-green text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <item.icon className={`h-5 w-5 ${
                            isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                          }`} />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white shadow-lg">
          {/* Header desktop avec style premium */}
          <div className="relative flex h-20 items-center px-4 bg-gradient-to-br from-brand-blue via-blue-600 to-brand-green flex-shrink-0 overflow-hidden">
            {/* Effet de fond décoratif */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            
            <button 
              onClick={handleLogoClick}
              className="relative flex items-center space-x-3 hover:scale-105 transition-all duration-300 cursor-pointer group z-10"
              title="Retour au tableau de bord"
            >
              {/* Logo dans un conteneur premium */}
              <div className="relative bg-white p-2.5 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-inner">
                  <img src="./logo-ediba.png" alt="EDIBA-INTER" className="h-7 w-auto" />
                </div>
                {/* Effet de brillance */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
                {/* Bordure lumineuse */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-transparent to-green-400/20"></div>
              </div>
              
              {/* Nom de l'entreprise avec style premium */}
              <div className="flex flex-col space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black text-white tracking-wide drop-shadow-lg">EDIBA</span>
                  <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                  <span className="text-xl font-bold text-white/90 tracking-wide drop-shadow-lg">INTER</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/90 font-medium tracking-wide">Solutions Intégrées</span>
                </div>
                {/* Ligne décorative */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-white/60 to-transparent rounded-full"></div>
              </div>
            </button>
          </div>
          {/* Navigation desktop organisée par catégories */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto min-h-0">
            {filteredNavigation.map((category) => (
              <div key={category.title} className="space-y-2">
                {/* Titre de catégorie */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
                
                {/* Items de navigation */}
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-blue to-brand-green text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-102'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <item.icon className={`h-5 w-5 ${
                            isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                          }`} />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          {/* Section utilisateur en bas - Fixe */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <UserProfileMenu
              user={{
                id: user?.id || '1',
                username: user?.username || 'utilisateur',
                fullName: user?.fullName || user?.username || 'Utilisateur',
                email: user?.email || 'user@ediba.com',
                role: user?.role || 'utilisateur',
                avatar: user?.avatar,
                profileImage: user?.profileImage,
                phone: user?.phone,
                address: user?.address,
                joinDate: user?.joinDate,
                lastLogin: user?.lastLogin
              }}
              onLogout={logout}
              onUpdateProfile={updateUserProfile}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h1 className="text-lg font-semibold text-gray-900">
                {getCurrentPageName()}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Bouton de notifications */}
              <button
                onClick={() => setNotificationPanelOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {getUnreadCount() > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                  </span>
                )}
              </button>
              
              {/* Profil utilisateur */}
              <UserProfileHeader
                user={{
                  id: user?.id || '1',
                  username: user?.username || 'utilisateur',
                  fullName: user?.fullName || user?.username || 'Utilisateur',
                  email: user?.email || 'user@ediba.com',
                  role: user?.role || 'utilisateur',
                  avatar: user?.avatar,
                  profileImage: user?.profileImage,
                  phone: user?.phone,
                  address: user?.address,
                  joinDate: user?.joinDate,
                  lastLogin: user?.lastLogin
                }}
                onLogout={logout}
                onUpdateProfile={updateUserProfile}
              />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Panel de notifications */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </div>
  );
};

export default Layout;