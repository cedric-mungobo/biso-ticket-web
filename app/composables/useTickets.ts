import { ref, computed, watch } from 'vue'
import type { Event, Ticket } from '~/types/events'
import { reservationService } from '~/services/reservationService'
import type { ReservationAPIResponse } from '~/types/reservation'

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
  // Initialiser l'état depuis localStorage
  const restoreFromLocalStorage = () => {
    if (process.client) {
      try {
        const storedTickets = localStorage.getItem('biso-selected-tickets')
        const storedEvent = localStorage.getItem('biso-current-event')
        const storedReservationActive = localStorage.getItem('biso-reservation-active')
        const storedReservationId = localStorage.getItem('biso-reservation-id')
        
        if (storedTickets) {
          const parsedTickets = JSON.parse(storedTickets)
          if (parsedTickets && Object.keys(parsedTickets).length > 0) {
            selectedTickets.value = parsedTickets
          }
        }
        
        if (storedEvent) {
          const parsedEvent = JSON.parse(storedEvent)
          if (parsedEvent) {
            currentEvent.value = parsedEvent
          }
        }
        
        if (storedReservationActive) {
          isReservationActive.value = JSON.parse(storedReservationActive)
        }
        
        if (storedReservationId) {
          currentReservationId.value = storedReservationId
        }
      } catch (error) {
        console.error('Erreur lors de la restauration depuis localStorage:', error)
        clearLocalStorage()
      }
    }
  }

  // Sauvegarder dans localStorage
  const saveToLocalStorage = () => {
    if (process.client) {
      try {
        localStorage.setItem('biso-selected-tickets', JSON.stringify(selectedTickets.value))
        localStorage.setItem('biso-current-event', JSON.stringify(currentEvent.value))
        localStorage.setItem('biso-reservation-active', JSON.stringify(isReservationActive.value))
        if (currentReservationId.value) {
          localStorage.setItem('biso-reservation-id', currentReservationId.value)
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error)
      }
    }
  }

  // Nettoyer localStorage
  const clearLocalStorage = () => {
    if (process.client) {
      localStorage.removeItem('biso-selected-tickets')
      localStorage.removeItem('biso-current-event')
      localStorage.removeItem('biso-reservation-active')
      localStorage.removeItem('biso-reservation-id')
    }
  }

  // Restaurer depuis localStorage au démarrage
  restoreFromLocalStorage()

  // Synchronisation automatique avec localStorage
  watch(selectedTickets, () => {
    saveToLocalStorage()
  }, { deep: true })

  watch(currentEvent, () => {
    saveToLocalStorage()
  }, { deep: true })

  watch(isReservationActive, () => {
    saveToLocalStorage()
  })

  watch(currentReservationId, () => {
    saveToLocalStorage()
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
    if (process.client) {
      if (localStorage.getItem('biso-selected-tickets')) {
        selectedTickets.value = { ...JSON.parse(localStorage.getItem('biso-selected-tickets')!) }
      }
      if (localStorage.getItem('biso-current-event')) {
        currentEvent.value = JSON.parse(localStorage.getItem('biso-current-event')!)
      }
      if (localStorage.getItem('biso-reservation-active')) {
        isReservationActive.value = JSON.parse(localStorage.getItem('biso-reservation-active')!)
      }
      if (localStorage.getItem('biso-reservation-id')) {
        currentReservationId.value = localStorage.getItem('biso-reservation-id')
      }
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

  // Nouvelle méthode pour confirmer la réservation avec la nouvelle API
  const confirmReservation = async (paymentData: {
    payment_method: 'mobile_money' | 'card'
    payment_currency: 'USD' | 'CDF'
    telephone?: string
  }) => {
    try {
      if (!reservationSummary.value || !currentEvent.value) {
        throw new Error('Aucune réservation en cours ou événement manquant')
      }

      console.log('🚀 Début de la confirmation de réservation avec nouvelle API:', paymentData)
      console.log('📋 Résumé de la réservation:', reservationSummary.value)
      console.log('🎯 Événement:', currentEvent.value)

      // Utiliser le service de réservation mis à jour
      const response = await reservationService.performReservation(
        reservationSummary.value.selectedTickets,
        currentEvent.value,
        paymentData
      )

      console.log('✅ Réservation réussie avec nouvelle API:', response)

      // Réinitialiser après confirmation
      isReservationActive.value = false
      clearSelection()

      return { success: true, data: response }
    } catch (error) {
      console.error('❌ Erreur lors de la confirmation de réservation:', error)
      
      // Log détaillé de l'erreur
      if (error instanceof Error) {
        console.error('📝 Détails de l\'erreur:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      } else {
        console.error('📝 Erreur non-standard:', error)
      }
      
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

  // Méthodes utilitaires pour la nouvelle API
  const hasPaidTickets = computed(() => {
    if (!currentEvent.value || !hasSelectedTickets.value) return false
    return reservationService.hasPaidTickets(
      Object.entries(selectedTickets.value)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
          ticketId: parseInt(ticketId),
          quantity
        })),
      currentEvent.value
    )
  })

  const calculateTotalPrice = computed(() => {
    if (!currentEvent.value || !hasSelectedTickets.value) return 0
    return reservationService.calculateTotalPrice(
      Object.entries(selectedTickets.value)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
          ticketId: parseInt(ticketId),
          quantity
        })),
      currentEvent.value
    )
  })

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
    validateReservation,
    
    // Nouvelles méthodes utilitaires
    hasPaidTickets,
    calculateTotalPrice
  }
}
