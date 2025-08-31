# CustomFetch Pattern - Biso Ticket Web

## Vue d'ensemble

Cette application utilise maintenant le pattern CustomFetch pour gérer les appels API de manière centralisée et maintenable, suivant exactement les bonnes pratiques décrites dans `customFetch.md`.

## Structure des fichiers

### 1. Plugin Custom Fetch (`app/plugins/customFetch.ts`)

Le plugin centralise la configuration des appels API selon `customFetch.md` :

- **Configuration centralisée** : Base URL depuis `useRuntimeConfig()`
- **Gestion automatique des tokens** : Ajout automatique du Bearer token depuis les cookies
- **Gestion d'erreur centralisée** : Gestion des erreurs 401 et autres

### 2. Composable Repository (`app/composables/useUserRepository.ts`)

Composable repository qui utilise l'instance custom fetch selon le pattern de `customFetch.md` :

- `getUsers()` - Récupérer tous les utilisateurs
- `getUserById(id)` - Récupérer un utilisateur par ID
- `createUser(userData)` - Créer un nouvel utilisateur

### 3. Composable CustomFetch (`app/composables/useCustomFetch.ts`)

Composable simple qui fournit des méthodes utilitaires pour les appels API :

- `get<T>(url, params?)` - Requêtes GET avec paramètres optionnels
- `post<T>(url, body?)` - Requêtes POST avec body optionnel
- `put<T>(url, body?)` - Requêtes PUT avec body optionnel
- `delete<T>(url)` - Requêtes DELETE
- `patch<T>(url, body?)` - Requêtes PATCH avec body optionnel
- `apiCall<T>(url, options?)` - Méthode générique avec options complètes

## Utilisation dans les composants

### Exemple exact selon customFetch.md

```vue
<template>
  <div>
    <div v-if="users">
      <div v-for="user in users" :key="user.id">{{ user.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserRepository } from '~/composables/useUserRepository';

const { getUsers } = useUserRepository();
const { data: users, pending, error } = await useAsyncData('users', () => getUsers());
</script>
```

### Exemple avec useCustomFetch

```typescript
// Dans un composant
import { useCustomFetch } from '~/composables/useCustomFetch'

const { get, post } = useCustomFetch()

// GET simple
const events = await get('/events')

// GET avec paramètres
const filteredEvents = await get('/events', { 
  per_page: 10, 
  category: 'music' 
})

// POST avec body
const newEvent = await post('/events', {
  title: 'Mon événement',
  location: 'Kinshasa'
})
```

### Exemple avec typage TypeScript

```typescript
interface Event {
  id: number
  title: string
  location: string
}

interface EventsResponse {
  success: boolean
  data: Event[]
}

// Utilisation typée
const response = await get<EventsResponse>('/events')
if (response.success) {
  const events = response.data
  // events est typé comme Event[]
}
```

## Pattern Repository selon customFetch.md

### 1. **Plugin Custom Fetch**

```typescript
// plugins/customFetch.ts
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const customFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ request, options }) {
      // Ajouter l'en-tête d'autorisation si un token existe
      const token = useCookie('auth_token').value
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    onResponseError({ request, response, options }) {
      // Gérer les erreurs API (ex: logout sur 401)
      if (response.status === 401) {
        console.error('Erreur 401: Accès non autorisé')
      }
    },
  })

  // Fournir l'instance custom fetch globalement
  nuxtApp.provide('customFetch', customFetch)
})
```

### 2. **Pattern Repository**

```typescript
// composables/useUserRepository.ts
export const useUserRepository = () => {
  const { $customFetch } = useNuxtApp()

  const getUsers = async () => {
    return await $customFetch('/users')
  }

  const getUserById = async (id: string) => {
    return await $customFetch(`/users/${id}`)
  }

  const createUser = async (userData: any) => {
    return await $customFetch('/users', { method: 'POST', body: userData })
  }

  return {
    getUsers,
    getUserById,
    createUser,
  }
}
```

### 3. **Utilisation dans les composants**

```vue
<template>
  <div>
    <div v-if="users">
      <div v-for="user in users" :key="user.id">{{ user.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserRepository } from '~/composables/useUserRepository';

const { getUsers } = useUserRepository();
const { data: users, pending, error } = await useAsyncData('users', () => getUsers());
</script>
```

## Migration depuis l'ancien système

### 1. **Remplacer useAPI par useCustomFetch**

```typescript
// ❌ Ancien
import { useAPI } from '~/composables/useAPI'
const { data, error } = await useAPI('/events')

// ✅ Nouveau
import { useCustomFetch } from '~/composables/useCustomFetch'
const { get } = useCustomFetch()
const response = await get('/events')
```

### 2. **Remplacer $fetch direct par useCustomFetch**

```typescript
// ❌ Ancien
const { $fetch } = useNuxtApp()
const response = await $fetch('/events')

// ✅ Nouveau
const { get } = useCustomFetch()
const response = await get('/events')
```

## Configuration

### Variables d'environnement

```env
# .env
NUXT_PUBLIC_API_BASE_URL=http://api.bisoticket.com/api
```

### Nuxt config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  }
})
```

## Gestion des erreurs

Le système gère automatiquement :

- **401 Unauthorized** : Log des erreurs d'accès non autorisé
- **Erreurs réseau** : Gestion des timeouts et erreurs de connexion
- **Erreurs de validation** : Transmission des erreurs du backend

## Avantages de cette approche

### 1. **Simplicité**
- Pattern simple et direct
- Pas de sur-ingénierie
- Facile à comprendre et maintenir

### 2. **Flexibilité**
- Méthodes utilitaires pour les opérations courantes
- Méthode générique `apiCall` pour les cas complexes
- Support complet des options HTTP

### 3. **Centralisation**
- Configuration centralisée dans le plugin
- Gestion automatique des tokens
- Base URL configurée une seule fois

### 4. **TypeScript**
- Support complet du typage générique
- IntelliSense pour les réponses API
- Sécurité de type au moment de la compilation

## Exemples d'utilisation avancée

### Gestion des paramètres de requête

```typescript
const { get } = useCustomFetch()

// Paramètres simples
const events = await get('/events', { 
  per_page: 20, 
  page: 1 
})

// Paramètres avec valeurs undefined/null (ignorés)
const filteredEvents = await get('/events', { 
  category: 'music',
  location: undefined, // Ignoré
  price: null         // Ignoré
})
```

### Gestion des headers personnalisés

```typescript
const { apiCall } = useCustomFetch()

const response = await apiCall('/events', {
  method: 'POST',
  body: eventData,
  headers: {
    'X-Custom-Header': 'valeur'
  }
})
```

### Gestion des erreurs

```typescript
try {
  const { get } = useCustomFetch()
  const response = await get('/events')
  // Traitement de la réponse
} catch (error) {
  if (error.status === 401) {
    // Gérer l'erreur d'authentification
    navigateTo('/connexion')
  } else if (error.status === 422) {
    // Gérer l'erreur de validation
    console.error('Erreur de validation:', error.data)
  } else {
    // Gérer les autres erreurs
    console.error('Erreur API:', error)
  }
}
```

## Composant d'exemple

Le composant `UserExample.vue` montre l'exemple exact selon `customFetch.md` :

- Utilisation du pattern repository
- Intégration avec `useAsyncData`
- Gestion automatique des états de chargement et d'erreur

## Conclusion

L'implémentation respecte exactement le pattern décrit dans `customFetch.md` :

- **Plugin Custom Fetch** : Configuration centralisée des appels API
- **Pattern Repository** : Composables qui utilisent l'instance custom fetch
- **Utilisation dans les composants** : Intégration avec `useAsyncData` pour la gestion des états

Cette approche suit parfaitement les bonnes pratiques documentées et facilite la maintenance et l'évolution de l'application.
