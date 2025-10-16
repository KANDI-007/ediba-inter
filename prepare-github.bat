@echo off
REM 🚀 Script de Préparation GitHub - EDIBA INTER
REM Ce script prépare votre projet pour l'upload sur GitHub

echo 🚀 Préparation du projet EDIBA INTER pour GitHub...
echo ================================================

REM Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet.
    pause
    exit /b 1
)

echo ✅ Projet détecté !

REM 1. Nettoyer les fichiers inutiles
echo 🧹 Nettoyage des fichiers inutiles...
if exist "node_modules" (
    echo Suppression de node_modules...
    rmdir /s /q "node_modules"
)

if exist "dist" (
    echo Suppression de dist...
    rmdir /s /q "dist"
)

if exist ".git" (
    echo Suppression de .git...
    rmdir /s /q ".git"
)

REM 2. Créer un dossier de préparation
echo 📁 Création du dossier de préparation...
if exist "github-upload" rmdir /s /q "github-upload"
mkdir "github-upload"

REM 3. Copier les fichiers nécessaires
echo 📋 Copie des fichiers pour GitHub...

REM Copier les fichiers principaux
copy "package.json" "github-upload\"
copy "package-lock.json" "github-upload\"
copy "vite.config.ts" "github-upload\"
copy "tailwind.config.js" "github-upload\"
copy "tsconfig.json" "github-upload\"
copy "tsconfig.app.json" "github-upload\"
copy "tsconfig.node.json" "github-upload\"
copy "vitest.config.ts" "github-upload\"
copy "eslint.config.js" "github-upload\"
copy "postcss.config.js" "github-upload\"
copy "index.html" "github-upload\"
copy "vercel.json" "github-upload\"
copy "netlify.toml" "github-upload\"
copy ".gitignore" "github-upload\"

REM Copier les dossiers
echo Copie du dossier src...
xcopy "src" "github-upload\src" /e /i /h

echo Copie du dossier public...
xcopy "public" "github-upload\public" /e /i /h

echo Copie des scripts...
if exist "scripts" xcopy "scripts" "github-upload\scripts" /e /i /h

REM Copier les fichiers de documentation
echo Copie des fichiers de documentation...
copy "README.md" "github-upload\"
copy "CHANGELOG.md" "github-upload\"
copy "GUIDE_*.md" "github-upload\"
copy "DEPLOIEMENT_*.md" "github-upload\"
copy "*.md" "github-upload\"

REM Copier les fichiers Docker (optionnel)
if exist "Dockerfile" copy "Dockerfile" "github-upload\"
if exist "docker-compose.yml" copy "docker-compose.yml" "github-upload\"
if exist "nginx.conf" copy "nginx.conf" "github-upload\"

REM 4. Afficher les instructions
echo.
echo ✅ Préparation terminée !
echo 📁 Dossier créé: github-upload
echo.
echo 🌐 ÉTAPES SUIVANTES :
echo ====================
echo.
echo 1. Aller sur https://github.com
echo 2. Créer un nouveau repository nommé "ediba-inter"
echo 3. Dans le repository, cliquer "uploading an existing file"
echo 4. Glisser-déposer TOUT le contenu du dossier "github-upload"
echo 5. Message de commit: "Initial upload - EDIBA INTER"
echo 6. Cliquer "Commit changes"
echo 7. Aller sur https://vercel.com
echo 8. Se connecter avec GitHub
echo 9. "New Project" → Sélectionner "ediba-inter"
echo 10. Cliquer "Deploy"
echo.
echo 📊 STATISTIQUES :
echo ================
echo Taille du dossier github-upload:
dir github-upload /s
echo.
echo 🎉 Votre projet est prêt pour GitHub !
echo 📖 Consultez DEMARRAGE_GITHUB_VERCEL.md pour plus de détails
echo.
pause
