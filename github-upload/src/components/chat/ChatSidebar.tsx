import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical,
  Archive,
  Star,
  Trash2,
  Settings,
  Users,
  Filter
} from 'lucide-react';
import { ChatConversation, ChatUser } from '../../contexts/ChatContext';

interface ChatSidebarProps {
  conversations: ChatConversation[];
  onConversationSelect: (conversation: ChatConversation) => void;
  onNewChat: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentUser: ChatUser | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  onConversationSelect,
  onNewChat,
  onSearch,
  searchQuery,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'status'>('chats');
  const [showFilter, setShowFilter] = useState(false);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    if (conv.isGroup) {
      return conv.groupName?.toLowerCase().includes(searchLower);
    } else {
      const otherUser = conv.participants.find(p => p.id !== currentUser?.id);
      return otherUser?.fullName.toLowerCase().includes(searchLower) ||
             otherUser?.username.toLowerCase().includes(searchLower);
    }
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 jours
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getLastMessagePreview = (conversation: ChatConversation) => {
    if (!conversation.lastMessage) return 'Aucun message';
    
    const { type, content, senderId } = conversation.lastMessage;
    const isFromCurrentUser = senderId === currentUser?.id;
    const prefix = isFromCurrentUser ? 'Vous: ' : '';
    
    switch (type) {
      case 'image':
        return `${prefix}📷 Photo`;
      case 'document':
        return `${prefix}📄 Document`;
      case 'audio':
        return `${prefix}🎵 Audio`;
      case 'video':
        return `${prefix}🎥 Vidéo`;
      case 'call':
        return `${prefix}📞 Appel`;
      default:
        return `${prefix}${content}`;
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--whatsapp-sidebar-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--whatsapp-border)', backgroundColor: 'var(--whatsapp-sidebar-bg)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--whatsapp-text-primary)' }}>Chat</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Filtres"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onNewChat}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Nouvelle conversation"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des conversations..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm whatsapp-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--whatsapp-border)', backgroundColor: 'var(--whatsapp-sidebar-bg)' }}>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'chats'
              ? 'border-b-2 border-blue-600'
              : 'hover:bg-opacity-10'
          }`}
          style={{
            color: activeTab === 'chats' ? 'var(--whatsapp-accent)' : 'var(--whatsapp-text-secondary)',
            backgroundColor: activeTab === 'chats' ? 'rgba(0, 168, 132, 0.1)' : 'transparent'
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Conversations</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'calls'
              ? 'border-b-2 border-blue-600'
              : 'hover:bg-opacity-10'
          }`}
          style={{
            color: activeTab === 'calls' ? 'var(--whatsapp-accent)' : 'var(--whatsapp-text-secondary)',
            backgroundColor: activeTab === 'calls' ? 'rgba(0, 168, 132, 0.1)' : 'transparent'
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Appels</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'status'
              ? 'border-b-2 border-blue-600'
              : 'hover:bg-opacity-10'
          }`}
          style={{
            color: activeTab === 'status' ? 'var(--whatsapp-accent)' : 'var(--whatsapp-text-secondary)',
            backgroundColor: activeTab === 'status' ? 'rgba(0, 168, 132, 0.1)' : 'transparent'
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Statuts</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <div className="divide-y" style={{ borderColor: 'var(--whatsapp-border)' }}>
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--whatsapp-text-primary)' }}>
                  {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                </h3>
                <p className="mb-6" style={{ color: 'var(--whatsapp-text-secondary)' }}>
                  {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Commencez une nouvelle conversation'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={onNewChat}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    Commencer une conversation
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherUser = conversation.participants.find(p => p.id !== currentUser?.id);
                const displayName = conversation.isGroup 
                  ? conversation.groupName 
                  : otherUser?.fullName || 'Utilisateur inconnu';
                const avatar = conversation.isGroup 
                  ? conversation.groupAvatar 
                  : otherUser?.avatar;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onConversationSelect(conversation)}
                    className="p-4 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid var(--whatsapp-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--whatsapp-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {conversation.isGroup ? (
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-7 h-7 text-white" />
                          </div>
                        ) : (
                          <img
                            src={avatar || '/default-avatar.png'}
                            alt={displayName}
                            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                          />
                        )}
                        {!conversation.isGroup && otherUser?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-bold truncate" style={{ color: 'var(--whatsapp-text-primary)' }}>
                            {displayName}
                          </h3>
                          <span className="text-xs font-medium" style={{ color: 'var(--whatsapp-text-secondary)' }}>
                            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm truncate" style={{ color: 'var(--whatsapp-text-secondary)' }}>
                            {getLastMessagePreview(conversation)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="text-white text-xs font-bold rounded-full px-3 py-1 min-w-[24px] text-center shadow-lg" style={{ backgroundColor: 'var(--whatsapp-accent)' }}>
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Phone className="w-10 h-10 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun appel récent</h3>
            <p className="text-gray-500 mb-6">Vos appels vocaux et vidéo apparaîtront ici</p>
            <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg">
              Nouvel appel
            </button>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun statut disponible</h3>
            <p className="text-gray-500 mb-6">Les statuts de vos contacts apparaîtront ici</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg">
              Créer un statut
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filtres
          </h4>
          <div className="space-y-3">
            <label className="flex items-center p-3 hover:bg-white hover:bg-opacity-50 rounded-xl cursor-pointer transition-all duration-200">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
              <span className="ml-3 text-sm font-medium text-gray-700">Non lus</span>
            </label>
            <label className="flex items-center p-3 hover:bg-white hover:bg-opacity-50 rounded-xl cursor-pointer transition-all duration-200">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
              <span className="ml-3 text-sm font-medium text-gray-700">Groupes</span>
            </label>
            <label className="flex items-center p-3 hover:bg-white hover:bg-opacity-50 rounded-xl cursor-pointer transition-all duration-200">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
              <span className="ml-3 text-sm font-medium text-gray-700">Favoris</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
