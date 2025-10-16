# Guide de Déploiement - EDIBA-INTER

## Vue d'ensemble

Ce guide décrit les différentes méthodes de déploiement de l'application EDIBA-INTER.

## Prérequis

- Node.js 18+ 
- npm ou yarn
- Docker (optionnel)
- Serveur web (nginx, Apache, etc.)

## Méthodes de Déploiement

### 1. Déploiement avec Docker (Recommandé)

#### Construction de l'Image
```bash
# Cloner le projet
git clone <repository-url>
cd EDIBA-INTER/project

# Construire l'image Docker
docker build -t ediba-inter:latest .

# Vérifier l'image
docker images ediba-inter
```

#### Déploiement avec Docker Compose
```bash
# Démarrer les services
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f ediba-inter
```

#### Configuration des Variables d'Environnement
```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer les variables
nano .env
```

Variables importantes à configurer :
```env
VITE_APP_NAME=EDIBA-INTER
VITE_COMPANY_NAME=EDIBA INTER SARL U
VITE_COMPANY_ADDRESS=123 Avenue de la Paix, Lomé, Togo
VITE_COMPANY_PHONE=+228 12 34 56 78
VITE_COMPANY_EMAIL=contact@edibainter.com
VITE_ENCRYPTION_KEY=your-secure-encryption-key-here
```

### 2. Déploiement Manuel

#### Construction de l'Application
```bash
# Installer les dépendances
npm install

# Construire pour la production
npm run build

# Vérifier le build
ls -la dist/
```

#### Déploiement sur Serveur Web
```bash
# Copier les fichiers buildés
scp -r dist/* user@server:/var/www/html/

# Ou utiliser rsync
rsync -avz dist/ user@server:/var/www/html/
```

#### Configuration Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Gestion du routing côté client
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA
    location /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### 3. Déploiement avec CI/CD

#### GitHub Actions
```yaml
name: Deploy EDIBA-INTER

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      run: |
        # Script de déploiement personnalisé
        ./deploy.sh
```

#### Script de Déploiement
```bash
#!/bin/bash
# deploy.sh

echo "Déploiement de EDIBA-INTER..."

# Construire l'application
npm run build

# Créer une sauvegarde
cp -r /var/www/html /var/www/html.backup.$(date +%Y%m%d_%H%M%S)

# Déployer
rsync -avz --delete dist/ /var/www/html/

# Redémarrer nginx
sudo systemctl reload nginx

echo "Déploiement terminé!"
```

## Configuration de Production

### Variables d'Environnement de Production
```env
# Production
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
VITE_ENABLE_ANALYTICS=true

# Sécurité
VITE_ENCRYPTION_KEY=your-production-encryption-key
VITE_SESSION_TIMEOUT=3600000

# Performance
VITE_DB_BACKUP_INTERVAL=86400000
VITE_REPORT_CACHE_DURATION=3600000
```

### Configuration de Sécurité

#### Headers de Sécurité
```nginx
# Ajouter dans nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
```

#### HTTPS (Recommandé)
```bash
# Obtenir un certificat SSL avec Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Ou configurer manuellement
ssl_certificate /path/to/certificate.crt;
ssl_certificate_key /path/to/private.key;
```

### Monitoring et Logs

#### Configuration des Logs
```bash
# Créer le répertoire des logs
sudo mkdir -p /var/log/ediba-inter

# Configurer la rotation des logs
sudo nano /etc/logrotate.d/ediba-inter
```

Configuration logrotate :
```
/var/log/ediba-inter/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

#### Monitoring avec Prometheus
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana
```

## Maintenance

### Sauvegarde des Données
```bash
#!/bin/bash
# backup.sh

# Créer une sauvegarde des données localStorage
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/ediba-inter"
mkdir -p $BACKUP_DIR

# Exporter les données depuis l'application
curl -X GET "http://localhost:3000/api/backup" \
  -H "Authorization: Bearer $API_TOKEN" \
  -o "$BACKUP_DIR/backup_$DATE.json"

# Compresser la sauvegarde
gzip "$BACKUP_DIR/backup_$DATE.json"

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find $BACKUP_DIR -name "backup_*.json.gz" -mtime +30 -delete
```

### Mise à Jour
```bash
#!/bin/bash
# update.sh

echo "Mise à jour de EDIBA-INTER..."

# Sauvegarder avant mise à jour
./backup.sh

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install

# Construire la nouvelle version
npm run build

# Redémarrer les services
docker-compose restart

echo "Mise à jour terminée!"
```

### Surveillance
```bash
# Vérifier le statut des services
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h

# Vérifier les processus
ps aux | grep nginx
```

## Dépannage

### Problèmes Courants

#### Application ne se charge pas
```bash
# Vérifier les logs nginx
sudo tail -f /var/log/nginx/error.log

# Vérifier la configuration nginx
sudo nginx -t

# Redémarrer nginx
sudo systemctl restart nginx
```

#### Erreurs de permissions
```bash
# Corriger les permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

#### Problèmes de cache
```bash
# Vider le cache du navigateur
# Ou redémarrer nginx
sudo systemctl reload nginx
```

### Logs de Débogage
```bash
# Activer les logs de débogage
export VITE_DEBUG_MODE=true
export VITE_LOG_LEVEL=debug

# Redémarrer l'application
docker-compose restart
```

## Support

Pour toute question ou problème de déploiement :
- **Email** : kandilare20@gmail.com
- **Téléphone** : +228 91 67 61 67
- **Documentation** : Voir README.md et docs/
