<template>
  <main class="py-16 md:px-2">
    <div class="mx-auto container">
      <h1 class="text-3xl font-bold mb-2">Événements</h1>
      <p class="text-sm text-neutral-600 mb-2">Retrouvez les meilleurs événements sur Biso Ticket.</p>

      <div class="mb-4">
        <div class="flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden w-full focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
          </svg>
          <input 
            v-model="searchTerm"
            type="text" 
            class="w-full h-full outline-none text-sm text-gray-500 focus:text-gray-900 focus:bg-transparent"
            placeholder="Rechercher un événement..."
            @keydown.enter="applySearch"
          >
          <button 
            type="submit" 
            class="bg-p-500 w-32 h-9  bg-primary rounded-full text-sm text-white mr-[5px]"
            @click="applySearch"
          >
            Search
          </button>
        </div>
      </div>

      <!-- État de chargement optimisé -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span class="text-neutral-600">Chargement des événements...</span>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">Impossible de charger les événements</h3>
          <p class="text-red-600 mb-4">Vérifiez votre connexion internet et réessayez.</p>
          <button @click="retry" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
            Réessayer
          </button>
        </div>
      </div>

      <!-- Liste des événements optimisée -->
      <div v-else>
        <InfiniteScrollEvents
          ref="infiniteScrollRef"
          :per-page="12"
          :date-filter="currentFilters.date_filter"
          :search-query="currentFilters.q"
          :auto-load="true"
          :enable-animations="false"
          @events-loaded="onEventsLoaded"
          @loading-changed="onLoadingChanged"
          @error="onError"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSEO } from '~/composables/useSEO'

// SEO pour la page événements
const { setEventsSEO } = useSEO()
setEventsSEO()

// Filtres locaux pour l'infinite scroll
type DateFilter = 'today' | 'tomorrow' | 'this_week' | 'all'
const currentFilters = ref<{ 
  per_page?: number
  q?: string
  category?: string
  date_filter?: DateFilter 
}>({
  per_page: 12,
  q: '',
  date_filter: 'all'
})

// Refs pour l'infinite scroll
const infiniteScrollRef = ref()
const loading = ref(false)
const error = ref<string | null>(null)

// Méthodes pour l'infinite scroll
const onEventsLoaded = (events: any[]) => {
  console.log('Événements chargés:', events.length)
}

const onLoadingChanged = (isLoading: boolean) => {
  loading.value = isLoading
}

const onError = (errorMessage: string) => {
  error.value = errorMessage
}

// Méthode pour réessayer en cas d'erreur
const retry = () => {
  error.value = null
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.retry()
  }
}

// Gestion de la recherche
const searchTerm = ref('')
const applySearch = () => {
  currentFilters.value = {
    ...currentFilters.value,
    q: searchTerm.value?.trim() || ''
  }
}

// Recharger les événements quand les filtres changent
watch(
  () => currentFilters.value,
  () => {
    if (infiniteScrollRef.value) {
      infiniteScrollRef.value.reloadEvents()
    }
  },
  { deep: true }
)
</script>

<style scoped>
/* Styles simples pour la page */
.container {
  max-width: 1200px;
}

/* Transitions fluides pour les interactions */
.transition-colors {
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

/* Focus states améliorés */
input:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Responsive design */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>