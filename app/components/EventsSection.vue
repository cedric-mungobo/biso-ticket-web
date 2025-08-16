<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24  ">
    <div class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
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
        <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="handleRetry"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else-if="events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <EventCard
        v-for="event in events" 
        :key="event.id"
        :category="event.category"
        :title="event.name"
        :image="event.image_url || event.image"
        :date="event.date_time"
        :description="event.description"
        :location="event.location"
        :eventId="event.id"
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
        <h3 class="text-lg font-medium text-gray-800 mb-2">Aucun événement disponible</h3>
        <p class="text-gray-600">Aucun événement n'est actuellement disponible. Revenez plus tard !</p>
      </div>
    </div>

    <!-- Call to Action -->
    <div v-if="events.length > 0" class="mt-10 lg:mt-20 text-center">
      <NuxtLink 
        to="/evenements"
        class="relative inline-block font-medium md:text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white"
      >
        Voir tous les événements
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props du composant - utilisation du type readonly retourné par useEvents
interface Props {
  events: readonly any[] // Type readonly pour correspondre au type retourné par useEvents
  loading: boolean
  error: string | null
}

// Émits du composant
interface Emits {
  (e: 'retry'): void
}

// Définition des props et emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Fonction pour gérer la réessai
const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
