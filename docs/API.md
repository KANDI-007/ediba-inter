# API Documentation - EDIBA-INTER

## Vue d'ensemble

L'application EDIBA-INTER utilise une architecture basée sur React Context API pour la gestion des données. Cette documentation décrit les interfaces et méthodes disponibles.

## Contextes Principaux

### 1. AuthContext

Gestion de l'authentification et des permissions.

#### Types
```typescript
type UserRole = 'admin' | 'comptable' | 'commercial' | 'lecture';

interface User {
  username: string;
  role: UserRole;
  permissions: string[];
  fullName: string;
  email: string;
  lastLogin?: string;
}
```

#### Méthodes
- `login(username: string, password: string): Promise<void>`
- `logout(): void`
- `hasPermission(permission: string): boolean`
- `hasRole(role: UserRole): boolean`

#### Permissions
- `users.manage` - Gestion des utilisateurs
- `settings.manage` - Gestion des paramètres
- `reports.view` - Consultation des rapports
- `reports.export` - Export des rapports
- `invoices.create` - Création de factures
- `invoices.edit` - Modification de factures
- `invoices.delete` - Suppression de factures
- `invoices.view` - Consultation des factures
- `clients.create` - Création de clients
- `clients.edit` - Modification de clients
- `clients.delete` - Suppression de clients
- `clients.view` - Consultation des clients
- `suppliers.create` - Création de fournisseurs
- `suppliers.edit` - Modification de fournisseurs
- `suppliers.delete` - Suppression de fournisseurs
- `suppliers.view` - Consultation des fournisseurs
- `discharges.create` - Création de décharges
- `discharges.edit` - Modification de décharges
- `discharges.delete` - Suppression de décharges
- `discharges.view` - Consultation des décharges
- `payments.manage` - Gestion des paiements
- `fiscal.manage` - Gestion fiscale

### 2. DataContext

Gestion des données métier.

#### Types Principaux

##### CustomerDocument
```typescript
interface CustomerDocument {
  id: string;
  type: DocumentType;
  reference: string;
  date: string;
  dueDate?: string;
  client: string;
  address?: string;
  city?: string;
  tva: number;
  items: LineItem[];
  status: 'validated' | 'paid' | 'partial' | 'overdue' | 'pending';
  sourceId?: string;
  payments?: { date: string; amount: number; note?: string }[];
  paymentTermsDays?: number;
  workflowStatus?: 'draft' | 'validated' | 'ordered' | 'delivered' | 'invoiced' | 'completed';
  parentDocumentId?: string;
  childDocuments?: string[];
  orderNumber?: string;
  contractTerms?: {
    deliveryDate?: string;
    warrantyPeriod?: string;
    specialConditions?: string;
    paymentSchedule?: { date: string; amount: number; description: string }[];
  };
}
```

##### Client
```typescript
interface Client {
  id: string;
  raisonSociale: string;
  nomCommercial?: string;
  nif: string;
  rccm?: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  contactPrincipal: string;
  secteurActivite: string;
  regimeFiscal: 'Réel Normal' | 'Réel Simplifié' | 'Forfait';
  delaiPaiement: number;
  remise: number;
  limiteCredit: number;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: string;
  derniereFacture?: string;
  totalFacture: number;
  totalEncaissement: number;
  soldeImpaye: number;
  nombreFactures: number;
}
```

#### Méthodes Principales

##### Gestion des Documents
- `saveDocument(doc: Omit<CustomerDocument, 'id' | 'reference'>): CustomerDocument`
- `updateDocument(id: string, partial: Partial<CustomerDocument>): void`
- `addPayment(docId: string, payment: { date: string; amount: number; note?: string }): void`

##### Workflow des Documents
- `validateQuote(quoteId: string): CustomerDocument`
- `createOrderFromQuote(quoteId: string, orderNumber: string, contractTerms?: CustomerDocument['contractTerms']): CustomerDocument`
- `createDeliveryFromOrder(orderId: string): CustomerDocument`
- `createInvoiceFromDelivery(deliveryId: string): CustomerDocument`
- `getDocumentWorkflow(documentId: string): CustomerDocument[]`
- `updateDocumentWorkflow(documentId: string, workflowStatus: CustomerDocument['workflowStatus']): void`

##### Gestion des Clients
- `addClient(client: Omit<Client, 'id' | 'dateCreation' | 'totalFacture' | 'totalEncaissement' | 'soldeImpaye' | 'nombreFactures'>): Client`
- `updateClient(id: string, client: Partial<Client>): void`
- `deleteClient(id: string): void`

### 3. ActivityContext

Gestion du journal d'activité.

#### Types
```typescript
interface Activity {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  module: string;
  action: string;
  details: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}
```

#### Méthodes
- `logActivity(module: string, action: string, details: string, userId?: string, success?: boolean): void`
- `getActivities(filters?: ActivityFilters): Activity[]`
- `exportActivities(format: 'json' | 'csv'): string`
- `clearOldActivities(days: number): void`

### 4. NotificationContext

Gestion des notifications.

#### Types
```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  module?: string;
  action?: string;
}
```

#### Méthodes
- `addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification`
- `markAsRead(id: string): void`
- `markAllAsRead(): void`
- `removeNotification(id: string): void`
- `getNotifications(userId?: string): Notification[]`

## Utilitaires

### Logger
```typescript
interface Logger {
  debug(message: string, context?: any, userId?: string, module?: string, action?: string): void;
  info(message: string, context?: any, userId?: string, module?: string, action?: string): void;
  warn(message: string, context?: any, userId?: string, module?: string, action?: string): void;
  error(message: string, context?: any, userId?: string, module?: string, action?: string): void;
  logUserAction(userId: string, action: string, module: string, details?: any): void;
  logSystemEvent(event: string, details?: any): void;
  logError(error: Error, context?: any, userId?: string, module?: string): void;
  logPerformance(operation: string, duration: number, context?: any): void;
  getLogs(level?: LogLevel, module?: string, userId?: string): LogEntry[];
  exportLogs(format: 'json' | 'csv'): string;
  clearLogs(): void;
}
```

### PrintUtils
```typescript
interface PrintUtils {
  printDocument(document: CustomerDocument, format: string, orientation: string, scale: number, margin: number): Promise<void>;
  generatePDF(document: CustomerDocument, format: string, orientation: string, scale: number, margin: number): Promise<Blob | null>;
  captureElement(element: HTMLElement, scale: number): Promise<string | null>;
}
```

## Configuration

### Variables d'Environnement
Voir `env.example` pour la liste complète des variables d'environnement disponibles.

### Configuration par Défaut
```typescript
const config = {
  app: {
    name: 'EDIBA-INTER',
    version: '1.0.0',
    description: 'Application de gestion de facturation'
  },
  company: {
    name: 'EDIBA INTER SARL U',
    address: '123 Avenue de la Paix, Lomé, Togo',
    phone: '+228 12 34 56 78',
    email: 'contact@edibainter.com',
    website: 'https://edibainter.com'
  },
  // ... autres configurations
};
```

## Exemples d'Utilisation

### Création d'un Document
```typescript
const { saveDocument } = useData();

const newDocument = saveDocument({
  type: 'proforma',
  date: '2025-01-15',
  client: 'Client Test',
  address: '123 Rue Test',
  city: 'Lomé',
  tva: 18,
  items: [
    {
      description: 'Service de test',
      quantity: 1,
      unitPrice: 1000
    }
  ],
  status: 'pending'
});
```

### Gestion des Permissions
```typescript
const { hasPermission, hasRole } = useAuth();

if (hasPermission('invoices.create')) {
  // L'utilisateur peut créer des factures
}

if (hasRole('admin')) {
  // L'utilisateur est administrateur
}
```

### Journalisation
```typescript
const logger = useLogger();

logger.logUserAction('user123', 'create_invoice', 'facturation', { invoiceId: 'F2500001' });
logger.logSystemEvent('backup_completed', { size: '2.5MB' });
logger.logError(new Error('Erreur de connexion'), { module: 'auth' });
```

## Sécurité

### Chiffrement des Données
Les données sensibles sont chiffrées avant stockage dans le localStorage.

### Validation des Entrées
Toutes les entrées utilisateur sont validées côté client et côté serveur.

### Gestion des Sessions
Les sessions utilisateur expirent automatiquement après une période d'inactivité.

## Performance

### Optimisations
- Lazy loading des composants
- Mise en cache des données
- Compression des assets
- Optimisation des images

### Monitoring
- Logs de performance
- Métriques d'utilisation
- Alertes d'erreur
