<template>
  <OrganizerNavigation>
    <div class="px-2 md:p-0 py-0s">
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

      <div v-else class="space-y-4">
        <div v-for="reservation in reservations" :key="reservation.id" class="bg-white rounded-lg border border-gray-200 p-6">
          <!-- En-tête de la réservation -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Réservation #{{ reservation.id }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ formatReservationDate(reservation.created_at) }}
              </p>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <UBadge 
                :color="getStatusColor(reservation.status) as any" 
                variant="soft"
                class="text-sm"
              >
                {{ getStatusLabel(reservation.status) }}
              </UBadge>
              <UBadge 
                v-if="reservation.payment_status"
                :color="getPaymentStatusColor(reservation.payment_status) as any" 
                variant="soft"
                class="text-sm"
              >
                {{ getPaymentStatusLabel(reservation.payment_status) }}
              </UBadge>
            </div>
          </div>

          <!-- Informations de la réservation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div v-if="reservation.total_amount" class="text-sm">
              <span class="text-gray-500">Montant:</span>
              <span class="font-medium text-gray-900 ml-2">{{ reservation.total_amount }} USD</span>
            </div>
            <div v-if="reservation.payment_reference" class="text-sm">
              <span class="text-gray-500">Référence paiement:</span>
              <span class="font-medium text-gray-900 ml-2">{{ reservation.payment_reference }}</span>
            </div>
            <div v-if="reservation.confirmed_at" class="text-sm">
              <span class="text-gray-500">Confirmée le:</span>
              <span class="font-medium text-gray-900 ml-2">{{ formatReservationDate(reservation.confirmed_at) }}</span>
            </div>
            <div v-if="reservation.cancelled_at" class="text-sm">
              <span class="text-gray-500">Annulée le:</span>
              <span class="font-medium text-gray-900 ml-2">{{ formatReservationDate(reservation.cancelled_at) }}</span>
            </div>
          </div>

          <!-- Données du formulaire -->
          <div v-if="reservation.data && Object.keys(reservation.data).length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Informations fournies:</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="(value, key) in reservation.data" :key="key" class="text-sm">
                  <span class="text-gray-500 capitalize">{{ formatFieldName(key) }}:</span>
                  <span class="font-medium text-gray-900 ml-2">{{ formatFieldValue(value) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <UButton 
              v-if="reservation.status === 'pending'"
              @click="confirmReservation(reservation.id)"
              variant="solid"
              color="success"
              size="sm"
              :loading="updatingReservation === reservation.id"
            >
              <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
              Confirmer
            </UButton>
            
            <UButton 
              v-if="reservation.status === 'pending'"
              @click="cancelReservation(reservation.id)"
              variant="solid"
              color="error"
              size="sm"
              :loading="updatingReservation === reservation.id"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
              Annuler
            </UButton>
            
            <UButton 
              @click="viewReservationDetails(reservation)"
              variant="outline"
              color="primary"
              size="sm"
            >
              <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-2" />
              Voir détails
            </UButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="mt-8 flex justify-center">
        <Pagination
          :pagination="{
            currentPage: meta.current_page,
            lastPage: meta.last_page,
            total: meta.total
          }"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Modal de détails de réservation -->
    <Modal 
      v-model="showDetailsModal" 
      title="Détails de la réservation"
      :show-close-button="true"
    >
      <div v-if="selectedReservation" class="space-y-6">
        <!-- En-tête avec statuts -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Réservation #{{ selectedReservation.id }}
          </h3>
          <div class="flex justify-center gap-2 mb-4">
            <UBadge 
              :color="getStatusColor(selectedReservation.status) as any" 
              variant="soft"
              size="lg"
            >
              {{ getStatusLabel(selectedReservation.status) }}
            </UBadge>
            <UBadge 
              v-if="selectedReservation.payment_status"
              :color="getPaymentStatusColor(selectedReservation.payment_status) as any" 
              variant="soft"
              size="lg"
            >
              {{ getPaymentStatusLabel(selectedReservation.payment_status) }}
            </UBadge>
          </div>
        </div>

        <!-- Informations essentielles -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">ID Réservation</label>
              <p class="text-gray-900 font-mono text-sm">#{{ selectedReservation.id }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">Statut</label>
              <p class="text-gray-900">{{ getStatusLabel(selectedReservation.status) }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">Date de réservation</label>
              <p class="text-gray-900">{{ formatReservationDate(selectedReservation.created_at || selectedReservation.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Données du formulaire -->
        <div v-if="selectedReservation.formData && Object.keys(selectedReservation.formData).length > 0">
          <h4 class="text-md font-semibold text-gray-900 mb-3">Informations du formulaire</h4>
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div v-for="(value, key) in selectedReservation.formData" :key="String(key)" class="flex justify-between items-start">
              <span class="font-medium text-gray-700">{{ formatFieldName(String(key)) }}:</span>
              <span class="text-gray-900 text-right max-w-xs break-words">{{ formatFieldValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Données de réservation (fallback) -->
        <div v-else-if="selectedReservation.data && Object.keys(selectedReservation.data).length > 0">
          <h4 class="text-md font-semibold text-gray-900 mb-3">Informations fournies</h4>
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div v-for="(value, key) in selectedReservation.data" :key="String(key)" class="flex justify-between items-start">
              <span class="font-medium text-gray-700">{{ formatFieldName(String(key)) }}:</span>
              <span class="text-gray-900 text-right max-w-xs break-words">{{ formatFieldValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <UButton 
            color="primary" 
            variant="solid" 
            block
            @click="showDetailsModal = false"
            class="order-2 sm:order-1"
          >
            Fermer
          </UButton>
          <UButton 
            color="neutral" 
            variant="outline" 
            block
            @click="printReservation"
            class="order-1 sm:order-2"
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

// Filtres
const selectedStatus = ref('')

// Options des filtres
const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Confirmée', value: 'confirmed' },
  { label: 'Annulée', value: 'cancelled' }
]

// Charger les réservations
const loadReservations = async () => {
  try {
    const filters: any = {
      reservation_form_id: formId,
      event_id: eventId,
      per_page: 20
    }
    
    if (selectedStatus.value) filters.status = selectedStatus.value
    
    console.log('Chargement des réservations avec filtres:', filters)
    
    const response = await fetchReservations(filters)
    reservations.value = response.data
    meta.value = response.meta
    
    console.log('Réservations chargées:', reservations.value.length)
    console.log('Filtres appliqués:', { status: selectedStatus.value })
    
    // Debug: afficher les données des réservations
    if (reservations.value.length > 0) {
      console.log('Première réservation:', reservations.value[0])
      console.log('User data:', reservations.value[0]?.user)
      console.log('Form data:', reservations.value[0]?.data)
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
  await loadReservations()
}

// Réinitialiser les filtres
const resetFilters = async () => {
  selectedStatus.value = ''
  console.log('Réinitialisation des filtres')
  await loadReservations()
}

// Changer de page
const handlePageChange = (page: number) => {
  // TODO: Implémenter la pagination
  console.log('Changer de page:', page)
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
        <div><span class="label">Date de réservation:</span> <span class="value">${formatReservationDate(reservation.created_at || reservation.createdAt)}</span></div>
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
