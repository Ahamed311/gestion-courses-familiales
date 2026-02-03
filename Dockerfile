# Dockerfile simple pour la production
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package.json
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Installer les dépendances
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci --only=production

# Copier le code source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer les ports
EXPOSE 3000 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]