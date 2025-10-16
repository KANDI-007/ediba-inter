import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  Paperclip, 
  Smile, 
  Send,
  X,
  Users,
  Settings,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Copy,
  Download,
  Eye,
  Camera,
  Mic,
  PhoneOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  ArrowLeft,
  Menu,
  Bell,
  MoreHorizontal,
  Wifi
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useUserPresence } from '../contexts/UserPresenceContext';
import ChatSidebar from './chat/ChatSidebar';
import ChatConversation from './chat/ChatConversation';
import ChatInput from './chat/ChatInput';
import CallInterface from './chat/CallInterface';
import IncomingCallModal from './chat/IncomingCallModal';
import ConnectedUsersPanel from './chat/ConnectedUsersPanel';
import EmojiPicker from 'emoji-picker-react';

const ChatInterface: React.FC = () => {
  const { 
    isConnected, 
    currentUser, 
    conversations, 
    activeConversation, 
    setActiveConversation,
    activeCall,
    incomingCall,
    answerCall,
    rejectCall,
    endCall
  } = useChat();
  
  const { user } = useAuth();
  const { 
    onlineUsers, 
    isConnected: isPresenceConnected, 
    getUsersOnSameNetwork, 
    getUsersInDifferentTabs 
  } = useUserPresence();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Connexion automatique au chat si l'utilisateur est connecté
  useEffect(() => {
    if (user && !isConnected) {
      const chatUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        avatar: user.profileImage || user.avatar,
        isOnline: true,
        status: 'Disponible'
      };
      
      // Simuler la connexion pour l'instant
      // connectToChat(chatUser);
    }
  }, [user, isConnected]);

  const handleConversationSelect = (conversation: any) => {
    setActiveConversation(conversation);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    // Logique pour créer une nouvelle conversation
    console.log('Nouvelle conversation');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Logique de recherche
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (activeConversation) {
      const otherUser = activeConversation.participants.find(p => p.id !== currentUser?.id);
      if (otherUser) {
        // startCall(otherUser.id, type);
        console.log(`Démarrer un appel ${type} avec ${otherUser.fullName}`);
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Si un appel est actif, afficher l'interface d'appel
  if (activeCall) {
    return (
      <CallInterface 
        call={activeCall}
        onEndCall={() => endCall(activeCall.id)}
        onMinimize={handleMinimize}
        onFullscreen={handleFullscreen}
        isMinimized={isMinimized}
        isFullscreen={isFullscreen}
      />
    );
  }

  // Modal d'appel entrant
  if (incomingCall) {
    return (
      <IncomingCallModal
        call={incomingCall}
        onAnswer={() => answerCall(incomingCall.id)}
        onReject={() => rejectCall(incomingCall.id)}
      />
    );
  }

  return (
    <div className={`fixed inset-0 chat-interface flex ${isFullscreen ? 'z-50' : 'z-40'}`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 chat-sidebar flex flex-col overflow-hidden`}>
        <div className="flex flex-col h-full">
          <ChatSidebar
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            currentUser={currentUser}
          />
          <ConnectedUsersPanel />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white chat-card">
        {/* Header */}
        <div className="chat-header px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="back-button"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="back-button"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            {activeConversation ? (
              <div className="flex items-center space-x-4">
                <div className="relative online-status">
                  <img
                    src={activeConversation.participants.find(p => p.id !== currentUser?.id)?.avatar || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {activeConversation.isGroup 
                      ? activeConversation.groupName 
                      : activeConversation.participants.find(p => p.id !== currentUser?.id)?.fullName
                    }
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {activeConversation.participants.find(p => p.id !== currentUser?.id)?.isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-900">Sélectionnez une conversation</h3>
                <p className="text-sm text-gray-500">Choisissez une conversation pour commencer à discuter</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {activeConversation && (
              <>
                <button
                  onClick={() => handleCall('voice')}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-lg"
                  title="Appel vocal"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCall('video')}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-lg"
                  title="Appel vidéo"
                >
                  <Video className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="back-button"
              title="Paramètres"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col chat-conversation">
          {activeConversation ? (
            <>
              <div className="flex-1 chat-scroll overflow-y-auto">
                <ChatConversation conversation={activeConversation} />
              </div>
              <div className="border-t border-gray-200 bg-white">
                <ChatInput 
                  onSendMessage={(content, type, file, replyTo) => {
                    // sendMessage(content, type, file, replyTo);
                    console.log('Message envoyé:', { content, type, file, replyTo });
                  }}
                  onTyping={() => {
                    // handleTyping();
                  }}
                  showEmojiPicker={showEmojiPicker}
                  onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                />
              </div>
            </>
         ) : (
           <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
             <div className="text-center max-w-lg mx-auto px-8">
               <div className="relative mb-8">
                 <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                   <MessageCircle className="w-16 h-16 text-white" />
                 </div>
                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                   <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                 </div>
               </div>
               <h3 className="text-3xl font-bold text-gray-800 mb-4">
                 Bienvenue dans le chat EDIBA INTER
               </h3>
               <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                 Connectez-vous avec votre équipe, partagez des fichiers et communiquez en temps réel
               </p>
               <div className="space-y-4">
                 <button
                   onClick={handleNewChat}
                   className="gradient-button text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                 >
                   Nouvelle conversation
                 </button>
                 <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                   <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                     <span>En ligne</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                     <span>Sécurisé</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                     <span>Rapide</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-80 chat-card border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Paramètres</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="back-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Paramètres généraux</span>
                <p className="text-sm text-gray-500">Personnaliser votre expérience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md">
              <div className="p-3 bg-green-100 rounded-lg">
                <Archive className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Conversations archivées</span>
                <p className="text-sm text-gray-500">Gérer vos archives</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Messages favoris</span>
                <p className="text-sm text-gray-500">Vos messages importants</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md">
              <div className="p-3 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Corbeille</span>
                <p className="text-sm text-gray-500">Messages supprimés</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
