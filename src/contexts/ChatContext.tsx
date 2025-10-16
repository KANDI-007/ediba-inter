import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Types pour le système de chat
export interface ChatUser {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'call';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  callDuration?: number;
  callType?: 'voice' | 'video';
}

export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatCall {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'accepted' | 'rejected' | 'ended';
  startTime?: string;
  endTime?: string;
  duration?: number;
}

interface ChatContextType {
  // État de connexion
  isConnected: boolean;
  socket: Socket | null;
  
  // Utilisateurs
  currentUser: ChatUser | null;
  onlineUsers: ChatUser[];
  allUsers: ChatUser[];
  
  // Conversations
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: ChatMessage[];
  
  // Appels
  activeCall: ChatCall | null;
  incomingCall: ChatCall | null;
  
  // Actions
  connectToChat: (user: ChatUser) => void;
  disconnectFromChat: () => void;
  sendMessage: (content: string, type?: ChatMessage['type'], file?: File, replyTo?: string) => void;
  sendFile: (file: File, type: 'image' | 'document' | 'audio' | 'video') => void;
  startCall: (userId: string, type: 'voice' | 'video') => void;
  answerCall: (callId: string) => void;
  rejectCall: (callId: string) => void;
  endCall: (callId: string) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantIds: string[], isGroup?: boolean, groupName?: string) => void;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  searchUsers: (query: string) => ChatUser[];
  updateUserStatus: (status: string) => void;
  
  // État de l'interface
  isTyping: boolean;
  typingUsers: string[];
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
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
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  
  // Conversations et messages
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Appels
  const [activeCall, setActiveCall] = useState<ChatCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<ChatCall | null>(null);
  
  // État de l'interface
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connexion au chat
  const connectToChat = (user: ChatUser) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io('http://localhost:3000', {
      auth: {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      setCurrentUser(user);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    newSocket.on('users_online', (users: ChatUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('user_online', (user: ChatUser) => {
      setOnlineUsers(prev => {
        const exists = prev.find(u => u.id === user.id);
        if (!exists) {
          return [...prev, user];
        }
        return prev.map(u => u.id === user.id ? user : u);
      });
    });

    newSocket.on('user_offline', (userId: string) => {
      setOnlineUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isOnline: false, lastSeen: new Date().toISOString() } : u
      ));
    });

    newSocket.on('conversations', (convs: ChatConversation[]) => {
      setConversations(convs);
    });

    newSocket.on('conversation_created', (conversation: ChatConversation) => {
      setConversations(prev => [...prev, conversation]);
    });

    newSocket.on('messages', (msgs: ChatMessage[]) => {
      setMessages(msgs);
    });

    newSocket.on('message_received', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Mettre à jour la conversation
      setConversations(prev => prev.map(conv => 
        conv.id === message.senderId || conv.participants.some(p => p.id === message.senderId)
          ? {
              ...conv,
              lastMessage: message,
              unreadCount: conv.id === activeConversation?.id ? conv.unreadCount : conv.unreadCount + 1,
              updatedAt: message.timestamp
            }
          : conv
      ));
    });

    newSocket.on('message_delivered', (messageId: string) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isDelivered: true } : msg
      ));
    });

    newSocket.on('message_read', (messageId: string) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    });

    newSocket.on('typing_start', (data: { userId: string, conversationId: string }) => {
      if (data.conversationId === activeConversation?.id) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      }
    });

    newSocket.on('typing_stop', (data: { userId: string, conversationId: string }) => {
      if (data.conversationId === activeConversation?.id) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    newSocket.on('call_incoming', (call: ChatCall) => {
      setIncomingCall(call);
    });

    newSocket.on('call_accepted', (call: ChatCall) => {
      setActiveCall(call);
      setIncomingCall(null);
    });

    newSocket.on('call_rejected', (callId: string) => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    newSocket.on('call_ended', (callId: string) => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    setSocket(newSocket);
  };

  // Déconnexion du chat
  const disconnectFromChat = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setCurrentUser(null);
    setOnlineUsers([]);
    setConversations([]);
    setMessages([]);
    setActiveConversation(null);
    setActiveCall(null);
    setIncomingCall(null);
  };

  // Envoyer un message
  const sendMessage = (content: string, type: ChatMessage['type'] = 'text', file?: File, replyTo?: string) => {
    if (!socket || !activeConversation) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead' | 'isDelivered'> = {
      senderId: currentUser!.id,
      receiverId: activeConversation.participants.find(p => p.id !== currentUser!.id)?.id,
      content,
      type,
      replyTo
    };

    if (file) {
      // Ici, vous devriez uploader le fichier vers votre serveur
      // Pour l'instant, on simule avec une URL locale
      message.fileUrl = URL.createObjectURL(file);
      message.fileName = file.name;
      message.fileSize = file.size;
    }

    socket.emit('send_message', {
      ...message,
      conversationId: activeConversation.id
    });

    // Arrêter l'indicateur de frappe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing_stop', { conversationId: activeConversation.id });
    setIsTyping(false);
  };

  // Envoyer un fichier
  const sendFile = (file: File, type: 'image' | 'document' | 'audio' | 'video') => {
    sendMessage('', type, file);
  };

  // Démarrer un appel
  const startCall = (userId: string, type: 'voice' | 'video') => {
    if (!socket) return;

    const call: Omit<ChatCall, 'id' | 'startTime'> = {
      callerId: currentUser!.id,
      receiverId: userId,
      type,
      status: 'ringing'
    };

    socket.emit('start_call', call);
  };

  // Répondre à un appel
  const answerCall = (callId: string) => {
    if (!socket) return;
    socket.emit('answer_call', callId);
  };

  // Rejeter un appel
  const rejectCall = (callId: string) => {
    if (!socket) return;
    socket.emit('reject_call', callId);
  };

  // Terminer un appel
  const endCall = (callId: string) => {
    if (!socket) return;
    socket.emit('end_call', callId);
  };

  // Marquer comme lu
  const markAsRead = (conversationId: string) => {
    if (!socket) return;
    socket.emit('mark_read', conversationId);
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  // Créer une conversation
  const createConversation = (participantIds: string[], isGroup: boolean = false, groupName?: string) => {
    if (!socket) return;
    socket.emit('create_conversation', { participantIds, isGroup, groupName });
  };

  // Rechercher des utilisateurs
  const searchUsers = (query: string): ChatUser[] => {
    return allUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Mettre à jour le statut
  const updateUserStatus = (status: string) => {
    if (!socket) return;
    socket.emit('update_status', status);
  };

  // Gestion de la frappe
  const handleTyping = () => {
    if (!socket || !activeConversation || isTyping) return;

    setIsTyping(true);
    socket.emit('typing_start', { conversationId: activeConversation.id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: activeConversation.id });
      setIsTyping(false);
    }, 1000);
  };

  // Nettoyage
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
    allUsers,
    conversations,
    activeConversation,
    messages,
    activeCall,
    incomingCall,
    connectToChat,
    disconnectFromChat,
    sendMessage,
    sendFile,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    markAsRead,
    createConversation,
    setActiveConversation,
    searchUsers,
    updateUserStatus,
    isTyping,
    typingUsers,
    showEmojiPicker,
    setShowEmojiPicker
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
