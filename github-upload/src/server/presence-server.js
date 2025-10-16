const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuration CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179", "http://localhost:5180", "http://localhost:5181", "http://localhost:5182"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179", "http://localhost:5180", "http://localhost:5181", "http://localhost:5182"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Stockage des utilisateurs connectés
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté:', socket.id);

  // Gérer la présence d'un utilisateur
  socket.on('user-presence', (userData) => {
    const user = {
      id: userData.userId,
      fullName: userData.fullName,
      avatar: userData.avatar,
      isOnline: userData.isOnline,
      lastSeen: new Date(),
      networkInfo: userData.networkInfo,
      socketId: socket.id
    };

    connectedUsers.set(userData.userId, user);
    
    // Notifier tous les clients de la mise à jour
    io.emit('users-online', Array.from(connectedUsers.values()));
    console.log('Utilisateur ajouté:', user.fullName);
  });

  // Mettre à jour la présence
  socket.on('update-presence', (data) => {
    const user = connectedUsers.get(data.userId);
    if (user) {
      user.isOnline = data.isOnline;
      user.lastSeen = new Date();
      connectedUsers.set(data.userId, user);
      
      io.emit('user-presence-update', user);
    }
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
    
    // Trouver et supprimer l'utilisateur déconnecté
    for (const [userId, user] of connectedUsers.entries()) {
      if (user.socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('user-left', userId);
        console.log('Utilisateur supprimé:', user.fullName);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur de présence démarré sur le port ${PORT}`);
});
