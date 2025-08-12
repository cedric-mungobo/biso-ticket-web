# Composants de Services - Biso Ticket

## 🎯 **Vue d'ensemble**

Ce document explique l'utilisation des composants de services créés pour présenter les offres de Biso Ticket de manière modulaire et réutilisable.

## 📁 **Composants créés**

```
app/components/
├── ServicesSection.vue    # Section principale des services
└── ServiceCard.vue        # Carte individuelle de service
```

## 🏗️ **ServicesSection.vue**

### **Fonctionnalité**
- Section complète présentant tous les services de Biso Ticket
- En-tête avec titre, slogan et valeurs clés
- Grille responsive de cartes de services
- Call-to-action pour l'organisation d'événements

### **Utilisation**
```vue
<template>
  <div>
    <!-- Autres sections -->
    <ServicesSection />
    <!-- Autres sections -->
  </div>
</template>
```

### **Structure interne**
- **En-tête** : Titre, slogan, valeurs clés (Sécurité, Rapidité, Efficacité, Simplicité)
- **Description** : Texte explicatif des services
- **Grille de services** : 6 cartes de services organisées en grid responsive
- **CTA** : Lien vers la page organisateur

## 🎴 **ServiceCard.vue**

### **Fonctionnalité**
- Carte individuelle pour chaque service
- Design cohérent avec EventCard
- Badge coloré, titre, icône, description et CTA
- Hover effects et transitions fluides

### **Props**
```typescript
interface Service {
  id: string                    // Identifiant unique
  badge: {                      // Configuration du badge
    text: string               // Texte du badge
    color: string              // Couleur du texte
    bgColor: string            // Couleur de fond
    borderColor: string        // Couleur de la bordure
  }
  title: string                 // Titre du service
  description: string           // Description détaillée
  icon: string                  // Path SVG de l'icône
  gradient: {                   // Configuration du gradient
    from: string               // Couleur de début
    to: string                 // Couleur de fin
  }
  iconColor: string             // Couleur de l'icône
  tag: string                   // Tag descriptif
  cta: string                   // Texte du bouton d'action
}
```

### **Utilisation**
```vue
<ServiceCard :service="serviceData" />
```

## 🎨 **Services disponibles**

### **1. Billeterie en ligne**
- **Badge** : Bleu "Billeterie"
- **Description** : Vente de billets en ligne sécurisée
- **CTA** : "Commencer →"

### **2. Billet bracelet**
- **Badge** : Vert "Bracelet"
- **Description** : Bracelets d'accès personnalisés avec QR code
- **CTA** : "Commander →"

### **3. Billet papier**
- **Badge** : Orange "Papier"
- **Description** : Billets papier imprimés de haute qualité
- **CTA** : "Imprimer →"

### **4. Invitation électronique**
- **Badge** : Violet "Digital"
- **Description** : Invitations digitales élégantes
- **CTA** : "Créer →"

### **5. Gestion d'événements**
- **Badge** : Rouge "Gestion"
- **Description** : Plateforme complète de gestion
- **CTA** : "Découvrir →"

### **6. Support client**
- **Badge** : Teal "Support"
- **Description** : Assistance 24/7
- **CTA** : "Contacter →"

## 🔧 **Personnalisation**

### **Ajouter un nouveau service**
```typescript
// Dans ServicesSection.vue
const services: Service[] = [
  // ... services existants
  {
    id: 'nouveau-service',
    badge: {
      text: 'Nouveau',
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    title: 'Nouveau Service',
    description: 'Description du nouveau service',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    gradient: { from: 'from-indigo-100', to: 'to-indigo-200' },
    iconColor: 'text-indigo-600',
    tag: 'Nouveau',
    cta: 'Essayer'
  }
]
```

### **Modifier les couleurs**
```typescript
// Changer les couleurs d'un service existant
{
  badge: {
    color: 'text-emerald-700',      // Nouvelle couleur de texte
    bgColor: 'bg-emerald-50',       // Nouvelle couleur de fond
    borderColor: 'border-emerald-200' // Nouvelle couleur de bordure
  },
  gradient: { 
    from: 'from-emerald-100',       // Nouveau gradient début
    to: 'to-emerald-200'            // Nouveau gradient fin
  },
  iconColor: 'text-emerald-600'     // Nouvelle couleur d'icône
}
```

## 📱 **Responsive Design**

### **Grille adaptative**
- **Mobile** : 1 colonne
- **Tablet** : 2 colonnes
- **Desktop** : 3 colonnes

### **Classes CSS utilisées**
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8
```

## 🚀 **Avantages de la modularité**

### **Réutilisabilité**
- Composant utilisable sur d'autres pages
- Facile à importer et intégrer

### **Maintenance**
- Code centralisé et organisé
- Modifications faciles à appliquer

### **Performance**
- Composants chargés à la demande
- Code splitting automatique

### **Tests**
- Composants testables individuellement
- Logique métier séparée de l'affichage

## 📝 **Bonnes pratiques**

### **Naming Convention**
- **ServicesSection** : Section principale
- **ServiceCard** : Carte individuelle
- **Props** : Nommage descriptif et cohérent

### **TypeScript**
- Interfaces bien définies
- Props typées et validées
- Autocomplétion et vérification d'erreurs

### **Accessibilité**
- Structure sémantique avec `<section>` et `<article>`
- Textes alternatifs pour les icônes
- Navigation au clavier

## 🔄 **Évolutions futures**

### **Fonctionnalités possibles**
- Filtrage des services par catégorie
- Tri dynamique
- Animations d'entrée
- Mode sombre/clair
- Internationalisation des textes

### **Intégrations**
- API pour récupérer les services
- CMS pour la gestion du contenu
- Analytics pour le suivi des clics
