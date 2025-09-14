<template>
  <div class="px-1  py-16 max-w-5xl mx-auto">
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

    <!-- Liste des billets (design inspiré de l'image) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 py-4">
      <div v-for="item in tickets" :key="item.id" class="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
        <!-- Section supérieure avec image de fond -->
        <div 
          class="px-8 py-4 relative min-h-[600px] flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
          :style="item.event.imageUrl ? `background-image: url('${item.event.imageUrl}')` : 'background: linear-gradient(135deg, #f8f6f0 0%, #f5f3ed 100%)'"
        >
          <!-- Superposition de couleur primaire -->
          <div class="absolute inset-0 bg-primary-600/80 z-10"></div>
        
          <!-- Contenu principal -->
          <div class="text-center z-40 relative">
            <!-- Titre principal -->
            <div class="mb-4">
              <h1 class="text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight drop-shadow-lg">{{ item.ticket.name }}</h1>
              <p class="text-lg text-white opacity-95 drop-shadow-md">{{ item.event.title }}</p>
              <!-- Prix affiché dans la partie haute -->
              <div class="mt-2 text-center">
                <span class="block text-3xl font-extrabold text-white mb-1 drop-shadow-lg">{{ item.ticket.price }} {{ item.ticket.currency }}</span>
          </div>
        </div>
            
            <!-- QR Code central -->
            <div class="my-2">
              <div v-if="item.qrCode" class="bg-white p-5 rounded-xl shadow-lg inline-block border-4 border-gray-100">
                <QRCode 
                  :data="item.qrCode"
                  :size="200"
                  class="block rounded-lg"
                />
              </div>
              <div v-else class="bg-white p-5 rounded-xl shadow-lg border-4 border-gray-100 w-48 h-48 flex items-center justify-center">
                <div class="text-gray-500 text-sm">QR Code indisponible</div>
                <div class="text-xs text-gray-400 mt-1">
                  Valeur: {{ item.qrCode || 'undefined' }}
                </div>
              </div>
            </div>
            
            <!-- Informations supplémentaires -->
            <div class="my-2 flex justify-center">
              <div class="text-center flex flex-col gap-1">
                <span class="text-xs text-white opacity-80 font-medium uppercase tracking-wider drop-shadow-md">Date</span>
                <span class="text-base text-white font-semibold drop-shadow-md">{{ formatDate(item.event.startsAt) }}</span>
              </div>
            </div>
            
            <!-- Bouton de téléchargement -->
            <div class="mt-2">
              <UButton size="sm" color="neutral" variant="solid" @click="() => downloadTicket(item)" class="bg-white/90 backdrop-blur-sm text-primary-600 border-none font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg">
                <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" />
                Télécharger Ticket
              </UButton>
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
// QR Code maintenant géré par le composant QRCode avec qr-code-styling


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

const downloadTicket = async (item: ClientTicketItem) => {
  try {
    // Créer un canvas haute résolution pour le ticket complet
    const scale = 2 // Facteur de qualité
    const ticketWidth = 400 * scale
    const ticketHeight = 600 * scale
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = ticketWidth
    canvas.height = ticketHeight

    // Améliorer la qualité du canvas
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Fond du ticket
    ctx.fillStyle = '#f8f6f0'
    ctx.fillRect(0, 0, ticketWidth, ticketHeight)
    
    // Définir la couleur selon le type de ticket
    const getTicketColor = (ticketId: number) => {
      const colors = [
        { primary: '#8b12ff', secondary: '#a855f7', light: '#c084fc', veryLight: '#e9d5ff' }, // Violet (Standard)
        { primary: '#059669', secondary: '#10b981', light: '#34d399', veryLight: '#a7f3d0' }, // Vert (VIP)
        { primary: '#dc2626', secondary: '#ef4444', light: '#f87171', veryLight: '#fecaca' }, // Rouge (Premium)
        { primary: '#2563eb', secondary: '#3b82f6', light: '#60a5fa', veryLight: '#bfdbfe' }, // Bleu (Gold)
        { primary: '#ea580c', secondary: '#f97316', light: '#fb923c', veryLight: '#fed7aa' }, // Orange (Platinum)
        { primary: '#7c3aed', secondary: '#8b5cf6', light: '#a78bfa', veryLight: '#ddd6fe' }, // Violet foncé (Diamond)
        { primary: '#0891b2', secondary: '#06b6d4', light: '#22d3ee', veryLight: '#a5f3fc' }, // Cyan (Elite)
        { primary: '#be123c', secondary: '#e11d48', light: '#f43f5e', veryLight: '#fecdd3' }, // Rose (Royal)
        { primary: '#0f766e', secondary: '#14b8a6', light: '#5eead4', veryLight: '#ccfbf1' }, // Teal (Emerald)
        { primary: '#7c2d12', secondary: '#ea580c', light: '#fdba74', veryLight: '#fed7aa' }, // Orange foncé (Amber)
        { primary: '#1e40af', secondary: '#3b82f6', light: '#93c5fd', veryLight: '#dbeafe' }, // Bleu foncé (Sapphire)
        { primary: '#86198f', secondary: '#c084fc', light: '#e9d5ff', veryLight: '#f3e8ff' }, // Violet clair (Amethyst)
        { primary: '#166534', secondary: '#22c55e', light: '#86efac', veryLight: '#dcfce7' }, // Vert foncé (Jade)
        { primary: '#991b1b', secondary: '#ef4444', light: '#fca5a5', veryLight: '#fecaca' }, // Rouge foncé (Ruby)
        { primary: '#1e3a8a', secondary: '#3b82f6', light: '#93c5fd', veryLight: '#dbeafe' }, // Bleu marine (Ocean)
        { primary: '#7c2d12', secondary: '#f97316', light: '#fdba74', veryLight: '#fed7aa' }, // Orange foncé (Sunset)
      ]
      
      // Utiliser le modulo pour cycler à travers les couleurs
      const colorIndex = ticketId % colors.length
      const selectedColor = colors[colorIndex] || colors[0]
      
      console.log(`🎨 Ticket ID: ${ticketId} → Index couleur: ${colorIndex} → Couleur: ${selectedColor?.primary || '#8b12ff'}`)
      
      return selectedColor
    }
    
    const ticketColors = getTicketColor(item.ticket.id)
    console.log(`🎨 Couleur du ticket (ID: ${item.ticket.id}):`, ticketColors?.primary || '#8b12ff')

    // Charger l'image de l'événement
    if (item.event.imageUrl) {
      try {
        console.log('🔄 Chargement de l\'image via proxy...')
        const proxyUrl = 'https://api.allorigins.win/raw?url='
        
        const response = await fetch(proxyUrl + encodeURIComponent(item.event.imageUrl))
        
        if (response.ok) {
          console.log('✅ Image chargée avec succès')
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          
          const bgImg = new Image()
          bgImg.onload = () => {
            console.log('🖼️ Dessin de l\'image sur le canvas...')
            // Dessiner l'image de fond en haute résolution
            ctx.drawImage(bgImg, 0, 0, ticketWidth, ticketHeight)
            
              // Superposition de couleur selon le type de ticket
              ctx.fillStyle = `${ticketColors?.primary || '#8b12ff'}CC` // Ajouter transparence
              ctx.fillRect(0, 0, ticketWidth, ticketHeight)
            
            // Nettoyer l'URL
            URL.revokeObjectURL(blobUrl)
            console.log('✅ Image dessinée avec succès')
          }
          bgImg.onerror = () => {
            console.warn('Erreur lors du chargement de l\'image')
            // Fallback: utiliser le dégradé
            createFallbackBackground()
          }
          bgImg.src = blobUrl
          
          // Attendre un peu pour que l'image se charge
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
      } catch (error) {
        console.warn('Erreur lors du chargement de l\'image:', error)
        console.log('🎨 Utilisation du fond dégradé...')
        createFallbackBackground()
      }
    } else {
      console.log('🎨 Pas d\'image, création du fond dégradé...')
      createFallbackBackground()
    }
    console.log('✅ Fond créé, passage au texte...')
    
    function createFallbackBackground() {
      if (!ctx) return
      
      // Créer un fond dégradé élégant avec les couleurs du ticket
      const gradient = ctx.createLinearGradient(0, 0, ticketWidth, ticketHeight)
      gradient.addColorStop(0, ticketColors?.primary || '#8b12ff') // Couleur primaire du ticket
      gradient.addColorStop(0.3, ticketColors?.secondary || '#a855f7') // Couleur secondaire
      gradient.addColorStop(0.7, ticketColors?.light || '#c084fc') // Couleur claire
      gradient.addColorStop(1, ticketColors?.veryLight || '#e9d5ff') // Couleur très claire
      
      // Appliquer le dégradé
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, ticketWidth, ticketHeight)
      
      // Ajouter des éléments décoratifs pour simuler un design moderne
      // Cercles décoratifs
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.beginPath()
      ctx.arc(ticketWidth * 0.2, ticketHeight * 0.3, 80 * scale, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(ticketWidth * 0.8, ticketHeight * 0.7, 60 * scale, 0, 2 * Math.PI)
      ctx.fill()
      
      // Lignes décoratives
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2 * scale
      ctx.beginPath()
      ctx.moveTo(0, ticketHeight * 0.4)
      ctx.lineTo(ticketWidth, ticketHeight * 0.4)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, ticketHeight * 0.6)
      ctx.lineTo(ticketWidth, ticketHeight * 0.6)
      ctx.stroke()
    }

    // Configuration du texte
    console.log('📝 Configuration du texte...')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Titre du ticket (haute résolution)
    ctx.fillStyle = 'white'
    ctx.font = `bold ${32 * scale}px Arial`
    ctx.fillText(item.ticket.name, ticketWidth / 2, 120 * scale)

    // Titre de l'événement
    ctx.font = `${18 * scale}px Arial`
    ctx.fillText(item.event.title, ticketWidth / 2, 160 * scale)

    // Prix
    ctx.font = `bold ${24 * scale}px Arial`
    ctx.fillText(`${item.ticket.price} ${item.ticket.currency}`, ticketWidth / 2, 200 * scale)

    // Date
    ctx.font = `${14 * scale}px Arial`
    ctx.fillText(formatDate(item.event.startsAt), ticketWidth / 2, 240 * scale)
    console.log('✅ Texte ajouté au canvas')

    // Générer le QR code réel
    console.log('🔲 Génération du QR code...')
    if (item.qrCode) {
      try {
        console.log('📱 QR Code détecté, génération en cours...')
        const { $qrCodeStyling } = useNuxtApp()
        const qrCodeStyling = $qrCodeStyling({
          width: 200 * scale,
          height: 200 * scale,
          type: 'svg',
          data: item.qrCode,
          dotsOptions: {
            color: '#000000',
            type: 'rounded',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
        })

        const svg = await qrCodeStyling.getRawData('svg')
        console.log('📄 SVG généré, conversion en image...')
        if (svg) {
          let svgString: string
          if (typeof svg === 'string') {
            svgString = svg
          } else if (svg instanceof Blob) {
            svgString = await svg.text()
          } else {
            svgString = svg.toString('utf8')
          }

          const qrImg = new Image()
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout loading QR code'))
            }, 5000)
            
            qrImg.onload = () => {
              clearTimeout(timeout)
              console.log('🖼️ Dessin du QR code sur le canvas...')
              // Fond blanc pour le QR code (haute résolution)
              ctx.fillStyle = 'white'
              ctx.fillRect(ticketWidth / 2 - 110 * scale, 280 * scale, 220 * scale, 220 * scale)
              
              // Dessiner le QR code (haute résolution)
              ctx.drawImage(qrImg, ticketWidth / 2 - 100 * scale, 290 * scale, 200 * scale, 200 * scale)
              console.log('✅ QR code dessiné avec succès')
              resolve()
            }
            qrImg.onerror = () => {
              clearTimeout(timeout)
              console.warn('Impossible de générer le QR code')
              // Dessiner un placeholder pour le QR code (haute résolution)
              ctx.fillStyle = 'white'
              ctx.fillRect(ticketWidth / 2 - 110 * scale, 280 * scale, 220 * scale, 220 * scale)
              ctx.fillStyle = '#666'
              ctx.font = `${14 * scale}px Arial`
              ctx.fillText('QR Code indisponible', ticketWidth / 2, 390 * scale)
              resolve()
            }
            qrImg.src = `data:image/svg+xml;base64,${btoa(svgString)}`
          })
        }
      } catch (error) {
        console.warn('Erreur lors de la génération du QR code:', error)
        // Dessiner un placeholder pour le QR code (haute résolution)
        ctx.fillStyle = 'white'
        ctx.fillRect(ticketWidth / 2 - 110 * scale, 280 * scale, 220 * scale, 220 * scale)
        ctx.fillStyle = '#666'
        ctx.font = `${14 * scale}px Arial`
        ctx.fillText('QR Code indisponible', ticketWidth / 2, 390 * scale)
      }
    } else {
      // Dessiner un placeholder pour le QR code (haute résolution)
      ctx.fillStyle = 'white'
      ctx.fillRect(ticketWidth / 2 - 110 * scale, 280 * scale, 220 * scale, 220 * scale)
      ctx.fillStyle = '#666'
      ctx.font = `${14 * scale}px Arial`
      ctx.fillText('QR Code indisponible', ticketWidth / 2, 390 * scale)
    }
    console.log('✅ QR code ajouté')

    // Télécharger l'image
    console.log('🎫 Génération du ticket terminée, lancement du téléchargement...')
    const dataUrl = canvas.toDataURL('image/png')
    console.log('📁 Data URL générée, longueur:', dataUrl.length)
    
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `billet-${item.event.title}-${item.ticket.name}.png`
    link.style.display = 'none'
    
    document.body.appendChild(link)
    console.log('🖱️ Clic sur le lien de téléchargement...')
    link.click()
    
    // Attendre un peu avant de nettoyer
    setTimeout(() => {
    document.body.removeChild(link)
      console.log('✅ Téléchargement lancé avec succès')
    }, 100)

  } catch (error) {
    console.error('Erreur lors du téléchargement du ticket:', error)
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


