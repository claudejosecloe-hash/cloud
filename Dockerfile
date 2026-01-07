# 1. Utiliser une image Node officielle
FROM node:18-alpine

# 2. Définir le dossier de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers package.json (s’il y en a)
COPY package.json ./

# 4. Installer les dépendances (ici il n’y en a pas mais c’est standard)
RUN npm install

# 5. Copier le reste du code
COPY . .

# 6. Exposer le port utilisé par l'application
EXPOSE 3000

# 7. Lancer l’application
CMD ["node", "app.js"]
