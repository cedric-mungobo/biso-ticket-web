<template>
  <OrganizerNavigation>
    <div class=" p-2 md:p-0">
    <div class="">
        <!-- En-tête responsive -->
        <div class="">
          <!-- Navigation de retour -->
          <div class="mb-2">
            <NuxtLink
              to="/organisateur/my-events"
              class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à mes événements
            </NuxtLink>
            
            <!-- Titre responsive -->
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {{ event?.name || (pageLoading ? 'Chargement...' : '—') }}
            </h1>
          </div>

          <!-- Bannière d'alerte pour événement non approuvé -->

          <EventApprovalBanner 
          class="mb-2"
            :event="event" 
            :is-event-approved="isEventApproved" 
          />
          
          <!-- Boutons d'action responsive -->
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 ">
            <!-- Boutons principaux -->
            <template v-for="button in actionButtons" :key="button.id">
              <UButton 
                v-if="!button.condition || button.condition()"
                :to="button.to"
                @click="button.action && button.action()"
                :variant="button.variant"
                :size="button.size"
                :color="button.color"
                :class="button.class"
                :ui="button.ui"
              >
                <UIcon :name="button.icon" class="w-4 h-4 mr-2" /> 
                <span>{{ button.label }}</span>
              </UButton>
            </template>
            <!-- Clé de scan et ID public harmonisés -->
            <div v-if="event?.settings?.scanSecret || event?.publicId" class="col-span-2 lg:col-span-1 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <!-- Clé de scan -->
              <div v-if="event?.settings?.scanSecret" class="flex items-center gap-2 w-full">
                <span class="text-xs sm:text-sm text-gray-700 whitespace-nowrap font-medium">Clé de scan:</span>
                <div class="flex items-center gap-0 flex-1">
                  <input
                    :value="displayedScanSecret"
                    class="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm bg-white text-gray-900 flex-1 md:w-24 min-w-0"
                    readonly
                  />
                  <UButton
                    variant="ghost"
                    size="xs"
                    @click="showScanSecret = !showScanSecret"
                    :title="showScanSecret ? 'Masquer' : 'Afficher'"
                    class="min-h-[32px] min-w-[32px] p-1 "
                  >
                    <UIcon :name="showScanSecret ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                  </UButton>
                  <UButton 
                    variant="ghost" 
                    size="xs" 
                    @click="copyScanSecret" 
                    title="Copier" 
                    class="min-h-[32px] min-w-[32px] p-1 "
                  >
                    <UIcon name="i-heroicons-clipboard" class="w-4 h-4" />
                  </UButton>
                </div>
              </div>

              <!-- ID public -->
              <div v-if="event?.publicId" class="flex items-center gap-2 w-full">
                <span class="text-xs sm:text-sm text-gray-700 whitespace-nowrap font-medium">ID public:</span>
                <div class="flex items-center gap-0 flex-1">
                  <input
                    :value="displayedPublicId"
                    class="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm bg-white text-gray-900 flex-1 min-w-0"
                    readonly
                  />
                  <UButton
                    variant="ghost"
                    size="xs"
                    @click="showPublicId = !showPublicId"
                    :title="showPublicId ? 'Masquer' : 'Afficher'"
                    class="min-h-[32px] min-w-[32px] p-1 -ml-1"
                  >
                    <UIcon :name="showPublicId ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                  </UButton>
                  <UButton 
                    variant="ghost" 
                    size="xs" 
                    @click="copyPublicId" 
                    title="Copier" 
                    class="min-h-[32px] min-w-[32px] p-1 -ml-2"
                  >
                    <UIcon name="i-heroicons-clipboard" class="w-4 h-4" />
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <LoadingOverlay
          :show="pageLoading"
          title="Chargement de l'événement..."
          description="Veuillez patienter ..."
          color="primary"
          :size="48"
        />
            
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 mr-2" />
            <span>Impossible de charger l'événement. Veuillez réessayer.</span>
          </div>
        </div>

        <div v-else-if="event" class="space-y-6 py-2">
       

          <UCard class="overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <!-- Image à gauche -->
              <div class="relative min-h-96 lg:h-full">
                <img
                  v-if="event?.image_url || event?.image"
                  :src="event?.image_url || event?.image"
                  :alt="event?.name"
                  class="w-full h-full min-h-96 lg:h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
                </div>
              </div>

              <!-- Informations à droite -->
              <div class="p-6 space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900">{{ event?.name }}</h2>
                    <div class="mt-1 text-gray-600">{{ event?.location }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <UBadge :color="statusColor" variant="soft" class="capitalize">{{ event?.status }}</UBadge>
                    <UBadge v-if="event?.is_public" color="info" variant="soft">public</UBadge>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <p class="text-sm text-gray-500">Date</p>
                    <p class="text-gray-800">{{ formatDate(event?.date_time || '') }}</p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-sm text-gray-500">Lieu</p>
                    <p class="text-gray-800 line-clamp-1">{{ event?.location || '—' }}</p>
                  </div>
                </div>
                
                <div class="pt-4">
                  <p class="text-sm text-gray-500 mb-2">Aperçu</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ event?.description || 'Aucune description fournie.' }}</p>
                </div>
              </div>
            </div>
          </UCard>

          

      
                  </div>
                </div>
        

      <!-- Modals -->
      <Modal v-model="showTicketsList" title="Liste des tickets" class="modal-mobile-optimized">
        <div class="modal-content-mobile">
          <!-- Bouton Ajouter un ticket -->
          <div class="mb-4 flex justify-end">
            <UButton 
              @click="openCreateTicket"
              variant="solid"
              color="success"
              size="sm"
              class="shadow-sm"
            >
              <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
              Ajouter un ticket
            </UButton>
          </div>

          <div v-if="ticketsLoading" class="space-y-3">
            <USkeleton class="h-16 w-full" />
            <USkeleton class="h-16 w-full" />
            <USkeleton class="h-16 w-2/3" />
          </div>
          <div v-else-if="!tickets || tickets.length === 0" class="text-center py-6">
            <UIcon name="i-heroicons-ticket" class="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p class="text-sm text-gray-500">Aucun ticket configuré.</p>
            <UButton 
              @click="openCreateTicket"
              variant="solid"
              color="success"
              size="sm"
              class="mt-4"
            >
              <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
              Créer votre premier ticket
            </UButton>
          </div>
          <div v-else class="space-y-3">
            <div v-for="t in tickets" :key="t.id" class="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <!-- Informations du ticket -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 sm:mb-0">
                <span class="text-sm font-medium text-gray-900">{{ t.type }}</span>
                <div class="flex items-center gap-2">
                  <UBadge variant="soft" class="text-xs">{{ t.quantity }} dispo</UBadge>
                  <span class="text-sm font-semibold text-gray-700">{{ t.price }} {{ t.devise || 'USD' }}</span>
                </div>
              </div>
              
              <!-- Actions du ticket -->
              <div class="flex items-center gap-1 sm:gap-2">
                <UButton 
                  size="xs" 
                  variant="ghost" 
                  color="primary" 
                  @click="openViewTicket(t)"
                  class="min-h-[36px] min-w-[36px]"
                  :ui="{ base: 'touch-manipulation' }"
                >
                  <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                </UButton>
                <UButton 
                  size="xs" 
                  variant="ghost" 
                  color="warning" 
                  @click="openEditTicket(t)"
                  class="min-h-[36px] min-w-[36px]"
                  :ui="{ base: 'touch-manipulation' }"
                >
                  <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                </UButton>
                <UButton 
                  size="xs" 
                  variant="ghost" 
                  color="error" 
                  @click="openDeleteTicket(t)"
                  class="min-h-[36px] min-w-[36px]"
                  :ui="{ base: 'touch-manipulation' }"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      <Modal v-model="showTicketCreate" title="Ajouter un ticket" class="modal-mobile-optimized">
        <div class="modal-content-mobile">
          <TicketForm v-model="ticketForm" :submitting="ticketSubmitting" submit-label="Ajouter" @cancel="showTicketCreate=false" @submit="handleCreateTicket" />
        </div>
      </Modal>
      <Modal v-model="showTicketEdit" title="Éditer le ticket" class="modal-mobile-optimized">
        <div class="modal-content-mobile">
          <TicketForm v-model="ticketForm" :submitting="ticketSubmitting" submit-label="Enregistrer" @cancel="showTicketEdit=false" @submit="handleUpdateTicket" />
        </div>
      </Modal>
      <Modal v-model="showTicketDelete" title="Supprimer le ticket" class="modal-mobile-optimized">
        <div class="modal-content-mobile">
          <p class="text-sm text-gray-600">Confirmer la suppression du ticket "{{ currentTicket?.type }}" ?</p>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showTicketDelete=false">Annuler</UButton>
          <UButton color="error" :loading="ticketSubmitting" @click="handleDeleteTicket">Supprimer</UButton>
        </template>
      </Modal>

      <!-- Composant des formulaires de réservation -->
      <ReservationFormList
        :event-id="eventId"
        v-model:show="showReservationFormsList"
        @create-form="openCreateReservationForm"
        @view-form="openViewReservationForm"
        @edit-form="openEditReservationForm"
        @delete-form="openDeleteReservationForm"
      />

      <!-- Modal Liste des sponsors -->
      <Modal v-model="showSponsorsList" title="Mes sponsors">
        <div class="modal-content-mobile">
          <SponsorList
            :sponsors="sponsors"
            :loading="sponsorsLoading"
            @add-sponsor="openAddSponsor"
            @view-sponsor="openEditSponsor"
            @edit-sponsor="openEditSponsor"
            @delete-sponsor="openDeleteSponsor"
          />
        </div>
      </Modal>

      <!-- Modal Création sponsor -->
      <Modal v-model="showSponsorCreate" title="Ajouter un sponsor">
        <div class="modal-content-mobile">
          <SponsorForm
            v-model="sponsorForm"
            :submitting="sponsorsSubmitting"
            submit-label="Ajouter"
            @cancel="showSponsorCreate=false"
            @submit="handleCreateSponsor"
          />
        </div>
      </Modal>

      <!-- Modal Édition sponsor -->
      <Modal v-model="showSponsorEdit" title="Modifier le sponsor">
        <div class="modal-content-mobile">
          <SponsorForm
            v-model="sponsorForm"
            :submitting="sponsorsSubmitting"
            submit-label="Enregistrer"
            @cancel="showSponsorEdit=false"
            @submit="handleUpdateSponsor"
          />
        </div>
      </Modal>

      <!-- Modal Suppression sponsor -->
      <Modal v-model="showSponsorDelete" title="Supprimer le sponsor">
        <div class="modal-content-mobile">
          <p class="text-sm text-gray-600">
            Confirmer la suppression du sponsor "{{ currentSponsor?.name }}" ?
          </p>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showSponsorDelete=false">Annuler</UButton>
          <UButton color="error" :loading="sponsorsSubmitting" @click="handleDeleteSponsor">Supprimer</UButton>
        </template>
      </Modal>

    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// @ts-nocheck
import TicketForm from '~/components/organizer/forms/TicketForm.vue'
import LoadingOverlay from '~/components/LoadingOverlay.vue'
import ReservationFormList from '~/components/organizer/ReservationFormList.vue'
import SponsorList from '~/components/organizer/SponsorList.vue'
import SponsorForm from '~/components/organizer/forms/SponsorForm.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)

const { fetchEventWithState, fetchEventTickets, updateTicket, deleteTicket, currentEvent, formatDate, loading, error } = useOrganizerEvents()
const { isLoading, withLoading, preventMultipleSubmissions } = useLoading()
const { fetchSponsors, createSponsor, createSponsorWithLogo, updateSponsor, deleteSponsor } = useSponsors()
// Plus besoin du composable useReservationForms ici, il est maintenant dans le composant

const event = computed(() => currentEvent.value)
const toast = useToast()

const statusColor = computed(() => {
  const s = event.value?.status
  if (s === 'active') return 'success'
  if (s === 'draft') return 'warning'
  if (s === 'ended') return 'neutral'
  return 'primary'
})

const publicUrl = computed(() => `/evenements/${event.value?.slug || eventId}`)
const ordersUrl = computed(() => `/organisateur/events/${eventId}/orders`)
const reportsUrl = computed(() => `/organisateur/events/${eventId}/reports`)
const invitationsUrl = computed(() => `/organisateur/events/${eventId}/invitations`)

// Configuration des boutons d'action
const actionButtons = computed(() => [
  {
    id: 'tickets',
    label: 'Mes tickets',
    icon: 'i-heroicons-ticket',
    variant: 'soft',
    size: 'md',
    color: 'primary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => { showTicketsList.value = true }
  },
  {
    id: 'invitations',
    label: 'Mes invités',
    icon: 'i-heroicons-envelope',
    variant: 'soft',
    size: 'md',
    color: 'secondary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    to: invitationsUrl.value,
    action: null
  },
  {
    id: 'orders',
    label: 'Rapports de ventes',
    icon: 'i-heroicons-clipboard-document-list',
    variant: 'soft',
    size: 'md',
    color: 'secondary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => openOrders()
  },
  {
    id: 'reports',
    label: 'Rapport de l\'événement',
    icon: 'i-heroicons-chart-bar',
    variant: 'soft',
    size: 'md',
    color: 'neutral',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    to: reportsUrl.value,
    action: null
  },
  {
    id: 'reservation-forms',
    label: 'Formulaires de réservation',
    icon: 'i-heroicons-document-text',
    variant: 'soft',
    size: 'md',
    color: 'primary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => { 
      showReservationFormsList.value = true 
    }
  },
  {
    id: 'sponsors',
    label: 'Mes sponsors',
    icon: 'i-heroicons-building-office',
    variant: 'soft',
    size: 'md',
    color: 'info',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => { 
      showSponsorsList.value = true 
    }
  },
 
 
])

const { pending } = await useAsyncData(`organizer-event-${eventId}`, async () => {
  await fetchEventWithState(eventId)
  
  // Debug : afficher la structure complète de l'événement pour identifier les champs d'approbation
  if (process.client && process.dev && currentEvent.value) {
    // Logs de debug masqués en production
    console.log('[DEBUG] Événement chargé:', currentEvent.value.id)
  }
  
  return currentEvent.value
})
const pageLoading = computed(() => loading.value || pending.value)

const tickets = ref<any[]>([])
const { pending: ticketsPending, refresh: refreshTickets } = await useAsyncData(`organizer-event-tickets-${eventId}`, async () => {
  const list = await fetchEventTickets(eventId)
  tickets.value = list
  return list
})
const ticketsLoading = computed(() => ticketsPending.value)

// Chargement des sponsors de l'organisateur
const { pending: sponsorsPending, refresh: refreshSponsors } = await useAsyncData(`organizer-sponsors-${eventId}`, async () => {
  const sponsorsList = await fetchSponsors({ is_active: true })
  sponsors.value = sponsorsList
  return sponsorsList
})
const sponsorsLoading = computed(() => sponsorsPending.value)


// La logique des formulaires de réservation est maintenant dans le composant ReservationFormList

const showTicketView = ref(false)
const showTicketCreate = ref(false)
const showTicketEdit = ref(false)
const showTicketDelete = ref(false)
const showTicketsList = ref(false)
const showReservationFormsList = ref(false)
const showSponsorsList = ref(false)
const showSponsorCreate = ref(false)
const showSponsorEdit = ref(false)
const showSponsorDelete = ref(false)
const showScanSecret = ref(false)
const showPublicId = ref(false)

const currentTicket = ref<any>(null)
const ticketForm = ref<any>({ type: '', price: 0, quantity: 1, devise: 'USD' })

// Variables pour les sponsors
const sponsors = ref<any[]>([])
const currentSponsor = ref<any>(null)
const sponsorForm = ref<any>({ name: '', logo_url: '', website_url: '', description: '', is_active: true })
const sponsorsSubmitting = ref(false)



const getApiErrorMessage = (err: any): string => {
  const response = err?.response
  const data = response?._data || response?.data
  if (data?.message) return String(data.message)
  if (data?.errors) {
    if (Array.isArray(data.errors)) return data.errors.join(', ')
    const values = Object.values(data.errors as Record<string, any>)
    const flat = ([] as any[]).concat(...values as any)
    if (flat.length) return String(flat[0])
  }
  return String(err?.message || 'Erreur inattendue')
}

const displayedScanSecret = computed(() => {
  const raw = event.value?.settings?.scanSecret || ''
  if (showScanSecret.value) return raw
  if (!raw) return ''
  // masquer tout sauf les 2 dernières chars
  const maskLen = Math.max(0, raw.length - 2)
  return `${'•'.repeat(maskLen)}${raw.slice(-2)}`
})

const displayedPublicId = computed(() => {
  const raw = event.value?.publicId || ''
  if (showPublicId.value) return raw
  if (!raw) return ''
  const maskLen = Math.max(0, raw.length - 2)
  return `${'•'.repeat(maskLen)}${raw.slice(-2)}`
})

const copyScanSecret = async () => {
  try {
    const raw = String(event.value?.settings?.scanSecret || '')
    if (!raw) return
    await navigator.clipboard.writeText(raw)
    useToast().add({ title: 'Copié', description: 'Clé de scan copiée.', color: 'success' })
  } catch {
    useToast().add({ title: 'Impossible de copier', color: 'error' })
  }
}

const copyPublicId = async () => {
  try {
    const raw = String(event.value?.publicId || '')
    if (!raw) return
    await navigator.clipboard.writeText(raw)
    useToast().add({ title: 'Copié', description: 'ID public copié.', color: 'success' })
  } catch {
    useToast().add({ title: 'Impossible de copier', color: 'error' })
  }
}

const openViewTicket = (t: any) => {
  // Vue individuelle supprimée, on ouvre directement l'édition
  openEditTicket(t)
}

const openCreateTicket = () => {
  ticketForm.value = { type: '', price: 0, quantity: 1, devise: 'USD' }
  showTicketCreate.value = true
}

const openEditTicket = (t: any) => {
  currentTicket.value = t
  ticketForm.value = { ...t }
  showTicketsList.value = false
  showTicketEdit.value = true
}

const openDeleteTicket = (t: any) => {
  currentTicket.value = t
  showTicketsList.value = false
  showTicketDelete.value = true
}


const openOrders = () => {
  navigateTo(ordersUrl.value)
}

// Fonctions pour les formulaires de réservation
const openCreateReservationForm = () => {
  // TODO: Implémenter la création de formulaire
  useAppToast().showInfo('Fonctionnalité à venir', 'La création de formulaires de réservation sera bientôt disponible.')
}

const openViewReservationForm = (form: any) => {
  // TODO: Implémenter la vue du formulaire
  useAppToast().showInfo('Fonctionnalité à venir', 'La visualisation des formulaires de réservation sera bientôt disponible.')
}

const openEditReservationForm = (form: any) => {
  // TODO: Implémenter l'édition du formulaire
  useAppToast().showInfo('Fonctionnalité à venir', 'L\'édition des formulaires de réservation sera bientôt disponible.')
}

const openDeleteReservationForm = (form: any) => {
  // TODO: Implémenter la suppression du formulaire
  useAppToast().showInfo('Fonctionnalité à venir', 'La suppression des formulaires de réservation sera bientôt disponible.')
}

// Fonctions pour les sponsors
const openAddSponsor = () => {
  sponsorForm.value = { name: '', logo_url: '', website_url: '', description: '', is_active: true }
  showSponsorCreate.value = true
}

const openEditSponsor = (sponsor: any) => {
  currentSponsor.value = sponsor
  sponsorForm.value = { ...sponsor }
  showSponsorsList.value = false
  showSponsorEdit.value = true
}

const openDeleteSponsor = (sponsor: any) => {
  currentSponsor.value = sponsor
  showSponsorsList.value = false
  showSponsorDelete.value = true
}

const handleCreateSponsor = async (payload: any) => {
  try {
    sponsorsSubmitting.value = true
    
    // Si il y a un logo, créer FormData, sinon envoyer JSON
    if (payload.logo) {
      const formData = new FormData()
      formData.append('name', payload.name)
      formData.append('website_url', payload.website_url || '')
      formData.append('description', payload.description || '')
      formData.append('is_active', payload.is_active ? '1' : '0') // Convertir boolean en string
      formData.append('logo', payload.logo)
      await createSponsorWithLogo(formData)
    } else {
      // Envoyer JSON sans logo
      const { createSponsor } = useSponsors()
      await createSponsor(payload)
    }
    
    showSponsorCreate.value = false
    await refreshSponsors()
    useAppToast().showSuccess('Sponsor ajouté', 'Le sponsor a été créé avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la création du sponsor', getApiErrorMessage(e))
  } finally {
    sponsorsSubmitting.value = false
  }
}

const handleUpdateSponsor = async (payload: any) => {
  if (!currentSponsor.value) return
  try {
    sponsorsSubmitting.value = true
    
    // Si il y a un logo, créer FormData, sinon envoyer JSON
    if (payload.logo) {
      const formData = new FormData()
      formData.append('name', payload.name)
      formData.append('website_url', payload.website_url || '')
      formData.append('description', payload.description || '')
      formData.append('is_active', payload.is_active ? '1' : '0') // Convertir boolean en string
      formData.append('logo', payload.logo)
      await updateSponsor(currentSponsor.value.id, formData)
    } else {
      // Envoyer JSON sans logo
      await updateSponsor(currentSponsor.value.id, payload)
    }
    
    showSponsorEdit.value = false
    await refreshSponsors()
    useAppToast().showSuccess('Sponsor mis à jour', 'Le sponsor a été modifié avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la mise à jour', getApiErrorMessage(e))
  } finally {
    sponsorsSubmitting.value = false
  }
}

const handleDeleteSponsor = async () => {
  if (!currentSponsor.value) return
  try {
    sponsorsSubmitting.value = true
    await deleteSponsor(currentSponsor.value.id)
    showSponsorDelete.value = false
    await refreshSponsors()
    useAppToast().showSuccess('Sponsor supprimé', 'Le sponsor a été supprimé avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la suppression', getApiErrorMessage(e))
  } finally {
    sponsorsSubmitting.value = false
  }
}




const ticketSubmitting = ref(false)

const handleCreateTicket = async (payload: any) => {
  try {
    ticketSubmitting.value = true
    // add via existing addTicket from repository
    const { addTicket } = useOrganizerEvents()
    // Log en dev seulement
    if (process.dev) console.log('[UI] handleCreateTicket')
    await addTicket(eventId, payload)
    showTicketCreate.value = false
    await refreshTickets()
    useAppToast().showSuccess('Ticket ajouté', 'Le ticket a été créé avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la création du ticket', getApiErrorMessage(e))
  } finally {
    ticketSubmitting.value = false
  }
}

const handleUpdateTicket = async (payload: any) => {
  if (!currentTicket.value) return
  try {
    ticketSubmitting.value = true
    // Log en dev seulement
    if (process.dev) console.log('[UI] handleUpdateTicket')
    await updateTicket(eventId, currentTicket.value.id, payload)
    showTicketEdit.value = false
    await refreshTickets()
    useAppToast().showSuccess('Ticket mis à jour', 'Le ticket a été modifié avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la mise à jour', getApiErrorMessage(e))
  } finally {
    ticketSubmitting.value = false
  }
}

const handleDeleteTicket = async () => {
  if (!currentTicket.value) return
  try {
    ticketSubmitting.value = true
    await deleteTicket(eventId, currentTicket.value.id)
    showTicketDelete.value = false
    await refreshTickets()
    useAppToast().showSuccess('Ticket supprimé', 'Le ticket a été supprimé avec succès.')
  } catch (e: any) {
    useAppToast().showError('Erreur lors de la suppression', getApiErrorMessage(e))
  } finally {
    ticketSubmitting.value = false
  }
}

// Logique d'approbation de l'événement
const { isEventApproved: checkEventApproval } = useEventApproval()
const isEventApproved = computed(() => checkEventApproval(event.value))

</script>

<style scoped>
/* Optimisations pour mobile */
@media (max-width: 640px) {
  /* Améliorer l'espacement des boutons sur mobile */
  .space-y-3 > * + * {
    margin-top: 0.75rem;
  }
  
  /* Assurer que les boutons prennent toute la largeur sur mobile */
  .flex-1 {
    flex: 1 1 0%;
    min-width: 0;
  }
  
  /* Améliorer la lisibilité du titre sur mobile */
  h1 {
    word-break: break-word;
    hyphens: auto;
    line-height: 1.2;
  }
  
  /* Optimiser l'espacement des icônes dans les boutons */
  .ui-button .ui-icon {
    flex-shrink: 0;
  }
  
  /* Améliorer la zone de touch des boutons */
  .ui-button {
    min-height: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Optimiser l'espacement des cartes */
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
  
  /* Améliorer la lisibilité des badges */
  .ui-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  /* Optimiser l'affichage des tickets */
  .divide-y > * + * {
    border-top-width: 1px;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
}

/* Améliorations pour les écrans moyens */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Espacement optimal pour les tablettes */
  .gap-2 {
    gap: 0.75rem;
  }
  
  .gap-3 {
    gap: 1rem;
  }
}

/* Optimisations globales pour tous les boutons */
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

:deep(.ui-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ui-button:active) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Améliorer l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  :deep(.ui-button) {
    transition: none;
  }
  
  :deep(.ui-button:hover) {
    transform: none;
  }
}

/* Optimiser les modals sur mobile */
@media (max-width: 640px) {
  /* Styles pour les modals optimisés mobile */
  .modal-mobile-optimized :deep(.ui-modal) {
    margin: 0.25rem;
    max-width: calc(100vw - 0.5rem);
    max-height: calc(100vh - 0.5rem);
    width: calc(100vw - 0.5rem);
    height: calc(100vh - 0.5rem);
    display: flex;
    flex-direction: column;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-header) {
    flex-shrink: 0;
    padding: 1rem 1rem 0.5rem 1rem;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-body) {
    flex: 1;
    overflow: hidden;
    padding: 0.5rem 1rem;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-footer) {
    flex-shrink: 0;
    padding: 0.5rem 1rem 1rem 1rem;
  }
  
  /* Contenu scrollable dans les modals */
  .modal-content-mobile {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: 0.25rem;
  }
  
  /* Scrollbar personnalisée pour mobile */
  .modal-content-mobile::-webkit-scrollbar {
    width: 4px;
  }
  
  .modal-content-mobile::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .modal-content-mobile::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  
  .modal-content-mobile::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}

/* Améliorer la scrollabilité sur mobile */
@media (max-width: 640px) {
  .overflow-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Optimiser l'affichage des images */
@media (max-width: 640px) {
  .object-cover {
    height: 200px;
  }
}

/* Améliorer l'espacement des éléments de liste */
@media (max-width: 640px) {
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
}
</style>
