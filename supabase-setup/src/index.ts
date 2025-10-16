import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import des routes
import authRoutes from './routes/auth';
import clientsRoutes from './routes/clients';
// Routes importées
import suppliersRoutes from './routes/suppliers';
import articlesRoutes from './routes/articles';
import documentsRoutes from './routes/documents';
import chatRoutes from './routes/chat';
import reportsRoutes from './routes/reports';

// Import des middlewares
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Configuration des variables d'environnement
// dotenv.config(); // Déjà chargé avec 'dotenv/config'

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limite par IP
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes de base
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/clients', authenticateToken, clientsRoutes);
app.use('/api/suppliers', authenticateToken, suppliersRoutes);
app.use('/api/articles', authenticateToken, articlesRoutes);
app.use('/api/documents', authenticateToken, documentsRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Configuration Socket.IO pour le chat
io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Utilisateur ${socket.id} a rejoint la conversation ${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`Utilisateur ${socket.id} a quitté la conversation ${conversationId}`);
  });

  socket.on('send_message', (data) => {
    // Diffuser le message à tous les utilisateurs de la conversation
    socket.to(`conversation_${data.conversationId}`).emit('new_message', data);
  });

  socket.on('typing_start', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur EDIBA INTER démarré sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💬 Socket.IO: http://localhost:${PORT}`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  process.exit(1);
});

export { app, io };
