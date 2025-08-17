<template>
  <div class="ticket-card group cursor-pointer" @click="openTicketModal">
    <!-- Carte principale avec layout horizontal -->
    <div class="bg-white rounded-xl border border-primary-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary-300">
      
      <div class="flex items-center p-4">
        <!-- Section gauche : Détails de l'événement -->
        <div class="flex-1 space-y-3">
          <!-- Nom de l'événement -->
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {{ ticket.event.name }}
          </h3>
          
          <!-- Date et heure -->
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4 flex-shrink-0 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(ticket.event.date_time) }}</span>
            <span class="text-gray-400">•</span>
            <span>{{ formatTime(ticket.event.date_time) }}</span>
          </div>
          
          <!-- Lieu -->
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4 flex-shrink-0 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="line-clamp-1">{{ ticket.event.location }}</span>
          </div>
          
          <!-- Statut et prix -->
          <div class="flex items-center space-x-3">
            <span 
              class="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
              :class="getStatusClasses(ticket.status)"
            >
              {{ getStatusText(ticket.status) }}
            </span>
            <span class="text-sm font-semibold text-primary-600">{{ formatPrice(ticket.price) }}</span>
          </div>
        </div>
        
        <!-- Section droite : QR Code -->
        <div class="flex-shrink-0 ml-4">
          <div class="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-gray-200 group-hover:border-primary-200 transition-colors duration-200">
            <Qrcode variant="circle" :value="ticket.participant.qr_code" />
          </div>
          <div class="text-xs text-gray-500 text-center mt-1 font-medium">#{{ ticket.participant.qr_code }}</div>
        </div>
      </div>
    </div>
    
    <!-- Modal pour afficher les détails du ticket -->
    <Modal v-model="showModal" :title="`Ticket - ${ticket.event.name}`" class="max-w-5xl">
      <div class="space-y-1">
        <!-- En-tête stylisé avec image de fond -->
        <div v-if="ticket.event.image" class="relative  bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
          <NuxtImg
            :src="`https://api.bisoticket.com/storage/${ticket.event.image}`"
            :alt="ticket.event.name"
            class="w-full h-full aspect-video object-cover opacity-20"
            loading="eager"
            placeholder
            format="webp"
            quality="90"
            
          />
          <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-800/60 to-transparent"></div>
          <div class="absolute bottom-8 left-8 right-8">
            <h2 class="text-4xl font-bold text-white mb-3">{{ ticket.event.name }}</h2>
            <div class="flex items-center space-x-6 text-white/90">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium">{{ formatDate(ticket.event.date_time) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm font-medium">{{ ticket.event.location }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl text-center font-semibold text-gray-900 mb-2">Votre QR Code  || {{ ticket.ticket.type }} </h3>
        <div class="w-40 h-40 mx-auto">
          <Qrcode variant="circle" :value="ticket.participant.qr_code" />
        </div>
      
        
        <!-- Actions avec design amélioré -->
        <div class="flex items-center justify-center space-x-4 pt-6 border-t border-gray-100">
          <button 
            @click="downloadTicket"
            class="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger le Ticket
          </button>
          
          <button 
            @click="closeModal"
            class="inline-flex items-center px-6 py-3 text-base font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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

// Interface pour le ticket (correspondant à l'API)
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
  ticket: {
    type: string
    price: string
    devise: string
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
    // Validation des données du ticket
    if (!props.ticket) {
      throw new Error('Ticket non défini')
    }
    
    if (!props.ticket.event) {
      throw new Error('Informations de l\'événement manquantes')
    }
    
    if (!props.ticket.participant) {
      throw new Error('Informations du participant manquantes')
    }
    
    if (!props.ticket.ticket) {
      throw new Error('Type de ticket manquant')
    }
    
    if (!props.ticket.participant.qr_code) {
      throw new Error('Code QR manquant')
    }
    
    console.log('Données du ticket validées:', {
      event: props.ticket.event,
      participant: props.ticket.participant,
      ticketType: props.ticket.ticket
    })
    
    // Importer la bibliothèque QR code
    const QRCode = await import('qrcode')
    
    // Créer un canvas simple
    const scale = 2
    const baseWidth = 600
    const baseHeight = 400
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Impossible de créer le contexte 2D')
    }

    // Configuration
    canvas.width = baseWidth * scale
    canvas.height = baseHeight * scale
    ctx.imageSmoothingEnabled = true
    ctx.scale(scale, scale)

    // Dimensions
    const width = baseWidth
    const height = baseHeight

    // Couleurs simples
    const colors = {
      primary: '#8b12ff',
      white: '#FFFFFF',
      black: '#000000',
      gray: '#6B7280'
    }

    // Fond blanc
    ctx.fillStyle = colors.white
    ctx.fillRect(0, 0, width, height)

    // Bordure
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, width - 4, height - 4)

    // En-tête avec nom de l'événement
    ctx.fillStyle = colors.primary
    ctx.fillRect(0, 0, width, 80)

    // Nom de l'événement
    ctx.font = 'bold 28px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.white
    ctx.textAlign = 'center'
    
    const eventName = props.ticket.event.name
    const maxEventNameWidth = width - 40
    let displayEventName = eventName
    
    if (ctx.measureText(eventName).width > maxEventNameWidth) {
      let truncatedName = eventName
      while (ctx.measureText(truncatedName + '...').width > maxEventNameWidth) {
        truncatedName = truncatedName.slice(0, -1)
      }
      displayEventName = truncatedName + '...'
    }
    
    ctx.fillText(displayEventName, width / 2, 50)

    // Informations principales (gauche) et QR Code (droite)
    const infoStartY = 150
    const lineHeight = 40 // Plus d'espace entre les lignes
    const leftColumnX = 30
    const labelWidth = 100 // Largeur fixe pour les labels
    const dataStartX = leftColumnX + labelWidth + 20 // Espacement entre label et données

    // Lieu
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.black
    ctx.textAlign = 'left'
    ctx.fillText('📍 Lieu:', leftColumnX, infoStartY)
    
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.gray
    ctx.fillText(props.ticket.event.location, dataStartX, infoStartY)

    // Date
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.black
    ctx.fillText('📅 Date:', leftColumnX, infoStartY + lineHeight)
    
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.gray
    ctx.fillText(formatDate(props.ticket.event.date_time), dataStartX, infoStartY + lineHeight)

    // Heure
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.black
    ctx.fillText('🕐 Heure:', leftColumnX, infoStartY + lineHeight * 2)
    
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.gray
    ctx.fillText(formatTime(props.ticket.event.date_time), dataStartX, infoStartY + lineHeight * 2)

    // Type de billet
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.black
    ctx.fillText('🎫 Type:', leftColumnX, infoStartY + lineHeight * 3)
    
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.gray
    ctx.fillText(props.ticket.ticket.type, dataStartX, infoStartY + lineHeight * 3)

    // Prix
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.black
    ctx.fillText('💰 Prix:', leftColumnX, infoStartY + lineHeight * 5)
    
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillStyle = colors.gray
    ctx.fillText(formatPrice(props.ticket.price), dataStartX, infoStartY + lineHeight * 5)

    // QR Code à droite
    const qrSize = 220
    const qrX = width - qrSize - 30 // Positionné à droite
    const qrY = infoStartY + 20 // Aligné avec les informations

    // Fond du QR code
    ctx.fillStyle = colors.white
    ctx.fillRect(qrX, qrY, qrSize, qrSize)
    
    // Bordure du QR code
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 3
    ctx.strokeRect(qrX, qrY, qrSize, qrSize)

    // Numéro de ticket sous le QR code
    ctx.fillStyle = colors.gray
    ctx.font = 'bold 16px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`#${props.ticket.participant.qr_code}`, qrX + qrSize/2, qrY + qrSize + 25)

    // Générer le QR code
    try {
      const qrDataURL = await QRCode.toDataURL(props.ticket.participant.qr_code, {
        width: qrSize - 8,
        margin: 0,
        color: {
          dark: colors.black,
          light: colors.white
        }
      })
      
      const qrImage = new Image()
      qrImage.onload = () => {
        ctx.drawImage(qrImage, qrX + 4, qrY + 4, qrSize - 8, qrSize - 8)
        
        // Télécharger l'image
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png', 1.0)
        link.download = `ticket-${props.ticket.event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${props.ticket.participant.qr_code}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Émettre l'événement
        emit('download', props.ticket)
      }
      qrImage.onerror = () => {
        // Fallback si erreur QR code
        ctx.fillStyle = colors.gray
        ctx.font = 'bold 16px Inter, Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('QR CODE', qrX + qrSize/2, qrY + qrSize/2)
        
        // Télécharger quand même
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png', 1.0)
        link.download = `ticket-${props.ticket.event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${props.ticket.participant.qr_code}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        emit('download', props.ticket)
      }
      qrImage.src = qrDataURL
      
    } catch (qrError) {
      console.error('Erreur lors de la génération du QR code:', qrError)
      
      // Fallback simple
      ctx.fillStyle = colors.gray
      ctx.font = 'bold 16px Inter, Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QR CODE', qrX + qrSize/2, qrY + qrSize/2)
      
      // Télécharger
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png', 1.0)
      link.download = `ticket-${props.ticket.event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${props.ticket.participant.qr_code}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      emit('download', props.ticket)
    }

  } catch (error) {
    console.error('Erreur lors de la génération du ticket:', error)
    
    // Gestion d'erreur améliorée avec plus de détails
    let errorMessage = 'Erreur lors de la génération du ticket.'
    
    if (error instanceof Error) {
      errorMessage += ` Détails: ${error.message}`
    }
    
    // Vérifier les données du ticket
    if (!props.ticket) {
      errorMessage += ' Données du ticket manquantes.'
    } else if (!props.ticket.event) {
      errorMessage += ' Informations de l\'événement manquantes.'
    } else if (!props.ticket.participant) {
      errorMessage += ' Informations du participant manquantes.'
    } else if (!props.ticket.ticket) {
      errorMessage += ' Type de ticket manquant.'
    }
    
    console.error('Détails de l\'erreur:', {
      ticket: props.ticket,
      error: error,
      errorMessage: errorMessage
    })
    
    alert(errorMessage + ' Veuillez réessayer.')
    emit('download', props.ticket)
  }
}

// Fonctions utilitaires améliorées avec gestion d'erreur
const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return 'Date non définie'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date invalide'
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Erreur formatage date:', error)
    return 'Date invalide'
  }
}

const formatTime = (dateString: string): string => {
  try {
    if (!dateString) return 'Heure non définie'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Heure invalide'
    
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Erreur formatage heure:', error)
    return 'Heure invalide'
  }
}

const formatPrice = (price: number | string): string => {
  try {
    if (price === null || price === undefined) return 'Prix non défini'
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return 'Prix invalide'
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF'
    }).format(numPrice)
  } catch (error) {
    console.error('Erreur formatage prix:', error)
    return 'Prix invalide'
  }
}

const getStatusText = (status: string): string => {
  try {
    if (!status) return 'Statut non défini'
    
    const statusMap: Record<string, string> = {
      'confirmed': 'Confirmé',
      'pending': 'En attente',
      'cancelled': 'Annulé',
      'used': 'Utilisé',
      'expired': 'Expiré',
      'completed': 'Terminé'
    }
    return statusMap[status] || status
  } catch (error) {
    console.error('Erreur formatage statut:', error)
    return 'Statut invalide'
  }
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

/* Amélioration de l'accessibilité */
.ticket-card:focus-within {
  outline: 2px solid #8b12ff;
  outline-offset: 2px;
}

/* Animation d'entrée */
.ticket-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
