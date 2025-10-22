// ChatContext avec détection automatique d'environnement
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationManager } from '../utils/NotificationManager';

// Types pour le chat
export interface ChatUser {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  isOnline: boolean;
  socketId?: string;
  connectedAt?: string;
  lastSeen?: string;
  status?: 'available' | 'busy' | 'away' | 'invisible';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  conversationId: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  formatting?: any;
  isDelivered: boolean;
  isRead: boolean;
  replyTo?: string;
  reactions?: { [userId: string]: string };
}

export interface ChatConversation {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  createdAt: string;
  lastMessageAt?: string;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  unreadCount: number;
}

interface ChatContextType {
  // État de connexion
  isConnected: boolean;
  socket: Socket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  environment: 'local' | 'production';
  websocketUrl: string;
  
  // Utilisateurs
  currentUser: ChatUser | null;
  onlineUsers: ChatUser[];
  
  // Conversations
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  
  // Messages
  messages: ChatMessage[];
  
  // Appels
  activeCall: any | null;
  incomingCall: any | null;
  
  // États de frappe
  typingUsers: { [conversationId: string]: ChatUser[] };
  
  // Fonctions de connexion
  connectToChat: (user: ChatUser) => void;
  disconnectFromChat: () => void;
  
  // Fonctions de conversation
  createConversation: (participants: string[], isGroup?: boolean, groupName?: string) => string;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  
  // Fonctions de message
  sendMessage: (content: string, conversationId: string, messageData?: any) => void;
  sendTypingIndicator: (conversationId: string, isTyping: boolean) => void;
  markMessageAsRead: (messageId: string, conversationId: string) => void;
  addReaction: (messageId: string, reaction: string) => void;
  
  // Fonctions d'appel
  initiateCall: (targetUserId: string, callType?: 'audio' | 'video') => void;
  answerCall: (callId: string, answer: boolean) => void;
  endCall: (callId: string) => void;
  sendCallBeep: (targetUserId: string, beepType?: string) => void;
  setIncomingCall: (call: any | null) => void;
  
  // Fonctions utilitaires
  searchUsers: (query: string) => ChatUser[];
  getUserById: (userId: string) => ChatUser | null;
  getConversationById: (conversationId: string) => ChatConversation | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Détection automatique de l'environnement
  const [environment, setEnvironment] = useState<'local' | 'production'>('local');
  const [websocketUrl, setWebsocketUrl] = useState<string>('http://localhost:3001');
  
  // État de connexion
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Utilisateurs
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  
  // Conversations
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  
  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Appels
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [incomingCall, setIncomingCall] = useState<any | null>(null);
  
  // États de frappe
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: ChatUser[] }>({});
  
  // Refs pour éviter les reconnexions multiples
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Détection automatique de l'environnement
  useEffect(() => {
    const detectEnvironment = () => {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setEnvironment('local');
        setWebsocketUrl('http://localhost:3001');
      } else if (hostname.includes('netlify.app')) {
        setEnvironment('production');
        // URL du serveur WebSocket de production (Railway)
        const productionUrl = import.meta.env.VITE_WEBSOCKET_URL || 'https://ediba-inter-production.up.railway.app';
        setWebsocketUrl(productionUrl);
      } else {
        setEnvironment('production');
        const productionUrl = import.meta.env.VITE_WEBSOCKET_URL || 'https://ediba-inter-production.up.railway.app';
        setWebsocketUrl(productionUrl);
      }
      
      console.log(`🌐 Environnement détecté: ${environment}`);
      console.log(`🔌 URL WebSocket: ${websocketUrl}`);
    };
    
    detectEnvironment();
  }, [environment, websocketUrl]);

  // Connexion au chat avec gestion améliorée
  const connectToChat = (user: ChatUser) => {
    console.log('🔄 Connexion au chat pour:', user);
    console.log(`🌐 Environnement: ${environment}`);
    console.log(`🔌 URL WebSocket: ${websocketUrl}`);
    
    // Demander les permissions de notification
    notificationManager.requestPermission().then(granted => {
      if (granted) {
        console.log('✅ Permissions de notification accordées');
      } else {
        console.log('⚠️ Permissions de notification refusées');
      }
    });
    
    if (socket) {
      socket.disconnect();
    }

    setConnectionStatus('connecting');

    const newSocket = io(websocketUrl, {
      transports: ['polling', 'websocket'],
      timeout: 10000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: maxReconnectAttempts,
      maxReconnectionAttempts: maxReconnectAttempts
    });

    // Gestion des événements de connexion
    newSocket.on('connect', () => {
      console.log('✅ Connexion Socket.IO réussie');
      setIsConnected(true);
      setConnectionStatus('connected');
      setCurrentUser(user);
      setSocket(newSocket);
      reconnectAttempts.current = 0;
      
      // Envoyer les informations utilisateur au serveur
      newSocket.emit('user_connected', {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status || 'available'
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Déconnexion Socket.IO:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      setIsConnected(false);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnexion Socket.IO réussie après', attemptNumber, 'tentatives');
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Erreur de reconnexion Socket.IO:', error);
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setConnectionStatus('error');
      }
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Échec de reconnexion Socket.IO');
      setIsConnected(false);
      setConnectionStatus('error');
    });

    // Écouter les mises à jour de la liste des utilisateurs
    newSocket.on('users_updated', (users) => {
      console.log('👥 Utilisateurs connectés mis à jour:', users.length);
      setOnlineUsers(users);
    });

    // Écouter les conversations chargées
    newSocket.on('conversations_loaded', (userConversations) => {
      console.log('💬 Conversations chargées:', userConversations.length);
      setConversations(userConversations);
    });

    // Écouter l'historique d'une conversation
    newSocket.on('conversation_history', (data) => {
      console.log('📚 Historique de conversation chargé:', data.conversationId);
      setMessages(data.messages);
      
      // Mettre à jour la conversation active
      const conversation = conversations.find(c => c.id === data.conversationId);
      if (conversation) {
        conversation.messages = data.messages;
        setActiveConversation(conversation);
      }
    });

    // Écouter les nouveaux messages
    newSocket.on('new_message', (message) => {
      console.log('💬 Nouveau message reçu:', message);
      
      // Mettre à jour les messages
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === message.id);
        if (!exists) {
          return [...prev, message];
        }
        return prev;
      });
      
      // Mettre à jour les conversations
      setConversations(prev => prev.map(conv => {
        if (conv.id === message.conversationId) {
          const messageExists = conv.messages.some(msg => msg.id === message.id);
          if (!messageExists) {
            return {
              ...conv,
              messages: [...conv.messages, message],
              lastMessageAt: message.timestamp,
              unreadCount: message.senderId !== currentUser?.id ? conv.unreadCount + 1 : conv.unreadCount
            };
          }
        }
        return conv;
      }));
      
      // Envoyer une notification si le message n'est pas de l'utilisateur actuel
      if (message.senderId !== currentUser?.id) {
        notificationManager.sendMessageNotification({
          senderName: message.senderName,
          content: message.content,
          conversationId: message.conversationId
        });
      }
    });

    // Écouter les indicateurs de frappe
    newSocket.on('user_typing', (data) => {
      console.log('⌨️ Utilisateur en train de taper:', data);
      
      setTypingUsers(prev => {
        const currentTyping = prev[data.conversationId] || [];
        let updatedTyping;
        
        if (data.isTyping) {
          // Ajouter l'utilisateur s'il n'est pas déjà dans la liste
          const userExists = currentTyping.some(user => user.id === data.userId);
          if (!userExists) {
            updatedTyping = [...currentTyping, { id: data.userId, username: data.username }];
          } else {
            updatedTyping = currentTyping;
          }
        } else {
          // Retirer l'utilisateur de la liste
          updatedTyping = currentTyping.filter(user => user.id !== data.userId);
        }
        
        return {
          ...prev,
          [data.conversationId]: updatedTyping
        };
      });
    });

    // Écouter les accusés de réception
    newSocket.on('message_delivered', (data) => {
      console.log('✅ Message livré:', data);
      
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId ? { ...msg, isDelivered: true } : msg
      ));
    });

    // Écouter les événements d'appel
    newSocket.on('incoming_call', (callData) => {
      console.log('📞 Appel entrant reçu:', callData);
      setIncomingCall(callData);
      
      // Envoyer une notification push
      notificationManager.sendCallNotification({
        callerId: callData.callerId,
        callerName: callData.callerName,
        callType: callData.callType || 'audio',
        callId: callData.callId
      }).catch(error => {
        console.error('❌ Erreur envoi notification:', error);
      });
    });

    newSocket.on('call_initiated', (callData) => {
      console.log('📞 Appel initié:', callData);
      setActiveCall(callData);
    });

    newSocket.on('call_answered', (callData) => {
      console.log('📞 Appel répondu:', callData);
      if (callData.answer) {
        setActiveCall(prev => prev ? { ...prev, status: 'answered' } : null);
      } else {
        setActiveCall(null);
      }
    });

    newSocket.on('call_ended', (callData) => {
      console.log('📞 Appel terminé:', callData);
      setActiveCall(null);
      setIncomingCall(null);
    });

    newSocket.on('call_beep', (beepData) => {
      console.log('🔊 Bip d\'appel reçu:', beepData);
      // Le bip sera géré par le composant CallModal
    });

    setSocket(newSocket);
  };

  // Déconnexion du chat
  const disconnectFromChat = () => {
    if (socket) {
      console.log('🔌 Déconnexion du chat');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setCurrentUser(null);
      setOnlineUsers([]);
      setConversations([]);
      setMessages([]);
      setActiveConversation(null);
      setActiveCall(null);
      setIncomingCall(null);
      setTypingUsers({});
    }
  };

  // Créer une conversation
  const createConversation = (participants: string[], isGroup: boolean = false, groupName?: string): string => {
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newConversation: ChatConversation = {
      id: conversationId,
      participants,
      messages: [],
      createdAt: new Date().toISOString(),
      isGroup,
      groupName,
      unreadCount: 0
    };
    
    setConversations(prev => [...prev, newConversation]);
    return conversationId;
  };

  // Rejoindre une conversation
  const joinConversation = (conversationId: string) => {
    if (socket) {
      console.log('👥 Rejoindre la conversation:', conversationId);
      socket.emit('join_conversation', conversationId);
      
      // Définir comme conversation active
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
        setMessages(conversation.messages);
        
        // Marquer les messages comme lus
        markConversationAsRead(conversationId);
      }
    }
  };

  // Quitter une conversation
  const leaveConversation = (conversationId: string) => {
    if (socket) {
      console.log('👋 Quitter la conversation:', conversationId);
      socket.emit('leave_conversation', conversationId);
      
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    }
  };

  // Marquer une conversation comme lue
  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  // Envoyer un message
  const sendMessage = (content: string, conversationId: string, messageData?: any) => {
    if (socket && currentUser) {
      const message = messageData || {
        id: `${currentUser.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: currentUser.id,
        senderName: currentUser.fullName || currentUser.username,
        content,
        timestamp: new Date().toISOString(),
        conversationId,
        type: 'text',
        formatting: {},
        isDelivered: false,
        isRead: false
      };

      console.log('📤 Envoi de message:', message);
      
      socket.emit('send_message', {
        ...message,
        conversationId
      });
    }
  };

  // Envoyer un indicateur de frappe
  const sendTypingIndicator = (conversationId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('user_typing', {
        conversationId,
        isTyping
      });
    }
  };

  // Marquer un message comme lu
  const markMessageAsRead = (messageId: string, conversationId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  // Ajouter une réaction à un message
  const addReaction = (messageId: string, reaction: string) => {
    if (socket && currentUser) {
      socket.emit('add_reaction', {
        messageId,
        userId: currentUser.id,
        reaction
      });
    }
  };

  // Fonctions d'appel
  const initiateCall = (targetUserId: string, callType: 'audio' | 'video' = 'audio') => {
    if (socket && currentUser) {
      console.log('📞 Initiation d\'appel:', { targetUserId, callType });
      
      const callData = {
        callerId: currentUser.id,
        callerName: currentUser.fullName || currentUser.username,
        targetUserId,
        callType
      };
      
      socket.emit('initiate_call', callData);
      
      setActiveCall({
        ...callData,
        callId: `${currentUser.id}-${Date.now()}`,
        status: 'ringing'
      });
    }
  };

  const answerCall = (callId: string, answer: boolean) => {
    if (socket) {
      console.log('📞 Réponse à l\'appel:', { callId, answer });
      
      socket.emit('answer_call', {
        callId,
        callerId: incomingCall?.callerId,
        answer
      });
      
      if (answer) {
        setActiveCall(incomingCall);
        setIncomingCall(null);
      } else {
        setIncomingCall(null);
      }
    }
  };

  const endCall = (callId: string) => {
    if (socket) {
      console.log('📞 Fin d\'appel:', callId);
      
      socket.emit('end_call', {
        callId,
        callerId: currentUser?.id
      });
      
      setActiveCall(null);
      setIncomingCall(null);
    }
  };

  const sendCallBeep = (targetUserId: string, beepType: string = 'standard') => {
    if (socket && currentUser) {
      console.log('🔊 Envoi de bip d\'appel:', { targetUserId, beepType });
      
      socket.emit('send_call_beep', {
        targetUserId,
        callerName: currentUser.fullName || currentUser.username,
        beepType
      });
    }
  };

  // Fonctions utilitaires
  const searchUsers = (query: string): ChatUser[] => {
    return onlineUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getUserById = (userId: string): ChatUser | null => {
    return onlineUsers.find(user => user.id === userId) || null;
  };

  const getConversationById = (conversationId: string): ChatConversation | null => {
    return conversations.find(conv => conv.id === conversationId) || null;
  };

  // Effets pour gérer les événements de notification
  useEffect(() => {
    const handleNotificationAcceptCall = (event: CustomEvent) => {
      console.log('🔔 Appel accepté via notification:', event.detail);
      if (incomingCall && incomingCall.callId === event.detail.callId) {
        answerCall(event.detail.callId, true);
      }
    };

    const handleNotificationRejectCall = (event: CustomEvent) => {
      console.log('🔔 Appel refusé via notification:', event.detail);
      if (incomingCall && incomingCall.callId === event.detail.callId) {
        answerCall(event.detail.callId, false);
      }
    };

    window.addEventListener('notificationAcceptCall', handleNotificationAcceptCall as EventListener);
    window.addEventListener('notificationRejectCall', handleNotificationRejectCall as EventListener);

    return () => {
      window.removeEventListener('notificationAcceptCall', handleNotificationAcceptCall as EventListener);
      window.removeEventListener('notificationRejectCall', handleNotificationRejectCall as EventListener);
    };
  }, [incomingCall]);

  // Effet pour nettoyer les notifications quand l'appel se termine
  useEffect(() => {
    if (!activeCall && !incomingCall) {
      notificationManager.closeCallNotifications();
    }
  }, [activeCall, incomingCall]);

  // Nettoyage à la déconnexion
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value: ChatContextType = {
    isConnected,
    socket,
    connectionStatus,
    environment,
    websocketUrl,
    currentUser,
    onlineUsers,
    conversations,
    activeConversation,
    messages,
    activeCall,
    incomingCall,
    typingUsers,
    connectToChat,
    disconnectFromChat,
    createConversation,
    joinConversation,
    leaveConversation,
    setActiveConversation,
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead,
    addReaction,
    initiateCall,
    answerCall,
    endCall,
    sendCallBeep,
    setIncomingCall,
    searchUsers,
    getUserById,
    getConversationById
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
