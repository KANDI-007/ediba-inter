// Serveur WebSocket pour chat en temps réel EDIBA-INTER
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configuration CORS pour permettre les connexions depuis le frontend
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173", "https://ediba-inter.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket']
});

// Stockage en mémoire des utilisateurs connectés et conversations
const connectedUsers = new Map(); // socketId -> userInfo
const conversations = new Map(); // conversationId -> { participants, messages }
const userSessions = new Map(); // userId -> socketId

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    activeConversations: conversations.size
  });
});

app.get('/api/users/online', (req, res) => {
  const onlineUsers = Array.from(connectedUsers.values());
  res.json(onlineUsers);
});

app.get('/api/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  const userConversations = Array.from(conversations.values())
    .filter(conv => conv.participants.includes(userId));
  res.json(userConversations);
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 Nouvelle connexion: ${socket.id}`);

  // Connexion d'un utilisateur
  socket.on('user_connected', (userData) => {
    console.log(`👤 Utilisateur connecté: ${userData.username} (${userData.id})`);
    
    // Stocker les informations utilisateur
    const userInfo = {
      ...userData,
      socketId: socket.id,
      connectedAt: new Date().toISOString(),
      isOnline: true,
      lastSeen: new Date().toISOString()
    };
    
    connectedUsers.set(socket.id, userInfo);
    userSessions.set(userData.id, socket.id);
    
    // Notifier tous les utilisateurs de la nouvelle connexion
    const onlineUsers = Array.from(connectedUsers.values());
    io.emit('users_updated', onlineUsers);
    
    // Envoyer les conversations existantes à l'utilisateur
    const userConversations = Array.from(conversations.values())
      .filter(conv => conv.participants.includes(userData.id));
    
    socket.emit('conversations_loaded', userConversations);
    
    console.log(`✅ ${userData.username} ajouté à la liste des utilisateurs en ligne`);
  });

  // Rejoindre une conversation
  socket.on('join_conversation', (conversationId) => {
    console.log(`👥 ${socket.id} rejoint la conversation: ${conversationId}`);
    
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    // Créer la conversation si elle n'existe pas
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, {
        id: conversationId,
        participants: [user.id],
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessageAt: null
      });
    } else {
      // Ajouter l'utilisateur s'il n'est pas déjà dans la conversation
      const conversation = conversations.get(conversationId);
      if (!conversation.participants.includes(user.id)) {
        conversation.participants.push(user.id);
      }
    }
    
    socket.join(conversationId);
    
    // Envoyer l'historique des messages
    const conversation = conversations.get(conversationId);
    socket.emit('conversation_history', {
      conversationId,
      messages: conversation.messages
    });
    
    console.log(`✅ ${user.username} a rejoint la conversation ${conversationId}`);
  });

  // Quitter une conversation
  socket.on('leave_conversation', (conversationId) => {
    console.log(`👋 ${socket.id} quitte la conversation: ${conversationId}`);
    
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    socket.leave(conversationId);
    
    // Retirer l'utilisateur de la conversation
    const conversation = conversations.get(conversationId);
    if (conversation) {
      conversation.participants = conversation.participants.filter(id => id !== user.id);
      
      // Supprimer la conversation si elle est vide
      if (conversation.participants.length === 0) {
        conversations.delete(conversationId);
      }
    }
    
    console.log(`✅ ${user.username} a quitté la conversation ${conversationId}`);
  });

  // Envoi de message
  socket.on('send_message', (messageData) => {
    console.log(`💬 Message reçu de ${socket.id}:`, messageData);
    
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const message = {
      id: messageData.id || `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.id,
      senderName: user.fullName || user.username,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      conversationId: messageData.conversationId,
      type: messageData.type || 'text',
      formatting: messageData.formatting || {},
      isDelivered: false,
      isRead: false
    };
    
    // Stocker le message dans la conversation
    const conversation = conversations.get(messageData.conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.lastMessageAt = message.timestamp;
      
      // Marquer comme livré pour l'expéditeur
      message.isDelivered = true;
      
      // Envoyer le message à tous les participants de la conversation
      io.to(messageData.conversationId).emit('new_message', message);
      
      // Envoyer les accusés de réception
      conversation.participants.forEach(participantId => {
        if (participantId !== user.id) {
          const participantSocketId = userSessions.get(participantId);
          if (participantSocketId) {
            io.to(participantSocketId).emit('message_delivered', {
              messageId: message.id,
              conversationId: messageData.conversationId,
              deliveredAt: new Date().toISOString()
            });
          }
        }
      });
      
      console.log(`✅ Message diffusé à la conversation ${messageData.conversationId}`);
    } else {
      console.log(`❌ Conversation ${messageData.conversationId} introuvable`);
    }
  });

  // Indicateur de frappe
  socket.on('user_typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    socket.to(data.conversationId).emit('user_typing', {
      userId: user.id,
      username: user.username,
      conversationId: data.conversationId,
      isTyping: data.isTyping
    });
  });

  // Gestion des appels
  socket.on('initiate_call', (callData) => {
    console.log(`📞 Appel initié:`, callData);
    
    const caller = connectedUsers.get(socket.id);
    if (!caller) return;
    
    const callId = `${caller.id}-${Date.now()}`;
    const callInfo = {
      callId,
      callerId: caller.id,
      callerName: caller.fullName || caller.username,
      targetUserId: callData.targetUserId,
      callType: callData.callType || 'audio',
      status: 'ringing',
      initiatedAt: new Date().toISOString()
    };
    
    // Envoyer l'appel à l'utilisateur cible
    const targetSocketId = userSessions.get(callData.targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('incoming_call', callInfo);
      console.log(`📞 Appel envoyé à ${callData.targetUserId}`);
    } else {
      console.log(`❌ Utilisateur ${callData.targetUserId} non connecté`);
    }
    
    // Confirmer l'initiation de l'appel
    socket.emit('call_initiated', callInfo);
  });

  socket.on('answer_call', (answerData) => {
    console.log(`📞 Réponse à l'appel:`, answerData);
    
    const responder = connectedUsers.get(socket.id);
    if (!responder) return;
    
    // Notifier l'appelant de la réponse
    const callerSocketId = userSessions.get(answerData.callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call_answered', {
        callId: answerData.callId,
        answer: answerData.answer,
        responderId: responder.id,
        responderName: responder.fullName || responder.username
      });
    }
    
    console.log(`✅ Réponse à l'appel envoyée`);
  });

  socket.on('end_call', (callData) => {
    console.log(`📞 Fin d'appel:`, callData);
    
    // Notifier tous les participants de la fin d'appel
    io.emit('call_ended', {
      callId: callData.callId,
      endedBy: callData.callerId,
      endedAt: new Date().toISOString()
    });
    
    console.log(`✅ Appel terminé`);
  });

  socket.on('send_call_beep', (beepData) => {
    console.log(`🔊 Bip d'appel envoyé:`, beepData);
    
    const sender = connectedUsers.get(socket.id);
    if (!sender) return;
    
    const targetSocketId = userSessions.get(beepData.targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call_beep', {
        senderId: sender.id,
        senderName: sender.fullName || sender.username,
        beepType: beepData.beepType || 'standard',
        timestamp: new Date().toISOString()
      });
      console.log(`🔊 Bip envoyé à ${beepData.targetUserId}`);
    }
  });

  // Déconnexion d'un utilisateur
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Déconnexion: ${socket.id} (${reason})`);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`👋 ${user.username} s'est déconnecté`);
      
      // Retirer l'utilisateur des listes
      connectedUsers.delete(socket.id);
      userSessions.delete(user.id);
      
      // Notifier tous les utilisateurs de la déconnexion
      const onlineUsers = Array.from(connectedUsers.values());
      io.emit('users_updated', onlineUsers);
      
      // Nettoyer les conversations vides
      for (const [conversationId, conversation] of conversations.entries()) {
        conversation.participants = conversation.participants.filter(id => id !== user.id);
        if (conversation.participants.length === 0) {
          conversations.delete(conversationId);
        }
      }
      
      console.log(`✅ ${user.username} retiré de la liste des utilisateurs`);
    }
  });

  // Gestion des erreurs
  socket.on('error', (error) => {
    console.error(`❌ Erreur Socket.IO:`, error);
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket EDIBA-INTER démarré sur le port ${PORT}`);
  console.log(`📡 Socket.IO prêt pour les connexions en temps réel`);
  console.log(`🌐 CORS configuré pour: localhost:5173, localhost:4173, netlify.app`);
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});

// Nettoyage gracieux
process.on('SIGTERM', () => {
  console.log('🔄 Arrêt gracieux du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Arrêt gracieux du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});
