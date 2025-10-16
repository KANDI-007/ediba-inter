// Test de connexion Socket.IO
const { io } = require('socket.io-client');

console.log('🔄 Test de connexion Socket.IO...');

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connexion Socket.IO réussie !');
  console.log('🆔 ID de connexion:', socket.id);
  
  // Test d'émission d'un événement
  socket.emit('test', { message: 'Test de connexion' });
  
  // Fermer la connexion après le test
  setTimeout(() => {
    socket.disconnect();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  }, 2000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion Socket.IO:', error.message);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Déconnecté:', reason);
});

// Timeout de sécurité
setTimeout(() => {
  console.error('❌ Timeout de connexion Socket.IO');
  process.exit(1);
}, 10000);
