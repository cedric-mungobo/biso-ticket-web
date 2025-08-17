<template>
  <OrganizerNavigation 
    page-title="Statistiques et performances"
    :custom-actions="[
      {
        label: 'Exporter',
        icon: 'Download',
        action: () => exportStats(),
        variant: 'secondary'
      },
      {
        label: 'Actualiser',
        icon: 'RefreshCw',
        action: () => refreshStats(),
        variant: 'primary'
      }
    ]"
  >
    <div class="p-6 lg:p-8">
      <!-- En-tête de la page -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Statistiques et performances
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Suivez les performances de vos événements et analysez vos données
        </p>
      </div>

      <!-- Sélecteur d'événement -->
      <div class="max-w-md mx-auto mb-8">
        <label for="event-select" class="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un événement
        </label>
        <select
          id="event-select"
          v-model="selectedEventId"
          @change="loadEventStats"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tous les événements</option>
          <option
            v-for="event in events"
            :key="event.id"
            :value="event.id"
          >
            {{ event.name }}
          </option>
        </select>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg text-gray-600">Chargement des statistiques...</span>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <div class="flex justify-center mb-4">
          <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="loadEventStats"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <!-- Statistiques -->
      <div v-else class="space-y-8">
        <!-- Métriques principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total événements</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalEvents }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Tickets vendus</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalTicketsSold }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalRevenue }} $</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Participants</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalParticipants }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphique des ventes par événement -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ventes par événement</h3>
          <div v-if="events.length > 0" class="space-y-4">
            <div
              v-for="event in events"
              :key="event.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900">{{ event.name }}</h4>
                <span class="text-sm text-gray-500">{{ formatDate(event.date_time) }}</span>
              </div>
              
              <div v-if="event.tickets && event.tickets.length > 0" class="space-y-2">
                <div
                  v-for="ticket in event.tickets"
                  :key="ticket.id"
                  class="flex justify-between items-center"
                >
                  <span class="text-sm text-gray-600">{{ ticket.type }}</span>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">
                      {{ ticket.sold || 0 }} / {{ ticket.quantity }}
                    </span>
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-primary-600 h-2 rounded-full"
                        :style="{ width: `${getTicketPercentage(ticket)}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">
                      {{ getTicketPercentage(ticket) }}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-sm text-gray-500 text-center py-2">
                Aucun ticket configuré
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            Aucun événement à afficher
          </div>
        </div>

        <!-- Statistiques détaillées -->
        <div v-if="selectedEventId && currentEventStats" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Statistiques détaillées - {{ getEventName(selectedEventId) }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-700 mb-3">Réservations par statut</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Complétées</span>
                  <span class="text-sm font-medium text-green-600">{{ getStatusCount('completed') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">En attente</span>
                  <span class="text-sm font-medium text-yellow-600">{{ getStatusCount('pending') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Échouées</span>
                  <span class="text-sm font-medium text-red-600">{{ getStatusCount('failed') }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-3">Méthodes de paiement</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">MaxiCash</span>
                  <span class="text-sm font-medium text-blue-600">{{ getPaymentMethodCount('maxicash') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Carte bancaire</span>
                  <span class="text-sm font-medium text-green-600">{{ getPaymentMethodCount('card') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Gratuit</span>
                  <span class="text-sm font-medium text-purple-600">{{ getPaymentMethodCount('free') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="text-center">
          <NuxtLink
            to="/organisateur"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </NuxtLink>
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

// Composables
const { fetchMyEvents, events, loading, error, formatDate, fetchEventStats } = useOrganizerEvents()

// État local
const selectedEventId = ref<string>('')
const currentEventStats = ref<any>(null)

// Actions personnalisées
const exportStats = () => {
  console.log('Export des statistiques...')
  // Logique pour exporter les statistiques
}

const refreshStats = async () => {
  try {
    await fetchMyEvents()
    if (selectedEventId.value) {
      await loadEventStats()
    }
    console.log('Statistiques actualisées')
  } catch (err) {
    console.error('Erreur lors de l\'actualisation:', err)
  }
}

// Métriques calculées
const totalEvents = computed(() => events.value.length)

const totalTicketsSold = computed(() => {
  return events.value.reduce((total, event) => {
    if (event.tickets) {
      return total + event.tickets.reduce((sum, ticket) => sum + (ticket.sold || 0), 0)
    }
    return total
  }, 0)
})

const totalRevenue = computed(() => {
  return events.value.reduce((total, event) => {
    if (event.tickets) {
      return total + event.tickets.reduce((sum, ticket) => {
        const price = parseFloat(ticket.price) || 0
        const sold = ticket.sold || 0
        return sum + (price * sold)
      }, 0)
    }
    return total
  }, 0).toFixed(2)
})

const totalParticipants = computed(() => {
  return events.value.reduce((total, event) => {
    return total + (event.participants_count || 0)
  }, 0)
})

// Fonctions utilitaires
const getTicketPercentage = (ticket: any) => {
  if (!ticket.quantity || ticket.quantity === 0) return 0
  const sold = ticket.sold || 0
  return Math.round((sold / ticket.quantity) * 100)
}

const getEventName = (eventId: string) => {
  const event = events.value.find(e => e.id.toString() === eventId)
  return event ? event.name : 'Événement inconnu'
}

const getStatusCount = (status: string) => {
  if (!currentEventStats.value) return 0
  // Logique pour compter par statut selon la structure de l'API
  return 0 // À adapter selon la structure des données
}

const getPaymentMethodCount = (method: string) => {
  if (!currentEventStats.value) return 0
  // Logique pour compter par méthode de paiement selon la structure de l'API
  return 0 // À adapter selon la structure des données
}

// Chargement des statistiques d'un événement
const loadEventStats = async () => {
  if (!selectedEventId.value) {
    currentEventStats.value = null
    return
  }

  try {
    const stats = await fetchEventStats(parseInt(selectedEventId.value))
    currentEventStats.value = stats
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
  }
}

// Chargement des événements au montage de la page
onMounted(async () => {
  try {
    await fetchMyEvents()
  } catch (err) {
    console.error('Erreur lors du chargement des événements:', err)
  }
})
</script>
