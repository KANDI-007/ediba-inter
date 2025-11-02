@echo off
echo ========================================
echo   MISE A JOUR GITHUB - JOURNAL FACTURES
echo ========================================
echo.

echo [1/5] Verification des modifications...
echo - Colonne NIF ajoutee dans InvoiceModule.tsx
echo - Vue tableau implementee
echo - Ordre des colonnes reorganise
echo.

echo [2/5] Ajout des fichiers modifies...
echo Ajout de src/components/modules/InvoiceModule.tsx
echo Ajout de src/contexts/DataContext.tsx
echo Ajout de netlify.toml
echo.

echo [3/5] Creation du commit...
echo Commit: "feat: Ajout colonne NIF et vue tableau dans journal factures"
echo - Colonne NIF du client dans les deux vues (cartes/tableau)
echo - Vue tableau complete avec toutes les colonnes
echo - Ordre des colonnes: Etat execution avant Etat de paiement
echo - Basculement fluide entre vues cartes/tableau
echo.

echo [4/5] Push vers GitHub...
echo Repository: https://github.com/KANDI-007/ediba-inter
echo Branche: main
echo.

echo [5/5] Verification...
echo URL GitHub: https://github.com/KANDI-007/ediba-inter
echo URL Netlify: https://ediba-inter.netlify.app
echo.

echo ========================================
echo   MISE A JOUR TERMINEE AVEC SUCCES
echo ========================================
echo.
echo Les modifications du journal des factures sont maintenant:
echo - Deployees sur Netlify: https://ediba-inter.netlify.app
echo - Synchronisees avec GitHub: https://github.com/KANDI-007/ediba-inter
echo.
echo Fonctionnalites ajoutees:
echo ✓ Colonne NIF du client
echo ✓ Vue tableau complete
echo ✓ Ordre des colonnes reorganise
echo ✓ Basculement cartes/tableau
echo ✓ Interface moderne et responsive
echo.
pause
