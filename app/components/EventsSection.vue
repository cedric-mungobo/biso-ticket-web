<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
    <div ref="headerRef" class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
      <h1 class="font-medium text-black text-3xl sm:text-4xl dark:text-white">
        Découvrez les événements à venir
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        <span class="text-gray-600 dark:text-gray-400">Chargement des événements...</span>
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
        <h3 class="text-lg font-medium text-red-800 mb-2">Impossible de charger les événements</h3>
        <p class="text-red-600 mb-4">Vérifiez votre connexion internet et réessayez.</p>
        <button 
          @click="handleRetry"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else-if="events.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <div 
        v-for="event in events" 
        :key="event.id"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Event Image -->
        <div class="aspect-w-16 aspect-h-9 overflow-hidden">
          <NuxtImage
            :src="event.image_url || event.image"
            :alt="event.name || event.title"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <!-- Event Content -->
        <div class="p-6">
          <!-- Event Title -->
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {{ event.name || event.title }}
          </h3>

          <!-- Event Date -->
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 mr-2" />
            <span>{{ formatEventDate(event.startsAt || event.date_time) }}</span>
          </div>

          <!-- Event Location -->
          <div v-if="event.location" class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-2" />
            <span class="line-clamp-1">{{ event.location }}</span>
          </div>

          <!-- Event Description -->
          <p v-if="event.description" class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {{ event.description }}
          </p>

          <!-- Event Actions -->
          <div class="flex items-center justify-between">
            <NuxtLink
              :to="`/evenements/${event.slug}`"
              class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              Voir les détails
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>

            <!-- Event Status Badge -->
            <span 
              :class="getEventStatusClass(event.status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ getEventStatusLabel(event.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
        <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun événement disponible</h3>
        <p class="text-gray-600 dark:text-gray-400">Revenez bientôt pour découvrir nos prochains événements.</p>
      </div>
    </div>

    <!-- CTA Section -->
    <div v-if="events.length > 0" ref="ctaRef" class="text-center mt-12">
      <NuxtLink 
        to="/evenements"
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        Voir tous les événements
        <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/api'

// Props
const props = defineProps<{
  events: Event[]
  loading?: boolean
  error?: boolean
}>()

// Emits
const emit = defineEmits<{
  retry: []
}>()

// Refs
const headerRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

// Fonctions utilitaires
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getEventStatusClass = (status: string): string => {
  const statusClasses = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'ended': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'suspended': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

const getEventStatusLabel = (status: string): string => {
  const statusLabels = {
    'active': 'Actif',
    'draft': 'Brouillon',
    'ended': 'Terminé',
    'cancelled': 'Annulé',
    'suspended': 'Suspendu'
  }
  return statusLabels[status as keyof typeof statusLabels] || status
}

const handleRetry = () => {
  emit('retry')
}

// Composant simplifié sans GSAP
onMounted(() => {
  console.log('🎬 EventsSection chargé sans animations GSAP')
})
</script>

<style scoped>
/* Styles CSS simples pour remplacer les animations GSAP */
.group:hover {
  transform: translateY(-2px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>