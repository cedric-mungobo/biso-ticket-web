# Implémentation Google OAuth - Intégration Manuelle

## Vue d'ensemble

Cette implémentation utilise l'intégration manuelle de Google OAuth avec l'API Google Sign-In JavaScript, offrant un contrôle total et une compatibilité parfaite avec notre API stateless.

## Architecture

### 1. Configuration Nuxt.js

**Variables d'environnement requises :**
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_BASE_URL=https://api.bisoticket.com/api
```

**Configuration dans `nuxt.config.ts` :**
- Script Google GSI chargé automatiquement
- Variables d'environnement exposées via `runtimeConfig`
- Configuration optimisée pour la production

### 2. Composable `useGoogleAuth`

**Fichier :** `composables/useGoogleAuth.ts`

**Fonctionnalités :**
- `loginWithGoogle(idToken)` : Authentification avec token Google
- `logout()` : Déconnexion complète
- `isAuthenticated()` : Vérification de l'état de connexion
- `getCurrentUser()` : Récupération des données utilisateur
- `getAccessToken()` : Récupération du token d'accès

**Avantages :**
- Gestion centralisée de l'authentification
- Stockage sécurisé dans localStorage
- Gestion d'erreurs robuste
- API simple et intuitive

### 3. Composant `GoogleLoginButton`

**Fichier :** `components/GoogleLoginButton.vue`

**Fonctionnalités :**
- Intégration native avec Google Sign-In
- Gestion automatique des callbacks
- Messages d'erreur utilisateur-friendly
- Redirection automatique après connexion
- Support des événements `@success` et `@error`

**Configuration :**
- Bouton Google standard avec design personnalisé
- Chargement automatique du script GSI
- Nettoyage des ressources au démontage

### 4. Middleware d'authentification

**Fichier :** `middleware/auth.ts`

**Fonctionnalités :**
- Protection des routes sensibles
- Vérification côté client uniquement
- Redirection automatique vers `/connexion`
- Compatible avec SSR

**Utilisation :**
```typescript
definePageMeta({
  middleware: 'auth'
})
```

## Flux d'authentification

### 1. Connexion utilisateur

1. L'utilisateur clique sur le bouton Google
2. Google affiche la popup de connexion
3. L'utilisateur s'authentifie avec Google
4. Google renvoie un `id_token`
5. Le composant appelle `loginWithGoogle(idToken)`
6. L'API backend valide le token et renvoie un `access_token`
7. Les données sont stockées dans localStorage
8. L'utilisateur est redirigé vers `/app`

### 2. Vérification d'authentification

1. Le middleware vérifie la présence du token
2. Si absent, redirection vers `/connexion`
3. Si présent, accès autorisé à la page

### 3. Déconnexion

1. L'utilisateur clique sur "Se déconnecter"
2. Appel de l'API de déconnexion (optionnel)
3. Nettoyage du localStorage
4. Redirection vers la page d'accueil

## Sécurité

### 1. Validation côté serveur
- Le `id_token` est validé par l'API Google
- Vérification de la signature et de l'expiration
- Génération d'un token d'accès sécurisé

### 2. Stockage sécurisé
- Tokens stockés dans localStorage (côté client)
- Pas de données sensibles exposées
- Nettoyage automatique lors de la déconnexion

### 3. Protection CSRF
- Utilisation de l'API Google officielle
- Pas de redirection vers des domaines externes
- Validation des tokens côté serveur

## Configuration Google Cloud Console

### 1. Créer un projet OAuth 2.0

1. Aller dans Google Cloud Console
2. APIs & Services > Credentials
3. Créer un "OAuth 2.0 Client ID"

### 2. Configurer les origines autorisées

**Authorized JavaScript origins :**
- `http://localhost:3000` (développement)
- `https://bisoticket.com` (production)

**Authorized redirect URIs :**
- `http://localhost:3000` (développement)
- `https://bisoticket.com` (production)

### 3. Configurer l'écran de consentement

- Remplir les informations de l'application
- Définir les scopes nécessaires
- Configurer les utilisateurs de test (si nécessaire)

## Utilisation dans les composants

### 1. Page de connexion

```vue
<template>
  <GoogleLoginButton 
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
const handleSuccess = (user) => {
  console.log('Utilisateur connecté:', user)
}

const handleError = (error) => {
  console.error('Erreur de connexion:', error)
}
</script>
```

### 2. Page protégée

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})

const { getCurrentUser } = useGoogleAuth()
const user = getCurrentUser()
</script>
```

### 3. Déconnexion

```vue
<script setup>
const { logout } = useGoogleAuth()

const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    // Redirection automatique
  }
}
</script>
```

## Avantages de cette approche

### 1. Performance
- Pas de dépendances supplémentaires
- Chargement asynchrone du script Google
- Gestion optimisée du cache

### 2. Sécurité
- Validation côté serveur obligatoire
- Pas de stockage de données sensibles
- Protection contre les attaques CSRF

### 3. Maintenabilité
- Code simple et lisible
- Séparation claire des responsabilités
- Tests unitaires facilités

### 4. Flexibilité
- Contrôle total sur l'UI
- Personnalisation facile
- Intégration avec l'API existante

## Dépannage

### 1. Erreur "Invalid client"
- Vérifier la configuration Google Cloud Console
- S'assurer que les origines sont correctement configurées

### 2. Erreur "Token validation failed"
- Vérifier la configuration de l'API backend
- S'assurer que le `GOOGLE_CLIENT_SECRET` est correct

### 3. Bouton Google ne s'affiche pas
- Vérifier que le script GSI est chargé
- Contrôler la console pour les erreurs JavaScript

### 4. Redirection en boucle
- Vérifier la configuration du middleware
- S'assurer que les tokens sont correctement stockés

## Migration depuis l'ancien système

### 1. Fichiers supprimés
- `composables/useGoogleAuth.ts` (ancien)
- `components/auth/GoogleAuthButton.vue` (ancien)
- `pages/auth/google/callback.vue`
- `components/GoogleAuthDebug.vue`

### 2. Fichiers créés
- `composables/useGoogleAuth.ts` (nouveau)
- `components/GoogleLoginButton.vue`
- `middleware/auth.ts`

### 3. Modifications
- Mise à jour de `nuxt.config.ts`
- Mise à jour des pages de connexion/inscription
- Mise à jour du composant UserMenu

## Tests

### 1. Test de connexion
1. Aller sur `/connexion`
2. Cliquer sur le bouton Google
3. S'authentifier avec Google
4. Vérifier la redirection vers `/application`

### 2. Test de protection
1. Aller sur `/application` sans être connecté
2. Vérifier la redirection vers `/connexion`
3. Se connecter et retourner sur `/application`
4. Vérifier l'accès autorisé

### 3. Test de déconnexion
1. Être connecté sur `/application`
2. Cliquer sur "Se déconnecter"
3. Vérifier la redirection vers `/`
4. Vérifier que `/application` redirige vers `/connexion`

## Support

Pour toute question ou problème :
1. Vérifier la console du navigateur
2. Contrôler les logs de l'API backend
3. Vérifier la configuration Google Cloud Console
4. Consulter la documentation Google Sign-In
