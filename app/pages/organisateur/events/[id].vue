<template>
  <OrganizerNavigation />
  <div class="pt-24 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <NuxtLink
              to="/organisateur/my-events"
              class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-2"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à mes événements
            </NuxtLink>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ event?.name || 'Chargement...' }}
            </h1>
          </div>
          <div class="flex space-x-3">
            <NuxtLink
              :to="`/evenements/${event?.slug || event?.id}`"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Voir l'événement
            </NuxtLink>
            <button
              @click="showAddTicketModal = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Ajouter un ticket
            </button>
          </div>
        </div>
        
        <div v-if="event" class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-700">{{ formatDate(event.date_time) }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-gray-700">{{ event.location }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="text-gray-700">{{ event.category }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
              <p class="text-gray-600">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="space-y-8">
        <!-- Onglet Tickets -->
        <div v-if="activeTab === 'tickets'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des tickets</h2>
            <button
              @click="showAddTicketModal = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Ajouter un ticket
            </button>
          </div>

          <div v-if="tickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="ticket in tickets"
              :key="ticket.id"
              class="bg-white rounded-lg shadow-md p-6"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-medium text-gray-900">{{ ticket.type }}</h3>
                <span class="text-2xl font-bold text-primary-600">{{ ticket.price }} {{ ticket.devise }}</span>
              </div>
              
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Quantité totale</span>
                  <span class="font-medium">{{ ticket.quantity }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Vendus</span>
                  <span class="font-medium text-green-600">{{ ticket.sold || 0 }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Disponibles</span>
                  <span class="font-medium text-blue-600">{{ ticket.available || ticket.quantity }}</span>
                </div>
              </div>
              
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-500">Taux de vente</span>
                  <span class="font-medium">{{ getTicketPercentage(ticket) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${getTicketPercentage(ticket)}%` }"
                  ></div>
                </div>
              </div>
              
              <div v-if="ticket.end_date" class="text-sm text-gray-500 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expire le {{ formatDate(ticket.end_date) }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun ticket configuré</h3>
            <p class="text-gray-600 mb-6">
              Commencez par ajouter des tickets pour permettre les réservations
            </p>
            <button
              @click="showAddTicketModal = true"
              class="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Ajouter votre premier ticket
            </button>
          </div>
        </div>

        <!-- Onglet Invités -->
        <div v-if="activeTab === 'guests'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des invités</h2>
            <button
              @click="showAddGuestModal = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Ajouter un invité
            </button>
          </div>

          <div v-if="guests.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Liste des invités ({{ guests.length }})</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="guest in guests"
                :key="guest.id"
                class="px-6 py-4 flex justify-between items-center"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ guest.name }}</p>
                  <p v-if="guest.table_name" class="text-sm text-gray-500">Table: {{ guest.table_name }}</p>
                  <p v-if="guest.email" class="text-sm text-gray-500">{{ guest.email }}</p>
                  <p v-if="guest.phone" class="text-sm text-gray-500">{{ guest.phone }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800': guest.status === 'pending',
                      'bg-green-100 text-green-800': guest.status === 'confirmed',
                      'bg-red-100 text-red-800': guest.status === 'cancelled'
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getGuestStatus(guest.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun invité ajouté</h3>
            <p class="text-gray-600 mb-6">
              Ajoutez des invités pour gérer votre liste de présence
            </p>
            <button
              @click="showAddGuestModal = true"
              class="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Ajouter votre premier invité
            </button>
          </div>
        </div>

        <!-- Onglet Statistiques -->
        <div v-if="activeTab === 'stats'" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900">Statistiques de l'événement</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
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
                  <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p class="text-2xl font-semibold text-gray-900">{{ event?.participants_count || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout de ticket -->
    <div v-if="showAddTicketModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ajouter un ticket</h3>
          <form @submit.prevent="handleAddTicket" class="space-y-4">
            <div>
              <label for="ticket-type" class="block text-sm font-medium text-gray-700 mb-1">
                Type de ticket *
              </label>
              <input
                id="ticket-type"
                v-model="newTicket.type"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: VIP, Standard, Premium"
              />
            </div>
            
            <div>
              <label for="ticket-price" class="block text-sm font-medium text-gray-700 mb-1">
                Prix *
              </label>
              <input
                id="ticket-price"
                v-model="newTicket.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label for="ticket-quantity" class="block text-sm font-medium text-gray-700 mb-1">
                Quantité *
              </label>
              <input
                id="ticket-quantity"
                v-model="newTicket.quantity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="100"
              />
            </div>
            
            <div>
              <label for="ticket-devise" class="block text-sm font-medium text-gray-700 mb-1">
                Devise *
              </label>
              <select
                id="ticket-devise"
                v-model="newTicket.devise"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Sélectionner une devise</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CDF">CDF</option>
              </select>
            </div>
            
            <div>
              <label for="ticket-end-date" class="block text-sm font-medium text-gray-700 mb-1">
                Date de fin de vente
              </label>
              <input
                id="ticket-end-date"
                v-model="newTicket.end_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showAddTicketModal = false"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? 'Ajout...' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout d'invité -->
    <div v-if="showAddGuestModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ajouter un invité</h3>
          <form @submit.prevent="handleAddGuest" class="space-y-4">
            <div>
              <label for="guest-name" class="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                id="guest-name"
                v-model="newGuest.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom de l'invité"
              />
            </div>
            
            <div>
              <label for="guest-table" class="block text-sm font-medium text-gray-700 mb-1">
                Table
              </label>
              <input
                id="guest-table"
                v-model="newGuest.table_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom de la table"
              />
            </div>
            
            <div>
              <label for="guest-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="guest-email"
                v-model="newGuest.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label for="guest-phone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                id="guest-phone"
                v-model="newGuest.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+243123456789"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showAddGuestModal = false"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? 'Ajout...' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CreateTicketData, GuestData } from '~/composables/useOrganizerEvents'

// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

// Route et paramètres
const route = useRoute()
const eventId = parseInt(route.params.id as string)

// Composables
const {
  fetchEvent,
  addTicket,
  fetchEventTickets,
  addGuest,
  fetchEventGuests,
  loading,
  error,
  formatDate,
  currentEvent
} = useOrganizerEvents()

// État local
const activeTab = ref('tickets')
const showAddTicketModal = ref(false)
const showAddGuestModal = ref(false)
const tickets = ref<any[]>([])
const guests = ref<any[]>([])

// Référence à l'événement actuel
const event = computed(() => currentEvent.value)

// Nouveaux éléments
const newTicket = ref<CreateTicketData>({
  type: '',
  price: 0,
  quantity: 1,
  end_date: '',
  devise: 'USD'
})

const newGuest = ref<GuestData>({
  name: '',
  table_name: '',
  email: '',
  phone: ''
})

// Onglets disponibles
const tabs = [
  { id: 'tickets', name: 'Tickets' },
  { id: 'guests', name: 'Invités' },
  { id: 'stats', name: 'Statistiques' }
]

// Métriques calculées
const totalTicketsSold = computed(() => {
  return tickets.value.reduce((total, ticket) => total + (ticket.sold || 0), 0)
})

const totalRevenue = computed(() => {
  return tickets.value.reduce((total, ticket) => {
    const price = parseFloat(ticket.price) || 0
    const sold = ticket.sold || 0
    return total + (price * sold)
  }, 0).toFixed(2)
})

// Fonctions utilitaires
const getTicketPercentage = (ticket: any) => {
  if (!ticket.quantity || ticket.quantity === 0) return 0
  const sold = ticket.sold || 0
  return Math.round((sold / ticket.quantity) * 100)
}

const getGuestStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé'
  }
  return statusMap[status] || status
}

// Gestion des formulaires
const handleAddTicket = async () => {
  try {
    // Formatage de la date pour l'API
    let formattedEndDate = ''
    if (newTicket.value.end_date) {
      const date = new Date(newTicket.value.end_date)
      formattedEndDate = date.toISOString().slice(0, 19).replace('T', ' ')
    }

    await addTicket(eventId, {
      ...newTicket.value,
      end_date: formattedEndDate
    })

    // Réinitialiser le formulaire et fermer le modal
    newTicket.value = {
      type: '',
      price: 0,
      quantity: 1,
      end_date: '',
      devise: 'USD'
    }
    showAddTicketModal.value = false

    // Recharger les tickets
    await loadEventTickets()
  } catch (err) {
    console.error('Erreur lors de l\'ajout du ticket:', err)
  }
}

const handleAddGuest = async () => {
  try {
    await addGuest(eventId, newGuest.value)

    // Réinitialiser le formulaire et fermer le modal
    newGuest.value = {
      name: '',
      table_name: '',
      email: '',
      phone: ''
    }
    showAddGuestModal.value = false

    // Recharger les invités
    await loadEventGuests()
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'invité:', err)
  }
}

// Chargement des données
const loadEventData = async () => {
  try {
    await Promise.all([
      fetchEvent(eventId),
      loadEventTickets(),
      loadEventGuests()
    ])
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err)
  }
}

const loadEventTickets = async () => {
  try {
    const eventTickets = await fetchEventTickets(eventId)
    tickets.value = eventTickets || []
  } catch (err) {
    console.error('Erreur lors du chargement des tickets:', err)
  }
}

const loadEventGuests = async () => {
  try {
    const eventGuests = await fetchEventGuests(eventId)
    guests.value = eventGuests || []
  } catch (err) {
    console.error('Erreur lors du chargement des invités:', err)
  }
}

// Chargement au montage de la page
onMounted(async () => {
  await loadEventData()
})
</script>
