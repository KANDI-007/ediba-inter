@echo off
echo ========================================
echo TEST CHAT MULTI-UTILISATEURS EDIBA-INTER
echo ========================================

echo.
echo [1/6] Vérification de l'environnement...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé!
    pause
    exit /b 1
)

echo.
echo [2/6] Installation des dépendances...
call npm install express socket.io cors nodemon

echo.
echo [3/6] Démarrage du serveur WebSocket...
echo Le serveur WebSocket va démarrer en arrière-plan...
start /min node websocket-server.js

echo.
echo [4/6] Attente du démarrage du serveur...
timeout /t 3 /nobreak > nul

echo.
echo [5/6] Démarrage de l'application frontend...
echo L'application va démarrer sur http://localhost:5173
echo.
echo INSTRUCTIONS POUR LE TEST:
echo ==========================
echo.
echo 1. Ouvrez http://localhost:5173 dans votre navigateur
echo 2. Connectez-vous avec un utilisateur (ex: admin/admin)
echo 3. Ouvrez un autre onglet/navigateur
echo 4. Connectez-vous avec un autre utilisateur (ex: manager/manager)
echo 5. Dans le module Chat, vous devriez voir les deux utilisateurs
echo 6. Créez une conversation entre les deux utilisateurs
echo 7. Testez l'envoi de messages en temps réel
echo.
echo FONCTIONNALITÉS À TESTER:
echo =========================
echo.
echo ✅ Connexion multi-utilisateurs
echo ✅ Liste des utilisateurs en ligne
echo ✅ Création de conversations
echo ✅ Envoi de messages en temps réel
echo ✅ Indicateurs de frappe
echo ✅ Accusés de réception
echo ✅ Notifications push
echo ✅ Appels audio/vidéo
echo.
echo [6/6] Démarrage de l'application...
call npm run dev

echo.
echo ========================================
echo TEST TERMINÉ
echo ========================================
echo.
echo Pour arrêter le serveur WebSocket:
echo 1. Ouvrez le Gestionnaire des tâches
echo 2. Trouvez le processus "node websocket-server.js"
echo 3. Terminez le processus
echo.
pause
