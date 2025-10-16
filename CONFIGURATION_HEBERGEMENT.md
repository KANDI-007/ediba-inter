# 🌐 Configuration d'Hébergement - EDIBA INTER

## 🎯 Recommandations d'Hébergement

### **Option 1 : Vercel + Supabase (RECOMMANDÉE) 🌟**

#### **Avantages**
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **CDN global** pour performance optimale
- ✅ **HTTPS automatique** et certificats SSL
- ✅ **Scaling automatique** selon la charge
- ✅ **Pricing transparent** et prévisible
- ✅ **Intégration native** avec Supabase
- ✅ **Support excellent** et documentation complète

#### **Configuration Vercel**

**1. Création du Projet**
```bash
# Installation de Vercel CLI
npm install -g vercel

# Connexion à Vercel
vercel login

# Déploiement initial
vercel

# Configuration de production
vercel --prod
```

**2. Configuration vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "VITE_APP_NAME": "EDIBA-INTER",
    "VITE_COMPANY_NAME": "EDIBA INTER SARL U"
  },
  "functions": {
    "src/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**3. Variables d'Environnement**
```bash
# Configuration des variables dans Vercel Dashboard
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_APP_NAME
vercel env add VITE_COMPANY_NAME
```

#### **Configuration Supabase**

**1. Création du Projet**
```bash
# Installation de Supabase CLI
npm install -g supabase

# Initialisation
supabase init

# Connexion
supabase login

# Création du projet
supabase projects create ediba-inter --region us-east-1
```

**2. Configuration de la Base de Données**
```sql
-- Exécuter les scripts de migration
supabase db push

-- Configuration des politiques RLS
supabase db reset --linked
```

**3. Configuration de l'Authentification**
```typescript
// Configuration Supabase Auth
const supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL,
  anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};
```

#### **Coûts Estimés**
- **Vercel** : Gratuit (0-100GB) → $20/mois (100GB+)
- **Supabase** : Gratuit (500MB) → $25/mois (8GB+)
- **Total** : **Gratuit** → **$45/mois**

---

### **Option 2 : Railway + Supabase (ÉCONOMIQUE)**

#### **Avantages**
- ✅ **Pricing très compétitif**
- ✅ **Déploiement simple** depuis GitHub
- ✅ **Support Node.js** natif
- ✅ **Base de données** PostgreSQL incluse
- ✅ **Monitoring** intégré
- ✅ **Scaling automatique**

#### **Configuration Railway**

**1. Création du Projet**
```bash
# Installation de Railway CLI
npm install -g @railway/cli

# Connexion
railway login

# Déploiement
railway up
```

**2. Configuration railway.json**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**3. Variables d'Environnement**
```bash
# Configuration des variables
railway variables set VITE_SUPABASE_URL=your-url
railway variables set VITE_SUPABASE_ANON_KEY=your-key
railway variables set NODE_ENV=production
```

#### **Coûts Estimés**
- **Railway** : $5/mois (démarrage) → $20/mois (production)
- **Supabase** : Gratuit (500MB) → $25/mois (8GB+)
- **Total** : **$5/mois** → **$45/mois**

---

### **Option 3 : AWS + Supabase (ENTREPRISE)**

#### **Avantages**
- ✅ **Infrastructure robuste** et scalable
- ✅ **Contrôle total** de l'environnement
- ✅ **Sécurité** de niveau entreprise
- ✅ **Support 24/7** professionnel
- ✅ **Conformité** et certifications
- ✅ **Intégration** avec l'écosystème AWS

#### **Configuration AWS**

**1. Services AWS Utilisés**
- **EC2** : Instance pour l'application
- **RDS** : Base de données PostgreSQL (optionnel)
- **S3** : Stockage de fichiers
- **CloudFront** : CDN global
- **Route 53** : DNS
- **Certificate Manager** : Certificats SSL
- **Load Balancer** : Répartition de charge

**2. Configuration EC2**
```bash
# Instance recommandée
Instance Type: t3.medium (2 vCPU, 4 GB RAM)
Storage: 20 GB SSD
OS: Ubuntu 22.04 LTS

# Installation des dépendances
sudo apt update
sudo apt install nodejs npm nginx certbot

# Configuration Nginx
sudo nano /etc/nginx/sites-available/ediba-inter
```

**3. Configuration Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    root /var/www/ediba-inter/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**4. Configuration SSL**
```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Génération du certificat SSL
sudo certbot --nginx -d your-domain.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### **Coûts Estimés**
- **EC2 t3.medium** : $30/mois
- **RDS db.t3.micro** : $15/mois (optionnel)
- **S3** : $5/mois
- **CloudFront** : $10/mois
- **Route 53** : $1/mois
- **Supabase** : $25/mois (8GB+)
- **Total** : **$86/mois** → **$200/mois**

---

## 🔧 Configuration de Production

### **1. Variables d'Environnement de Production**

```bash
# .env.production
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
VITE_ENABLE_ANALYTICS=true

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application
VITE_APP_NAME=EDIBA-INTER
VITE_COMPANY_NAME=EDIBA INTER SARL U
VITE_COMPANY_ADDRESS=123 Avenue de la Paix, Lomé, Togo
VITE_COMPANY_PHONE=+228 12 34 56 78
VITE_COMPANY_EMAIL=contact@edibainter.com

# Sécurité
VITE_ENCRYPTION_KEY=your-production-encryption-key
VITE_SESSION_TIMEOUT=3600000

# Performance
VITE_DB_BACKUP_INTERVAL=86400000
VITE_REPORT_CACHE_DURATION=3600000
```

### **2. Configuration de Sécurité**

#### **Headers de Sécurité**
```nginx
# Nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

#### **Configuration CORS**
```typescript
// Backend CORS configuration
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com',
    'https://ediba-inter.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### **3. Configuration de Monitoring**

#### **Métriques à Surveiller**
- **Uptime** : Disponibilité de l'application
- **Response Time** : Temps de réponse des API
- **Error Rate** : Taux d'erreur des requêtes
- **User Activity** : Utilisateurs actifs
- **Database Performance** : Performance de la base de données

#### **Outils de Monitoring**
```typescript
// Configuration Sentry pour le monitoring des erreurs
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🚀 Scripts de Déploiement

### **1. Script de Déploiement Vercel**
```bash
#!/bin/bash
# deploy-vercel.sh

echo "🚀 Déploiement EDIBA INTER sur Vercel..."

# Vérifier que nous sommes sur la branche main
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Exécuter les tests
echo "🧪 Exécution des tests..."
npm run test:run

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé!"
```

### **2. Script de Déploiement Railway**
```bash
#!/bin/bash
# deploy-railway.sh

echo "🚀 Déploiement EDIBA INTER sur Railway..."

# Vérifier les variables d'environnement
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Erreur: VITE_SUPABASE_URL n'est pas définie"
    exit 1
fi

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Déploiement sur Railway
echo "🚀 Déploiement sur Railway..."
railway up

echo "✅ Déploiement terminé!"
```

### **3. Script de Déploiement AWS**
```bash
#!/bin/bash
# deploy-aws.sh

echo "🚀 Déploiement EDIBA INTER sur AWS..."

# Variables
SERVER_USER="ubuntu"
SERVER_HOST="your-ec2-instance.com"
APP_DIR="/var/www/ediba-inter"

# Build local
echo "🔨 Build local..."
npm run build

# Upload des fichiers
echo "📤 Upload des fichiers..."
rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:$APP_DIR/

# Restart des services
echo "🔄 Redémarrage des services..."
ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "✅ Déploiement terminé!"
```

---

## 📊 Comparaison des Options

| Critère | Vercel + Supabase | Railway + Supabase | AWS + Supabase |
|---------|-------------------|-------------------|----------------|
| **Coût** | Gratuit → $45/mois | $5 → $45/mois | $86 → $200/mois |
| **Complexité** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Sécurité** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalabilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recommandation Finale

### **🏆 VERCEL + SUPABASE**

**Pourquoi ce choix ?**
1. **Simplicité** : Déploiement en quelques clics
2. **Performance** : CDN global + base de données optimisée
3. **Coût** : Gratuit au démarrage, scaling transparent
4. **Sécurité** : Niveau entreprise avec moins de complexité
5. **Maintenance** : Services gérés, focus sur le développement
6. **Évolutivité** : Prêt pour la croissance

### **Prochaines Étapes**
1. **Création** des comptes Vercel et Supabase
2. **Configuration** des projets et variables
3. **Déploiement** de l'application
4. **Tests** de performance et sécurité
5. **Formation** des utilisateurs

---

**🚀 Votre application EDIBA INTER sera hébergée de manière professionnelle et scalable !**
