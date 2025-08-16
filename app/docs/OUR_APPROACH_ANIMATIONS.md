# Harmonisation des Animations - Composant OurApproach

## Vue d'ensemble

Le composant `OurApproach.vue` a été harmonisé pour utiliser de manière cohérente les transitions natives de Vue.js et les animations GSAP, créant une expérience utilisateur fluide et performante.

## Architecture des Animations

### 1. Transitions Natives Vue.js

Le composant utilise trois types de transitions Vue.js :

- **`fade-slide-up`** : Pour l'image (entrée par le bas avec scale)
- **`fade-slide-left`** : Pour le titre et l'en-tête de la timeline (entrée par la gauche)
- **`fade-scale`** : Pour le bouton CTA (entrée avec effet de rebond)

### 2. Animations GSAP

Les animations GSAP sont déclenchées via les hooks de transition Vue.js :

- **Image** : Animation d'entrée avec `y: 60`, `scale: 0.95` et `power3.out`
- **Titre** : Animation avec `y: 40` et `power2.out`
- **Timeline Header** : Animation avec `y: 30` et `power2.out`
- **Bouton** : Animation avec `scale: 0.8` et `back.out(1.7)`
- **Étapes** : Animation séquentielle avec `stagger: 0.15`

## Fonctionnalités Clés

### Accessibilité
- Respect des préférences `prefers-reduced-motion`
- Utilisation du composable `accessibleAnimation`
- Désactivation automatique des animations si nécessaire

### Performance
- Utilisation de `will-change: transform, opacity`
- Animations optimisées avec des durées appropriées
- Nettoyage automatique des ScrollTriggers

### Responsive
- Animations adaptées aux différentes tailles d'écran
- Délais d'animation optimisés pour l'expérience mobile

## Utilisation

### Props Disponibles
```typescript
interface Props {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  timelineTitle?: string
  steps?: Step[]
  ctaButton?: CTAButton
}
```

### Exemple d'utilisation
```vue
<OurApproach 
  title="Titre personnalisé"
  :steps="stepsPersonnalisés"
  :ctaButton="{ text: 'Action', href: '/lien' }"
/>
```

## Configuration des Animations

### Durées et Délais
- **Image** : 1.2s avec délai de 0.2s
- **Titre** : 0.8s avec délai de 0.3s
- **Header Timeline** : 0.7s avec délai de 0.4s
- **Bouton** : 0.6s avec délai de 0.8s
- **Étapes** : 0.8s avec stagger de 0.15s

### Easing Functions
- **Entrées** : `power2.out`, `power3.out`, `back.out(1.7)`
- **Sorties** : `power2.in`

## ScrollTrigger Integration

Le composant utilise ScrollTrigger pour déclencher les animations des étapes quand l'image entre dans le viewport :

```typescript
createScrollAnimation(imageContainer.value, {
  start: 'top 85%',
  end: 'bottom 15%',
  onEnter: () => {
    setTimeout(animateSteps, 200)
  }
})
```

## Styles CSS

### Transitions Personnalisées
- Utilisation de `cubic-bezier` pour des courbes d'animation naturelles
- Support des préférences de réduction de mouvement
- Optimisations de performance avec `will-change`

### Media Queries
```css
@media (prefers-reduced-motion: reduce) {
  /* Désactivation des transitions */
}
```

## Bonnes Pratiques Implémentées

1. **Séparation des responsabilités** : Transitions Vue pour l'état, GSAP pour les animations complexes
2. **Performance** : Utilisation de `nextTick` et gestion des références
3. **Accessibilité** : Respect des préférences utilisateur
4. **Maintenabilité** : Code modulaire et bien structuré
5. **Réutilisabilité** : Props configurables et animations personnalisables

## Dépannage

### Problèmes Courants
- **Animations qui ne se déclenchent pas** : Vérifier que GSAP est bien initialisé
- **Performance dégradée** : Vérifier les préférences de réduction de mouvement
- **Erreurs TypeScript** : S'assurer que les types sont correctement définis

### Debug
- Utiliser `console.log` dans les fonctions d'animation
- Vérifier les références DOM avec `stepRefs.value`
- Contrôler l'état de `prefersReducedMotion()`

## Évolutions Futures

- Ajout d'animations d'interaction (hover, focus)
- Support des animations de sortie de page
- Intégration avec d'autres composants GSAP
- Tests unitaires pour les animations
