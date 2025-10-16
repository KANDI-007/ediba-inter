// Test simple de connexion Socket.IO
const { io } = require('socket.io-client');

console.log('🔄 Test de connexion Socket.IO simple...');

const socket = io('http://localhost:3000', {
  transports: ['polling', 'websocket'],
  timeout: 5000,
  forceNew: true
});

socket.on('connect', () => {
  console.log('✅ Connexion Socket.IO réussie !');
  console.log('🆔 ID de connexion:', socket.id);
  console.log('🔗 Transport utilisé:', socket.io.engine.transport.name);
  
  // Fermer la connexion
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion Socket.IO:');
  console.error('   Type:', error.type);
  console.error('   Description:', error.description);
  console.error('   Message:', error.message);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Déconnecté:', reason);
});

// Timeout de sécurité
setTimeout(() => {
  console.error('❌ Timeout de connexion Socket.IO (10s)');
  socket.disconnect();
  process.exit(1);
}, 10000);
