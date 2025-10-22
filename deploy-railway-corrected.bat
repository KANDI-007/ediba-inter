@echo off
echo ========================================
echo DEPLOIEMENT RAILWAY WEBSOCKET CORRIGE
echo ========================================

echo [1/6] Verification des fichiers Railway...
if not exist "railway.json" (
    echo ❌ railway.json manquant
    exit /b 1
)
if not exist "Procfile" (
    echo ❌ Procfile manquant
    exit /b 1
)
if not exist "websocket-server-production.cjs" (
    echo ❌ websocket-server-production.cjs manquant
    exit /b 1
)
if not exist "websocket-production-package.json" (
    echo ❌ websocket-production-package.json manquant
    exit /b 1
)
echo ✅ Tous les fichiers Railway sont presents

echo.
echo [2/6] Verification du contenu railway.json...
type railway.json
echo.

echo [3/6] Verification du contenu Procfile...
type Procfile
echo.

echo [4/6] Verification du package.json WebSocket...
type websocket-production-package.json
echo.

echo [5/6] Commit des fichiers Railway...
"C:\Program Files\Git\bin\git.exe" add railway.json Procfile .railwayignore websocket-server-production.cjs websocket-production-package.json Dockerfile.websocket
"C:\Program Files\Git\bin\git.exe" commit -m "🚀 Configuration Railway WebSocket corrigee - Dockerfile specifique + railwayignore"
echo ✅ Commit Railway effectue

echo.
echo [6/6] Push vers GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main
echo ✅ Push Railway effectue

echo.
echo ========================================
echo DEPLOIEMENT RAILWAY PRET !
echo ========================================
echo.
echo 📋 ETAPES SUIVANTES :
echo 1. Aller sur https://railway.app
echo 2. Creer un nouveau projet
echo 3. Connecter le repository GitHub
echo 4. Railway utilisera automatiquement :
echo    - railway.json (configuration)
echo    - Procfile (commande de demarrage)
echo    - .railwayignore (fichiers a ignorer)
echo    - websocket-server-production.cjs (serveur)
echo.
echo 🌐 Une fois deploye, vous obtiendrez une URL comme :
echo https://votre-projet.railway.app
echo.
echo 🔧 Variables d'environnement a configurer sur Railway :
echo - PORT (automatique)
echo - NODE_ENV=production
echo.
echo ✅ Configuration Railway complete !
pause
