# 🚀 **GUIDE COMPLET DÉPLOIEMENT NETLIFY + WEBSOCKET**

## 📋 **ÉTAPES POUR NETLIFY**

### **ÉTAPE 1 : Déployer le Serveur WebSocket**

#### **Option A : Railway (RECOMMANDÉ - Plus Simple)**

1. **Aller sur** : https://railway.app
2. **Créer un compte** avec GitHub
3. **Cliquer sur "New Project"**
4. **Sélectionner "Deploy from GitHub repo"**
5. **Choisir votre repository** : `KANDI-007/ediba-inter`
6. **Configurer le déploiement** :
   - **Root Directory** : `/` (racine)
   - **Build Command** : `npm install`
   - **Start Command** : `node websocket-server-production.cjs`
   - **Port** : `3001`

7. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=3001
   ```

8. **Déployer** et noter l'URL générée (ex: `https://ediba-inter-websocket-production.up.railway.app`)

#### **Option B : Vercel (Alternative)**

1. **Aller sur** : https://vercel.com
2. **Créer un compte** avec GitHub
3. **Importer le projet** depuis GitHub
4. **Configurer** :
   - **Framework Preset** : Other
   - **Build Command** : `npm install`
   - **Output Directory** : `.`
   - **Install Command** : `npm install`

5. **Créer `vercel.json`** :
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "websocket-server-production.cjs",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "websocket-server-production.cjs"
       }
     ]
   }
   ```

#### **Option C : Render (Gratuit)**

1. **Aller sur** : https://render.com
2. **Créer un compte** avec GitHub
3. **New Web Service**
4. **Connecter GitHub** et sélectionner le repo
5. **Configurer** :
   - **Name** : `ediba-inter-websocket`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node websocket-server-production.cjs`
   - **Plan** : Free

### **ÉTAPE 2 : Configurer Netlify**

1. **Aller sur** : https://app.netlify.com/projects/ediba-inter/overview

2. **Site Settings** → **Environment Variables**

3. **Ajouter ces variables** :
   ```
   VITE_WEBSOCKET_URL=https://votre-url-websocket.com
   VITE_ENVIRONMENT=production
   ```

4. **Redéployer** :
   - **Deploys** → **Trigger deploy** → **Deploy site**

### **ÉTAPE 3 : Vérifier le Déploiement**

#### **Test du Serveur WebSocket**
```bash
curl https://votre-url-websocket.com/api/health
```

#### **Test de l'Application**
1. **Aller sur** : https://ediba-inter.netlify.app
2. **Se connecter** avec un utilisateur
3. **Ouvrir un deuxième onglet** avec un autre utilisateur
4. **Tester le chat** dans le module Chat

## 🔧 **CONFIGURATION DÉTAILLÉE**

### **Variables d'Environnement Netlify**

```
VITE_WEBSOCKET_URL=https://ediba-inter-websocket-production.up.railway.app
VITE_ENVIRONMENT=production
VITE_APP_NAME=EDIBA-INTER
VITE_COMPANY_NAME=EDIBA INTER SARL U
```

### **Configuration CORS**

Le serveur WebSocket est déjà configuré pour accepter les connexions depuis :
- `https://ediba-inter.netlify.app`
- `https://*.netlify.app`
- `http://localhost:5173` (pour le développement)

## 🧪 **TEST COMPLET**

### **1. Test Local**
```bash
# Démarrer le serveur local
node websocket-server-production.cjs

# Démarrer l'application
npm run dev

# Tester sur http://localhost:5173
```

### **2. Test Production**
1. **Serveur WebSocket** : Vérifier l'URL de santé
2. **Frontend Netlify** : Vérifier les variables d'environnement
3. **Chat Multi-utilisateurs** : Tester avec deux utilisateurs

## 🎯 **RÉSULTAT ATTENDU**

Après le déploiement complet :

- ✅ **Application accessible** : https://ediba-inter.netlify.app
- ✅ **Chat fonctionnel** : Messages en temps réel
- ✅ **Multi-utilisateurs** : Plusieurs utilisateurs connectés
- ✅ **Notifications** : Alertes push
- ✅ **Appels** : Système d'appels intégré

## 🔍 **DIAGNOSTIC**

### **Problèmes Courants**

1. **CORS Error** :
   - Vérifier que l'URL WebSocket est dans la liste CORS
   - Vérifier les variables d'environnement Netlify

2. **Connexion Failed** :
   - Vérifier que le serveur WebSocket est actif
   - Vérifier l'URL dans les variables d'environnement

3. **Messages non synchronisés** :
   - Vérifier la console du navigateur
   - Vérifier les logs du serveur WebSocket

### **Logs de Production**

#### **Railway**
- Aller sur le dashboard Railway
- Section "Logs" pour voir les logs en temps réel

#### **Vercel**
```bash
vercel logs
```

#### **Render**
- Dashboard Render → Service → Logs

## 🎉 **MISSION ACCOMPLIE !**

Une fois ces étapes terminées, votre chat multi-utilisateurs fonctionnera parfaitement sur Netlify !

**URLs Finales** :
- **Frontend** : https://ediba-inter.netlify.app
- **WebSocket** : https://votre-url-websocket.com
- **API Health** : https://votre-url-websocket.com/api/health
