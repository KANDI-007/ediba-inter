@echo off
echo ========================================
echo DÉPLOIEMENT CHAT PRODUCTION EDIBA-INTER
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
call npm install

echo.
echo [3/6] Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build échoué!
    pause
    exit /b 1
)

echo.
echo [4/6] Test du build local...
echo L'application sera testée sur http://localhost:4173
start /min npm run preview

echo.
echo [5/6] Déploiement sur GitHub...
call git add .
call git commit -m "Deploy chat multi-utilisateurs production ready"
call git push origin main
if %errorlevel% neq 0 (
    echo ERREUR: Push GitHub échoué!
    pause
    exit /b 1
)

echo.
echo [6/6] Configuration Netlify...
echo.
echo ========================================
echo CONFIGURATION NETLIFY REQUISE
echo ========================================
echo.
echo 1. Allez sur https://app.netlify.com/projects/ediba-inter/overview
echo 2. Vérifiez que le déploiement automatique est activé
echo 3. Ajoutez ces variables d'environnement:
echo.
echo    VITE_WEBSOCKET_URL=https://ediba-inter-websocket.herokuapp.com
echo    VITE_ENVIRONMENT=production
echo.
echo 4. Redéployez l'application
echo.
echo ========================================
echo DÉPLOIEMENT FRONTEND TERMINÉ !
echo ========================================
echo.
echo PROCHAINES ÉTAPES:
echo ==================
echo.
echo 1. Déployer le serveur WebSocket sur Heroku/Railway/Vercel
echo 2. Configurer les variables d'environnement Netlify
echo 3. Tester l'application en production
echo.
echo URLs:
echo =====
echo Frontend: https://ediba-inter.netlify.app
echo WebSocket: https://ediba-inter-websocket.herokuapp.com
echo.
pause
