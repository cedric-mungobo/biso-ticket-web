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
      console.log('createEvent - Image:', image ? `${image.name} (${image.size} bytes)` : 'Aucune image')
      
      let res: any
      if (image) {
        const formData = new FormData()
        
        // Champs obligatoires
        formData.append('title', eventData.title)
        formData.append('starts_at', eventData.starts_at)
        
        // Champs optionnels
        if (eventData.location) formData.append('location', eventData.location)
        if (eventData.ends_at) formData.append('ends_at', eventData.ends_at)
        if (eventData.description) formData.append('description', eventData.description)
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
        
        console.log('FormData créé avec image')
        console.log('Envoi de la requête POST avec FormData...')
        res = await $myFetch<any>('/events', { 
          method: 'POST', 
          body: formData,
          // Ne pas spécifier Content-Type - laisser le navigateur le définir automatiquement
        })
      } else {
        console.log('Création événement sans image')
        res = await $myFetch<any>('/events', { method: 'POST', body: eventData })
      }
      
      return unwrap<Event>(res)
    } catch (error: any) {
      console.error('Erreur dans createEvent:', error)
      // Re-throw l'erreur pour qu'elle soit gérée par le composant parent
      throw error
    }
  }

  const fetchEvent = async (eventId: number): Promise<Event> => {
    const res = await $myFetch<any>(`/events/${eventId}`, { method: 'GET' })
    if (process.dev) {
      console.log('[Repo] fetchEvent → raw response:', res)
      try { console.log('[Repo] fetchEvent → raw.data:', (res as any)?.data) } catch {}
    }
    const unwrapped = unwrap<Event>(res)
    if (process.dev) {
      console.log('[Repo] fetchEvent → unwrapped:', unwrapped)
    }
    return unwrapped
  }

  const updateEvent = async (eventId: number, eventData: Partial<EventCreateRequest>, image?: File): Promise<Event> => {
    console.log('=== UPDATE EVENT DEBUG ===')
    console.log('updateEvent appelé avec:')
    console.log('  eventId:', eventId)
    console.log('  eventData:', JSON.stringify(eventData, null, 2))
    console.log('  image:', image ? `${image.name} (${image.size} bytes)` : 'Aucune image')
    console.log('  image type:', typeof image)
    console.log('  image instanceof File:', image instanceof File)
    
    let res: any
    if (image) {
      // Récupérer l'événement existant pour avoir toutes les données
      const existingEvent = await fetchEvent(eventId)
      console.log('Événement existant récupéré:', JSON.stringify(existingEvent, null, 2))
      
      const formData = new FormData()
      console.log('FormData créé, ajout des champs...')
      
      // Champs obligatoires (toujours envoyés comme dans createEvent)
      const title = eventData.title || existingEvent.title || ''
      const startsAt = eventData.starts_at || existingEvent.startsAt || ''
      console.log('Ajout title:', title)
      console.log('Ajout starts_at:', startsAt)
      formData.append('title', title)
      formData.append('starts_at', startsAt)
      
      // Champs optionnels (utiliser les nouvelles valeurs ou les existantes)
      if (eventData.location || existingEvent.location) {
        const location = eventData.location || existingEvent.location || ''
        console.log('Ajout location:', location)
        formData.append('location', location)
      }
      if (eventData.ends_at || existingEvent.endsAt) {
        const endsAt = eventData.ends_at || existingEvent.endsAt || ''
        console.log('Ajout ends_at:', endsAt)
        formData.append('ends_at', endsAt)
      }
      if (eventData.description || existingEvent.description) {
        const description = eventData.description || existingEvent.description || ''
        console.log('Ajout description:', description)
        formData.append('description', description)
      }
      const status = eventData.status || existingEvent.status || 'draft'
      const isPublic = (eventData.is_public !== undefined ? eventData.is_public : existingEvent.isPublic) ? '1' : '0'
      console.log('Ajout status:', status)
      console.log('Ajout is_public:', isPublic)
      formData.append('status', status)
      formData.append('is_public', isPublic)
      
      // Settings (fusionner les nouvelles avec les existantes)
      const newSettings = eventData.settings || {}
      const existingSettings = existingEvent.settings || {}
      console.log('newSettings:', newSettings)
      console.log('existingSettings:', existingSettings)
      
      // scan_enabled
      const scanEnabled = newSettings.scan_enabled !== undefined ? newSettings.scan_enabled : existingSettings.scanEnabled
      console.log('Ajout settings[scan_enabled]:', scanEnabled ? '1' : '0')
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
      console.log('Ajout de l\'image:', image.name, image.size, 'bytes')
      formData.append('image', image)
      
      // Debug: Afficher le contenu du FormData
      console.log('FormData créé pour mise à jour événement avec image (données complètes)')
      console.log('Contenu du FormData:')
      for (const [key, value] of formData.entries()) {
        if (key === 'image') {
          console.log(`  ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value)
        } else {
          console.log(`  ${key}:`, value)
        }
      }
      
      // Ajouter _method=PUT pour Laravel (requis pour les uploads de fichiers)
      formData.append('_method', 'PUT')
      
      console.log('Envoi de la requête POST avec FormData et _method=PUT...')
      console.log('FormData instanceof FormData:', formData instanceof FormData)
      console.log('FormData entries count:', Array.from(formData.entries()).length)
      
      res = await $myFetch<any>(`/events/${eventId}`, { 
        method: 'POST', 
        body: formData,
        // Ne pas spécifier Content-Type - laisser le navigateur le définir automatiquement
      })
      console.log('Réponse API après mise à jour avec image:', JSON.stringify(res, null, 2))
    } else {
      console.log('Mise à jour événement sans image')
      res = await $myFetch<any>(`/events/${eventId}`, { method: 'PUT', body: eventData })
      console.log('Réponse API après mise à jour sans image:', JSON.stringify(res, null, 2))
    }
    console.log('=== FIN UPDATE EVENT DEBUG ===')
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
    if (process.dev) {
      // Log clair du payload envoyé (conformément à la doc API Tickets)
      console.log('[Repo] addTicket → URL:', `/events/${eventId}/tickets`)
      console.log('[Repo] addTicket → payload:', JSON.stringify(normalized))
    }
    const response = await $myFetch<{ ticket: Ticket }>(`/events/${eventId}/tickets`, { method: 'POST', body: normalized })
    return response.ticket
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

    if (process.dev) {
      console.log('[Repo] updateTicket → URL:', `/tickets/${ticketId}`)
      console.log('[Repo] updateTicket → payload:', JSON.stringify(body))
    }
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
