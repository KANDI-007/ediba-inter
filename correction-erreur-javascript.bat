@echo off
echo ========================================
echo   CORRECTION ERREUR JAVASCRIPT NETLIFY
echo ========================================
echo.

echo [1/6] Diagnostic du probleme...
echo Erreur detectee: Unexpected token '<' dans main-C0_Vo3Gx.js
echo Cause probable: Cache Netlify ou fichier corrompu
echo.

echo [2/6] Nettoyage du cache local...
if exist "dist" rmdir /s /q "dist"
if exist ".netlify" rmdir /s /q ".netlify"
echo ✅ Cache local nettoye
echo.

echo [3/6] Reconstruction du projet...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build
    pause
    exit /b 1
) else (
    echo ✅ Build reussi
)

echo.
echo [4/6] Verification des fichiers generes...
if exist "dist\index.html" (
    echo ✅ index.html present
) else (
    echo ❌ index.html manquant
)

if exist "dist\assets\main-*.js" (
    echo ✅ Fichiers JS presents
) else (
    echo ❌ Fichiers JS manquants
)

echo.
echo [5/6] Deploiement force sur Netlify...
echo Deploiement avec nettoyage du cache...
netlify deploy --prod --dir=dist --site=349593ec-95ed-42c9-a8f7-888645986f18 --force
if %errorlevel% neq 0 (
    echo ❌ Erreur de deploiement
    pause
    exit /b 1
) else (
    echo ✅ Deploiement reussi
)

echo.
echo [6/6] Instructions de test...
echo 1. Ouvrez https://ediba-inter.netlify.app
echo 2. Ouvrez la console (F12)
echo 3. Verifiez qu'il n'y a plus d'erreur JavaScript
echo 4. Testez toutes les fonctionnalites
echo.

echo ========================================
echo   CORRECTION TERMINEE
echo ========================================
echo.
echo Si le probleme persiste:
echo - Videz le cache du navigateur (Ctrl+Shift+R)
echo - Testez en navigation privee
echo - Verifiez les logs Netlify
echo.
pause
