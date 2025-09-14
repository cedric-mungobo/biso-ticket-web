# Composant MarqueeCards

## Description

Le composant `MarqueeCards` est un composant réutilisable Vue 3 qui affiche des cartes en défilement continu (marquee) avec des effets de survol et des gradients de fondu sur les côtés.

## Fonctionnalités

- ✅ Défilement continu des cartes
- ✅ Pause au survol (configurable)
- ✅ Vitesse de défilement personnalisable
- ✅ Support du mode sombre
- ✅ Gradients de fondu sur les côtés
- ✅ Effets de survol avec overlay
- ✅ Événements de clic
- ✅ TypeScript complet
- ✅ Responsive design

## Utilisation

### Import du composant

```vue
<template>
  <MarqueeCards 
    :cards="myCards"
    :speed="2000"
    :pause-on-hover="true"
    @card-click="handleCardClick"
  />
</template>

<script setup lang="ts">
import type { MarqueeCard } from '~/types/marquee'

const myCards: MarqueeCard[] = [
  {
    id: 1,
    title: "Mon événement",
    image: "https://example.com/image.jpg"
  }
]

const handleCardClick = (card: MarqueeCard) => {
  console.log('Carte cliquée:', card)
}
</script>
```

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `cards` | `MarqueeCard[]` | **Requis** | Tableau des cartes à afficher |
| `speed` | `number` | `2500` | Vitesse de défilement en millisecondes par carte |
| `pauseOnHover` | `boolean` | `true` | Pause le défilement au survol |

### Événements

| Événement | Payload | Description |
|-----------|---------|-------------|
| `card-click` | `MarqueeCard` | Émis lors du clic sur une carte |

### Types

```typescript
interface MarqueeCard {
  id: string | number
  title: string
  image: string
  [key: string]: any
}
```

## Composable useMarqueeCards

Le composable `useMarqueeCards` fournit des méthodes utilitaires pour gérer les données des cartes :

```typescript
const {
  getDefaultEventCards,    // Cartes d'événements par défaut
  getServiceCards,         // Cartes de services
  getTestimonialCards,     // Cartes de témoignages
  filterCardsByCategory,   // Filtrer par catégorie
  searchCards             // Rechercher dans les cartes
} = useMarqueeCards()
```

## Exemples d'utilisation

### 1. Cartes d'événements

```vue
<template>
  <MarqueeCards 
    :cards="eventCards"
    @card-click="navigateToEvent"
  />
</template>

<script setup lang="ts">
const { getDefaultEventCards } = useMarqueeCards()
const eventCards = getDefaultEventCards()

const navigateToEvent = (card: MarqueeCard) => {
  navigateTo(`/evenements/${card.id}`)
}
</script>
```

### 2. Vitesse personnalisée

```vue
<template>
  <MarqueeCards 
    :cards="serviceCards"
    :speed="1500"
    @card-click="showServiceDetails"
  />
</template>
```

### 3. Sans pause au survol

```vue
<template>
  <MarqueeCards 
    :cards="testimonialCards"
    :pause-on-hover="false"
  />
</template>
```

## Personnalisation CSS

Le composant utilise des classes Tailwind CSS et peut être personnalisé via les classes CSS :

```css
/* Personnaliser l'animation */
.marquee-inner {
  animation: marqueeScroll linear infinite;
  animation-duration: 10s; /* Vitesse globale */
}

/* Personnaliser les gradients */
.gradient-left {
  background: linear-gradient(to right, white, transparent);
}

.gradient-right {
  background: linear-gradient(to left, white, transparent);
}
```

## Accessibilité

- ✅ Navigation au clavier
- ✅ Support des lecteurs d'écran
- ✅ Contraste approprié
- ✅ Focus visible

## Performance

- ✅ Images lazy loading
- ✅ Animation CSS optimisée
- ✅ Pas de re-renders inutiles
- ✅ Mémoire optimisée

## Compatibilité

- ✅ Vue 3
- ✅ Nuxt 3
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Mode sombre
- ✅ Responsive

## Démonstration

Visitez `/marquee-demo` pour voir des exemples d'utilisation du composant.
