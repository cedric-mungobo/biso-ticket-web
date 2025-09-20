#!/bin/bash
# update.sh

echo "🔄 Mise à jour du site..."

# Sauvegarder les fichiers personnalisés s'ils existent
if [ -d "api" ]; then
    echo "📦 Sauvegarde du dossier api..."
    cp -r api api_backup_$(date +%Y%m%d_%H%M%S)
fi

# Récupérer les dernières modifications
echo "⬇️ Récupération des dernières modifications..."
git fetch origin

# Appliquer les modifications
echo "🔄 Application des modifications..."
git reset --hard origin/main

# Restaurer les fichiers personnalisés si nécessaire
if [ -d "api_backup_$(date +%Y%m%d_%H%M%S)" ]; then
    echo "📦 Restauration du dossier api..."
    # Décommentez la ligne suivante si vous voulez restaurer api
    # cp -r api_backup_* api
fi

echo "✅ Mise à jour terminée !"
