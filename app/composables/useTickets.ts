
// Types locaux minimalistes pour compatibilité avec les composants existants
// L'événement utilisé dans l'UI actuelle possède des champs comme `name`, `date_time`, `location`, `tickets[]`
// On reste permissif pour ne pas bloquer la compilation si le type exact évolue.
interface UiTicket {
  id: number
  type: string
  price: string | number
  devise?: string
  currency?: string
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
  const currentOrderNumberState = useState<string | null>('tickets/currentOrderNumber', () => null)

  // Cookies pour persistance basique (SSR/CSR safe via useCookie)
  const selectedTicketsCookie = useCookie<Record<number, number> | undefined>('biso-selected-tickets', {
    sameSite: 'lax'
  })
  const currentEventCookie = useCookie<UiEvent | undefined>('biso-current-event', { sameSite: 'lax' })
  const reservationIdCookie = useCookie<string | undefined>('biso-reservation-id', { sameSite: 'lax' })
  const orderNumberCookie = useCookie<string | undefined>('biso-order-number', { sameSite: 'lax' })

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
    if (orderNumberCookie.value) {
      currentOrderNumberState.value = orderNumberCookie.value
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

  watch(currentOrderNumberState, (value) => {
    orderNumberCookie.value = value || undefined
  })

  // Getters calculés
  const selectedTickets = computed(() => selectedTicketsState.value)
  const currentEvent = computed(() => currentEventState.value)
  const currentOrderNumber = computed(() => currentOrderNumberState.value)

  const totalQuantity = computed(() => {
    return Object.values(selectedTickets.value).reduce((acc, qty) => acc + (qty || 0), 0)
  })

  const currency = computed(() => {
    // Priorité: devise du premier ticket sélectionné, sinon devise événement, sinon USD
    const event = currentEvent.value
    if (event?.tickets && Object.keys(selectedTickets.value).length > 0) {
      const firstSelectedId = Number(Object.keys(selectedTickets.value)[0])
      const t = event.tickets.find(tk => tk.id === firstSelectedId)
      if (t?.currency) return t.currency
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

  const resetCheckoutState = () => {
    // Nettoyer la sélection, l'événement courant et les identifiants de réservation/commande
    selectedTicketsState.value = {}
    currentEventState.value = null
    currentReservationId.value = null
    currentOrderNumberState.value = null
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
    payment_method?: 'mobile_money' | 'card' | 'cash' | 'flexpay'
    payment_currency?: 'USD' | 'CDF'
    telephone?: string
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const event = currentEvent.value
      if (!event || !event.tickets) {
        return { success: false, error: 'Aucun événement sélectionné' }
      }
      if (!event.id) {
        return { success: false, error: 'Identifiant de l\'événement manquant' }
      }

      const selectedArray = Object.entries(selectedTickets.value)
        .filter(([, qty]) => (qty || 0) > 0)
        .map(([ticketIdStr, qty]) => ({ ticket_id: Number(ticketIdStr), quantity: qty || 0 }))

      if (selectedArray.length === 0) {
        return { success: false, error: 'Aucun ticket sélectionné' }
      }

      const { $customFetch, $myFetch, $api } = useNuxtApp() as any
      const http = $customFetch || $myFetch || $api
      if (!http) {
        return { success: false, error: 'Client HTTP non disponible' }
      }

      // Construire le body one-shot (purchase-and-pay)
      const body: any = { items: selectedArray }

      if (hasPaidTickets.value && paymentData?.payment_currency) {
        // Méthode: FlexPay pour mobile money; pour card, conserver 'card' sinon fallback flexpay
        const isMobile = paymentData.payment_method === 'mobile_money' || paymentData.payment_method === 'flexpay'
        const method = isMobile ? 'flexpay' : (paymentData.payment_method || 'flexpay')
        // Nettoyage numéro: conserver les chiffres
        const rawPhone = (paymentData.telephone || '').replace(/\D/g, '')
        const phone_number = rawPhone.startsWith('243') ? rawPhone : (rawPhone ? `243${rawPhone.replace(/^0+/, '')}` : undefined)
        body.payment = {
          method,
          currency: paymentData.payment_currency,
          phone_number,
          channel: 'webapi',
          metadata: phone_number ? { telephone: phone_number } : undefined
        }
      }

      // Appel one-shot
      try {
        if (process.client) console.log('[API] purchase-and-pay request', { eventId: event.id, body })
        const res = await http(`/client/events/${event.id}/orders/purchase-and-pay`, {
          method: 'POST',
          body
        })
        const payload = (res as any)?.data ?? res
        if (process.dev) console.log('[API] purchase-and-pay response', payload)
        // Extraire et stocker l'order number si disponible (inclut metadata.flexpay.orderNumber)
        const orderNumber =
          (payload as any)?.data?.orderNumber ||
          (payload as any)?.orderNumber ||
          (payload as any)?.data?.order_number ||
          (payload as any)?.order_number ||
          (payload as any)?.data?.payment?.metadata?.flexpay?.orderNumber ||
          (payload as any)?.payment?.metadata?.flexpay?.orderNumber
        if (orderNumber) {
          currentOrderNumberState.value = String(orderNumber)
        }
        return { success: true, data: payload }
      } catch (err: any) {
        const status = err?.response?.status || err?.status
        const message = err?.response?.statusText || err?.message || 'Erreur purchase-and-pay'
        if (process.client) console.warn('[API] purchase-and-pay failed', { status, message })
        return { success: false, error: `purchase-and-pay échoué (${status || 'n/a'}): ${message}` }
      }
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
    currentOrderNumber,
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
    resetCheckoutState,
    startReservation,
    startReservationWithId,
    confirmReservation
  }
}


