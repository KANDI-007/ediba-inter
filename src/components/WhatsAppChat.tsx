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
  Clock
} from 'lucide-react';

interface WhatsAppChatProps {
  className?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ className = '' }) => {
  const { isConnected, onlineUsers, messages, sendMessage, joinConversation } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = 'whatsapp-conversation';

  // Connexion automatique au chat
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
      sendMessage(message.trim(), conversationId);
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
    <div className={`h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden ${className}`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-500 ease-in-out bg-white shadow-2xl border-r border-gray-200 flex flex-col`}>
        {/* Header Sidebar */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user ? getInitials(user.fullName) : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg">{user?.fullName || 'Utilisateur'}</h2>
              <p className="text-xs text-green-100 flex items-center">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                {isConnected ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-200">
              <MoreVertical size={20} />
            </button>
            <button 
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 lg:hidden"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-2">
            <h3 className="text-xs font-bold text-gray-500 mb-3 px-3 uppercase tracking-wider">Utilisateurs Connectés</h3>
            {onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                onClick={() => {
                  setSelectedUser(onlineUser.id);
                  setShowSidebar(false);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50 ${
                  selectedUser === onlineUser.id 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 shadow-md' 
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {getInitials(onlineUser.fullName)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-3 border-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate text-base">
                      {onlineUser.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 truncate flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      En ligne maintenant
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {formatTime(new Date().toISOString())}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {getInitials(getSelectedUserInfo()?.fullName || 'U')}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {getSelectedUserInfo()?.fullName || 'Utilisateur'}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    En ligne maintenant
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                  <Phone size={20} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                  <Video size={20} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                  <MoreVertical size={20} className="text-gray-600 group-hover:text-green-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-6 scrollbar-hide">
              <div className="space-y-4">
                {getFilteredMessages().map((msg, index) => (
                  <div
                    key={`${msg.id}-${index}`}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`max-w-md px-6 py-3 rounded-3xl shadow-lg ${
                      msg.senderId === user?.id
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center justify-end mt-2 space-x-1 ${
                        msg.senderId === user?.id ? 'text-green-100' : 'text-gray-500'
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
            <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <button className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                  <Paperclip size={20} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-6 py-4 pr-12 border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 text-sm shadow-sm"
                    disabled={!isConnected}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-all duration-200">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !message.trim()}
                  className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="text-white text-4xl">💬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                WhatsApp EDIBA INTER
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Sélectionnez une conversation pour commencer à chatter avec votre équipe
              </p>
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                {isConnected ? '✅ Connecté' : '❌ Déconnecté'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat;
