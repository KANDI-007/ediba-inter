import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileModal from './UserProfileModal';

const ProfileTest: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (imageFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateUserProfile({ profileImage: result });
      console.log('Photo mise à jour !', result.substring(0, 50) + '...');
    };
    reader.readAsDataURL(imageFile);
  };

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Test du Changement de Photo</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-4">Avatar avec Upload</h2>
          <UserProfileAvatar
            user={user}
            size="xl"
            editable={true}
            onImageChange={handleImageUpload}
          />
          <p className="mt-4 text-gray-600">
            Cliquez sur l'avatar pour changer la photo
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ouvrir le Modal de Profil
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Informations Utilisateur</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nom:</strong> {user.fullName}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Rôle:</strong> {user.role}
            </div>
            <div>
              <strong>Photo:</strong> {user.profileImage ? 'Oui' : 'Non'}
            </div>
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={user}
        onUpdateProfile={updateUserProfile}
        onLogout={logout}
      />
    </div>
  );
};

export default ProfileTest;
