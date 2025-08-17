# Animations de la Page des Événements

## Vue d'ensemble

La page des événements (`/evenements/index.vue`) a été entièrement animée en utilisant une approche harmonisée combinant les transitions natives de Vue.js et les animations GSAP, créant une expérience utilisateur fluide et engageante.

## Architecture des Animations

### 1. Transitions Natives Vue.js

La page utilise plusieurs types de transitions Vue.js :

- **`fade-slide-down`** : Pour le titre principal (entrée par le haut)
- **`fade-slide-up`** : Pour les filtres, grille d'événements et états (entrée par le bas)
- **`fade-scale`** : Pour l'état de chargement (entrée avec scale)
- **`event-card`** : Pour les cartes d'événements individuelles (entrée/sortie avec stagger)

### 2. Animations GSAP

Les animations GSAP sont déclenchées via les hooks de transition Vue.js :

- **Titre** : Animation avec `y: 40` et `power2.out`
- **Filtres** : Animation avec `y: 30` et `power2.out`
- **Grille d'événements** : Animation avec `y: 20` et `power2.out`
- **Cartes d'événements** : Animation séquentielle avec `stagger: 0.1`
- **Pagination** : Animation avec `y: 25` et `power2.out`

## Structure des Animations

### Hiérarchie des Animations
```
Page Title (fade-slide-down)
    ↓
Filters (fade-slide-up)
    ↓
Content States (fade-scale/fade-slide-up)
    ↓
Events Grid (fade-slide-up + event-card stagger)
    ↓
Pagination (fade-slide-up)
```

### États Conditionnels
La page gère quatre états principaux avec des animations appropriées :

1. **Loading** : `fade-scale` avec effet de rebond
2. **Error** : `fade-slide-up` pour une entrée douce
3. **Events Grid** : `fade-slide-up` + `TransitionGroup` pour les cartes
4. **No Events** : `fade-slide-up` pour l'état vide

## Fonctionnalités Clés

### Accessibilité
- Respect des préférences `prefers-reduced-motion`
- Utilisation du composable `accessibleAnimation`
- Désactivation automatique des animations si nécessaire

### Performance
- Utilisation de `will-change: transform, opacity`
- Animations optimisées avec des durées appropriées
- Gestion efficace des références DOM
- Nettoyage automatique des ScrollTriggers

### Responsive
- Animations adaptées aux différentes tailles d'écran
- Délais d'animation optimisés pour l'expérience mobile
- Transitions fluides sur tous les appareils

## Configuration des Animations

### Durées et Délais
- **Titre** : 1.8s avec délai de 0.3s
- **Filtres** : 1.5s avec délai de 0.6s
- **Grille** : 1.3s avec délai de 0.4s
- **Cartes** : 1.4s avec stagger de 0.25s
- **Pagination** : 1.4s avec délai de 1.0s

### Easing Functions
- **Entrées** : `power2.out`, `back.out(1.7)`
- **Sorties** : `power2.in`

## ScrollTrigger Integration

La page utilise ScrollTrigger pour déclencher des animations au scroll :

```typescript
// Animation du titre au scroll
createScrollAnimation(pageTitle.value, {
  start: 'top 90%',
  end: 'bottom 10%'
})

// Animation des filtres au scroll
createScrollAnimation(filtersContainer.value, {
  start: 'top 85%',
  end: 'bottom 15%'
})
```

## Transitions des Cartes d'Événements

### TransitionGroup
Les cartes d'événements utilisent `TransitionGroup` pour des animations fluides :

```vue
<TransitionGroup
  name="event-card"
  tag="div"
  class="contents"
  @enter="onEventCardEnter"
  @leave="onEventCardLeave"
>
  <!-- Cartes d'événements -->
</TransitionGroup>
```

### Animation Stagger
Les cartes s'animent séquentiellement avec un délai entre chaque :

```typescript
staggerAnimation(validCards, {
  duration: 0.7,
  delay: 0.3,
  stagger: 0.1,
  y: 30,
  scale: 0.95,
  ease: 'power2.out'
})
```

## Styles CSS

### Transitions Personnalisées
- Utilisation de `cubic-bezier` pour des courbes d'animation naturelles
- Support des préférences de réduction de mouvement
- Optimisations de performance avec `will-change`

### Hover Effects
Les cartes d'événements ont des effets d'interaction :

```css
.event-card-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## Gestion des Références

### Système de Références
La page utilise un système de références pour les animations :

```typescript
const eventCardRefs = ref<HTMLElement[]>([])

const setEventCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    eventCardRefs.value[index] = el as HTMLElement
  }
}
```

### Références Principales
- `pageTitle` : Titre de la page
- `filtersContainer` : Conteneur des filtres
- `eventsGrid` : Grille des événements
- `paginationContainer` : Conteneur de pagination

## Bonnes Pratiques Implémentées

1. **Séparation des responsabilités** : Transitions Vue pour l'état, GSAP pour les animations complexes
2. **Performance** : Utilisation de `nextTick` et gestion des références
3. **Accessibilité** : Respect des préférences utilisateur
4. **Maintenabilité** : Code modulaire et bien structuré
5. **Réutilisabilité** : Animations configurables et extensibles

## Dépannage

### Problèmes Courants
- **Animations qui ne se déclenchent pas** : Vérifier que GSAP est bien initialisé
- **Performance dégradée** : Vérifier les préférences de réduction de mouvement
- **Erreurs TypeScript** : S'assurer que les types sont correctement définis

### Debug
- Utiliser `console.log` dans les fonctions d'animation
- Vérifier les références DOM avec `eventCardRefs.value`
- Contrôler l'état de `prefersReducedMotion()`

## Évolutions Futures

- Ajout d'animations d'interaction (hover, focus) plus avancées
- Support des animations de sortie de page
- Intégration avec d'autres composants GSAP
- Tests unitaires pour les animations
- Optimisations de performance supplémentaires
- Support des animations de filtrage en temps réel
