import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Shield,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileModal from './UserProfileModal';
import ProfileImageModal from './ProfileImageModal';

interface UserProfileHeaderProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
    profileImage?: string;
    phone?: string;
    address?: string;
    joinDate?: string;
    lastLogin?: string;
  };
  onLogout?: () => void;
  onUpdateProfile?: (updatedUser: any) => void;
  className?: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  onLogout,
  onUpdateProfile,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'comptable':
        return 'Comptable';
      case 'commercial':
        return 'Commercial';
      case 'lecture':
        return 'Lecture seule';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600';
      case 'comptable':
        return 'text-blue-600';
      case 'commercial':
        return 'text-green-600';
      case 'lecture':
        return 'text-gray-600';
      default:
        return 'text-indigo-600';
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const handleImageClick = () => {
    setShowImageModal(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <UserProfileAvatar
            user={user}
            size="sm"
            editable={false}
            showZoomButton={true}
            onImageClick={handleImageClick}
          />
          
          <div className="hidden md:block text-left min-w-0">
            <p className="text-sm font-semibold text-white truncate group-hover:text-blue-200 transition-colors duration-200">
              {user.fullName}
            </p>
            <p className="text-xs text-white/70">
              {getRoleText(user.role)}
            </p>
          </div>
          
          <ChevronDown 
            className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <UserProfileAvatar
                  user={user}
                  size="md"
                  editable={false}
                  showZoomButton={true}
                  onImageClick={handleImageClick}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  <p className={`text-xs ${getRoleColor(user.role)} font-medium`}>
                    {getRoleText(user.role)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-xs">
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-3 h-3 mr-2 text-gray-400" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center text-gray-600 col-span-2">
                    <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
                {user.lastLogin && (
                  <div className="flex items-center text-gray-600 col-span-2">
                    <Shield className="w-3 h-3 mr-2 text-gray-400" />
                    <span>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Mon profil</span>
              </button>

              <button
                onClick={() => {
                  // Action pour les notifications
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Bell className="w-4 h-4 text-gray-400" />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => {
                  // Action pour les paramètres
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Paramètres</span>
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdateProfile={onUpdateProfile}
        onLogout={onLogout}
      />

      {/* Profile Image Modal */}
      <ProfileImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        user={user}
      />

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default UserProfileHeader;
