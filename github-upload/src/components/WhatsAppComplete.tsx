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
  MessageCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  AtSign,
  Hash,
  Star,
  Pin,
  Reply,
  Forward,
  Download,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Unlock,
  Archive,
  Trash2,
  Edit3,
  Copy,
  Share,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Sad,
  Surprised,
  Camera,
  Image,
  FileText,
  Music,
  MapPin,
  Calendar,
  Clock as ClockIcon,
  PhoneCall,
  VideoCall,
  Settings,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Unlink,
  ImageIcon,
  FileIcon,
  FolderIcon,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalLow,
  SignalHigh,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  SignalFour,
  SignalFive,
  SignalSix,
  SignalSeven,
  SignalEight,
  SignalNine,
  SignalTen,
  SignalEleven,
  SignalTwelve,
  SignalThirteen,
  SignalFourteen,
  SignalFifteen,
  SignalSixteen,
  SignalSeventeen,
  SignalEighteen,
  SignalNineteen,
  SignalTwenty,
  SignalTwentyOne,
  SignalTwentyTwo,
  SignalTwentyThree,
  SignalTwentyFour,
  SignalTwentyFive,
  SignalTwentySix,
  SignalTwentySeven,
  SignalTwentyEight,
  SignalTwentyNine,
  SignalThirty,
  SignalThirtyOne,
  SignalThirtyTwo,
  SignalThirtyThree,
  SignalThirtyFour,
  SignalThirtyFive,
  SignalThirtySix,
  SignalThirtySeven,
  SignalThirtyEight,
  SignalThirtyNine,
  SignalForty,
  SignalFortyOne,
  SignalFortyTwo,
  SignalFortyThree,
  SignalFortyFour,
  SignalFortyFive,
  SignalFortySix,
  SignalFortySeven,
  SignalFortyEight,
  SignalFortyNine,
  SignalFifty,
  SignalFiftyOne,
  SignalFiftyTwo,
  SignalFiftyThree,
  SignalFiftyFour,
  SignalFiftyFive,
  SignalFiftySix,
  SignalFiftySeven,
  SignalFiftyEight,
  SignalFiftyNine,
  SignalSixty,
  SignalSixtyOne,
  SignalSixtyTwo,
  SignalSixtyThree,
  SignalSixtyFour,
  SignalSixtyFive,
  SignalSixtySix,
  SignalSixtySeven,
  SignalSixtyEight,
  SignalSixtyNine,
  SignalSeventy,
  SignalSeventyOne,
  SignalSeventyTwo,
  SignalSeventyThree,
  SignalSeventyFour,
  SignalSeventyFive,
  SignalSeventySix,
  SignalSeventySeven,
  SignalSeventyEight,
  SignalSeventyNine,
  SignalEighty,
  SignalEightyOne,
  SignalEightyTwo,
  SignalEightyThree,
  SignalEightyFour,
  SignalEightyFive,
  SignalEightySix,
  SignalEightySeven,
  SignalEightyEight,
  SignalEightyNine,
  SignalNinety,
  SignalNinetyOne,
  SignalNinetyTwo,
  SignalNinetyThree,
  SignalNinetyFour,
  SignalNinetyFive,
  SignalNinetySix,
  SignalNinetySeven,
  SignalNinetyEight,
  SignalNinetyNine,
  SignalHundred
} from 'lucide-react';

interface WhatsAppCompleteProps {
  className?: string;
}

const WhatsAppComplete: React.FC<WhatsAppCompleteProps> = ({ className = '' }) => {
  const { isConnected, onlineUsers, messages, sendMessage, joinConversation } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'conversations' | 'calls' | 'status' | 'communities'>('conversations');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [messageReactions, setMessageReactions] = useState<{[key: string]: string[]}>({});
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const [draftMessages, setDraftMessages] = useState<{[key: string]: string}>({});
  const [messageFormatting, setMessageFormatting] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);
  const conversationId = 'whatsapp-complete-conversation';

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

  // Gestion du typing indicator
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      // Simuler l'envoi de l'indicateur de frappe
    } else if (!message.trim() && isTyping) {
      setIsTyping(false);
    }
  }, [message, isTyping]);

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      const messageId = `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = {
        id: messageId,
        content: message.trim(),
        senderId: user?.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
        formatting: messageFormatting,
        type: 'text'
      };
      
      sendMessage(messageData.content, conversationId, messageData);
      setMessage('');
      setMessageFormatting({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        code: false
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFormatting = (format: keyof typeof messageFormatting) => {
    setMessageFormatting(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction]
    }));
  };

  const handlePinMessage = (messageId: string) => {
    setPinnedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setMessage(`@${messageToReply.senderId} ${messageToReply.content} `);
      textAreaRef.current?.focus();
    }
  };

  const handleForward = (messageId: string) => {
    // Logique de transfert de message
    console.log('Forwarding message:', messageId);
  };

  const handleCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCallInterface(true);
  };

  const handleEndCall = () => {
    setShowCallInterface(false);
    setCallType(null);
  };

  const handleMediaUpload = (type: 'image' | 'video' | 'document' | 'audio') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 
                  type === 'video' ? 'video/*' : 
                  type === 'audio' ? 'audio/*' : '*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Logique d'upload de fichier
        console.log('Uploading file:', file);
      }
    };
    
    input.click();
  };

  const getSelectedUserInfo = () => {
    return onlineUsers.find(u => u.id === selectedUser);
  };

  const getFilteredMessages = () => {
    // Afficher tous les messages de la conversation, indépendamment de l'expéditeur
    // Cela garantit que l'expéditeur et le destinataire voient tous les messages
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMessageStatus = (msg: any) => {
    if (msg.senderId === user?.id) {
      return <CheckCheck size={12} className="text-blue-500" />;
    }
    return null;
  };

  const formatMessageContent = (content: string, formatting: any) => {
    let formattedContent = content;
    
    if (formatting?.bold) formattedContent = `**${formattedContent}**`;
    if (formatting?.italic) formattedContent = `*${formattedContent}*`;
    if (formatting?.underline) formattedContent = `__${formattedContent}__`;
    if (formatting?.strikethrough) formattedContent = `~~${formattedContent}~~`;
    if (formatting?.code) formattedContent = `\`${formattedContent}\``;
    
    return formattedContent;
  };

  const renderMessage = (msg: any, index: number) => {
    const isPinned = pinnedMessages.includes(msg.id);
    const reactions = messageReactions[msg.id] || [];
    
    return (
      <div
        key={`${msg.id}-${index}`}
        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-fadeIn`}
      >
        <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm relative ${
          msg.senderId === user?.id
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md'
            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
        }`}>
          {isPinned && (
            <div className="absolute -top-2 -right-2">
              <Pin size={16} className="text-yellow-500" />
            </div>
          )}
          
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              {msg.senderId !== user?.id && (
                <span className="text-xs font-semibold text-gray-600">
                  {getSelectedUserInfo()?.fullName}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">
                {formatTime(msg.timestamp)}
              </span>
              {getMessageStatus(msg)}
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {formatMessageContent(msg.content, msg.formatting)}
            </p>
          </div>
          
          {/* Réactions */}
          {reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {reactions.map((reaction, idx) => (
                <span key={idx} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                  {reaction}
                </span>
              ))}
            </div>
          )}
          
          {/* Actions du message */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleReaction(msg.id, '❤️')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart size={14} />
              </button>
              <button
                onClick={() => handleReply(msg.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Reply size={14} />
              </button>
              <button
                onClick={() => handleForward(msg.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Forward size={14} />
              </button>
            </div>
            <button
              onClick={() => handlePinMessage(msg.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Pin size={14} className={isPinned ? 'text-yellow-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen bg-gray-50 flex overflow-hidden ${className}`}>
      {/* Sidebar Sombre */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-500 ease-in-out bg-gray-900 flex flex-col shadow-2xl`}>
        {/* Header Sidebar */}
        <div className="bg-gray-900 text-white p-6 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <h2 className="font-bold text-lg">WhatsApp</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200">
              <Filter size={18} className="text-gray-400" />
            </button>
            <button className="p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200">
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
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-sm placeholder-gray-400"
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
              <Phone size={14} />
              <span>Appels</span>
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'status'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Statut
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'communities'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Communautés
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
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700 group ${
                    selectedUser === onlineUser.id 
                      ? 'bg-gray-700 border-l-4 border-green-500' 
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
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
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
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
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
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
                <button 
                  onClick={() => handleCall('audio')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <Phone size={18} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => handleCall('video')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
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
                {getFilteredMessages().map((msg, index) => renderMessage(msg, index))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Formatting Toolbar */}
              {showFormattingToolbar && (
                <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => handleFormatting('bold')}
                    className={`p-2 rounded ${messageFormatting.bold ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatting('italic')}
                    className={`p-2 rounded ${messageFormatting.italic ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatting('underline')}
                    className={`p-2 rounded ${messageFormatting.underline ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <Underline size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatting('strikethrough')}
                    className={`p-2 rounded ${messageFormatting.strikethrough ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <Strikethrough size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatting('code')}
                    className={`p-2 rounded ${messageFormatting.code ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <Code size={16} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <Paperclip size={18} className="text-gray-600" />
                </button>
                
                {/* Media Picker */}
                {showMediaPicker && (
                  <div className="absolute bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-2">
                    <button
                      onClick={() => handleMediaUpload('image')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Image size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleMediaUpload('video')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Video size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleMediaUpload('document')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileText size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleMediaUpload('audio')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Music size={20} className="text-gray-600" />
                    </button>
                  </div>
                )}
                
                <div className="flex-1 relative">
                  <textarea
                    ref={textAreaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowFormattingToolbar(true)}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                    disabled={!isConnected}
                    rows={1}
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <Smile size={16} className="text-gray-600" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !message.trim()}
                  className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
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
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <MessageCircle size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Bienvenue dans WhatsApp EDIBA INTER
                </h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Connectez-vous avec votre équipe, partagez des fichiers et communiquez en temps réel avec toutes les fonctionnalités WhatsApp
                </p>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Rapide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Interface */}
      {showCallInterface && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                {callType === 'video' ? <Video size={32} className="text-white" /> : <Phone size={32} className="text-white" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {callType === 'video' ? 'Appel vidéo' : 'Appel audio'}
              </h3>
              <p className="text-gray-600 mb-6">
                Appel en cours avec {getSelectedUserInfo()?.fullName}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleEndCall}
                  className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Phone size={24} />
                </button>
                {callType === 'video' && (
                  <button className="p-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors">
                    <Video size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppComplete;
