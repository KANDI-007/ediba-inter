# 🚀 **Guide de Démarrage Rapide - EDIBA INTER**

## ⚡ **Démarrage en Une Commande**

### **Windows**
```bash
npm run start:all
```
ou double-cliquez sur `start-all.bat`

### **Linux/Mac**
```bash
npm run start:all:unix
```
ou
```bash
./start-all.sh
```

---

## 🔧 **Démarrage Manuel**

### **1. Terminal 1 - Backend**
```bash
npm run start:backend
```

### **2. Terminal 2 - Frontend**
```bash
npm run dev
```

---

## 🌐 **URLs d'Accès**

- **Frontend** : http://localhost:5173 (ou 5174)
- **Backend API** : http://localhost:3000
- **Health Check** : http://localhost:3000/health
- **Socket.IO** : http://localhost:3000 (WebSocket actif)

---

## 🐛 **Résolution des Problèmes**

### **Erreur WebSocket**
Si vous voyez des erreurs WebSocket dans la console :
1. Vérifiez que le backend est démarré : `curl http://localhost:3000/health`
2. Redémarrez le backend : `npm run start:backend`
3. Actualisez la page frontend

### **Port Occupé**
Si le port 3000 ou 5173 est occupé :
1. Arrêtez les processus existants
2. Changez le port dans la configuration
3. Redémarrez les serveurs

### **Variables d'Environnement**
Assurez-vous que le fichier `.env.local` existe et contient :
```
VITE_SUPABASE_URL=https://edsvbvttpcvslewomwyk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📱 **Fonctionnalités Disponibles**

### **✅ Fonctionnel**
- ✅ Authentification utilisateur
- ✅ Gestion des clients et fournisseurs
- ✅ Catalogue d'articles avec catégories
- ✅ Création de documents (devis, factures)
- ✅ Système de chat en temps réel
- ✅ Rapports et statistiques
- ✅ PWA (Progressive Web App)

### **🔄 En Migration**
- 🔄 Migration des données vers Supabase
- 🔄 API backend complète
- 🔄 Déploiement en production

---

## 🎯 **Prochaines Étapes**

1. **Tester l'application** : Naviguez dans toutes les sections
2. **Exporter vos données** : Utilisez le script d'exportation
3. **Migrer vers Supabase** : Suivez le guide de migration
4. **Déployer en production** : Utilisez Vercel + Supabase

---

## 📞 **Support**

En cas de problème :
1. Consultez les logs dans la console
2. Vérifiez que tous les services sont démarrés
3. Consultez la documentation dans `/docs`
4. Vérifiez les variables d'environnement

**🎉 Votre application EDIBA INTER est prête !**
