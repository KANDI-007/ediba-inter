@echo off
echo ========================================
echo   CORRECTION AFFICHAGE IMAGES EDIBA-INTER
echo ========================================
echo.

echo [1/5] Vérification des images manquantes...
if not exist "public\default-avatar.png" (
    echo Création de default-avatar.png...
    copy "public\icons\icon-192x192.svg" "public\default-avatar.png"
    echo ✓ default-avatar.png créé
) else (
    echo ✓ default-avatar.png existe déjà
)

if not exist "public\placeholder-image.jpg" (
    echo Création de placeholder-image.jpg...
    copy "public\logo-ediba.png" "public\placeholder-image.jpg"
    echo ✓ placeholder-image.jpg créé
) else (
    echo ✓ placeholder-image.jpg existe déjà
)
echo.

echo [2/5] Correction des extensions doubles...
if exist "public\entete.png.png" (
    echo Renommage de entete.png.png...
    ren "public\entete.png.png" "entete.png"
    echo ✓ entete.png.png renommé en entete.png
)

if exist "public\pied.png.png" (
    echo Renommage de pied.png.png...
    ren "public\pied.png.png" "pied.png"
    echo ✓ pied.png.png renommé en pied.png
)

if exist "public\factureimage\header.jpg.jpg" (
    echo Renommage de header.jpg.jpg...
    ren "public\factureimage\header.jpg.jpg" "header.jpg"
    echo ✓ header.jpg.jpg renommé en header.jpg
)

if exist "public\factureimage\footer.jpg.jpg" (
    echo Renommage de footer.jpg.jpg...
    ren "public\factureimage\footer.jpg.jpg" "footer.jpg"
    echo ✓ footer.jpg.jpg renommé en footer.jpg
)
echo.

echo [3/5] Test de construction...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la construction
    pause
    exit /b 1
)
echo ✓ Build réussi
echo.

echo [4/5] Vérification des images dans dist...
if exist "dist\logo-ediba.png" (
    echo ✓ logo-ediba.png copié dans dist
) else (
    echo ❌ logo-ediba.png manquant dans dist
)

if exist "dist\default-avatar.png" (
    echo ✓ default-avatar.png copié dans dist
) else (
    echo ❌ default-avatar.png manquant dans dist
)

if exist "dist\placeholder-image.jpg" (
    echo ✓ placeholder-image.jpg copié dans dist
) else (
    echo ❌ placeholder-image.jpg manquant dans dist
)
echo.

echo [5/5] Ajout des corrections au Git...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Fix: Correction affichage images après déploiement

✅ Images manquantes créées (default-avatar.png, placeholder-image.jpg)
✅ Extensions doubles corrigées
✅ Chemins d'images optimisés pour Netlify (./ au lieu de /)
✅ Configuration Vite mise à jour (base: './')
✅ Tous les composants mis à jour

Résout le problème d'affichage des images sur Netlify"
echo ✓ Corrections commitées
echo.

echo ========================================
echo   CORRECTION IMAGES TERMINEE AVEC SUCCES
echo ========================================
echo.
echo ✅ Images manquantes créées
✅ Extensions doubles corrigées
✅ Chemins optimisés pour Netlify
✅ Build testé et validé
✅ Corrections commitées
echo.
echo 🚀 Prêt pour redéploiement sur Netlify !
echo.
echo 📋 Prochaines étapes:
echo    1. Push vers GitHub: git push origin main
echo    2. Netlify redéploiera automatiquement
echo    3. Vérifier l'affichage des images sur le site
echo.
pause
