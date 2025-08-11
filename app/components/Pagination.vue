<template>
  <div v-if="pagination && pagination.last_page > 1" class="flex justify-center items-center space-x-2">
    <!-- Bouton précédent -->
    <button
      @click="handlePageChange(pagination.current_page - 1)"
      :disabled="pagination.current_page <= 1"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      aria-label="Page précédente"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>

    <!-- Numéros de page -->
    <div class="flex space-x-1">
      <!-- Première page -->
      <button
        v-if="showFirstPage"
        @click="handlePageChange(1)"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
      >
        1
      </button>

      <!-- Ellipsis au début -->
      <span v-if="showFirstEllipsis" class="px-3 py-2 text-sm text-gray-500">...</span>

      <!-- Pages visibles -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="handlePageChange(page)"
        :class="[
          'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
          page === pagination.current_page
            ? 'bg-primary-500 text-white border border-primary-500'
            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>

      <!-- Ellipsis à la fin -->
      <span v-if="showLastEllipsis" class="px-3 py-2 text-sm text-gray-500">...</span>

      <!-- Dernière page -->
      <button
        v-if="showLastPage"
        @click="handlePageChange(pagination.last_page)"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
      >
        {{ pagination.last_page }}
      </button>
    </div>

    <!-- Bouton suivant -->
    <button
      @click="handlePageChange(pagination.current_page + 1)"
      :disabled="pagination.current_page >= pagination.last_page"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      aria-label="Page suivante"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Pagination } from '~/types/events'

// Props du composant
interface Props {
  pagination: Pagination
}

const props = defineProps<Props>()

// Émettre un événement pour changer de page
const emit = defineEmits<{
  pageChange: [page: number]
}>()

// Gestion du changement de page
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.pagination.last_page) {
    emit('pageChange', page)
  }
}

// Calcul des pages visibles
const visiblePages = computed(() => {
  const { current_page, last_page } = props.pagination
  const pages: number[] = []
  
  // Afficher au maximum 5 pages autour de la page courante
  const start = Math.max(1, current_page - 2)
  const end = Math.min(last_page, current_page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Affichage de la première page
const showFirstPage = computed(() => {
  return visiblePages.value[0] > 1
})

// Affichage de la dernière page
const showLastPage = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < props.pagination.last_page
})

// Affichage des ellipsis
const showFirstEllipsis = computed(() => {
  return visiblePages.value[0] > 2
})

const showLastEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < props.pagination.last_page - 1
})
</script>
