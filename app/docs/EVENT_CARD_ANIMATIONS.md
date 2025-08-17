# Animations du Composant EventCard

## Vue d'ensemble

Le composant `EventCard.vue` a été entièrement animé pour s'intégrer parfaitement avec les animations de la grille d'événements, offrant une expérience utilisateur fluide et engageante pour chaque carte d'événement.

## Architecture des Animations

### 1. Animations GSAP

Le composant utilise GSAP pour les animations d'entrée et au scroll :

- **Animation d'entrée** : `y: 30`, `scale: 0.95` avec `power2.out`
- **ScrollTrigger** : Déclenchement au scroll avec délai pour l'animation séquentielle
- **Accessibilité** : Respect des préférences `prefers-reduced-motion`

### 2. Transitions CSS

Les transitions CSS gèrent les animations d'état et les effets de hover :

- **Éléments internes** : Badge, titre, image, actions
- **Effets de hover** : Transformations et ombres
- **Performance** : Utilisation de `will-change`

## Séquence d'Animation

### Animation d'Entrée
```
1. État initial : opacity: 0, translateY(30px), scale(0.95)
2. Déclenchement : ScrollTrigger (top 85%)
3. Animation : 1.2s avec power2.out
4. État final : opacity: 1, translateY(0), scale(1)
```

### Délai Séquentiel
- **Délai d'animation** : 100ms après le déclenchement
- **Intégration** : Avec le système de stagger de la grille
- **Cohérence** : Rythme harmonisé avec les autres composants

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
- Transitions fluides sur tous les appareils
- Effets de hover optimisés pour mobile

## Configuration des Animations

### Durées et Délais
- **Animation d'entrée** : 1.2s
- **Délai de déclenchement** : 100ms
- **Transitions CSS** : 0.4s - 0.6s selon l'élément

### Easing Functions
- **Entrées** : `power2.out`
- **Hover** : `cubic-bezier(0.4, 0, 0.2, 1)`

## ScrollTrigger Integration

Le composant utilise ScrollTrigger pour déclencher les animations :

```typescript
createScrollAnimation(cardRef.value, {
  start: 'top 85%',
  end: 'bottom 15%',
  onEnter: () => {
    setTimeout(animateCardEnter, 100)
  }
})
```

## Effets Visuels Avancés

### Hover Effects
- **Carte complète** : `translateY(-8px) scale(1.02)`
- **Badge de catégorie** : `scale(1.05)`
- **Titre** : `translateX(4px)`
- **Image** : `scale(1.05)`
- **Lien** : `translateX(4px)`

### Ombres et Transformations
- **Ombre par défaut** : `hover:shadow-lg`
- **Ombre au hover** : `0 20px 40px rgba(0, 0, 0, 0.15)`
- **Transitions** : Fluides et naturelles

## Styles CSS

### Transitions Personnalisées
```css
.event-card-animated {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-badge {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-image-container {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Media Queries
```css
@media (prefers-reduced-motion: reduce) {
  /* Désactivation des transitions */
}
```

## Intégration avec la Grille

### Animation Séquentielle
- **Coordination** : Avec le système de stagger de la grille
- **Timing** : Délais harmonisés pour une expérience fluide
- **Performance** : Optimisations pour les grilles de grande taille

### Responsive Design
- **Mobile** : Animations adaptées aux petits écrans
- **Tablet** : Transitions optimisées pour les écrans moyens
- **Desktop** : Effets complets avec toutes les animations

## Bonnes Pratiques Implémentées

1. **Séparation des responsabilités** : GSAP pour l'entrée, CSS pour l'état
2. **Performance** : Utilisation de `nextTick` et gestion des références
3. **Accessibilité** : Respect des préférences utilisateur
4. **Maintenabilité** : Code modulaire et bien structuré
5. **Réutilisabilité** : Composant configurable et extensible

## Dépannage

### Problèmes Courants
- **Animations qui ne se déclenchent pas** : Vérifier que GSAP est bien initialisé
- **Performance dégradée** : Vérifier les préférences de réduction de mouvement
- **Erreurs TypeScript** : S'assurer que les types sont correctement définis

### Debug
- Utiliser `console.log` dans les fonctions d'animation
- Vérifier les références DOM avec `cardRef.value`
- Contrôler l'état de `prefersReducedMotion()`

## Évolutions Futures

- Ajout d'animations d'interaction (focus, active) plus avancées
- Support des animations de sortie de page
- Intégration avec d'autres composants GSAP
- Tests unitaires pour les animations
- Optimisations de performance supplémentaires
- Support des animations de filtrage en temps réel
- Intégration avec des effets de parallaxe

## Impact sur l'Expérience Utilisateur

### Navigation
- **Engagement** : Animations fluides qui captent l'attention
- **Clarté** : Hiérarchie visuelle claire des éléments
- **Interactivité** : Effets de hover engageants

### Performance
- **Fluidité** : Transitions naturelles et agréables
- **Responsive** : Expérience cohérente sur tous les appareils
- **Accessibilité** : Respect des préférences utilisateur
