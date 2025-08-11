import { ref, readonly } from 'vue'
import type { Event, EventsResponse, EventResponse, EventFilters, Pagination } from '~/types/events'
import { useAPI } from '~/composables/useAPI'

export function useEvents() {
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination | null>(null)
  const currentFilters = ref<EventFilters>({
    page: 1,
    per_page: 12,
    date_filter: 'all'
  })

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

  // Fonction pour récupérer tous les événements avec filtres et pagination
  const fetchEvents = async (filters: EventFilters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      // Mise à jour des filtres actuels
      currentFilters.value = { ...currentFilters.value, ...filters }
      
      const queryParams = new URLSearchParams()
      
      // Ajout des paramètres de filtrage
      if (currentFilters.value.page) queryParams.append('page', currentFilters.value.page.toString())
      if (currentFilters.value.per_page) queryParams.append('per_page', currentFilters.value.per_page.toString())
      if (currentFilters.value.category) queryParams.append('category', currentFilters.value.category)
      if (currentFilters.value.min_price) queryParams.append('min_price', currentFilters.value.min_price.toString())
      if (currentFilters.value.max_price) queryParams.append('max_price', currentFilters.value.max_price.toString())
      if (currentFilters.value.date_filter) queryParams.append('date_filter', currentFilters.value.date_filter)
      if (currentFilters.value.search) queryParams.append('search', currentFilters.value.search)
      
      const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🚀 Appel API avec filtres:', url)
      
      const { data, error: fetchError } = await useAPI<EventsResponse>(url)
      
      if (fetchError.value) {
        throw new Error('Erreur lors de la récupération des événements')
      }
      
      if (data.value?.success && data.value.data.events) {
        events.value = data.value.data.events
        
        // Mise à jour de la pagination si disponible
        if (data.value.data.pagination) {
          pagination.value = data.value.data.pagination
        }
        
        console.log('✅ Événements récupérés:', events.value.length)
        console.log('📄 Pagination:', pagination.value)
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

  // Fonction pour changer de page
  const changePage = async (page: number) => {
    if (page < 1 || (pagination.value && page > pagination.value.last_page)) {
      return
    }
    
    await fetchEvents({ ...currentFilters.value, page })
  }

  // Fonction pour changer le nombre d'éléments par page
  const changePerPage = async (perPage: number) => {
    await fetchEvents({ ...currentFilters.value, per_page: perPage, page: 1 })
  }

  // Fonction pour filtrer par date
  const filterByDate = async (dateFilter: EventFilters['date_filter']) => {
    await fetchEvents({ ...currentFilters.value, date_filter: dateFilter, page: 1 })
  }

  // Fonction pour rechercher
  const searchEvents = async (searchTerm: string) => {
    await fetchEvents({ ...currentFilters.value, search: searchTerm, page: 1 })
  }

  // Fonction pour filtrer par catégorie
  const filterByCategory = async (category: string) => {
    await fetchEvents({ ...currentFilters.value, category, page: 1 })
  }

  // Fonction pour récupérer un événement spécifique
  const fetchEvent = async (identifier: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await useAPI<EventResponse>(`/events/${identifier}`)
      
      if (fetchError.value) {
        // Gestion spécifique des erreurs HTTP
        if (fetchError.value.statusCode === 404) {
          throw new Error('Événement non trouvé')
        } else if (fetchError.value.statusCode === 500) {
          throw new Error('Erreur serveur')
        } else {
          throw new Error('Erreur lors de la récupération de l\'événement')
        }
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
    pagination.value = null
    currentFilters.value = {
      page: 1,
      per_page: 12,
      date_filter: 'all'
    }
  }

  // Fonction pour réinitialiser les filtres
  const resetFilters = async () => {
    currentFilters.value = {
      page: 1,
      per_page: 12,
      date_filter: 'all'
    }
    await fetchEvents()
  }

  return {
    // État
    events: readonly(events),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    currentFilters: readonly(currentFilters),
    
    // Actions
    fetchFeaturedEvents,
    fetchEvents,
    fetchEvent,
    changePage,
    changePerPage,
    filterByDate,
    searchEvents,
    filterByCategory,
    formatDate,
    resetState,
    resetFilters
  }
}
