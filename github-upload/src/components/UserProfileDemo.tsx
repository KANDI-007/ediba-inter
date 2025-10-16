import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Shield,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Save,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileModal from './UserProfileModal';
import UserProfileMenu from './UserProfileMenu';
import UserProfileHeader from './UserProfileHeader';
import { useAuth } from '../contexts/AuthContext';

const UserProfileDemo: React.FC = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, updateUserProfile, logout } = useAuth();

  const handleUpdateProfile = (updatedUser: any) => {
    updateUserProfile(updatedUser);
    console.log('Profil mis à jour:', updatedUser);
  };

  const handleLogout = () => {
    logout();
  };

  const handleImageUpload = (imageFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateUserProfile({ profileImage: result });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Système de Profil Utilisateur</h1>
                <p className="text-sm text-gray-600">Interface chic et professionnelle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Ouvrir le profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Démonstration des composants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar avec différentes tailles */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Avatar Utilisateur</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tailles disponibles</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                  <UserProfileAvatar
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    size="sm"
                    editable={true}
                    onImageChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <UserProfileAvatar
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    size="md"
                    editable={true}
                    onImageChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <UserProfileAvatar
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    size="lg"
                    editable={true}
                    onImageChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">Large</p>
                </div>
                <div className="text-center">
                  <UserProfileAvatar
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    size="xl"
                    editable={true}
                    onImageChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">Extra Large</p>
                </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Fonctionnalités</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Upload de photo de profil
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Initiales automatiques
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Couleurs par rôle
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Indicateur de statut
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Menu de profil */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Menu de Profil</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sidebar</h4>
                <div className="max-w-xs">
                  <UserProfileMenu
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    onLogout={handleLogout}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Header</h4>
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-4">
                  <UserProfileHeader
                    user={user || {
                      id: '1',
                      username: 'admin',
                      fullName: 'Administrateur',
                      email: 'admin@ediba.com',
                      role: 'admin'
                    }}
                    onLogout={handleLogout}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations du Profil</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <p className="text-gray-900 font-medium">{user?.fullName || 'Non défini'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {user?.email || 'Non défini'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <p className="text-gray-900 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {user?.phone || 'Non défini'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adresse</label>
              <p className="text-gray-900 flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                {user?.address || 'Non définie'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rôle</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                <Shield className="w-4 h-4 mr-1" />
                {user?.role || 'Non défini'}
              </span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dernière connexion</label>
              <p className="text-gray-900">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Non définie'}
              </p>
            </div>
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Système de Profil Chic et Professionnel</h3>
            <p className="text-lg mb-6 opacity-90">
              Interface utilisateur moderne avec gestion complète du profil, upload de photos,
              et design élégant qui répond aux standards professionnels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Upload de photo de profil
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Modification des informations
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Design chic et professionnel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de profil */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user || {
          id: '1',
          username: 'admin',
          fullName: 'Administrateur',
          email: 'admin@ediba.com',
          role: 'admin'
        }}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default UserProfileDemo;
