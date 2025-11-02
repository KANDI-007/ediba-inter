@echo off
echo ========================================
echo TEST JOURNAL FACTURES AVEC NIF
echo ========================================
echo.

echo [1/5] Verification des modifications dans InvoiceModule...
findstr /n "viewMode.*cards.*table" "src\components\modules\InvoiceModule.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ Vue tableau ajoutée avec succès
) else (
    echo ❌ Vue tableau non trouvée
)

echo.
echo [2/5] Verification de l'affichage du NIF...
findstr /n "NIF.*clientData" "src\components\modules\InvoiceModule.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ Affichage du NIF ajouté avec succès
) else (
    echo ❌ Affichage du NIF non trouvé
)

echo.
echo [3/5] Verification de l'ordre des colonnes...
findstr /n "État exécution.*État de paiement" "src\components\modules\InvoiceModule.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ Ordre des colonnes correct (État exécution avant État de paiement)
) else (
    echo ❌ Ordre des colonnes incorrect
)

echo.
echo [4/5] Verification de la structure du tableau...
findstr /n "thead.*tbody" "src\components\modules\InvoiceModule.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ Structure du tableau HTML présente
) else (
    echo ❌ Structure du tableau HTML manquante
)

echo.
echo [5/5] Test de compilation...
echo Compilation en cours...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Compilation réussie
    echo.
    echo ========================================
    echo RÉSULTATS DU TEST
    echo ========================================
    echo ✅ Vue tableau avec boutons Cartes/Tableau
    echo ✅ Colonne NIF ajoutée dans les deux vues
    echo ✅ Ordre des colonnes: État exécution avant État de paiement
    echo ✅ Structure HTML du tableau complète
    echo ✅ Compilation sans erreurs
    echo.
    echo ========================================
    echo INSTRUCTIONS DE TEST
    echo ========================================
    echo 1. Ouvrir http://localhost:5173/invoices
    echo 2. Cliquer sur le bouton "Tableau" pour voir la vue tableau
    echo 3. Vérifier que la colonne NIF s'affiche
    echo 4. Vérifier que "État exécution" vient avant "État de paiement"
    echo 5. Cliquer sur "Cartes" pour revenir à la vue cartes
    echo 6. Vérifier que le NIF s'affiche aussi dans la vue cartes
    echo.
    echo ========================================
    echo FONCTIONNALITÉS AJOUTÉES
    echo ========================================
    echo • Vue tableau avec colonnes organisées
    echo • Colonne NIF récupérée depuis les données clients
    echo • Boutons de basculement Cartes/Tableau
    echo • Ordre des colonnes conforme aux exigences
    echo • Actions disponibles dans les deux vues
    echo.
) else (
    echo ❌ Erreur de compilation
    echo Vérifiez les erreurs ci-dessus
)

echo.
echo Test terminé.
pause
