<template>
  <main class="px-2 py-14 ">
    <div class="mx-auto container">
      <!-- Loading State -->
      <LoadingOverlay 
        :show="loading"
        title="Chargement de l'événement..."
        description="Préparation des détails de l'événement..."
        variant="branded"
        :size="56"
      />

      <!-- Error State -->
      <div v-if="error" class="text-center py-10">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">Événement non trouvé</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="space-y-2">
            <button 
              @click="() => fetchEventData()"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mr-2"
            >
              Réessayer
            </button>
            <NuxtLink 
              to="/evenements"
              class="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Retour aux événements
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Event Details -->
      <div v-else-if="event" class="space-y-4">
          <!-- Image + Tickets (desktop) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2">
              <div class="relative  aspect-square md:aspect-video  rounded-lg overflow-hidden">
                <NuxtImg
                  v-if="event.imageUrl"
                  :src="event.imageUrl"
                  :alt="event.title"
                  class="h-full w-full  object-cover"
                  loading="eager"
                  format="webp"
                  quality="90"
              
                />
                <div
                  v-else
                  class="h-full w-full bg-gradient-to-br from-primary-100 to-teal-200 flex items-center justify-center"
                >
                  <svg class="w-24 h-24 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <!-- Badge de catégorie -->
                <div class="absolute top-4 left-4">
                  <UBadge color="primary">{{ primaryCategory }}</UBadge>
                </div>
                <!-- Badge événement en vedette -->
                <div v-if="event.settings?.featured" class="absolute top-4 right-4">
                  <span class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-secondary-500 text-white border border-secondary-200">
                    En vedette
                  </span>
                </div>
              </div>
            </div>
            <!-- Tickets à droite sur desktop -->
            <div class="hidden lg:block lg:col-span-1">
              <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 max-h-[80vh] flex flex-col">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Billets</h3>
                
                <!-- Loading State -->
                <div v-if="ticketsLoading" class="text-center py-8">
                  <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p class="text-sm text-gray-500">Chargement...</p>
                </div>
                
                <!-- Error State -->
                <div v-else-if="ticketsError" class="text-center py-8">
                  <p class="text-sm text-red-500">{{ ticketsError }}</p>
                </div>
                
                <!-- Indicateur de scroll pour beaucoup de tickets -->
                <div v-else-if="tickets.length > 3" class="text-center text-xs text-gray-400 pb-2 border-b border-gray-100 mb-4">
                  <span class="inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    Faites défiler pour voir tous les billets
                  </span>
                </div>
                
                <!-- Tickets List -->
                <div v-if="tickets.length" class="flex-1 overflow-y-auto space-y-1 sm:space-y-2">
                  <div v-for="ticket in tickets" :key="ticket.id" class="group bg-gray-50 rounded-lg p-2 sm:p-3">
                    <!-- Ticket Header -->
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                      <h4 class="font-medium text-gray-900 text-xs sm:text-sm pr-1">{{ ticket.name }}</h4>
                      <span class="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">{{ formatTicketPrice(ticket.price, ticket.currency) }}</span>
                    </div>
                    
                    <!-- Quantity Selector -->
                    <div class="flex items-center justify-between mb-1 sm:mb-2">
                      <span class="text-xs text-gray-500">Qté</span>
                      <div class="flex items-center gap-1 sm:gap-2">
                        <button
                          class="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          :disabled="getQuantity(ticket.id) <= 1"
                          @click="decrementQuantity(ticket.id)"
                        >
                          <svg class="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                        <span class="w-4 sm:w-6 text-center font-medium text-xs">{{ getQuantity(ticket.id) }}</span>
                        <button
                          class="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          :disabled="getQuantity(ticket.id) >= ticket.quantity"
                          @click="incrementQuantity(ticket.id, ticket.quantity)"
                        >
                          <svg class="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Total & Reserve Button -->
                    <div class="flex justify-between items-center pt-1 sm:pt-2 border-t border-gray-200">
                      <div>
                        <p class="text-xs text-gray-500">Total</p>
                        <p class="font-semibold text-gray-900 text-xs sm:text-sm">{{ formatTicketPrice(ticketTotal(ticket), ticket.currency) }}</p>
                      </div>
                      <UButton 
                        color="primary" 
                        size="xs"
                        @click="onReserve(ticket)"
                        class="px-2 sm:px-4 text-xs py-1 sm:py-1.5"
                      >
                        Réserver
                      </UButton>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                  </div>
                  <p class="text-sm text-gray-500">Aucun billet disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Détails de l'événement -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

             <UCard class="p-2  col-span-2">
               <div class="">
                 <div class="lg:col-span-2">
                   <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ event.title }}</h1>
                   
                   <div class=" py-4 hidden max-sm:block">
                     <div class="flex flex-wrap items-center gap-2 mb-6">
                       <UBadge v-for="cat in categories" :key="`cat-${cat}`" color="neutral" variant="soft">#{{ cat }}</UBadge>
                       <UBadge v-for="tag in formattedTags" :key="`tag-${tag}`" color="neutral" variant="subtle">{{ tag }}</UBadge>
                     </div>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div class="flex items-center gap-3">
                         <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                           <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                           </svg>
                         </div>
                         <div>
                           <p class="text-sm font-medium text-gray-500">Date et heure</p>
                           <p class="text-base font-semibold text-gray-900">{{ formatEventDate(event.startsAt) }}</p>
                         </div>
                       </div>
                       <div class="flex items-center gap-3">
                         <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                           <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                           </svg>
                         </div>
                         <div>
                           <p class="text-sm font-medium text-gray-500">Lieu</p>
                           <p class="text-base font-semibold text-gray-900">{{ event.location }}</p>
                         </div>
                       </div>
                     </div>
   
                   </div>
                   <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{{ event.description || 'Aucune description disponible.' }}</p>
                 </div>
               </div>
             </UCard>

             <div class=" p-2 bg-white rounded-xl border border-gray-200">

               <div class=" py-4  md:p-4 max-sm:hidden">
                    <div class="flex flex-wrap items-center gap-2 mb-6">
                      <UBadge v-for="cat in categories" :key="`cat-${cat}`" color="neutral" variant="soft">#{{ cat }}</UBadge>
                      <UBadge v-for="tag in formattedTags" :key="`tag-${tag}`" color="neutral" variant="subtle">{{ tag }}</UBadge>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Date et heure</p>
                          <p class="text-base font-semibold text-gray-900">{{ formatEventDate(event.startsAt) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Lieu</p>
                          <p class="text-base font-semibold text-gray-900">{{ event.location }}</p>
                        </div>
                      </div>
                    </div>
  
                  </div>

                   <!-- Actions supplémentaires -->
           <div class="w-full sm:bg-gradient-to-br from-white to-gray-50 rounded-xl sm:border border-gray-200 p-4 sm:shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Partager, organiser et créer
            </h3>
            
             <div class="flex flex-col w-full gap-4 justify-center items-center">
              <EventShare
                :event-title="event.title"
                :event-url="fullEventUrl"
                :event-description="event.description || ''"
              />
              
              <AddToCalendar
                :event-title="event.title"
                :event-description="event.description || ''"
                :event-date="event.startsAt"
                :event-location="event.location || ''"
                :event-url="fullEventUrl"
              />
              
              <NuxtLink
                to="/organisateur"
                class="w-full bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Organiser un événement
              </NuxtLink>
            </div>
            
            <p class="text-sm text-gray-500 text-center mt-4">
              Partagez cet événement avec vos amis, ajoutez-le à votre calendrier ou créez votre propre événement
            </p>
          </div>
             </div>
           </div>

         
         
      </div>

      <!-- Modal de réservation des tickets -->
      <TicketReservationModal
        v-model="showTicketModal"
        :event="event"
        :tickets="tickets"
      />
    </div>

    <!-- Bouton fixe mobile pour réserver -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 pb-6">
      <button
        @click="showTicketModal = true"
        class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
      >
        Réserver ma place
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Event } from '~/types/api'
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useEvents } from '~/composables/useEvents'
import { formatMoney } from '~/utils'
import { useSEO } from '~/composables/useSEO'
import LoadingOverlay from '~/components/LoadingOverlay.vue'


// Récupération du slug depuis l'URL
const route = useRoute()
const slug = route.params.slug as string

// État local
const event = ref<Event | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showTicketModal = ref(false)
// Tickets
const tickets = ref<any[]>([])
const ticketsLoading = ref(false)
const ticketsError = ref<string | null>(null)

// Utilisation du composable useTickets pour la gestion des quantités
const {
  selectedTickets,
  incrementQuantity: incrementTicketQuantity,
  decrementQuantity: decrementTicketQuantity,
  getTicketQuantity,
  calculateTicketTotal,
  totalPrice,
  totalsByCurrency,
  hasMultipleCurrencies,
  totalQuantity,
  currency,
  hasSelectedTickets,
  setEvent
} = useTickets()

// Utilisation du composable useEvents
const { fetchEventBySlug, fetchEventTickets } = useEvents()

// Fonction pour récupérer les données de l'événement
const fetchEventData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const eventData = await fetchEventBySlug(slug)
    event.value = eventData
    
    // Synchroniser avec le composable useTickets
    setEvent(eventData)
    
    await fetchTickets()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement de l\'événement'
    error.value = errorMessage
    console.error('Erreur lors du chargement de l\'événement:', err)
  } finally {
    loading.value = false
  }
}

const fetchTickets = async () => {
  try {
    ticketsLoading.value = true
    ticketsError.value = null
    const res = await fetchEventTickets(slug, { per_page: 50, page: 1 })
    tickets.value = Array.isArray(res.items) ? res.items : []
    
    // Synchroniser avec le composable useTickets
    if (event.value) {
      const eventWithTickets = { ...event.value, tickets: tickets.value }
      setEvent(eventWithTickets)
    }
  } catch (err) {
    ticketsError.value = err instanceof Error ? err.message : 'Erreur chargement billets'
  } finally {
    ticketsLoading.value = false
  }
}

// Wrapper functions pour maintenir la compatibilité
const getQuantity = (ticketId: number) => getTicketQuantity(ticketId)
const incrementQuantity = (ticketId: number, max: number) => incrementTicketQuantity(ticketId)
const decrementQuantity = (ticketId: number) => decrementTicketQuantity(ticketId)

// Réserver billet (ouvre le modal)
const onReserve = (ticket: any) => {
  showTicketModal.value = true
}

// Helpers de total/format
const ticketTotal = (ticket: any) => (Number(ticket?.price) || 0) * getQuantity(ticket?.id)

// Formatage des montants avec gestion des devises différentes
const formatTicketPrice = (amount: number, currency?: string) => {
  const formattedAmount = formatMoney(amount)
  const cur = (currency || 'USD').toUpperCase()
  return `${formattedAmount} ${cur}`
}
// Récupération des données au montage du composant
onMounted(() => {
    nextTick(() => {

        if (slug) {
            fetchEventData()
        }
        })
})

// Surveillance des changements de route
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    fetchEventData()
  }
})

// Plus de classe spécifique par catégorie; on affiche simplement le texte
const primaryCategory = computed(() => event.value?.settings?.categories?.[0] || 'Événement')
const categories = computed(() => event.value?.settings?.categories || [])
const formattedTags = computed(() => {
  const raw = event.value?.settings?.tags || []
  return raw.map(t => {
    const compact = String(t).trim().replace(/\s+/g, '')
    return compact.startsWith('#') ? compact : `#${compact}`
  })
})

// Formatage de la date de l'événement
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString.replace(' ', 'T'))
    
    if (isNaN(date.getTime())) {
      return 'Date à définir'
    }
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Date à définir'
  }
}

// Formatage de la date simple
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Date à définir'
  }
}

// SEO pour la page événement
const { setEventSEO } = useSEO()
watch(event, (newEvent) => {
  if (newEvent) {
    setEventSEO(newEvent)
  }
}, { immediate: true })

// Computed property pour l'URL complète de l'événement
const fullEventUrl = computed(() => {
  if (process.client) {
    return `${window.location.origin}/evenements/${slug}`
  }
  // Fallback pour SSR
  return `/evenements/${slug}`
})
</script>

<style scoped>
/* Optimisations pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .transition-colors,
  .transition-transform {
    transition: none;
  }
}
</style>
