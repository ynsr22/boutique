# ---- Étape 1 : Builder ----
FROM node:18-alpine AS builder

# Crée un répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source
COPY . .

# Build de l'application Next.js
RUN npm run build

# ---- Étape 2 : Runner ----
FROM node:18-alpine AS runner

# Crée un répertoire de travail
WORKDIR /app

# Copie uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Déclare le port sur lequel Next.js va écouter
EXPOSE 3000

# Démarre l'application en mode production
CMD ["npm", "run", "start"]
