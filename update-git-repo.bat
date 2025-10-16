@echo off
echo ========================================
echo   ACTUALISATION REPOSITORY GIT
echo ========================================
echo.

REM Vérifier si Git est installé
set GIT_PATH=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo ❌ Git n'est pas trouvé. Veuillez redémarrer votre terminal.
    echo    Ou installez Git manuellement depuis: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Vérification du statut Git...
%GIT_PATH% status
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la vérification du statut Git
    pause
    exit /b 1
)
echo.

echo [2/5] Ajout des fichiers modifiés...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)
echo ✓ Fichiers ajoutés au staging
echo.

echo [3/5] Création du commit...
%GIT_PATH% commit -m "Fix: Correction configuration Vite pour déploiement Netlify

- Ajout alias de résolution dans vite.config.ts
- Correction chemin d'import dans index.html (./src/main.tsx)
- Optimisation configuration build Rollup avec input explicite
- Mise à jour netlify.toml avec NPM_FLAGS
- Création script deploy-netlify-fixed.bat

Résout l'erreur: Rollup failed to resolve import /src/main.tsx
Construction locale testée et validée ✓"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création du commit
    pause
    exit /b 1
)
echo ✓ Commit créé avec succès
echo.

echo [4/5] Vérification de la branche...
%GIT_PATH% branch --show-current
echo.

echo [5/5] Push vers le repository distant...
%GIT_PATH% push origin main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push. Tentative avec la branche par défaut...
    %GIT_PATH% push origin HEAD
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors du push vers le repository
        echo    Vérifiez votre configuration Git et vos permissions
        pause
        exit /b 1
    )
)
echo ✓ Push réussi
echo.

echo ========================================
echo   REPOSITORY ACTUALISE AVEC SUCCES
echo ========================================
echo.
echo ✅ Tous les changements ont été poussés vers GitHub
echo ✅ Netlify va automatiquement redéployer votre site
echo ✅ Vérifiez le statut sur netlify.com
echo.
echo 📋 Fichiers mis à jour:
echo    - vite.config.ts (configuration Vite corrigée)
echo    - index.html (chemin d'import corrigé)
echo    - netlify.toml (configuration optimisée)
echo    - deploy-netlify-fixed.bat (nouveau script)
echo.
pause
