@echo off
echo ========================================
echo DÉMARRAGE SERVEUR WEBSOCKET EDIBA-INTER
echo ========================================

echo.
echo [1/4] Vérification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé!
    echo Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/4] Installation des dépendances WebSocket...
if not exist "websocket-package.json" (
    echo ERREUR: websocket-package.json introuvable!
    pause
    exit /b 1
)

copy websocket-package.json package-websocket.json
npm install --prefix . express socket.io cors nodemon

echo.
echo [3/4] Démarrage du serveur WebSocket...
echo.
echo Le serveur WebSocket va démarrer sur le port 3000
echo Il gérera les connexions en temps réel pour le chat
echo.
echo Fonctionnalités disponibles:
echo ✅ Chat en temps réel multi-utilisateurs
echo ✅ Notifications push
echo ✅ Appels audio/vidéo
echo ✅ Indicateurs de frappe
echo ✅ Accusés de réception
echo ✅ Gestion des conversations
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

node websocket-server.js

echo.
echo [4/4] Serveur arrêté
echo.
echo Pour redémarrer le serveur:
echo node websocket-server.js
echo.
pause
