import { ref, computed, watch } from 'vue'
import type { Event, Ticket } from '~/types/events'

export interface TicketSelection {
  ticketId: number
  quantity: number
  ticket: Ticket
}

export interface ReservationSummary {
  event: Event
  selectedTickets: TicketSelection[]
  totalQuantity: number
  totalPrice: number
  currency: string
}

// État global partagé entre tous les composants
const selectedTickets = ref<Record<number, number>>({})
const currentEvent = ref<Event | null>(null)
const isReservationActive = ref(false)
const currentReservationId = ref<string | null>(null)

export function useTickets() {
  // Cookies pour la persistance des données (créés à l'intérieur de la fonction)
  const selectedTicketsCookie = useCookie('biso-selected-tickets', {
    default: () => ({} as Record<number, number>),
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    secure: true,
    sameSite: 'strict'
  })

  const currentEventCookie = useCookie('biso-current-event', {
    default: () => null as Event | null,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    secure: true,
    sameSite: 'strict'
  })

  const isReservationActiveCookie = useCookie('biso-reservation-active', {
    default: () => false as boolean,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    secure: true,
    sameSite: 'strict'
  })

  const currentReservationIdCookie = useCookie('biso-reservation-id', {
    default: () => null as string | null,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    secure: true,
    sameSite: 'strict'
  })

  // Initialiser l'état depuis les cookies
  if (selectedTicketsCookie.value && Object.keys(selectedTicketsCookie.value).length > 0) {
    selectedTickets.value = { ...selectedTicketsCookie.value }
  }
  if (currentEventCookie.value) {
    currentEvent.value = currentEventCookie.value
  }
  if (isReservationActiveCookie.value) {
    isReservationActive.value = isReservationActiveCookie.value
  }
  if (currentReservationIdCookie.value) {
    currentReservationId.value = currentReservationIdCookie.value
  }

  // Synchronisation automatique avec les cookies
  watch(selectedTickets, (newValue) => {
    selectedTicketsCookie.value = newValue
  }, { deep: true })

  watch(currentEvent, (newValue) => {
    currentEventCookie.value = newValue
  }, { deep: true })

  watch(isReservationActive, (newValue) => {
    isReservationActiveCookie.value = newValue
  })

  watch(currentReservationId, (newValue) => {
    currentReservationIdCookie.value = newValue
  })

  // Getters
  const hasSelectedTickets = computed(() => {
    return Object.values(selectedTickets.value).some(quantity => quantity > 0)
  })

  const totalQuantity = computed(() => {
    return Object.values(selectedTickets.value).reduce((total, quantity) => total + quantity, 0)
  })

  const totalPrice = computed(() => {
    if (!currentEvent.value?.tickets) return 0
    
    return Object.entries(selectedTickets.value).reduce((total, [ticketId, quantity]) => {
      const ticket = currentEvent.value!.tickets!.find(t => t.id === parseInt(ticketId))
      if (ticket && quantity > 0) {
        return total + (parseFloat(ticket.price) * quantity)
      }
      return total
    }, 0)
  })

  const currency = computed(() => {
    if (!currentEvent.value?.tickets || currentEvent.value.tickets.length === 0) return '€'
    return currentEvent.value.tickets[0]?.devise || '€'
  })

  const reservationSummary = computed((): ReservationSummary | null => {
    if (!currentEvent.value || !hasSelectedTickets.value) return null

    const selectedTicketsList: TicketSelection[] = Object.entries(selectedTickets.value)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => {
        const ticket = currentEvent.value!.tickets!.find(t => t.id === parseInt(ticketId))!
        return {
          ticketId: parseInt(ticketId),
          quantity,
          ticket
        }
      })

    return {
      event: currentEvent.value,
      selectedTickets: selectedTicketsList,
      totalQuantity: totalQuantity.value,
      totalPrice: totalPrice.value,
      currency: currency.value
    }
  })

  // Actions
  const setEvent = (event: Event) => {
    currentEvent.value = event
    clearSelection()
  }

  const incrementQuantity = (ticketId: number) => {
    if (!currentEvent.value?.tickets) return
    
    const ticket = currentEvent.value.tickets.find(t => t.id === ticketId)
    if (!ticket) return
    
    const currentQuantity = selectedTickets.value[ticketId] || 0
    const maxQuantity = ticket.available || ticket.quantity
    
    if (currentQuantity < maxQuantity) {
      selectedTickets.value[ticketId] = currentQuantity + 1
    }
  }

  const decrementQuantity = (ticketId: number) => {
    const currentQuantity = selectedTickets.value[ticketId] || 0
    if (currentQuantity > 0) {
      selectedTickets.value[ticketId] = currentQuantity - 1
      
      // Supprimer la clé si la quantité est 0
      if (selectedTickets.value[ticketId] === 0) {
        delete selectedTickets.value[ticketId]
      }
    }
  }

  const setQuantity = (ticketId: number, quantity: number) => {
    if (quantity <= 0) {
      delete selectedTickets.value[ticketId]
    } else {
      selectedTickets.value[ticketId] = quantity
    }
  }

  const getTicketQuantity = (ticketId: number): number => {
    return selectedTickets.value[ticketId] || 0
  }

  const calculateTicketTotal = (ticketId: number): number => {
    if (!currentEvent.value?.tickets) return 0
    
    const ticket = currentEvent.value.tickets.find(t => t.id === ticketId)
    if (!ticket) return 0
    
    const quantity = getTicketQuantity(ticketId)
    const price = parseFloat(ticket.price)
    
    return quantity * price
  }

  const clearSelection = () => {
    selectedTickets.value = {}
    // Les cookies sont automatiquement nettoyés via les watchers
  }

  // Fonction pour récupérer les données depuis les cookies
  const restoreFromCookies = () => {
    if (selectedTicketsCookie.value) {
      selectedTickets.value = { ...selectedTicketsCookie.value }
    }
    if (currentEventCookie.value) {
      currentEvent.value = currentEventCookie.value
    }
    if (isReservationActiveCookie.value) {
      isReservationActive.value = isReservationActiveCookie.value
    }
    if (currentReservationIdCookie.value) {
      currentReservationId.value = currentReservationIdCookie.value
    }
  }

  const startReservation = () => {
    console.log('Démarrage de la réservation...')
    console.log('hasSelectedTickets:', hasSelectedTickets.value)
    console.log('selectedTickets:', selectedTickets.value)
    
    if (!hasSelectedTickets.value) {
      console.log('Aucun ticket sélectionné, réservation annulée')
      return false
    }
    
    isReservationActive.value = true
    console.log('Réservation démarrée avec succès')
    return true
  }

  const startReservationWithId = (reservationId: string) => {
    if (!hasSelectedTickets.value) {
      console.log('Aucun ticket sélectionné, réservation annulée')
      return false
    }
    
    currentReservationId.value = reservationId
    isReservationActive.value = true
    console.log('Réservation démarrée avec ID:', reservationId)
    return true
  }

  const cancelReservation = () => {
    isReservationActive.value = false
    clearSelection()
  }

  const confirmReservation = async (paymentData?: any) => {
    try {
      if (!reservationSummary.value) {
        throw new Error('Aucune réservation en cours')
      }

      // TODO: Appel API pour confirmer la réservation
      const reservationData = {
        event_id: reservationSummary.value.event.id,
        tickets: reservationSummary.value.selectedTickets.map(t => ({
          ticket_id: t.ticketId,
          quantity: t.quantity
        })),
        total_price: reservationSummary.value.totalPrice,
        currency: reservationSummary.value.currency,
        payment_data: paymentData
      }

      console.log('Confirmation de réservation:', reservationData)

      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Réinitialiser après confirmation
      isReservationActive.value = false
      clearSelection()

      return { success: true, data: reservationData }
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
  }

  // Validation
  const validateReservation = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!currentEvent.value) {
      errors.push('Aucun événement sélectionné')
    }

    if (!hasSelectedTickets.value) {
      errors.push('Aucun billet sélectionné')
    }

    // Vérifier que les quantités ne dépassent pas la disponibilité
    Object.entries(selectedTickets.value).forEach(([ticketId, quantity]) => {
      if (quantity > 0) {
        const ticket = currentEvent.value?.tickets?.find(t => t.id === parseInt(ticketId))
        if (ticket && quantity > (ticket.available || ticket.quantity)) {
          errors.push(`Quantité trop élevée pour ${ticket.type}`)
        }
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  return {
    // État
    selectedTickets: readonly(selectedTickets),
    currentEvent: readonly(currentEvent),
    isReservationActive: readonly(isReservationActive),
    currentReservationId: readonly(currentReservationId),
    
    // Getters
    hasSelectedTickets,
    totalQuantity,
    totalPrice,
    currency,
    reservationSummary,
    
    // Actions
    setEvent,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    getTicketQuantity,
    calculateTicketTotal,
    clearSelection,
    restoreFromCookies,
    startReservation,
    startReservationWithId,
    cancelReservation,
    confirmReservation,
    
    // Validation
    validateReservation
  }
}
