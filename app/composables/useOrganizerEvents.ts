import { ref, readonly } from 'vue'
import type { Event, EventsResponse, EventResponse } from '~/types/events'
import { useAPI } from '~/composables/useAPI'

export interface CreateEventData {
  name: string
  description: string
  date_time: string
  location: string
  category: string
  image?: string
}

export interface CreateTicketData {
  type: string
  price: number
  quantity: number
  end_date: string
  devise: string
}

export interface GuestData {
  name: string
  table_name?: string
  email?: string
  phone?: string
  message?: string
  drink_preferences?: string
}

export function useOrganizerEvents() {
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentEvent = ref<Event | null>(null)

  // Récupérer les événements de l'organisateur
  const fetchMyEvents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<EventsResponse>('/events/my-events')
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération de vos événements')
      }
      
      if (data.value?.success && data.value.data.events) {
        events.value = data.value.data.events
        console.log('✅ Événements organisateur récupérés:', events.value.length)
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la récupération des événements:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Créer un nouvel événement
  const createEvent = async (eventData: CreateEventData) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<EventResponse>('/events/create', {
        method: 'POST',
        body: eventData
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la création de l\'événement')
      }
      
      if (data.value?.success && data.value.data.event) {
        const newEvent = data.value.data.event
        events.value.unshift(newEvent)
        console.log('✅ Événement créé avec succès:', newEvent)
        return newEvent
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la création de l\'événement:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer un événement spécifique
  const fetchEvent = async (eventId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<EventResponse>(`/events/${eventId}`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération de l\'événement')
      }
      
      if (data.value?.success && data.value.data.event) {
        currentEvent.value = data.value.data.event
        return data.value.data.event
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la récupération de l\'événement:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Ajouter un ticket à un événement
  const addTicket = async (eventId: number, ticketData: CreateTicketData) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/events/${eventId}/tickets`, {
        method: 'POST',
        body: ticketData
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout du ticket')
      }
      
      if (data.value?.success) {
        // Rafraîchir l'événement pour avoir les tickets à jour
        await fetchEvent(eventId)
        console.log('✅ Ticket ajouté avec succès')
        return data.value.data.ticket
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de l\'ajout du ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les tickets d'un événement
  const fetchEventTickets = async (eventId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/events/${eventId}/tickets`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des tickets')
      }
      
      if (data.value?.success && data.value.data.tickets) {
        return data.value.data.tickets
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la récupération des tickets:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Ajouter un invité
  const addGuest = async (eventId: number, guestData: GuestData) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/events/${eventId}/guests`, {
        method: 'POST',
        body: guestData
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout de l\'invité')
      }
      
      if (data.value?.success) {
        console.log('✅ Invité ajouté avec succès')
        return data.value.data.guest
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de l\'ajout de l\'invité:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Ajouter des invités en lot
  const addGuestsBulk = async (eventId: number, guests: GuestData[]) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/events/${eventId}/guests/bulk`, {
        method: 'POST',
        body: { guests }
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout des invités')
      }
      
      if (data.value?.success) {
        console.log('✅ Invités ajoutés avec succès:', data.value.data.total_added)
        return data.value.data.guests
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de l\'ajout des invités:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les invités d'un événement
  const fetchEventGuests = async (eventId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/events/${eventId}/guests`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des invités')
      }
      
      if (data.value?.success && data.value.data.guests) {
        return data.value.data.guests
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la récupération des invités:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les statistiques d'un événement
  const fetchEventStats = async (eventId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI(`/tickets/audit/events/${eventId}`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }
      
      if (data.value?.success) {
        return data.value.data
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      console.error('Erreur lors de la récupération des statistiques:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Formater la date
  const formatDate = (dateString: string) => {
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

  // Réinitialiser l'état
  const resetState = () => {
    events.value = []
    loading.value = false
    error.value = null
    currentEvent.value = null
  }

  return {
    // État
    events: readonly(events),
    loading: readonly(loading),
    error: readonly(error),
    currentEvent: readonly(currentEvent),
    
    // Actions
    fetchMyEvents,
    createEvent,
    fetchEvent,
    addTicket,
    fetchEventTickets,
    addGuest,
    addGuestsBulk,
    fetchEventGuests,
    fetchEventStats,
    formatDate,
    resetState
  }
}
