<template>
  <main class="px-4 py-8 md:px-8 pt-20 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
        Découvrez les événements à venir
      </h1>

   

      <!-- Filtres et recherche -->
      <EventFilters 
        :pagination="pagination"
        :current-filters="currentFilters"
        @search="handleSearch"
        @date-filter-change="handleDateFilterChange"
        @reset="handleReset"
      />

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          <span class="text-gray-600">Chargement des événements...</span>
        </div>
      </div>

      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button 
            @click="() => fetchEvents()"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Events Grid -->
      <div v-else-if="events.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :category="event.category"
          :title="event.name"
          :image="event.image_url || event.image"
          :date="event.date_time"
          :description="event.description"
          :location="event.location"
          :eventId="event.slug || event.id"
        />
      </div>

      <!-- No Events State -->
      <div v-else class="text-center py-12">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Aucun événement trouvé</h3>
          <p class="text-gray-600">Aucun événement ne correspond à vos critères de recherche.</p>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination 
        v-if="pagination" 
        :pagination="pagination" 
        @page-change="changePage" 
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue'
import type { EventFilters } from '../../types/events'
import { useEvents } from '../../composables/useEvents'

// Utilisation du composable useEvents
const { 
  events, 
  loading, 
  error, 
  pagination,
  currentFilters,
  fetchEvents, 
  changePage,
  changePerPage,
  filterByDate,
  searchEvents,
  resetFilters,
  formatDate 
} = useEvents()




// État local pour les filtres
const selectedPerPage = ref(12)

// Récupération des événements au montage du composant
onMounted(() => {
  nextTick(() => {
    fetchEvents()
  })
})

// Gestion de la recherche
const handleSearch = (term: string) => {
  if (term.trim()) {
    searchEvents(term.trim())
  } else {
    // Si la recherche est vide, on récupère tous les événements
    fetchEvents({ ...currentFilters.value, search: undefined })
  }
}

// Gestion du changement de filtre de date
const handleDateFilterChange = (filter: EventFilters['date_filter']) => {
  filterByDate(filter)
}

// Gestion de la réinitialisation
const handleReset = () => {
  resetFilters()
}

// Gestion du changement du nombre d'éléments par page
const handlePerPageChange = () => {
  changePerPage(parseInt(selectedPerPage.value.toString()))
}



// Synchroniser les filtres locaux avec les filtres du composable
watch(currentFilters, (newFilters) => {
  selectedPerPage.value = newFilters.per_page || 12
}, { immediate: true })
</script>