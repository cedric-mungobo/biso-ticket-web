# Hiérarchie des Z-Index

## Vue d'ensemble
Cette documentation définit la hiérarchie des z-index pour garantir que tous les éléments de l'interface s'affichent correctement, notamment les toasts qui doivent toujours être visibles.

## Hiérarchie des Z-Index

### 1. Toasts et Notifications (z-index: 100+)
- **Toasts Nuxt UI** : z-index automatique géré par UApp
- **Notifications système** : z-index élevé pour être toujours visibles
- **Priorité** : Maximum - doivent apparaître au-dessus de tout

### 2. Modals et Overlays (z-index: 50-99)
- **Modal principal** : z-index: 50
- **Modals secondaires** : z-index: 60-70
- **Loading overlays** : z-index: 80
- **Dropdowns et tooltips** : z-index: 90

### 3. Navigation et Headers (z-index: 40-49)
- **Header fixe** : z-index: 40
- **Navigation mobile** : z-index: 45
- **Breadcrumbs** : z-index: 42

### 4. Contenu principal (z-index: 1-39)
- **Contenu de page** : z-index: 10
- **Cards et composants** : z-index: 20-30
- **Backgrounds** : z-index: 1-5

## Configuration actuelle

### Modal Component
```css
.fixed {
  z-index: 50; /* Modals */
}

/* Container du modal */
.fixed.inset-0 {
  z-index: 50; /* Overlay */
}
```

### Toasts (Nuxt UI)
- Gérés automatiquement par `<UApp>`
- Z-index: 100+ (configuré dans index.css)
- Position: top-right (configuré dans app.config.ts)
- Configuration: `toaster.position: 'top-right'`

## Bonnes pratiques

1. **Toasts toujours visibles** : Ne jamais dépasser z-index: 100 pour les modals
2. **Hiérarchie claire** : Maintenir des écarts de 10 entre les niveaux
3. **Documentation** : Mettre à jour cette hiérarchie lors d'ajouts
4. **Tests** : Vérifier la visibilité des toasts avec modals ouverts

## Vérification

Pour tester que les toasts sont visibles avec un modal ouvert :

```javascript
// Dans un composant
const { showSuccess } = useAppToast()

// Ouvrir un modal puis afficher un toast
showSuccess('Test', 'Ce toast doit être visible au-dessus du modal')
```

### Composable de test

Utilisez `useToastTest` pour tester facilement :

```javascript
const { testToastPosition, testToastWithModal, testAllToastTypes } = useToastTest()

// Tester la position
testToastPosition()

// Tester avec modal ouvert
testToastWithModal()

// Tester tous les types
testAllToastTypes()
```

## Notes importantes

- Les toasts de Nuxt UI sont automatiquement gérés par UApp
- Le z-index du modal (50) est inférieur aux toasts (100+)
- Cette configuration garantit la visibilité des notifications importantes
