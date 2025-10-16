# 📊 **Guide de Migration des Données - EDIBA INTER**

## 🎯 **Objectif**

Migrer toutes les données de votre application EDIBA INTER actuelle (stockées en LocalStorage) vers la base de données Supabase.

---

## 📋 **Prérequis**

### **✅ Configuration Terminée**
- [x] Backend Supabase configuré et fonctionnel
- [x] Base de données Supabase créée avec le schéma
- [x] Variables d'environnement configurées
- [x] Scripts de migration créés

### **📁 Fichiers Disponibles**
- `scripts/export-data.js` - Script d'exportation des données
- `supabase-setup/scripts/migrate-from-export.js` - Script de migration
- `scripts/test-migration.js` - Script de test
- `data-export-example.json` - Exemple de structure de données

---

## 🚀 **Étapes de Migration**

### **Étape 1 : Exportation des Données**

#### **1.1. Préparer l'Export**

```bash
# Créer le fichier d'exemple (optionnel)
npm run export-data
```

#### **1.2. Exporter depuis l'Application**

1. **Ouvrir votre application EDIBA INTER** dans le navigateur
2. **Ouvrir la console** (F12 → Console)
3. **Copier et exécuter** le code suivant :

```javascript
// Code d'exportation à exécuter dans la console du navigateur
const exportData = {
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  data: {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    clients: JSON.parse(localStorage.getItem('clients') || '[]'),
    suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
    articles: JSON.parse(localStorage.getItem('articles') || '[]'),
    articleCategories: JSON.parse(localStorage.getItem('articleCategories') || '[]'),
    documents: JSON.parse(localStorage.getItem('documents') || '[]'),
    lineItems: JSON.parse(localStorage.getItem('lineItems') || '[]'),
    payments: JSON.parse(localStorage.getItem('payments') || '[]'),
    discharges: JSON.parse(localStorage.getItem('discharges') || '[]'),
    conversations: JSON.parse(localStorage.getItem('conversations') || '[]'),
    messages: JSON.parse(localStorage.getItem('messages') || '[]'),
    activities: JSON.parse(localStorage.getItem('activities') || '[]'),
    notifications: JSON.parse(localStorage.getItem('notifications') || '[]')
  }
};

// Télécharger le fichier
const dataStr = JSON.stringify(exportData, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'ediba-inter-export-' + new Date().toISOString().split('T')[0] + '.json';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);

console.log('✅ Données exportées avec succès !');
```

4. **Sauvegarder le fichier** `ediba-inter-export-YYYY-MM-DD.json`

#### **1.3. Placer le Fichier d'Export**

```bash
# Créer le dossier data s'il n'existe pas
mkdir data

# Placer votre fichier d'export dans le dossier data
# Exemple : data/ediba-inter-export-2024-10-08.json
```

### **Étape 2 : Test de la Migration**

#### **2.1. Tester la Connexion**

```bash
# Tester la connexion à Supabase
npm run test-migration
```

**Résultat attendu :**
```
✅ Connexion à Supabase réussie
✅ users: 6 enregistrements
✅ clients: 5 enregistrements
✅ articles: 5 enregistrements
...
```

#### **2.2. Vérifier les Données Existantes**

Le script de test affichera :
- Le nombre d'enregistrements dans chaque table
- Les utilisateurs, clients et articles existants
- Les relations entre les tables

### **Étape 3 : Migration des Données**

#### **3.1. Exécuter la Migration**

```bash
# Migrer les données (remplacer par le chemin de votre fichier)
npm run migrate-data data/ediba-inter-export-2024-10-08.json
```

**Résultat attendu :**
```
🚀 Début de la migration des données...
📁 Fichier d'export lu : data/ediba-inter-export-2024-10-08.json
🔄 Migration de X utilisateurs...
✅ Utilisateur alayi migré
✅ Utilisateur esso migré
...
✅ Migration terminée avec succès !
```

#### **3.2. Vérifier la Migration**

```bash
# Tester après migration
npm run test-migration
```

### **Étape 4 : Validation Complète**

#### **4.1. Tests Fonctionnels**

1. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

2. **Se connecter** avec vos identifiants existants

3. **Vérifier les données** :
   - ✅ Utilisateurs présents
   - ✅ Clients et fournisseurs migrés
   - ✅ Articles et catégories disponibles
   - ✅ Documents et factures conservés
   - ✅ Historique des activités préservé

#### **4.2. Tests de Performance**

- ✅ Temps de chargement acceptable
- ✅ Recherche et filtres fonctionnels
- ✅ Création de nouveaux documents
- ✅ Génération de rapports

---

## 🔧 **Dépannage**

### **Problème : Erreur de Connexion Supabase**

```bash
# Vérifier les variables d'environnement
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Ou vérifier le fichier .env.local
type .env.local
```

### **Problème : Données Non Migrées**

1. **Vérifier le format du fichier d'export** :
   ```bash
   # Vérifier la structure JSON
   node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('data/ediba-inter-export-YYYY-MM-DD.json', 'utf8')), null, 2))"
   ```

2. **Vérifier les logs de migration** :
   - Chercher les erreurs spécifiques
   - Vérifier les contraintes de clés étrangères

### **Problème : Données Dupliquées**

```sql
-- Nettoyer les doublons (à exécuter dans Supabase SQL Editor)
DELETE FROM users WHERE id IN (
  SELECT id FROM users 
  GROUP BY id HAVING COUNT(*) > 1
);
```

### **Problème : Relations Cassées**

```sql
-- Vérifier les relations
SELECT 
  a.name as article,
  c.name as category
FROM articles a
LEFT JOIN article_categories c ON a.category_id = c.id
WHERE c.id IS NULL;
```

---

## 📊 **Structure des Données Migrées**

### **Tables Principales**
- **users** : Utilisateurs de l'application
- **clients** : Clients et prospects
- **suppliers** : Fournisseurs
- **articles** : Catalogue d'articles
- **article_categories** : Catégories d'articles
- **documents** : Factures, devis, bons de livraison
- **line_items** : Lignes de documents
- **payments** : Paiements reçus
- **discharges** : Décharges et reçus

### **Tables de Communication**
- **conversations** : Conversations de chat
- **messages** : Messages de chat
- **activities** : Journal des activités
- **notifications** : Notifications utilisateurs

---

## ✅ **Checklist de Validation**

### **Avant Migration**
- [ ] Sauvegarde de l'application actuelle
- [ ] Export des données réussi
- [ ] Test de connexion Supabase
- [ ] Vérification des variables d'environnement

### **Pendant Migration**
- [ ] Script de migration exécuté sans erreur
- [ ] Tous les enregistrements migrés
- [ ] Relations entre tables préservées
- [ ] Contraintes de base de données respectées

### **Après Migration**
- [ ] Application démarre correctement
- [ ] Connexion utilisateur fonctionnelle
- [ ] Données affichées correctement
- [ ] Fonctionnalités principales opérationnelles
- [ ] Performance acceptable
- [ ] Tests de régression passés

---

## 🎯 **Prochaines Étapes**

Une fois la migration terminée :

1. **Tests complets** de l'application
2. **Formation** des utilisateurs sur les nouvelles fonctionnalités
3. **Déploiement** en production
4. **Sauvegarde** régulière des données Supabase
5. **Monitoring** des performances

---

## 📞 **Support**

En cas de problème :

1. **Consulter les logs** de migration
2. **Vérifier la documentation** Supabase
3. **Tester** chaque composant individuellement
4. **Restaurer** depuis la sauvegarde si nécessaire

**🎉 Votre migration EDIBA INTER vers Supabase est maintenant prête !**
