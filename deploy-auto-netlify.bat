@echo off
echo ========================================
echo DÉPLOIEMENT AUTOMATIQUE NETLIFY
echo ========================================

echo.
echo [1/6] Préparation du déploiement...

REM Vérifier que le build fonctionne
echo Vérification du build local...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Le build a échoué!
    pause
    exit /b 1
)

echo.
echo [2/6] Installation de Netlify CLI...
call npm install -g netlify-cli
if %errorlevel% neq 0 (
    echo ATTENTION: Installation Netlify CLI échouée, tentative alternative...
    call npx netlify-cli --version
)

echo.
echo [3/6] Configuration du déploiement...
echo Création du fichier netlify.toml...

echo [build] > netlify.toml
echo   publish = "dist" >> netlify.toml
echo   command = "npm run build" >> netlify.toml
echo. >> netlify.toml
echo [build.environment] >> netlify.toml
echo   NODE_VERSION = "18" >> netlify.toml
echo   NPM_FLAGS = "--production=false" >> netlify.toml
echo. >> netlify.toml
echo [[redirects]] >> netlify.toml
echo   from = "/*" >> netlify.toml
echo   to = "/index.html" >> netlify.toml
echo   status = 200 >> netlify.toml

echo.
echo [4/6] Synchronisation avec GitHub...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Configuration déploiement automatique Netlify"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo [5/6] Tentative de déploiement automatique...
echo.
echo OPTION 1: Déploiement via Netlify CLI
echo =====================================
echo.
echo Si vous avez un token Netlify, utilisez:
echo netlify deploy --prod --dir=dist
echo.
echo Pour obtenir un token:
echo 1. Allez sur https://app.netlify.com/user/applications
echo 2. Créez un "Personal access token"
echo 3. Utilisez: netlify login
echo.

echo OPTION 2: Déploiement via GitHub (RECOMMANDÉ)
echo ============================================
echo.
echo 1. Allez sur https://app.netlify.com
echo 2. Cliquez sur "New site from Git"
echo 3. Sélectionnez "GitHub"
echo 4. Choisissez "KANDI-007/ediba-inter"
echo 5. Les paramètres sont déjà configurés dans netlify.toml
echo 6. Cliquez sur "Deploy site"
echo.

echo [6/6] Vérification finale...
echo.
echo Fichiers prêts pour le déploiement:
dir dist /b

echo.
echo Configuration Netlify:
type netlify.toml

echo.
echo ========================================
echo DÉPLOIEMENT AUTOMATIQUE CONFIGURÉ!
echo ========================================
echo.
echo Votre projet est maintenant configuré pour Netlify.
echo Le fichier netlify.toml contient tous les paramètres.
echo.
echo Pour déployer:
echo 1. Allez sur https://app.netlify.com
echo 2. Connectez votre repository GitHub
echo 3. Netlify détectera automatiquement la configuration
echo 4. Cliquez sur "Deploy site"
echo.
echo OU utilisez Netlify CLI:
echo netlify deploy --prod --dir=dist
echo.
pause
