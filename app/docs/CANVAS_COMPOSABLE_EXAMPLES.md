# Exemples d'utilisation du composable `useCanvas`

Le composable `useCanvas` fournit des fonctions modulaires pour créer et manipuler des canvas HTML5 de manière simple et réutilisable.

## Importation

```typescript
const { 
  createCanvas,
  addText,
  addBlock,
  addImage,
  addQRCode,
  addImagePlaceholder,
  exportCanvas,
  isValidImageUrl
} = useCanvas()
```

## Exemples d'utilisation

### 1. Créer un canvas simple

```typescript
const { canvas, ctx } = createCanvas({
  width: 400,
  height: 600,
  scale: 2, // Haute résolution
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  borderWidth: 2
})
```

### 2. Ajouter du texte

```typescript
// Titre principal
addText(ctx, {
  x: 20,
  y: 50,
  text: 'Mon Titre',
  fontSize: 24,
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'center'
}, scale)

// Texte avec largeur maximale (wrapping)
addText(ctx, {
  x: 20,
  y: 100,
  text: 'Ce texte va se répartir sur plusieurs lignes si nécessaire',
  fontSize: 14,
  color: '#6b7280',
  maxWidth: 300
}, scale)
```

### 3. Ajouter des blocs/rectangles

```typescript
// Bloc avec coins arrondis
addBlock(ctx, {
  x: 20,
  y: 150,
  width: 360,
  height: 80,
  backgroundColor: '#f3f4f6',
  borderColor: '#d1d5db',
  borderWidth: 1,
  borderRadius: 8,
  padding: 10
}, scale)

// Bloc simple
addBlock(ctx, {
  x: 20,
  y: 250,
  width: 100,
  height: 50,
  backgroundColor: '#8b12ff'
}, scale)
```

### 4. Ajouter des images

```typescript
// Image avec maintien du ratio d'aspect
const imageLoaded = await addImage(ctx, 'https://example.com/image.jpg', {
  x: 20,
  y: 320,
  width: 200,
  height: 150,
  maintainAspectRatio: true,
  fit: 'contain', // ou 'cover' ou 'fill'
  borderRadius: 8
}, scale)

if (!imageLoaded) {
  // Afficher un placeholder si l'image n'a pas pu être chargée
  addImagePlaceholder(ctx, 20, 320, 200, 150, scale, 'Image non disponible')
}
```

### 5. Ajouter un QR code

```typescript
await addQRCode(ctx, 'Données du QR code', {
  x: 100,
  y: 500,
  size: 200,
  backgroundColor: '#f9fafb',
  borderColor: '#d1d5db',
  borderWidth: 1
}, scale)
```

### 6. Exporter le canvas

```typescript
// Exporter en PNG
const success = exportCanvas(canvas, 'mon-image.png')

if (success) {
  console.log('Image exportée avec succès')
} else {
  console.error('Erreur lors de l\'export')
}
```

## Exemple complet : Créer un certificat

```typescript
const createCertificate = async (userName: string, courseName: string) => {
  const { canvas, ctx } = createCanvas({
    width: 800,
    height: 600,
    scale: 2,
    backgroundColor: '#ffffff',
    borderColor: '#8b12ff',
    borderWidth: 3
  })
  
  // En-tête
  addBlock(ctx, {
    x: 0,
    y: 0,
    width: 800,
    height: 100,
    backgroundColor: '#8b12ff'
  }, 2)
  
  // Titre du certificat
  addText(ctx, {
    x: 400,
    y: 60,
    text: 'CERTIFICAT DE COMPLETION',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  }, 2)
  
  // Contenu principal
  addText(ctx, {
    x: 400,
    y: 200,
    text: `Ceci certifie que`,
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center'
  }, 2)
  
  addText(ctx, {
    x: 400,
    y: 250,
    text: userName,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8b12ff',
    textAlign: 'center'
  }, 2)
  
  addText(ctx, {
    x: 400,
    y: 300,
    text: `a complété avec succès le cours`,
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center'
  }, 2)
  
  addText(ctx, {
    x: 400,
    y: 350,
    text: courseName,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center'
  }, 2)
  
  // Date
  const date = new Date().toLocaleDateString('fr-FR')
  addText(ctx, {
    x: 400,
    y: 450,
    text: `Date: ${date}`,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center'
  }, 2)
  
  // Signature
  addText(ctx, {
    x: 400,
    y: 550,
    text: 'Signature du formateur',
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center'
  }, 2)
  
  return canvas
}
```

## Exemple : Créer une carte de visite

```typescript
const createBusinessCard = async (contactInfo: any) => {
  const { canvas, ctx } = createCanvas({
    width: 350,
    height: 200,
    scale: 2,
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1
  })
  
  // Fond coloré
  addBlock(ctx, {
    x: 0,
    y: 0,
    width: 350,
    height: 200,
    backgroundColor: '#8b12ff'
  }, 2)
  
  // Zone de contenu
  addBlock(ctx, {
    x: 20,
    y: 20,
    width: 310,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 8
  }, 2)
  
  // Nom
  addText(ctx, {
    x: 30,
    y: 50,
    text: contactInfo.name,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  }, 2)
  
  // Titre
  addText(ctx, {
    x: 30,
    y: 80,
    text: contactInfo.title,
    fontSize: 14,
    color: '#6b7280'
  }, 2)
  
  // Email
  addText(ctx, {
    x: 30,
    y: 110,
    text: contactInfo.email,
    fontSize: 12,
    color: '#1f2937'
  }, 2)
  
  // Téléphone
  addText(ctx, {
    x: 30,
    y: 130,
    text: contactInfo.phone,
    fontSize: 12,
    color: '#1f2937'
  }, 2)
  
  // Logo/QR code
  if (contactInfo.qrData) {
    await addQRCode(ctx, contactInfo.qrData, {
      x: 250,
      y: 40,
      size: 80,
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      borderWidth: 1
    }, 2)
  }
  
  return canvas
}
```

## Avantages du composable

1. **Modulaire** : Chaque fonction a une responsabilité spécifique
2. **Réutilisable** : Peut être utilisé dans différents composants
3. **Configurable** : Options flexibles pour chaque élément
4. **Gestion d'erreurs** : Fallbacks automatiques
5. **TypeScript** : Interfaces complètes pour toutes les options
6. **Haute résolution** : Support du scaling pour des images nettes
7. **CORS** : Gestion automatique des problèmes de sécurité

## Types disponibles

```typescript
interface CanvasConfig {
  width: number
  height: number
  scale?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

interface TextOptions {
  x: number
  y: number
  text: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: number
}

interface ImageOptions {
  x: number
  y: number
  width: number
  height: number
  maintainAspectRatio?: boolean
  fit?: 'cover' | 'contain' | 'fill'
  borderRadius?: number
}

interface BlockOptions {
  x: number
  y: number
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  padding?: number
}

interface QRCodeOptions {
  x: number
  y: number
  size: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}
```
