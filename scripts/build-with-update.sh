#!/bin/bash
# Script de build qui inclut le fichier update.sh

echo "🔨 Construction du projet..."

# Construire le projet
npm run build

# Copier le fichier update.sh dans le dossier de build
echo "📋 Copie du fichier update.sh..."
cp output/update.sh .output/public/update.sh

# Rendre le fichier exécutable
chmod +x .output/public/update.sh

echo "✅ Build terminé avec update.sh inclus !"
