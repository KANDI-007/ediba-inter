#!/bin/bash

# Script de configuration du projet Supabase pour EDIBA INTER
echo "🚀 Configuration du projet EDIBA INTER avec Supabase..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "📦 Installation de Supabase CLI..."
    npm install -g supabase
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "⚠️  Veuillez configurer les variables d'environnement dans le fichier .env"
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Construire le projet TypeScript
echo "🔨 Construction du projet TypeScript..."
npm run build

# Initialiser Supabase (si pas déjà fait)
if [ ! -d "supabase/.git" ]; then
    echo "🔧 Initialisation de Supabase..."
    supabase init
fi

# Lier le projet Supabase (remplacer par votre URL de projet)
echo "🔗 Liaison du projet Supabase..."
echo "⚠️  Veuillez exécuter: supabase link --project-ref YOUR_PROJECT_REF"

# Appliquer les migrations
echo "📊 Application des migrations..."
supabase db push

# Insérer les données de test
echo "🌱 Insertion des données de test..."
npm run db:seed

echo "✅ Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans .env"
echo "2. Liez votre projet Supabase : supabase link --project-ref YOUR_PROJECT_REF"
echo "3. Démarrez le serveur : npm run dev"
echo "4. Testez l'API : http://localhost:3000/health"
echo ""
echo "🔗 Documentation Supabase : https://supabase.com/docs"
echo "📚 Documentation API : http://localhost:3000/api"
