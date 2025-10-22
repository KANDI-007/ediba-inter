# 🏦 MODULE BANQUE - EDIBA-INTER

## 📋 Vue d'ensemble

Le module Banque d'EDIBA-INTER permet de centraliser et gérer toutes les informations bancaires de l'entreprise. Ces informations sont automatiquement récupérées dans les formulaires qui en ont besoin, comme le formulaire de lettre de commande.

## ✨ Fonctionnalités

### 🔧 **Gestion Complète des Comptes Bancaires**
- ✅ **Ajout** de nouveaux comptes bancaires
- ✅ **Modification** des comptes existants
- ✅ **Suppression** des comptes bancaires
- ✅ **Définition** d'un compte par défaut
- ✅ **Activation/Désactivation** des comptes

### 📊 **Informations Gérées**
- **Informations de base** : Nom de la banque, numéro de compte, titulaire
- **Type de compte** : Courant, Épargne, Professionnel, Autre
- **Devise** : FCFA, EUR, USD, etc.
- **Codes internationaux** : SWIFT, IBAN
- **Informations de contact** : Adresse, téléphone, email
- **Statut** : Actif/Inactif, Par défaut

### 🔄 **Intégration Automatique**
- **Formulaires** : Les informations bancaires sont automatiquement pré-remplies
- **Sélection** : Choix du compte bancaire via une liste déroulante
- **Synchronisation** : Mise à jour automatique des données

## 🚀 Utilisation

### 1. **Accès au Module**
```
Navigation : Paramètres → Onglet "Comptes Bancaires"
URL : http://localhost:5173/parameters
```

### 2. **Ajout d'un Compte Bancaire**
1. Cliquer sur **"Nouveau Compte"**
2. Remplir les informations :
   - Nom de la banque (obligatoire)
   - Numéro de compte (obligatoire)
   - Titulaire du compte (obligatoire)
   - Type de compte
   - Devise
   - Codes SWIFT/IBAN (optionnels)
   - Informations de contact (optionnelles)
3. Définir comme compte par défaut si nécessaire
4. Cliquer sur **"Ajouter"**

### 3. **Modification d'un Compte**
1. Cliquer sur l'icône **Modifier** (crayon) du compte
2. Modifier les informations nécessaires
3. Cliquer sur **"Modifier"**

### 4. **Suppression d'un Compte**
1. Cliquer sur l'icône **Supprimer** (poubelle) du compte
2. Confirmer la suppression

### 5. **Définir un Compte par Défaut**
1. Cliquer sur l'icône **Étoile** du compte souhaité
2. Le compte devient automatiquement le compte par défaut

## 🔧 Utilisation dans les Formulaires

### **Formulaire de Lettre de Commande**
Les informations bancaires sont automatiquement récupérées :

```typescript
// Sélection automatique du compte par défaut
bankAccount: bankAccounts.find(ba => ba.isDefault)?.accountNumber || 'Compte par défaut'
bankName: bankAccounts.find(ba => ba.isDefault)?.bankName || 'Banque par défaut'
```

**Interface utilisateur** :
- **Liste déroulante** : Sélection du compte bancaire
- **Champ en lecture seule** : Nom de la banque (mis à jour automatiquement)
- **Indicateur** : "(Par défaut)" pour le compte par défaut

## 📁 Structure Technique

### **Interface BankAccount**
```typescript
interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  accountType: 'Courant' | 'Épargne' | 'Professionnel' | 'Autre';
  currency: string;
  swiftCode?: string;
  iban?: string;
  branchCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### **Fonctions DataContext**
```typescript
// Ajout d'un compte bancaire
addBankAccount: (bankAccount: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => BankAccount;

// Modification d'un compte bancaire
updateBankAccount: (id: string, bankAccount: Partial<BankAccount>) => void;

// Suppression d'un compte bancaire
deleteBankAccount: (id: string) => void;

// Définition du compte par défaut
setDefaultBankAccount: (id: string) => void;
```

### **Composants**
- **`BankModule.tsx`** : Interface principale de gestion
- **`ParametersModule.tsx`** : Intégration avec système d'onglets
- **`ContractOrderFormModal.tsx`** : Utilisation dans les formulaires

## 💾 Sauvegarde

### **localStorage**
Les comptes bancaires sont automatiquement sauvegardés dans le localStorage :
```javascript
localStorage.setItem('ediba.app.data', JSON.stringify({
  bankAccounts: [...],
  // autres données
}));
```

### **Compte par Défaut**
Un compte par défaut est automatiquement créé lors de la première utilisation :
```typescript
{
  id: 'bank-1',
  bankName: 'BIA-TOGO POUR CECA',
  accountNumber: 'TG005 01251 00115511401-48',
  accountHolder: 'EDIBA INTER SARL U',
  accountType: 'Professionnel',
  currency: 'FCFA',
  isDefault: true,
  isActive: true
}
```

## 🎨 Interface Utilisateur

### **Design Moderne**
- **Gradient** : Bleu vers violet pour l'en-tête
- **Cartes** : Affichage en grille responsive
- **Icônes** : Lucide React pour une interface cohérente
- **États** : Indicateurs visuels pour compte par défaut et statut actif

### **Responsive Design**
- **Mobile** : 1 colonne
- **Tablet** : 2 colonnes
- **Desktop** : 3 colonnes

### **Modales**
- **Ajout** : Formulaire complet avec validation
- **Modification** : Pré-remplissage des données existantes
- **Confirmation** : Messages de confirmation pour les actions critiques

## 🔍 Tests

### **Script de Test**
```bash
.\test-module-banque.bat
```

### **URLs de Test**
- **Paramètres** : `http://localhost:5173/parameters`
- **Facturation** : `http://localhost:5173/invoices`

### **Scénarios de Test**
1. **Ajout** de comptes bancaires multiples
2. **Modification** des informations existantes
3. **Suppression** de comptes
4. **Définition** du compte par défaut
5. **Utilisation** dans les formulaires
6. **Sauvegarde** et rechargement des données

## 🚀 Déploiement

### **Build et Déploiement**
```bash
npm run build
git add .
git commit -m "🏦 MODULE BANQUE: Fonctionnalités complètes"
git push origin main
```

### **Netlify**
Le déploiement est automatique via GitHub :
- **Build** : `npm run build`
- **Publish** : `dist/`
- **URL** : `https://ediba-inter.netlify.app`

## 📈 Avantages

### **Centralisation**
- ✅ **Une seule source** de vérité pour les informations bancaires
- ✅ **Cohérence** dans tous les documents
- ✅ **Facilité** de maintenance

### **Automatisation**
- ✅ **Pré-remplissage** automatique des formulaires
- ✅ **Sélection** intuitive des comptes
- ✅ **Mise à jour** en temps réel

### **Sécurité**
- ✅ **Validation** des données
- ✅ **Gestion** des erreurs
- ✅ **Sauvegarde** automatique

## 🎯 Prochaines Améliorations

### **Fonctionnalités Futures**
- **Import/Export** des comptes bancaires
- **Historique** des modifications
- **Validation** des codes IBAN/SWIFT
- **Intégration** avec d'autres modules
- **Templates** de comptes bancaires

---

## 📞 Support

Pour toute question ou problème avec le module Banque :
1. Vérifier les logs de la console
2. Tester avec le script `test-module-banque.bat`
3. Consulter la documentation technique
4. Contacter l'équipe de développement

**Module Banque EDIBA-INTER** - Gestion professionnelle des comptes bancaires ✨
