@echo off
REM 🚀 Script de Déploiement Automatique - EDIBA INTER (Windows)
REM Ce script automatise le processus de déploiement sur Windows

echo 🚀 Déploiement EDIBA INTER en cours...
echo ==================================

REM Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet.
    pause
    exit /b 1
)

REM 1. Nettoyer les dépendances
echo 🧹 Nettoyage des dépendances...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

REM 2. Installer les dépendances
echo 📦 Installation des dépendances...
npm install

REM 3. Vérifier les erreurs de linting
echo 🔍 Vérification du code...
npm run lint

REM 4. Exécuter les tests (si disponibles)
if exist "vitest.config.ts" (
    echo 🧪 Exécution des tests...
    npm run test
)

REM 5. Construire l'application
echo 🏗️ Construction de l'application...
npm run build

REM Vérifier que le build a réussi
if not exist "dist" (
    echo ❌ Erreur: Le dossier dist n'a pas été créé. Le build a échoué.
    pause
    exit /b 1
)

echo ✅ Build réussi !
echo 📁 Dossier dist créé avec les fichiers de production

REM 6. Afficher les informations de déploiement
echo.
echo 🌐 OPTIONS DE DÉPLOIEMENT :
echo ==========================
echo.
echo 1. VERCEL (Recommandé):
echo    - Aller sur https://vercel.com
echo    - Connecter votre GitHub
echo    - Importer ce projet
echo    - Déployer automatiquement
echo.
echo 2. NETLIFY:
echo    - Aller sur https://netlify.com
echo    - Drag ^& drop le dossier 'dist'
echo    - Ou connecter GitHub
echo.
echo 3. GITHUB PAGES:
echo    - Exécuter: npm run deploy
echo    - (Nécessite gh-pages installé)
echo.
echo 📊 STATISTIQUES DU BUILD:
echo ========================
echo Taille du dossier dist:
dir dist /s
echo.
echo Fichiers générés:
dir dist
echo.
echo 🎉 Prêt pour le déploiement !
echo 📖 Consultez GUIDE_DEPLOIEMENT_WEB.md pour plus de détails
echo.
pause
