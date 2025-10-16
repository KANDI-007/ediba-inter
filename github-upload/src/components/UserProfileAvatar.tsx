import React, { useState, useRef } from 'react';
import { Camera, User, Edit3, Check, X, ZoomIn } from 'lucide-react';

interface UserProfileAvatarProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
    profileImage?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageChange?: (imageFile: File) => void;
  className?: string;
  showZoomButton?: boolean;
  onImageClick?: () => void;
}

const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  user,
  size = 'md',
  editable = false,
  onImageChange,
  className = '',
  showZoomButton = false,
  onImageClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (fileInputRef.current?.files?.[0] && onImageChange) {
      onImageChange(fileInputRef.current.files[0]);
    }
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAvatarClick = () => {
    if (editable && !isEditing) {
      fileInputRef.current?.click();
    } else if (onImageClick && displayImage) {
      onImageClick();
    }
  };

  const displayImage = previewImage || user.profileImage || user.avatar;

  return (
    <div className={`relative group ${className}`}>
      {/* Avatar Container */}
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 ${
          editable ? 'cursor-pointer hover:scale-105' : ''
        } ${getRoleColor(user.role)}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAvatarClick}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={user.fullName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(user.fullName)}</span>
        )}

        {/* Overlay pour l'édition ou zoom */}
        {isHovered && !isEditing && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            {editable ? (
              <Camera className="w-4 h-4 text-white" />
            ) : showZoomButton && displayImage ? (
              <ZoomIn className="w-4 h-4 text-white" />
            ) : null}
          </div>
        )}

        {/* Indicateur de statut */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      {/* Boutons d'édition */}
      {isEditing && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <button
            onClick={handleSaveImage}
            className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200 shadow-lg"
            title="Sauvegarder"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
            title="Annuler"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default UserProfileAvatar;
