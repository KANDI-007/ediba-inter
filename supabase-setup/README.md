# 🚀 EDIBA INTER - Backend Supabase

Backend API complet pour l'application EDIBA INTER utilisant Supabase comme base de données et service d'authentification.

## 📋 Fonctionnalités

- ✅ **API REST complète** pour tous les modules
- ✅ **Authentification JWT** sécurisée
- ✅ **Gestion des rôles** et permissions
- ✅ **Base de données PostgreSQL** avec RLS
- ✅ **Chat temps réel** avec Socket.IO
- ✅ **Upload de fichiers** intégré
- ✅ **Rate limiting** et sécurité
- ✅ **Migration des données** depuis LocalStorage

## 🏗️ Architecture

```
Frontend (React) → Vercel
       ↓ HTTPS
Backend (Node.js + Express) → Supabase (PostgreSQL + Auth)
       ↓ WebSockets
Temps Réel (Chat + Présence)
```

## 🚀 Installation et Configuration

### 1. Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Supabase CLI

### 2. Installation

```bash
# Cloner le projet
git clone <repository-url>
cd supabase-setup

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp env.example .env
# Éditer .env avec vos clés Supabase
```

### 3. Configuration Supabase

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref YOUR_PROJECT_REF

# Appliquer les migrations
supabase db push
```

### 4. Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 📊 Base de Données

### Tables Principales

- **users** - Utilisateurs et authentification
- **clients** - Base de données clients
- **suppliers** - Fournisseurs
- **articles** - Catalogue d'articles
- **article_categories** - Catégories d'articles
- **documents** - Factures, devis, BL
- **line_items** - Lignes de documents
- **payments** - Paiements
- **discharges** - Décharges
- **conversations** - Conversations de chat
- **messages** - Messages de chat
- **activities** - Journal d'activité
- **notifications** - Notifications

### Sécurité (RLS)

Toutes les tables sont protégées par Row Level Security (RLS) avec des politiques granulaires basées sur les rôles utilisateur.

## 🔐 Authentification

### Rôles Utilisateur

- **admin** - Accès complet
- **comptable** - Gestion comptable et rapports
- **commercial** - Gestion commerciale
- **lecture** - Consultation uniquement

### Endpoints d'Authentification

```bash
POST /api/auth/login          # Connexion
POST /api/auth/logout         # Déconnexion
GET  /api/auth/verify         # Vérification token
GET  /api/auth/profile        # Profil utilisateur
PUT  /api/auth/profile        # Mise à jour profil
```

## 📡 API Endpoints

### Clients
```bash
GET    /api/clients           # Liste des clients
GET    /api/clients/:id       # Détails client
POST   /api/clients           # Créer client
PUT    /api/clients/:id       # Modifier client
DELETE /api/clients/:id       # Supprimer client
GET    /api/clients/stats/overview    # Statistiques
GET    /api/clients/stats/top-clients # Top clients
```

### Articles
```bash
GET    /api/articles          # Liste des articles
GET    /api/articles/:id      # Détails article
POST   /api/articles          # Créer article
PUT    /api/articles/:id      # Modifier article
DELETE /api/articles/:id      # Supprimer article
```

### Documents
```bash
GET    /api/documents         # Liste des documents
GET    /api/documents/:id     # Détails document
POST   /api/documents         # Créer document
PUT    /api/documents/:id     # Modifier document
DELETE /api/documents/:id     # Supprimer document
```

### Chat
```bash
GET    /api/chat/conversations        # Conversations
POST   /api/chat/conversations        # Créer conversation
GET    /api/chat/messages/:conversationId  # Messages
POST   /api/chat/messages             # Envoyer message
```

## 🔄 Migration des Données

### Export depuis l'Application

1. Dans l'application, allez dans Paramètres > Sauvegarde
2. Exportez les données au format JSON
3. Sauvegardez le fichier `exported-data.json`

### Migration vers Supabase

```bash
# Exécuter le script de migration
node scripts/migrate-data.js exported-data.json
```

Le script migre automatiquement :
- Utilisateurs
- Clients
- Articles et catégories
- Documents et lignes
- Conversations de chat

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
vercel

# Configuration des variables d'environnement
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Railway

```bash
# Installation Railway CLI
npm install -g @railway/cli

# Déploiement
railway up

# Configuration des variables
railway variables set SUPABASE_URL=your-url
railway variables set SUPABASE_ANON_KEY=your-key
```

### Docker

```bash
# Construction de l'image
docker build -t ediba-inter-backend .

# Exécution
docker run -p 3000:3000 --env-file .env ediba-inter-backend
```

## 🔧 Configuration

### Variables d'Environnement

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API
PORT=3000
NODE_ENV=production
JWT_SECRET=your-jwt-secret

# CORS
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuration Supabase

1. **Créer un projet** sur [supabase.com](https://supabase.com)
2. **Récupérer les clés** dans Settings > API
3. **Configurer l'authentification** dans Authentication > Settings
4. **Appliquer les migrations** avec `supabase db push`

## 📊 Monitoring

### Logs

Les logs sont automatiquement générés pour :
- Requêtes API
- Erreurs d'authentification
- Erreurs de base de données
- Activités utilisateur

### Métriques

- Temps de réponse des API
- Taux d'erreur
- Utilisateurs actifs
- Requêtes par minute

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Tests de charge
npm run test:load
```

## 📚 Documentation API

Une fois le serveur démarré, la documentation API est disponible sur :
- **Swagger UI** : `http://localhost:3000/api-docs`
- **OpenAPI** : `http://localhost:3000/api-docs.json`

## 🆘 Dépannage

### Problèmes Courants

1. **Erreur de connexion Supabase**
   - Vérifier les variables d'environnement
   - Vérifier la connectivité réseau

2. **Erreur d'authentification**
   - Vérifier la configuration JWT
   - Vérifier les politiques RLS

3. **Erreur de migration**
   - Vérifier le format des données exportées
   - Vérifier les contraintes de base de données

### Support

- **Documentation** : [supabase.com/docs](https://supabase.com/docs)
- **Communauté** : [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Support** : [supabase.com/support](https://supabase.com/support)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🚀 Votre backend EDIBA INTER est prêt pour la production !**
