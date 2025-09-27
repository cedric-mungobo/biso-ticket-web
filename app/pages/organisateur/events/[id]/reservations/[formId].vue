<template>
    <OrganizerNavigation>
      <div class="px-2 md:p-0 py-0">
        <!-- En-tête -->
      <div class="mb-6">
        <!-- Navigation de retour -->
        <div class="mb-4">
          <NuxtLink
            :to="`/organisateur/events/${eventId}`"
            class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'événement
          </NuxtLink>
        </div>
        
        <!-- Titre et informations -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Réservations - {{ formTitle }}
            </h1>
            <p class="text-gray-600">
              {{ reservations.length }} réservation(s) trouvée(s)
              <span v-if="selectedStatus" class="text-sm text-primary-600 ml-2">
                (filtrées)
              </span>
            </p>
          </div>
          
          <!-- Filtres et actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Filtre par statut -->
            <select
              v-model="selectedStatus"
              @change="applyFilters"
              class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              aria-label="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
            </select>
            
            <!-- Bouton pour réinitialiser les filtres -->
            <UButton
              v-if="selectedStatus"
              @click="resetFilters"
              variant="outline"
              color="neutral"
              size="sm"
              class="w-full sm:w-auto"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
              Réinitialiser
            </UButton>
            
            <!-- Bouton pour copier le lien public -->
            <UButton
              @click="copyPublicLink"
              variant="outline"
              color="primary"
              size="sm"
              class="w-full sm:w-auto"
            >
              <UIcon name="i-heroicons-link" class="w-4 h-4 mr-2" />
              Copier le lien public
            </UButton>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <LoadingOverlay
        :show="loading"
        title="Chargement des réservations..."
        description="Veuillez patienter ..."
        color="primary"
        :size="48"
      />

      <!-- Erreur -->
      <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 mb-6">
        {{ error }}
        <UButton 
          @click="loadReservations"
          variant="outline"
          color="error"
          size="sm"
          class="mt-2"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
          Réessayer
        </UButton>
      </div>

      <!-- Liste des réservations -->
      <div v-else-if="reservations.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
        <p class="text-gray-500">Aucune réservation n'a été trouvée pour ce formulaire.</p>
      </div>

      <div v-else class="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
        <div class="p-4">
          <div class="mb-4 flex items-center justify-between">
            <h5 class="text-slate-800 text-lg font-semibold">
              Réservations - {{ formTitle }}
            </h5>
            <span class="text-slate-600 text-sm">
              {{ reservations.length }} réservation(s)
            </span>
          </div>
          <div class="divide-y divide-slate-200">
            <div v-for="reservation in reservations" :key="reservation.id" class="flex items-center justify-between pb-3 pt-3 last:pb-0 group hover:bg-slate-50 transition-colors duration-200">
              <div class="flex items-center gap-x-3">
                <!-- Avatar avec couleur selon statut -->
                <div :class="getAvatarClasses(reservation.status)" class="relative inline-block h-5 w-5 rounded-full ring-2 ring-white shadow-sm"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h6 class="text-slate-800 font-semibold truncate">
                      {{ reservation.data?.name || reservation.data?.email || `Réservation #${reservation.id}` }}
                    </h6>
                    <UBadge 
                      :color="getStatusColor(reservation.status) as any" 
                      variant="soft"
                      size="sm"
                    >
                      {{ getStatusLabel(reservation.status) }}
                    </UBadge>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-slate-600">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                      {{ formatHumanDate(reservation.createdAt) }}
                    </span>
                    <span v-if="reservation.data?.email" class="truncate max-w-32">
                      {{ reservation.data.email }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <!-- Montant -->
                <div v-if="reservation.total_amount" class="text-right">
                  <h6 class="text-slate-600 font-medium">
                    {{ reservation.total_amount }} USD
                  </h6>
                  <p v-if="reservation.payment_status" class="text-xs text-slate-500">
                    {{ getPaymentStatusLabel(reservation.payment_status) }}
                  </p>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center gap-1">
                  <UButton 
                    v-if="reservation.status === 'pending'"
                    @click="confirmReservation(reservation.id)"
                    variant="ghost"
                    color="success"
                    size="xs"
                    :loading="updatingReservation === reservation.id"
                    class="transition-opacity"
                  >
                    <UIcon name="i-heroicons-check" class="w-3 h-3" />
                  </UButton>
                  
                  <UButton 
                    v-if="reservation.status === 'pending'"
                    @click="cancelReservation(reservation.id)"
                    variant="ghost"
                    color="error"
                    size="xs"
                    :loading="updatingReservation === reservation.id"
                    class="transition-opacity"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                  </UButton>
                  
                  <UButton 
                    @click="viewReservationDetails(reservation)"
                    variant="ghost"
                    color="primary"
                    size="xs"
                    class="transition-opacity"
                  >
                    <UIcon name="i-heroicons-eye" class="w-3 h-3" />
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="mt-8 flex justify-center">
        <Pagination
          :pagination="{
            current_page: meta.current_page,
            last_page: meta.last_page,
            total: meta.total
          }"
          @pageChange="handlePageChange"
        />
      </div>
    </div>

    <!-- Modal de détails de réservation -->
    <Modal 
      v-model="showDetailsModal" 
      title="Détails de la réservation"
      :show-close-button="true"
      class="max-h-[90vh] overflow-y-auto"
    >
      <div v-if="selectedReservation" class="space-y-4">
      

        <!-- Informations essentielles -->
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium text-gray-500">ID Réservation</label>
              <p class="text-gray-900 font-mono text-sm">#{{ selectedReservation.id }}</p>
            </div>
            
            <div>
              <label class="text-xs font-medium text-gray-500">Date de réservation</label>
              <p class="text-gray-900 text-sm">{{ formatHumanDate(selectedReservation.createdAt) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Statut</label>
              <p class="text-gray-900 text-sm">{{ getStatusLabel(selectedReservation.status) }}</p>
            </div>

          </div>
        </div>

        <!-- Données du formulaire -->
        <div v-if="selectedReservation.formData && Object.keys(selectedReservation.formData).length > 0">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Informations du formulaire</h4>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div v-for="(value, key) in selectedReservation.formData" :key="String(key)" v-if="key !== 'id' && key !== 'reservation_id'" class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <span class="text-xs font-medium text-gray-700">{{ formatFieldName(String(key)) }}:</span>
              <span class="text-sm text-gray-900 break-words">{{ formatFieldValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Données de réservation (fallback) -->
        <div v-else-if="selectedReservation.data && Object.keys(selectedReservation.data).length > 0">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Informations fournies</h4>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div v-for="(value, key) in selectedReservation.data" :key="String(key)" v-if="key !== 'id' && key !== 'reservation_id'" class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <span class="text-xs font-medium text-gray-700">{{ formatFieldName(String(key)) }}:</span>
              <span class="text-sm text-gray-900 break-words">{{ formatFieldValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col gap-2 pt-3 border-t border-gray-200">
          <UButton 
            color="primary" 
            variant="solid" 
            block
            @click="showDetailsModal = false"
            size="sm"
          >
            Fermer
          </UButton>
          <UButton 
            color="neutral" 
            variant="outline" 
            block
            @click="printReservation"
            size="sm"
          >
            <UIcon name="i-heroicons-printer" class="w-4 h-4 mr-2" />
            Imprimer
          </UButton>
        </div>
      </div>
    </Modal>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
import type { Reservation } from '~/types/reservation'
import Modal from '~/components/Modal.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)
const formId = Number(route.params.formId)

const { 
  fetchReservations, 
  updateReservationStatus,
  formatReservationDate,
  getStatusColor,
  getPaymentStatusColor,
  getStatusLabel,
  getPaymentStatusLabel,
  loading,
  error
} = useReservations()

const toast = useToast()

// État local
const reservations = ref<Reservation[]>([])
const meta = ref<any>(null)
const formTitle = ref('Formulaire de réservation')
const updatingReservation = ref<number | null>(null)
const showDetailsModal = ref(false)
const selectedReservation = ref<any>(null)

// Filtres et pagination
const selectedStatus = ref('')
const currentPage = ref(1)
const perPage = ref(20)

// Options des filtres
const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Confirmée', value: 'confirmed' },
  { label: 'Annulée', value: 'cancelled' }
]

// Charger les réservations
const loadReservations = async (page: number = currentPage.value) => {
  try {
    const filters: any = {
      reservation_form_id: formId,
      event_id: eventId,
      per_page: perPage.value,
      page: page
    }
    
    if (selectedStatus.value) filters.status = selectedStatus.value
    
    console.log('Chargement des réservations avec filtres:', filters)
    
    const response = await fetchReservations(filters)
    reservations.value = response.data
    meta.value = response.meta
    
    // Mettre à jour la page courante
    currentPage.value = page
    
    console.log('Réservations chargées:', reservations.value.length)
    console.log('Page courante:', currentPage.value)
    console.log('Filtres appliqués:', { status: selectedStatus.value })
    
    // Debug: afficher les données des réservations
    if (reservations.value.length > 0) {
      console.log('Première réservation:', reservations.value[0])
      console.log('User data:', reservations.value[0]?.user)
      console.log('Form data:', reservations.value[0]?.data)
      console.log('Date fields:', {
        createdAt: reservations.value[0]?.createdAt,
        updatedAt: reservations.value[0]?.updatedAt
      })
    }
    
    // Mettre à jour le titre si on a des réservations
    if (reservations.value.length > 0) {
      formTitle.value = reservations.value[0]?.reservation_form?.title || 'Formulaire de réservation'
    }
  } catch (err) {
    console.error('Erreur lors du chargement des réservations:', err)
  }
}

// Appliquer les filtres
const applyFilters = async () => {
  console.log('Application des filtres:', { 
    status: selectedStatus.value
  })
  // Réinitialiser à la page 1 lors du filtrage
  currentPage.value = 1
  await loadReservations(1)
}

// Réinitialiser les filtres
const resetFilters = async () => {
  selectedStatus.value = ''
  console.log('Réinitialisation des filtres')
  // Réinitialiser à la page 1
  currentPage.value = 1
  await loadReservations(1)
}

// Changer de page
const handlePageChange = async (page: number) => {
  console.log('Changer de page:', page)
  if (page >= 1 && page <= (meta.value?.last_page || 1)) {
    await loadReservations(page)
  }
}

// Confirmer une réservation
const confirmReservation = async (reservationId: number) => {
  try {
    updatingReservation.value = reservationId
    await updateReservationStatus(reservationId, 'confirmed')
    await loadReservations()
    toast.add({
      title: 'Réservation confirmée',
      description: 'La réservation a été confirmée avec succès.',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de confirmer la réservation.',
      color: 'error'
    })
  } finally {
    updatingReservation.value = null
  }
}

// Annuler une réservation
const cancelReservation = async (reservationId: number) => {
  try {
    updatingReservation.value = reservationId
    await updateReservationStatus(reservationId, 'cancelled')
    await loadReservations()
    toast.add({
      title: 'Réservation annulée',
      description: 'La réservation a été annulée avec succès.',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible d\'annuler la réservation.',
      color: 'error'
    })
  } finally {
    updatingReservation.value = null
  }
}


// Formater le nom du champ
const formatFieldName = (key: string) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Formater la valeur du champ
const formatFieldValue = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }
  if (value === null || value === undefined) {
    return 'Non spécifié'
  }
  return String(value)
}

// Formater la date de manière humaine
const formatHumanDate = (date: string | null): string => {
  if (!date) return '—'
  
  try {
    const now = new Date()
    const targetDate = new Date(date)
    
    // Vérifier si la date est valide
    if (isNaN(targetDate.getTime())) {
      return '—'
    }
    
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
    
    // Moins d'une minute
    if (diffInSeconds < 60) {
      return 'À l\'instant'
    }
    
    // Moins d'une heure
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
    }
    
    // Moins d'un jour
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    }
    
    // Moins d'une semaine
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    }
    
    // Plus d'une semaine - format complet
    return targetDate.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Erreur formatage date:', error)
    return '—'
  }
}

// Obtenir l'icône du statut
const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'confirmed': return 'i-heroicons-check-circle'
    case 'pending': return 'i-heroicons-clock'
    case 'cancelled': return 'i-heroicons-x-circle'
    default: return 'i-heroicons-question-mark-circle'
  }
}

// Obtenir l'icône du statut de paiement
const getPaymentStatusIcon = (paymentStatus: string): string => {
  switch (paymentStatus) {
    case 'paid': return 'i-heroicons-check-circle'
    case 'pending': return 'i-heroicons-clock'
    case 'failed': return 'i-heroicons-x-circle'
    case 'refunded': return 'i-heroicons-arrow-uturn-left'
    default: return 'i-heroicons-question-mark-circle'
  }
}


// Obtenir les classes CSS pour l'avatar selon le statut
const getAvatarClasses = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100'
    case 'pending':
      return 'bg-yellow-100'
    case 'cancelled':
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
}

// Obtenir les classes CSS pour le texte de l'avatar selon le statut
const getAvatarTextClasses = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'text-green-600'
    case 'pending':
      return 'text-yellow-600'
    case 'cancelled':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

// Voir les détails d'une réservation
const viewReservationDetails = (reservation: any) => {
  selectedReservation.value = reservation
  showDetailsModal.value = true
}

// Imprimer la réservation
const printReservation = () => {
  if (!selectedReservation.value) return
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  
  const reservation = selectedReservation.value
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Réservation #${reservation.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info { margin-bottom: 20px; }
        .label { font-weight: bold; color: #666; }
        .value { margin-left: 10px; }
        .form-data { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 15px; color: white; font-weight: bold; }
        .status.pending { background: #f59e0b; }
        .status.confirmed { background: #10b981; }
        .status.cancelled { background: #ef4444; }
        .status.paid { background: #10b981; }
        .status.failed { background: #ef4444; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Réservation #${reservation.id}</h1>
        <p>${reservation.reservation_form?.title || 'Formulaire de réservation'}</p>
      </div>
      
      <div class="info">
        <div><span class="label">ID Réservation:</span> <span class="value">#${reservation.id}</span></div>
        <div><span class="label">Statut:</span> <span class="value status ${reservation.status}">${getStatusLabel(reservation.status)}</span></div>
        <div><span class="label">Date de réservation:</span> <span class="value">${formatHumanDate(reservation.createdAt || reservation.created_at)}</span></div>
      </div>
      
      ${(reservation.formData && Object.keys(reservation.formData).length > 0) || (reservation.data && Object.keys(reservation.data).length > 0) ? `
        <div class="form-data">
          <h3>Informations du formulaire</h3>
          ${Object.entries(reservation.formData || reservation.data).map(([key, value]) => 
            `<div><span class="label">${formatFieldName(key)}:</span> <span class="value">${formatFieldValue(value)}</span></div>`
          ).join('')}
        </div>
      ` : ''}
      
    </body>
    </html>
  `
  
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.print()
}

// Copier le lien public du formulaire
const copyPublicLink = async () => {
  try {
    // Récupérer le slug de l'événement depuis les réservations ou l'API
    let eventSlug = reservations.value[0]?.event?.slug
    
    if (!eventSlug) {
      // Si le slug n'est pas disponible, récupérer l'événement depuis l'API
      try {
        const { $myFetch } = useNuxtApp()
        const eventResponse = await $myFetch(`/events/${eventId}`) as any
        eventSlug = eventResponse?.data?.slug || eventResponse?.slug
      } catch (apiErr) {
        console.warn('Impossible de récupérer le slug de l\'événement:', apiErr)
      }
    }
    
    // Utiliser le slug récupéré ou un fallback
    const finalEventSlug = eventSlug || 'event'
    const publicUrl = `${window.location.origin}/evenements/${finalEventSlug}/reservation/${formId}`
    
    console.log('Lien public généré:', publicUrl)
    
    // Copier dans le presse-papiers
    await navigator.clipboard.writeText(publicUrl)
    
    // Afficher une notification de succès
    toast.add({
      title: 'Lien copié',
      description: `Le lien public a été copié: ${publicUrl}`,
      color: 'success'
    })
  } catch (err) {
    console.error('Erreur lors de la copie du lien:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de copier le lien. Veuillez réessayer.',
      color: 'error'
    })
  }
}

// Watcher pour réinitialiser la pagination quand les filtres changent
watch([selectedStatus], () => {
  currentPage.value = 1
})

// Charger les réservations au montage
onMounted(() => {
  loadReservations()
})
</script>

<style scoped>
/* Optimisations pour mobile */
@media (max-width: 640px) {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .gap-4 {
    gap: 1rem;
  }
}
</style>
