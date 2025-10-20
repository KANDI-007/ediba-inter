# Dockerfile spécifique pour Railway - Serveur WebSocket
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./
COPY websocket-production-package.json ./package.json

# Installer les dépendances
RUN npm install

# Copier le serveur WebSocket
COPY websocket-server-production.cjs ./

# Exposer le port (Railway utilise la variable PORT)
EXPOSE 3001

# Commande de démarrage
CMD ["node", "websocket-server-production.cjs"]
