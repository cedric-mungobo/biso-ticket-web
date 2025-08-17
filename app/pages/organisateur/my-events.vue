<template>
  <OrganizerNavigation 
    page-title="Mes événements"
    :custom-actions="[
      {
        label: 'Exporter',
        icon: 'Download',
        action: () => exportEvents(),
        variant: 'secondary'
      },
      {
        label: 'Filtrer',
        icon: 'Filter',
        action: () => toggleFilters(),
        variant: 'secondary'
      }
    ]"
  >
    <div class="p-6 lg:p-8 pb-20 lg:pb-8">
      <!-- En-tête de la page -->
      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Mes événements
        </h1>
        <p class="text-base lg:text-lg text-gray-600">
          Gérez tous vos événements créés
        </p>
      </div>

      <!-- Filtres et actions -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center space-x-4">
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="today">Aujourd'hui</option>
            <option value="past">Passés</option>
          </select>
        </div>
        
        <NuxtLink
          to="/organisateur/create-event"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Créer un événement
        </NuxtLink>
      </div>

      <!-- Liste des événements -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des événements...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 mb-4">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
        <p class="text-gray-600 mb-4">
          {{ statusFilter ? `Aucun événement avec le statut "${statusFilter}"` : 'Vous n\'avez pas encore créé d\'événements' }}
        </p>
        <NuxtLink
          to="/organisateur/create-event"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Créer votre premier événement
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <!-- Image de l'événement -->
          <div class="h-40 lg:h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <img
              v-if="event.image"
              :src="event.image"
              :alt="event.name"
              class="w-full h-full object-cover rounded-t-lg"
            />
            <svg
              v-else
              class="h-12 w-12 lg:h-16 lg:w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <!-- Contenu de la carte -->
          <div class="p-4 lg:p-6">
            <div class="flex items-center justify-between mb-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(event)
                ]"
              >
                {{ getStatusText(event) }}
              </span>
              <span class="text-xs lg:text-sm text-gray-500">{{ event.category }}</span>
            </div>

            <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">{{ event.name }}</h3>
            <p class="text-gray-600 text-xs lg:text-sm mb-3 lg:mb-4 line-clamp-2">{{ event.description }}</p>

            <div class="space-y-2 mb-3 lg:mb-4">
              <div class="flex items-center text-xs lg:text-sm text-gray-500">
                <svg class="w-3 h-3 lg:w-4 lg:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ formatDate(event.date_time) }}
              </div>
              <div class="flex items-center text-xs lg:text-sm text-gray-500">
                <svg class="w-3 h-3 lg:w-4 lg:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ event.location }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <NuxtLink
                :to="`/organisateur/events/${event.id}`"
                class="flex-1 bg-primary-600 text-white text-center px-2 lg:px-3 py-2 rounded-md hover:bg-primary-700 transition-colors text-xs lg:text-sm"
              >
                Gérer
              </NuxtLink>
              <button
                @click="copyEventLink(event.id)"
                class="px-2 lg:px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs lg:text-sm"
                :title="copiedEventId === event.id ? 'Lien copié !' : 'Copier le lien'"
              >
                <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

// Types - Utiliser le type Event du composable
type Event = {
  id: number
  name: string
  description: string
  date_time: string
  location: string
  category: string
  image?: string
}

// Composables
const { fetchMyEvents, formatDate, events, loading, error } = useOrganizerEvents()

// État de la page
const statusFilter = ref('')
const copiedEventId = ref<number | null>(null)
const showFilters = ref(false)

// Actions personnalisées
const exportEvents = () => {
  console.log('Export des événements...')
  // Logique pour exporter les événements
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
  console.log('Filtres:', showFilters.value ? 'affichés' : 'masqués')
}

// Événements filtrés
const filteredEvents = computed(() => {
  if (!statusFilter.value) return events.value
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return events.value.filter((event: Event) => {
    const eventDate = new Date(event.date_time)
    
    switch (statusFilter.value) {
      case 'upcoming':
        return eventDate >= tomorrow
      case 'today':
        return eventDate >= today && eventDate < tomorrow
      case 'past':
        return eventDate < today
      default:
        return true
    }
  })
})

// Chargement des événements
const loadEvents = async () => {
  try {
    await fetchMyEvents()
    // fetchMyEvents met à jour la variable events du composable
    // Pas besoin de gérer le retour
  } catch (err) {
    console.error('Erreur:', err)
  }
}

// Copier le lien de l'événement
const copyEventLink = async (eventId: number) => {
  const eventUrl = `${window.location.origin}/evenements/${eventId}`
  
  try {
    await navigator.clipboard.writeText(eventUrl)
    copiedEventId.value = eventId
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      copiedEventId.value = null
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

// Obtenir la classe CSS du statut
const getStatusClass = (event: Event) => {
  const eventDate = new Date(event.date_time)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (eventDate >= tomorrow) {
    return 'bg-green-100 text-green-800'
  } else if (eventDate >= today && eventDate < tomorrow) {
    return 'bg-blue-100 text-blue-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

// Obtenir le texte du statut
const getStatusText = (event: Event) => {
  const eventDate = new Date(event.date_time)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (eventDate >= tomorrow) {
    return 'À venir'
  } else if (eventDate >= today && eventDate < tomorrow) {
    return 'Aujourd\'hui'
  } else {
    return 'Passé'
  }
}

// Chargement initial
onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
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
