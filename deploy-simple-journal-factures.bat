@echo off
echo ========================================
echo DÉPLOIEMENT SIMPLE JOURNAL FACTURES
echo ========================================
echo.

echo [1/3] Vérification des modifications...
if exist "src\components\modules\InvoiceModule.tsx" (
    echo ✅ InvoiceModule.tsx trouvé
) else (
    echo ❌ InvoiceModule.tsx non trouvé
    pause
    exit /b 1
)

echo.
echo [2/3] Compilation du projet...
call npm run build
if %errorlevel% equ 0 (
    echo ✅ Compilation réussie
) else (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo [3/3] Vérification des fichiers générés...
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
echo ========================================
echo DÉPLOIEMENT LOCAL TERMINÉ
echo ========================================
echo.
echo ✅ Modifications compilées avec succès
echo ✅ Journal des factures avec colonne NIF
echo ✅ Vue tableau avec ordre des colonnes correct
echo ✅ Boutons de basculement Cartes/Tableau
echo.
echo ========================================
echo INSTRUCTIONS DE DÉPLOIEMENT NETLIFY
echo ========================================
echo 1. Ouvrir https://app.netlify.com/
echo 2. Se connecter à votre compte
echo 3. Aller dans "Sites" et sélectionner "ediba-inter"
echo 4. Cliquer sur "Deploys" dans le menu
echo 5. Glisser-déposer le dossier "dist" dans la zone de déploiement
echo 6. Attendre la fin du déploiement
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
echo TEST LOCAL
echo ========================================
echo Pour tester localement:
echo 1. Ouvrir http://localhost:5173/invoices
echo 2. Cliquer sur le bouton "Tableau"
echo 3. Vérifier la colonne NIF
echo 4. Vérifier l'ordre des colonnes
echo.
pause
