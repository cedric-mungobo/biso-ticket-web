<template>
  <div class="mb-8 space-y-4">
    <!-- Barre de recherche -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un événement..."
            class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            @input="handleSearch"
          >
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Filtre par date -->
      <div class="sm:w-48">
        <select
          v-model="selectedDateFilter"
          @change="handleDateFilterChange"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        >
          <option value="all">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="tomorrow">Demain</option>
          <option value="this_week">Cette semaine</option>
        </select>
      </div>

      <!-- Bouton de réinitialisation -->
      <button
        @click="handleReset"
        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Réinitialiser
      </button>
    </div>

    <!-- Informations sur les résultats -->
    <div v-if="pagination" class="text-sm text-gray-600">
      Affichage de {{ pagination.from }} à {{ pagination.to }} sur {{ pagination.total }} événements
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EventFilters, Pagination } from '~/types/events'

// Props du composant
interface Props {
  pagination?: Pagination | null
  currentFilters: EventFilters
}

const props = defineProps<Props>()

// Émettre des événements pour les actions
const emit = defineEmits<{
  search: [term: string]
  dateFilterChange: [filter: EventFilters['date_filter']]
  reset: []
}>()

// État local pour les filtres
const searchTerm = ref('')
const selectedDateFilter = ref<EventFilters['date_filter']>('all')

// Timer pour la recherche (debounce)
let searchTimer: NodeJS.Timeout | null = null

// Gestion de la recherche avec debounce
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    if (searchTerm.value.trim()) {
      emit('search', searchTerm.value.trim())
    } else {
      // Si la recherche est vide, on émet un événement pour récupérer tous les événements
      emit('search', '')
    }
  }, 500)
}

// Gestion du changement de filtre de date
const handleDateFilterChange = () => {
  emit('dateFilterChange', selectedDateFilter.value)
}

// Gestion de la réinitialisation
const handleReset = () => {
  searchTerm.value = ''
  selectedDateFilter.value = 'all'
  emit('reset')
}

// Synchroniser les filtres locaux avec les filtres du composable
watch(() => props.currentFilters, (newFilters) => {
  selectedDateFilter.value = newFilters.date_filter || 'all'
}, { immediate: true })
</script>
