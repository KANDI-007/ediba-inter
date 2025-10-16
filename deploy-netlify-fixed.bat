@echo off
echo ========================================
echo   DEPLOIEMENT NETLIFY - VERSION CORRIGEE
echo ========================================
echo.

echo [1/6] Nettoyage des fichiers de construction...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✓ Nettoyage terminé
echo.

echo [2/6] Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)
echo ✓ Dépendances installées
echo.

echo [3/6] Test de construction local...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la construction locale
    pause
    exit /b 1
)
echo ✓ Construction locale réussie
echo.

echo [4/6] Vérification des fichiers de sortie...
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

echo [5/6] Configuration Git pour Netlify...
git add .
git commit -m "Fix: Correction configuration Vite pour déploiement Netlify

- Ajout alias de résolution dans vite.config.ts
- Correction chemin d'import dans index.html
- Optimisation configuration build Rollup
- Mise à jour netlify.toml avec NPM_FLAGS

Résout l'erreur: Rollup failed to resolve import /src/main.tsx"
echo ✓ Commit Git créé
echo.

echo [6/6] Push vers le repository...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push Git
    pause
    exit /b 1
)
echo ✓ Push réussi
echo.

echo ========================================
echo   DEPLOIEMENT NETLIFY TERMINE
echo ========================================
echo.
echo ✅ Le projet a été poussé vers GitHub
echo ✅ Netlify va automatiquement redéployer
echo ✅ Vérifiez le statut sur netlify.com
echo.
echo 🔗 Votre site sera disponible sur:
echo    https://votre-site.netlify.app
echo.
pause
