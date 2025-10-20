import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Users, 
  Settings, 
  Search,
  Plus,
  MoreVertical,
  Archive,
  Star,
  Trash2,
  Filter,
  X
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContextSimple';
import { useAuth } from '../../contexts/AuthContext';
import ChatInterface from '../ChatInterface';

const ChatModule: React.FC = () => {
  const { 
    isConnected, 
    currentUser, 
    conversations, 
    onlineUsers,
    connectToChat,
    disconnectFromChat,
    createConversation,
    searchUsers
  } = useChat();
  
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState('');

  // Initialiser la connexion au chat
  useEffect(() => {
    if (user && !isConnected && !isInitialized) {
      const chatUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        avatar: user.profileImage || user.avatar,
        isOnline: true,
        status: 'Disponible'
      };
      
      // Simuler la connexion pour la démonstration
      console.log('Connexion au chat pour:', chatUser);
      setIsInitialized(true);
    }
  }, [user, isConnected, isInitialized]);

  // Nettoyage à la déconnexion
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectFromChat();
      }
    };
  }, []);

  const handleNewChat = () => {
    setShowNewChatModal(true);
    setSelectedUsers([]);
    setIsGroupChat(false);
    setGroupName('');
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) return;

    if (isGroupChat && !groupName.trim()) {
      alert('Veuillez entrer un nom pour le groupe');
      return;
    }

    createConversation(selectedUsers, isGroupChat, groupName.trim() || undefined);
    setShowNewChatModal(false);
    setSelectedUsers([]);
    setIsGroupChat(false);
    setGroupName('');
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Utilisateurs simulés pour la démonstration
  const availableUsers = [
    { id: '1', username: 'admin', fullName: 'Administrateur', avatar: './default-avatar.png', isOnline: true },
    { id: '2', username: 'manager', fullName: 'Gestionnaire', avatar: './default-avatar.png', isOnline: true },
    { id: '3', username: 'user1', fullName: 'Utilisateur 1', avatar: './default-avatar.png', isOnline: false },
    { id: '4', username: 'user2', fullName: 'Utilisateur 2', avatar: './default-avatar.png', isOnline: true },
    { id: '5', username: 'user3', fullName: 'Utilisateur 3', avatar: './default-avatar.png', isOnline: true },
  ];

  const filteredUsers = availableUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat EDIBA INTER</h1>
              <p className="text-gray-600">
                {isConnected ? 'Connecté' : 'Déconnecté'} • {onlineUsers.length} utilisateurs en ligne
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau chat</span>
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isGroupChat ? 'Nouveau groupe' : 'Nouvelle conversation'}
              </h2>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Group Name Input */}
            {isGroupChat && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Entrez le nom du groupe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto mb-6">
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUsers.includes(user.id)
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src="./default-avatar.png"
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Group Chat Toggle */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isGroupChat}
                  onChange={(e) => setIsGroupChat(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Créer un groupe</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0 || (isGroupChat && !groupName.trim())}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGroupChat ? 'Créer le groupe' : 'Démarrer la conversation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModule;
