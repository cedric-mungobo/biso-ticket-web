import { ref, readonly } from 'vue'
import type { Event, EventsResponse, EventResponse, EventFilters } from '~/types/events'

export function useEvents() {
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fonction pour récupérer les événements mis en avant
  const fetchFeaturedEvents = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('🚀 Appel API /discover...')
      
      const { data, error: fetchError } = await useAPI<EventsResponse>('/discover')
      
      console.log('📡 Réponse API:', { data: data.value, fetchError: fetchError.value })
      
      if (fetchError.value) {
        console.error('❌ Erreur fetch:', fetchError.value)
        throw new Error(`Erreur réseau: ${fetchError.value.message || 'Erreur inconnue'}`)
      }
      
      if (!data.value) {
        console.error('❌ Pas de données reçues')
        throw new Error('Aucune donnée reçue de l\'API')
      }
      
      console.log('✅ Données reçues:', data.value)
      
      if (data.value.success && data.value.data && data.value.data.events) {
        console.log('🎯 Événements trouvés:', data.value.data.events.length)
        events.value = data.value.data.events
      } else {
        console.error('❌ Format de réponse invalide:', data.value)
        throw new Error(`Format de réponse invalide: ${JSON.stringify(data.value)}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue'
      error.value = errorMessage
      console.error('💥 Erreur lors de la récupération des événements:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour récupérer tous les événements avec filtres
  const fetchEvents = async (filters: EventFilters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = new URLSearchParams()
      
      // Ajout des paramètres de filtrage
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.per_page) queryParams.append('per_page', filters.per_page.toString())
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.min_price) queryParams.append('min_price', filters.min_price.toString())
      if (filters.max_price) queryParams.append('max_price', filters.max_price.toString())
      if (filters.date_filter) queryParams.append('date_filter', filters.date_filter)
      if (filters.search) queryParams.append('search', filters.search)
      
      const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const { data, error: fetchError } = await useAPI<EventsResponse>(url)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des événements')
      }
      
      if (data.value?.success && data.value.data.events) {
        events.value = data.value.data.events
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

  // Fonction pour récupérer un événement spécifique
  const fetchEvent = async (identifier: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<EventResponse>(`/events/${identifier}`)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération de l\'événement')
      }
      
      if (data.value?.success && data.value.data.event) {
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

  // Fonction pour formater la date
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

  // Fonction pour réinitialiser l'état
  const resetState = () => {
    events.value = []
    loading.value = false
    error.value = null
  }

  return {
    // État
    events: readonly(events),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchFeaturedEvents,
    fetchEvents,
    fetchEvent,
    formatDate,
    resetState
  }
}
