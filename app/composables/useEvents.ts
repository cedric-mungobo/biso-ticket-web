import type { Event, PaginatedResponse, ApiResponse } from '~/types/api'

// Repository sans state/loading/error
export const useEvents = () => {
  const { $myFetch } = useNuxtApp()

  const fetchPublicEvents = async (params: {
    per_page?: number
    page?: number
    q?: string
    category?: string
    date_filter?: 'today' | 'tomorrow' | 'this_week' | 'all'
  } = {}) => {
    const res = await $myFetch<ApiResponse<PaginatedResponse<Event>> | PaginatedResponse<Event>>('/public/events', {
      method: 'GET',
      params
    })
    // Déballer l'enveloppe standard { status, message, data }
    const payload = (res as any)?.data ?? res
    if (process.client && process.dev) {
      console.log('[API] /public/events', { params, raw: res, payload, items: payload?.items?.length })
      console.log('[API] /public/events - payload structure:', JSON.stringify(payload, null, 2))
    }
    return payload as PaginatedResponse<Event>
  }

  const fetchEventBySlug = async (slug: string): Promise<Event> => {
    const res = await $myFetch<ApiResponse<Event> | Event>(`/public/events/${slug}`, { method: 'GET' })
    const event = (res as any)?.data ?? res
    if (process.client) console.log('[API] /public/events/:slug', { slug, raw: res, event })
    return event as Event
  }

  const fetchEventTickets = async (slug: string, params: {
    per_page?: number
    page?: number
  } = {}) => {
    const res = await $myFetch<ApiResponse<PaginatedResponse<any>> | PaginatedResponse<any>>(`/public/events/${slug}/tickets`, {
      method: 'GET',
      params
    })
    const payload = (res as any)?.data ?? res
    if (process.client) console.log('[API] /public/events/:slug/tickets', { slug, params, raw: res, payload })
    return payload as PaginatedResponse<any>
  }

  const fetchFeaturedEvents = async (params: {
    per_page?: number
    limit?: number
  } = {}) => {
    const res = await $myFetch<ApiResponse<PaginatedResponse<Event>> | PaginatedResponse<Event> | Event[]>(`/public/events/discover`, {
      method: 'GET',
      params
    })
    // Déballer l'enveloppe standard { status, message, data }
    const payload = (res as any)?.data ?? res
    if (process.client && process.dev) {
      console.log('[API] /public/events/discover', { params, raw: res, payload, items: payload?.items?.length || payload?.length })
    }
    
    // Si c'est un tableau direct (avec limit), le transformer en format paginé
    if (Array.isArray(payload)) {
      return {
        items: payload,
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: payload.length,
          total: payload.length
        }
      } as PaginatedResponse<Event>
    }
    
    return payload as PaginatedResponse<Event>
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

  return {
    fetchPublicEvents,
    fetchEventBySlug,
    fetchEventTickets,
    fetchFeaturedEvents,
    formatDate
  }
}
