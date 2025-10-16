import React from 'react';
import { X, Download, Share2, User } from 'lucide-react';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
    profileImage?: string;
  };
}

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!isOpen) return null;

  const displayImage = user.profileImage || user.avatar;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'comptable':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'commercial':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'lecture':
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    }
  };

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

  const handleDownload = () => {
    if (displayImage) {
      const link = document.createElement('a');
      link.href = displayImage;
      link.download = `${user.fullName.replace(/\s+/g, '_')}_profile.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && displayImage) {
      try {
        // Convertir l'image en blob pour le partage
        const response = await fetch(displayImage);
        const blob = await response.blob();
        const file = new File([blob], `${user.fullName}_profile.jpg`, { type: blob.type });
        
        await navigator.share({
          title: `Photo de profil - ${user.fullName}`,
          text: `Photo de profil de ${user.fullName}`,
          files: [file]
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
        // Fallback: copier le lien dans le presse-papier
        if (displayImage) {
          navigator.clipboard.writeText(displayImage);
          alert('Lien de l\'image copié dans le presse-papier');
        }
      }
    } else if (displayImage) {
      // Fallback: copier le lien dans le presse-papier
      navigator.clipboard.writeText(displayImage);
      alert('Lien de l\'image copié dans le presse-papier');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getRoleColor(user.role)}`}>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.fullName)}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.fullName}</h3>
                <p className="text-blue-100">{getRoleText(user.role)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {displayImage && (
                <>
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Télécharger"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Partager"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {displayImage ? (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={displayImage}
                  alt={`Photo de profil de ${user.fullName}`}
                  className="max-w-full max-h-[60vh] rounded-xl shadow-lg object-contain"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <User className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Photo de profil
                </h4>
                <p className="text-gray-600 text-sm">
                  Cliquez sur les boutons ci-dessus pour télécharger ou partager cette image
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white font-bold text-4xl ${getRoleColor(user.role)}`}>
                <span>{getInitials(user.fullName)}</span>
              </div>
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune photo de profil
                </h4>
                <p className="text-gray-600">
                  {user.fullName} n'a pas encore ajouté de photo de profil
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Les initiales sont affichées à la place
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
