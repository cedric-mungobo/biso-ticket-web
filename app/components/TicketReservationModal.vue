<template>
  <Modal
    v-model="isOpen"
    title="Réserver mes billets"
    class="max-w-lg max-h-[90vh] flex flex-col"
  >
    <div class="flex-1 overflow-y-auto space-y-6 px-1">
      <!-- Indicateur de scroll pour mobile -->
      <div v-if="ticketsList.length > 3" class="text-center text-xs text-gray-400 pb-2 border-b border-gray-100">
        <span class="inline-flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          Faites défiler pour voir tous les billets
        </span>
      </div>
      
      <!-- Liste des tickets -->
      <div v-if="ticketsList.length" class="space-y-1 sm:space-y-4">
        <div
          v-for="ticket in ticketsList"
          :key="ticket.id"
          class="bg-gray-50 rounded-lg border border-gray-100 p-2 sm:p-6"
        >
          <!-- Header du ticket -->
          <div class="flex justify-between items-start mb-1 sm:mb-4">
            <h4 class="font-semibold text-gray-900 text-xs sm:text-base pr-1">{{ ticket.name }}</h4>
            <span class="text-xs sm:text-lg font-semibold text-gray-900 flex-shrink-0">
              {{ ticket.price }} {{ ticket.currency }}
            </span>
          </div>

          <!-- Sélecteur de quantité -->
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm text-gray-500">Qté</span>
            <div class="flex items-center gap-1 sm:gap-3">
              <button
                @click="decrementQuantity(ticket.id)"
                :disabled="getTicketQuantity(ticket.id) <= 0"
                class="w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              
              <span class="w-5 sm:w-8 text-center font-medium text-xs sm:text-sm">{{ getTicketQuantity(ticket.id) }}</span>
              
              <button
                @click="incrementQuantity(ticket.id)"
                :disabled="getTicketQuantity(ticket.id) >= ticket.quantity"
                class="w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé et total -->
      <div v-if="hasSelectedTickets" class="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Résumé de votre commande</h3>
        
        <div class="space-y-3 mb-4">
          <div
            v-for="ticket in ticketsList"
            :key="ticket.id"
            v-show="getTicketQuantity(ticket.id) > 0"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">{{ ticket.name }} x{{ getTicketQuantity(ticket.id) }}</span>
            <span class="font-medium text-gray-900">
              {{ calculateTicketTotal(ticket.id) }} {{ ticket.currency || currency }}
            </span>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-between text-lg font-semibold">
            <span class="text-gray-900">Total</span>
            <span class="text-primary-600">{{ totalPrice }} {{ currency }}</span>
          </div>
        </div>
      </div>

      <!-- Message si aucun ticket sélectionné -->
      <div v-else class="text-center py-8">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
        </div>
        <p class="text-gray-500">Sélectionnez au moins un billet pour continuer</p>
      </div>
    </div>

    <!-- Footer avec boutons d'action -->
    <template #footer>
      <div class="flex flex-row gap-3 justify-end">
        <button
          @click="isOpen = false"
          class="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
        >
          Annuler
        </button>
        
        <button
          v-if="hasSelectedTickets"
          @click="handleReservation"
          class="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base"
          :disabled="!hasSelectedTickets"
        >
          Réserver {{ totalQuantity }} billet(s)
        </button>
      </div>
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
