@echo off
echo ========================================
echo OUVERTURE DU DOSSIER DIST POUR NETLIFY
echo ========================================
echo.

echo Ouverture du dossier dist...
explorer dist

echo.
echo ========================================
echo INSTRUCTIONS DE DÉPLOIEMENT NETLIFY
echo ========================================
echo.
echo 1. Le dossier "dist" s'ouvre automatiquement
echo 2. Sélectionner TOUS les fichiers du dossier dist
echo 3. Les compresser en fichier ZIP
echo 4. Aller sur https://app.netlify.com/
echo 5. Se connecter à votre compte
echo 6. Aller dans "Sites" et sélectionner "ediba-inter"
echo 7. Cliquer sur "Deploys" dans le menu
echo 8. Glisser-déposer le fichier ZIP dans la zone de déploiement
echo 9. Attendre la fin du déploiement
echo.
echo ========================================
echo ALTERNATIVE: DRAG & DROP DIRECT
echo ========================================
echo.
echo Vous pouvez aussi:
echo 1. Sélectionner tous les fichiers du dossier dist
echo 2. Les glisser-déposer directement sur Netlify
echo 3. Sans créer de fichier ZIP
echo.
echo ========================================
echo FONCTIONNALITÉS À TESTER
echo ========================================
echo.
echo Une fois déployé, tester:
echo • Vue tableau avec colonne NIF
echo • Basculement Cartes/Tableau
echo • Ordre des colonnes correct
echo • Actions dans les deux vues
echo.
pause
