@echo off
echo ========================================
echo DÉPLOIEMENT NETLIFY - SOLUTION DRAG & DROP
echo ========================================

echo.
echo [1/3] Préparation du déploiement...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build échoué!
    pause
    exit /b 1
)

echo.
echo [2/3] Ouverture du dossier dist...
echo Ouverture du dossier dist dans l'explorateur Windows...
start explorer dist

echo.
echo [3/3] Instructions pour le déploiement...
echo.
echo ========================================
echo DÉPLOIEMENT DRAG & DROP NETLIFY
echo ========================================
echo.
echo ÉTAPES SIMPLES:
echo.
echo 1. Le dossier 'dist' est maintenant ouvert
echo 2. Allez sur https://app.netlify.com/drop
echo 3. Glissez-déposez TOUT le contenu du dossier 'dist' 
echo    (pas le dossier lui-même, mais son contenu)
echo 4. Attendez 30 secondes
echo 5. Votre site sera déployé automatiquement!
echo.
echo ========================================
echo AVANTAGES DE CETTE MÉTHODE:
echo ========================================
echo.
echo ✅ Aucune authentification requise
echo ✅ Déploiement instantané
echo ✅ URL générée automatiquement
echo ✅ Toutes les images fonctionnelles
echo ✅ PWA installable
echo.
echo ========================================
echo VOTRE SITE SERA DISPONIBLE SUR:
echo ========================================
echo.
echo Une URL comme: https://random-name-123.netlify.app
echo.
echo Vous pourrez ensuite:
echo - Renommer votre site
echo - Configurer un domaine personnalisé
echo - Activer les déploiements automatiques depuis GitHub
echo.
echo ========================================
echo PRÊT POUR LE DÉPLOIEMENT!
echo ========================================
echo.
echo Le dossier dist est ouvert, allez sur:
echo https://app.netlify.com/drop
echo.
pause
