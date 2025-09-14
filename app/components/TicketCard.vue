<template>
  <div class="relative bg-black text-white rounded-lg overflow-hidden shadow-2xl w-full ticket-card">
    <div class="p-6 relative ticket-main">
      <div class="text-center mb-6">
        <h2 class="text-4xl font-black text-white mb-2 ticket-title">TICKET</h2>
        <p class="text-base font-semibold text-white mt-2 text-center event-title">{{ event.title }}</p>
      </div>

      <div class="flex justify-between items-center gap-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div class="bg-white text-black px-4 py-3 rounded text-sm font-bold text-center date-box">{{ formatDate(event.startsAt) }}</div>
            <div class="bg-white text-black px-4 py-3 rounded text-sm font-bold text-center time-box">{{ formatTime(event.startsAt) }}</div>
          </div>
          
          <div class="flex flex-col gap-1">
            <div class="flex gap-4 text-xs text-red-500 font-medium">
              <span class="block">TYPE</span>
              <span class="block">PRIX</span>
            </div>
            <div class="flex gap-4 text-2xl font-black text-white">
              <span class="block">{{ ticket.name }}</span>
              <span class="block">{{ ticket.price }} {{ ticket.currency }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-center">
          <div v-if="qrCode" class="bg-white p-4 rounded-lg border-4 border-white shadow-lg qr-container">
            <div class="qr-code-wrapper">
              <Qrcode 
                :value="qrCode" 
                :size="160"
                :margin="3"
                :color="{ dark: '#000000', light: '#FFFFFF' }"
                :error-correction-level="'H'"
              />
            </div>
            <!-- Fallback QR code -->
            <div v-if="qrCode" class="qr-fallback">
              <div class="text-xs text-gray-600 text-center">QR: {{ qrCode.substring(0, 20) }}...</div>
            </div>
          </div>
          <div v-else class="bg-gray-300 w-40 h-40 rounded-lg flex items-center justify-center border-4 border-white shadow-lg">
            <div class="text-xs text-gray-600 text-center">QR code indisponible</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="absolute right-0 top-0 bottom-0 w-20 bg-black border-l-2 border-dashed border-white ticket-stub">
      <div class="flex flex-col items-center gap-4 stub-content">
        <div class="text-white font-bold text-sm admit-text">ADMIT ONE</div>
        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-1 text-xs text-red-500 font-medium">
            <span class="block">TYPE</span>
            <span class="block">PRIX</span>
          </div>
          <div class="flex flex-col gap-1 text-lg font-black text-white">
            <span class="block">{{ ticket.name }}</span>
            <span class="block">{{ ticket.price }}</span>
          </div>
        </div>
      </div>
    </div>
        
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <UButton 
        v-if="qrCode" 
        size="xs" 
        color="neutral" 
        variant="soft" 
        @click="downloadQr"
        class="bg-white text-black hover:bg-gray-100 font-medium download-btn"
      >
        <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-1" />
        Télécharger
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

interface Props {
  event: {
    title: string
    startsAt: string
    imageUrl?: string | null
  }
  ticket: {
    id: number
    name: string
    price: number
    currency: string
  }
  qrCode?: string
  quantity: number
  createdAt: string
}

const props = defineProps<Props>()

// Debug pour vérifier le QR code
onMounted(() => {
  console.log('QR Code value:', props.qrCode)
  console.log('QR Code type:', typeof props.qrCode)
})

// Les informations du ticket sont maintenant affichées directement depuis les props

// Formatage des dates
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

// Téléchargement du QR code
const downloadQr = async () => {
  if (!props.qrCode) return
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(props.qrCode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    const link = document.createElement('a')
    link.href = qrCodeDataUrl
    link.download = `billet-${props.event.title}-${props.ticket.name}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erreur lors du téléchargement du QR Code:', error)
  }
}
</script>

<style scoped>
.ticket-card {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  transform: perspective(1000px) rotateX(5deg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticket-card:hover {
  transform: perspective(1000px) rotateX(0deg) translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.ticket-main {
  min-height: 280px;
}

.ticket-title {
  letter-spacing: 0.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}


.event-title {
  opacity: 0.9;
}

.date-box, .time-box {
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.qr-container {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  background: #ffffff;
}

.qr-code-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.qr-code-wrapper canvas {
  display: block !important;
  max-width: 100%;
  height: auto;
}

/* Section talon (stub) */
.ticket-stub {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stub-content {
  transform: rotate(90deg);
  white-space: nowrap;
}

.admit-text {
  letter-spacing: 0.1em;
}

.download-btn {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes ticketFloat {
  0%, 100% {
    transform: perspective(1000px) rotateX(5deg) translateY(0);
  }
  50% {
    transform: perspective(1000px) rotateX(5deg) translateY(-4px);
  }
}

.ticket-card {
  animation: ticketFloat 6s ease-in-out infinite;
}

.ticket-card:hover {
  animation: none;
}

/* Responsive */
@media (max-width: 640px) {
  .ticket-card {
    transform: perspective(1000px) rotateX(2deg);
  }
  
  .ticket-main {
    min-height: 240px;
  }
  
  .qr-container {
    min-width: 140px;
    min-height: 140px;
  }
}

/* Effet de brillance */
.ticket-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.ticket-card:hover::before {
  left: 100%;
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .ticket-card {
    animation: none;
    transform: none;
  }
  
  .ticket-card:hover {
    transform: translateY(-4px);
  }
}
</style>