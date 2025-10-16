import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContextSimple';
import { useAuth } from '../contexts/AuthContext';
import FileUploadModal from './FileUploadModal';
import FileMessage from './FileMessage';
import ProfileModal from './ProfileModal';
import CallModal from './CallModal';
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Users,
  Settings,
  MessageCircle,
  CheckCheck,
  Clock,
  Pin,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Copy,
  Download,
  Share,
  FileText,
  Image,
  User,
  Edit3
} from 'lucide-react';

const EspaceEdibaChat: React.FC = () => {
  const { 
    connectToChat, 
    sendMessage, 
    joinConversation, 
    onlineUsers, 
    messages, 
    isConnected,
    currentUser,
    initiateCall,
    answerCall,
    endCall,
    activeCall,
    incomingCall,
    setIncomingCall
  } = useChat();
  
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug: Log des changements d'incomingCall
  useEffect(() => {
    console.log('🔍 incomingCall changé:', incomingCall);
    if (incomingCall) {
      console.log('🔍 Modal d\'appel entrant devrait s\'afficher');
    }
  }, [incomingCall]);
  const conversationId = 'espace-ediba-conversation';

  // Connexion automatique au chat Espace EDIBA
  useEffect(() => {
    if (user && isConnected) {
      console.log('🔄 Connexion à Espace EDIBA pour:', user);
      joinConversation(conversationId);
    }
  }, [user, isConnected, joinConversation]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sélectionner le premier utilisateur disponible
  useEffect(() => {
    if (onlineUsers.length > 0 && !selectedUser) {
      const otherUser = onlineUsers.find(u => u.id !== user?.id);
      if (otherUser) {
        setSelectedUser(otherUser.id);
      }
    }
  }, [onlineUsers, selectedUser, user?.id]);

  const getSelectedUserInfo = () => {
    return onlineUsers.find(u => u.id === selectedUser);
  };

  const getFilteredMessages = () => {
    // Afficher tous les messages de la conversation Espace EDIBA
    return messages.filter(msg => 
      msg.conversationId === conversationId
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      // Générer un ID unique pour éviter les doublons
      const messageId = `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = {
        id: messageId,
        content: message.trim(),
        senderId: user?.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
        formatting: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          code: false
        },
        type: 'text'
      };
      
      sendMessage(messageData.content, conversationId, messageData);
      setMessage('');
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse du serveur n\'est pas du JSON valide');
      }

      const result = await response.json();

      if (result.success && result.file) {
        // Envoyer le message avec le fichier
        const messageId = `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const messageData = {
          id: messageId,
          content: `📁 ${file.name}`,
          senderId: user?.id,
          conversationId: conversationId,
          timestamp: new Date().toISOString(),
          formatting: {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            code: false
          },
          type: 'file',
          file: result.file
        };
        
        sendMessage(messageData.content, conversationId, messageData);
        console.log('📁 Fichier envoyé:', result.file);
      } else {
        alert('Erreur lors du téléversement du fichier');
      }
    } catch (error) {
      console.error('❌ Erreur téléversement:', error);
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          alert('Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré.');
        } else {
          alert(`Erreur lors du téléversement du fichier: ${error.message}`);
        }
      } else {
        alert('Erreur lors du téléversement du fichier');
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log('✅ Profil mis à jour dans le chat:', updatedProfile);
    // Le profil sera automatiquement synchronisé via le contexte Auth
    // et mis à jour dans la liste des utilisateurs en ligne
  };

  const handleInitiateCall = (targetUserId: string, callType: 'audio' | 'video' = 'audio') => {
    console.log('📞 Initiation d\'appel:', { targetUserId, callType });
    initiateCall(targetUserId, callType);
  };

  const handleAnswerCall = (answer: boolean) => {
    if (incomingCall) {
      console.log('📞 Réponse à l\'appel:', { callId: incomingCall.callId, answer });
      answerCall(incomingCall.callId, answer);
      // Nettoyer l'appel entrant après réponse
      if (answer) {
        setIncomingCall(null);
      } else {
        setIncomingCall(null);
      }
    }
  };

  const handleEndCall = () => {
    if (activeCall) {
      console.log('📞 Fin d\'appel:', activeCall.callId);
      endCall(activeCall.callId);
    }
  };

  const getMessageStatus = (msg: any) => {
    if (msg.senderId === user?.id) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  const filteredUsers = onlineUsers.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Modal de téléversement de fichiers */}
      {showFileUpload && (
        <FileUploadModal
          onFileSelect={handleFileSelect}
          onClose={() => setShowFileUpload(false)}
        />
      )}

      {/* Modal de modification de profil */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {/* Modal d'appel entrant */}
      {incomingCall && (
        <CallModal
          isOpen={!!incomingCall}
          onClose={() => setIncomingCall(null)}
          callData={incomingCall}
          isIncoming={true}
          onAnswer={handleAnswerCall}
          onEndCall={handleEndCall}
        />
      )}

      {/* Modal d'appel sortant/actif */}
      {activeCall && (
        <CallModal
          isOpen={!!activeCall}
          onClose={handleEndCall}
          callData={activeCall}
          isIncoming={false}
          onEndCall={handleEndCall}
        />
      )}
      {/* Sidebar - Liste des utilisateurs */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header Sidebar */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Espace EDIBA</h1>
                <p className="text-blue-100 text-sm">Communication d'équipe</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowProfileModal(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Modifier le profil"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredUsers.map((onlineUser) => (
            <div
              key={onlineUser.id}
              onClick={() => setSelectedUser(onlineUser.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedUser === onlineUser.id 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-md' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={onlineUser.avatar || onlineUser.profileImage || `https://ui-avatars.com/api/?name=${onlineUser.fullName || onlineUser.username}&background=random&color=fff`}
                    alt={onlineUser.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {onlineUser.fullName || onlineUser.username}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {onlineUser.id === user?.id ? 'Vous' : 'En ligne maintenant'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Pin className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Star className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user?.fullName || user?.username}</p>
              <p className="text-sm text-gray-500">En ligne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header du chat */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="ediba-back-button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <div className="relative">
                  <img
                    src={getSelectedUserInfo()?.avatar || getSelectedUserInfo()?.profileImage || `https://ui-avatars.com/api/?name=${getSelectedUserInfo()?.fullName || getSelectedUserInfo()?.username}&background=random&color=fff`}
                    alt={getSelectedUserInfo()?.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {getSelectedUserInfo()?.fullName || getSelectedUserInfo()?.username}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {getSelectedUserInfo()?.id === user?.id ? 'Vous' : 'En ligne maintenant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleInitiateCall(selectedUser, 'audio')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Appel vocal"
                >
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleInitiateCall(selectedUser, 'video')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Appel vidéo"
                >
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 scrollbar-hide">
              <div className="space-y-4">
                {getFilteredMessages().map((msg, index) => (
                  <div
                    key={`${msg.id}-${index}`}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'file' && msg.file ? (
                      <FileMessage 
                        file={msg.file} 
                        isOwn={msg.senderId === user?.id} 
                      />
                    ) : (
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.senderId === user?.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-white text-gray-900 shadow-md'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(msg.timestamp)}</span>
                          {getMessageStatus(msg)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  {showAttachmentMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                      <button 
                        onClick={() => {
                          setShowFileUpload(true);
                          setShowAttachmentMenu(false);
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Document</span>
                      </button>
                      <button 
                        onClick={() => {
                          setShowFileUpload(true);
                          setShowAttachmentMenu(false);
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
                      >
                        <Image className="w-4 h-4" />
                        <span className="text-sm">Photo</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || uploadingFile}
                  className="ediba-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingFile ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Écran d'accueil */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Espace EDIBA</h2>
              <p className="text-gray-600 mb-6">Sélectionnez une conversation pour commencer</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{onlineUsers.length} utilisateur{onlineUsers.length > 1 ? 's' : ''} en ligne</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspaceEdibaChat;
