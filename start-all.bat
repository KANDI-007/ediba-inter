@echo off
echo 🚀 Démarrage de l'application EDIBA INTER
echo ========================================

echo.
echo 📡 Démarrage du serveur backend (Socket.IO)...
start "Backend EDIBA INTER" cmd /k "npm run start:backend"

echo.
echo ⏳ Attente du démarrage du backend...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Démarrage du serveur frontend (React + Vite)...
start "Frontend EDIBA INTER" cmd /k "npm run dev"

echo.
echo ✅ Application démarrée !
echo.
echo 📱 Frontend: http://localhost:5173 (ou 5174)
echo 🔧 Backend:  http://localhost:3000
echo 💬 Chat: Socket.IO actif
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul
