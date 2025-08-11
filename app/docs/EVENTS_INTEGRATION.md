# 🎫 Intégration des Événements avec l'API Biso Ticket

## 📋 Vue d'ensemble

Cette documentation décrit l'intégration complète des événements avec l'API Biso Ticket dans l'application Nuxt.js.

## 🏗️ Architecture

### Composables
- **`useEvents`** : Gestion centralisée des événements
- **`useAPI`** : Wrapper pour les appels API avec authentification

### Types TypeScript
- **`Event`** : Interface principale pour les événements
- **`EventsResponse`** : Réponse de l'API pour les listes d'événements
- **`EventResponse`** : Réponse de l'API pour un événement unique
- **`EventFilters`** : Filtres pour la recherche d'événements

### Composants
- **`EventCard`** : Affichage d'un événement avec toutes ses informations
- **`index.vue`** : Page d'accueil utilisant l'API `/discover`

## 🔌 Endpoints API Utilisés

### `/discover` - Événements mis en avant
```typescript
// Récupération des événements mis en avant
const { events, loading, error, fetchFeaturedEvents } = useEvents()

onMounted(() => {
  fetchFeaturedEvents()
})
```

### `/events` - Liste des événements avec filtres
```typescript
// Récupération avec filtres
const filters: EventFilters = {
  page: 1,
  per_page: 10,
  category: 'Concert',
  search: 'rock'
}

await fetchEvents(filters)
```

### `/events/{id}` - Détails d'un événement
```typescript
// Récupération d'un événement spécifique
const event = await fetchEvent(eventId)
```

## 🎨 Composant EventCard

### Propriétés
- `category` : Catégorie de l'événement
- `title` : Titre de l'événement
- `description` : Description (optionnelle)
- `location` : Localisation (optionnelle)
- `image` : URL de l'image
- `date` : Date formatée
- `eventId` : ID pour le lien vers les détails

### Fonctionnalités
- Affichage conditionnel de la description et localisation
- Formatage automatique des dates en français
- Lien vers la page de détails de l'événement
- Gestion des images avec fallback
- Badges de catégorie avec couleurs dynamiques

## 🚀 Utilisation

### 1. Récupération des événements
```typescript
// Dans un composant Vue
const { events, loading, error, fetchFeaturedEvents } = useEvents()

onMounted(() => {
  fetchFeaturedEvents()
})
```

### 2. Affichage dans le template
```vue
<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <EventCard
      v-for="event in events"
      :key="event.id"
      :category="event.category"
      :title="event.name"
      :description="event.description"
      :location="event.location"
      :image="event.image_url || event.image"
      :date="formatDate(event.date_time)"
      :eventId="event.id"
    />
  </div>
</template>
```

### 3. Gestion des erreurs
```typescript
// Le composable gère automatiquement les erreurs
if (error.value) {
  // Afficher le message d'erreur
  console.error('Erreur:', error.value)
}
```

## 🔒 Sécurité

- Validation des données côté client
- Gestion sécurisée des erreurs
- Pas d'exposition d'informations sensibles
- Utilisation de types TypeScript stricts

## 📱 Responsive Design

- Grille adaptative (1, 2, ou 3 colonnes selon la taille d'écran)
- Images optimisées avec NuxtImg
- Support des préférences de réduction de mouvement
- Design mobile-first

## 🧪 Tests Recommandés

### Tests Unitaires
- Validation des types TypeScript
- Formatage des dates
- Gestion des erreurs API

### Tests d'Intégration
- Appels API vers `/discover`
- Affichage des événements
- Navigation vers les détails

### Tests E2E
- Flux complet de la page d'accueil
- Responsive design sur différents appareils

## 🔧 Maintenance

### Ajout de nouveaux champs
1. Mettre à jour l'interface `Event` dans `types/events.d.ts`
2. Adapter le composant `EventCard` si nécessaire
3. Mettre à jour la documentation

### Modification des filtres
1. Étendre l'interface `EventFilters`
2. Mettre à jour la fonction `fetchEvents` dans `useEvents`
3. Tester avec différents paramètres

## 📚 Ressources

- [Documentation API Biso Ticket](./api-doc.md)
- [Composables Nuxt.js](https://nuxt.com/docs/guide/directory-structure/composables)
- [TypeScript avec Vue 3](https://vuejs.org/guide/typescript/overview.html)
