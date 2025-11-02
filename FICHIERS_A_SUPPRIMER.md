# 📋 Liste des Fichiers à Supprimer - Nettoyage Projet EDIBA INTER

## 🗑️ Fichiers à Supprimer

### 📄 Documentation Obsolète (à consolider)
- Tous les fichiers `CORRECTION_*.md` (garder uniquement un résumé)
- Tous les fichiers `MISSION_*.md` (informations dans le cahier des charges)
- Tous les fichiers `DEPLOIEMENT_*.md` (garder uniquement GUIDE_DEPLOIEMENT.md)
- Tous les fichiers `TEST_*.md` (tests intégrés dans le code)
- Tous les fichiers `SOLUTION_*.md` (solutions intégrées)
- Tous les fichiers `VERIFICATION_*.md` (informations dans README)
- Tous les fichiers `SYNCHRONISATION_*.md` (fonctionnalités intégrées)
- Doublons dans `github-upload/` (dossier entier à supprimer)

### 🔧 Scripts Redondants (.bat)
- `test-*.bat` (garder uniquement un script de test principal si nécessaire)
- `deploy-*.bat` multiples (garder uniquement `deploy.bat` principal)
- `sync-github-*.bat` (garder uniquement un script de synchronisation)
- `fix-images-*.bat` (corrections appliquées)
- `correction-*.bat` (corrections appliquées)

### 📝 Fichiers de Test
- `test.html`
- `test-simple.html`
- `data-export-example.json`

### 🗂️ Fichiers Inutiles
- `NCHO`
- `Lettre`
- `force-rebuild-netlify.txt`

### 🔄 Scripts PowerShell Redondants (.ps1)
- Scripts de création d'icônes multiples (garder un seul)
- Scripts de synchronisation multiples (garder un seul)

### 📦 Fichiers Package Redondants
- `package-railway.json`
- `package-websocket.json`
- `websocket-package.json`
- `websocket-production-package.json`

### 🔧 Serveurs WebSocket Redondants
- `websocket-server-simple.cjs`
- `websocket-server-simple.js`
- `websocket-server.js`
- Garder uniquement: `websocket-server-production.cjs`

### 📄 Backend Redondant
- `simple-backend-server.js` (garder `.cjs`)
- Fichiers dans `github-upload/src/server/` (doublons)

## ✅ Fichiers à CONSERVER

### 📚 Documentation Essentielle
- `README.md` (à mettre à jour)
- `CAHIER_DES_CHARGES_COMPLET.md` (à actualiser)
- `CHANGELOG.md` (à maintenir)
- `ETAT_PROJET.md` (résumé actuel)

### ⚙️ Configuration
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tailwind.config.js`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `eslint.config.js`
- `postcss.config.js`
- `vitest.config.ts`
- `netlify.toml`
- `vercel.json`
- `docker-compose.yml`
- `Dockerfile`, `Dockerfile.frontend`
- `nginx.conf`
- `railway.json`
- `Procfile`
- `env.example`, `env.local.example`

### 🔧 Scripts Essentiels
- `websocket-server-production.cjs`
- `simple-backend-server.cjs`
- Un script de déploiement principal (à créer)

### 📁 Dossiers Essentiels
- `src/` (code source)
- `public/` (assets)
- `dist/` (build)
- `.git/` (versioning)
- `node_modules/` (dépendances)
- `scripts/` (si contient des scripts utiles)

### 📖 Documentation Utile
- `ARCHITECTURE_PROJET.md` (si utile)
- `CONFIGURATION_HEBERGEMENT.md` (si utile)

