@echo off
echo ========================================
echo DÉPLOIEMENT RAILWAY SIMPLIFIÉ
echo ========================================

echo.
echo [1/4] Vérification des fichiers...
if not exist "websocket-server-production.cjs" (
    echo ERREUR: websocket-server-production.cjs introuvable!
    pause
    exit /b 1
)

if not exist "railway.json" (
    echo ERREUR: railway.json introuvable!
    pause
    exit /b 1
)

echo ✅ Fichiers trouvés

echo.
echo [2/4] Test de la syntaxe JSON...
node -e "JSON.parse(require('fs').readFileSync('railway.json', 'utf8')); console.log('✅ railway.json valide')"
if %errorlevel% neq 0 (
    echo ERREUR: railway.json invalide!
    pause
    exit /b 1
)

echo.
echo [3/4] Instructions Railway...
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
echo.
echo CONFIGURATION:
echo ==============
echo - Root Directory: / (racine)
echo - Build Command: npm install
echo - Start Command: node websocket-server-production.cjs
echo - Port: 3001
echo.
echo VARIABLES D'ENVIRONNEMENT:
echo ==========================
echo NODE_ENV=production
echo PORT=3001
echo.
echo 6. Déployer et noter l'URL générée
echo.

echo [4/4] Configuration Netlify...
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
echo Fichiers créés:
echo ✅ railway.json (syntaxe corrigée)
echo ✅ Procfile (alternative)
echo ✅ Script de déploiement
echo.
echo Suivez les instructions ci-dessus pour déployer!
echo.
pause
