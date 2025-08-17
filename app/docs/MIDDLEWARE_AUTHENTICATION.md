# 🔐 Middleware d'Authentification - Espace Organisateur

## 📋 Vue d'ensemble

Toutes les pages de l'espace organisateur de Biso Ticket sont protégées par le middleware d'authentification `authenticated`. Ce middleware garantit que seuls les utilisateurs connectés peuvent accéder aux fonctionnalités de gestion des événements.

## 🛡️ Protection des pages

### Pages protégées

| Page | Route | Middleware | Statut |
|------|-------|------------|---------|
| Tableau de bord | `/organisateur` | `authenticated` | ✅ Protégée |
| Créer un événement | `/organisateur/create-event` | `authenticated` | ✅ Protégée |
| Mes événements | `/organisateur/my-events` | `authenticated` | ✅ Protégée |
| Statistiques | `/organisateur/statistics` | `authenticated` | ✅ Protégée |
| Gestion d'événement | `/organisateur/events/[id]` | `authenticated` | ✅ Protégée |

### Configuration du middleware

Chaque page utilise la même configuration :

```typescript
definePageMeta({
  middleware: 'authenticated'
})
```

## 🔧 Fonctionnement du middleware

### Code source (`app/middleware/authenticated.ts`)

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Attendre que l'authentification soit initialisée
  if (isLoading.value) {
    return
  }

  // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
  if (!isAuthenticated.value) {
    // Sauvegarder l'URL de destination pour rediriger après connexion
    const redirectUrl = to.fullPath
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
```

### Logique de fonctionnement

1. **Vérification de l'état de chargement** : Le middleware attend que l'authentification soit initialisée
2. **Vérification de l'authentification** : Si l'utilisateur n'est pas connecté, il est redirigé
3. **Redirection intelligente** : L'URL de destination est sauvegardée pour rediriger après connexion
4. **Accès autorisé** : Si l'utilisateur est authentifié, l'accès à la page est autorisé

## 🚀 Flux d'authentification

### 1. Utilisateur non connecté
```
Utilisateur → Page organisateur → Middleware → Redirection vers /connexion
```

### 2. Utilisateur connecté
```
Utilisateur → Page organisateur → Middleware → Accès autorisé
```

### 3. Connexion après redirection
```
Connexion réussie → Redirection vers la page demandée initialement
```

## 🔍 Test du middleware

### Test manuel

1. **Déconnexion** : Se déconnecter de l'application
2. **Tentative d'accès** : Essayer d'accéder à `/organisateur`
3. **Vérification** : Être redirigé vers `/connexion`
4. **Connexion** : Se reconnecter
5. **Vérification** : Être redirigé vers `/organisateur`

### Test automatisé

```typescript
// Exemple de test unitaire
describe('Middleware Authenticated', () => {
  it('should redirect unauthenticated users to login', () => {
    // Test de redirection
  })
  
  it('should allow authenticated users to access protected pages', () => {
    // Test d'accès autorisé
  })
})
```

## ⚠️ Cas d'erreur et gestion

### Erreurs courantes

#### 1. Utilisateur non authentifié
- **Cause** : Token expiré ou invalide
- **Action** : Redirection vers `/connexion`
- **Message** : Aucun message affiché (redirection silencieuse)

#### 2. État de chargement
- **Cause** : Authentification en cours d'initialisation
- **Action** : Attendre la fin de l'initialisation
- **Comportement** : Pas de redirection pendant le chargement

#### 3. Erreur de session
- **Cause** : Problème avec le token ou la session
- **Action** : Nettoyage de la session et redirection
- **Gestion** : Déconnexion automatique

### Gestion des erreurs

```typescript
// Dans le composable useAuth
const handleAuthError = (error: any) => {
  if (error.status === 401) {
    // Token expiré ou invalide
    clearAuthState()
    router.push('/connexion')
  }
}
```

## 🔒 Sécurité renforcée

### Niveaux de protection

1. **Frontend** : Middleware Nuxt.js
2. **Backend** : Validation du token Bearer
3. **Session** : Gestion des tokens avec expiration
4. **Navigation** : Protection des routes sensibles

### Bonnes pratiques

- ✅ **Toujours utiliser le middleware** sur les pages sensibles
- ✅ **Vérifier l'authentification** côté serveur
- ✅ **Gérer l'expiration** des tokens
- ✅ **Rediriger proprement** en cas d'échec
- ✅ **Sauvegarder l'URL** de destination

## 🧪 Tests et validation

### Tests à effectuer

- [ ] Accès sans authentification → Redirection
- [ ] Accès avec authentification → Autorisation
- [ ] Token expiré → Redirection automatique
- [ ] Session invalide → Nettoyage et redirection
- [ ] Navigation entre pages protégées → Pas de re-vérification

### Validation manuelle

1. **Test de déconnexion** : Vérifier la redirection
2. **Test de reconnexion** : Vérifier la redirection inverse
3. **Test de navigation** : Vérifier la persistance de l'authentification
4. **Test d'expiration** : Simuler l'expiration du token

## 📚 Intégration avec l'API

### Headers d'authentification

```typescript
// Dans useAPI
const headers = {
  'Authorization': `Bearer ${token.value}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

### Gestion des erreurs 401

```typescript
// Interception automatique des erreurs d'authentification
if (response.status === 401) {
  // Token expiré ou invalide
  await logout()
  router.push('/connexion')
}
```

## 🚀 Améliorations futures

### Fonctionnalités prévues

- [ ] **Refresh token automatique** : Renouvellement transparent des tokens
- [ ] **Session persistante** : Mémorisation de la connexion
- [ ] **Permissions granulaires** : Gestion des rôles utilisateur
- [ ] **Audit de connexion** : Traçabilité des accès
- [ ] **2FA** : Authentification à deux facteurs

### Optimisations techniques

- [ ] **Cache d'authentification** : Réduction des vérifications
- [ ] **Lazy loading** : Chargement différé des composants
- [ ] **Preloading** : Préchargement des pages protégées
- [ ] **Service Worker** : Gestion hors ligne de l'authentification

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Biso Ticket
