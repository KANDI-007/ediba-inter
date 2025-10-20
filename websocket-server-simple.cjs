// Serveur WebSocket simplifié pour test EDIBA-INTER
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuration CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Stockage des utilisateurs
const connectedUsers = new Map();
const conversations = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    message: 'Serveur WebSocket EDIBA-INTER actif'
  });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 Nouvelle connexion: ${socket.id}`);

  // Connexion d'un utilisateur
  socket.on('user_connected', (userData) => {
    console.log(`👤 Utilisateur connecté: ${userData.username}`);
    
    const userInfo = {
      ...userData,
      socketId: socket.id,
      connectedAt: new Date().toISOString(),
      isOnline: true
    };
    
    connectedUsers.set(socket.id, userInfo);
    
    // Notifier tous les utilisateurs
    const onlineUsers = Array.from(connectedUsers.values());
    io.emit('users_updated', onlineUsers);
    
    console.log(`✅ ${userData.username} ajouté à la liste`);
  });

  // Envoi de message
  socket.on('send_message', (messageData) => {
    console.log(`💬 Message reçu:`, messageData);
    
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const message = {
      id: messageData.id || `${user.id}-${Date.now()}`,
      senderId: user.id,
      senderName: user.fullName || user.username,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      conversationId: messageData.conversationId,
      type: 'text'
    };
    
    // Envoyer le message à tous les clients
    io.emit('new_message', message);
    console.log(`✅ Message diffusé`);
  });

  // Indicateur de frappe
  socket.on('user_typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    socket.broadcast.emit('user_typing', {
      userId: user.id,
      username: user.username,
      conversationId: data.conversationId,
      isTyping: data.isTyping
    });
  });

  // Déconnexion
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Déconnexion: ${socket.id}`);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`👋 ${user.username} s'est déconnecté`);
      connectedUsers.delete(socket.id);
      
      // Notifier tous les utilisateurs
      const onlineUsers = Array.from(connectedUsers.values());
      io.emit('users_updated', onlineUsers);
    }
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket EDIBA-INTER démarré sur le port ${PORT}`);
  console.log(`📡 Socket.IO prêt pour les connexions`);
  console.log(`🌐 Test: http://localhost:${PORT}/api/health`);
});

// Gestion des erreurs
server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});
