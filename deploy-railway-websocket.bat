@echo off
echo ========================================
echo DÉPLOIEMENT RAILWAY - SERVEUR WEBSOCKET
echo ========================================

echo.
echo [1/5] Préparation des fichiers...
echo.

echo Création du fichier railway.json...
echo {
echo   "build": {
echo     "builder": "NIXPACKS"
echo   },
echo   "deploy": {
echo     "startCommand": "node websocket-server-production.cjs",
echo     "restartPolicyType": "ON_FAILURE",
echo     "restartPolicyMaxRetries": 10
echo   }
echo } > railway.json

echo.
echo [2/5] Création du package.json pour Railway...
copy websocket-production-package.json package-railway.json

echo.
echo [3/5] Instructions pour Railway...
echo.
echo ========================================
echo INSTRUCTIONS RAILWAY
echo ========================================
echo.
echo 1. Aller sur https://railway.app
echo 2. Créer un compte avec GitHub
echo 3. Cliquer sur "New Project"
echo 4. Sélectionner "Deploy from GitHub repo"
echo 5. Choisir votre repository: KANDI-007/ediba-inter
echo 6. Configurer:
echo    - Root Directory: / (racine)
echo    - Build Command: npm install
echo    - Start Command: node websocket-server-production.cjs
echo    - Port: 3001
echo.
echo 7. Variables d'environnement:
echo    NODE_ENV=production
echo    PORT=3001
echo.
echo 8. Déployer et noter l'URL générée
echo.

echo [4/5] Test local du serveur...
echo Test du serveur WebSocket local...
node websocket-server-production.cjs
if %errorlevel% neq 0 (
    echo ERREUR: Le serveur local ne démarre pas!
    echo Vérifiez que le port 3001 est libre
    pause
    exit /b 1
)

echo.
echo [5/5] Instructions Netlify...
echo.
echo ========================================
echo CONFIGURATION NETLIFY
echo ========================================
echo.
echo 1. Aller sur https://app.netlify.com/projects/ediba-inter/overview
echo 2. Site Settings → Environment Variables
echo 3. Ajouter ces variables:
echo    VITE_WEBSOCKET_URL=https://votre-url-railway.com
echo    VITE_ENVIRONMENT=production
echo 4. Redéployer l'application
echo.

echo ========================================
echo DÉPLOIEMENT PRÊT !
echo ========================================
echo.
echo Suivez les instructions ci-dessus pour:
echo ✅ Déployer le serveur WebSocket sur Railway
echo ✅ Configurer les variables Netlify
echo ✅ Tester le chat en production
echo.
pause
