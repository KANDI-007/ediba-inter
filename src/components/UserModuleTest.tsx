import React from 'react';
import { Users, UserCheck, Crown, Activity } from 'lucide-react';

const UserModuleTest: React.FC = () => {
  const testUsers = [
    {
      username: 'admin',
      user: {
        fullName: 'Administrateur Principal',
        email: 'admin@ediba.com',
        role: 'admin',
        lastLogin: new Date().toISOString()
      }
    },
    {
      username: 'comptable1',
      user: {
        fullName: 'Jean Dupont',
        email: 'jean.dupont@ediba.com',
        role: 'comptable',
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      username: 'commercial1',
      user: {
        fullName: 'Marie Martin',
        email: 'marie.martin@ediba.com',
        role: 'commercial',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      username: 'lecture1',
      user: {
        fullName: 'Pierre Durand',
        email: 'pierre.durand@ediba.com',
        role: 'lecture',
        lastLogin: undefined
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Module Utilisateurs
          </h1>
          <p className="text-gray-600">
            Interface de test pour vérifier le fonctionnement du module utilisateurs
          </p>
        </div>

        {/* Statistiques de test */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{testUsers.length}</p>
                <p className="text-sm text-gray-600">Utilisateurs de test</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {testUsers.filter(u => u.user.lastLogin).length}
                </p>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {testUsers.filter(u => u.user.role === 'admin').length}
                </p>
                <p className="text-sm text-gray-600">Administrateurs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {testUsers.filter(u => {
                    if (!u.user.lastLogin) return false;
                    const lastLogin = new Date(u.user.lastLogin);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return lastLogin > weekAgo;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Connexions (7j)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs de test */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisateurs de test
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {testUsers.map((user, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      user.user.role === 'admin' ? 'bg-red-500' :
                      user.user.role === 'comptable' ? 'bg-blue-500' :
                      user.user.role === 'commercial' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}>
                      {user.user.role === 'admin' ? 'A' :
                       user.user.role === 'comptable' ? 'C' :
                       user.user.role === 'commercial' ? 'S' : 'L'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {user.user.fullName}
                      </h4>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.user.role === 'comptable' ? 'bg-blue-100 text-blue-800' :
                        user.user.role === 'commercial' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.user.role}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.user.lastLogin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.user.lastLogin ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    {user.user.email && (
                      <p className="text-xs text-gray-600 truncate">
                        {user.user.email}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {user.user.lastLogin 
                        ? `Connecté ${new Date(user.user.lastLogin).toLocaleDateString()}`
                        : 'Jamais connecté'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Instructions de test
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Vérifiez que les statistiques s'affichent correctement</li>
            <li>• Testez la recherche et les filtres</li>
            <li>• Vérifiez les modals de création/modification</li>
            <li>• Testez la confirmation de suppression</li>
            <li>• Vérifiez les notifications</li>
            <li>• Testez les vues grille et liste</li>
            <li>• Vérifiez la responsivité sur mobile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserModuleTest;
