# Animations du Composant Hero

## Vue d'ensemble

Le composant `Hero.vue` a été entièrement harmonisé pour utiliser de manière cohérente les transitions natives de Vue.js et les animations GSAP, créant une expérience d'entrée fluide et engageante pour la première impression de l'utilisateur.

## Architecture des Animations

### 1. Transitions Natives Vue.js

Le composant utilise trois types de transitions Vue.js spécialement conçues :

- **`hero-title`** : Pour le titre principal "Biso Ticket" (entrée par le bas avec scale)
- **`hero-subtitle`** : Pour le sous-titre descriptif (entrée par le bas)
- **`hero-buttons`** : Pour les boutons d'action (entrée avec effet de rebond)

### 2. Animations GSAP

Les animations GSAP sont déclenchées via les hooks de transition Vue.js :

- **Titre** : Animation avec `y: 80`, `scale: 0.9` et `power3.out`
- **Sous-titre** : Animation avec `y: 60` et `power2.out`
- **Boutons** : Animation avec `y: 40`, `scale: 0.8` et `back.out(1.7)`

## Séquence d'Animation

### Orchestration Temporelle
```
0.0s  → Début de l'animation
0.5s  → Animation du titre (2.2s)
1.2s  → Animation du sous-titre (1.8s)
2.0s  → Animation des boutons (1.6s)
3.6s  → Fin de la séquence complète
```

### Hiérarchie des Animations
```
Titre Principal (0.5s)
    ↓
Sous-titre (1.2s)
    ↓
Boutons d'Action (2.0s)
```

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
- **Titre** : 2.2s avec délai de 0.5s
- **Sous-titre** : 1.8s avec délai de 1.2s
- **Boutons** : 1.6s avec délai de 2.0s

### Easing Functions
- **Entrées** : `power3.out`, `power2.out`, `back.out(1.7)`
- **Sorties** : `power2.in`

## ScrollTrigger Integration

Le composant utilise ScrollTrigger pour déclencher des animations au scroll :

```typescript
// Animation du titre au scroll
createScrollAnimation(titleRef.value, {
  start: 'top 90%',
  end: 'bottom 10%'
})

// Animation du sous-titre au scroll
createScrollAnimation(subtitleRef.value, {
  start: 'top 85%',
  end: 'bottom 15%'
})

// Animation des boutons au scroll
createScrollAnimation(buttonsRef.value, {
  start: 'top 80%',
  end: 'bottom 20%'
})
```

## Effets Visuels Avancés

### Hover Effects
- **Image de fond** : Scale subtil de 1.02 sur 8s
- **Overlay** : Réduction de l'opacité au hover
- **Boutons** : Scale et ombre au hover

### Transitions CSS
- Utilisation de `cubic-bezier` pour des courbes d'animation naturelles
- Support des préférences de réduction de mouvement
- Optimisations de performance avec `will-change`

## Styles CSS

### Transitions Personnalisées
```css
.hero-title-enter-active {
  transition: all 2.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-subtitle-enter-active {
  transition: all 1.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-buttons-enter-active {
  transition: all 1.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

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
5. **Réutilisabilité** : Animations configurables et extensibles

## Dépannage

### Problèmes Courants
- **Animations qui ne se déclenchent pas** : Vérifier que GSAP est bien initialisé
- **Performance dégradée** : Vérifier les préférences de réduction de mouvement
- **Erreurs TypeScript** : S'assurer que les types sont correctement définis

### Debug
- Utiliser `console.log` dans les fonctions d'animation
- Vérifier les références DOM avec `titleRef.value`
- Contrôler l'état de `prefersReducedMotion()`

## Évolutions Futures

- Ajout d'animations d'interaction (hover, focus) plus avancées
- Support des animations de sortie de page
- Intégration avec d'autres composants GSAP
- Tests unitaires pour les animations
- Optimisations de performance supplémentaires
- Support des animations de parallaxe
- Intégration avec des effets de particules

## Impact sur l'Expérience Utilisateur

### Première Impression
- **Engagement** : Animations fluides qui captent l'attention
- **Professionnalisme** : Transitions soignées et raffinées
- **Performance** : Chargement progressif et optimisé

### Navigation
- **Clarté** : Hiérarchie visuelle claire des éléments
- **Accessibilité** : Respect des préférences utilisateur
- **Responsive** : Expérience cohérente sur tous les appareils
