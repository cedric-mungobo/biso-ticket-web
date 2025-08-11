<template>
  <main class="px-4 py-8 md:px-8 pt-20 lg:px-12">
    <div class="mx-auto max-w-3xl">
      <!-- Header de confirmation -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Réservation confirmée !
        </h1>
        <p class="text-lg text-gray-600">
          Votre place est réservée pour l'événement
        </p>
      </div>

      <!-- Carte de confirmation -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
        <!-- En-tête avec numéro de réservation -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Confirmation de réservation</h2>
            <div class="text-right">
              <p class="text-sm opacity-90">N° Réservation</p>
              <p class="font-mono font-bold text-lg">{{ reservationId }}</p>
            </div>
          </div>
        </div>

        <!-- Détails de l'événement -->
        <div class="p-6">
          <div v-if="reservationSummary?.event" class="mb-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                <NuxtImg
                  v-if="reservationSummary.event.image_url || reservationSummary.event.image"
                  :src="reservationSummary.event.image_url || reservationSummary.event.image"
                  :alt="reservationSummary.event.name"
                  class="w-full h-full object-cover"
                  loading="eager"
                  format="webp"
                  quality="80"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-primary-100 to-teal-200 flex items-center justify-center"
                >
                  <svg class="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 00-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  {{ reservationSummary.event.name }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{{ formatEventDate(reservationSummary.event.date_time) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{{ reservationSummary.event.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Résumé des tickets -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">Billets réservés</h4>
            <div class="space-y-3">
              <div
                v-for="ticketSelection in reservationSummary?.selectedTickets"
                :key="ticketSelection.ticketId"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span class="font-medium text-gray-900">{{ ticketSelection.ticket.type }}</span>
                  <span class="text-sm text-gray-600 ml-2">x{{ ticketSelection.quantity }}</span>
                </div>
                <span class="font-semibold text-gray-900">
                  {{ (parseFloat(ticketSelection.ticket.price) * ticketSelection.quantity).toFixed(2) }} {{ ticketSelection.ticket.devise }}
                </span>
              </div>
            </div>
          </div>

          <!-- Total payé -->
          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex items-center justify-between text-lg font-semibold">
              <span>Total payé</span>
              <span class="text-2xl text-primary-600">
                {{ reservationSummary?.totalPrice.toFixed(2) }} {{ reservationSummary?.currency }}
              </span>
            </div>
          </div>

          <!-- Instructions importantes -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Instructions importantes
            </h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Conservez ce numéro de réservation</li>
              <li>• Présentez-vous 15 minutes avant l'événement</li>
              <li>• Munissez-vous d'une pièce d'identité</li>
              <li>• Les billets ne sont pas remboursables</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="downloadTicket"
              class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Télécharger le billet
            </button>
            
            <button
              @click="addToCalendar"
              class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Ajouter au calendrier
            </button>
          </div>
        </div>
      </div>

      <!-- Actions secondaires -->
      <div class="mt-8 text-center">
        <NuxtLink
          to="/evenements"
          class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour aux événements
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTickets } from '~/composables/useTickets'

// Récupération de l'ID de réservation depuis l'URL
const route = useRoute()
const reservationId = route.params.reservationId as string

// Utilisation du composable
const { reservationSummary } = useTickets()

// Vérification au montage
onMounted(() => {
  if (!reservationSummary.value) {
    // Rediriger si pas de réservation
    navigateTo('/evenements')
  }
})

// Télécharger le billet
const downloadTicket = () => {
  // TODO: Implémenter la génération et téléchargement du billet PDF
  alert('Fonctionnalité de téléchargement à implémenter')
}

// Ajouter au calendrier
const addToCalendar = () => {
  if (!reservationSummary.value?.event) return
  
  const event = reservationSummary.value.event
  const startDate = new Date(event.date_time.replace(' ', 'T'))
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2h par défaut
  
  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
  
  window.open(googleUrl, '_blank')
}

// Formatage de la date
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString.replace(' ', 'T'))
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

// Métadonnées de la page
useHead({
  title: 'Confirmation - Biso Ticket',
  meta: [
    {
      name: 'description',
      content: 'Votre réservation a été confirmée avec succès'
    }
  ]
})
</script>
