@echo off
echo ========================================
echo   CONFIGURATION GITHUB REMOTE
echo ========================================
echo.

REM Vérifier si Git est installé
set GIT_PATH=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo ❌ Git n'est pas trouvé. Veuillez d'abord exécuter init-git-repo.bat
    pause
    exit /b 1
)

echo Veuillez entrer l'URL de votre repository GitHub:
echo (ex: https://github.com/username/ediba-inter.git)
set /p GITHUB_URL="URL GitHub: "

if "%GITHUB_URL%"=="" (
    echo ❌ URL GitHub requise
    pause
    exit /b 1
)

echo.
echo [1/4] Ajout du remote GitHub...
%GIT_PATH% remote add origin "%GITHUB_URL%"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout du remote
    echo    Vérifiez que l'URL est correcte et que le repository existe
    pause
    exit /b 1
)
echo ✓ Remote GitHub ajouté
echo.

echo [2/4] Renommage de la branche en 'main'...
%GIT_PATH% branch -M main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du renommage de la branche
    pause
    exit /b 1
)
echo ✓ Branche renommée en 'main'
echo.

echo [3/4] Push initial vers GitHub...
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

echo [4/4] Vérification de la configuration...
%GIT_PATH% remote -v
echo.

echo ========================================
echo   CONFIGURATION GITHUB TERMINEE
echo ========================================
echo.
echo ✅ Repository connecté à GitHub
echo ✅ Code poussé vers GitHub
echo ✅ Prêt pour le déploiement Netlify
echo.
echo 🔗 Votre repository est disponible sur:
echo    %GITHUB_URL%
echo.
echo 📋 Pour déployer sur Netlify:
echo    1. Connectez votre repository GitHub à Netlify
echo    2. Configurez le build command: npm run build
echo    3. Configurez le publish directory: dist
echo    4. Déployez automatiquement
echo.
pause
