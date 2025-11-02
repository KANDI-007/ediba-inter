@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 🚀 DEPLOIEMENT AUTOMATIQUE GITHUB - NETLIFY
echo ========================================
echo.

REM Vérifier Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [❌ ERREUR] Git n'est pas installé.
    pause
    exit /b 1
)

REM Vérifier si on est dans un repo Git
if not exist .git (
    echo [⚠️] Initialisation du dépôt Git...
    git init
    git branch -M main
)

REM Vérifier la remote GitHub
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [⚠️] Configuration de la remote GitHub...
    set /p GITHUB_URL="URL GitHub (ex: https://github.com/KANDI-007/ediba-inter.git): "
    if "!GITHUB_URL!"=="" (
        set GITHUB_URL=https://github.com/KANDI-007/ediba-inter.git
    )
    git remote add origin "!GITHUB_URL!"
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set GITHUB_URL=%%i
echo [📦] Dépôt: %GITHUB_URL%
echo.

REM Build
echo [1/4] 🔨 Construction de l'application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [❌] Échec du build
    pause
    exit /b 1
)
echo ✅ Build réussi!
echo.

REM Git add
echo [2/4] 📥 Ajout des fichiers...
git add .
echo ✅ Fichiers ajoutés!
echo.

REM Commit
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo [ℹ️] Aucun changement à commiter.
) else (
    echo [3/4] 💾 Création du commit...
    set /p COMMIT_MSG="Message (Enter pour 'Update app'): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update app
    git commit -m "!COMMIT_MSG!"
    if %ERRORLEVEL% NEQ 0 (
        echo [❌] Échec du commit
        pause
        exit /b 1
    )
    echo ✅ Commit créé!
    echo.
)

REM Push
echo [4/4] 🚀 Envoi vers GitHub...
git push origin main 2>nul
if %ERRORLEVEL% NEQ 0 (
    git push origin master 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [❌] Échec du push. Vérifiez vos permissions Git.
        pause
        exit /b 1
    )
)
echo ✅ Push réussi!
echo.

echo ========================================
echo ✅ DEPLOIEMENT TERMINE
echo ========================================
echo.
echo 🌐 Netlify déploiera automatiquement:
echo    https://app.netlify.com/projects/ediba-inter/
echo.
echo 📦 Dépôt GitHub:
echo    %GITHUB_URL%
echo.
pause

