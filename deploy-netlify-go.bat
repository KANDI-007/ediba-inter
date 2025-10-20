@echo off
echo ========================================
echo DÉPLOIEMENT AUTOMATIQUE NETLIFY - GO!
echo ========================================

echo.
echo [1/4] Vérification finale du build...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build échoué!
    pause
    exit /b 1
)

echo.
echo [2/4] Création d'un site Netlify...
echo Tentative de déploiement automatique...

REM Créer un site Netlify avec un nom unique
set SITE_NAME=ediba-inter-%RANDOM%
echo Nom du site: %SITE_NAME%

echo.
echo [3/4] Déploiement via Netlify CLI...
netlify deploy --prod --dir=dist --site=%SITE_NAME% --auth
if %errorlevel% neq 0 (
    echo.
    echo DÉPLOIEMENT AUTOMATIQUE ÉCHOUÉ
    echo ================================
    echo.
    echo Utilisez l'option manuelle:
    echo 1. Allez sur https://app.netlify.com
    echo 2. Cliquez sur "New site from Git"
    echo 3. Sélectionnez "GitHub"
    echo 4. Choisissez "KANDI-007/ediba-inter"
    echo 5. Cliquez sur "Deploy site"
    echo.
    echo La configuration est déjà dans netlify.toml
    pause
    exit /b 1
)

echo.
echo [4/4] Déploiement réussi!
echo.
echo ========================================
echo SITE DÉPLOYÉ AVEC SUCCÈS!
echo ========================================
echo.
echo Votre site EDIBA-INTER est maintenant en ligne!
echo.
echo Pour voir l'URL de votre site, utilisez:
echo netlify open
echo.
pause
