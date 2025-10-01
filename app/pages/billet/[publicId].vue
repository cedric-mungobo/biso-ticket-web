<template>
  <div class="min-h-screen py-14 md:py-16">
    <!-- Loading -->
    <LoadingOverlay
      :show="loading || autoDownloading"
      :title="autoDownloading ? 'Téléchargement automatique...' : 'Chargement du billet...'"
      :description="autoDownloading ? 'Votre billet est en cours de téléchargement...' : 'Veuillez patienter ...'"
      color="primary"
      :size="48"
    />
    
    <!-- Erreur -->
    <div v-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <UButton 
        @click="loadReservation"
        variant="outline"
        color="error"
      >
        <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
        Réessayer
      </UButton>
    </div>

    <!-- Billet trouvé -->
    <div v-else-if="reservation" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Informations de l'événement -->
      <UCard class="mb-8">
        <div class="flex flex-col md:flex-row gap-6">
          <div v-if="reservation.event?.imageUrl" class="md:w-1/3">
            <img
              :src="reservation.event.imageUrl"
              :alt="reservation.event.title || 'Événement'"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ reservation.event?.title }}</h1>
            <div class="space-y-2 text-sm text-gray-600">
              <div v-if="reservation.event?.location" class="flex items-center">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-2" />
                <span>{{ reservation.event.location }}</span>
              </div>
              <div v-if="reservation.event?.startsAt" class="flex items-center">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
                <span>{{ formatEventDate(reservation.event.startsAt) }}</span>
              </div>
              <div v-if="reservation.price" class="flex items-center">
                <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 mr-2" />
                <span class="font-medium">{{ reservation.price }} USD</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Informations du participant -->
      <UCard class="mb-8">
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900">Informations du participant</h2>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <p class="text-gray-900">{{ reservation.fullName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p class="text-gray-900">{{ reservation.email }}</p>
            </div>
            <div v-if="reservation.phone">
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <p class="text-gray-900">{{ reservation.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Référence</label>
              <p class="text-gray-900 font-mono">{{ reservation.publicId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <UBadge 
                :color="getStatusColor(reservation.status)"
                variant="soft"
              >
                {{ getStatusLabel(reservation.status) }}
              </UBadge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Créé le</label>
              <p class="text-gray-900">{{ formatDate(reservation.createdAt) }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- QR Code et téléchargement -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900">Votre billet</h2>
        </template>
        
        <!-- Message d'information pour le téléchargement automatique -->
        <div v-if="autoDownloading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p class="text-sm font-medium text-blue-800">Téléchargement automatique en cours...</p>
              <p class="text-xs text-blue-600">Votre billet sera téléchargé automatiquement dans quelques secondes.</p>
            </div>
          </div>
        </div>
        
        <div class="text-center space-y-6">
          <!-- QR Code -->
          <div v-if="qrCodeData" class="flex justify-center">
            <div class="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
              <QRCode 
                :data="qrCodeData" 
                :size="200"
                class="mx-auto"
              />
            </div>
          </div>
          
          <!-- Message si pas de QR Code -->
          <div v-else class="text-gray-500">
            <UIcon name="i-heroicons-qr-code" class="w-12 h-12 mx-auto mb-2" />
            <p>QR Code non disponible</p>
          </div>
          
          <!-- Instructions -->
          <div class="text-sm text-gray-600">
            <p class="mb-2">Présentez ce QR code à l'entrée de l'événement</p>
            <p class="text-xs">Référence: {{ reservation.publicId }}</p>
          </div>
          
          <!-- Bouton de téléchargement -->
          <UButton 
            v-if="qrCodeData"
            @click="downloadTicket"
            :loading="downloading"
            color="primary"
            size="lg"
            class="w-full md:w-auto"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
            Télécharger le billet
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Reservation } from '~/types/reservation'

definePageMeta({ 
  layout: 'default'
})

// Import explicite du composable pour éviter les erreurs TypeScript
const useTicketDownload = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReservationByPublicId = async (publicId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/public/reservations/${publicId}`, {
        method: 'GET'
      })
      
      const reservation = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] /public/reservations/:publicId', { publicId, raw: response, reservation })
      }

      return reservation
    } catch (err: any) {
      let errorMessage = 'Impossible de charger le billet. Veuillez réessayer.'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Billet introuvable. Vérifiez votre référence.'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
      }
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const isValidPublicId = (publicId: string): boolean => {
    return Boolean(publicId && publicId.length > 0 && /^[a-zA-Z0-9\-_]+$/.test(publicId))
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    fetchReservationByPublicId,
    isValidPublicId,
    formatDate,
    loading: readonly(loading),
    error: readonly(error)
  }
}

const route = useRoute()
const publicId = route.params.publicId as string
const autoDownload = route.query.auto !== 'false' // Par défaut true, peut être désactivé avec ?auto=false

const { 
  fetchReservationByPublicId,
  isValidPublicId,
  formatDate,
  loading,
  error
} = useTicketDownload()

const { 
  createCanvas,
  addText,
  addBlock,
  addImage,
  addQRCode,
  addImagePlaceholder,
  exportCanvas,
  isValidImageUrl
} = useCanvas()

const toast = useToast()

// État local
const reservation = ref<Reservation | null>(null)
const qrCodeData = ref<string | null>(null)
const downloading = ref(false)
const autoDownloading = ref(false)

// SEO optimisé
const pageTitle = ref('Téléchargement de billet - Biso Ticket')
const pageDescription = ref('Téléchargez votre billet de réservation')

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Biso Ticket' }
  ]
})

// Charger la réservation
const loadReservation = async () => {
  try {
    // Valider l'ID public
    if (!isValidPublicId(publicId)) {
      throw new Error('Format de référence invalide')
    }
    
    const data = await fetchReservationByPublicId(publicId)
    reservation.value = data
    
    // Extraire le QR code si disponible
    qrCodeData.value = data.qrCode || null
    
    // Mettre à jour les métadonnées SEO
    if (data.event) {
      pageTitle.value = `Billet - ${data.event.title} - Biso Ticket`
      pageDescription.value = `Billet de réservation pour ${data.event.title}`
    }
    
  } catch (err) {
    console.error('Erreur lors du chargement de la réservation:', err)
  }
}

// Formater la date de l'événement
const formatEventDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Obtenir la couleur du statut
const getStatusColor = (status: string): 'error' | 'success' | 'primary' | 'secondary' | 'neutral' | 'info' | 'warning' => {
  switch (status) {
    case 'confirmed': return 'success'
    case 'pending': return 'warning'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

// Obtenir le label du statut
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'confirmed': return 'Confirmé'
    case 'pending': return 'En attente'
    case 'cancelled': return 'Annulé'
    default: return status
  }
}

// Télécharger le billet
const downloadTicket = async () => {
  if (!qrCodeData.value || !reservation.value) return
  
  try {
    downloading.value = true
    
    // Configuration du canvas
    const scale = 2
    const width = 400
    const height = 650
    
    // Créer le canvas
    const { canvas, ctx } = createCanvas({
      width,
      height,
      scale,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 2
    })
    
    // En-tête
    addBlock(ctx, {
      x: 0,
      y: 0,
      width: width,
      height: 80,
      backgroundColor: '#8b12ff'
    }, scale)
    
    // Titre de l'événement
    addText(ctx, {
      x: width / 2,
      y: 40,
      text: reservation.value.event?.title || 'Événement',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center'
    }, scale)
    
    // Zone de l'image en carré (centrée)
    const imageSize = 120
    const imageOptions = {
      x: 20,
      y: 90,
      width: imageSize,
      height: imageSize,
      borderRadius: 15
    }
    
    // Fond de l'image
    addBlock(ctx, {
      ...imageOptions,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 2
    }, scale)
    
    // Essayer d'ajouter l'image de l'événement
    const eventImageUrl = reservation.value.event?.imageUrl
    let imageLoaded = false
    
    if (isValidImageUrl(eventImageUrl)) {
      imageLoaded = await addImage(ctx, eventImageUrl!, {
        ...imageOptions,
        maintainAspectRatio: true,
        fit: 'cover'
      }, scale)
    }
    
    // Si l'image n'a pas pu être chargée, afficher le placeholder
    if (!imageLoaded) {
      addImagePlaceholder(ctx, imageOptions.x, imageOptions.y, imageOptions.width, imageOptions.height, scale, 'Image de l\'événement')
    }
    
    // Informations du participant
    addText(ctx, {
      x: 20,
      y: 230,
      text: 'Billet de réservation',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 250,
      text: `Nom: ${reservation.value.fullName}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 270,
      text: `Email: ${reservation.value.email}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    if (reservation.value.phone) {
      addText(ctx, {
        x: 20,
        y: 290,
        text: `Téléphone: ${reservation.value.phone}`,
        fontSize: 14,
        color: '#1f2937'
      }, scale)
    }
    
    addText(ctx, {
      x: 20,
      y: 310,
      text: `Référence: ${reservation.value.publicId}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    // Date de création
    const date = new Date(reservation.value.createdAt).toLocaleDateString('fr-FR')
    addText(ctx, {
      x: 20,
      y: 330,
      text: `Créé le: ${date}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    // QR Code
    const qrOptions = {
      x: (width - 200) / 2,
      y: 360,
      size: 200,
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db',
      borderWidth: 1
    }
    
    await addQRCode(ctx, qrCodeData.value, qrOptions, scale)
    
    // Instructions
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 20,
      text: 'Présentez ce billet à l\'entrée',
      fontSize: 12,
      color: '#6b7280',
      textAlign: 'center'
    }, scale)
    
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 35,
      text: 'de l\'événement',
      fontSize: 12,
      color: '#6b7280',
      textAlign: 'center'
    }, scale)
    
    // Pied de page
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 60,
      text: 'Généré par Biso Ticket',
      fontSize: 10,
      color: '#9ca3af',
      textAlign: 'center'
    }, scale)
    
    // Attendre un peu pour s'assurer que tout est dessiné
    setTimeout(() => {
      try {
        const success = exportCanvas(canvas, `billet-${reservation.value?.publicId}.png`)
        
        if (success) {
          toast.add({
            title: 'Billet téléchargé',
            description: 'Votre billet a été téléchargé avec succès',
            color: 'success'
          })
        } else {
          throw new Error('Échec de l\'export du canvas')
        }
      } catch (exportError: any) {
        console.error('Erreur lors de l\'export du canvas:', exportError)
        
        toast.add({
          title: 'Erreur',
          description: 'Impossible de télécharger le billet',
          color: 'error'
        })
      }
    }, 500)
    
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de télécharger le billet',
      color: 'error'
    })
  } finally {
    downloading.value = false
  }
}

// Charger la réservation au montage
onMounted(async () => {
  try {
    await loadReservation()
    
    // Si la réservation est chargée avec succès et que le téléchargement automatique est activé
    if (reservation.value && qrCodeData.value && autoDownload) {
      // Attendre un peu pour que l'interface se charge
      setTimeout(async () => {
        try {
          autoDownloading.value = true
          await downloadTicket()
          
          // Afficher le message de succès après téléchargement
          toast.add({
            title: 'Billet téléchargé automatiquement',
            description: 'Votre billet a été téléchargé avec succès. Vous pouvez également le télécharger à nouveau si nécessaire.',
            color: 'success'
          })
        } catch (downloadError) {
          console.error('Erreur lors du téléchargement automatique:', downloadError)
          // Ne pas afficher d'erreur si le téléchargement automatique échoue
          // L'utilisateur peut toujours cliquer sur le bouton
        } finally {
          autoDownloading.value = false
        }
      }, 1000)
    }
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
  }
})
</script>

<style scoped>
/* Optimisations pour mobile */
@media (max-width: 640px) {
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
}

/* Styles pour le QR code */
.bg-white {
  padding: 0.5rem;
}
</style>
