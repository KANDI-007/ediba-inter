// Configuration Socket.IO pour le chat
export const SOCKET_CONFIG = {
  // URL du serveur Socket.IO
  serverUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  
  // Options de connexion
  options: {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    transports: ['websocket', 'polling']
  },
  
  // Événements du chat
  events: {
    // Connexion
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    
    // Utilisateurs
    USERS_ONLINE: 'users_online',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    USER_TYPING: 'user_typing',
    USER_STOP_TYPING: 'user_stop_typing',
    
    // Conversations
    CONVERSATIONS: 'conversations',
    CONVERSATION_CREATED: 'conversation_created',
    CONVERSATION_UPDATED: 'conversation_updated',
    CONVERSATION_DELETED: 'conversation_deleted',
    
    // Messages
    MESSAGES: 'messages',
    MESSAGE_SENT: 'message_sent',
    MESSAGE_RECEIVED: 'message_received',
    MESSAGE_DELIVERED: 'message_delivered',
    MESSAGE_READ: 'message_read',
    MESSAGE_DELETED: 'message_deleted',
    
    // Frappe
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    
    // Appels
    CALL_INCOMING: 'call_incoming',
    CALL_ACCEPTED: 'call_accepted',
    CALL_REJECTED: 'call_rejected',
    CALL_ENDED: 'call_ended',
    CALL_RINGING: 'call_ringing',
    
    // Notifications
    NOTIFICATION: 'notification',
    NOTIFICATION_READ: 'notification_read',
    
    // Événements côté client
    CLIENT_EVENTS: {
      // Authentification
      AUTHENTICATE: 'authenticate',
      
      // Conversations
      CREATE_CONVERSATION: 'create_conversation',
      JOIN_CONVERSATION: 'join_conversation',
      LEAVE_CONVERSATION: 'leave_conversation',
      
      // Messages
      SEND_MESSAGE: 'send_message',
      MARK_READ: 'mark_read',
      DELETE_MESSAGE: 'delete_message',
      
      // Frappe
      START_TYPING: 'start_typing',
      STOP_TYPING: 'stop_typing',
      
      // Appels
      START_CALL: 'start_call',
      ANSWER_CALL: 'answer_call',
      REJECT_CALL: 'reject_call',
      END_CALL: 'end_call',
      
      // Statut
      UPDATE_STATUS: 'update_status',
      UPDATE_PRESENCE: 'update_presence'
    }
  },
  
  // Configuration des médias
  media: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    allowedAudioTypes: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
    allowedDocumentTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
  },
  
  // Configuration des appels
  calls: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    constraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }
  },
  
  // Configuration des notifications
  notifications: {
    enabled: true,
    permission: 'granted',
    sound: true,
    vibration: true
  }
};

// Types pour les événements Socket.IO
export interface SocketEvents {
  // Événements du serveur
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  
  users_online: (users: any[]) => void;
  user_online: (user: any) => void;
  user_offline: (userId: string) => void;
  
  conversations: (conversations: any[]) => void;
  conversation_created: (conversation: any) => void;
  conversation_updated: (conversation: any) => void;
  conversation_deleted: (conversationId: string) => void;
  
  messages: (messages: any[]) => void;
  message_sent: (message: any) => void;
  message_received: (message: any) => void;
  message_delivered: (messageId: string) => void;
  message_read: (messageId: string) => void;
  message_deleted: (messageId: string) => void;
  
  typing_start: (data: { userId: string; conversationId: string }) => void;
  typing_stop: (data: { userId: string; conversationId: string }) => void;
  
  call_incoming: (call: any) => void;
  call_accepted: (call: any) => void;
  call_rejected: (callId: string) => void;
  call_ended: (callId: string) => void;
  call_ringing: (call: any) => void;
  
  notification: (notification: any) => void;
  notification_read: (notificationId: string) => void;
}

// Types pour les événements côté client
export interface ClientEvents {
  authenticate: (data: { userId: string; username: string; fullName: string; avatar?: string }) => void;
  
  create_conversation: (data: { participantIds: string[]; isGroup: boolean; groupName?: string }) => void;
  join_conversation: (conversationId: string) => void;
  leave_conversation: (conversationId: string) => void;
  
  send_message: (data: { conversationId: string; content: string; type: string; fileUrl?: string; replyTo?: string }) => void;
  mark_read: (conversationId: string) => void;
  delete_message: (messageId: string) => void;
  
  start_typing: (data: { conversationId: string }) => void;
  stop_typing: (data: { conversationId: string }) => void;
  
  start_call: (data: { receiverId: string; type: 'voice' | 'video' }) => void;
  answer_call: (callId: string) => void;
  reject_call: (callId: string) => void;
  end_call: (callId: string) => void;
  
  update_status: (status: string) => void;
  update_presence: (isOnline: boolean) => void;
}
