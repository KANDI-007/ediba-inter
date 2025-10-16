@echo off
echo ========================================
echo   CREATION REPOSITORY GITHUB EDIBA-INTER
echo ========================================
echo.

REM Vérifier si Git est installé
set GIT_PATH=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo ❌ Git n'est pas trouvé. Veuillez installer Git d'abord.
    pause
    exit /b 1
)

echo [1/4] Vérification du statut Git...
%GIT_PATH% status
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la vérification du statut Git
    pause
    exit /b 1
)
echo ✓ Repository Git local vérifié
echo.

echo [2/4] Configuration du remote GitHub...
echo Veuillez créer un repository sur GitHub.com avec le nom: ediba-inter
echo Puis copiez l'URL HTTPS de votre repository (ex: https://github.com/votre-username/ediba-inter.git)
echo.
set /p GITHUB_URL="URL de votre repository GitHub: "

if "%GITHUB_URL%"=="" (
    echo ❌ URL GitHub requise
    pause
    exit /b 1
)

%GIT_PATH% remote add origin "%GITHUB_URL%"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout du remote
    echo    Vérifiez que l'URL est correcte
    pause
    exit /b 1
)
echo ✓ Remote GitHub configuré
echo.

echo [3/4] Renommage de la branche en 'main'...
%GIT_PATH% branch -M main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du renommage de la branche
    pause
    exit /b 1
)
echo ✓ Branche renommée en 'main'
echo.

echo [4/4] Push initial vers GitHub...
%GIT_PATH% push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push vers GitHub
    echo    Vérifiez vos permissions et l'URL du repository
    echo    Vous devrez peut-être vous authentifier
    pause
    exit /b 1
)
echo ✓ Push réussi vers GitHub
echo.

echo ========================================
echo   REPOSITORY GITHUB CONFIGURE AVEC SUCCES
echo ========================================
echo.
echo ✅ Repository connecté à GitHub
echo ✅ Code poussé vers GitHub
echo ✅ Prêt pour le déploiement Netlify
echo.
echo 🔗 Votre repository est disponible sur:
echo    %GITHUB_URL%
echo.
echo 📋 Prochaines étapes:
echo    1. Allez sur https://app.netlify.com
echo    2. Cliquez "New site from Git"
echo    3. Sélectionnez votre repository ediba-inter
echo    4. Configurez:
echo       - Build command: npm run build
echo       - Publish directory: dist
echo    5. Cliquez "Deploy site"
echo.
pause
