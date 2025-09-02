<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Découvrez tous nos événements
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Explorez notre collection complète d'événements. Faites défiler pour découvrir plus de contenus.
        </p>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <!-- Barre de recherche -->
          <div class="w-full sm:w-96">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un événement..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex flex-wrap gap-2">
            <select
              v-model="dateFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les événements</option>
              <option value="today">Aujourd'hui</option>
              <option value="tomorrow">Demain</option>
              <option value="this_week">Cette semaine</option>
            </select>

            <select
              v-model="selectedCategory"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              <option value="concert">Concert</option>
              <option value="festival">Festival</option>
              <option value="conference">Conférence</option>
              <option value="sport">Sport</option>
              <option value="theatre">Théâtre</option>
              <option value="mariage">Mariage</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div v-if="totalEvents > 0" class="mb-6 text-center">
        <p class="text-sm text-gray-600">
          {{ totalEvents }} événement{{ totalEvents > 1 ? 's' : '' }} trouvé{{ totalEvents > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Composant Infinite Scroll -->
      <InfiniteScrollEvents
        ref="infiniteScrollRef"
        :per-page="12"
        :date-filter="dateFilter"
        :search-query="searchQuery"
        :categories="selectedCategory ? [selectedCategory] : []"
        @events-loaded="onEventsLoaded"
        @loading-changed="onLoadingChanged"
        @error="onError"
      />

      <!-- Actions rapides -->
      <div class="mt-12 text-center">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="scrollToTop"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour en haut
          </button>
          <button
            @click="reloadEvents"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Refs
const infiniteScrollRef = ref()
const searchQuery = ref('')
const dateFilter = ref<'today' | 'tomorrow' | 'this_week' | 'all'>('all')
const selectedCategory = ref('')
const totalEvents = ref(0)

// Computed
const categories = computed(() => {
  return selectedCategory.value ? [selectedCategory.value] : []
})

// Méthodes
const onEventsLoaded = (events: any[]) => {
  totalEvents.value = events.length
}

const onLoadingChanged = (loading: boolean) => {
  // Gérer l'état de chargement si nécessaire
  console.log('Loading state changed:', loading)
}

const onError = (error: string) => {
  console.error('Error loading events:', error)
  // Ici vous pourriez afficher une notification d'erreur
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const reloadEvents = () => {
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.reloadEvents()
  }
}

// Debounce pour la recherche
let searchTimeout: NodeJS.Timeout
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // La recherche sera automatiquement déclenchée par le composant InfiniteScrollEvents
  }, 500)
})
</script>

<style scoped>
/* Styles pour les transitions fluides */
.transition-colors {
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

/* Focus states améliorés */
input:focus,
select:focus {
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
