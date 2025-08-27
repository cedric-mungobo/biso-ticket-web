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

      

      <!-- Tableau des événements -->
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- En-tête du tableau -->
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Lieu
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
               
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            <!-- Corps du tableau -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="event in filteredEvents"
                :key="event.id"
                class="hover:bg-gray-50 transition-colors"
              >
                
                <!-- Colonne Événement (Image + Nom + Description) -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img
                        v-if="event.image"
                        :src="event.image_url"
                        :alt="event.name"
                        class="h-16 w-16 rounded-lg object-cover"
                      />
                      <div
                        v-else
                        class="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                      >
                        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ event.name }}</div>
                      <div class="text-sm text-gray-500 line-clamp-2 max-w-xs">{{ event.description }}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Colonne Date & Lieu -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(event.date_time) }}</div>
                  <div class="text-sm text-gray-500">{{ event.location }}</div>
                </td>
                
                <!-- Colonne Catégorie -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ event.category }}
                  </span>
                </td>
                
              
                
                <!-- Colonne Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <!-- Bouton Voir -->
                    <NuxtLink
                      :to="`/evenements/${event.id}`"
                      class="inline-flex items-center p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors"
                      title="Voir l'événement"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                    
                    <!-- Bouton Éditer -->
                    <NuxtLink
                      :to="`/organisateur/events/${event.id}`"
                      class="inline-flex items-center p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-md transition-colors"
                      title="Gérer l'événement"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </NuxtLink>
                    
                    <!-- Bouton Copier le lien -->
                    <button
                      @click="copyEventLink(event.id)"
                      class="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      :title="copiedEventId === event.id ? 'Lien copié !' : 'Copier le lien'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    
                    <!-- Bouton Supprimer -->
                    <button
                      @click="handleDeleteEvent(event.id)"
                      class="inline-flex items-center p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
                      title="Supprimer l'événement"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

// Supprimer un événement
const handleDeleteEvent = async (eventId: number) => {
  // Validation de l'ID
  if (!eventId || isNaN(eventId)) {
    console.error('❌ ID d\'événement invalide:', eventId)
    alert('Erreur: ID d\'événement invalide')
    return
  }
  
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
    try {
      // Utiliser useAPI au lieu de $fetch
      const { data, error: fetchError } = await useAPI<{ success: boolean; message?: string; data?: { event_id: number } }>(`/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors de la suppression')
      }
      
      if (data.value?.success) {
        // Recharger la liste des événements depuis l'API
        await loadEvents()
        
        console.log('✅ Événement supprimé avec succès')
      } else {
        throw new Error('Format de réponse invalide lors de la suppression')
      }
    } catch (error: any) {
      console.error('💥 Erreur lors de la suppression:', error)
      
      // Afficher un message d'erreur à l'utilisateur
      let errorMessage = 'Erreur lors de la suppression de l\'événement'
      
      if (error.message) {
        if (error.message.includes('404')) {
          errorMessage = 'Événement non trouvé ou déjà supprimé'
        } else if (error.message.includes('403')) {
          errorMessage = 'Vous n\'avez pas les permissions pour supprimer cet événement'
        } else if (error.message.includes('422')) {
          errorMessage = 'Impossible de supprimer cet événement (réservations existantes)'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
    }
  }
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
