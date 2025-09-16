<template>
  <div class="w-full">
    <!-- Container des événements -->
    <div 
      ref="containerRef"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      <!-- Cartes d'événements -->
      <EventCard
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        v-for="(event, index) in allEvents"
        :key="`${event.id}-${index}`"
        :event-id="event.id"
        :title="event.title"
        :image="event.imageUrl"
        :date="event.startsAt"
        :location="event.location"
        :categories="event.settings?.categories || []"
        :slug="event.slug"
        :enable-animations="props.enableAnimations"
      />
    </div>

    <!-- Indicateur de chargement -->
    <div 
      v-if="loading && allEvents.length > 0"
      ref="loadingRef"
      class="flex justify-center items-center py-8"
    >
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-gray-600">Chargement des événements...</span>
      </div>
    </div>

    <!-- Message de fin -->
    <div 
      v-if="hasReachedEnd && allEvents.length > 0"
      class="text-center py-8 text-gray-500"
    >
      <p>Vous avez vu tous les événements disponibles</p>
    </div>

    <!-- Message d'erreur -->
    <div 
      v-if="error && allEvents.length === 0"
      class="text-center py-12"
    >
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-lg font-medium">Erreur de chargement</p>
        <p class="text-sm">{{ error }}</p>
      </div>
      <button 
        @click="retry"
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Réessayer
      </button>
    </div>

    <!-- État vide -->
    <div 
      v-if="!loading && !error && allEvents.length === 0"
      class="text-center py-12"
    >
      <div class="text-gray-400 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-lg font-medium">Aucun événement trouvé</p>
        <p class="text-sm">Il n'y a pas d'événements disponibles pour le moment.</p>
      </div>
    </div>

    <!-- Élément de déclenchement pour l'infinite scroll -->
    <div 
      v-if="!hasReachedEnd && !loading"
      ref="triggerRef"
      class="h-4"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Interface pour les événements
interface Event {
  id: number | string
  title: string
  imageUrl?: string
  startsAt: string
  location?: string
  slug: string
  settings?: {
    categories?: string[]
  }
}

// Interface pour la réponse API
interface EventsResponse {
  status: boolean
  message: string
  data: {
    items: Event[]
    meta: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
}

// Props
interface Props {
  perPage?: number
  dateFilter?: 'today' | 'tomorrow' | 'this_week' | 'all'
  searchQuery?: string
  categories?: string[]
  autoLoad?: boolean
  enableAnimations?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 12,
  dateFilter: 'all',
  searchQuery: '',
  categories: () => [],
  autoLoad: true,
  enableAnimations: true
})

// Émissions
const emit = defineEmits<{
  'events-loaded': [events: Event[]]
  'loading-changed': [loading: boolean]
  'error': [error: string]
}>()

// Composable pour les événements
const { fetchPublicEvents } = useEvents()

// Refs
const containerRef = ref<HTMLElement | null>(null)
const loadingRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

// État
const allEvents = ref<Event[]>([])
const currentPage = ref(1)
const loading = ref(false)
const error = ref<string | null>(null)
const hasReachedEnd = ref(false)

// Intersection Observer pour l'infinite scroll
let observer: IntersectionObserver | null = null

// Computed
const hasMorePages = computed(() => {
  return !hasReachedEnd.value && !loading.value
})

// Charger les événements
const loadEvents = async (page: number = 1, append: boolean = false) => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = null

    const response = await fetchPublicEvents({
      per_page: props.perPage,
      page,
      date_filter: props.dateFilter,
      q: props.searchQuery
    })

    console.log('Response from API:', response)

    if (response?.items) {
      const newEvents = response.items
      
      if (append) {
        allEvents.value = [...allEvents.value, ...newEvents]
      } else {
        allEvents.value = newEvents
        currentPage.value = 1
      }

      // Vérifier si on a atteint la fin
      hasReachedEnd.value = page >= response.meta.lastPage
      
      // Émettre les événements chargés
      emit('events-loaded', allEvents.value)
      
    } else {
      console.warn('No events found in response:', response)
      allEvents.value = []
      hasReachedEnd.value = true
    }
  } catch (err) {
    console.error('Erreur lors du chargement des événements:', err)
    error.value = 'Impossible de charger les événements. Vérifiez votre connexion.'
    emit('error', error.value)
  } finally {
    loading.value = false
    emit('loading-changed', loading.value)
  }
}

// Charger la page suivante
const loadNextPage = async () => {
  if (hasReachedEnd.value || loading.value) return
  
  currentPage.value++
  await loadEvents(currentPage.value, true)
}

// Réessayer en cas d'erreur
const retry = async () => {
  error.value = null
  currentPage.value = 1
  hasReachedEnd.value = false
  await loadEvents(1, false)
}


// Configuration de l'Intersection Observer optimisée
const setupIntersectionObserver = () => {
  if (!triggerRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && hasMorePages.value) {
        loadNextPage()
      }
    },
    {
      root: null,
      rootMargin: '200px', // Augmenter la marge pour un chargement plus fluide
      threshold: 0.1
    }
  )

  observer.observe(triggerRef.value)
}

// Nettoyer l'observer
const cleanupObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// Recharger quand les props changent
const reloadEvents = async () => {
  currentPage.value = 1
  hasReachedEnd.value = false
  allEvents.value = []
  await loadEvents(1, false)
}

// Watchers
watch(
  () => [props.searchQuery, props.dateFilter, props.categories],
  () => {
    reloadEvents()
  },
  { deep: true }
)

// Lifecycle
onMounted(async () => {
  if (props.autoLoad) {
    await loadEvents(1, false)
  }
  
  // Configuration de l'observer après le chargement initial
  await nextTick()
  setupIntersectionObserver()
})

onUnmounted(() => {
  cleanupObserver()
})

// Exposer les méthodes publiques
defineExpose({
  loadEvents,
  loadNextPage,
  retry,
  reloadEvents,
  allEvents: readonly(allEvents),
  loading: readonly(loading),
  error: readonly(error),
  hasReachedEnd: readonly(hasReachedEnd)
})
</script>

<style scoped>
/* Styles de base sans animations */
</style>
