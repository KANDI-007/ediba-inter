@echo off
echo ========================================
echo DÉPLOIEMENT SERVEUR WEBSOCKET HEROKU
echo ========================================

echo.
echo [1/7] Vérification de Heroku CLI...
heroku --version
if %errorlevel% neq 0 (
    echo ERREUR: Heroku CLI n'est pas installé!
    echo Installez depuis: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo.
echo [2/7] Connexion à Heroku...
heroku login
if %errorlevel% neq 0 (
    echo ERREUR: Connexion Heroku échouée!
    pause
    exit /b 1
)

echo.
echo [3/7] Création de l'application Heroku...
heroku create ediba-inter-websocket
if %errorlevel% neq 0 (
    echo ERREUR: Création application Heroku échouée!
    pause
    exit /b 1
)

echo.
echo [4/7] Configuration des variables d'environnement...
heroku config:set NODE_ENV=production -a ediba-inter-websocket
heroku config:set PORT=3001 -a ediba-inter-websocket

echo.
echo [5/7] Préparation des fichiers de déploiement...
copy websocket-server-production.cjs server.js
copy websocket-production-package.json package.json

echo.
echo [6/7] Déploiement sur Heroku...
git add .
git commit -m "Deploy WebSocket server to Heroku"
git push heroku main
if %errorlevel% neq 0 (
    echo ERREUR: Déploiement Heroku échoué!
    pause
    exit /b 1
)

echo.
echo [7/7] Vérification du déploiement...
timeout /t 5 /nobreak
curl https://ediba-inter-websocket.herokuapp.com/api/health
if %errorlevel% neq 0 (
    echo ATTENTION: Le serveur peut prendre quelques minutes à démarrer
    echo Vérifiez manuellement: https://ediba-inter-websocket.herokuapp.com/api/health
)

echo.
echo ========================================
echo DÉPLOIEMENT SERVEUR TERMINÉ !
echo ========================================
echo.
echo URLs:
echo =====
echo Serveur WebSocket: https://ediba-inter-websocket.herokuapp.com
echo API Health: https://ediba-inter-websocket.herokuapp.com/api/health
echo.
echo PROCHAINES ÉTAPES:
echo ==================
echo.
echo 1. Configurer les variables d'environnement Netlify:
echo    VITE_WEBSOCKET_URL=https://ediba-inter-websocket.herokuapp.com
echo.
echo 2. Redéployer l'application frontend sur Netlify
echo.
echo 3. Tester le chat en production
echo.
echo Monitoring:
echo ============
echo heroku logs --tail -a ediba-inter-websocket
echo.
pause
