# Utilisation du Composable useTickets

## 🎫 **Vue d'ensemble**

Le composable `useTickets` gère l'état global des tickets sélectionnés et des réservations dans l'application Biso Ticket.

## 📁 **Localisation**

```
app/composables/useTickets.ts
```

## 🔧 **Fonctionnalités principales**

### **1. Gestion de l'état des tickets**
- ✅ **Sélection de tickets** : Quantités par type de ticket
- ✅ **Événement courant** : Événement pour lequel les tickets sont sélectionnés
- ✅ **Résumé de réservation** : Calculs automatiques des totaux
- ✅ **Persistance** : Sauvegarde dans les cookies

### **2. Calculs automatiques**
- ✅ **Total des quantités** : Somme de tous les tickets sélectionnés
- ✅ **Prix total** : Calcul automatique basé sur les prix et quantités
- ✅ **Devise** : Gestion de la devise de l'événement

### **3. Gestion des réservations**
- ✅ **Démarrage de réservation** : Initialisation du processus
- ✅ **Suivi de réservation** : ID et statut de la réservation active
- ✅ **Validation** : Vérification des données avant réservation

## 🚀 **Utilisation dans les composants**

### **Import et initialisation :**
```typescript
import { useTickets } from '~/composables/useTickets'

// Dans le composant
const { 
  reservationSummary, 
  currentEvent,
  selectedTickets,
  hasSelectedTickets,
  totalQuantity,
  totalPrice,
  setEvent,
  incrementQuantity,
  decrementQuantity,
  clearSelection,
  startReservation
} = useTickets()
```

### **Sélection d'un événement :**
```typescript
// Définir l'événement courant
setEvent(eventData)

// L'état sera automatiquement mis à jour
console.log('Événement défini:', currentEvent.value)
```

### **Gestion des quantités :**
```typescript
// Incrémenter la quantité d'un ticket
incrementQuantity(ticketId)

// Décrémenter la quantité d'un ticket
decrementQuantity(ticketId)

// Définir une quantité spécifique
setQuantity(ticketId, 3)

// Obtenir la quantité d'un ticket
const quantity = getTicketQuantity(ticketId)
```

### **Vérification de l'état :**
```typescript
// Vérifier s'il y a des tickets sélectionnés
if (hasSelectedTickets.value) {
  console.log('Tickets sélectionnés:', selectedTickets.value)
}

// Obtenir le total des quantités
console.log('Total tickets:', totalQuantity.value)

// Obtenir le prix total
console.log('Prix total:', totalPrice.value)
```

### **Démarrage d'une réservation :**
```typescript
// Démarrer le processus de réservation
startReservation()

// Vérifier si une réservation est active
if (isReservationActive.value) {
  console.log('Réservation en cours:', currentReservationId.value)
}
```

## 📊 **Structure des données**

### **ReservationSummary :**
```typescript
interface ReservationSummary {
  event: Event
  selectedTickets: TicketSelection[]
  totalQuantity: number
  totalPrice: number
  currency: string
}
```

### **TicketSelection :**
```typescript
interface TicketSelection {
  ticketId: number
  quantity: number
  ticket: Ticket
}
```

### **État global :**
```typescript
const selectedTickets = ref<Record<number, number>>({})
const currentEvent = ref<Event | null>(null)
const isReservationActive = ref(false)
const currentReservationId = ref<string | null>(null)
```

## 🔄 **Persistance automatique**

### **Cookies utilisés :**
- ✅ **`biso-selected-tickets`** : Tickets sélectionnés
- ✅ **`biso-current-event`** : Événement courant
- ✅ **`biso-reservation-active`** : Statut de réservation
- ✅ **`biso-reservation-id`** : ID de réservation

### **Synchronisation :**
```typescript
// Les changements sont automatiquement sauvegardés
watch(selectedTickets, (newValue) => {
  selectedTicketsCookie.value = newValue
}, { deep: true })

// Restauration automatique au chargement
onMounted(() => {
  if (selectedTicketsCookie.value) {
    selectedTickets.value = { ...selectedTicketsCookie.value }
  }
})
```

## 🎯 **Exemples d'utilisation**

### **Page de sélection de tickets :**
```vue
<template>
  <div v-if="currentEvent">
    <h2>{{ currentEvent.name }}</h2>
    
    <div v-for="ticket in currentEvent.tickets" :key="ticket.id">
      <h3>{{ ticket.type }} - {{ ticket.price }} {{ ticket.devise }}</h3>
      
      <div class="quantity-controls">
        <button @click="decrementQuantity(ticket.id)">-</button>
        <span>{{ getTicketQuantity(ticket.id) }}</span>
        <button @click="incrementQuantity(ticket.id)">+</button>
      </div>
    </div>
    
    <div v-if="hasSelectedTickets" class="summary">
      <p>Total: {{ totalQuantity }} tickets</p>
      <p>Prix: {{ totalPrice.toFixed(2) }} {{ currentEvent.currency }}</p>
      <button @click="startReservation">Réserver</button>
    </div>
  </div>
</template>

<script setup>
const { 
  currentEvent, 
  hasSelectedTickets, 
  totalQuantity, 
  totalPrice,
  incrementQuantity, 
  decrementQuantity, 
  getTicketQuantity,
  startReservation 
} = useTickets()
</script>
```

### **Page de paiement :**
```vue
<template>
  <div v-if="reservationSummary">
    <h2>Récapitulatif</h2>
    <p>Événement: {{ reservationSummary.event.name }}</p>
    <p>Total: {{ reservationSummary.totalPrice.toFixed(2) }} {{ reservationSummary.currency }}</p>
    
    <div v-for="ticket in reservationSummary.selectedTickets" :key="ticket.ticketId">
      <p>{{ ticket.ticket.type }} x{{ ticket.quantity }}</p>
    </div>
  </div>
</template>

<script setup>
const { reservationSummary } = useTickets()
</script>
```

## 🚨 **Gestion des erreurs**

### **Validation des réservations :**
```typescript
const validateReservation = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!currentEvent.value) {
    errors.push('Aucun événement sélectionné')
  }
  
  if (!hasSelectedTickets.value) {
    errors.push('Aucun ticket sélectionné')
  }
  
  if (totalQuantity.value === 0) {
    errors.push('Quantité totale invalide')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

## 🎉 **Avantages de useTickets**

### **✅ État global :**
- **Partagé** entre tous les composants
- **Réactif** avec Vue 3 Composition API
- **Persistant** avec cookies automatiques

### **✅ Logique centralisée :**
- **Calculs** automatiques des totaux
- **Validation** des données
- **Gestion** des réservations

### **✅ Facile à utiliser :**
- **API simple** et intuitive
- **Types TypeScript** complets
- **Documentation** claire

## 🔧 **Maintenance et évolution**

### **Ajout de nouvelles fonctionnalités :**
```typescript
// Dans useTickets.ts
const newFeature = () => {
  // Implémentation
}

// Exposer dans le return
return {
  // ... autres fonctions
  newFeature
}
```

### **Modification des types :**
```typescript
// Mettre à jour les interfaces
interface TicketSelection {
  ticketId: number
  quantity: number
  ticket: Ticket
  // Nouvelle propriété
  specialOption?: boolean
}
```

## 📝 **Conclusion**

Le composable `useTickets` est le **cœur de la gestion des tickets** dans l'application :

- ✅ **État global** réactif et persistant
- ✅ **Logique métier** centralisée et réutilisable
- ✅ **API simple** et intuitive
- ✅ **Types TypeScript** complets
- ✅ **Maintenance** facile et évolutive

**Utilisez `useTickets` pour toute la logique liée aux tickets et réservations !** 🎫
