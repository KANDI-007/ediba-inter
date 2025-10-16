# 🧪 **Guide de Test Complet - EDIBA INTER**

## 🎯 **État Actuel du Projet**

### **✅ Backend Supabase**
- **Status** : ✅ Fonctionnel
- **URL** : `http://localhost:3000`
- **Base de données** : 6 utilisateurs détectés
- **API Routes** : Toutes créées et fonctionnelles

### **✅ Frontend React**
- **Status** : ✅ Fonctionnel  
- **URL** : `http://localhost:5174`
- **Configuration** : Variables d'environnement configurées

---

## 🚀 **Instructions de Test**

### **1. Démarrer le Backend**

```bash
cd supabase-setup
node simple-server.js
```

**Vérification :**
- ✅ Serveur démarre sur le port 3000
- ✅ Message : "🚀 Serveur de test démarré sur le port 3000"

### **2. Tester l'API Backend**

```bash
# Test de santé
curl http://localhost:3000/health

# Test de connexion Supabase
curl http://localhost:3000/test-supabase
```

**Résultats attendus :**
- ✅ Health check : `{"status":"OK","message":"Serveur fonctionne"}`
- ✅ Supabase : `{"status":"OK","message":"Connexion Supabase réussie","data":[{"count":6}]}`

### **3. Démarrer le Frontend**

```bash
# Dans un nouveau terminal
npm run dev
```

**Vérification :**
- ✅ Application démarre sur `http://localhost:5174`
- ✅ Interface utilisateur s'affiche correctement

### **4. Tester l'Intégration**

1. **Ouvrir l'application** : `http://localhost:5174`
2. **Se connecter** avec les identifiants de test :
   - **Admin** : `alayi` / `Alayi7@`
   - **Comptable** : `esso` / `Esso28@`
   - **Commercial** : `gloria` / `Gloria127@`

3. **Tester les fonctionnalités** :
   - ✅ Navigation entre les modules
   - ✅ Gestion des articles et catégories
   - ✅ Gestion des clients et fournisseurs
   - ✅ Création de documents (factures, devis)
   - ✅ Système de chat
   - ✅ Rapports et statistiques

---

## 🔧 **Configuration des Variables d'Environnement**

### **Backend (.env)**
```env
SUPABASE_URL=https://edsvbvttpcvslewomwyk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

### **Frontend (.env.local)**
```env
VITE_SUPABASE_URL=https://edsvbvttpcvslewomwyk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000/api
```

---

## 📊 **Données de Test Disponibles**

### **Utilisateurs**
- **alayi** (Admin) - `Alayi7@`
- **esso** (Comptable) - `Esso28@`
- **gloria** (Commercial) - `Gloria127@`
- **paul** (Commercial) - `Paul832@`
- **gym** (Lecture) - `Gym74@`
- **sam** (Comptable) - `Sam384@`

### **Clients**
- SOCIETE GENERALE DU TOGO
- ORANGE TOGO
- MINISTERE DE LA SANTE
- UNIVERSITE DE LOME
- ENTREPRISE GENERALE DU BATIMENT

### **Articles**
- Bureau en bois massif (150,000 FCFA)
- Chaise ergonomique (75,000 FCFA)
- Ordinateur portable (450,000 FCFA)
- Imprimante laser (120,000 FCFA)
- Papier A4 (2,500 FCFA)

---

## 🎯 **Prochaines Étapes**

### **Phase 1 : Tests Complets** ✅
- [x] Backend API fonctionnel
- [x] Connexion Supabase réussie
- [x] Frontend configuré
- [ ] Tests d'intégration complets

### **Phase 2 : Migration des Données**
- [ ] Exporter les données existantes
- [ ] Importer dans Supabase
- [ ] Vérifier l'intégrité des données

### **Phase 3 : Déploiement Production**
- [ ] Déployer le backend sur Railway/Heroku
- [ ] Déployer le frontend sur Vercel
- [ ] Configurer les domaines personnalisés

---

## 🚨 **Dépannage**

### **Problème : Backend ne démarre pas**
```bash
# Vérifier les variables d'environnement
node test-server.js

# Redémarrer avec dotenv
node -r dotenv/config dist/index.js
```

### **Problème : Frontend ne se connecte pas**
```bash
# Vérifier le fichier .env.local
type .env.local

# Redémarrer le serveur de développement
npm run dev
```

### **Problème : Erreur Supabase**
- Vérifier que les migrations SQL ont été appliquées
- Vérifier les clés API dans le dashboard Supabase
- Utiliser la clé service role pour les opérations admin

---

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur
2. Testez chaque composant individuellement
3. Consultez la documentation Supabase
4. Vérifiez la configuration des variables d'environnement

**🎉 Votre application EDIBA INTER est maintenant prête pour les tests !**
