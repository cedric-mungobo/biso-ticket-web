<template>
  <div class="px-1  md:px-8  lg:px-12 max-w-5xl mx-auto">
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
    <div v-else-if="!tickets || tickets.length === 0" class="text-center py-16">
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

    <!-- Liste des billets (nouveau format API) -->
    <div v-else class="space-y-6">
      <div v-for="item in tickets" :key="item.id" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-start">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">{{ item.event.title }}</h3>
            <p class="text-sm text-gray-600"><span class="font-medium">Date :</span> {{ formatDate(item.event.startsAt) }}</p>
          </div>
          <img v-if="item.event.imageUrl" :src="item.event.imageUrl" :alt="item.event.title" class="w-16 h-16 object-cover rounded-lg" />
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div class="space-y-1 text-sm">
            <div><span class="text-gray-500">Billet:</span> <span class="font-medium text-gray-900">{{ item.ticket.name }}</span></div>
            <div><span class="text-gray-500">Quantité:</span> <span class="font-medium text-gray-900">{{ item.quantity }}</span></div>
            <div><span class="text-gray-500">Prix:</span> <span class="font-medium text-gray-900">{{ item.ticket.price }} {{ item.ticket.currency }}</span></div>
            <div><span class="text-gray-500">Acheté le:</span> <span class="font-medium text-gray-900">{{ formatDate(item.createdAt) }}</span></div>
          </div>
          <div class="flex md:justify-end">
            <div class="flex flex-col items-center gap-2">
              <div v-if="item.qrCode" class="qr-code-container">
                <Qrcode 
                  :value="item.qrCode" 
                  :size="160"
                  :margin="2"
                  :color="{ dark: '#000000', light: '#FFFFFF' }"
                  :error-correction-level="'H'"
                  class="w-40 h-40 border rounded bg-white"
                />
              </div>
              <template v-else>
                <div class="w-40 h-40 border rounded bg-gray-100 flex items-center justify-center">
                  <div class="text-xs text-gray-500 text-center">QR code indisponible</div>
                </div>
              </template>
              <UButton v-if="item.qrCode" size="xs" color="neutral" variant="soft" @click="() => downloadQr(item)">Télécharger</UButton>
            </div>
          </div>
        </div>
      </div>
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
import QRCode from 'qrcode'


definePageMeta({
  middleware: ['authenticated'],
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

// Fonctions utilitaires
const handleViewTicketDetails = (item: ClientTicketItem) => {
  // TODO: ouvrir une modal ou page billet
  console.log('Voir billet', item)
}

// QR Code helpers - maintenant géré par le composant Qrcode de nuxt-qrcode

const downloadQr = async (item: ClientTicketItem) => {
  if (!item.qrCode) return
  
  try {
    // Utiliser directement la librairie QRCode pour générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(item.qrCode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    // Créer un lien de téléchargement
    const link = document.createElement('a')
    link.href = qrCodeDataUrl
    link.download = `billet-${item.event.title}-${item.ticket.name}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erreur lors du téléchargement du QR Code:', error)
  }
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

/* Styles pour les QR codes avec le composant Qrcode */
.qr-code-container {
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-code-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.qr-code-container img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  display: block;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 3px solid #f3f4f6;
}

.qr-code-container img:hover {
  border-color: #8b12ff;
  box-shadow: 0 8px 25px rgba(139, 18, 255, 0.15);
  transform: scale(1.02);
}

/* Effet de brillance sur le QR code */
.qr-code-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 12px;
}

.qr-code-container:hover::before {
  opacity: 1;
}

/* Animation de pulsation pour le QR code */
@keyframes qrPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.qr-code-container img:hover {
  animation: qrPulse 2s ease-in-out infinite;
}
</style>
