#!/bin/bash

echo "🚀 Démarrage de l'application EDIBA INTER"
echo "========================================"

echo ""
echo "📡 Démarrage du serveur backend (Supabase + Socket.IO)..."
cd supabase-setup && npm start &
BACKEND_PID=$!

echo ""
echo "⏳ Attente du démarrage du backend..."
sleep 5

echo ""
echo "🌐 Démarrage du serveur frontend (React + Vite)..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application démarrée !"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs..."

# Fonction pour arrêter les processus
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait
