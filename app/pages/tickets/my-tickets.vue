<template>
  <div class="px-4 py-8 md:px-8 pt-20 lg:px-12 max-w-5xl mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes Billets</h1>
      <p class="text-gray-600">Consultez et gérez vos réservations de tickets</p>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement de vos billets...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-red-900 mb-2">Erreur lors du chargement</h3>
      <p class="text-red-600 mb-6">{{ errorMessage }}</p>
      <button
        @click="fetchMyTickets"
        class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Réessayer
      </button>
    </div>

    <!-- Message si aucun billet -->
    <div v-else-if="!ticketsByEvent || Object.keys(ticketsByEvent).length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun billet trouvé</h3>
      <p class="text-gray-600 mb-6">Vous n'avez pas encore réservé de billets pour des événements.</p>
      <NuxtLink 
        to="/evenements" 
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Découvrir des événements
      </NuxtLink>
    </div>

    <!-- Liste des billets par événement -->
    <div v-else class="space-y-6">
      <div
        v-for="(eventData, eventId) in ticketsByEvent"
        :key="eventId"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <!-- En-tête de l'événement -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ eventData.event.name }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-medium">Date :</span> {{ formatDate(eventData.event.date_time) }}
                </div>
                <div>
                  <span class="font-medium">Lieu :</span> {{ eventData.event.location }}
                </div>
              </div>
            </div>
            <div class="ml-4">
              <img 
                v-if="eventData.event.image" 
                :src="`https://api.bisoticket.com/storage/${eventData.event.image}`" 
                :alt="eventData.event.name"
                class="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <!-- Liste des participants -->
        <div class="p-6">
          <h4 class="font-medium text-gray-900 mb-4">Vos billets ({{ eventData.participants.length }})</h4>
          <div class="space-y-4">
            <div
              v-for="participant in eventData.participants"
              :key="participant.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900">{{ participant.name }}</h5>
                    <p class="text-sm text-gray-600">{{ participant.email }}</p>
                    <p class="text-sm text-gray-600">{{ participant.phone }}</p>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <div class="mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': participant.payment_status === 'completed',
                      'bg-yellow-100 text-yellow-800': participant.payment_status === 'pending',
                      'bg-red-100 text-red-800': participant.payment_status === 'failed'
                    }"
                  >
                    {{ getPaymentStatusLabel(participant.payment_status) }}
                  </span>
                </div>
                
                <div class="text-sm text-gray-600">
                  <span class="font-medium">{{ participant.ticket.type }}</span>
                  <br>
                  <span class="text-primary-600 font-semibold">{{ participant.ticket.price }} {{ participant.ticket.devise }}</span>
                  <br>
                  <span class="text-xs text-gray-500">QR: {{ participant.qr_code }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé global -->
    <div v-if="ticketsByEvent && Object.keys(ticketsByEvent).length > 0" class="mt-8 bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ totalEvents }}</div>
          <div class="text-sm text-gray-600">Événements</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ totalTickets }}</div>
          <div class="text-sm text-gray-600">Billets</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ completedPayments }}</div>
          <div class="text-sm text-gray-600">Paiements confirmés</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useTickets } from '~/composables/useTickets'

// Types pour les tickets
interface Ticket {
  id: number
  type: string
  price: string
  formatted_price: string
  devise: string
}

interface Participant {
  id: number
  name: string
  email: string
  phone: string
  qr_code: string
  payment_status: 'completed' | 'pending' | 'failed'
  event: {
    id: number
    name: string
    date_time: string
    location: string
    image: string
  }
  ticket: Ticket
  created_at: string
  updated_at: string
}

interface EventData {
  event: {
    id: number
    name: string
    date_time: string
    location: string
    image: string
  }
  participants: Participant[]
}

interface MyTicketsResponse {
  success: boolean
  message?: string
  data: {
    tickets_by_event: Record<string, EventData>
    total_tickets: number
    total_events: number
  }
}

// État local
const isLoading = ref(true)
const ticketsByEvent = ref<Record<string, EventData> | null>(null)
const errorMessage = ref<string | null>(null)

// Composables
const { isAuthenticated, user } = useAuth()

// Computed
const totalEvents = computed(() => {
  if (!ticketsByEvent.value) return 0
  return Object.keys(ticketsByEvent.value).length
})

const totalTickets = computed(() => {
  if (!ticketsByEvent.value) return 0
  return Object.values(ticketsByEvent.value).reduce((total: number, eventData: any) => {
    return total + eventData.participants.length
  }, 0)
})

const completedPayments = computed(() => {
  if (!ticketsByEvent.value) return 0
  return Object.values(ticketsByEvent.value).reduce((total: number, eventData: any) => {
    return total + eventData.participants.filter((p: any) => p.payment_status === 'completed').length
  }, 0)
})

// Fonctions
const fetchMyTickets = async () => {
  try {
    isLoading.value = true
    errorMessage.value = null
    
    console.log('🚀 Appel API /tickets/my-tickets...')
    
    // Utiliser useAPI directement
    const { data, error: fetchError } = await useAPI<MyTicketsResponse>('/tickets/my-tickets')
    
    console.log('📡 Réponse API:', { data: data.value, fetchError: fetchError.value })
    
    if (fetchError.value) {
      console.error('❌ Erreur fetch:', fetchError.value)
      throw new Error(`Erreur réseau: ${fetchError.value.message || 'Erreur inconnue'}`)
    }
    
    if (!data.value) {
      console.error('❌ Pas de données reçues')
      throw new Error('Aucune donnée reçue de l\'API')
    }
    
    console.log('✅ Données reçues:', data.value)
    
    if (data.value.success && data.value.data) {
      console.log('🎯 Billets trouvés:', data.value.data.total_tickets)
      ticketsByEvent.value = data.value.data.tickets_by_event
    } else {
      console.error('❌ Format de réponse invalide:', data.value)
      throw new Error(`Format de réponse invalide: ${JSON.stringify(data.value)}`)
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération des billets:', error)
    
    // Gestion des erreurs avec messages clairs
    if (error.status === 401) {
      // Rediriger vers la connexion si non authentifié
      navigateTo('/connexion')
    } else if (error.status === 404) {
      // Aucun billet trouvé
      ticketsByEvent.value = {}
      errorMessage.value = null
    } else {
      // Autre erreur
      console.error('Erreur API:', error)
      errorMessage.value = error.message || 'Erreur lors de la récupération des billets'
    }
  } finally {
    isLoading.value = false
  }
}

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Confirmé'
    case 'pending':
      return 'En attente'
    case 'failed':
      return 'Échoué'
    default:
      return status
  }
}

// Vérification de l'authentification et chargement des données
onMounted(async () => {
  if (!isAuthenticated.value) {
    // Rediriger vers la connexion si non connecté
    navigateTo('/connexion')
    return
  }
  
  // Charger les billets
  await fetchMyTickets()
})
</script>
