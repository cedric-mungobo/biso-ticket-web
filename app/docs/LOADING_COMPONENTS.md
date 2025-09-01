# Composants de Loading Réutilisables

Ce document décrit les composants de loading créés pour améliorer l'expérience utilisateur dans l'application Biso Ticket.

## 📦 Composants Disponibles

### 1. LoadingOverlay
Composant d'overlay de loading pour couvrir des sections entières.

```vue
<template>
  <div class="relative">
    <LoadingOverlay
      :show="loading"
      title="Création de l'événement..."
      description="Veuillez patienter"
      color="primary"
      :size="48"
    />
    <!-- Contenu à couvrir -->
  </div>
</template>
```

**Props :**
- `show` (boolean) : Affiche/masque l'overlay
- `title` (string, optionnel) : Titre affiché
- `description` (string, optionnel) : Description affichée
- `size` (number, défaut: 48) : Taille du spinner en pixels
- `color` (string, défaut: 'primary') : Couleur du spinner
- `containerClass` (string, optionnel) : Classes CSS pour le conteneur
- `titleClass` (string, optionnel) : Classes CSS pour le titre
- `descriptionClass` (string, optionnel) : Classes CSS pour la description
- `spinnerClass` (string, optionnel) : Classes CSS pour le spinner

### 2. LoadingSpinner
Composant de spinner simple pour les boutons et éléments inline.

```vue
<template>
  <LoadingSpinner 
    :size="20" 
    color="primary" 
    text="Chargement..."
  />
</template>
```

**Props :**
- `size` (number, défaut: 20) : Taille du spinner en pixels
- `color` (string, défaut: 'primary') : Couleur du spinner
- `text` (string, optionnel) : Texte affiché à côté du spinner
- `containerClass` (string, optionnel) : Classes CSS pour le conteneur
- `textClass` (string, optionnel) : Classes CSS pour le texte
- `spinnerClass` (string, optionnel) : Classes CSS pour le spinner

### 3. LoadingButton
Bouton avec état de loading intégré.

```vue
<template>
  <LoadingButton
    :loading="isSubmitting"
    loading-text="Envoi en cours..."
    color="primary"
    @click="handleSubmit"
  >
    Créer l'événement
  </LoadingButton>
</template>
```

**Props :**
- `loading` (boolean) : État de loading du bouton
- `disabled` (boolean) : État désactivé du bouton
- `color` (string, défaut: 'primary') : Couleur du bouton
- `variant` (string, défaut: 'solid') : Variante du bouton
- `size` (string, défaut: 'md') : Taille du bouton
- `loadingText` (string, optionnel) : Texte affiché pendant le loading
- `spinnerColor` (string, défaut: 'white') : Couleur du spinner
- `buttonClass` (string, optionnel) : Classes CSS pour le bouton

## 🔧 Composable useLoading

Composable pour gérer les états de loading de manière centralisée.

```vue
<script setup>
const { 
  isLoading, 
  loadingMessage, 
  loadingError,
  startLoading, 
  stopLoading, 
  withLoading,
  preventMultipleSubmissions 
} = useLoading()

// Exécuter une fonction avec loading automatique
const handleSubmit = preventMultipleSubmissions(async (data) => {
  await withLoading(async () => {
    // Votre logique ici
    await createEvent(data)
  }, 'Création de l\'événement...')
})
</script>
```

**Méthodes disponibles :**
- `startLoading(message?)` : Démarre le loading
- `stopLoading()` : Arrête le loading
- `stopLoadingWithError(error)` : Arrête le loading avec une erreur
- `withLoading(asyncFn, message?)` : Exécute une fonction avec loading automatique
- `preventMultipleSubmissions(fn)` : Protège contre les envois multiples

## 🎨 Couleurs Disponibles

- `primary` : Couleur primaire (violet)
- `secondary` : Couleur secondaire
- `success` : Vert (succès)
- `warning` : Jaune (avertissement)
- `error` : Rouge (erreur)
- `neutral` : Gris (neutre)
- `white` : Blanc (pour les boutons sombres)

## 📝 Exemples d'Utilisation

### Page avec formulaire
```vue
<template>
  <div class="relative">
    <LoadingOverlay
      :show="isLoading"
      title="Sauvegarde..."
      description="Veuillez patienter"
    />
    
    <form @submit="handleSubmit">
      <LoadingButton
        :loading="isLoading"
        loading-text="Envoi..."
        type="submit"
      >
        Sauvegarder
      </LoadingButton>
    </form>
  </div>
</template>

<script setup>
const { isLoading, withLoading, preventMultipleSubmissions } = useLoading()

const handleSubmit = preventMultipleSubmissions(async (data) => {
  await withLoading(async () => {
    await saveData(data)
  }, 'Sauvegarde en cours...')
})
</script>
```

### Liste avec chargement
```vue
<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner 
        :size="32" 
        color="primary" 
        text="Chargement des événements..."
      />
    </div>
    
    <div v-else>
      <!-- Liste des événements -->
    </div>
  </div>
</template>
```

## 🚀 Avantages

1. **Réutilisabilité** : Composants utilisables dans toute l'application
2. **Cohérence** : Design uniforme pour tous les états de loading
3. **Performance** : Protection contre les envois multiples
4. **Accessibilité** : Messages clairs pour l'utilisateur
5. **Flexibilité** : Personnalisation facile des couleurs et tailles
6. **TypeScript** : Support complet des types

## 🔄 Migration

Pour migrer du code existant :

1. Remplacer les overlays de loading manuels par `LoadingOverlay`
2. Remplacer les spinners manuels par `LoadingSpinner`
3. Utiliser `useLoading` pour la gestion centralisée
4. Remplacer les boutons avec loading par `LoadingButton`
