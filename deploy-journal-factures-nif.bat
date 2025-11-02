@echo off
echo ========================================
echo DÉPLOIEMENT JOURNAL FACTURES AVEC NIF
echo ========================================
echo.

echo [1/4] Vérification des modifications...
if exist "src\components\modules\InvoiceModule.tsx" (
    echo ✅ InvoiceModule.tsx trouvé
) else (
    echo ❌ InvoiceModule.tsx non trouvé
    pause
    exit /b 1
)

echo.
echo [2/4] Compilation du projet...
call npm run build
if %errorlevel% equ 0 (
    echo ✅ Compilation réussie
) else (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo [3/4] Commit des modifications...
git add .
git commit -m "JOURNAL FACTURES: Ajout colonne NIF et vue tableau

- Ajout de la colonne NIF dans le journal des factures clients
- Création d'une vue tableau avec boutons de basculement Cartes/Tableau
- Réorganisation des colonnes: État exécution avant État de paiement
- Affichage du NIF récupéré depuis les données clients
- Actions disponibles dans les deux vues (Voir, Modifier, Supprimer)
- Interface responsive avec overflow-x-auto pour le tableau
- Conservation de toutes les fonctionnalités existantes"

if %errorlevel% equ 0 (
    echo ✅ Commit réussi
) else (
    echo ❌ Erreur de commit
    pause
    exit /b 1
)

echo.
echo [4/4] Push vers GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Push réussi
) else (
    echo ❌ Erreur de push
    pause
    exit /b 1
)

echo.
echo ========================================
echo DÉPLOIEMENT TERMINÉ
echo ========================================
echo.
echo ✅ Modifications déployées avec succès
echo ✅ Journal des factures avec colonne NIF
echo ✅ Vue tableau avec ordre des colonnes correct
echo ✅ Boutons de basculement Cartes/Tableau
echo ✅ Synchronisation GitHub terminée
echo.
echo ========================================
echo PROCHAINES ÉTAPES
echo ========================================
echo 1. Attendre le déploiement automatique Netlify
echo 2. Tester sur https://ediba-inter.netlify.app/invoices
echo 3. Vérifier la colonne NIF dans la vue tableau
echo 4. Vérifier l'ordre des colonnes (État exécution avant État de paiement)
echo 5. Tester le basculement entre vues Cartes/Tableau
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
pause
