<template>
  <Modal
    v-model="isOpen"
    title="Réserver mes billets"
    class="max-w-lg"
  >
    <div class="space-y-4">
      <!-- Liste des tickets -->
      <div v-if="ticketsList.length" class="space-y-4">
        <div
          v-for="ticket in ticketsList"
          :key="ticket.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-semibold text-gray-900">{{ ticket.name }}</h4>
              <p class="text-sm text-gray-600">
                {{ ticket.quantity }} places disponibles
              </p>
            </div>
            <span class="text-lg font-bold text-primary-600">
              {{ ticket.price }} {{ ticket.currency }}
            </span>
          </div>

          <!-- Sélecteur de quantité -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Quantité :</span>
            <div class="flex items-center space-x-3">
              <button
                @click="decrementQuantity(ticket.id)"
                :disabled="getTicketQuantity(ticket.id) <= 0"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              
              <span class="w-12 text-center font-semibold text-gray-900">
                {{ getTicketQuantity(ticket.id) }}
              </span>
              
              <button
                @click="incrementQuantity(ticket.id)"
                :disabled="getTicketQuantity(ticket.id) >= ticket.quantity"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé et total -->
      <div v-if="hasSelectedTickets" class="border-t border-gray-200 pt-4">
        <div class="space-y-2 mb-4">
          <div
            v-for="ticket in ticketsList"
            :key="ticket.id"
            v-show="getTicketQuantity(ticket.id) > 0"
            class="flex justify-between text-sm"
          >
            <span>{{ ticket.name }} x{{ getTicketQuantity(ticket.id) }}</span>
            <span class="font-medium">
              {{ calculateTicketTotal(ticket.id) }} {{ ticket.currency || currency }}
            </span>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-3">
          <div class="flex justify-between text-lg font-bold">
            <span>Total :</span>
            <span class="text-primary-600">{{ totalPrice }} {{ currency }}</span>
          </div>
        </div>
      </div>

      <!-- Message si aucun ticket sélectionné -->
      <div v-else class="text-center text-gray-500 py-4">
        <p>Sélectionnez au moins un billet pour continuer</p>
      </div>
    </div>

    <!-- Footer avec boutons d'action -->
    <template #footer>
      <button
        @click="isOpen = false"
        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Annuler
      </button>
      
      <button
        v-if="hasSelectedTickets"
        @click="handleReservation"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        :disabled="!hasSelectedTickets"
      >
        Réserver {{ totalQuantity }} billet(s)
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { Event } from '~/types/api'
import { useTickets } from '~/composables/useTickets'

interface Props {
  modelValue: boolean
  event: Event | null
  tickets?: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Utilisation du composable
const {
  setEvent,
  selectedTickets,
  incrementQuantity,
  decrementQuantity,
  getTicketQuantity,
  calculateTicketTotal,
  totalPrice,
  totalQuantity,
  currency,
  hasSelectedTickets,
  startReservationWithId
} = useTickets()

const ticketsList = computed<any[]>(() => Array.isArray(props.tickets) ? props.tickets : [])

// Computed pour l'ouverture/fermeture
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Synchroniser l'événement + tickets pour le calcul des totaux
watch(
  [ticketsList, () => props.event],
  ([tickets, ev]) => {
    const base = ev ? { ...ev } : ({} as any)
    ;(base as any).tickets = tickets || []
    setEvent(base)
  },
  { immediate: true, deep: true }
)

const handleReservation = () => {
  if (!props.event?.slug) {
    console.error('Slug de l\'événement manquant')
    return
  }
  emit('update:modelValue', false)
  navigateTo(`/evenements/${props.event.slug}/paiement`)
}
</script>
