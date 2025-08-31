
// Types locaux minimalistes pour compatibilité avec les composants existants
// L'événement utilisé dans l'UI actuelle possède des champs comme `name`, `date_time`, `location`, `tickets[]`
// On reste permissif pour ne pas bloquer la compilation si le type exact évolue.
interface UiTicket {
  id: number
  type: string
  price: string | number
  devise?: string
  quantity?: number
  available?: number
  [key: string]: any
}

interface UiEvent {
  id?: number
  slug?: string
  name?: string
  date_time?: string
  location?: string
  currency?: string
  tickets?: UiTicket[]
  [key: string]: any
}

interface TicketSelectionItem {
  ticketId: number
  quantity: number
  ticket: UiTicket
}

interface ReservationSummary {
  event: UiEvent
  selectedTickets: TicketSelectionItem[]
  totalQuantity: number
  totalPrice: number
  currency: string
}

export const useTickets = () => {
  // États globaux (scope application via useState)
  const selectedTicketsState = useState<Record<number, number>>('tickets/selected', () => ({}))
  const currentEventState = useState<UiEvent | null>('tickets/event', () => null)
  const currentReservationId = useState<string | null>('tickets/currentReservationId', () => null)

  // Cookies pour persistance basique (SSR/CSR safe via useCookie)
  const selectedTicketsCookie = useCookie<Record<number, number> | undefined>('biso-selected-tickets', {
    sameSite: 'lax'
  })
  const currentEventCookie = useCookie<UiEvent | undefined>('biso-current-event', { sameSite: 'lax' })
  const reservationIdCookie = useCookie<string | undefined>('biso-reservation-id', { sameSite: 'lax' })

  // Restauration initiale depuis les cookies (côté client uniquement)
  if (process.client) {
    if (selectedTicketsCookie.value) {
      selectedTicketsState.value = { ...selectedTicketsCookie.value }
    }
    if (currentEventCookie.value) {
      currentEventState.value = { ...currentEventCookie.value }
    }
    if (reservationIdCookie.value) {
      currentReservationId.value = reservationIdCookie.value
    }
  }

  // Watchers pour persister automatiquement
  watch(selectedTicketsState, (value) => {
    selectedTicketsCookie.value = value
  }, { deep: true })

  watch(currentEventState, (value) => {
    currentEventCookie.value = value || undefined
  })

  watch(currentReservationId, (value) => {
    reservationIdCookie.value = value || undefined
  })

  // Getters calculés
  const selectedTickets = computed(() => selectedTicketsState.value)
  const currentEvent = computed(() => currentEventState.value)

  const totalQuantity = computed(() => {
    return Object.values(selectedTickets.value).reduce((acc, qty) => acc + (qty || 0), 0)
  })

  const currency = computed(() => {
    // Priorité: devise du premier ticket sélectionné, sinon devise événement, sinon USD
    const event = currentEvent.value
    if (event?.tickets && Object.keys(selectedTickets.value).length > 0) {
      const firstSelectedId = Number(Object.keys(selectedTickets.value)[0])
      const t = event.tickets.find(tk => tk.id === firstSelectedId)
      if (t?.devise) return t.devise
    }
    return event?.currency || 'USD'
  })

  const totalPrice = computed(() => {
    const event = currentEvent.value
    if (!event?.tickets) return 0
    return Object.entries(selectedTickets.value).reduce((sum, [ticketIdStr, qty]) => {
      const ticketId = Number(ticketIdStr)
      const t = event.tickets!.find(tk => tk.id === ticketId)
      if (!t) return sum
      const price = typeof t.price === 'string' ? parseFloat(t.price) : (t.price || 0)
      return sum + price * (qty || 0)
    }, 0)
  })

  const hasSelectedTickets = computed(() => totalQuantity.value > 0)
  const hasPaidTickets = computed(() => {
    const event = currentEvent.value
    if (!event?.tickets) return false
    return Object.entries(selectedTickets.value).some(([ticketIdStr, qty]) => {
      if (!qty) return false
      const ticketId = Number(ticketIdStr)
      const t = event.tickets!.find(tk => tk.id === ticketId)
      if (!t) return false
      const price = typeof t.price === 'string' ? parseFloat(t.price) : (t.price || 0)
      return price > 0
    })
  })

  const reservationSummary = computed<ReservationSummary | null>(() => {
    const event = currentEvent.value
    if (!event || !event.tickets || !hasSelectedTickets.value) return null

    const items: TicketSelectionItem[] = Object.entries(selectedTickets.value)
      .filter(([, qty]) => (qty || 0) > 0)
      .map(([ticketIdStr, qty]) => {
        const ticketId = Number(ticketIdStr)
        const tk = event.tickets!.find(t => t.id === ticketId)
        if (!tk) {
          return null
        }
        return {
          ticketId,
          quantity: qty || 0,
          ticket: tk
        }
      })
      .filter(Boolean) as TicketSelectionItem[]

    return {
      event,
      selectedTickets: items,
      totalQuantity: totalQuantity.value,
      totalPrice: totalPrice.value,
      currency: currency.value
    }
  })

  // Actions
  const setEvent = (event: UiEvent) => {
    currentEventState.value = event
  }

  const incrementQuantity = (ticketId: number) => {
    const current = selectedTicketsState.value[ticketId] || 0
    selectedTicketsState.value = { ...selectedTicketsState.value, [ticketId]: current + 1 }
  }

  const decrementQuantity = (ticketId: number) => {
    const current = selectedTicketsState.value[ticketId] || 0
    const next = Math.max(0, current - 1)
    const clone = { ...selectedTicketsState.value }
    if (next === 0) {
      delete clone[ticketId]
    } else {
      clone[ticketId] = next
    }
    selectedTicketsState.value = clone
  }

  const setQuantity = (ticketId: number, quantity: number) => {
    const safe = Math.max(0, Math.floor(quantity || 0))
    const clone = { ...selectedTicketsState.value }
    if (safe === 0) {
      delete clone[ticketId]
    } else {
      clone[ticketId] = safe
    }
    selectedTicketsState.value = clone
  }

  const getTicketQuantity = (ticketId: number): number => {
    return selectedTicketsState.value[ticketId] || 0
  }

  const calculateTicketTotal = (ticketId: number): string => {
    const event = currentEvent.value
    if (!event?.tickets) return '0.00'
    const tk = event.tickets.find(t => t.id === ticketId)
    if (!tk) return '0.00'
    const price = typeof tk.price === 'string' ? parseFloat(tk.price) : (tk.price || 0)
    const qty = selectedTicketsState.value[ticketId] || 0
    return (price * qty).toFixed(2)
  }

  const clearSelection = () => {
    selectedTicketsState.value = {}
  }

  const startReservation = (): boolean => {
    if (!currentEvent.value || !hasSelectedTickets.value) return false
    const id = `RES-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    currentReservationId.value = id
    return true
  }

  const startReservationWithId = (id?: string): string => {
    const generated = id || `RES-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    currentReservationId.value = generated
    return generated
  }

  // Confirmation de réservation (appelle le service API)
  const confirmReservation = async (paymentData?: {
    payment_method?: 'mobile_money' | 'card'
    payment_currency?: 'USD' | 'CDF'
    telephone?: string
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const event = currentEvent.value
      if (!event || !event.tickets) {
        return { success: false, error: 'Aucun événement sélectionné' }
      }

      const selectedArray = Object.entries(selectedTickets.value)
        .filter(([, qty]) => (qty || 0) > 0)
        .map(([ticketIdStr, qty]) => ({ ticketId: Number(ticketIdStr), quantity: qty || 0 }))

      if (selectedArray.length === 0) {
        return { success: false, error: 'Aucun ticket sélectionné' }
      }

      // Construire la requête API
      const baseRequest = {
        tickets: selectedArray.map(it => ({ ticket_id: it.ticketId, quantity: it.quantity }))
      } as any

      if (hasPaidTickets.value) {
        // Valider les champs requis pour tickets payants
        if (!paymentData?.payment_method || !paymentData?.payment_currency) {
          return { success: false, error: 'Méthode et devise de paiement requises' }
        }
        if (paymentData.payment_method === 'mobile_money' && !paymentData.telephone) {
          return { success: false, error: 'Téléphone requis pour mobile money' }
        }

        baseRequest.payment_method = paymentData.payment_method
        baseRequest.payment_currency = paymentData.payment_currency
        if (paymentData.payment_method === 'mobile_money' && paymentData.telephone) {
          baseRequest.telephone = paymentData.telephone
        }
      }

      const { $customFetch, $myFetch, $api } = useNuxtApp() as any
      const http = $customFetch || $myFetch || $api
      if (!http) {
        return { success: false, error: 'Client HTTP non disponible' }
      }

      const response = await http<any>('/tickets/simple/reserve', {
        method: 'POST',
        body: baseRequest
      })

      if (!response?.success) {
        const message = response?.message || 'Réservation échouée'
        return { success: false, error: message }
      }
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erreur lors de la réservation' }
    }
  }

  return {
    // state
    selectedTickets,
    currentEvent,
    reservationSummary,
    currentReservationId,
    // getters
    totalQuantity,
    totalPrice,
    currency,
    hasSelectedTickets,
    hasPaidTickets,
    // actions
    setEvent,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    getTicketQuantity,
    calculateTicketTotal,
    clearSelection,
    startReservation,
    startReservationWithId,
    confirmReservation
  }
}


