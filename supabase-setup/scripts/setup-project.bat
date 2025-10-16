@echo off
echo 🚀 Configuration du projet EDIBA INTER avec Supabase...

REM Vérifier que Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord.
    pause
    exit /b 1
)

REM Vérifier que npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé. Veuillez installer npm d'abord.
    pause
    exit /b 1
)

REM Vérifier que Supabase CLI est installé
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installation de Supabase CLI...
    npm install -g supabase
)

REM Créer le fichier .env s'il n'existe pas
if not exist .env (
    echo 📝 Création du fichier .env...
    copy env.example .env
    echo ⚠️  Veuillez configurer les variables d'environnement dans le fichier .env
)

REM Installer les dépendances
echo 📦 Installation des dépendances...
npm install

REM Construire le projet TypeScript
echo 🔨 Construction du projet TypeScript...
npm run build

REM Initialiser Supabase (si pas déjà fait)
if not exist "supabase\.git" (
    echo 🔧 Initialisation de Supabase...
    supabase init
)

REM Lier le projet Supabase (remplacer par votre URL de projet)
echo 🔗 Liaison du projet Supabase...
echo ⚠️  Veuillez exécuter: supabase link --project-ref YOUR_PROJECT_REF

REM Appliquer les migrations
echo 📊 Application des migrations...
supabase db push

REM Insérer les données de test
echo 🌱 Insertion des données de test...
npm run db:seed

echo ✅ Configuration terminée !
echo.
echo 📋 Prochaines étapes :
echo 1. Configurez vos variables d'environnement dans .env
echo 2. Liez votre projet Supabase : supabase link --project-ref YOUR_PROJECT_REF
echo 3. Démarrez le serveur : npm run dev
echo 4. Testez l'API : http://localhost:3000/health
echo.
echo 🔗 Documentation Supabase : https://supabase.com/docs
echo 📚 Documentation API : http://localhost:3000/api
pause
