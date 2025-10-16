import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Camera, User, Mail, Phone, MapPin, Save, Upload } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updatedProfile: any) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onProfileUpdate }) => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || user?.avatar || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(profileData.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse du serveur n\'est pas du JSON valide');
      }

      const result = await response.json();

      if (result.success && result.file) {
        const imageUrl = `http://localhost:3000${result.file.url}`;
        setPreviewImage(imageUrl);
        setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
        console.log('📸 Photo de profil téléversée:', result.file);
      } else {
        alert('Erreur lors du téléversement de la photo');
      }
    } catch (error) {
      console.error('❌ Erreur téléversement photo:', error);
      alert('Erreur lors du téléversement de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB pour les photos de profil)
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo est trop volumineuse. Taille maximale: 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    try {
      // Mettre à jour le profil dans le contexte d'authentification
      const updatedUser = {
        ...user,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
        avatar: profileData.profileImage
      };

      // Mettre à jour dans le contexte
      await updateUser(updatedUser);
      
      // Notifier le parent
      onProfileUpdate(updatedUser);
      
      // Fermer la modal
      onClose();
      
      console.log('✅ Profil mis à jour:', updatedUser);
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white ediba-card p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-ediba-primary mb-6">Modifier le Profil</h2>

        {/* Photo de profil */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={previewImage || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=random&color=fff`}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full object-cover border-4 border-ediba-border"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-ediba-secondary text-white rounded-full p-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-ediba-text-light mt-2">
            Cliquez sur l'icône caméra pour changer votre photo
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ediba-text mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nom complet
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              className="ediba-input w-full"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ediba-text mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="ediba-input w-full"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ediba-text mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Téléphone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="ediba-input w-full"
              placeholder="+237 6XX XXX XXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ediba-text mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Adresse
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              className="ediba-input w-full"
              placeholder="Votre adresse"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ediba-text mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="ediba-input w-full h-20 resize-none"
              placeholder="Parlez-nous de vous..."
              maxLength={200}
            />
            <p className="text-xs text-ediba-text-light mt-1">
              {profileData.bio.length}/200 caractères
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg text-ediba-text-light hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="ediba-primary-button flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
