# Guide de déploiement - Biso Ticket

## Déploiement sur hébergement mutualisé

### Prérequis
- Hébergement mutualisé avec support PHP/Apache
- Support de la réécriture d'URL (mod_rewrite)
- Accès FTP/SFTP ou panneau de contrôle

### Étapes de déploiement

#### 1. Génération des fichiers statiques
```bash
# Exécuter le script de déploiement
./scripts/deploy-static.sh

# Ou manuellement
npm run generate
```

#### 2. Upload des fichiers
1. Uploadez **tout le contenu** du dossier `dist/` vers votre hébergement
2. Assurez-vous que le fichier `.htaccess` est bien uploadé
3. Vérifiez que les permissions sont correctes (644 pour les fichiers, 755 pour les dossiers)

#### 3. Configuration du serveur
- Vérifiez que `mod_rewrite` est activé
- Assurez-vous que les fichiers `.htaccess` sont pris en compte
- Configurez le domaine pour pointer vers le dossier racine

### Structure des fichiers générés

```
dist/
├── index.html              # Page d'accueil
├── evenements.html         # Page événements
├── connexion.html          # Page de connexion
├── inscription.html        # Page d'inscription
├── contact.html            # Page de contact
├── conditions.html         # Conditions d'utilisation
├── confidentialite.html    # Politique de confidentialité
├── blog.html              # Page blog
├── organisateur.html       # Page organisateur
├── profile.html           # Page profil
├── tickets/
│   └── my-tickets.html    # Mes tickets
├── check-in.html          # Page check-in
├── _nuxt/                 # Assets JavaScript/CSS
├── images/                # Images
├── .htaccess              # Configuration Apache
├── web.config             # Configuration IIS
└── sitemap.xml            # Sitemap
```

### Pages dynamiques (SPA)
Les pages suivantes fonctionnent en mode SPA (Single Page Application) :
- `/evenements/[slug]` - Détails d'un événement
- `/invitation/[token]` - Invitation personnalisée
- `/blog/[slug]` - Article de blog
- `/organisateur/[id]/*` - Pages d'administration

### Vérification du déploiement

1. **Pages statiques** : Vérifiez que les pages principales se chargent correctement
2. **Pages dynamiques** : Testez la navigation vers les pages SPA
3. **API** : Vérifiez que les appels API fonctionnent
4. **SEO** : Vérifiez que les métadonnées sont correctes

### Dépannage

#### Erreur 404 sur les pages dynamiques
- Vérifiez que `.htaccess` est bien uploadé
- Vérifiez que `mod_rewrite` est activé
- Vérifiez les permissions des fichiers

#### Problèmes de chargement des assets
- Vérifiez que le dossier `_nuxt/` est bien uploadé
- Vérifiez les permissions (644 pour les fichiers)

#### Problèmes d'API
- Vérifiez que l'URL de l'API est correcte dans `nuxt.config.ts`
- Vérifiez les CORS si nécessaire

### Support
Pour toute question ou problème, consultez la documentation Nuxt ou contactez l'équipe de développement.
