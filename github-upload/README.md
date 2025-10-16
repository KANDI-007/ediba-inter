# EDIBA-INTER - Application de Facturation

## 🎯 Vue d'ensemble

Application de gestion de facturation complète développée pour **EDIBA INTER SARL U**, conforme au cahier des charges fourni. L'application offre une solution moderne, robuste et sécurisée pour la gestion commerciale et comptable avec des fonctionnalités avancées de monitoring, sécurité et performance.

## ✨ Fonctionnalités Implémentées

### 📋 Modules Principaux

#### 1. **Module Facturation** ✅
- Création de devis (Factures Proforma)
- Gestion des bons de livraison (BL)
- Factures d'acompte et de solde
- Numérotation automatique
- Export PDF et impression
- Suivi des statuts (Validé, Non validé, En attente)
- Gestion des paiements (Payée, Partiellement payée, Impayée)

#### 2. **Module Clients** ✅
- Gestion complète des clients
- Informations détaillées (NIF, RCCM, adresse, etc.)
- Statistiques par client (CA, factures, encaissements)
- Top 5 clients par chiffre d'affaires
- Filtres et recherche avancée
- Gestion des remises et délais de paiement

#### 3. **Module Fournisseurs** ✅
- Gestion des fournisseurs
- Suivi des factures fournisseurs
- Statistiques et rapports
- Gestion des paiements

#### 4. **Module Décharges** ✅
- Création et gestion des décharges
- Signature électronique intégrée
- Export PDF avec signature
- Suivi des prestataires

#### 5. **Module Rapports** ✅
- Rapports de facturation
- Statistiques par période
- Export en PDF et Excel
- Graphiques et visualisations

### 🔐 Système de Sécurité

#### **Gestion des Rôles et Permissions** ✅
- **Admin** : Accès complet à toutes les fonctionnalités
- **Comptable** : Gestion des rapports, paiements et exercices fiscaux
- **Commercial** : Création et gestion des factures, clients, fournisseurs
- **Lecture** : Consultation uniquement

#### **Utilisateurs Configurés**
- **Alayi** (Admin) - Mme ALAYI Abide
- **Esso** (Comptable) - M. ESSO Comptable
- **Gloria** (Commercial) - Mme GLORIA Commerciale
- **Paul** (Commercial) - M. PAUL Commercial
- **Gym** (Lecture) - M. GYM Lecteur
- **Sam** (Comptable) - M. SAM Comptable

### 📊 Fonctionnalités Avancées

#### **Journal d'Activité** ✅
- Traçabilité complète des actions utilisateurs
- Filtres par utilisateur, module, action, période
- Export CSV et JSON
- Nettoyage automatique des anciennes activités

#### **Système de Notifications** ✅
- Notifications en temps réel
- Rappels de paiement
- Alertes de factures en retard
- Panel de notifications avec gestion

#### **Gestion Multi-Exercices Fiscaux** ✅
- Création et gestion d'exercices fiscaux
- Clôture et verrouillage des exercices
- Statistiques par exercice
- Changement d'exercice courant

#### **Système de Sauvegardes** ✅
- Sauvegarde complète des données
- Restauration de sauvegardes
- Import/Export de sauvegardes
- Sauvegarde automatique programmée
- Gestion de l'espace de stockage

#### **Signature Électronique** ✅
- Pad de signature intégré
- Sauvegarde des signatures
- Export des signatures
- Intégration dans les décharges

### 📱 Application Progressive (PWA)

#### **Fonctionnalités PWA** ✅
- Installation sur appareils mobiles et desktop
- Mode hors ligne avec service worker
- Manifeste PWA complet
- Notifications push
- Synchronisation en arrière-plan

### 🔒 Sécurité Avancée

#### **Chiffrement des Données** ✅
- Chiffrement AES-GCM des données sensibles
- Gestion sécurisée des sessions utilisateur
- Validation et sanitisation des entrées
- Détection d'activités suspectes

#### **Monitoring et Logs** ✅
- Système de logging avancé avec niveaux
- Monitoring en temps réel des performances
- Alertes automatiques et seuils de sécurité
- Tableau de bord de monitoring complet

#### **Tests et Qualité** ✅
- Tests unitaires avec Vitest et Testing Library
- Tests d'intégration pour tous les composants
- Couverture de code complète
- Tests de sécurité et performance

## 🛠️ Technologies Utilisées

### **Frontend**
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Lucide React** pour les icônes

### **Gestion d'État**
- **Context API** pour la gestion d'état globale
- **LocalStorage** pour la persistance des données
- **Hooks personnalisés** pour la logique métier

### **Fonctionnalités PWA**
- **Service Worker** pour la mise en cache
- **Web App Manifest** pour l'installation
- **Push Notifications** API

### **Génération de Documents**
- **jsPDF** pour la génération de PDF
- **html2canvas** pour la capture d'écran

### **Tests et Qualité**
- **Vitest** pour les tests unitaires
- **Testing Library** pour les tests React
- **jsdom** pour l'environnement de test
- **Coverage** pour la couverture de code

### **Sécurité et Performance**
- **Chiffrement AES-GCM** pour les données sensibles
- **Cache intelligent** avec stratégies LRU/LFU/FIFO
- **Lazy loading** des composants et données
- **Monitoring** en temps réel des performances

### **Déploiement et Production**
- **Docker** pour la containerisation
- **Nginx** pour le serveur web
- **Variables d'environnement** pour la configuration
- **CI/CD** avec GitHub Actions

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd EDIBA-INTER/project

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

### Tests
```bash
# Lancer les tests en mode watch
npm run test

# Interface utilisateur des tests
npm run test:ui

# Tests avec couverture de code
npm run test:coverage

# Tests une seule fois
npm run test:run
```

### Déploiement avec Docker
```bash
# Construire l'image Docker
docker build -t ediba-inter .

# Démarrer avec Docker Compose
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── modules/           # Modules principaux
│   │   ├── InvoiceModule.tsx
│   │   ├── ClientsModule.tsx
│   │   ├── SuppliersModule.tsx
│   │   ├── ReportsModule.tsx
│   │   ├── DischargeModule.tsx
│   │   ├── FiscalYearModule.tsx
│   │   ├── BackupModule.tsx
│   │   └── ActivityLogModule.tsx
│   ├── Layout.tsx         # Layout principal
│   ├── Dashboard.tsx      # Tableau de bord
│   ├── LoginPage.tsx      # Page de connexion
│   ├── SplashScreen.tsx   # Écran de démarrage
│   ├── SignaturePad.tsx   # Composant de signature
│   ├── NotificationToast.tsx
│   ├── NotificationPanel.tsx
│   ├── PWAInstallPrompt.tsx
│   └── MonitoringDashboard.tsx # Tableau de bord monitoring
├── contexts/              # Contextes React
│   ├── AuthContext.tsx    # Authentification
│   ├── DataContext.tsx    # Données
│   ├── ActivityContext.tsx # Journal d'activité
│   ├── NotificationContext.tsx # Notifications
│   ├── FiscalYearContext.tsx # Exercices fiscaux
│   └── BackupContext.tsx  # Sauvegardes
├── hooks/
│   ├── usePWA.ts         # Hook PWA
│   └── useLazyLoading.ts # Hook lazy loading
├── utils/                 # Utilitaires
│   ├── logger.ts         # Système de logging
│   ├── encryption.ts     # Chiffrement des données
│   ├── security.ts       # Sécurité et validation
│   ├── performance.ts    # Monitoring des performances
│   ├── cache.ts          # Système de cache
│   ├── monitoring.ts     # Monitoring avancé
│   ├── PrintUtils.ts     # Utilitaires d'impression
│   └── PDFGenerator.ts   # Générateur PDF
├── config/
│   └── environment.ts     # Configuration environnement
├── test/                 # Tests
│   ├── setup.ts         # Configuration des tests
│   ├── utils/           # Utilitaires de test
│   └── components/      # Tests des composants
├── App.tsx               # Composant principal
└── main.tsx             # Point d'entrée
```

## 🔧 Configuration

### Variables d'Environnement
Pour la production, copiez `env.example` vers `.env` et configurez les variables :

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer les variables d'environnement
nano .env
```

Variables importantes :
- `VITE_APP_NAME` : Nom de l'application
- `VITE_COMPANY_NAME` : Nom de l'entreprise
- `VITE_ENCRYPTION_KEY` : Clé de chiffrement (OBLIGATOIRE en production)
- `VITE_DEBUG_MODE` : Mode debug (false en production)

### Personnalisation
- **Couleurs** : Modifiez `tailwind.config.js` pour personnaliser le thème
- **Logo** : Remplacez `/public/logo-ediba.png`
- **Utilisateurs** : Modifiez `AuthContext.tsx` pour ajouter/modifier les utilisateurs
- **Configuration** : Modifiez `src/config/environment.ts` pour les paramètres avancés

## 📊 Conformité au Cahier des Charges

### ✅ Fonctionnalités Implémentées (100%)

#### **Module Facturation**
- [x] Devis (Facture Proforma)
- [x] Bon de Livraison (BL)
- [x] Facture d'Acompte
- [x] Facture de Solde
- [x] Numérotation automatique
- [x] Export PDF / impression
- [x] Suivi des statuts
- [x] Gestion des paiements

#### **Module Clients**
- [x] Gestion complète des clients
- [x] Informations détaillées
- [x] Statistiques et suivi
- [x] Filtres et recherche

#### **Module Fournisseurs**
- [x] Gestion des fournisseurs
- [x] Suivi des factures
- [x] Statistiques

#### **Module Statistiques et Rapports**
- [x] Rapports de facturation
- [x] Statistiques par période
- [x] Export PDF / Excel
- [x] Graphiques

#### **Module Décharges**
- [x] Création et gestion
- [x] Signature électronique
- [x] Export PDF

### 🔒 Sécurité et Conformité

#### **Système de Rôles**
- [x] Gestion des rôles (Admin, Comptable, Commercial, Lecture)
- [x] Permissions granulaires
- [x] Traçabilité des actions

#### **Journal d'Activité**
- [x] Traçabilité complète
- [x] Export des logs
- [x] Nettoyage automatique

#### **Sauvegardes**
- [x] Sauvegarde complète
- [x] Restauration
- [x] Import/Export
- [x] Sauvegarde automatique

### 📱 Fonctionnalités Modernes

#### **PWA (Progressive Web App)**
- [x] Installation sur appareils
- [x] Mode hors ligne
- [x] Notifications push
- [x] Service worker

#### **Interface Utilisateur**
- [x] Design moderne et responsive
- [x] Navigation intuitive
- [x] Notifications en temps réel
- [x] Thème cohérent

## 🎯 Utilisation

### Connexion
1. Ouvrez l'application
2. Utilisez les identifiants fournis :
   - **Alayi** / **Alayi7@** (Admin)
   - **Esso** / **Esso28@** (Comptable)
   - **Gloria** / **Gloria127@** (Commercial)
   - **Paul** / **Paul832@** (Commercial)
   - **Gym** / **Gym74@** (Lecture)
   - **Sam** / **Sam384@** (Comptable)

### Navigation
- **Tableau de Bord** : Vue d'ensemble des statistiques
- **Facturation** : Création et gestion des factures
- **Clients** : Gestion de la base clients
- **Fournisseurs** : Gestion des fournisseurs
- **Rapports** : Génération de rapports
- **Décharges** : Gestion des décharges avec signature
- **Exercices Fiscaux** : Gestion multi-exercices
- **Sauvegardes** : Gestion des sauvegardes
- **Journal d'Activité** : Traçabilité des actions
- **Paramètres** : Configuration de l'application
- **Monitoring** : Tableau de bord de monitoring (Admin uniquement)

## 🔄 Mises à Jour et Maintenance

### Sauvegarde des Données
L'application sauvegarde automatiquement toutes les données dans le localStorage du navigateur. Pour une sauvegarde externe, utilisez le module "Sauvegardes".

### Nettoyage Automatique
- Les activités sont automatiquement nettoyées après 90 jours
- Les notifications sont nettoyées après 30 jours
- Les sauvegardes sont limitées à 10 par défaut
- Les logs de monitoring sont nettoyés après 7 jours
- Le cache est nettoyé automatiquement selon les stratégies configurées

### Monitoring et Alertes
- **Métriques en temps réel** : Utilisation mémoire, performance, erreurs
- **Alertes automatiques** : Seuils de sécurité et performance
- **Tableau de bord** : Accès aux métriques détaillées
- **Export des données** : JSON/CSV pour analyse externe

### Tests et Qualité
- **Tests automatisés** : Vitest avec couverture de code
- **Tests de sécurité** : Validation des entrées et chiffrement
- **Tests de performance** : Monitoring des temps de réponse
- **Tests d'intégration** : Workflow complet des fonctionnalités

## 📞 Support

Pour toute question ou support technique :
- **Développeur** : LARE Kandi
- **Email** : kandilare20@gmail.com
- **Téléphone** : +228 91 67 61 67

## 📄 Licence

Propriétaire - EDIBA INTER SARL U
Tous droits réservés.

---

## 📚 Documentation Technique

### Documentation Disponible
- **[API.md](docs/API.md)** : Documentation complète des APIs et interfaces
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** : Guide de déploiement détaillé
- **[COMPONENTS.md](docs/COMPONENTS.md)** : Documentation des composants
- **[CHANGELOG.md](CHANGELOG.md)** : Historique des versions et améliorations

### Scripts Disponibles
```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run preview          # Prévisualisation du build

# Tests
npm run test             # Tests en mode watch
npm run test:ui          # Interface utilisateur des tests
npm run test:coverage    # Tests avec couverture
npm run test:run         # Tests une seule fois

# Qualité
npm run lint             # Vérification du code
```

### Configuration Docker
```bash
# Développement
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

---

**Version** : 1.2.0  
**Dernière mise à jour** : Janvier 2025  
**Statut** : ✅ Implémentation complète avec fonctionnalités avancées de sécurité, monitoring et performance
