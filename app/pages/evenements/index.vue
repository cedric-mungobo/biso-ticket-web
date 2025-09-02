<template>
  <main class="px-4 py-2">
    <div class="mx-auto container">
      <h1 class="text-3xl font-bold mb-2">Événements</h1>

      <p class="text-sm text-neutral-600 mb-2">Retrouvez  les  meilleurs événements  sur Biso Ticket.</p>

      <div class="mb-6 flex items-center gap-2">
        <UInput
          v-model="searchTerm"
          class="flex-1"
          placeholder="Rechercher un événement..."
          @keydown.enter="applySearch"
        />
        <UButton color="primary" @click="applySearch">Rechercher</UButton>
      </div>

      <div v-if="loading" class="text-center py-12 text-neutral-600">
        Chargement des événements...
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="retry" class="bg-red-600 text-white px-4 py-2 rounded-md">Réessayer</button>
        </div>
      </div>

      <div v-else>
        <!-- Composant Infinite Scroll -->
        <InfiniteScrollEvents
          ref="infiniteScrollRef"
          :per-page="12"
          :date-filter="currentFilters.date_filter"
          :search-query="currentFilters.q"
          :auto-load="true"
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