# 🎬 EventsSection - Système de déclenchement GSAP

## Vue d'ensemble

Le composant `EventsSection.vue` utilise un système avancé de déclenchement GSAP avec ScrollTrigger pour créer des animations fluides et réactives au scroll. Ce système est conçu pour être performant, maintenable et respectueux de l'accessibilité.

## 🏗️ Architecture du système

### 1. Gestion des références
```typescript
// Références pour les animations GSAP
const headerRef = ref<HTMLElement>()
const eventsGridRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

// Stockage des triggers pour pouvoir les nettoyer
const scrollTriggers = ref<any[]>([])
```

### 2. Cycle de vie des animations
- **Montage** : Configuration initiale des ScrollTriggers
- **Mise à jour** : Réinitialisation lors du changement d'événements
- **Démontage** : Nettoyage automatique des triggers

## 🎯 Types de déclencheurs

### Header - Déclencheur progressif
```typescript
createScrollAnimation(headerRef.value, {
  start: 'top 85%',        // Déclenche quand le haut est à 85% du viewport
  end: 'bottom 15%',       // Termine quand le bas est à 15% du viewport
  onEnter: () => { /* Animation d'entrée */ },
  onLeave: () => { /* Animation de sortie */ },
  onEnterBack: () => { /* Animation de retour */ }
})
```

### Cartes d'événements - Déclencheur individuel
```typescript
eventCards.forEach((card, index) => {
  createScrollAnimation(card, {
    trigger: card,          // Chaque carte est son propre déclencheur
    start: 'top 90%',       // Déclenche plus tôt pour un effet fluide
    end: 'bottom 10%',
    onEnter: () => {
      gsap.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: index * 0.05  // Délai progressif pour l'effet stagger
      })
    }
  })
})
```

### CTA - Déclencheur avec animation spéciale
```typescript
createScrollAnimation(ctaRef.value, {
  start: 'top 80%',
  end: 'bottom 20%',
  onEnter: () => {
    gsap.to(ctaRef.value, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'  // Animation avec rebond
    })
  }
})
```

## 🔧 Fonctions de contrôle

### 1. Configuration automatique
```typescript
const setupScrollAnimations = () => {
  // Nettoyer les triggers existants
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
  
  // Créer de nouveaux triggers
  // ... configuration des animations
}
```

### 2. Déclenchement manuel
```typescript
const triggerAnimations = () => {
  // Animation immédiate sans ScrollTrigger
  gsap.to(headerRef.value, { /* ... */ })
  gsap.to(eventCards, { /* ... */, stagger: 0.1 })
  gsap.to(ctaRef.value, { /* ... */ })
}
```

### 3. Réinitialisation d'état
```typescript
const resetAnimationState = () => {
  gsap.set(elements, {
    y: 0,
    opacity: 0,
    scale: 1
  })
}
```

## 📱 Contrôles de développement

Le composant inclut des fonctions de contrôle programmatiques pour le développement :

- **`triggerAnimations()`** : Lance toutes les animations immédiatement
- **`resetAnimationState()`** : Remet tous les éléments dans leur état initial
- **`setupScrollAnimations()`** : Recrée tous les déclencheurs au scroll

> **Note** : Les contrôles visuels ont été supprimés pour une interface plus propre. Les fonctions restent disponibles pour un usage programmatique.

## 🎨 Personnalisation des animations

### Points de déclenchement
- **Header** : `top 85%` → `bottom 15%`
- **Cartes** : `top 90%` → `bottom 10%`
- **CTA** : `top 80%` → `bottom 20%`

### Easing et timing
- **Header** : `power3.out` (1.5s) - Plus doux et plus lent
- **Cartes** : `power3.out` (1.2s) avec stagger de 0.15s - Animation progressive
- **CTA** : `back.out(2.2)` (1.8s) - Rebond plus doux et plus lent

> **Note** : Les durées sont maintenant fixes pour une expérience utilisateur cohérente et optimisée.

### Effets visuels
- **Header** : Translation Y + Opacité
- **Cartes** : Translation Y + Opacité + Scale
- **CTA** : Translation Y + Opacité avec rebond

## 🚀 Optimisations de performance

### 1. Gestion de la mémoire
```typescript
// Nettoyage automatique au démontage
onUnmounted(() => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
})
```

### 2. Éviter la duplication
```typescript
// Vérification avant création de nouveaux triggers
if (eventsGridRef.value && props.events.length > 0) {
  // Créer les triggers seulement si nécessaire
}
```

### 3. Utilisation du composable
```typescript
const { gsap, ScrollTrigger, createScrollAnimation } = useGSAP()
// Accès centralisé aux fonctionnalités GSAP
```

## 🔍 Dépannage

### Problème : Animations qui ne se déclenchent pas
1. Vérifiez que les éléments existent dans le DOM
2. Assurez-vous que `setupScrollAnimations()` est appelé
3. Vérifiez les points de déclenchement (`start` et `end`)

### Problème : Performance dégradée
1. Vérifiez le nombre de ScrollTriggers actifs
2. Assurez-vous que `cleanup()` est appelé
3. Limitez le nombre d'éléments animés simultanément

### Problème : Animations qui se chevauchent
1. Ajustez les points de déclenchement
2. Utilisez des délais (`delay`) appropriés
3. Vérifiez la logique des callbacks

## 📊 Métriques et monitoring

Le composant affiche le nombre de ScrollTriggers actifs :
```vue
<p class="text-xs text-gray-500 mt-2">
  Contrôles de développement - GSAP ScrollTriggers actifs : {{ scrollTriggers.length }}
</p>
```

## 🔮 Évolutions futures

### 1. Animations conditionnelles
```typescript
// Basé sur la préférence de réduction de mouvement
if (!prefersReducedMotion()) {
  // Animation complète
} else {
  // Animation simplifiée
}
```

### 2. Animations responsives
```typescript
// Ajuster les points de déclenchement selon la taille d'écran
const isMobile = window.innerWidth < 768
const startPoint = isMobile ? 'top 95%' : 'top 85%'
```

### 3. Animations personnalisables
```typescript
// Props pour personnaliser les animations
interface Props {
  animationSpeed?: 'slow' | 'normal' | 'fast'
  animationStyle?: 'subtle' | 'dramatic' | 'playful'
}
```

---

**Ce système de déclenchement GSAP offre une expérience utilisateur fluide et performante tout en maintenant une architecture propre et maintenable.**
