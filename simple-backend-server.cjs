// Serveur backend simplifié pour EDIBA INTER avec partage de fichiers
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.static('uploads')); // Servir les fichiers statiques

// Configuration Multer pour le téléversement de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Route pour le téléversement de fichiers
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier téléversé' 
      });
    }

    const fileInfo = {
      id: Date.now() + '-' + Math.round(Math.random() * 1E9),
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    console.log('📁 Fichier téléversé:', fileInfo);
    
    res.json({
      success: true,
      message: 'Fichier téléversé avec succès',
      file: fileInfo
    });
  } catch (error) {
    console.error('❌ Erreur téléversement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléversement du fichier'
    });
  }
});

// Route pour télécharger un fichier
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'Fichier non trouvé' });
  }
});

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

// Gestion des utilisateurs connectés
const connectedUsers = new Map(); // socketId -> userInfo

// Gestion des messages pour éviter les doublons
const messageHistory = new Map(); // messageId -> messageData
const MESSAGE_HISTORY_LIMIT = 1000; // Limite d'historique des messages

// Configuration Socket.IO pour le chat
io.on('connection', (socket) => {
  console.log('✅ Utilisateur connecté:', socket.id);

  // Enregistrer un utilisateur connecté (logique WhatsApp)
  socket.on('user_connected', (userInfo) => {
    // Vérifier si l'utilisateur est déjà connecté
    const existingUser = Array.from(connectedUsers.values()).find(u => u.id === userInfo.id);
    
    if (!existingUser) {
      // Nouvel utilisateur - l'ajouter
      connectedUsers.set(socket.id, {
        ...userInfo,
        socketId: socket.id,
        connectedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
      
      console.log(`👤 Utilisateur enregistré: ${userInfo.username} (${socket.id})`);
      
      // Notifier tous les autres clients (pas l'utilisateur lui-même)
      socket.broadcast.emit('users_updated', Array.from(connectedUsers.values()));
    } else {
      // Utilisateur existant - mettre à jour le socket
      connectedUsers.delete(existingUser.socketId);
      connectedUsers.set(socket.id, {
        ...existingUser,
        socketId: socket.id,
        connectedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
      
      console.log(`🔄 Utilisateur reconnecté: ${userInfo.username} (${socket.id})`);
      
      // Notifier tous les autres clients (pas l'utilisateur lui-même)
      socket.broadcast.emit('users_updated', Array.from(connectedUsers.values()));
    }
    
    // Envoyer la liste des utilisateurs connectés au nouvel utilisateur
    socket.emit('users_updated', Array.from(connectedUsers.values()));
  });

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

  // Gestion des appels avec bips sonores
  socket.on('initiate_call', (data) => {
    const { callerId, callerName, targetUserId, callType = 'audio' } = data;
    
    console.log(`📞 Appel initié: ${callerName} (${callerId}) → ${targetUserId} (${callType})`);
    
    const callId = `${callerId}-${Date.now()}`;
    
    // Trouver l'utilisateur cible dans la liste des utilisateurs connectés
    const targetUser = Array.from(connectedUsers.values()).find(u => u.id === targetUserId);
    
    if (targetUser) {
      console.log(`📞 Envoi de l'appel à l'utilisateur cible: ${targetUser.username} (${targetUser.socketId})`);
      
      // Envoyer la notification d'appel spécifiquement à l'utilisateur cible
      io.to(targetUser.socketId).emit('incoming_call', {
        callerId,
        callerName,
        callType,
        timestamp: new Date().toISOString(),
        callId: callId
      });
    } else {
      console.log(`⚠️ Utilisateur cible non trouvé: ${targetUserId}`);
    }
    
    // Confirmer l'initiation de l'appel à l'appelant
    socket.emit('call_initiated', {
      targetUserId,
      callId: callId,
      status: 'ringing'
    });
  });

  // Répondre à un appel
  socket.on('answer_call', (data) => {
    const { callId, callerId, answer } = data;
    
    console.log(`📞 Appel ${answer ? 'accepté' : 'refusé'}: ${callId}`);
    
    // Notifier l'appelant de la réponse
    socket.broadcast.emit('call_answered', {
      callId,
      callerId,
      answer,
      timestamp: new Date().toISOString()
    });
  });

  // Terminer un appel
  socket.on('end_call', (data) => {
    const { callId, callerId } = data;
    
    console.log(`📞 Appel terminé: ${callId}`);
    
    // Notifier tous les participants de la fin de l'appel
    socket.broadcast.emit('call_ended', {
      callId,
      callerId,
      timestamp: new Date().toISOString()
    });
  });

  // Envoyer des bips sonores périodiques pendant l'appel
  socket.on('send_call_beep', (data) => {
    const { targetUserId, callerName, beepType = 'standard' } = data;
    
    console.log(`🔊 Bip d'appel envoyé: ${callerName} → ${targetUserId} (${beepType})`);
    
    // Trouver l'utilisateur cible dans la liste des utilisateurs connectés
    const targetUser = Array.from(connectedUsers.values()).find(u => u.id === targetUserId);
    
    if (targetUser) {
      console.log(`🔊 Envoi du bip à l'utilisateur cible: ${targetUser.username} (${targetUser.socketId})`);
      
      // Envoyer le bip spécifiquement à l'utilisateur cible
      io.to(targetUser.socketId).emit('call_beep', {
        callerName,
        beepType,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`⚠️ Utilisateur cible non trouvé pour le bip: ${targetUserId}`);
    }
  });

  // Envoyer un message avec synchronisation bidirectionnelle
  socket.on('send_message', (data) => {
    const messageId = data.id || `${data.senderId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Vérifier si le message existe déjà (éviter les doublons)
    if (messageHistory.has(messageId)) {
      console.log('⚠️ Message en double détecté, ignoré:', messageId);
      return;
    }
    
    // Créer le message final avec toutes les informations
    const finalMessage = {
      id: messageId,
      senderId: data.senderId,
      content: data.content,
      conversationId: data.conversationId,
      timestamp: new Date().toISOString(),
      socketId: socket.id,
      status: 'sent',
      formatting: data.formatting || {},
      type: data.type || 'text',
      file: data.file || null // Informations du fichier si présent
    };
    
    // Ajouter le message à l'historique
    messageHistory.set(messageId, finalMessage);
    
    // Nettoyer l'historique si nécessaire
    if (messageHistory.size > MESSAGE_HISTORY_LIMIT) {
      const oldestMessage = messageHistory.keys().next().value;
      messageHistory.delete(oldestMessage);
    }
    
    console.log('💬 Message reçu Espace EDIBA:', finalMessage);
    
    // Diffuser le message à TOUS les utilisateurs de la conversation (expéditeur + destinataires)
    // Cela garantit que l'expéditeur voit son message ET que les destinataires le voient aussi
    io.to(`conversation_${data.conversationId}`).emit('new_message', finalMessage);
    
    // Envoyer un accusé de réception à l'expéditeur
    socket.emit('message_delivered', {
      messageId: messageId,
      status: 'delivered',
      timestamp: new Date().toISOString()
    });
    
    // Notifier tous les utilisateurs de la conversation que le message a été livré
    socket.to(`conversation_${data.conversationId}`).emit('message_delivered_to_others', {
      messageId: messageId,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      senderId: data.senderId
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
    const userInfo = connectedUsers.get(socket.id);
    console.log('❌ Utilisateur déconnecté:', socket.id, 'Raison:', reason);
    
    if (userInfo) {
      console.log(`👋 Utilisateur déconnecté: ${userInfo.username}`);
      connectedUsers.delete(socket.id);
      
      // Notifier tous les clients de la mise à jour de la liste des utilisateurs
      io.emit('users_updated', Array.from(connectedUsers.values()));
      
      // Notifier tous les utilisateurs de la déconnexion
      socket.broadcast.emit('user_offline', {
        userId: socket.id,
        username: userInfo.username,
        status: 'offline'
      });
    }
  });

  // ========================================
  // GESTIONNAIRES DE SYNCHRONISATION TEMPS RÉEL
  // ========================================

  // Écouter les événements de synchronisation
  socket.on('sync_event', (event) => {
    console.log('🔄 Événement de synchronisation reçu:', event);
    
    // Diffuser l'événement à tous les autres clients connectés
    socket.broadcast.emit('sync_event', event);
    
    // Log pour débogage
    console.log(`📡 Événement sync diffusé: ${event.type} sur ${event.module} par ${event.userName}`);
  });

  // Écouter les demandes de synchronisation
  socket.on('request_sync', (data) => {
    console.log('🔄 Demande de synchronisation reçue:', data);
    
    // Envoyer les données complètes au client demandeur
    // Pour l'instant, on envoie un événement de confirmation
    socket.emit('sync_data', {
      message: 'Synchronisation demandée',
      timestamp: new Date().toISOString(),
      connectedUsers: Array.from(connectedUsers.values()).length
    });
  });

  // Écouter les changements de statut de connexion
  socket.on('connection_status', (isOnline) => {
    console.log('🔄 Statut de connexion:', isOnline);
    
    // Diffuser le changement de statut à tous les clients
    socket.broadcast.emit('connection_status', isOnline);
  });

  // Écouter les événements d'activité pour synchronisation
  socket.on('activity_log', (activity) => {
    console.log('📝 Activité reçue pour synchronisation:', activity);
    
    // Diffuser l'activité à tous les autres clients
    socket.broadcast.emit('sync_event', {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'activity',
      module: 'activities',
      data: activity,
      userId: activity.userId,
      userName: activity.userName,
      timestamp: new Date().toISOString()
    });
  });

  // Écouter les événements de documents (factures, devis, etc.)
  socket.on('document_event', (event) => {
    console.log('📄 Événement de document reçu:', event);
    
    // Diffuser l'événement à tous les autres clients
    socket.broadcast.emit('sync_event', {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type, // 'create', 'update', 'delete'
      module: 'documents',
      data: event.data,
      userId: event.userId,
      userName: event.userName,
      timestamp: new Date().toISOString(),
      metadata: event.metadata
    });
  });

  // Écouter les événements de clients
  socket.on('client_event', (event) => {
    console.log('👤 Événement de client reçu:', event);
    
    // Diffuser l'événement à tous les autres clients
    socket.broadcast.emit('sync_event', {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type,
      module: 'clients',
      data: event.data,
      userId: event.userId,
      userName: event.userName,
      timestamp: new Date().toISOString(),
      metadata: event.metadata
    });
  });

  // Écouter les événements d'articles
  socket.on('article_event', (event) => {
    console.log('📦 Événement d\'article reçu:', event);
    
    // Diffuser l'événement à tous les autres clients
    socket.broadcast.emit('sync_event', {
      id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type,
      module: 'articles',
      data: event.data,
      userId: event.userId,
      userName: event.userName,
      timestamp: new Date().toISOString(),
      metadata: event.metadata
    });
  });

  // Écouter les événements de décharges
  socket.on('discharge_event', (event) => {
    console.log('📋 Événement de décharge reçu:', event);
    
    // Diffuser l'événement à tous les autres clients
    socket.broadcast.emit('sync_event', {
      id: `discharge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type,
      module: 'discharges',
      data: event.data,
      userId: event.userId,
      userName: event.userName,
      timestamp: new Date().toISOString(),
      metadata: event.metadata
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
