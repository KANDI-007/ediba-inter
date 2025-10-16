@echo off
echo ========================================
echo   INITIALISATION REPOSITORY GIT
echo ========================================
echo.

REM Vérifier si Git est installé
set GIT_PATH=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo ❌ Git n'est pas trouvé. Installation en cours...
    winget install --id Git.Git -e --source winget
    if %errorlevel% neq 0 (
        echo ❌ Échec de l'installation de Git
        echo    Veuillez installer Git manuellement depuis: https://git-scm.com/download/win
        pause
        exit /b 1
    )
    echo ✓ Git installé avec succès
    echo    Veuillez redémarrer votre terminal et relancer ce script
    pause
    exit /b 0
)

echo [1/6] Initialisation du repository Git...
%GIT_PATH% init
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'initialisation Git
    pause
    exit /b 1
)
echo ✓ Repository Git initialisé
echo.

echo [2/6] Configuration Git (nom et email)...
echo Veuillez entrer votre nom pour Git:
set /p GIT_NAME="Nom: "
echo Veuillez entrer votre email pour Git:
set /p GIT_EMAIL="Email: "

%GIT_PATH% config user.name "%GIT_NAME%"
%GIT_PATH% config user.email "%GIT_EMAIL%"
echo ✓ Configuration Git terminée
echo.

echo [3/6] Vérification du fichier .gitignore...
if not exist .gitignore (
    echo Création du fichier .gitignore...
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo dist/ >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.production >> .gitignore
    echo .env.development >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo *.log >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
    echo ✓ Fichier .gitignore créé
) else (
    echo ✓ Fichier .gitignore existe déjà
)
echo.

echo [4/6] Ajout de tous les fichiers...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)
echo ✓ Fichiers ajoutés au staging
echo.

echo [5/6] Création du premier commit...
%GIT_PATH% commit -m "Initial commit: Application EDIBA-INTER

- Application de gestion de facturation complète
- Interface moderne avec React + TypeScript + Vite
- Système de chat intégré
- Gestion des utilisateurs et profils
- Module de décharge et facturation
- Configuration optimisée pour déploiement Netlify
- Corrections Vite/Rollup pour résolution des imports

Fonctionnalités principales:
- Dashboard moderne et responsive
- Gestion des utilisateurs avec rôles
- Système de chat en temps réel
- Module de facturation et décharge
- Notifications push
- PWA (Progressive Web App)
- Interface WhatsApp intégrée"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création du commit
    pause
    exit /b 1
)
echo ✓ Premier commit créé avec succès
echo.

echo [6/6] Configuration du repository distant...
echo.
echo Pour connecter à GitHub, vous devez:
echo 1. Créer un nouveau repository sur GitHub.com
echo 2. Copier l'URL du repository (ex: https://github.com/username/repo-name.git)
echo 3. Exécuter les commandes suivantes:
echo.
echo    git remote add origin VOTRE_URL_GITHUB
echo    git branch -M main
echo    git push -u origin main
echo.
echo Ou utilisez le script: setup-github-remote.bat
echo.

echo ========================================
echo   REPOSITORY GIT INITIALISE
echo ========================================
echo.
echo ✅ Repository Git créé avec succès
echo ✅ Premier commit effectué
echo ✅ Prêt pour la connexion GitHub
echo.
echo 📋 Prochaines étapes:
echo    1. Créer un repository sur GitHub
echo    2. Exécuter: setup-github-remote.bat
echo    3. Ou configurer manuellement le remote
echo.
pause
