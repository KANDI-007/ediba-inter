# Documentation des Composants - EDIBA-INTER

## Vue d'ensemble

Cette documentation décrit les composants principaux de l'application EDIBA-INTER, leur utilisation et leurs props.

## Composants de Layout

### Layout
**Fichier** : `src/components/Layout.tsx`

Composant principal de mise en page avec navigation et sidebar.

#### Props
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

#### Fonctionnalités
- Navigation principale
- Sidebar avec menu
- Gestion des permissions
- Notifications
- Profil utilisateur

### Dashboard
**Fichier** : `src/components/Dashboard.tsx`

Tableau de bord principal avec statistiques et widgets.

#### Fonctionnalités
- Statistiques générales
- Graphiques de performance
- Activité récente
- Notifications importantes
- Accès rapide aux modules

## Composants d'Authentification

### LoginPage
**Fichier** : `src/components/LoginPage.tsx`

Page de connexion avec gestion des erreurs.

#### Props
Aucune prop externe (utilise le contexte AuthContext)

#### Fonctionnalités
- Formulaire de connexion
- Gestion des erreurs
- Validation des champs
- Redirection après connexion

### SplashScreen
**Fichier** : `src/components/SplashScreen.tsx`

Écran de démarrage avec logo et animation.

#### Props
Aucune prop externe

#### Fonctionnalités
- Animation de chargement
- Logo EDIBA
- Transition vers l'application

## Modules Principaux

### InvoiceModule
**Fichier** : `src/components/modules/InvoiceModule.tsx`

Module de gestion des factures et documents.

#### Fonctionnalités
- Création de devis
- Gestion des bons de livraison
- Factures d'acompte et de solde
- Workflow intégré
- Impression avancée
- Export PDF

#### Composants Internes
- `InvoiceForm` - Formulaire de création
- `InvoiceList` - Liste des documents
- `InvoiceDetails` - Détails d'un document
- `PaymentModal` - Gestion des paiements

### ClientsModule
**Fichier** : `src/components/modules/ClientsModule.tsx`

Module de gestion des clients.

#### Fonctionnalités
- CRUD des clients
- Statistiques par client
- Recherche et filtres
- Historique des factures
- Gestion des remises

#### Composants Internes
- `ClientForm` - Formulaire client
- `ClientList` - Liste des clients
- `ClientDetails` - Détails client
- `ClientStats` - Statistiques client

### SuppliersModule
**Fichier** : `src/components/modules/SuppliersModule.tsx`

Module de gestion des fournisseurs.

#### Fonctionnalités
- Gestion des fournisseurs
- Suivi des factures fournisseurs
- Statistiques et rapports
- Gestion des articles

### ReportsModule
**Fichier** : `src/components/modules/ReportsModule.tsx`

Module de génération de rapports.

#### Fonctionnalités
- Rapports de facturation
- Statistiques par période
- Export PDF/Excel
- Graphiques et visualisations
- Filtres avancés

### DischargeModule
**Fichier** : `src/components/modules/DischargeModule.tsx`

Module de gestion des décharges.

#### Fonctionnalités
- Création de décharges
- Signature électronique
- Export PDF avec signature
- Suivi des prestataires

## Composants Utilitaires

### SignaturePad
**Fichier** : `src/components/SignaturePad.tsx`

Composant de signature électronique.

#### Props
```typescript
interface SignaturePadProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
}
```

#### Fonctionnalités
- Capture de signature
- Sauvegarde en base64
- Redimensionnement
- Effacement

### AdvancedPrintModal
**Fichier** : `src/components/AdvancedPrintModal.tsx`

Modal d'impression avancée avec options.

#### Props
```typescript
interface AdvancedPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: CustomerDocument;
  onPrint: (options: PrintOptions) => void;
  onGeneratePDF: (options: PrintOptions) => void;
}
```

#### Fonctionnalités
- Prévisualisation
- Options d'impression
- Formats multiples
- Qualité ajustable

### NotificationToast
**Fichier** : `src/components/NotificationToast.tsx`

Système de notifications toast.

#### Props
```typescript
interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}
```

#### Fonctionnalités
- Notifications temporaires
- Types multiples (info, success, warning, error)
- Auto-dismiss
- Actions utilisateur

### PWAInstallPrompt
**Fichier** : `src/components/PWAInstallPrompt.tsx`

Invitation à installer l'application PWA.

#### Props
Aucune prop externe

#### Fonctionnalités
- Détection de l'installabilité
- Invitation à installer
- Gestion des événements PWA

## Composants de Données

### ActivityLogModule
**Fichier** : `src/components/modules/ActivityLogModule.tsx`

Module de journal d'activité.

#### Fonctionnalités
- Affichage des activités
- Filtres avancés
- Export des logs
- Recherche
- Statistiques

#### Composants Internes
- `ActivityList` - Liste des activités
- `ActivityFilters` - Filtres
- `ActivityStats` - Statistiques
- `ActivityExport` - Export

### BackupModule
**Fichier** : `src/components/modules/BackupModule.tsx`

Module de gestion des sauvegardes.

#### Fonctionnalités
- Sauvegarde manuelle
- Sauvegarde automatique
- Restauration
- Import/Export
- Gestion de l'espace

### FiscalYearModule
**Fichier** : `src/components/modules/FiscalYearModule.tsx`

Module de gestion des exercices fiscaux.

#### Fonctionnalités
- Création d'exercices
- Clôture d'exercices
- Changement d'exercice
- Statistiques par exercice

## Hooks Personnalisés

### usePWA
**Fichier** : `src/hooks/usePWA.ts`

Hook pour la gestion PWA.

#### Fonctionnalités
- Détection de l'installabilité
- Gestion des événements
- État de l'installation
- Fonctions d'installation

### useLogger
**Fichier** : `src/utils/logger.ts`

Hook pour la journalisation.

#### Fonctionnalités
- Logs de différents niveaux
- Logs d'actions utilisateur
- Logs d'erreurs
- Export des logs

## Contextes

### AuthContext
**Fichier** : `src/contexts/AuthContext.tsx`

Gestion de l'authentification.

#### Fonctionnalités
- Login/Logout
- Gestion des sessions
- Permissions
- Rôles utilisateur

### DataContext
**Fichier** : `src/contexts/DataContext.tsx`

Gestion des données métier.

#### Fonctionnalités
- CRUD des entités
- Workflow des documents
- Persistance
- Synchronisation

### ActivityContext
**Fichier** : `src/contexts/ActivityContext.tsx`

Gestion du journal d'activité.

#### Fonctionnalités
- Enregistrement des activités
- Filtrage
- Export
- Nettoyage

### NotificationContext
**Fichier** : `src/contexts/NotificationContext.tsx`

Gestion des notifications.

#### Fonctionnalités
- Création de notifications
- Gestion des états
- Auto-dismiss
- Persistance

## Utilitaires

### PrintUtils
**Fichier** : `src/utils/PrintUtils.ts`

Utilitaires d'impression.

#### Fonctionnalités
- Impression de documents
- Génération PDF
- Capture d'éléments
- Options d'impression

### PDFGenerator
**Fichier** : `src/utils/PDFGenerator.ts`

Générateur de PDF.

#### Fonctionnalités
- Création de PDF
- Templates personnalisés
- Mise en page
- Export

## Styles et Thèmes

### Configuration Tailwind
**Fichier** : `tailwind.config.js`

Configuration des couleurs et thèmes.

#### Couleurs Personnalisées
```javascript
colors: {
  brand: {
    blue: '#25C1FF',
    green: '#7AC142',
    dark: '#0F172A',
  },
}
```

### Styles d'Impression
**Fichier** : `src/styles/print.css`

Styles spécifiques à l'impression.

#### Classes Utilitaires
- `.print-container` - Conteneur principal
- `.print-header` - En-tête
- `.print-footer` - Pied de page
- `.print-no-break` - Éléments sans coupure

## Tests

### Configuration des Tests
**Fichier** : `vitest.config.ts`

Configuration Vitest pour les tests.

#### Utilitaires de Test
**Fichier** : `src/test/utils/test-utils.tsx`

Utilitaires pour les tests React.

#### Fonctionnalités
- Rendu avec providers
- Mocks des contextes
- Données de test
- Helpers

## Performance

### Optimisations
- Lazy loading des composants
- Mémorisation avec React.memo
- Callbacks optimisés
- Réduction des re-renders

### Monitoring
- Logs de performance
- Métriques de rendu
- Détection des goulots d'étranglement
