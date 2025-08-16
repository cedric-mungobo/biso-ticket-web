# 🎨 GSAP - Intégration dans Biso Ticket

## 🚀 Installation rapide

GSAP est déjà installé dans le projet ! Aucune action supplémentaire requise.

```bash
# Vérification de l'installation
npm list gsap
```

## 📁 Structure des fichiers

```
app/
├── plugins/
│   └── gsap.client.ts          # Plugin Nuxt pour GSAP
├── composables/
│   └── useGSAP.ts              # Composable avec fonctions utilitaires
├── types/
│   └── gsap.d.ts               # Types TypeScript
├── components/
│   ├── Hero.vue                 # Exemple d'utilisation
│   ├── EventsSection.vue        # Exemple avec ScrollTrigger
│   └── GSAPDemo.vue            # Composant de démonstration complet
└── docs/
    └── GSAP_INTEGRATION.md     # Documentation complète
```

## ⚡ Utilisation rapide

### 1. Dans un composant Vue

```vue
<template>
  <div ref="myElement" class="opacity-0">
    Contenu à animer
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const myElement = ref<HTMLElement>()

onMounted(() => {
  const { animateIn } = useGSAP()
  
  animateIn(myElement.value, {
    duration: 0.8,
    y: 50
  })
})
</script>
```

### 2. Animation au scroll

```typescript
const { createScrollAnimation } = useGSAP()

createScrollAnimation(element.value, {
  start: 'top 80%',
  onEnter: () => console.log('Élément visible !')
})
```

### 3. Timeline complexe

```typescript
const { createTimeline } = useGSAP()

const tl = createTimeline({ delay: 0.3 })
tl.to(title.value, { opacity: 1, duration: 1 })
  .to(subtitle.value, { opacity: 1, duration: 0.8 }, '-=0.4')
  .to(button.value, { opacity: 1, duration: 0.6 }, '-=0.3')
```

## 🎯 Fonctions principales

- **`animateIn()`** - Animation d'entrée simple
- **`animateOut()`** - Animation de sortie
- **`createScrollAnimation()`** - Animation au scroll
- **`createTimeline()`** - Création de timelines
- **`staggerAnimation()`** - Animation avec délai entre éléments
- **`cleanup()`** - Nettoyage des ScrollTriggers

## 🔧 Configuration

Le plugin GSAP est automatiquement chargé côté client. Les plugins suivants sont inclus :
- ✅ ScrollTrigger (animations au scroll)
- ✅ ScrollToPlugin (défilement programmatique)
- ✅ TextPlugin (animations de texte)

## 📱 Accessibilité

Le composable respecte automatiquement les préférences `prefers-reduced-motion` :

```typescript
const { accessibleAnimation, prefersReducedMotion } = useGSAP()

accessibleAnimation(element.value, 
  () => complexAnimation(), // Animation normale
  () => simpleAnimation()   // Alternative simple
)
```

## 🧪 Test et démonstration

Utilisez le composant `GSAPDemo.vue` pour tester toutes les fonctionnalités :

```vue
<template>
  <GSAPDemo />
</template>
```

## 📚 Documentation complète

Consultez `app/docs/GSAP_INTEGRATION.md` pour une documentation détaillée avec exemples avancés.

## 🆘 Dépannage

### Problème : Animations qui ne fonctionnent pas
- ✅ Vérifiez que l'élément existe dans le DOM
- ✅ Assurez-vous d'être dans `onMounted()`
- ✅ Vérifiez que GSAP est chargé : `console.log(useGSAP().isGSAPAvailable())`

### Problème : ScrollTrigger non fonctionnel
- ✅ Vérifiez que le plugin est enregistré
- ✅ Utilisez `markers: true` pour debug
- ✅ Appelez `cleanup()` au démontage

## 🌟 Exemples dans le projet

- **Hero.vue** : Animations d'entrée séquentielles
- **EventsSection.vue** : Système avancé de déclenchement au scroll avec gestion des triggers
- **GSAPDemo.vue** : Toutes les fonctionnalités en action

## 🎬 Système de déclenchement avancé

Le composant `EventsSection.vue` implémente un système sophistiqué de déclenchement GSAP :

### Fonctionnalités clés
- ✅ **Gestion intelligente des ScrollTriggers** avec nettoyage automatique
- ✅ **Animations individuelles** pour chaque carte d'événement
- ✅ **Contrôles de développement** pour tester et déboguer
- ✅ **Gestion du cycle de vie** avec nettoyage automatique
- ✅ **Animations conditionnelles** basées sur le contenu

### Contrôles disponibles
- 🎬 Déclencher toutes les animations manuellement
- 🔄 Réinitialiser l'état des animations
- 📍 Reconfigurer les ScrollTriggers
- 📊 Monitoring du nombre de triggers actifs

**Consultez `app/docs/EVENTS_SECTION_GSAP.md` pour une documentation complète du système.**

---

**GSAP est maintenant prêt à être utilisé dans votre projet Biso Ticket ! 🎉**
