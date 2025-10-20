// Composant de chat amélioré pour test multi-utilisateurs
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Users, 
  Phone, 
  Video, 
  Send, 
  Smile, 
  Paperclip,
  MoreVertical,
  Search,
  Settings,
  UserPlus,
  LogOut
} from 'lucide-react';
import { useChat } from '../contexts/ChatContextAdvanced';
import { useAuth } from '../contexts/AuthContext';

const ChatModuleAdvanced: React.FC = () => {
  const { 
    isConnected, 
    connectionStatus,
    currentUser, 
    onlineUsers, 
    conversations,
    activeConversation,
    messages,
    typingUsers,
    connectToChat, 
    disconnectFromChat,
    createConversation,
    joinConversation,
    sendMessage,
    sendTypingIndicator,
    searchUsers,
    getUserById
  } = useChat();
  
  const { user } = useAuth();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connexion automatique au chat
  useEffect(() => {
    if (user && !isConnected) {
      const chatUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        avatar: user.profileImage || user.avatar,
        isOnline: true,
        status: 'available' as const
      };
      
      connectToChat(chatUser);
    }
  }, [user, isConnected, connectToChat]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion de l'indicateur de frappe
  useEffect(() => {
    if (isTyping && activeConversation) {
      sendTypingIndicator(activeConversation.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTypingIndicator(activeConversation.id, false);
      }, 1000);
    }
  }, [isTyping, activeConversation, sendTypingIndicator]);

  // Nettoyage à la déconnexion
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      disconnectFromChat();
    };
  }, [disconnectFromChat]);

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation) {
      sendMessage(messageInput.trim(), activeConversation.id);
      setMessageInput('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key !== 'Enter') {
      setIsTyping(true);
    }
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length > 0) {
      const conversationId = createConversation(selectedUsers, false);
      joinConversation(conversationId);
      setSelectedUsers([]);
      setShowUserList(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = searchUsers(searchQuery);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Chat EDIBA</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-500">
                {connectionStatus === 'connected' ? 'Connecté' : 
                 connectionStatus === 'connecting' ? 'Connexion...' : 'Déconnecté'}
              </span>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Utilisateurs en ligne ({onlineUsers.length})</h3>
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {showUserList && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Créer une conversation</h4>
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <label key={user.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{user.fullName}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0}
                className="mt-2 w-full bg-blue-500 text-white py-1 px-3 rounded text-sm disabled:bg-gray-300"
              >
                Créer ({selectedUsers.length})
              </button>
            </div>
          )}

          {/* Online Users */}
          <div className="space-y-2">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => {
                  const existingConv = conversations.find(conv => 
                    conv.participants.includes(user.id) && conv.participants.includes(currentUser?.id || '')
                  );
                  if (existingConv) {
                    joinConversation(existingConv.id);
                  } else {
                    const conversationId = createConversation([user.id], false);
                    joinConversation(conversationId);
                  }
                }}
              >
                <div className="relative">
                  <img
                    src={user.avatar || './default-avatar.png'}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.status || 'Disponible'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.avatar || './default-avatar.png'}
              alt={currentUser?.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.fullName}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.status || 'Disponible'}
              </p>
            </div>
            <button
              onClick={disconnectFromChat}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src="./default-avatar.png"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {activeConversation.isGroup ? activeConversation.groupName : 'Conversation'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeConversation.participants.length} participant(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUser?.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers[activeConversation.id] && typingUsers[activeConversation.id].length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm">
                      {typingUsers[activeConversation.id].map(user => user.username).join(', ')} 
                      {typingUsers[activeConversation.id].length === 1 ? ' tape...' : ' tapent...'}
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez un utilisateur pour commencer à chatter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModuleAdvanced;
