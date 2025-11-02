@echo off
echo ========================================
echo   SYNCHRONISATION GITHUB EDIBA-INTER
echo ========================================
echo.

echo [1/6] Verification de Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git non trouve dans le PATH
    echo.
    echo 🔧 SOLUTIONS ALTERNATIVES:
    echo 1. Installer Git: https://git-scm.com/download/win
    echo 2. Utiliser GitHub Desktop: https://desktop.github.com/
    echo 3. Utiliser l'interface web GitHub
    echo.
    echo 📋 FICHIERS À SYNCHRONISER:
    echo - CORRECTION_ERREUR_JAVASCRIPT_TERMINEE.md
    echo - CORRECTION_PAGE_BLANCHE_TERMINEE.md
    echo - src/App.tsx (version corrigee avec ErrorBoundary)
    echo - src/App-backup.tsx (sauvegarde)
    echo - Tous les scripts de correction
    echo.
    echo 🌐 DEPLOIEMENT NETLIFY:
    echo URL: https://ediba-inter.netlify.app
    echo Deploy Unique: https://68f8ea9fe7a9a47ae2411066--ediba-inter.netlify.app
    echo.
    echo 📞 CONTACT:
    echo Developpeur: LARE Kandi
    echo Email: kandilare20@gmail.com
    echo Telephone: +228 91 67 61 67
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git trouve
)

echo.
echo [2/6] Verification du statut Git...
git status
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la verification du statut
    pause
    exit /b 1
)

echo.
echo [3/6] Ajout des fichiers modifies...
git add .
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
) else (
    echo ✅ Fichiers ajoutes
)

echo.
echo [4/6] Creation du commit...
git commit -m "CORRECTION ERREUR JAVASCRIPT TERMINEE - Version 1.3.2 - Deploy Netlify reussi"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la creation du commit
    pause
    exit /b 1
) else (
    echo ✅ Commit cree
)

echo.
echo [5/6] Verification du commit...
git log --oneline -1

echo.
echo [6/6] Poussee vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la poussee
    echo Verifiez la configuration du remote origin
    echo.
    echo 🔧 SOLUTION MANUELLE:
    echo 1. Ouvrez GitHub Desktop
    echo 2. Ajoutez tous les fichiers modifies
    echo 3. Creez un commit avec le message:
    echo    "CORRECTION ERREUR JAVASCRIPT TERMINEE - Version 1.3.2"
    echo 4. Poussez vers GitHub
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Poussee reussie
)

echo.
echo ========================================
echo   SYNCHRONISATION TERMINEE
echo ========================================
echo.
echo 🌐 LIENS UTILES:
echo GitHub: https://github.com/KANDI-007/ediba-inter
echo Netlify: https://ediba-inter.netlify.app
echo Deploy Unique: https://68f8ea9fe7a9a47ae2411066--ediba-inter.netlify.app
echo.
echo 📊 STATUT:
echo Version: 1.3.2
echo Derniere mise a jour: 20 Janvier 2025
echo Statut: ✅ Production Ready + JavaScript Corrige
echo.
pause
