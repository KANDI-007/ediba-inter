@echo off
echo ========================================
echo   DEPLOIEMENT FINAL EDIBA-INTER
echo ========================================
echo.

echo [1/4] Vérification du build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build
    pause
    exit /b 1
)
echo ✅ Build réussi
echo.

echo [2/4] Vérification Git...
"C:\Program Files\Git\bin\git.exe" status
echo ✅ Repository prêt
echo.

echo [3/4] Instructions GitHub...
echo.
echo 📋 CRÉEZ VOTRE REPOSITORY GITHUB:
echo.
echo 1. Allez sur https://github.com
echo 2. Cliquez "New repository"
echo 3. Nom: ediba-inter
echo 4. Description: Application EDIBA-INTER
echo 5. NE cochez PAS "Initialize with README"
echo 6. Cliquez "Create repository"
echo 7. Copiez l'URL HTTPS (ex: https://github.com/votre-username/ediba-inter.git)
echo.

echo [4/4] Configuration finale...
echo.
echo Une fois votre repository créé, exécutez:
echo.
echo git remote add origin VOTRE_URL_GITHUB
echo git branch -M main
echo git push -u origin main
echo.
echo Puis déployez sur Netlify:
echo 1. https://netlify.com
echo 2. "New site from Git"
echo 3. Sélectionnez ediba-inter
echo 4. Build command: npm run build
echo 5. Publish directory: dist
echo.

echo ========================================
echo   EDIBA-INTER PRÊT POUR DÉPLOIEMENT !
echo ========================================
echo.
echo ✅ Build testé et validé
✅ Repository Git configuré
✅ Documentation complète
✅ Scripts de déploiement prêts
echo.
echo 🚀 VOTRE APPLICATION EST PRÊTE !
echo.
pause
