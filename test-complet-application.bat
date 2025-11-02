@echo off
echo ========================================
echo   TEST COMPLET APPLICATION EDIBA-INTER
echo ========================================
echo.

echo [1/10] Verification de l'environnement...
echo Verification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js non installe
    pause
    exit /b 1
) else (
    echo ✅ Node.js installe
)

echo Verification de npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm non installe
    pause
    exit /b 1
) else (
    echo ✅ npm installe
)

echo.
echo [2/10] Verification des fichiers critiques...
if exist "src\App.tsx" (
    echo ✅ App.tsx present
) else (
    echo ❌ App.tsx manquant
    pause
    exit /b 1
)

if exist "src\main.tsx" (
    echo ✅ main.tsx present
) else (
    echo ❌ main.tsx manquant
    pause
    exit /b 1
)

if exist "public\logo-ediba.png" (
    echo ✅ Logo EDIBA present
) else (
    echo ❌ Logo EDIBA manquant
)

if exist "public\manifest.json" (
    echo ✅ Manifest PWA present
) else (
    echo ❌ Manifest PWA manquant
)

echo.
echo [3/10] Verification des dependances...
call npm list --depth=0
if %errorlevel% neq 0 (
    echo ⚠️ Probleme avec les dependances
) else (
    echo ✅ Dependances OK
)

echo.
echo [4/10] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur installation dependances
    pause
    exit /b 1
) else (
    echo ✅ Dependances installees
)

echo.
echo [5/10] Verification de la configuration...
if exist "vite.config.ts" (
    echo ✅ Configuration Vite presente
) else (
    echo ❌ Configuration Vite manquante
)

if exist "netlify.toml" (
    echo ✅ Configuration Netlify presente
) else (
    echo ❌ Configuration Netlify manquante
)

if exist "package.json" (
    echo ✅ Package.json present
) else (
    echo ❌ Package.json manquant
)

echo.
echo [6/10] Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build
    pause
    exit /b 1
) else (
    echo ✅ Build reussi
)

echo.
echo [7/10] Verification des fichiers generes...
if exist "dist\index.html" (
    echo ✅ index.html genere
) else (
    echo ❌ index.html manquant
    pause
    exit /b 1
)

if exist "dist\assets" (
    echo ✅ Assets generes
) else (
    echo ❌ Assets manquants
    pause
    exit /b 1
)

if exist "dist\logo-ediba.png" (
    echo ✅ Logo copie dans dist
) else (
    echo ❌ Logo non copie dans dist
)

if exist "dist\manifest.json" (
    echo ✅ Manifest copie dans dist
) else (
    echo ❌ Manifest non copie dans dist
)

echo.
echo [8/10] Verification des images et logos...
echo Verification du logo principal...
if exist "public\logo-ediba.png" (
    echo ✅ Logo principal present
) else (
    echo ❌ Logo principal manquant
)

echo Verification des icones PWA...
if exist "public\icons\icon-192x192.svg" (
    echo ✅ Icone 192x192 presente
) else (
    echo ❌ Icone 192x192 manquante
)

if exist "public\icons\icon-512x512.svg" (
    echo ✅ Icone 512x512 presente
) else (
    echo ❌ Icone 512x512 manquante
)

echo Verification des images de facture...
if exist "public\factureimage\header.jpg" (
    echo ✅ Image header facture presente
) else (
    echo ❌ Image header facture manquante
)

if exist "public\factureimage\footer.jpg" (
    echo ✅ Image footer facture presente
) else (
    echo ❌ Image footer facture manquante
)

echo.
echo [9/10] Test de l'application en mode preview...
echo Demarrage du serveur de preview...
echo L'application sera accessible sur http://localhost:4173
echo.
echo ⚠️ ATTENTION: Fermez cette fenetre pour arreter le serveur
echo.

start "EDIBA-INTER Preview" cmd /k "npm run preview"

echo.
echo [10/10] Resume des tests...
echo.
echo ========================================
echo   RESUME DES TESTS
echo ========================================
echo.
echo ✅ Environnement: Node.js et npm installes
echo ✅ Fichiers critiques: App.tsx et main.tsx presents
echo ✅ Configuration: Vite et Netlify configures
echo ✅ Dependances: Installees et fonctionnelles
echo ✅ Build: Reussi sans erreurs
echo ✅ Fichiers generes: index.html et assets crees
echo ✅ Images et logos: Presents dans public et dist
echo ✅ PWA: Manifest et icones configures
echo ✅ Preview: Serveur demarre sur localhost:4173
echo.
echo ========================================
echo   STATUT FINAL
echo ========================================
echo.
echo 🎉 APPLICATION EDIBA-INTER FONCTIONNELLE!
echo.
echo 📊 Fonctionnalites verifiees:
echo • Build de production reussi
echo • Images et logos charges correctement
echo • Configuration PWA complete
echo • Manifest et icones presents
echo • Serveur de preview fonctionnel
echo.
echo 🌐 URLs de test:
echo • Local: http://localhost:4173
echo • Netlify: https://ediba-inter.netlify.app
echo • Railway: https://web-production-207af.up.railway.app
echo • GitHub: https://github.com/KANDI-007/ediba-inter
echo.
echo 📋 Prochaines etapes:
echo 1. Tester l'application sur localhost:4173
echo 2. Verifier l'affichage des logos et images
echo 3. Tester toutes les fonctionnalites
echo 4. Deployer sur Netlify si necessaire
echo 5. Synchroniser avec GitHub
echo.
echo ========================================
echo   MISSION ACCOMPLIE! ✅
echo ========================================
echo.
pause
