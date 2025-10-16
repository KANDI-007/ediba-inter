import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContextSimple';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  Menu,
  ArrowLeft,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Plus,
  Users,
  MessageCircle
} from 'lucide-react';

interface ModernChatProps {
  className?: string;
}

const ModernChat: React.FC<ModernChatProps> = ({ className = '' }) => {
  const { isConnected, onlineUsers, messages, sendMessage, joinConversation } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'conversations' | 'calls'>('conversations');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = 'modern-chat-conversation';

  // Connexion automatique au chat (sans notifications répétitives)
  useEffect(() => {
    if (user && !isConnected) {
      joinConversation(conversationId);
    }
  }, [user, isConnected, joinConversation]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sélectionner le premier utilisateur connecté par défaut
  useEffect(() => {
    if (onlineUsers.length > 0 && !selectedUser) {
      const otherUser = onlineUsers.find(u => u.id !== user?.id);
      if (otherUser) {
        setSelectedUser(otherUser.id);
      }
    }
  }, [onlineUsers, selectedUser, user?.id]);

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      // Générer un ID unique pour éviter les doublons
      const messageId = `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = {
        id: messageId,
        content: message.trim(),
        senderId: user?.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      };
      
      sendMessage(messageData.content, conversationId, messageData);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSelectedUserInfo = () => {
    return onlineUsers.find(u => u.id === selectedUser);
  };

  const getFilteredMessages = () => {
    return messages.filter(msg => 
      msg.senderId === user?.id || msg.senderId === selectedUser
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMessageStatus = (msg: any) => {
    if (msg.senderId === user?.id) {
      return <CheckCheck size={12} className="text-blue-500" />;
    }
    return null;
  };

  return (
    <div className={`h-screen bg-gray-50 flex overflow-hidden ${className}`}>
      {/* Sidebar Sombre */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-500 ease-in-out bg-gray-900 flex flex-col shadow-2xl`}>
        {/* Header Sidebar */}
        <div className="bg-gray-900 text-white p-6 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <h2 className="font-bold text-lg">Chat</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200">
              <Filter size={18} className="text-gray-400" />
            </button>
            <button className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg transition-all duration-200">
              <Plus size={18} className="text-white" />
            </button>
            <button 
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 lg:hidden"
            >
              <ArrowLeft size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher des conversations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'conversations'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'calls'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Users size={14} />
              <span>Appels</span>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-gray-800">
          {onlineUsers.length > 0 ? (
            <div className="p-2">
              {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.id}
                  onClick={() => {
                    setSelectedUser(onlineUser.id);
                    setShowSidebar(false);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700 ${
                    selectedUser === onlineUser.id 
                      ? 'bg-gray-700 border-l-4 border-green-500' 
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getInitials(onlineUser.fullName)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {onlineUser.fullName}
                    </h4>
                    <p className="text-sm text-gray-400 truncate">
                      {onlineUser.id === user?.id ? 'Vous' : 'En ligne maintenant'}
                    </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(new Date().toISOString())}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucune conversation</h3>
              <p className="text-gray-400 text-sm mb-6">Commencez une nouvelle conversation</p>
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
                Commencer une conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone Principale Claire */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(getSelectedUserInfo()?.fullName || 'U')}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getSelectedUserInfo()?.fullName || 'Utilisateur'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getSelectedUserInfo()?.id === user?.id ? 'Vous' : 'En ligne maintenant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Phone size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Video size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="space-y-4">
                {getFilteredMessages().map((msg, index) => (
                  <div
                    key={`${msg.id}-${index}`}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      msg.senderId === user?.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center justify-end mt-2 space-x-1 ${
                        msg.senderId === user?.id ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs font-medium">
                          {formatTime(msg.timestamp)}
                        </span>
                        {getMessageStatus(msg)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Paperclip size={18} className="text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                    disabled={!isConnected}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all duration-200">
                    <Smile size={16} className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !message.trim()}
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full hover:from-purple-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center space-x-3">
                  <ArrowLeft size={20} className="text-gray-600" />
                  <Menu size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sélectionnez une conversation</h3>
                  <p className="text-sm text-gray-500">Choisissez une conversation pour commencer à discuter</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Welcome Content */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <MessageCircle size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Bienvenue dans le chat EDIBA INTER
                </h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Connectez-vous avec votre équipe, partagez des fichiers et communiquez en temps réel
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Nouvelle conversation
                </button>
                
                {/* Status Indicators */}
                <div className="flex justify-center space-x-6 mt-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">En ligne</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Rapide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernChat;
