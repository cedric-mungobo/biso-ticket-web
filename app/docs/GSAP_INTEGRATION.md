# Intégration GSAP dans Biso Ticket

## Vue d'ensemble

GSAP (GreenSock Animation Platform) a été intégré dans le projet pour ajouter des animations fluides et performantes. Cette bibliothèque offre des capacités d'animation avancées avec une excellente performance.

## Installation

GSAP a été installé via npm :
```bash
npm install gsap
```

## Structure des fichiers

### Plugin GSAP
- **`app/plugins/gsap.client.ts`** : Plugin Nuxt qui enregistre GSAP et ses plugins
- **`app/composables/useGSAP.ts`** : Composable TypeScript avec des fonctions utilitaires
- **`app/types/gsap.d.ts`** : Définitions de types TypeScript pour GSAP

## Utilisation

### 1. Utilisation basique dans un composant

```vue
<template>
  <div ref="animatedElement" class="opacity-0">
    Contenu à animer
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const animatedElement = ref<HTMLElement>()

onMounted(() => {
  const { gsap } = useGSAP()
  
  gsap.to(animatedElement.value, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>
```

### 2. Utilisation du composable useGSAP

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const element = ref<HTMLElement>()

onMounted(() => {
  const { animateIn, createScrollAnimation } = useGSAP()
  
  // Animation d'entrée simple
  animateIn(element.value, {
    duration: 0.8,
    delay: 0.2,
    y: 50
  })
  
  // Animation au scroll
  createScrollAnimation(element.value, {
    start: 'top 80%',
    onEnter: () => console.log('Élément visible')
  })
})
</script>
```

### 3. Animations avec ScrollTrigger

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const element = ref<HTMLElement>()

onMounted(() => {
  const { gsap, ScrollTrigger } = useGSAP()
  
  gsap.fromTo(element.value, 
    { y: 100, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 1,
      scrollTrigger: {
        trigger: element.value,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    }
  )
})
</script>
```

### 4. Timelines pour des animations complexes

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const title = ref<HTMLElement>()
const subtitle = ref<HTMLElement>()
const button = ref<HTMLElement>()

onMounted(() => {
  const { gsap } = useGSAP()
  
  const tl = gsap.timeline({ delay: 0.3 })
  
  tl.fromTo(title.value, 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 }
  )
  .fromTo(subtitle.value, 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 }, 
    '-=0.4'
  )
  .fromTo(button.value, 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6 }, 
    '-=0.3'
  )
})
</script>
```

## Fonctions utilitaires disponibles

### animateIn(element, options)
- **element** : Élément DOM à animer
- **options** : 
  - `duration` : Durée de l'animation (défaut: 0.8)
  - `delay` : Délai avant l'animation (défaut: 0)
  - `ease` : Fonction d'easing (défaut: 'power2.out')
  - `y` : Translation verticale initiale (défaut: 50)
  - `opacity` : Opacité initiale (défaut: 0)
  - `scale` : Échelle initiale (défaut: 1)
  - `rotation` : Rotation initiale (défaut: 0)

### animateOut(element, options)
- Même structure que `animateIn` mais pour les animations de sortie

### createScrollAnimation(element, options)
- **element** : Élément à animer
- **options** :
  - `trigger` : Élément déclencheur (défaut: element)
  - `start` : Point de déclenchement (défaut: 'top 80%')
  - `end` : Point de fin (défaut: 'bottom 20%')
  - `scrub` : Animation liée au scroll (défaut: false)
  - `markers` : Afficher les marqueurs de debug (défaut: false)
  - `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack` : Callbacks

### createTimeline(options)
- **options** :
  - `delay` : Délai avant le début de la timeline (défaut: 0)
  - `repeat` : Nombre de répétitions (défaut: 0)
  - `yoyo` : Animation aller-retour (défaut: false)

### staggerAnimation(elements, options)
- **elements** : Éléments DOM à animer (peut être un sélecteur, un élément ou un tableau)
- **options** : Même structure que `animateIn` avec en plus :
  - `stagger` : Délai entre chaque animation (défaut: 0.1)

### isGSAPAvailable()
- Retourne `true` si GSAP est disponible côté client

### prefersReducedMotion()
- Retourne `true` si l'utilisateur préfère moins de mouvement (accessibilité)

### accessibleAnimation(element, animationFunction, fallback)
- **element** : Élément à animer
- **animationFunction** : Fonction d'animation normale
- **fallback** : Fonction alternative si l'utilisateur préfère moins de mouvement

### cleanup()
- Nettoie tous les ScrollTriggers actifs

## Bonnes pratiques

### 1. Performance
- Utilisez `transform` et `opacity` pour les animations (GPU-accelerated)
- Évitez d'animer `width`, `height`, `margin`, `padding`
- Utilisez `will-change: transform` pour les éléments qui seront animés

### 2. Accessibilité
- Respectez la préférence `prefers-reduced-motion`
- Fournissez des alternatives pour les utilisateurs avec des limitations

### 3. Responsive
- Adaptez les animations selon la taille d'écran
- Désactivez certaines animations sur mobile si nécessaire

### 4. Gestion de la mémoire
- Appelez `cleanup()` lors du démontage des composants
- Évitez de créer des ScrollTriggers multiples pour le même élément

## Exemples d'animations courantes

### Fade In
```typescript
gsap.fromTo(element, 
  { opacity: 0 },
  { opacity: 1, duration: 0.6 }
)
```

### Slide Up
```typescript
gsap.fromTo(element, 
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.8 }
)
```

### Scale In
```typescript
gsap.fromTo(element, 
  { scale: 0.8, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.6 }
)
```

### Stagger Animation
```typescript
gsap.fromTo('.card', 
  { y: 30, opacity: 0 },
  { 
    y: 0, 
    opacity: 1, 
    duration: 0.5,
    stagger: 0.1
  }
)
```

## Dépannage

### Problèmes courants
1. **Animations qui ne fonctionnent pas** : Vérifiez que l'élément existe dans le DOM
2. **ScrollTrigger non fonctionnel** : Assurez-vous que le plugin est enregistré
3. **Performance dégradée** : Vérifiez que vous n'animez pas trop d'éléments simultanément

### Debug
- Activez `markers: true` dans ScrollTrigger pour voir les points de déclenchement
- Utilisez la console pour vérifier que GSAP est bien chargé
- Vérifiez que les refs sont bien définies avant d'animer

## Composant de démonstration

Un composant de démonstration complet est disponible dans `app/components/GSAPDemo.vue` qui montre toutes les fonctionnalités disponibles :

- Animations d'entrée (fade in, slide up, scale in)
- Animations au scroll avec ScrollTrigger
- Animations avec stagger pour plusieurs éléments
- Timelines complexes
- Gestion de l'accessibilité
- Nettoyage des animations

Pour l'utiliser, importez-le simplement dans n'importe quelle page :

```vue
<template>
  <div>
    <GSAPDemo />
  </div>
</template>
```

## Ressources supplémentaires

- [Documentation officielle GSAP](https://greensock.com/docs/)
- [GSAP Cheat Sheet](https://greensock.com/cheatsheet/)
- [ScrollTrigger Guide](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
