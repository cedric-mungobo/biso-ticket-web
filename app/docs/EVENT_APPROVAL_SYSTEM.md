# Système d'Approbation des Événements

## Vue d'ensemble

Le système d'approbation des événements permet de contrôler quels événements peuvent vendre des billets. Il affiche une bannière d'alerte dans l'interface organisateur pour les événements non approuvés.

## Architecture

### 1. Composable `useEventApproval`
**Fichier**: `app/composables/useEventApproval.ts`

Centralise toute la logique d'approbation :
- `isEventApproved(event)` : Vérifie si un événement est approuvé
- `getEventStatusLabel(status)` : Obtient le label du statut
- `getApprovalStatusLabel(approvalStatus)` : Obtient le label d'approbation
- `getApprovalBannerTitle(event)` : Génère le titre de la bannière
- `getApprovalBannerMessage(event)` : Génère le message de la bannière
- `formatApprovalDate(approvedAt)` : Formate la date d'approbation

### 2. Composant `EventApprovalBanner`
**Fichier**: `app/components/EventApprovalBanner.vue`

Bannière réutilisable qui s'affiche pour les événements non approuvés :
- Design cohérent avec icône d'alerte
- Messages contextuels selon le statut
- Lien vers le support
- Informations détaillées sur le statut
- Affichage de la date d'approbation si disponible

### 3. Page Organisateur
**Fichier**: `app/pages/organisateur/events/[id]/index.vue`

Intègre la bannière d'approbation :
- Utilise le composable pour la logique
- Affiche la bannière conditionnellement
- Debug intégré pour identifier les champs d'approbation

## Logique d'Approbation

### Priorité des champs d'approbation

1. **`approvedAt`** (string) - Si présent et non vide, l'événement est approuvé
2. **Fallback** - `status === 'active' && is_public === true`

**Note :** Les autres champs (`isApproved`, `approvalStatus`, `validated`) ne sont plus utilisés pour la logique d'approbation.

### Types d'événements non approuvés

| Statut | Titre | Message |
|--------|-------|---------|
| **Rejeté** | "Événement rejeté" | "Votre événement a été rejeté. Contactez le support..." |
| **En attente** | "Événement en attente de validation" | "Veuillez patienter pendant la validation..." |
| **Brouillon** | "Événement en brouillon" | "Finalisez-le et publiez-le..." |
| **Suspendu** | "Événement suspendu" | "Contactez le support pour plus d'informations..." |
| **Privé** | "Événement privé" | "Rendez-le public pour commencer à vendre..." |

## Utilisation

### Dans une page Vue

```vue
<template>
  <EventApprovalBanner 
    :event="event" 
    :is-event-approved="isEventApproved" 
  />
</template>

<script setup>
const { isEventApproved: checkEventApproval } = useEventApproval()
const isEventApproved = computed(() => checkEventApproval(event.value))
</script>
```

### Dans un composable

```typescript
const { isEventApproved, getApprovalBannerTitle, formatApprovalDate } = useEventApproval()

if (!isEventApproved(event)) {
  console.log('Titre:', getApprovalBannerTitle(event))
}

// Formater la date d'approbation
if (event.approvedAt) {
  const formattedDate = formatApprovalDate(event.approvedAt)
  console.log('Approuvé le:', formattedDate)
}
```

## Debug

### Logs de debug

La page organisateur inclut des logs de debug pour identifier les champs d'approbation :

```typescript
console.log('[DEBUG] Structure complète de l\'événement:', eventData)
console.log('[DEBUG] Champs d\'approbation potentiels:', {
  isApproved: eventData.isApproved,
  approvalStatus: eventData.approvalStatus,
  validated: eventData.validated,
  approvedAt: eventData.approvedAt,
  status: eventData.status,
  is_public: eventData.is_public
})
```

### Types TypeScript

Les types incluent les champs d'approbation potentiels :

```typescript
export interface Event {
  
  approvedAt?: string
}
```

## Configuration API

### Champs d'approbation attendus

L'API peut retourner ces champs pour gérer l'approbation :

- `isApproved` : boolean direct
- `approvalStatus` : 'pending' | 'approved' | 'rejected'
- `validated` : boolean de validation
- `approvedAt` : string (date ISO) - Date d'approbation

### Fallback

Si aucun champ d'approbation n'est présent, le système utilise :
- `status === 'active'` ET `is_public === true`

## Personnalisation

### Messages personnalisés

Modifiez les fonctions dans `useEventApproval.ts` :

```typescript
const getApprovalBannerMessage = (event: any): string => {
  // Votre logique personnalisée
  if (event.customField === 'special') {
    return 'Message spécial pour ce cas'
  }
  // ... logique par défaut
}
```

### Styles de la bannière

Modifiez `EventApprovalBanner.vue` pour personnaliser l'apparence :

```vue
<template>
  <div class="bg-custom-50 border border-custom-200 rounded-lg p-4">
    <!-- Votre design personnalisé -->
  </div>
</template>
```

## Tests

### Test de l'approbation

```typescript
// Test avec différents statuts
const testCases = [
  { status: 'draft', is_public: false, expected: false },
  { status: 'active', is_public: true, expected: true },
  { approvalStatus: 'pending', expected: false },
  { approvalStatus: 'approved', expected: true },
  { isApproved: false, expected: false },
  { isApproved: true, expected: true }
]

testCases.forEach(testCase => {
  const result = isEventApproved(testCase)
  console.assert(result === testCase.expected, `Test failed for:`, testCase)
})
```

## Maintenance

### Ajout de nouveaux statuts

1. Mettre à jour les types dans `api.d.ts`
2. Ajouter la logique dans `useEventApproval.ts`
3. Tester avec les nouveaux statuts

### Modification des messages

1. Modifier les fonctions dans `useEventApproval.ts`
2. Tester l'affichage dans l'interface
3. Vérifier la cohérence des messages

## Notes importantes

- La bannière ne s'affiche que dans l'interface organisateur
- Les événements publics sont considérés comme approuvés par défaut
- Le système est extensible pour de nouveaux champs d'approbation
- Les logs de debug sont automatiquement désactivés en production
