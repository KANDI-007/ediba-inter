// ChatContext simplifié pour fonctionner avec notre serveur backend
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationManager } from '../utils/NotificationManager';

// Types simplifiés
export interface ChatUser {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  isOnline: boolean;
  socketId?: string;
  connectedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  conversationId: string;
}

interface ChatContextType {
  // État de connexion
  isConnected: boolean;
  socket: Socket | null;
  
  // Utilisateurs
  currentUser: ChatUser | null;
  onlineUsers: ChatUser[];
  
  // Messages
  messages: ChatMessage[];
  
  // Appels
  activeCall: any | null;
  incomingCall: any | null;
  
  // Fonctions
  connectToChat: (user: ChatUser) => void;
  sendMessage: (content: string, conversationId: string, messageData?: any) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  
  // Fonctions d'appel
  initiateCall: (targetUserId: string, callType?: 'audio' | 'video') => void;
  answerCall: (callId: string, answer: boolean) => void;
  endCall: (callId: string) => void;
  sendCallBeep: (targetUserId: string, beepType?: string) => void;
  setIncomingCall: (call: any | null) => void;
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
  // État de connexion
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Utilisateurs
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  
  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Appels
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [incomingCall, setIncomingCall] = useState<any | null>(null);

  // Connexion au chat
  const connectToChat = (user: ChatUser) => {
    console.log('🔄 Connexion au chat pour:', user);
    
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

    const newSocket = io('http://localhost:3000', {
      transports: ['polling', 'websocket'],
      timeout: 10000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connexion Socket.IO réussie');
      setIsConnected(true);
      setCurrentUser(user);
      setSocket(newSocket);
      
      // Envoyer les informations utilisateur au serveur
      newSocket.emit('user_connected', {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Déconnexion Socket.IO:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnexion Socket.IO réussie après', attemptNumber, 'tentatives');
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Erreur de reconnexion Socket.IO:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Échec de reconnexion Socket.IO');
      setIsConnected(false);
    });

    // Écouter les mises à jour de la liste des utilisateurs
    newSocket.on('users_updated', (users) => {
      console.log('👥 Utilisateurs connectés mis à jour:', users);
      setOnlineUsers(users);
    });

    // Écouter les nouveaux messages (synchronisation bidirectionnelle)
    newSocket.on('new_message', (message) => {
      console.log('💬 Nouveau message reçu:', message);
      setMessages(prev => {
        // Vérifier si le message existe déjà pour éviter les doublons
        const exists = prev.some(msg => msg.id === message.id);
        if (!exists) {
          console.log('✅ Message ajouté à la liste:', message.id);
          return [...prev, message];
        }
        console.log('⚠️ Message en double détecté côté frontend, ignoré:', message.id);
        return prev;
      });
    });

    // Écouter les indicateurs de frappe
    newSocket.on('user_typing', (data) => {
      console.log('⌨️ Utilisateur en train de taper:', data);
    });

    // Écouter les accusés de réception (logique WhatsApp)
    newSocket.on('message_delivered', (data) => {
      console.log('✅ Message livré:', data);
      // Mettre à jour le statut du message si nécessaire
    });

    // Écouter les accusés de réception pour les autres utilisateurs
    newSocket.on('message_delivered_to_others', (data) => {
      console.log('✅ Message livré aux autres:', data);
      // Mettre à jour le statut du message pour les autres utilisateurs
    });

    // Écouter les événements d'appel
    newSocket.on('incoming_call', (callData) => {
      console.log('📞 Appel entrant reçu:', callData);
      console.log('📞 Utilisateur actuel:', currentUser);
      console.log('📞 Définition de incomingCall...');
      setIncomingCall(callData);
      console.log('📞 incomingCall défini:', callData);
      
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

  // Envoyer un message avec synchronisation bidirectionnelle
  const sendMessage = (content: string, conversationId: string, messageData?: any) => {
    if (socket && currentUser) {
      const message = messageData || {
        id: `${currentUser.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toISOString(),
        conversationId,
        formatting: {},
        type: 'text'
      };

      console.log('📤 Envoi de message:', message);
      
      // Envoyer le message au serveur
      socket.emit('send_message', {
        ...message,
        conversationId
      });

      // Le message sera reçu via 'new_message' pour garantir la synchronisation
      // Cela évite les doublons et assure que tous les utilisateurs voient le message
      console.log('🔄 Message envoyé, en attente de confirmation...');
    }
  };

  // Rejoindre une conversation
  const joinConversation = (conversationId: string) => {
    if (socket) {
      console.log('👥 Rejoindre la conversation:', conversationId);
      socket.emit('join_conversation', conversationId);
    }
  };

  // Quitter une conversation
  const leaveConversation = (conversationId: string) => {
    if (socket) {
      console.log('👋 Quitter la conversation:', conversationId);
      socket.emit('leave_conversation', conversationId);
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
      
      // Définir l'appel actif
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

  // Effet pour gérer les événements de notification
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

    // Écouter les événements de notification
    window.addEventListener('notificationAcceptCall', handleNotificationAcceptCall as EventListener);
    window.addEventListener('notificationRejectCall', handleNotificationRejectCall as EventListener);

    return () => {
      window.removeEventListener('notificationAcceptCall', handleNotificationAcceptCall as EventListener);
      window.removeEventListener('notificationRejectCall', handleNotificationRejectCall as EventListener);
    };
  }, [incomingCall, answerCall]);

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
    currentUser,
    onlineUsers,
    messages,
    activeCall,
    incomingCall,
    connectToChat,
    sendMessage,
    joinConversation,
    leaveConversation,
    initiateCall,
    answerCall,
    endCall,
    sendCallBeep,
    setIncomingCall
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
