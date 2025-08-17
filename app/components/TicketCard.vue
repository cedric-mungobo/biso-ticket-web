<template>
  <div class="ticket-card group cursor-pointer" @click="openTicketModal">
    <!-- Carte principale avec layout horizontal -->
    <div class="bg-white rounded-xl border border-neutral-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      <div class="flex items-center p-4">
        <!-- Section gauche : Détails de l'événement -->
        <div class="flex-1 space-y-2">
          <!-- Nom de l'événement -->
          <h3 class="text-lg font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {{ ticket.event.name }}
          </h3>
          
          <!-- Date et heure -->
          <div class="flex items-center space-x-2 text-sm text-neutral-600">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(ticket.event.date_time) }}</span>
            <span class="text-neutral-400">•</span>
            <span>{{ formatTime(ticket.event.date_time) }}</span>
          </div>
          
          <!-- Lieu -->
          <div class="flex items-center space-x-2 text-sm text-neutral-600">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="line-clamp-1">{{ ticket.event.location }}</span>
          </div>
          
          <!-- Statut et prix -->
          <div class="flex items-center space-x-3">
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusClasses(ticket.status)"
            >
              {{ getStatusText(ticket.status) }}
            </span>
            <span class="text-sm font-semibold text-primary-600">{{ formatPrice(ticket.price) }}</span>
          </div>
        </div>
        
        <!-- Section droite : QR Code -->
        <div class="flex-shrink-0 ml-4">
          <div class="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-neutral-200">
            <!-- Placeholder pour le QR Code - à remplacer par un vrai QR code -->
            <Qrcode variant="circle" :value="ticket.participant.qr_code" />

          </div>
          <div class="text-xs text-neutral-500 text-center mt-1">#{{ ticket.participant.qr_code }}</div>
        </div>
      </div>
    </div>
    
    <!-- Modal pour afficher les détails du ticket -->
    <Modal v-model="showModal" :title="`Ticket - ${ticket.event.name}`">
      <div class="space-y-6">
        <!-- Image de l'événement -->
        <div v-if="ticket.event.image" class="relative h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg overflow-hidden">
          <img 
            :src="`https://api.bisoticket.com/storage/${ticket.event.image}`" 
            :alt="ticket.event.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        
        <!-- Détails complets de l'événement -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-neutral-900">{{ ticket.event.name }}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div class="text-sm text-neutral-500">Date et heure</div>
                  <div class="font-medium">{{ formatDate(ticket.event.date_time) }}</div>
                  <div class="text-sm text-neutral-600">{{ formatTime(ticket.event.date_time) }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div class="text-sm text-neutral-500">Lieu</div>
                  <div class="font-medium">{{ ticket.event.location }}</div>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div class="text-sm text-neutral-500">Participant</div>
                  <div class="font-medium">{{ ticket.participant.name }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div>
                  <div class="text-sm text-neutral-500">Prix</div>
                  <div class="text-xl font-bold text-primary-600">{{ formatPrice(ticket.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- QR Code en grand -->
        <div class="text-center">
          <div class="inline-block p-4 bg-neutral-50 rounded-lg">
            <div class="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-2 border-neutral-200">
              <!-- Placeholder pour le QR Code - à remplacer par un vrai QR code -->
              <Qrcode variant="circle" :value="ticket.participant.qr_code" />
            </div>
            <div class="text-sm text-neutral-500 mt-2">{{ ticket.participant.qr_code }}</div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center justify-center space-x-3 pt-4 border-t border-neutral-100">
          <button 
            @click="downloadTicket"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger
          </button>
          
          <button 
            @click="closeModal"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Interface pour le ticket
interface Ticket {
  id: string | number
  status: string
  price: number
  event: {
    name: string
    date_time: string
    location: string
    image?: string
  }
  participant: {
    name: string
    qr_code: string
  }
}

// Props du composant
interface Props {
  ticket: Ticket
}

const props = defineProps<Props>()

// Émits du composant
const emit = defineEmits<{
  'view-details': [ticket: Ticket]
  'download': [ticket: Ticket]
}>()

// État local pour la modal
const showModal = ref(false)

// Fonctions pour gérer la modal
const openTicketModal = () => {
  showModal.value = true
  emit('view-details', props.ticket)
}

const closeModal = () => {
  showModal.value = false
}

const downloadTicket = async () => {
  try {
    // Importer la bibliothèque QR code
    const QRCode = await import('qrcode')
    
    // Créer un canvas avec les dimensions appropriées (format horizontal comme le TicketCard)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Dimensions du ticket (format horizontal comme le composant)
    const width = 800
    const height = 300 // Augmenté pour accommoder le QR code en bas
    canvas.width = width
    canvas.height = height

    // Couleurs exactes du design (basées sur les classes Tailwind)
    const colors = {
      primary: '#3B82F6', // primary-600
      white: '#FFFFFF',
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
      }
    }

    // Fond principal avec border radius (rounded-xl)
    ctx.fillStyle = colors.white
    ctx.fillRect(0, 0, width, height)

    // Bordure avec transparence (border-neutral-200/50)
    ctx.strokeStyle = colors.neutral[200]
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)

    // Ombre subtile (shadow-sm)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 1

    // Padding interne (p-4 = 16px)
    const padding = 16
    const contentWidth = width - (padding * 2)
    const contentHeight = height - (padding * 2)

    // Section principale : Détails de l'événement (pleine largeur)
    const mainSectionX = padding
    const mainSectionY = padding
    const mainSectionWidth = contentWidth

    // Nom de l'événement (agrandi)
    ctx.font = 'bold 28px Arial, sans-serif' // Augmenté de 18px à 28px
    ctx.fillStyle = colors.neutral[900]
    ctx.textAlign = 'left'
    
    const eventName = props.ticket.event.name
    const maxEventNameWidth = mainSectionWidth - 20
    let displayEventName = eventName
    
    // Tronquer le nom si trop long (line-clamp-2)
    if (ctx.measureText(eventName).width > maxEventNameWidth) {
      let truncatedName = eventName
      while (ctx.measureText(truncatedName + '...').width > maxEventNameWidth) {
        truncatedName = truncatedName.slice(0, -1)
      }
      displayEventName = truncatedName + '...'
    }
    
    ctx.fillText(displayEventName, mainSectionX, mainSectionY + 35) // Augmenté de 20 à 35

    // Date et heure (agrandi)
    ctx.font = '20px Arial, sans-serif' // Augmenté de 14px à 20px
    ctx.fillStyle = colors.neutral[600]
    
    // Icône calendrier
    const calendarIconX = mainSectionX
    const calendarIconY = mainSectionY + 75 // Augmenté de 45 à 75
    ctx.fillStyle = colors.neutral[600]
    ctx.fillText('📅', calendarIconX, calendarIconY)
    
    // Texte de la date
    ctx.fillText(formatDate(props.ticket.event.date_time), calendarIconX + 35, calendarIconY) // Augmenté de 25 à 35
    ctx.fillText('•', calendarIconX + 35 + ctx.measureText(formatDate(props.ticket.event.date_time)).width + 12, calendarIconY) // Augmenté de 8 à 12
    ctx.fillText(formatTime(props.ticket.event.date_time), calendarIconX + 35 + ctx.measureText(formatDate(props.ticket.event.date_time)).width + 30, calendarIconY) // Augmenté de 20 à 30

    // Lieu (agrandi)
    const locationIconX = mainSectionX
    const locationIconY = mainSectionY + 110 // Augmenté de 70 à 110
    ctx.fillText('📍', locationIconX, locationIconY)
    
    const locationText = props.ticket.event.location
    const maxLocationWidth = mainSectionWidth - 70 // Augmenté de 50 à 70
    let displayLocation = locationText
    
    // Tronquer le lieu si trop long (line-clamp-1)
    if (ctx.measureText(locationText).width > maxLocationWidth) {
      let truncatedLocation = locationText
      while (ctx.measureText(truncatedLocation + '...').width > maxLocationWidth) {
        truncatedLocation = truncatedLocation.slice(0, -1)
      }
      displayLocation = truncatedLocation + '...'
    }
    
    ctx.fillText(displayLocation, locationIconX + 35, locationIconY) // Augmenté de 25 à 35

    // Statut et prix (agrandi)
    const statusY = mainSectionY + 145 // Augmenté de 95 à 145
    
    // Badge de statut (agrandi)
    const statusText = getStatusText(props.ticket.status)
    const statusWidth = ctx.measureText(statusText).width + 20 // Augmenté de 16 à 20
    const statusHeight = 28 // Augmenté de 20 à 28
    
    // Couleurs du statut
    let statusBgColor, statusTextColor
    switch (props.ticket.status) {
      case 'confirmed':
        statusBgColor = '#DCFCE7' // bg-green-100
        statusTextColor = '#166534' // text-green-800
        break
      case 'pending':
        statusBgColor = '#FEF3C7' // bg-yellow-100
        statusTextColor = '#92400E' // text-yellow-800
        break
      case 'cancelled':
        statusBgColor = '#FEE2E2' // bg-red-100
        statusTextColor = '#991B1B' // text-red-800
        break
      case 'used':
        statusBgColor = '#DBEAFE' // bg-blue-100
        statusTextColor = '#1E40AF' // text-blue-800
        break
      case 'expired':
        statusBgColor = '#F3F4F6' // bg-gray-100
        statusTextColor = '#374151' // text-gray-800
        break
      default:
        statusBgColor = '#F3F4F6'
        statusTextColor = '#374151'
    }
    
    // Dessiner le badge de statut
    ctx.fillStyle = statusBgColor
    ctx.beginPath()
    ctx.roundRect(calendarIconX, statusY - 20, statusWidth, statusHeight, 14) // Augmenté de 10 à 14
    ctx.fill()
    
    // Texte du statut (agrandi)
    ctx.fillStyle = statusTextColor
    ctx.font = 'bold 16px Arial, sans-serif' // Augmenté de 12px à 16px
    ctx.fillText(statusText, calendarIconX + 10, statusY + 2) // Ajusté pour centrer

    // Prix (agrandi)
    const priceX = calendarIconX + statusWidth + 30 // Augmenté de 24 à 30
    ctx.fillStyle = colors.primary
    ctx.font = 'bold 20px Arial, sans-serif' // Augmenté de 14px à 20px
    ctx.fillText(formatPrice(props.ticket.price), priceX, statusY + 2) // Ajusté pour centrer

    // Ligne de séparation avant le QR code
    ctx.strokeStyle = colors.neutral[200]
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, mainSectionY + 180) // Position après le contenu principal
    ctx.lineTo(width - padding, mainSectionY + 180)
    ctx.stroke()

    // Section QR Code en bas (centré)
    const qrSectionY = mainSectionY + 200 // Position en bas
    const qrSize = 100 // Augmenté de 80 à 100
    const qrX = (width - qrSize) / 2 // Centré horizontalement
    const qrY = qrSectionY
    
    // Fond du QR code
    ctx.fillStyle = colors.neutral[100]
    ctx.beginPath()
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 12) // Augmenté de 8 à 12
    ctx.fill()
    
    // Bordure du QR code
    ctx.strokeStyle = colors.neutral[200]
    ctx.lineWidth = 3 // Augmenté de 2 à 3
    ctx.strokeRect(qrX, qrY, qrSize, qrSize)

    // Générer le vrai QR code
    try {
      // Créer le QR code avec la bibliothèque qrcode
      const qrDataURL = await QRCode.toDataURL(props.ticket.participant.qr_code, {
        width: qrSize - 8,
        margin: 0,
        color: {
          dark: colors.neutral[800],
          light: colors.neutral[100]
        }
      })
      
      // Créer une image pour le QR code
      const qrImage = new Image()
      qrImage.onload = () => {
        ctx.drawImage(qrImage, qrX + 4, qrY + 4, qrSize - 8, qrSize - 8)
        
        // Numéro de ticket sous le QR code (agrandi)
        ctx.fillStyle = colors.neutral[500]
        ctx.font = 'bold 16px Arial, sans-serif' // Augmenté de 12px à 16px
        ctx.textAlign = 'center'
        ctx.fillText(`#${props.ticket.participant.qr_code}`, qrX + qrSize/2, qrY + qrSize + 25) // Ajusté position
        
        // Télécharger l'image générée
        const link = document.createElement('a')
        link.href = canvas.toDataURL()
        link.download = `ticket-${props.ticket.event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${props.ticket.participant.qr_code}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      qrImage.src = qrDataURL
    } catch (qrError) {
      console.error('Erreur lors de la génération du QR code:', qrError)
      
      // Fallback : afficher un message d'erreur
      ctx.fillStyle = colors.neutral[500]
      ctx.font = 'bold 20px Arial, sans-serif' // Augmenté de 16px à 20px
      ctx.textAlign = 'center'
      ctx.fillText('QR CODE', qrX + qrSize/2, qrY + qrSize/2)
      ctx.fillText('ERREUR', qrX + qrSize/2, qrY + qrSize/2 + 25)
      
      // Numéro de ticket sous le QR code
      ctx.fillStyle = colors.neutral[500]
      ctx.font = 'bold 16px Arial, sans-serif'
      ctx.fillText(`#${props.ticket.participant.qr_code}`, qrX + qrSize/2, qrY + qrSize + 25)
      
      // Télécharger l'image générée
      const link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.download = `ticket-${props.ticket.event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${props.ticket.participant.qr_code}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // Émettre l'événement de téléchargement
    emit('download', props.ticket)
  } catch (error) {
    console.error('Erreur lors de la génération du ticket:', error)
    // Fallback vers l'ancienne méthode
  emit('download', props.ticket)
}
}




// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF'
  }).format(price)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'confirmed': 'Confirmé',
    'pending': 'En attente',
    'cancelled': 'Annulé',
    'used': 'Utilisé',
    'expired': 'Expiré'
  }
  return statusMap[status] || status
}

const getStatusClasses = (status: string) => {
  const statusClasses: Record<string, string> = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'used': 'bg-blue-100 text-blue-800',
    'expired': 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
/* Styles spécifiques au composant */
.ticket-card {
  /* Styles de base */
}

/* Limitation du nombre de lignes pour le titre */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transitions fluides */
* {
  transition: all 0.2s ease;
}

/* Amélioration des ombres au hover */
.ticket-card:hover {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
</style>
