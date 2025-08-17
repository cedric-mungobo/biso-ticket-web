<template>
  <div class="px-1 py-8 md:px-8 pt-24 lg:px-12 max-w-5xl mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Mes Billets</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">Consultez et gérez vos réservations de tickets en toute simplicité</p>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Chargement en cours...</h3>
      <p class="text-gray-600">Récupération de vos billets</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-center py-16">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-red-900 mb-3">Erreur lors du chargement</h3>
      <p class="text-red-600 mb-6 max-w-md mx-auto">{{ errorMessage }}</p>
      <button
        @click="fetchMyTickets"
        class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Réessayer
      </button>
    </div>

    <!-- Message si aucun billet -->
    <div v-else-if="!ticketsByEvent || Object.keys(ticketsByEvent).length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-3">Aucun billet trouvé</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">Vous n'avez pas encore réservé de billets pour des événements. Commencez par explorer nos événements disponibles !</p>
      <NuxtLink 
        to="/evenements" 
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        Découvrir des événements
      </NuxtLink>
    </div>

    <!-- Liste des billets par événement -->
    <div v-else class="space-y-6">
      <div
        v-for="(eventData, eventId) in ticketsByEvent"
        :key="eventId"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        <!-- En-tête de l'événement -->
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">{{ eventData.event.name }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span><span class="font-medium">Date :</span> {{ formatDate(eventData.event.date_time) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span><span class="font-medium">Lieu :</span> {{ eventData.event.location }}</span>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <NuxtImg
                v-if="eventData.event.image" 
                :src="`https://api.bisoticket.com/storage/${eventData.event.image}`" 
                :alt="eventData.event.name"
                class="w-16 h-16 object-cover rounded-lg"
                loading="lazy"
                placeholder
                format="webp"
                quality="85"
                sizes="64px"
              />
            </div>
          </div>
        </div>

        <!-- Grille des billets avec TicketCard -->
        <div class="p-6">
          <h4 class="font-medium text-gray-900 mb-6 flex items-center space-x-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span>Vos billets ({{ eventData.participants.length }})</span>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <TicketCard
              v-for="participant in eventData.participants"
              :key="participant.id"
              :ticket="{
                id: participant.id,
                status: participant.payment_status,
                price: parseFloat(participant.ticket.price),
                event: {
                  name: participant.event.name,
                  date_time: participant.event.date_time,
                  location: participant.event.location,
                  image: participant.event.image
                },
                participant: {
                  name: participant.name,
                  qr_code: participant.qr_code
                },
                ticket: {
                  type: participant.ticket.type,
                  price: participant.ticket.price,
                  devise: participant.ticket.devise
                }
              }"
              @view-details="handleViewTicketDetails"
              @download="handleDownloadTicket"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé global -->
    <div v-if="ticketsByEvent && Object.keys(ticketsByEvent).length > 0" class="mt-8 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">Résumé de vos réservations</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
          <div class="text-3xl font-bold text-primary-600 mb-1">{{ totalEvents }}</div>
          <div class="text-sm text-primary-700 font-medium">Événements</div>
        </div>
        <div class="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg border border-secondary-200">
          <div class="text-3xl font-bold text-secondary-600 mb-1">{{ totalTickets }}</div>
          <div class="text-sm text-secondary-700 font-medium">Billets</div>
        </div>
        <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div class="text-3xl font-bold text-green-600 mb-1">{{ completedPayments }}</div>
          <div class="text-sm text-green-700 font-medium">Paiements confirmés</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useTickets } from '~/composables/useTickets'

// Import du composant TicketCard
import TicketCard from '~/components/TicketCard.vue'


definePageMeta({
  middleware: ['authenticated'],
})

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
const handleViewTicketDetails = (ticket: any) => {
  console.log('🔍 Voir les détails du billet:', ticket)
  // Ici vous pouvez ajouter la logique pour afficher les détails
  // Par exemple, ouvrir une modal ou naviguer vers une page de détails
}

const handleDownloadTicket = (ticket: any) => {
  console.log('📥 Télécharger le billet:', ticket)
  // Ici vous pouvez ajouter la logique pour télécharger le billet
  // Par exemple, générer un PDF ou télécharger une image
}

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

<style scoped>
/* Styles personnalisés pour la page my-tickets */

/* Animation d'entrée pour les cartes d'événements */
.bg-white.rounded-xl {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation d'entrée progressive pour les cartes */
.bg-white.rounded-xl:nth-child(1) { animation-delay: 0.1s; }
.bg-white.rounded-xl:nth-child(2) { animation-delay: 0.2s; }
.bg-white.rounded-xl:nth-child(3) { animation-delay: 0.3s; }
.bg-white.rounded-xl:nth-child(4) { animation-delay: 0.4s; }

/* Amélioration des transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet de hover amélioré pour les cartes */
.bg-white.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Amélioration des boutons */
button, a {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover, a:hover {
  transform: translateY(-1px);
}

/* Amélioration des icônes */
svg {
  transition: all 0.2s ease;
}

.group:hover svg {
  transform: scale(1.05);
}

/* Amélioration des gradients */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Responsive design amélioré */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .gap-6 {
    gap: 1rem;
  }
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible pour l'accessibilité */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #8b12ff;
  outline-offset: 2px;
}

/* Amélioration des états de chargement */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Amélioration des messages d'état */
.text-center.py-16 {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  margin: 2rem 0;
}

/* Amélioration des cartes de résumé */
.bg-gradient-to-br {
  position: relative;
  overflow: hidden;
}

.bg-gradient-to-br::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bg-gradient-to-br:hover::before {
  opacity: 1;
}

/* Amélioration de la grille des tickets */
.grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-2 {
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-2 {
    gap: 2rem;
  }
}

/* Amélioration des bordures et ombres */
.border-gray-200 {
  border-color: #e5e7eb;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
