# Composant OurApproach

## Description
Le composant `OurApproach` est un composant Vue.js réutilisable qui affiche une section "Notre approche" avec une timeline d'étapes et une image illustrative.

## Utilisation

### Import automatique
Le composant est automatiquement disponible dans toutes les pages grâce à l'auto-import de Nuxt.js.

### Utilisation simple
```vue
<template>
  <OurApproach />
</template>
```

### Utilisation avec props personnalisées
```vue
<template>
  <OurApproach 
    title="Notre méthodologie"
    description="Une approche structurée pour réussir vos projets"
    :steps="mesEtapes"
    :ctaButton="monBouton"
  />
</template>

<script setup>
const mesEtapes = [
  {
    title: "Analyse des besoins",
    description: "Comprendre vos objectifs et contraintes"
  },
  {
    title: "Conception",
    description: "Créer une solution adaptée"
  }
]

const monBouton = {
  text: "Nous contacter",
  href: "/contact"
}
</script>
```

## Props

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `title` | `string` | Non | "Our approach" | Titre principal de la section |
| `description` | `string` | Non | Description par défaut | Description de la section |
| `imageSrc` | `string` | Non | Image Unsplash | URL de l'image illustrative |
| `imageAlt` | `string` | Non | "Features Image" | Texte alternatif de l'image |
| `timelineTitle` | `string` | Non | "Steps" | Titre de la timeline |
| `steps` | `Step[]` | Non | 4 étapes par défaut | Tableau des étapes |
| `ctaButton` | `CTAButton` | Non | Bouton par défaut | Configuration du bouton d'action |

## Interfaces TypeScript

### Step
```typescript
interface Step {
  title: string
  description: string
}
```

### CTAButton
```typescript
interface CTAButton {
  text: string
  href: string
}
```

## Structure HTML générée

Le composant génère une structure HTML avec :
- Un titre et une description
- Une grille responsive (1 colonne sur mobile, 2 colonnes sur desktop)
- Une image à gauche
- Une timeline à droite avec des étapes numérotées
- Un bouton d'action en bas de la timeline

## Styles

Le composant utilise Tailwind CSS avec :
- Design responsive
- Thème sombre compatible
- Couleurs personnalisées (#ff0 pour les accents)
- Transitions et effets hover

## Responsabilité unique

Ce composant respecte le principe de responsabilité unique en se concentrant uniquement sur l'affichage de la section "Notre approche". Il est :
- Réutilisable dans d'autres pages
- Facilement personnalisable via les props
- Maintenable et testable indépendamment
