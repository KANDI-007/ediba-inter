# Module Sauvegarde - Documentation Complète

## 🎯 **Vue d'ensemble**

Le module sauvegarde d'EDIBA-INTER permet de sauvegarder, restaurer et gérer toutes les données de l'application. Il utilise le localStorage du navigateur pour stocker les sauvegardes et offre des fonctionnalités avancées de gestion des données.

## 🏗️ **Architecture du Module**

### **1. Structure des Données**

```typescript
interface BackupData {
  id: string;                    // Identifiant unique
  name: string;                  // Nom de la sauvegarde
  timestamp: string;             // Date de création
  size: number;                 // Taille en bytes
  type: 'full' | 'incremental'; // Type de sauvegarde
  description?: string;          // Description optionnelle
  data: {                       // Données sauvegardées
    documents: any[];            // Factures et documents
    suppliers: any[];            // Fournisseurs (legacy)
    suppliersList: any[];        // Liste des fournisseurs
    supplierInvoices: any[];      // Factures fournisseurs
    activities: any[];           // Logs d'activité
    notifications: any[];        // Notifications
    fiscalYears: any[];          // Exercices fiscaux
    companyDetails: any;         // Détails de l'entreprise
    userSession: any;            // Session utilisateur
  };
  version: string;               // Version de l'application
  checksum: string;              // Checksum d'intégrité
}
```

### **2. Types de Sauvegardes**

#### **Sauvegarde Complète (Full)**
- Sauvegarde toutes les données de l'application
- Inclut tous les modules (factures, fournisseurs, clients, etc.)
- Recommandée pour les sauvegardes manuelles importantes

#### **Sauvegarde Incrémentale (Incremental)**
- Sauvegarde uniquement les modifications depuis la dernière sauvegarde
- Plus rapide et moins d'espace de stockage
- Idéale pour les sauvegardes automatiques

## 🔧 **Fonctionnalités Principales**

### **1. Création de Sauvegarde**

```typescript
const createBackup = async (name: string, description?: string, type?: 'full' | 'incremental') => {
  // Collecte toutes les données
  const allData = collectAllData();
  
  // Génère un checksum d'intégrité
  const checksum = generateChecksum(JSON.stringify(allData));
  
  // Crée l'objet sauvegarde
  const backup: BackupData = {
    id: `BACKUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    timestamp: new Date().toISOString(),
    size: new Blob([JSON.stringify(allData)]).size,
    type,
    description,
    data: allData,
    version: '1.0.0',
    checksum
  };
  
  // Sauvegarde dans le localStorage
  setBackups(prev => [backup, ...prev.slice(0, 9)]);
};
```

### **2. Restauration de Sauvegarde**

```typescript
const restoreBackup = async (backupId: string) => {
  // Trouve la sauvegarde
  const backup = backups.find(b => b.id === backupId);
  
  // Vérifie l'intégrité
  const checksum = generateChecksum(JSON.stringify(backup.data));
  if (checksum !== backup.checksum) {
    throw new Error('Sauvegarde corrompue');
  }
  
  // Restaure les données dans le localStorage
  localStorage.setItem('ediba.data.v1', JSON.stringify(backup.data));
  
  // Recharge la page pour appliquer les changements
  window.location.reload();
};
```

### **3. Export/Import de Sauvegarde**

#### **Export**
- Génère un fichier JSON téléchargeable
- Inclut toutes les métadonnées
- Format : `ediba_backup_{nom}_{date}.json`

#### **Import**
- Vérifie l'intégrité du fichier
- Valide la structure des données
- Ajoute la sauvegarde à la liste

### **4. Sauvegarde Automatique**

```typescript
const scheduleAutoBackup = (interval: 'daily' | 'weekly' | 'monthly') => {
  const intervals = {
    daily: 24 * 60 * 60 * 1000,    // 24 heures
    weekly: 7 * 24 * 60 * 60 * 1000,  // 7 jours
    monthly: 30 * 24 * 60 * 60 * 1000 // 30 jours
  };
  
  const schedule = {
    interval,
    nextBackup: new Date(Date.now() + intervals[interval]).toISOString(),
    enabled: true
  };
  
  localStorage.setItem('ediba.auto.backup', JSON.stringify(schedule));
};
```

## 📊 **Interface Utilisateur**

### **1. Tableau de Bord des Sauvegardes**

- **Liste des sauvegardes** : Nom, date, taille, type
- **Actions** : Restaurer, exporter, supprimer
- **Statut** : Indicateurs visuels (icônes, couleurs)
- **Filtrage** : Par type, date, taille

### **2. Création de Sauvegarde**

```html
<div className="modal">
  <h3>Créer une Sauvegarde</h3>
  <input placeholder="Nom de la sauvegarde" />
  <textarea placeholder="Description (optionnelle)" />
  <select>
    <option value="full">Sauvegarde Complète</option>
    <option value="incremental">Sauvegarde Incrémentale</option>
  </select>
  <button>Créer la Sauvegarde</button>
</div>
```

### **3. Gestion du Stockage**

- **Utilisation** : Affichage de l'espace utilisé
- **Limite** : 5MB (limite du localStorage)
- **Nettoyage** : Suppression automatique des anciennes sauvegardes (>30 jours)

## 🔒 **Sécurité et Intégrité**

### **1. Checksum d'Intégrité**

```typescript
const generateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};
```

### **2. Vérification des Données**

- **Avant restauration** : Vérification du checksum
- **Avant import** : Validation de la structure
- **Pendant l'utilisation** : Détection de corruption

### **3. Gestion des Erreurs**

- **Sauvegarde corrompue** : Alerte utilisateur
- **Espace insuffisant** : Nettoyage automatique
- **Données invalides** : Validation stricte

## 📈 **Optimisations**

### **1. Limitation du Nombre de Sauvegardes**

```typescript
// Garder seulement les 10 dernières sauvegardes
setBackups(prev => [backup, ...prev.slice(0, 9)]);
```

### **2. Nettoyage Automatique**

```typescript
// Supprimer les sauvegardes de plus de 30 jours
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

setBackups(prev => 
  prev.filter(backup => 
    new Date(backup.timestamp) > thirtyDaysAgo
  )
);
```

### **3. Compression des Données**

- **JSON** : Format compact pour le stockage
- **Métadonnées** : Informations essentielles uniquement
- **Versioning** : Gestion des versions de format

## 🚀 **Utilisation Pratique**

### **1. Sauvegarde Manuelle**

1. Cliquer sur "Créer une Sauvegarde"
2. Saisir un nom descriptif
3. Ajouter une description (optionnel)
4. Choisir le type (Complète/Incrémentale)
5. Confirmer la création

### **2. Restauration**

1. Sélectionner la sauvegarde à restaurer
2. Cliquer sur "Restaurer"
3. Confirmer l'opération (remplace toutes les données actuelles)
4. La page se recharge automatiquement

### **3. Export/Import**

1. **Export** : Cliquer sur "Exporter" → Téléchargement automatique
2. **Import** : Cliquer sur "Importer" → Sélectionner le fichier JSON

### **4. Sauvegarde Automatique**

1. Configurer la fréquence (quotidienne/hebdomadaire/mensuelle)
2. Le système crée automatiquement les sauvegardes
3. Gestion automatique de l'espace de stockage

## ⚠️ **Limitations et Considérations**

### **1. Stockage Local**

- **Limite** : 5MB par navigateur
- **Persistance** : Dépend du navigateur
- **Sécurité** : Données stockées localement

### **2. Sauvegardes Incrémentales**

- **Complexité** : Plus difficile à implémenter
- **Fiabilité** : Dépend de la dernière sauvegarde complète
- **Espace** : Économie d'espace variable

### **3. Restauration**

- **Irréversible** : Remplace toutes les données actuelles
- **Rechargement** : Nécessite un rechargement de page
- **Validation** : Vérification d'intégrité obligatoire

## ✅ **Avantages du Module**

1. **Sécurité** : Protection contre la perte de données
2. **Flexibilité** : Sauvegardes manuelles et automatiques
3. **Portabilité** : Export/import pour migration
4. **Intégrité** : Vérification des données
5. **Simplicité** : Interface utilisateur intuitive
6. **Performance** : Optimisations de stockage

Le module sauvegarde d'EDIBA-INTER offre une solution complète et robuste pour la gestion des données de l'application ! 🛡️💾
