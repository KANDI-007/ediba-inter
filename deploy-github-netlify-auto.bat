@echo off
echo ========================================
echo DEPLOIEMENT AUTOMATIQUE GITHUB - NETLIFY
echo ========================================
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Git n'est pas installe sur ce systeme.
    echo Veuillez installer Git depuis https://git-scm.com/
    pause
    exit /b 1
)

REM Vérifier si on est dans un repo Git
if not exist .git (
    echo [ERREUR] Ce dossier n'est pas un depot Git.
    echo Initialisation du depot Git...
    git init
    git branch -M main
)

REM Vérifier la remote GitHub
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Configuration de la remote GitHub...
    echo.
    echo Veuillez entrer l'URL de votre depot GitHub:
    echo Exemple: https://github.com/KANDI-007/ediba-inter.git
    set /p GITHUB_URL="URL GitHub: "
    if "!GITHUB_URL!"=="" (
        echo [ERREUR] URL GitHub requise.
        pause
        exit /b 1
    )
    git remote add origin "!GITHUB_URL!"
)

REM Obtenir l'URL actuelle
for /f "tokens=*" %%i in ('git remote get-url origin') do set GITHUB_URL=%%i
echo [INFO] Depot GitHub: %GITHUB_URL%
echo.

REM Vérifier l'état du repo
git status --porcelain >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Verification des modifications...
    git status --short
    echo.
)

REM Construire l'application
echo [1/4] Construction de l'application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Echec de la construction.
    pause
    exit /b 1
)
echo ✅ Construction reussie!
echo.

REM Ajouter tous les fichiers
echo [2/4] Ajout des fichiers au depot...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Echec de l'ajout des fichiers.
    pause
    exit /b 1
)
echo ✅ Fichiers ajoutes!
echo.

REM Vérifier s'il y a des changements à commiter
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Aucun changement a commiter.
) else (
    echo [3/4] Creation du commit...
    set /p COMMIT_MSG="Message de commit (Enter pour 'Update app'): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update app
    git commit -m "!COMMIT_MSG!"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec du commit.
        pause
        exit /b 1
    )
    echo ✅ Commit cree!
    echo.
)

REM Push vers GitHub
echo [4/4] Envoi vers GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] Echec du push. Tentative avec 'master'...
    git push origin master
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec du push vers GitHub.
        echo.
        echo Verifiez:
        echo 1. Vos identifiants Git sont configures
        echo 2. Vous avez les permissions d'ecriture sur le depot
        echo 3. La branche existe sur GitHub
        pause
        exit /b 1
    )
)
echo ✅ Push reussi vers GitHub!
echo.

echo ========================================
echo DEPLOIEMENT TERMINE
echo ========================================
echo.
echo ✅ Le code a ete pousse vers GitHub
echo.
echo Netlify devrait deployer automatiquement si:
echo 1. Le depot GitHub est connecte a Netlify
echo 2. Le workflow GitHub Actions est configure
echo.
echo Pour verifier le deploiement:
echo - Netlify: https://app.netlify.com/projects/ediba-inter/
echo - GitHub: %GITHUB_URL%
echo.
pause

