@echo off
echo ========================================
echo DÉPLOIEMENT NETLIFY - GUIDE AUTOMATIQUE
echo ========================================

echo.
echo [1/5] Vérification du build local...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Le build local a échoué!
    pause
    exit /b 1
)

echo.
echo [2/5] Vérification des fichiers dans dist...
dir dist /b
echo.
echo Images dans dist:
dir dist\*.png dist\*.jpg dist\*.svg /b

echo.
echo [3/5] Vérification des chemins dans le HTML...
findstr /C:"src=\"./" dist\index.html
if %errorlevel% neq 0 (
    echo ATTENTION: Aucun chemin relatif trouvé dans index.html
) else (
    echo ✅ Chemins relatifs détectés dans index.html
)

echo.
echo [4/5] Synchronisation avec GitHub...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Préparation déploiement Netlify - Build final"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo [5/5] Instructions pour Netlify...
echo.
echo ========================================
echo ÉTAPES POUR NETLIFY:
echo ========================================
echo.
echo 1. Allez sur https://app.netlify.com
echo 2. Cliquez sur "New site from Git"
echo 3. Sélectionnez "GitHub"
echo 4. Choisissez "KANDI-007/ediba-inter"
echo 5. Configurez:
echo    - Build command: npm run build
echo    - Publish directory: dist
echo 6. Cliquez sur "Deploy site"
echo.
echo ========================================
echo PRÊT POUR NETLIFY!
echo ========================================
echo.
echo Votre projet est maintenant synchronisé avec GitHub
echo et prêt pour le déploiement Netlify.
echo.
echo Testez d'abord en local: http://localhost:4173/
echo.
pause
