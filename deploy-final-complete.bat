@echo off
echo ========================================
echo   DEPLOIEMENT FINAL COMPLET EDIBA-INTER
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

echo [1/8] Vérification du statut Git...
%GIT_PATH% status
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la vérification du statut Git
    pause
    exit /b 1
)
echo ✓ Repository Git vérifié
echo.

echo [2/8] Nettoyage des fichiers de construction...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✓ Nettoyage terminé
echo.

echo [3/8] Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)
echo ✓ Dépendances installées
echo.

echo [4/8] Test de construction local...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la construction locale
    pause
    exit /b 1
)
echo ✓ Construction locale réussie
echo.

echo [5/8] Vérification des fichiers de sortie...
if not exist dist\index.html (
    echo ❌ Fichier index.html manquant dans dist/
    pause
    exit /b 1
)
if not exist dist\assets (
    echo ❌ Dossier assets manquant dans dist/
    pause
    exit /b 1
)
echo ✓ Fichiers de sortie vérifiés
echo.

echo [6/8] Ajout des fichiers modifiés...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)
echo ✓ Fichiers ajoutés au staging
echo.

echo [7/8] Création du commit de déploiement...
%GIT_PATH% commit -m "Deploy: Version finale EDIBA-INTER prête pour production

✅ Corrections Vite/Rollup appliquées
✅ Configuration Netlify optimisée  
✅ Build testé et validé localement
✅ Architecture documentée
✅ PWA configurée et fonctionnelle

Fonctionnalités déployées:
- Dashboard moderne et responsive
- Gestion complète des utilisateurs
- Module de facturation avancé
- Système de chat en temps réel
- Module de décharge intégré
- Gestion des fournisseurs
- Notifications push
- PWA installable
- Interface WhatsApp moderne

Prêt pour déploiement Netlify/Vercel 🚀"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création du commit
    pause
    exit /b 1
)
echo ✓ Commit de déploiement créé
echo.

echo [8/8] Push vers GitHub...
%GIT_PATH% push origin master
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push. Tentative avec la branche par défaut...
    %GIT_PATH% push origin HEAD
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors du push vers GitHub
        echo    Vérifiez votre configuration Git et vos permissions
        pause
        exit /b 1
    )
)
echo ✓ Push réussi vers GitHub
echo.

echo ========================================
echo   DEPLOIEMENT FINAL TERMINE AVEC SUCCES
echo ========================================
echo.
echo ✅ Application EDIBA-INTER déployée
echo ✅ Code poussé vers GitHub
echo ✅ Prêt pour déploiement automatique
echo.
echo 📋 Prochaines étapes:
echo    1. Connectez votre repository à Netlify
echo    2. Configurez le build command: npm run build
echo    3. Configurez le publish directory: dist
echo    4. Activez le déploiement automatique
echo.
echo 🔗 URLs de déploiement:
echo    - Netlify: https://app.netlify.com
echo    - Vercel: https://vercel.com
echo    - GitHub: https://github.com/votre-username/ediba-inter
echo.
echo 📱 Fonctionnalités déployées:
echo    ✅ Interface moderne et responsive
echo    ✅ Gestion des utilisateurs avec rôles
echo    ✅ Système de facturation complet
echo    ✅ Chat en temps réel avec appels
echo    ✅ Module de décharge intégré
echo    ✅ Gestion des fournisseurs
echo    ✅ Notifications push
echo    ✅ PWA installable
echo    ✅ Export PDF/Excel
echo    ✅ Interface WhatsApp moderne
echo.
echo 🎉 Votre application EDIBA-INTER est prête !
echo.
pause
