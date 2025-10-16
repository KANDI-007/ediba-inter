# Colonnes Journal Factures Fournisseurs - Documentation

## 📋 **Ordre des Colonnes Confirmé**

Le journal des factures fournisseurs contient exactement **14 colonnes** dans l'ordre suivant :

### **1. DATE**
- Type : `string`
- Format : DD/MM/YYYY
- Exemple : "17/1/2025"

### **2. NUMERO FACTURE**
- Type : `string`
- Format : Alphanumérique
- Exemple : "AF25003291"

### **3. FOURNISSEUR**
- Type : `string`
- Format : Nom du fournisseur
- Exemple : "CCT-BATIMENT"

### **4. NIF**
- Type : `string`
- Format : Numéro d'identification fiscale
- Exemple : "1000166149"

### **5. OBJET**
- Type : `string`
- Format : Description de l'objet
- Exemple : "PRODUIT MECANIQUE"

### **6. MONTANT HT**
- Type : `number`
- Format : Montant hors taxes
- Exemple : 15593

### **7. TVA**
- Type : `number`
- Format : Montant de la TVA
- Exemple : 2807

### **8. MONTANT TTC**
- Type : `number`
- Format : Montant toutes taxes comprises
- Exemple : 18400

### **9. ETAT EXECUTION**
- Type : `string`
- Valeurs possibles : "PLEIN", "EN COURS"
- Exemple : "PLEIN"

### **10. ETAT PAYEMENT**
- Type : `string`
- Valeurs possibles : "TOTAL", "PARTIEL", "IMPAYE"
- Exemple : "TOTAL"

### **11. ETAT ARCHIVE**
- Type : `string`
- Valeurs possibles : "FAIT", "NON ARCHIVE"
- Exemple : "FAIT"

### **12. ETAT OTR**
- Type : `string`
- Valeurs possibles : "DECLARE", "NON DECLARE"
- Exemple : "DECLARE"

### **13. AUTRE ETAT**
- Type : `string`
- Valeurs possibles : "RIEN", "EN COURS"
- Exemple : "RIEN"

### **14. PERIODE DE DECLARATION**
- Type : `string`
- Format : Période de déclaration
- Exemple : "Janvier"

## 🎨 **Formatage par Colonne**

### **En-têtes (Toutes les colonnes)**
- **Fond** : Gris foncé (#404040)
- **Texte** : Blanc (#FFFFFF) en gras
- **Bordures** : Fines et noires

### **Données (Colonnes 1-13)**
- **Fond** : Bleu clair (#B0E0E6)
- **Texte** : Noir (#000000)
- **Bordures** : Fines et noires

### **PERIODE DE DECLARATION (Colonne 14)**
- **Fond** : Bleu foncé (#4682B4)
- **Texte** : Blanc (#FFFFFF)
- **Bordures** : Fines et noires

## 🔧 **Interface TypeScript**

```typescript
export interface SupplierInvoiceData {
  date: string;                    // Colonne 1
  numeroFacture: string;           // Colonne 2
  fournisseur: string;            // Colonne 3
  nif: string;                    // Colonne 4
  objet: string;                  // Colonne 5
  montantHT: number;              // Colonne 6
  tva: number;                    // Colonne 7
  montantTTC: number;             // Colonne 8
  etatExecution: string;          // Colonne 9
  etatPaiement: string;           // Colonne 10
  etatArchive: string;            // Colonne 11
  etatOTR: string;                // Colonne 12
  autreEtat: string;              // Colonne 13
  periodeDeclaration: string;     // Colonne 14
}
```

## 🚀 **Utilisation**

```typescript
import { exportSupplierInvoiceJournal } from '../utils/ExcelGeneratorSimple';

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
    etatOTR: 'DECLARE',
    autreEtat: 'RIEN',
    periodeDeclaration: 'Janvier'
  }
];

await exportSupplierInvoiceJournal(data, 'Journal_Factures_Fournisseurs.xlsx');
```

## ✅ **Validation**

Le fichier Excel généré contiendra :
- ✅ **14 colonnes** dans l'ordre exact spécifié
- ✅ **Formatage** conforme aux couleurs de l'image
- ✅ **Bordures** fines et noires sur toutes les cellules
- ✅ **Centrage** horizontal et vertical du texte
- ✅ **Colonne spéciale** "PERIODE DE DECLARATION" avec fond bleu foncé

L'ordre des colonnes est maintenant **100% conforme** à vos spécifications ! 🎯
