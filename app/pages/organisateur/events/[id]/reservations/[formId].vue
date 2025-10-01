<template>
    <OrganizerNavigation>
      <div class="px-2 md:p-0 py-0">
        <!-- En-tête -->
        <div class="mb-4">
        <!-- Navigation de retour -->
        <div class="mb-3">
          <NuxtLink
            :to="`/organisateur/events/${eventId}`"
            class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-2"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'événement
          </NuxtLink>
        </div>
        
        <!-- Titre et informations -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 class="text-xl font-bold text-gray-900 mb-1">
              Réservations - {{ formTitle }}
            </h1>
            <p class="text-sm text-gray-600">
              {{ reservations.length }} réservation(s) trouvée(s)
              <span v-if="hasActiveFilters" class="text-primary-600 ml-2">
                (filtrées)
              </span>
            </p>
          </div>
          
          <!-- Filtres et actions -->
          <div class="flex flex-col sm:flex-row gap-2">
            <!-- Boutons d'export et lien public -->
            <div class="flex flex-wrap gap-1">
              <UButton
                @click="() => handleExport('csv')"
                variant="outline"
                color="neutral"
                size="sm"
                icon="i-heroicons-document-text"
                class="flex-shrink-0"
              >
                CSV
              </UButton>
              <UButton
                @click="() => handleExport('excel')"
                variant="outline"
                color="neutral"
                size="sm"
                icon="i-heroicons-table-cells"
                class="flex-shrink-0"
              >
                Excel
              </UButton>
              <UButton
                @click="() => handleExport('pdf')"
                variant="outline"
                color="neutral"
                size="sm"
                icon="i-heroicons-document"
                class="flex-shrink-0"
              >
                PDF
              </UButton>
              <UButton
                @click="copyPublicLink"
                variant="outline"
                color="primary"
                size="sm"
                class="flex-shrink-0"
              >
                <UIcon name="i-heroicons-link" class="w-4 h-4 mr-2" />
                Copier le lien public
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et statistiques compacts -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-4">
        <!-- Filtres organisés pour mobile -->
        <div class="space-y-3 mb-3">
          <!-- Ligne 1: Recherche (pleine largeur) -->
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Recherche</label>
            <UInput
              v-model="searchQuery"
              placeholder="Nom, email, téléphone..."
              @input="debouncedSearch"
              size="sm"
            />
          </div>
          
          <!-- Ligne 2: Statut et bouton reset -->
          <div class="flex gap-3 items-end">
            <div class="flex-1">
              <label class="block text-xs font-medium text-slate-600 mb-1">Statut</label>
            <select
              v-model="selectedStatus"
              @change="applyFilters"
                class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
                <option value="">Tous</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
            </select>
            </div>
            
            <UButton
              v-if="hasActiveFilters"
              @click="resetFilters"
              variant="ghost"
              color="neutral"
              size="sm"
              class="flex-shrink-0"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
            </UButton>
          </div>
          
          <!-- Ligne 3: Dates (2 colonnes sur mobile) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Date début</label>
              <UInput
                v-model="dateFrom"
                type="date"
                @change="applyFilters"
              size="sm"
              />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Date fin</label>
              <UInput
                v-model="dateTo"
                type="date"
                @change="applyFilters"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Statistiques compactes -->
        <div v-if="stats" class="space-y-2">
          <!-- Statistiques principales -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span class="text-slate-600">Total: <strong class="text-slate-900">{{ stats.total }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-slate-600">Confirmées: <strong class="text-slate-900">{{ stats.by_status.confirmed }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-slate-600">En attente: <strong class="text-slate-900">{{ stats.by_status.pending }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span class="text-slate-600">Annulées: <strong class="text-slate-900">{{ stats.by_status.cancelled }}</strong></span>
            </div>
          </div>
          
          <!-- Timestamp de mise à jour -->
          <div class="text-xs text-slate-500 text-center sm:text-right">
            Mis à jour: {{ lastUpdated }}
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
          @click="() => loadReservations()"
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

      <div v-else class="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg">
        <div class="p-3">
          <div class="mb-3 flex items-center justify-between">
            <h5 class="text-slate-800 text-base font-semibold">
              Réservations - {{ formTitle }}
            </h5>
            <span class="text-slate-600 text-sm">
              {{ reservations.length }} réservation(s)
            </span>
          </div>
          <div class="divide-y divide-slate-200">
            <div v-for="reservation in reservations" :key="reservation.id" class="flex items-center justify-between py-2 last:pb-0 group hover:bg-slate-50 transition-colors duration-200">
              <div class="flex items-center gap-x-3">
                <!-- Avatar avec couleur selon statut -->
                <div :class="getAvatarClasses(reservation.status)" class="relative inline-block h-5 w-5 rounded-full ring-2 ring-white shadow-sm"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h6 class="text-slate-800 font-medium text-sm truncate">
                      {{ reservation.fullName || reservation.data?.name || reservation.data?.email || `Réservation #${reservation.publicId || reservation.id}` }}
                    </h6>
                    <UBadge 
                      :color="getStatusColor(reservation.status) as any" 
                      variant="soft"
                      size="xs"
                    >
                      {{ getStatusLabel(reservation.status) }}
                    </UBadge>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-slate-500">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                      {{ formatHumanDate(reservation.createdAt || reservation.created_at || null) }}
                    </span>
                    <span v-if="reservation.email || reservation.data?.email" class="truncate max-w-24">
                      {{ reservation.email || reservation.data?.email }}
                    </span>
                    <span v-if="reservation.phone" class="truncate max-w-24">
                      {{ reservation.phone }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <!-- Montant -->
                <div v-if="reservation.price || reservation.total_amount" class="text-right text-xs">
                  <div class="text-slate-600 font-medium">
                    {{ reservation.price || reservation.total_amount }}
                    <span v-if="reservation.paymentMethod" class="text-slate-500">
                      ({{ reservation.paymentMethod }})
                    </span>
                  </div>
                  <div v-if="reservation.paymentStatus || reservation.payment_status" class="text-slate-500">
                    {{ getPaymentStatusLabel(reservation.paymentStatus || reservation.payment_status || '') }}
                  </div>
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
                    class="transition-opacity p-1"
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
                    class="transition-opacity p-1"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                  </UButton>
                  
                  <UButton 
                    @click="viewReservationDetails(reservation)"
                    variant="ghost"
                    color="primary"
                    size="xs"
                    class="transition-opacity p-1"
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
      <div v-if="meta && meta.last_page > 1" class="mt-4 flex justify-center">
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
              <p class="text-gray-900 text-sm">{{ formatHumanDate(selectedReservation.created_at) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Statut</label>
              <p class="text-gray-900 text-sm">{{ getStatusLabel(selectedReservation.status) }}</p>
            </div>

          </div>
        </div>

        <!-- Données du formulaire -->
        <div v-if="(selectedReservation.formData && Object.keys(selectedReservation.formData).length > 0) || (selectedReservation.data && Object.keys(selectedReservation.data).length > 0)">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Informations du formulaire</h4>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <template v-for="(value, fieldKey) in (selectedReservation.formData || selectedReservation.data)" :key="String(fieldKey)">
              <div v-if="String(fieldKey) !== 'id' && String(fieldKey) !== 'reservation_id'" class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span class="text-xs font-medium text-gray-700">{{ formatFieldName(String(fieldKey)) }}:</span>
                <span class="text-sm text-gray-900 break-words">{{ formatFieldValue(value) }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Données de réservation (fallback) -->
        <div v-else-if="selectedReservation.data && Object.keys(selectedReservation.data).length > 0">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Informations fournies</h4>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <template v-for="(value, fieldKey) in selectedReservation.data" :key="String(fieldKey)">
              <div v-if="String(fieldKey) !== 'id' && String(fieldKey) !== 'reservation_id'" class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span class="text-xs font-medium text-gray-700">{{ formatFieldName(String(fieldKey)) }}:</span>
                <span class="text-sm text-gray-900 break-words">{{ formatFieldValue(value) }}</span>
              </div>
            </template>
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
import type { Reservation, ReservationStats } from '~/types/reservation'
import Modal from '~/components/Modal.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)
const formId = Number(route.params.formId)

const { 
  fetchReservations, 
  updateReservationStatus,
  exportReservations,
  loading,
  error
} = useReservations()

// État local pour les données
const reservations = ref<Reservation[]>([])
const stats = ref<ReservationStats | null>(null)

const toast = useToast()

// Fonctions utilitaires pour l'affichage
const formatReservationDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green'
    case 'pending': return 'yellow'
    case 'cancelled': return 'red'
    default: return 'gray'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmé'
    case 'pending': return 'En attente'
    case 'cancelled': return 'Annulé'
    default: return status
  }
}

const getPaymentStatusColor = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'paid': return 'green'
    case 'pending': return 'yellow'
    case 'failed': return 'red'
    default: return 'gray'
  }
}

const getPaymentStatusLabel = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'paid': return 'Payé'
    case 'pending': return 'En attente'
    case 'failed': return 'Échec'
    default: return paymentStatus
  }
}

// État local
const meta = ref<any>(null)
const formTitle = ref('Formulaire de réservation')
const updatingReservation = ref<number | null>(null)
const showDetailsModal = ref(false)
const selectedReservation = ref<any>(null)
const lastUpdated = ref('')

// Filtres et pagination
const selectedStatus = ref('')
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const perPage = ref(20)

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Options des filtres supprimées - maintenant intégrées dans le select natif

// Computed pour vérifier si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return selectedStatus.value || searchQuery.value || dateFrom.value || dateTo.value
})


// Charger les réservations
const loadReservations = async (page: number = currentPage.value) => {
  try {
    const filters: any = {
      reservation_form_id: formId,
      event_id: eventId,
      per_page: perPage.value,
      page: page
    }
    
    // Appliquer les filtres
    if (selectedStatus.value) filters.status = selectedStatus.value
    if (searchQuery.value) filters.search = searchQuery.value
    if (dateFrom.value) filters.date_from = dateFrom.value
    if (dateTo.value) filters.date_to = dateTo.value
    
    
    const response = await fetchReservations(filters)
    
    // Mettre à jour les données locales
    reservations.value = response.data
    stats.value = response.stats
    meta.value = response.meta
    
    // Mettre à jour la page courante et la date de dernière mise à jour
    currentPage.value = page
    lastUpdated.value = new Date().toLocaleString('fr-FR')
    
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
  // Réinitialiser à la page 1 lors du filtrage
  currentPage.value = 1
  await loadReservations(1)
}

// Réinitialiser les filtres
const resetFilters = async () => {
  selectedStatus.value = ''
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
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
    
    // Mettre à jour localement
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      reservation.status = 'confirmed'
    }
    
    // Recharger les données pour mettre à jour les stats
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
    
    // Mettre à jour localement
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      reservation.status = 'cancelled'
    }
    
    // Recharger les données pour mettre à jour les stats
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

// Export côté client (fallback pour CSV)
const exportClientSide = async (format: 'csv' | 'excel' | 'pdf') => {
  try {
    if (reservations.value.length === 0) {
      toast.add({
        title: 'Aucune donnée',
        description: 'Aucune réservation à exporter',
        color: 'warning'
      })
      return
    }
    
    if (format === 'csv') {
      // Créer le contenu CSV
      const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Statut', 'Date de création', 'Événement']
      const csvContent = [
        headers.join(','),
        ...reservations.value.map(reservation => [
          reservation.id,
          `"${reservation.fullName || reservation.data?.name || ''}"`,
          `"${reservation.email || reservation.data?.email || ''}"`,
          `"${reservation.phone || ''}"`,
          `"${reservation.status}"`,
          `"${reservation.createdAt || reservation.created_at || ''}"`,
          `"${reservation.event?.title || ''}"`
        ].join(','))
      ].join('\n')
      
      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.add({
        title: 'Export réussi',
        description: 'Fichier CSV généré',
        color: 'success'
      })
    } else {
      // Pour Excel et PDF, utiliser l'API serveur
      await exportReservations(format, {
        reservation_form_id: formId,
        event_id: eventId,
        status: selectedStatus.value as 'pending' | 'confirmed' | 'cancelled' | undefined,
        search: searchQuery.value,
        date_from: dateFrom.value,
        date_to: dateTo.value
      })
    }
    
  } catch (err: any) {
    console.error('Erreur export:', err)
    toast.add({
      title: 'Erreur d\'export',
      description: err.message || 'Impossible d\'exporter les réservations',
      color: 'error'
    })
  }
}

// Gérer l'export des réservations
const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
  try {
    // Pour CSV, utiliser l'export côté client
    if (format === 'csv') {
      await exportClientSide('csv')
    } else {
      // Pour Excel et PDF, utiliser l'API serveur
      const filters: any = {
        reservation_form_id: formId,
        event_id: eventId
      }
      
      // Appliquer les filtres actifs
      if (selectedStatus.value) filters.status = selectedStatus.value
      if (searchQuery.value) filters.search = searchQuery.value
      if (dateFrom.value) filters.date_from = dateFrom.value
      if (dateTo.value) filters.date_to = dateTo.value
      
      // Afficher un toast de chargement
      toast.add({
        title: 'Export en cours...',
        description: `Génération du fichier ${format.toUpperCase()}`,
        color: 'primary'
      })
      
      await exportReservations(format, filters)
      
      toast.add({
        title: 'Export réussi',
        description: `Fichier ${format.toUpperCase()} téléchargé`,
        color: 'success'
      })
    }
  } catch (err: any) {
    console.error('Erreur lors de l\'export:', err)
    toast.add({
      title: 'Erreur d\'export',
      description: err.message || 'Impossible d\'exporter les réservations',
      color: 'error'
    })
  }
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
watch([selectedStatus, searchQuery, dateFrom, dateTo], () => {
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
