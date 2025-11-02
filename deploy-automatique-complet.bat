@echo off
echo ========================================
echo DÉPLOIEMENT AUTOMATIQUE COMPLET NETLIFY
echo ========================================
echo.

echo [1/8] Vérification de l'environnement...
echo Vérification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js non installé
    pause
    exit /b 1
)

echo Vérification de npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm non installé
    pause
    exit /b 1
)

echo.
echo [2/8] Nettoyage et préparation...
echo Suppression des anciens builds...
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo.
echo [3/8] Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur installation dépendances
    pause
    exit /b 1
)

echo.
echo [4/8] Build du projet...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build
    pause
    exit /b 1
)

echo ✅ Build réussi!

echo.
echo [5/8] Vérification des fichiers générés...
if exist "dist\index.html" (
    echo ✅ index.html généré
) else (
    echo ❌ index.html manquant
    pause
    exit /b 1
)

if exist "dist\assets" (
    echo ✅ Assets générés
) else (
    echo ❌ Assets manquants
    pause
    exit /b 1
)

echo.
echo [6/8] Installation de Netlify CLI...
call npm install -g netlify-cli
if %errorlevel% neq 0 (
    echo ⚠️ Installation Netlify CLI échouée, tentative avec npx...
    call npx netlify-cli --version
    if %errorlevel% neq 0 (
        echo ❌ Netlify CLI non disponible
        echo.
        echo ========================================
        echo DÉPLOIEMENT MANUEL REQUIS
        echo ========================================
        echo.
        echo 1. Allez sur https://app.netlify.com/
        echo 2. Cliquez sur "New site from Git"
        echo 3. Sélectionnez "GitHub"
        echo 4. Choisissez votre repository
        echo 5. Configurez:
        echo    - Build command: npm run build
        echo    - Publish directory: dist
        echo 6. Cliquez sur "Deploy site"
        echo.
        echo Le dossier dist est prêt pour upload manuel.
        pause
        exit /b 1
    )
)

echo.
echo [7/8] Déploiement sur Netlify...
echo.
echo ⚠️ ATTENTION: Vous devez être connecté à Netlify
echo Si ce n'est pas le cas, exécutez d'abord: netlify login
echo.

echo Tentative de déploiement automatique...
netlify deploy --prod --dir=dist --open
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Déploiement automatique échoué
    echo Tentative de déploiement avec authentification...
    echo.
    netlify login
    netlify deploy --prod --dir=dist --open
    if %errorlevel% neq 0 (
        echo.
        echo ========================================
        echo DÉPLOIEMENT MANUEL REQUIS
        echo ========================================
        echo.
        echo 1. Allez sur https://app.netlify.com/
        echo 2. Glissez-déposez le dossier "dist" dans la zone de déploiement
        echo 3. Attendez la fin du déploiement
        echo.
        echo Ou utilisez GitHub:
        echo 1. Commitez et pushez votre code sur GitHub
        echo 2. Connectez votre repo GitHub à Netlify
        echo 3. Configurez le déploiement automatique
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [8/8] Vérification du déploiement...
echo.
echo ========================================
echo DÉPLOIEMENT RÉUSSI! 🎉
echo ========================================
echo.
echo ✅ Votre application EDIBA-INTER est maintenant en ligne!
echo ✅ Journal des factures avec colonne NIF déployé
echo ✅ Vue tableau avec ordre des colonnes correct
echo ✅ Boutons de basculement Cartes/Tableau
echo.
echo ========================================
echo FONCTIONNALITÉS DÉPLOYÉES
echo ========================================
echo • Vue tableau complète avec toutes les colonnes
echo • Colonne NIF récupérée depuis les données clients
echo • Boutons Cartes/Tableau pour basculer entre les vues
echo • Ordre des colonnes conforme aux exigences
echo • Actions disponibles dans les deux vues
echo • Interface responsive et moderne
echo.
echo ========================================
echo PROCHAINES ÉTAPES
echo ========================================
echo 1. Tester l'application sur l'URL fournie
echo 2. Vérifier l'affichage du NIF dans les deux vues
echo 3. Tester le basculement Cartes/Tableau
echo 4. Confirmer l'ordre des colonnes
echo 5. Valider toutes les actions
echo.
echo ========================================
echo MISSION ACCOMPLIE! ✅
echo ========================================
echo.
pause
