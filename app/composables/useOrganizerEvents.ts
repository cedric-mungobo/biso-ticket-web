import type { Event, EventCreateRequest, Ticket, TicketCreateRequest, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const useOrganizerEvents = () => {
  const { $myFetch } = useNuxtApp()

  const fetchEvents = async (params: {
    per_page?: number
    page?: number
    status?: string
  } = {}): Promise<PaginatedResponse<Event>> => {
    return $myFetch<PaginatedResponse<Event>>('/events', {
      method: 'GET',
      params
    })
  }

  const createEvent = async (eventData: EventCreateRequest, image?: File): Promise<Event> => {
    let response: any
    if (image) {
      const formData = new FormData()
      formData.append('title', eventData.title)
      if (eventData.location) formData.append('location', eventData.location)
      formData.append('starts_at', eventData.starts_at)
      if (eventData.ends_at) formData.append('ends_at', eventData.ends_at)
      if (eventData.status) formData.append('status', eventData.status)
      if (eventData.is_public !== undefined) formData.append('is_public', eventData.is_public.toString())
      if (eventData.settings) {
        if (eventData.settings.scan_enabled !== undefined) formData.append('settings[scan_enabled]', eventData.settings.scan_enabled.toString())
        if (eventData.settings.categories) eventData.settings.categories.forEach(cat => formData.append('settings[categories][]', cat))
        if (eventData.settings.tags) eventData.settings.tags.forEach(tag => formData.append('settings[tags][]', tag))
        if (eventData.settings.default_invitation_template_id) formData.append('settings[default_invitation_template_id]', eventData.settings.default_invitation_template_id.toString())
      }
      formData.append('image', image)
      response = await $myFetch<{ event: Event }>('/events', { method: 'POST', body: formData })
    } else {
      response = await $myFetch<{ event: Event }>('/events', { method: 'POST', body: eventData })
    }
    return response.event
  }

  const fetchEvent = async (eventId: number): Promise<Event> => {
    const response = await $myFetch<{ event: Event }>(`/events/${eventId}`, { method: 'GET' })
    return response.event
  }

  const updateEvent = async (eventId: number, eventData: Partial<EventCreateRequest>, image?: File): Promise<Event> => {
    let response: any
    if (image) {
      const formData = new FormData()
      if (eventData.title) formData.append('title', eventData.title)
      if (eventData.location) formData.append('location', eventData.location)
      if (eventData.starts_at) formData.append('starts_at', eventData.starts_at)
      if (eventData.ends_at) formData.append('ends_at', eventData.ends_at)
      if (eventData.status) formData.append('status', eventData.status)
      if (eventData.is_public !== undefined) formData.append('is_public', eventData.is_public.toString())
      if (eventData.settings) {
        if (eventData.settings.scan_enabled !== undefined) formData.append('settings[scan_enabled]', eventData.settings.scan_enabled.toString())
        if (eventData.settings.categories) eventData.settings.categories.forEach(cat => formData.append('settings[categories][]', cat))
        if (eventData.settings.tags) eventData.settings.tags.forEach(tag => formData.append('settings[tags][]', tag))
        if (eventData.settings.default_invitation_template_id) formData.append('settings[default_invitation_template_id]', eventData.settings.default_invitation_template_id.toString())
      }
      formData.append('image', image)
      response = await $myFetch<{ event: Event }>(`/events/${eventId}`, { method: 'PUT', body: formData })
    } else {
      response = await $myFetch<{ event: Event }>(`/events/${eventId}`, { method: 'PUT', body: eventData })
    }
    return response.event
  }

  const deleteEvent = async (eventId: number): Promise<boolean> => {
    await $myFetch(`/events/${eventId}`, { method: 'DELETE' })
    return true
  }

  const addTicket = async (eventId: number, ticketData: TicketCreateRequest): Promise<Ticket> => {
    const response = await $myFetch<{ ticket: Ticket }>(`/events/${eventId}/tickets`, { method: 'POST', body: ticketData })
    return response.ticket
  }

  return {
    fetchEvents,
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
    addTicket
  }
}
