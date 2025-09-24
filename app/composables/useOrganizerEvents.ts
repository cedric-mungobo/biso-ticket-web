import type { Event, EventCreateRequest, Ticket, TicketCreateRequest, PaginatedResponse, CreditPurchaseRequest } from '~/types/api'

// Repository sans state/loading/error
export interface CreateTicketData {
  type: string
  price: number | string
  quantity: number
  devise?: string
  end_date?: string
}

export interface GuestData {
  name: string
  table_name?: string
  email?: string
  phone?: string
}

export const useOrganizerEvents = () => {
  const { $myFetch } = useNuxtApp()
  
  // Etat minimal pour les écrans organisateur (persisté via useState pour survivre au refresh/SSR)
  const events = useState<any[]>('organizer/events', () => [])
  const currentEvent = useState<any | null>('organizer/currentEvent', () => null)
  const loading = useState<boolean>('organizer/loading', () => false)
  const error = useState<string | null>('organizer/error', () => null)
  const lastFetchedAt = useState<number>('organizer/events/lastFetchedAt', () => 0)
  const FETCH_TTL_MS = 3000
  const eventCategories = useState<string[]>('organizer/presets/eventCategories', () => [])
  const lastCategoriesFetchedAt = useState<number>('organizer/presets/eventCategories/lastFetchedAt', () => 0)

  const unwrap = <T>(res: any): T => (res?.data ?? res) as T

  const toUiEvent = (apiEvent: Event) => {
    return {
      id: apiEvent.id,
      publicId: apiEvent.publicId,
      slug: apiEvent.slug,
      name: apiEvent.title,
      description: apiEvent.description,
      date_time: apiEvent.startsAt,
      ends_at: (apiEvent as any).endsAt,
      location: apiEvent.location,
      category: apiEvent.settings?.categories?.[0] || '—',
      image: apiEvent.imageUrl,
      image_url: apiEvent.imageUrl,
      status: apiEvent.status,
      is_public: apiEvent.isPublic,
      // Champs d'approbation (seul approvedAt détermine l'approbation)
      approvedAt: (apiEvent as any).approvedAt,
    
      settings: apiEvent.settings || {}
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date à définir'
    }
  }

  const fetchEvents = async (params: {
    per_page?: number
    page?: number
    status?: string
  } = {}): Promise<PaginatedResponse<Event>> => {
    const res = await $myFetch<any>('/events', { method: 'GET', params })
    return unwrap<PaginatedResponse<Event>>(res)
  }

  const fetchEventCategories = async (opts: { force?: boolean } = {}): Promise<string[]> => {
    const now = Date.now()
    if (!opts.force && eventCategories.value.length > 0 && now - lastCategoriesFetchedAt.value < FETCH_TTL_MS) {
      return eventCategories.value
    }
    const res = await $myFetch<any>('/presets/event-categories', { method: 'GET' })
    const categories = res?.data?.categories || res?.categories || []
    eventCategories.value = Array.isArray(categories) ? categories : []
    lastCategoriesFetchedAt.value = Date.now()
    return eventCategories.value
  }

  const createEvent = async (eventData: EventCreateRequest, image?: File): Promise<Event> => {
    try {
      let res: any
      if (image) {
        const formData = new FormData()
        
        // Champs obligatoires
        formData.append('title', eventData.title)
        formData.append('starts_at', eventData.starts_at)
        
        // Champs optionnels
        if (eventData.location) formData.append('location', eventData.location)
        if (eventData.ends_at) formData.append('ends_at', eventData.ends_at)
        if (eventData.description !== undefined && eventData.description !== null) {
          formData.append('description', eventData.description)
        }
        if (eventData.status) formData.append('status', eventData.status)
        if (eventData.is_public !== undefined) formData.append('is_public', eventData.is_public ? '1' : '0')
        
        // Settings
        if (eventData.settings) {
          if (eventData.settings.scan_enabled !== undefined) formData.append('settings[scan_enabled]', eventData.settings.scan_enabled ? '1' : '0')
          if (eventData.settings.categories && eventData.settings.categories.length > 0) {
            eventData.settings.categories.forEach(cat => formData.append('settings[categories][]', cat))
          }
          if (eventData.settings.tags && eventData.settings.tags.length > 0) {
            eventData.settings.tags.forEach(tag => formData.append('settings[tags][]', tag))
          }
          if (eventData.settings.default_invitation_template_id) {
            formData.append('settings[default_invitation_template_id]', eventData.settings.default_invitation_template_id.toString())
          }
        }
        
        // Image (toujours en dernier)
        formData.append('image', image)
        
        // Debug: afficher le contenu du FormData
        console.log('FormData contents:')
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value)
        }
        
        res = await $myFetch<any>('/events', { 
          method: 'POST', 
          body: formData,
        })
      } else {
        res = await $myFetch<any>('/events', { method: 'POST', body: eventData })
      }
      
      return unwrap<Event>(res)
    } catch (error: any) {
      throw error
    }
  }

  const fetchEvent = async (eventId: number): Promise<Event> => {
    const res = await $myFetch<any>(`/events/${eventId}`, { method: 'GET' })
    const event = unwrap<Event>(res)
    
    // Debug : afficher la réponse brute de l'API
    if (process.client && process.dev) {
      console.log('[API] /events/:id - Réponse brute:', JSON.stringify(res, null, 2))
      console.log('[API] /events/:id - Événement déballé:', JSON.stringify(event, null, 2))
      console.log('[API] /events/:id - Champ d\'approbation principal:', {
        approvedAt: event.approvedAt,
        isApproved: !!event.approvedAt
      })
    }
    
    return event
  }

  const updateEvent = async (eventId: number, eventData: Partial<EventCreateRequest>, image?: File, removeImage?: boolean): Promise<Event> => {
    console.log('🔄 [UPDATE] Début de la mise à jour de l\'événement:', eventId)
    console.log('🔄 [UPDATE] Image fournie:', !!image)
    console.log('🔄 [UPDATE] Supprimer image:', removeImage)
    
    let res: any
    if (image) {
      // Récupérer l'événement existant pour avoir toutes les données
      const existingEvent = await fetchEvent(eventId)
      
      const formData = new FormData()
      
      // Champs obligatoires (toujours envoyés comme dans createEvent)
      const title = eventData.title || existingEvent.title || ''
      const startsAt = eventData.starts_at || existingEvent.startsAt || ''
      formData.append('title', title)
      formData.append('starts_at', startsAt)
      
      // Champs optionnels (utiliser les nouvelles valeurs ou les existantes)
      if (eventData.location || existingEvent.location) {
        const location = eventData.location || existingEvent.location || ''
        formData.append('location', location)
      }
      if (eventData.ends_at || existingEvent.endsAt) {
        const endsAt = eventData.ends_at || existingEvent.endsAt || ''
        formData.append('ends_at', endsAt)
      }
      // Toujours envoyer la description si elle est définie dans eventData
      if (eventData.description !== undefined) {
        formData.append('description', eventData.description)
      } else if (existingEvent.description) {
        // Sinon, garder la description existante
        formData.append('description', existingEvent.description)
      }
      const status = eventData.status || existingEvent.status || 'draft'
      const isPublic = (eventData.is_public !== undefined ? eventData.is_public : existingEvent.isPublic) ? '1' : '0'
      formData.append('status', status)
      formData.append('is_public', isPublic)
      
      // Settings (fusionner les nouvelles avec les existantes)
      const newSettings = eventData.settings || {}
      const existingSettings = existingEvent.settings || {}
      
      // scan_enabled
      const scanEnabled = newSettings.scan_enabled !== undefined ? newSettings.scan_enabled : existingSettings.scanEnabled
      formData.append('settings[scan_enabled]', scanEnabled ? '1' : '0')
      
      // categories
      const categories = newSettings.categories || existingSettings.categories || []
      if (categories.length > 0) {
        categories.forEach(cat => formData.append('settings[categories][]', cat))
      }
      
      // tags
      const tags = newSettings.tags || existingSettings.tags || []
      if (tags.length > 0) {
        tags.forEach(tag => formData.append('settings[tags][]', tag))
      }
      
      // default_invitation_template_id
      const templateId = newSettings.default_invitation_template_id || existingSettings.defaultInvitationTemplateId
      if (templateId) {
        formData.append('settings[default_invitation_template_id]', templateId.toString())
      }
      
      // Image (toujours en dernier)
      formData.append('image', image)
      
      // Flag pour supprimer l'image existante
      if (removeImage) {
        formData.append('remove_image', '1')
      }
      
      // Ajouter _method=PUT pour Laravel (requis pour les uploads de fichiers)
      formData.append('_method', 'PUT')
      
      // Debug: afficher le contenu du FormData
      console.log('Update FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      
      res = await $myFetch<any>(`/events/${eventId}`, { 
        method: 'POST', 
        body: formData,
      })
    } else {
      const body: any = { ...eventData }
      if (removeImage) {
        body.remove_image = true
      }
      
      // Debug: afficher le contenu du body JSON
      console.log('Update JSON body contents:')
      console.log(JSON.stringify(body, null, 2))
      
      res = await $myFetch<any>(`/events/${eventId}`, { method: 'PUT', body })
    }
    return unwrap<Event>(res)
  }

  const deleteEvent = async (eventId: number): Promise<boolean> => {
    await $myFetch(`/events/${eventId}`, { method: 'DELETE' })
    return true
  }

  const addTicket = async (eventId: number, ticketData: TicketCreateRequest | CreateTicketData): Promise<Ticket> => {
    // Accepter à la fois le format API et l'UI existante
    const normalized: TicketCreateRequest = {
      name: (ticketData as any).name || (ticketData as any).type,
      price: Number((ticketData as any).price || 0),
      currency: (ticketData as any).currency || (ticketData as any).devise || 'USD',
      quantity: Number((ticketData as any).quantity || 0),
      commissionRate: (ticketData as any).commissionRate
    }
    
    // Debug logs
    if (process.dev) {
      console.log('[API] addTicket - Original payload:', ticketData)
      console.log('[API] addTicket - Normalized payload:', normalized)
    }
    
    try {
      const response = await $myFetch<{ ticket: Ticket }>(`/events/${eventId}/tickets`, { method: 'POST', body: normalized })
      return response.ticket
    } catch (error: any) {
      // Log détaillé de l'erreur pour debug
      if (process.dev) {
        console.error('[API] addTicket - Error details:', {
          status: error?.status || error?.response?.status,
          message: error?.message,
          data: error?.data || error?.response?.data,
          url: `/events/${eventId}/tickets`,
          payload: normalized
        })
      }
      
      // Gestion spécifique des erreurs
      const status = error?.status || error?.response?.status
      if (status === 404) {
        throw new Error(`L'événement avec l'ID ${eventId} n'existe pas ou vous n'avez pas les permissions pour y accéder.`)
      } else if (status === 403) {
        throw new Error(`Vous n'avez pas les permissions pour créer des tickets pour cet événement.`)
      } else if (status === 500) {
        throw new Error(`Erreur serveur lors de la création du ticket. Veuillez vérifier que l'événement existe et réessayer.`)
      }
      
      throw error
    }
  }

  const fetchEventTickets = async (eventId: number): Promise<any[]> => {
    const res = await $myFetch<any>(`/events/${eventId}/tickets`, { method: 'GET', params: { per_page: 100 } })
    const payload = unwrap<PaginatedResponse<Ticket> | Ticket[]>(res)
    const items = Array.isArray(payload) ? payload : (payload.items || [])
    return items.map((t) => ({
      id: t.id,
      type: (t as any).name,
      price: t.price,
      devise: (t as any).currency || 'USD',
      quantity: t.quantity
    }))
  }

  const updateTicket = async (eventId: number, ticketId: number, ticketData: Partial<TicketCreateRequest | CreateTicketData>): Promise<Ticket> => {
    // Mapper UI -> API et n'envoyer que les champs définis (doc: name, price, currency, quantity, commissionRate)
    const maybe = (v: any) => (v === undefined || v === null ? undefined : v)
    const body: Record<string, any> = {}
    const name = (ticketData as any).name ?? (ticketData as any).type
    const price = (ticketData as any).price
    const currency = (ticketData as any).currency ?? (ticketData as any).devise
    const quantity = (ticketData as any).quantity
    const commissionRate = (ticketData as any).commissionRate
    if (maybe(name) !== undefined) body.name = String(name)
    if (maybe(price) !== undefined) body.price = Number(price)
    if (maybe(currency) !== undefined) body.currency = String(currency)
    if (maybe(quantity) !== undefined) body.quantity = Number(quantity)
    if (maybe(commissionRate) !== undefined) body.commissionRate = Number(commissionRate)

    const res = await $myFetch<any>(`/tickets/${ticketId}`, { method: 'PUT', body })
    const payload = unwrap<any>(res)
    return payload?.ticket ?? payload
  }

  const deleteTicket = async (eventId: number, ticketId: number): Promise<boolean> => {
    await $myFetch(`/tickets/${ticketId}`, { method: 'DELETE' })
    return true
  }

  // Invités (basé sur Invitations API)
  const addGuest = async (eventId: number, guest: GuestData): Promise<any> => {
    const body = {
      guest_name: guest.name,
      guest_email: guest.email,
      guest_phone: guest.phone,
      guest_table_name: guest.table_name
    }
    const res = await $myFetch<any>(`/events/${eventId}/invitations`, { method: 'POST', body })
    return unwrap<any>(res)
  }

  const fetchEventGuests = async (eventId: number): Promise<any[]> => {
    const res = await $myFetch<any>(`/events/${eventId}/invitations`, { method: 'GET', params: { per_page: 100 } })
    const payload = unwrap<PaginatedResponse<any> | any[]>(res)
    const items = Array.isArray(payload) ? payload : (payload.items || [])
    return items.map((g: any) => ({
      id: g.id,
      name: g.guestName || g.guest_name,
      table_name: g.guestTableName || g.guest_table_name,
      email: g.guestEmail || g.guest_email,
      phone: g.guestPhone || g.guest_phone,
      status: g.status || 'pending'
    }))
  }

  // Fonctions pour les crédits d'invitation
  const purchaseCredits = async (creditData: CreditPurchaseRequest) => {
    const res = await $myFetch<any>('/credits/purchase-and-pay', { method: 'POST', body: creditData })
    return unwrap<any>(res)
  }

  const getCreditBalance = async () => {
    const res = await $myFetch<any>('/credits/balance', { method: 'GET' })
    return unwrap<any>(res)
  }

  const getCreditPrice = async () => {
    const res = await $myFetch<any>('/credits/price', { method: 'GET' })
    return unwrap<any>(res)
  }

  const getCreditLedger = async (params: { per_page?: number; page?: number } = {}) => {
    const res = await $myFetch<any>('/credits/ledger', { method: 'GET', params })
    return unwrap<PaginatedResponse<any>>(res)
  }

  const getCreditPurchases = async (params: { per_page?: number; page?: number } = {}) => {
    const res = await $myFetch<any>('/credits/purchases', { method: 'GET', params })
    return unwrap<PaginatedResponse<any>>(res)
  }

  // Fonctions pour les retraits (payouts)
  const getPayoutBalance = async () => {
    const res = await $myFetch<any>('/payouts/balance', { method: 'GET' })
    return unwrap<any>(res)
  }

  const createPayout = async (amount: number, currency?: string) => {
    const res = await $myFetch<any>('/payouts', { method: 'POST', body: { amount, currency } })
    return unwrap<any>(res)
  }

  const getPayouts = async (params: { per_page?: number; page?: number } = {}) => {
    const res = await $myFetch<any>('/payouts', { method: 'GET', params })
    return unwrap<PaginatedResponse<any>>(res)
  }

  // Rapports d'un événement (summary)
  const fetchEventReportSummary = async (
    eventId: number,
    params: { period?: 'day' | '7d' | '30d' | 'custom'; currency?: 'USD' | 'CDF'; from?: string; to?: string } = {}
  ) => {
    const res = await $myFetch<any>(`/events/${eventId}/reports/summary`, { method: 'GET', params })
    return unwrap<any>(res)
  }

  // Rapport global (summary)
  const fetchGlobalReportSummary = async (
    params: { period?: 'day' | '7d' | '30d' | 'custom'; currency?: 'USD' | 'CDF'; from?: string; to?: string } = {}
  ) => {
    const res = await $myFetch<any>('/reports/summary', { method: 'GET', params })
    return unwrap<any>(res)
  }

  // Fonction utilitaire pour vérifier si l'utilisateur a des événements
  const checkUserHasEvents = async (): Promise<boolean> => {
    try {
      const userEvents = await fetchEvents({ per_page: 1 })
      return userEvents.items && userEvents.items.length > 0
    } catch {
      return false
    }
  }

  return {
    // low-level
    fetchEvents,
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
    addTicket,
    // helpers/stateful for UI
    events,
    currentEvent,
    loading,
    error,
    formatDate,
    fetchEventTickets,
    addGuest,
    fetchEventGuests,
    updateTicket,
    deleteTicket,
    fetchEventCategories,
    checkUserHasEvents,
    // crédits
    purchaseCredits,
    getCreditBalance,
    getCreditPrice,
    getCreditLedger,
    getCreditPurchases,
    // payouts
    getPayoutBalance,
    createPayout,
    getPayouts,
    // reports
    fetchEventReportSummary,
    fetchGlobalReportSummary,
    async fetchMyEvents(params: { per_page?: number; page?: number; status?: string } = {}, opts: { force?: boolean } = {}) {
      try {
        const now = Date.now()
        if (!opts.force && lastFetchedAt.value && now - lastFetchedAt.value < FETCH_TTL_MS && events.value.length > 0) {
          return
        }
        loading.value = true
        error.value = null
        const pagination = await fetchEvents(params)
        events.value = (pagination.items || []).map(toUiEvent)
        lastFetchedAt.value = Date.now()
      } catch (e: any) {
        error.value = e?.message || 'Erreur lors du chargement des événements'
      } finally {
        loading.value = false
      }
    },
    async fetchEventWithState(eventId: number) {
      try {
        loading.value = true
        error.value = null
        const ev = await fetchEvent(eventId)
        currentEvent.value = toUiEvent(ev)
      } catch (e: any) {
        error.value = e?.message || 'Erreur lors du chargement de l\'événement'
      } finally {
        loading.value = false
      }
    }
  }
}
