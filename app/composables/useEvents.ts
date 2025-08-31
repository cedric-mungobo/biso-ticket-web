import type { Event, PaginatedResponse } from '~/types/api'

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
    return $myFetch<PaginatedResponse<Event>>('/public/events', {
      method: 'GET',
      params
    })
  }

  const fetchEventBySlug = async (slug: string): Promise<Event> => {
    const response = await $myFetch<{ event: Event }>(`/public/events/${slug}`, {
      method: 'GET'
    })
    return response.event
  }

  const fetchEventTickets = async (slug: string, params: {
    per_page?: number
    page?: number
  } = {}) => {
    return $myFetch<PaginatedResponse<any>>(`/public/events/${slug}/tickets`, {
      method: 'GET',
      params
    })
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
    formatDate
  }
}
