# 🚀 Déploiement Automatique GitHub → Netlify

## 📋 Vue d'ensemble

Ce guide vous permet de configurer le déploiement automatique de votre application EDIBA INTER depuis GitHub vers Netlify.

---

## 🎯 Configuration en 3 Étapes

### ✅ Étape 1 : Configuration GitHub

#### 1.1 Vérifier que votre code est sur GitHub

```bash
# Vérifier la remote
git remote -v

# Si pas de remote, ajouter GitHub
git remote add origin https://github.com/KANDI-007/ediba-inter.git
git branch -M main
git push -u origin main
```

#### 1.2 Le workflow GitHub Actions est déjà créé

Le fichier `.github/workflows/netlify-deploy.yml` est déjà configuré pour :
- ✅ Build automatique sur push vers `main`
- ✅ Déploiement automatique vers Netlify

---

### ✅ Étape 2 : Configuration Netlify

#### 2.1 Méthode A : Connexion GitHub Directe (RECOMMANDÉE) ⭐

1. **Connecter le dépôt GitHub à Netlify :**
   - Aller sur [https://app.netlify.com/projects/ediba-inter/](https://app.netlify.com/projects/ediba-inter/)
   - Cliquer sur **"Site settings"** ou **"Configuration"**
   - Aller dans **"Build & deploy"** → **"Continuous Deployment"**
   - Cliquer sur **"Link repository"** ou **"Edit settings"**
   - Sélectionner **GitHub** comme provider
   - Autoriser Netlify à accéder à votre compte GitHub
   - Sélectionner le dépôt : `KANDI-007/ediba-inter`
   - Choisir la branche : `main`

2. **Configuration du build :**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

3. **Variables d'environnement (si nécessaire) :**
   - Aller dans **"Environment variables"**
   - Ajouter les variables nécessaires :
     - `NODE_ENV=production`
     - Autres variables si nécessaire

4. **Sauvegarder :**
   - Cliquer sur **"Deploy site"**

✅ **Résultat :** Chaque push sur `main` déclenchera automatiquement un déploiement sur Netlify !

#### 2.2 Méthode B : GitHub Actions avec Netlify CLI

Si vous préférez utiliser GitHub Actions, vous devez configurer les secrets :

1. **Obtenir le Netlify Auth Token :**
   - Aller sur [https://app.netlify.com/user/applications](https://app.netlify.com/user/applications)
   - Cliquer sur **"New access token"**
   - Donner un nom (ex: "GitHub Actions")
   - Copier le token généré

2. **Obtenir le Site ID :**
   - Aller sur [https://app.netlify.com/projects/ediba-inter/](https://app.netlify.com/projects/ediba-inter/)
   - Cliquer sur **"Site settings"**
   - Dans **"General"**, copier le **"Site ID"**

3. **Ajouter les secrets sur GitHub :**
   - Aller sur [https://github.com/KANDI-007/ediba-inter/settings/secrets/actions](https://github.com/KANDI-007/ediba-inter/settings/secrets/actions)
   - Cliquer sur **"New repository secret"**
   - Ajouter :
     - **Name**: `NETLIFY_AUTH_TOKEN`
     - **Value**: Le token Netlify copié
   - Ajouter :
     - **Name**: `NETLIFY_SITE_ID`
     - **Value**: Le Site ID copié

✅ **Résultat :** Le workflow GitHub Actions déploiera automatiquement sur Netlify !

---

### ✅ Étape 3 : Déploiement Automatique

#### 3.1 Script de déploiement local

Utilisez le script créé pour déployer facilement :

```bash
deploy-github-netlify-auto.bat
```

Ce script :
1. ✅ Build l'application
2. ✅ Ajoute tous les fichiers à Git
3. ✅ Crée un commit
4. ✅ Push vers GitHub
5. ✅ Netlify déploie automatiquement !

#### 3.2 Déploiement manuel

```bash
# Build
npm run build

# Git
git add .
git commit -m "Update app"
git push origin main

# Netlify déploie automatiquement !
```

---

## 🔍 Vérification du Déploiement

### Sur Netlify :
1. Aller sur [https://app.netlify.com/projects/ediba-inter/](https://app.netlify.com/projects/ediba-inter/)
2. Vérifier les **"Deploys"** dans l'onglet **"Deploys"**
3. Le statut devrait être **"Published"** ✅

### Sur GitHub :
1. Aller sur [https://github.com/KANDI-007/ediba-inter](https://github.com/KANDI-007/ediba-inter)
2. Cliquer sur **"Actions"**
3. Vérifier que les workflows se déclenchent correctement

---

## 📊 Configuration Actuelle

### Netlify (`netlify.toml`)
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

### GitHub Actions (`.github/workflows/netlify-deploy.yml`)
- ✅ Déclenchement sur push vers `main`
- ✅ Build avec Node.js 18
- ✅ Déploiement automatique vers Netlify

---

## 🎯 Workflow Complet

```
1. Modification du code
   ↓
2. Build local (optionnel)
   ↓
3. Git commit & push
   ↓
4. GitHub reçoit le push
   ↓
5. Netlify détecte le changement (Méthode A)
   OU
   GitHub Actions se déclenche (Méthode B)
   ↓
6. Build automatique sur Netlify/GitHub
   ↓
7. Déploiement sur Netlify
   ↓
8. ✅ Application disponible !
```

---

## 🐛 Résolution de Problèmes

### Problème : Netlify ne déploie pas automatiquement

**Solution :**
1. Vérifier que le dépôt GitHub est bien connecté à Netlify
2. Vérifier la branche configurée (`main`)
3. Vérifier les paramètres de build (commande, dossier)
4. Vérifier les logs dans Netlify → Deploys → Latest deploy → Deploy log

### Problème : Build échoue sur Netlify

**Solution :**
1. Vérifier que `package.json` contient `"build": "vite build"`
2. Vérifier que `dist/` est bien généré
3. Vérifier les variables d'environnement si nécessaire
4. Vérifier les logs d'erreur dans Netlify

### Problème : GitHub Actions ne se déclenche pas

**Solution :**
1. Vérifier que les secrets sont configurés (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`)
2. Vérifier que le fichier `.github/workflows/netlify-deploy.yml` existe
3. Vérifier que vous poussez sur la branche `main`
4. Vérifier les logs dans GitHub → Actions

---

## ✅ Checklist de Déploiement

- [ ] Dépôt GitHub créé et configuré
- [ ] Code pushé sur GitHub
- [ ] Netlify connecté au dépôt GitHub (Méthode A)
- [ ] OU Secrets GitHub configurés (Méthode B)
- [ ] Script `deploy-github-netlify-auto.bat` créé
- [ ] Workflow GitHub Actions créé
- [ ] Test de déploiement effectué
- [ ] Application accessible sur Netlify ✅

---

## 🎉 Résultat Final

Une fois configuré, chaque modification pushée sur GitHub déclenchera automatiquement :
1. ✅ Build de l'application
2. ✅ Déploiement sur Netlify
3. ✅ Application mise à jour en production

**C'est tout ! Votre application se met à jour automatiquement !** 🚀

---

## 📞 Support

Pour toute question ou problème :
- **Documentation Netlify**: [https://docs.netlify.com/](https://docs.netlify.com/)
- **Documentation GitHub Actions**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Dépôt GitHub**: [https://github.com/KANDI-007/ediba-inter](https://github.com/KANDI-007/ediba-inter)

**Date de création**: Janvier 2025  
**Statut**: ✅ Configuration complète

