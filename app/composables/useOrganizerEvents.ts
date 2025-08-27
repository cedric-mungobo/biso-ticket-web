import { ref, readonly } from 'vue'
import type { Event, EventsResponse, EventResponse } from '~/types/events'
import { useAPI } from '~/composables/useAPI'
import { useAuth } from '~/composables/useAuth'

// Types pour les réponses API
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
}

// Type spécifique pour la réponse de my-events
interface MyEventsResponse {
  events: Event[]
  total_events: number
}

interface CreateEventData {
  name: string
  description: string
  date_time: string
  location: string
  category: string
  image?: File | string | null
}

export type { CreateEventData }

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

export const useOrganizerEvents = () => {
  // État local
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentEvent = ref<Event | null>(null)
  
  // Récupérer le token d'authentification
  const { token } = useAuth()

  // Récupérer mes événements
  const fetchMyEvents = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<ApiResponse<MyEventsResponse>>('/events/my-events')
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors de la récupération des événements')
      }
      
      if (data.value?.success && data.value.data) {
        // L'API retourne {events: Array, total_events: number}
        const eventsArray = data.value.data.events || data.value.data
        
        if (Array.isArray(eventsArray)) {
          events.value = eventsArray
        } else {
          throw new Error('Format de données invalide - events doit être un tableau')
        }
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err: any) {
      console.error('❌ Erreur lors de la récupération des événements:', err)
      error.value = err.message || 'Erreur lors de la récupération des événements'
    } finally {
      loading.value = false
    }
  }

  // Créer un événement
  const createEvent = async (eventData: CreateEventData): Promise<Event | null> => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ event: Event }>>('/events/create', {
        method: 'POST',
        body: eventData
      })
      
      if (fetchError.value) {
        // Gestion spécifique des erreurs 422 (validation)
        if (fetchError.value.statusCode === 422) {
          const errorMessage = fetchError.value.message || 'Données de validation invalides'
          throw new Error(`Erreur de validation: ${errorMessage}`)
        }
        
        throw new Error(fetchError.value.message || 'Erreur lors de la création de l\'événement')
      }
      
      if (data.value?.success && data.value.data?.event) {
        // Ajouter le nouvel événement à la liste
        events.value.push(data.value.data.event)
        return data.value.data.event
      } else {
        throw new Error('Format de réponse invalide lors de la création')
      }
    } catch (err: any) {
      // Gestion détaillée des erreurs
      if (err.message) {
        if (err.message.includes('422')) {
          error.value = 'Erreur de validation: Veuillez vérifier les informations saisies'
        } else if (err.message.includes('401')) {
          error.value = 'Session expirée. Veuillez vous reconnecter'
        } else if (err.message.includes('403')) {
          error.value = 'Accès refusé. Vous n\'avez pas les permissions nécessaires'
        } else if (err.message.includes('validation')) {
          error.value = err.message
        } else {
          error.value = err.message
        }
      } else {
        error.value = 'Erreur inattendue lors de la création de l\'événement'
      }
      
      return null
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
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ ticket: any }>>(`/events/${eventId}/tickets`, {
        method: 'POST',
        body: ticketData
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout du ticket')
      }
      
      if (data.value?.success && data.value.data?.ticket) {
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
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ tickets: any[] }>>(`/events/${eventId}/tickets`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des tickets')
      }
      
      if (data.value?.success && data.value.data?.tickets) {
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
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ guest: any }>>(`/events/${eventId}/guests`, {
        method: 'POST',
        body: guestData
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout de l\'invité')
      }
      
      if (data.value?.success && data.value.data?.guest) {
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
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ total_added: number; guests: any[] }>>(`/events/${eventId}/guests/bulk`, {
        method: 'POST',
        body: { guests }
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de l\'ajout des invités')
      }
      
      if (data.value?.success && data.value.data) {
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
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ guests: any[] }>>(`/events/${eventId}/guests`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des invités')
      }
      
      if (data.value?.success && data.value.data?.guests) {
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
  const fetchEventStats = async (eventId: number): Promise<any> => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<ApiResponse<any>>(`/events/${eventId}/stats`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }
      
      if (data.value?.success && data.value.data) {
        return data.value.data
      } else {
        throw new Error('Format de réponse invalide pour les statistiques')
      }
    } catch (err: any) {
      console.error('❌ Erreur lors de la récupération des statistiques:', err)
      error.value = err.message || 'Erreur lors de la récupération des statistiques'
      return null
    } finally {
      loading.value = false
    }
  }

  // Supprimer un événement
  const deleteEvent = async (eventId: number): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<ApiResponse<{ event_id: number }>>(`/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la suppression de l\'événement')
      }
      
      if (data.value?.success) {
        // Supprimer l'événement de la liste locale
        events.value = events.value.filter(event => event.id !== eventId)
        console.log('✅ Événement supprimé avec succès')
        return true
      } else {
        throw new Error('Format de réponse invalide lors de la suppression')
      }
    } catch (err: any) {
      console.error('❌ Erreur lors de la suppression:', err)
      error.value = err.message || 'Erreur lors de la suppression de l\'événement'
      return false
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
