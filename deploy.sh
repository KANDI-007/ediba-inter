#!/bin/bash

# 🚀 Script de Déploiement Automatique - EDIBA INTER
# Ce script automatise le processus de déploiement

echo "🚀 Déploiement EDIBA INTER en cours..."
echo "=================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# 1. Nettoyer les dépendances
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules
rm -f package-lock.json

# 2. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 3. Vérifier les erreurs de linting
echo "🔍 Vérification du code..."
npm run lint

# 4. Exécuter les tests (si disponibles)
if [ -f "vitest.config.ts" ]; then
    echo "🧪 Exécution des tests..."
    npm run test
fi

# 5. Construire l'application
echo "🏗️ Construction de l'application..."
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'a pas été créé. Le build a échoué."
    exit 1
fi

echo "✅ Build réussi !"
echo "📁 Dossier dist créé avec les fichiers de production"

# 6. Afficher les informations de déploiement
echo ""
echo "🌐 OPTIONS DE DÉPLOIEMENT :"
echo "=========================="
echo ""
echo "1. VERCEL (Recommandé):"
echo "   - Aller sur https://vercel.com"
echo "   - Connecter votre GitHub"
echo "   - Importer ce projet"
echo "   - Déployer automatiquement"
echo ""
echo "2. NETLIFY:"
echo "   - Aller sur https://netlify.com"
echo "   - Drag & drop le dossier 'dist'"
echo "   - Ou connecter GitHub"
echo ""
echo "3. GITHUB PAGES:"
echo "   - Exécuter: npm run deploy"
echo "   - (Nécessite gh-pages installé)"
echo ""
echo "📊 STATISTIQUES DU BUILD:"
echo "========================"
echo "Taille du dossier dist:"
du -sh dist/
echo ""
echo "Fichiers générés:"
ls -la dist/
echo ""
echo "🎉 Prêt pour le déploiement !"
echo "📖 Consultez GUIDE_DEPLOIEMENT_WEB.md pour plus de détails"
