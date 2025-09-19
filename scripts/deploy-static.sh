#!/bin/bash

# Script de déploiement pour hébergement mutualisé
# Biso Ticket - Déploiement de fichiers statiques

echo "🚀 Déploiement de Biso Ticket sur hébergement mutualisé..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "nuxt.config.ts" ]; then
    echo -e "${RED}❌ Erreur: Veuillez exécuter ce script depuis la racine du projet${NC}"
    exit 1
fi

# Nettoyer les builds précédents
echo -e "${YELLOW}🧹 Nettoyage des builds précédents...${NC}"
rm -rf .nuxt dist .output

# Installer les dépendances
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
npm ci

# Générer le site statique
echo -e "${YELLOW}🔨 Génération du site statique...${NC}"
npm run generate

# Vérifier que la génération a réussi
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erreur: La génération a échoué. Le dossier 'dist' n'existe pas.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Génération terminée avec succès!${NC}"

# Afficher les fichiers générés
echo -e "${YELLOW}📁 Fichiers générés dans le dossier 'dist':${NC}"
ls -la dist/

# Instructions de déploiement
echo -e "${GREEN}📋 Instructions de déploiement:${NC}"
echo "1. Uploadez TOUT le contenu du dossier 'dist/' vers votre hébergement mutualisé"
echo "2. Assurez-vous que le fichier .htaccess est bien uploadé"
echo "3. Vérifiez que votre hébergement supporte la réécriture d'URL (mod_rewrite)"
echo "4. Testez les pages statiques et dynamiques"

echo -e "${GREEN}🎉 Prêt pour le déploiement!${NC}"
