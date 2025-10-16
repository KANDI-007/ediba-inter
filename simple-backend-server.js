// Serveur backend simplifié pour EDIBA INTER
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur EDIBA INTER fonctionne',
    timestamp: new Date().toISOString(),
    socketIO: 'Actif'
  });
});

// Route de test Socket.IO
app.get('/socket-test', (req, res) => {
  res.json({ 
    message: 'Socket.IO est configuré',
    clients: io.engine.clientsCount
  });
});

// Configuration Socket.IO pour le chat
io.on('connection', (socket) => {
  console.log('✅ Utilisateur connecté:', socket.id);

  // Rejoindre une conversation
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`👥 Utilisateur ${socket.id} a rejoint la conversation ${conversationId}`);
    
    // Notifier les autres utilisateurs
    socket.to(`conversation_${conversationId}`).emit('user_joined', {
      userId: socket.id,
      conversationId: conversationId
    });
  });

  // Quitter une conversation
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`👋 Utilisateur ${socket.id} a quitté la conversation ${conversationId}`);
    
    // Notifier les autres utilisateurs
    socket.to(`conversation_${conversationId}`).emit('user_left', {
      userId: socket.id,
      conversationId: conversationId
    });
  });

  // Envoyer un message
  socket.on('send_message', (data) => {
    console.log('💬 Message reçu:', data);
    
    // Diffuser le message à tous les utilisateurs de la conversation
    io.to(`conversation_${data.conversationId}`).emit('new_message', {
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
  });

  // Indicateur de frappe
  socket.on('typing_start', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true,
      conversationId: data.conversationId
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false,
      conversationId: data.conversationId
    });
  });

  // Gestion de la présence utilisateur
  socket.on('user_presence', (data) => {
    socket.broadcast.emit('user_online', {
      userId: data.userId,
      username: data.username,
      status: 'online'
    });
  });

  // Déconnexion
  socket.on('disconnect', (reason) => {
    console.log('❌ Utilisateur déconnecté:', socket.id, 'Raison:', reason);
    
    // Notifier tous les utilisateurs de la déconnexion
    socket.broadcast.emit('user_offline', {
      userId: socket.id,
      status: 'offline'
    });
  });
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log('🚀 Serveur EDIBA INTER démarré !');
  console.log('================================');
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Socket.IO: http://localhost:${PORT}`);
  console.log(`💬 Chat en temps réel: Actif`);
  console.log(`🌐 CORS: Configuré pour localhost:5173 et 5174`);
  console.log('================================');
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason);
});

module.exports = { app, server, io };
