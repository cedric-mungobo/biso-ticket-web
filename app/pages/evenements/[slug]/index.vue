<template>
  <main class="px-2 py-8 md:px-8 pt-24 lg:px-12">
    <div class="mx-auto max-w-5xl">
      <!-- Breadcrumb -->
      <nav class="mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <NuxtLink to="/evenements" class="hover:text-primary-600 transition-colors">
              Événements
            </NuxtLink>
          </li>
          <li>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
          </li>
          <li class="text-gray-900 font-medium" aria-current="page">
            {{ event?.name || 'Chargement...' }}
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          <span class="text-gray-600">Chargement de l'événement...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
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
          <!-- Image principale -->
          <div class="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden  ">
            <NuxtImg
              v-if="event.image_url || event.image"
              :src="event.image_url || event.image"
              :alt="event.name"
              class="h-full w-full object-cover"
              loading="eager"
              format="webp"
              quality="90"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
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
              <span
                class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary-500 text-white    backdrop-blur-sm"
                :class="categoryColorClass"
              >
                {{ event.category }}
              </span>
            </div>
  
            <!-- Badge événement en vedette -->
            <div v-if="event.is_featured" class="absolute top-4 right-4">
              <span class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-secondary-500 text-white border border-secondary-200">
                 En vedette
              </span>
            </div>
          </div>

          <!-- grid2 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="bg-white col-span-2    rounded-xl border border-gray-200 overflow-hidden">
                <!-- Informations principales -->
                <div class="p-4 md:p-6">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Titre et description -->
                    <div class="lg:col-span-2">
                      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {{ event.name }}
                      </h1>
                      
                      <p class="text-lg text-gray-600 leading-relaxed mb-6">
                        {{ event.description }}
                      </p>
      
                      <!-- Informations clés -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="flex items-center gap-3">
                          <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Date et heure</p>
                            <p class="text-base font-semibold text-gray-900">{{ formatEventDate(event.date_time) }}</p>
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
      
                        <div v-if="event.organizer" class="flex items-center gap-3">
                          <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Organisateur</p>
                            <p class="text-base font-semibold text-gray-900">{{ event.organizer.name }}</p>
                          </div>
                        </div>
      
                        <div v-if="event.participants_count !== undefined" class="flex items-center gap-3">
                          <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Participants</p>
                            <p class="text-base font-semibold text-gray-900">{{ event.participants_count }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
      
                  
                  </div>
                </div>
              </div>
                <!-- Section des tickets (masquée sur mobile) -->
                <div class="hidden md:block lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Billets disponibles</h3>
                    
                    <div v-if="event.tickets && event.tickets.length > 0" class="space-y-3">
                      <div
                        v-for="ticket in event.tickets"
                        :key="ticket.id"
                        class="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="font-semibold text-gray-900">{{ ticket.type }}</h4>
                          <span class="text-lg font-bold text-primary-600">
                            {{ ticket.formatted_price || `${ticket.price} ${ticket.devise}` }}
                          </span>
                        </div>
                        
                        <div class="text-sm text-gray-600 mb-3">
                          <p>Quantité disponible: {{ ticket.available || ticket.quantity }}</p>
                        </div>
  
                        <button
                          v-if="ticket.is_available !== false"
                          @click="showTicketModal = true"
                          class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
                          :style="ticket.bg_color ? { backgroundColor: ticket.bg_color, color: ticket.text_color || 'white' } : {}"
                        >
                          Réserver
                        </button>
                        
                        <div v-else class="text-center text-gray-500 text-sm py-2">
                          Indisponible
                        </div>
                      </div>
                    </div>
                    
                    <div v-else class="text-center text-gray-500 py-4">
                      <p>Aucun billet disponible pour le moment</p>
                    </div>
  
                    <!-- Prix global -->
                    <div v-if="event.min_price && event.max_price" class="mt-6 pt-4 border-t border-gray-200">
                      <p class="text-sm text-gray-600">Prix des billets:</p>
                      <p class="text-lg font-semibold text-gray-900">
                        {{ event.min_price }} - {{ event.max_price }} {{ event.tickets?.[0]?.devise || '€' }}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
        <!-- Header Section -->

        <!-- Actions supplémentaires -->
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Partager, organiser et créer
          </h3>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <EventShare
              :event-title="event.name"
              :event-url="fullEventUrl"
              :event-description="event.description"
            />
            
            <AddToCalendar
              :event-title="event.name"
              :event-description="event.description"
              :event-date="event.date_time"
              :event-location="event.location"
              :event-url="fullEventUrl"
            />
            
            <NuxtLink
              to="/organisateur"
              class="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
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

      <!-- Modal de réservation des tickets -->
      <TicketReservationModal
        v-model="showTicketModal"
        :event="event"
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
import type { Event } from '~/types/events'
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useEvents } from '~/composables/useEvents'


// Récupération du slug depuis l'URL
const route = useRoute()
const slug = route.params.slug as string

// État local
const event = ref<Event | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showTicketModal = ref(false)

// Utilisation du composable useEvents
const { fetchEvent } = useEvents()

// Fonction pour récupérer les données de l'événement
const fetchEventData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const eventData = await fetchEvent(slug)
    event.value = eventData
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement de l\'événement'
    error.value = errorMessage
    console.error('Erreur lors du chargement de l\'événement:', err)
  } finally {
    loading.value = false
  }
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



// Couleur du badge selon la catégorie
const categoryColorClass = computed(() => {
  if (!event.value?.category) return ''
  
  const category = event.value.category.toLowerCase()
  
  switch (category) {
    case 'image':
      return 'text-sky-700 border-sky-200'
    case 'code':
      return 'text-primary-700 border-primary-200'
    case 'rédaction':
      return 'text-violet-700 border-violet-200'
    case 'événement':
      return 'text-orange-700 border-orange-200'
    case 'concert':
      return 'text-pink-700 border-pink-200'
    case 'théâtre':
      return 'text-purple-700 border-purple-200'
    case 'sport':
      return 'text-red-700 border-red-200'
    default:
      return 'text-gray-700 border-gray-200'
  }
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

// Métadonnées de la page
useHead({
  title: computed(() => event.value ? `${event.value.name} - Biso Ticket` : 'Événement - Biso Ticket'),
  meta: [
    {
      name: 'description',
      content: computed(() => event.value?.description || 'Découvrez cet événement exceptionnel')
    }
  ]
})

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
