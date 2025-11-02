@echo off
echo ========================================
echo   DIAGNOSTIC PAGE BLANCHE EDIBA-INTER
echo ========================================
echo.

echo [1/6] Verification du build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build detectee
    pause
    exit /b 1
) else (
    echo ✅ Build reussi
)

echo.
echo [2/6] Verification des fichiers critiques...
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
echo [3/6] Verification du serveur local...
echo Demarrage du serveur de developpement...
echo Ouvrez http://localhost:5173 dans votre navigateur
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
npm run dev
