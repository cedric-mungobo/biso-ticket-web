<template>
  <div class="px-1  py-16 max-w-5xl mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Mes Billets</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">Consultez et gérez vos réservations de tickets en toute simplicité</p>
    </div>

    <!-- État de chargement -->
    <LoadingOverlay 
      :show="isLoading"
      title="Chargement de vos billets..."
      description="Récupération de vos billets en cours..."
      variant="branded"
      :size="56"
    />

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
        @click="() => { void fetchMyTickets() }"
        class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Réessayer
      </button>
    </div>

    <!-- Message si aucun billet -->
    <div v-else-if="!tickets || tickets.length === 0 " class="text-center py-16">
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

    <!-- Liste des billets (design inspiré de l'image) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 py-4">
      <TicketCard 
        v-for="item in tickets" 
        :key="item.id"
        :item="item"
      />
      <!-- Pagination simple -->
      <div v-if="meta" class="flex justify-center items-center gap-3 pt-4">
        <UButton color="neutral" variant="soft" :disabled="(meta && meta.currentPage <= 1)" @click="() => { void changePage((meta?.currentPage || 1) - 1) }">Précédent</UButton>
        <span class="text-sm text-gray-600">Page {{ meta?.currentPage }} / {{ meta?.lastPage }}</span>
        <UButton color="neutral" variant="soft" :disabled="(meta && meta.currentPage >= meta.lastPage)" @click="() => { void changePage((meta?.currentPage || 1) + 1) }">Suivant</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientTickets, type ClientTicketItem } from '~/composables/useClientTickets'
import { useSEO } from '~/composables/useSEO'
import LoadingOverlay from '~/components/LoadingOverlay.vue'

definePageMeta({
  middleware: ['authenticated'],
})

// SEO pour la page mes billets (privée - noindex)
const { setSEO } = useSEO()
setSEO({
  title: 'Mes Billets - Biso Ticket',
  description: 'Consultez et gérez vos réservations de tickets en toute simplicité.',
  noindex: true,
  type: 'website'
})

interface Pagination { currentPage: number; lastPage: number; perPage: number; total: number }

// État local
const isLoading = ref(true)
const tickets = ref<ClientTicketItem[]>([])
const meta = ref<Pagination | null>(null)
const errorMessage = ref<string | null>(null)

const { fetchClientTickets } = useClientTickets()

// Fonctions
const fetchMyTickets = async (page = 1) => {
  try {
    isLoading.value = true
    errorMessage.value = null
    const res = await fetchClientTickets(page, 15)
    if (process.dev) console.log('[MyTickets] raw', res)
    // Réponse API: { status, message, data: { data: [...], current_page, last_page, per_page, total } }
    const envelope = (res as any)?.data ?? res
    const itemsArray = Array.isArray(envelope?.data) ? (envelope.data as any[]) : []
    tickets.value = itemsArray
    meta.value = {
      currentPage: Number(envelope?.current_page || 1),
      lastPage: Number(envelope?.last_page || 1),
      perPage: Number(envelope?.per_page || 15),
      total: Number(envelope?.total || 0)
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération des billets:', error)
    if (error.status === 401) {
      navigateTo('/connexion')
    } else if (error.status === 404) {
      tickets.value = []
      meta.value = { currentPage: 1, lastPage: 1, perPage: 15, total: 0 }
      errorMessage.value = null
    } else {
      console.error('Erreur API:', error)
      errorMessage.value = error.message || 'Erreur lors de la récupération des billets'
    }
  } finally {
    isLoading.value = false
  }
}


// Les fonctions de téléchargement sont maintenant dans le composant TicketCard

// Pagination
const changePage = async (page: number) => {
  if (!meta.value) return
  const safe = Math.min(Math.max(1, page), meta.value.lastPage)
  await fetchMyTickets(safe)
}

// Chargement initial (middleware authenticated protège déjà la page)
onMounted(async () => {
  await fetchMyTickets()
})

// Debug pour les tickets
watch(tickets, (newTickets) => {
  console.log('Tickets chargés:', newTickets)
  if (newTickets && newTickets.length > 0) {
    console.log('Premier ticket:', newTickets[0])
    console.log('QR Code du premier ticket:', newTickets[0]?.qrCode)
    console.log('Type QR Code:', typeof newTickets[0]?.qrCode)
    console.log('QR Code length:', newTickets[0]?.qrCode?.length)
  }
}, { immediate: true })
</script>


