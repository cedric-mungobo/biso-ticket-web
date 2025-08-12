# Middlewares d'Authentification - Biso Ticket

## 🔐 **Vue d'ensemble**

Ce document explique l'utilisation des middlewares d'authentification dans l'application Biso Ticket pour sécuriser l'accès aux pages.

## 📁 **Fichiers des middlewares**

```
app/middleware/
├── authenticated.ts    # Protège les pages nécessitant une connexion
└── guest.ts           # Redirige les utilisateurs déjà connectés
```

## 🛡️ **Middleware `authenticated`**

### **Fonctionnalité**
- Vérifie si l'utilisateur est connecté
- Redirige vers `/connexion` si non authentifié
- Sauvegarde l'URL de destination pour rediriger après connexion

### **Utilisation**
```typescript
// Dans une page
definePageMeta({
  middleware: ['authenticated']
})
```

### **Pages protégées**
- `/tickets/my-tickets` - Mes billets
- `/evenements/[slug]/paiement` - Paiement des tickets

### **Comportement**
1. L'utilisateur non connecté essaie d'accéder à une page protégée
2. Redirection vers `/connexion?redirect=/page-destination`
3. Après connexion, redirection automatique vers la page d'origine

## 🚫 **Middleware `guest`**

### **Fonctionnalité**
- Empêche les utilisateurs connectés d'accéder aux pages de connexion/inscription
- Redirige vers la page d'accueil si déjà authentifié

### **Utilisation**
```typescript
// Dans une page
definePageMeta({
  middleware: ['guest']
})
```

### **Pages protégées**
- `/connexion` - Page de connexion
- `/inscription` - Page d'inscription

## 🔄 **Flux d'authentification**

### **Connexion avec redirection**
```
1. Utilisateur non connecté → Page protégée
2. Redirection → /connexion?redirect=/page-destination
3. Connexion réussie
4. Redirection automatique → /page-destination
```

### **Connexion sans redirection**
```
1. Utilisateur va directement sur /connexion
2. Connexion réussie
3. Redirection par défaut → /
```

## 🛠️ **Implémentation technique**

### **Middleware `authenticated.ts`**
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Attendre que l'authentification soit initialisée
  if (isLoading.value) {
    return
  }

  // Rediriger si non authentifié
  if (!isAuthenticated.value) {
    const redirectUrl = to.fullPath
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
```

### **Middleware `guest.ts`**
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Si déjà connecté, redirection vers l'accueil
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
```

## 📱 **Gestion des états de chargement**

Le middleware `authenticated` gère l'état de chargement de l'authentification :
- **Pendant le chargement** : Pas de redirection
- **Après chargement** : Vérification et redirection si nécessaire

## 🔒 **Sécurité**

- **URLs de redirection** : Encodées pour éviter les injections
- **Validation** : Vérification que l'URL de redirection n'est pas la page de connexion
- **État d'authentification** : Vérification via le composable `useAuth()`

## 🚀 **Utilisation avancée**

### **Combinaison de middlewares**
```typescript
definePageMeta({
  middleware: ['authenticated', 'otherMiddleware']
})
```

### **Middleware personnalisé**
```typescript
// Créer un nouveau middleware
export default defineNuxtRouteMiddleware((to) => {
  // Logique personnalisée
})
```

## 📝 **Notes importantes**

- Les middlewares s'exécutent **avant** le rendu de la page
- L'ordre des middlewares dans le tableau est important
- Les redirections utilisent `navigateTo()` pour la compatibilité SSR
- Les composables `useAuth()` sont disponibles dans les middlewares
