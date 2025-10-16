# Documentation Export Excel - EDIBA-INTER

## Vue d'ensemble

Cette documentation décrit l'implémentation de l'export Excel pour les journaux de factures clients et fournisseurs, avec un formatage fidèle aux images fournies.

## Fonctionnalités Implémentées

### 🎨 Formatage Fidèle aux Images

L'export Excel respecte exactement les couleurs et la mise en forme des images fournies :

#### **Journal des Factures Clients**
- **Titre principal** : Fond rouge foncé avec texte blanc, centré
- **En-têtes** : Fond gris foncé avec texte blanc en gras
- **Données** : Fond bleu clair avec texte noir
- **Colonne "ETAT DE PAYEMENT"** : Fond vert clair (Payé/Impayé)
- **Cellule de déclaration** : Fond bleu avec texte rouge en italique, bordure épaisse

#### **Journal des Factures Fournisseurs**
- **Titre principal** : Fond rouge foncé avec texte blanc, centré
- **En-têtes** : Fond gris foncé avec texte blanc en gras
- **Données** : Fond bleu clair avec texte noir
- **Colonne "ETAT PAYEMENT"** : Fond vert clair (TOTAL/PARTIEL/IMPAYE)
- **Cellule de déclaration** : Fond bleu avec texte rouge en italique, bordure épaisse

### 📊 Structure des Données

#### Types TypeScript
```typescript
interface InvoiceData {
  numero: string;
  nom: string;
  objet: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  etatPaiement: string;
  etatExecution: string;
  etatArchive: string;
  etatOtr: string;
  date: string;
}

interface SupplierInvoiceData {
  date: string;
  numeroFacture: string;
  fournisseur: string;
  nif: string;
  objet: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  etatExecution: string;
  etatPaiement: string;
  etatArchive: string;
  etatOtr: string;
  autreEtat: string;
  periodeDeclaration: string;
}
```

### 🛠️ Utilisation

#### Export Journal Clients
```typescript
import { exportClientInvoiceJournal } from '../utils/ExcelGenerator';

const data: InvoiceData[] = [
  {
    numero: 'F2500001',
    nom: 'ASSEMBLEE NATIONALE',
    objet: 'CONSOMMABLE',
    montantHT: 60000,
    tva: 10800,
    montantTTC: 70800,
    etatPaiement: 'Payé',
    etatExecution: 'PLEIN',
    etatArchive: 'FAIT',
    etatOtr: 'DECLARE',
    date: '16/1/2025'
  }
];

exportClientInvoiceJournal(data, 'Journal_Factures_Clients.xlsx');
```

#### Export Journal Fournisseurs
```typescript
import { exportSupplierInvoiceJournal } from '../utils/ExcelGenerator';

const data: SupplierInvoiceData[] = [
  {
    date: '17/1/2025',
    numeroFacture: 'AF25003291',
    fournisseur: 'CCT-BATIMENT',
    nif: '1000166149',
    objet: 'PRODUIT MECANIQUE',
    montantHT: 15593,
    tva: 2807,
    montantTTC: 18400,
    etatExecution: 'PLEIN',
    etatPaiement: 'TOTAL',
    etatArchive: 'FAIT',
    etatOtr: 'DECLARE',
    autreEtat: 'RIEN',
    periodeDeclaration: 'Janvier'
  }
];

exportSupplierInvoiceJournal(data, 'Journal_Factures_Fournisseurs.xlsx');
```

### 🎯 Intégration dans le Module Reports

L'export Excel est intégré dans le module Reports (`src/components/modules/ReportsModule.tsx`) :

1. **Import des fonctions** : Import des fonctions d'export et des types
2. **Adaptation des données** : Transformation des données existantes vers les formats requis
3. **Remplacement des exports** : Remplacement des anciennes fonctions d'export par les nouvelles

### 🎨 Palette de Couleurs

```typescript
const COLORS = {
  // En-têtes (gris foncé avec texte blanc)
  headerBg: 'FF404040',
  headerText: 'FFFFFFFF',
  
  // Données (bleu clair)
  dataBg: 'FFB0E0E6',
  dataText: 'FF000000',
  
  // Paiements (vert clair)
  paymentBg: 'FF90EE90',
  paymentText: 'FF000000',
  
  // Titre principal (rouge foncé avec texte blanc)
  titleBg: 'FF8B0000',
  titleText: 'FFFFFFFF',
  
  // Déclaration (bleu avec texte rouge)
  declarationBg: 'FF4169E1',
  declarationText: 'FFFF0000'
};
```

### 📋 Fonctionnalités Avancées

1. **Fusion de cellules** : Titre principal et cellule de déclaration
2. **Bordures personnalisées** : Bordures fines et épaisses selon les besoins
3. **Alignement** : Centrage horizontal et vertical
4. **Styles de police** : Gras, italique selon les images
5. **Largeur des colonnes** : Ajustement automatique
6. **Hauteur des lignes** : Configuration optimale

### 🧪 Test

Un composant de test est disponible (`src/components/ExcelTestComponent.tsx`) pour tester les exports avec des données d'exemple.

### 📦 Dépendances

- `xlsx` : Bibliothèque pour la génération de fichiers Excel
- Types TypeScript pour la sécurité des données

### 🚀 Utilisation en Production

Les exports sont automatiquement disponibles dans le module Reports :
- Bouton "Exporter XLSX" pour le journal des factures clients
- Bouton "Exporter XLSX" pour le journal des factures fournisseurs

Les fichiers générés respectent fidèlement le formatage des images fournies avec toutes les couleurs, bordures et styles appropriés.
