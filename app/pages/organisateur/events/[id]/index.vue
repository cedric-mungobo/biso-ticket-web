<template>
  <OrganizerNavigation>
    <div class="">

   
     
    <div class="">
        <!-- En-tête responsive -->
        <div class="mb-2">
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
          
          <!-- Boutons d'action responsive -->
          <div class=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-1">
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
            <!-- Clé de scan (inline dans la barre d'actions) -->
            <div v-if="event?.settings?.scanSecret" class="flex items-center gap-2 sm:gap-2 flex-1 sm:flex-none w-full sm:w-auto">
              <span class="text-sm text-gray-700 whitespace-nowrap">Clé de scan:</span>
              <input
                :value="displayedScanSecret"
                class="rounded-lg border border-gray-300 px-2 py-1 w-full sm:w-24 bg-white text-gray-900"
                readonly
              />
              <UButton
                variant="ghost"
                size="md"
                @click="showScanSecret = !showScanSecret"
                :title="showScanSecret ? 'Masquer' : 'Afficher'"
                :ui="{ base: 'min-h-[36px]' }"
              >
                <UIcon :name="showScanSecret ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </UButton>
              <UButton variant="ghost" size="md" @click="copyScanSecret" title="Copier" :ui="{ base: 'min-h-[36px]' }">
                <UIcon name="i-heroicons-clipboard" class="w-5 h-5" />
              </UButton>
            </div>

            <!-- ID public (à côté de la clé de scan) -->
            <div v-if="event?.publicId" class="flex items-center gap-2 sm:gap-2 flex-1 sm:flex-none w-full sm:w-auto">
              <span class="text-sm text-gray-700 whitespace-nowrap">ID public:</span>
              <input
                :value="displayedPublicId"
                class="rounded-lg border border-gray-300 px-2 py-1 w-full sm:w-24 bg-white text-gray-900"
                readonly
              />
              <UButton
                variant="ghost"
                size="md"
                @click="showPublicId = !showPublicId"
                :title="showPublicId ? 'Masquer' : 'Afficher'"
                :ui="{ base: 'min-h-[36px]' }"
              >
                <UIcon :name="showPublicId ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </UButton>
              <UButton variant="ghost" size="md" @click="copyPublicId" title="Copier" :ui="{ base: 'min-h-[36px]' }">
                <UIcon name="i-heroicons-clipboard" class="w-5 h-5" />
              </UButton>
            </div>
          </div>
        </div>
        
        <LoadingOverlay
          :show="pageLoading"
          title="Chargement de l'événement..."
          description="Veuillez patienter"
          color="primary"
          :size="48"
        />
            
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
          {{ error }}
      </div>

        <div v-else-if="event" class="space-y-6">
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
          <div v-if="ticketsLoading" class="space-y-3">
            <USkeleton class="h-16 w-full" />
            <USkeleton class="h-16 w-full" />
            <USkeleton class="h-16 w-2/3" />
          </div>
          <div v-else-if="!tickets || tickets.length === 0" class="text-center py-6">
            <UIcon name="i-heroicons-ticket" class="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p class="text-sm text-gray-500">Aucun ticket configuré.</p>
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

      <!-- Achat crédits d'invitation -->
      <Modal v-model="showCredits" title="Acheter des crédits d'invitation">
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">Crédits</label>
              <input v-model.number="creditsForm.credits" type="number" min="1" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Devise</label>
              <select v-model="creditsForm.currency" class="rounded-lg border border-gray-300 px-3 py-1 w-full">
                <option value="CDF">CDF</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-700">Téléphone (Mobile Money)</label>
            <input v-model="creditsForm.phone" placeholder="243xxxxxxxxx" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
          </div>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showCredits=false">Fermer</UButton>
          <UButton color="primary" @click="purchaseCredits">Acheter</UButton>
        </template>
      </Modal>

      <!-- Confirmation suppression événement (Modal custom) -->
      <Modal v-model="showEventDeleteConfirm" title="Supprimer l'événement ?">
        <div class="modal-content-mobile">
          <p class="text-sm text-gray-600">
            Cette action est irréversible. Confirmez-vous la suppression de cet événement ?
          </p>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showEventDeleteConfirm=false">Annuler</UButton>
          <UButton color="error" :loading="eventDeleting" @click="confirmDeleteEvent">Supprimer</UButton>
        </template>
      </Modal>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// @ts-nocheck
import TicketForm from '~/components/organizer/forms/TicketForm.vue'
import EventForm from '~/components/organizer/forms/EventForm.vue'
import LoadingOverlay from '~/components/LoadingOverlay.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)

const { fetchEventWithState, fetchEventTickets, updateTicket, deleteTicket, updateEvent, deleteEvent, currentEvent, formatDate, loading, error } = useOrganizerEvents()
const { isLoading, withLoading, preventMultipleSubmissions } = useLoading()

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
const editUrl = computed(() => `/organisateur/events/${eventId}?mode=edit`)
const ordersUrl = computed(() => `/organisateur/events/${eventId}/orders`)
const reportsUrl = computed(() => `/organisateur/events/${eventId}/reports`)
const scansUrl = computed(() => `/organisateur/events/${eventId}/scans`)
const invitationsUrl = computed(() => `/organisateur/events/${eventId}/invitations`)

// Configuration des boutons d'action
const actionButtons = computed(() => [
  {
    id: 'tickets',
    label: 'Mes tickets',
    icon: 'i-heroicons-ticket',
    variant: 'solid',
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
    variant: 'solid',
    size: 'md',
    color: 'secondary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    to: invitationsUrl.value,
    action: null
  },
  {
    id: 'credits',
    label: 'Acheter des crédits',
    icon: 'i-heroicons-banknotes',
    variant: 'solid',
    size: 'md',
    color: 'primary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => { showCredits.value = true }
  },
  {
    id: 'add-ticket',
    label: 'Ajouter un ticket',
    icon: 'i-heroicons-plus',
    variant: 'solid',
    size: 'md',
    color: 'success',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => openCreateTicket()
  },
  {
    id: 'orders',
    label: 'Rapports de ventes',
    icon: 'i-heroicons-clipboard-document-list',
    variant: 'solid',
    size: 'md',
    color: 'secondary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => openOrders()
  },
  {
    id: 'edit-event',
    label: 'Modifier l\'événement',
    icon: 'i-heroicons-pencil',
    variant: 'outline',
    size: 'md',
    color: 'primary',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => editEvent()
  },
  {
    id: 'reports',
    label: 'Rapport de l\'événement',
    icon: 'i-heroicons-chart-bar',
    variant: 'solid',
    size: 'md',
    color: 'neutral',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    to: reportsUrl.value,
    action: null
  },
  {
    id: 'scans',
    label: 'Logs de scan',
    icon: 'i-heroicons-qr-code',
    variant: 'solid',
    size: 'md',
    color: 'warning',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    to: scansUrl.value,
    action: null
  },
 
  {
    id: 'delete-event',
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    variant: 'solid',
    size: 'md',
    color: 'error',
    class: 'shadow-sm w-full sm:w-auto rounded-2xl',
    ui: { base: 'min-h-[44px] touch-manipulation' },
    action: () => openDeleteConfirm()
  }
 
])

const { pending } = await useAsyncData(`organizer-event-${eventId}`, async () => {
  await fetchEventWithState(eventId)
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

const showTicketView = ref(false)
const showTicketCreate = ref(false)
const showTicketEdit = ref(false)
const showTicketDelete = ref(false)
const showEventEdit = ref(false)
const showTicketsList = ref(false)
const showEventDeleteConfirm = ref(false)
const eventDeleting = ref(false)
const showCredits = ref(false)
const showScanSecret = ref(false)
const showPublicId = ref(false)

const currentTicket = ref<any>(null)
const ticketForm = ref<any>({ type: '', price: 0, quantity: 1, devise: 'USD' })
const eventForm = ref<any>({})

// Utilisation du loading du composable pour l'édition d'événement
const submitting = isLoading

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

const openEditEvent = () => {
  eventForm.value = {
    title: event.value?.name || event.value?.title,
    location: event.value?.location,
    starts_at: event.value?.date_time ? new Date(event.value.date_time).toISOString().slice(0,16) : (event.value?.startsAt ? new Date(event.value.startsAt).toISOString().slice(0,16) : ''),
    ends_at: event.value?.ends_at ? new Date(event.value.ends_at).toISOString().slice(0,16) : (event.value?.endsAt ? new Date(event.value.endsAt).toISOString().slice(0,16) : ''),
    description: event.value?.description || '',
    status: event.value?.status,
    is_public: typeof event.value?.is_public === 'boolean' ? event.value.is_public : (typeof event.value?.isPublic === 'boolean' ? event.value.isPublic : true),
    settings: { 
      scan_enabled: event.value?.settings?.scan_enabled ?? true,
      tags: event.value?.settings?.tags || [], 
      categories: event.value?.settings?.categories || [] 
    },
    image_url: event.value?.image_url || event.value?.imageUrl,
    image: null // Initialiser le champ image pour l'upload
  }
  showEventEdit.value = true
}

const openOrders = () => {
  navigateTo(ordersUrl.value)
}

const editEvent = () => {
  navigateTo(`/organisateur/events/${eventId}/edit`)
}

const { purchaseCredits: repoPurchaseCredits } = useOrganizerEvents()
const creditsForm = reactive({ credits: 10, currency: 'CDF', phone: '' })
const purchaseCredits = preventMultipleSubmissions(async () => {
  await withLoading(async () => {
    await repoPurchaseCredits({ credits: Number(creditsForm.credits), currency: creditsForm.currency, phone: creditsForm.phone })
    toast.add({ title: 'Demande envoyée', description: 'Vérifiez le push Mobile Money.', color: 'success' })
    showCredits.value = false
  }, 'Achat de crédits...')
})

const ticketSubmitting = ref(false)

const handleCreateTicket = async (payload: any) => {
  try {
    ticketSubmitting.value = true
    // add via existing addTicket from repository
    const { addTicket } = useOrganizerEvents()
    if (process.dev) console.log('[UI] handleCreateTicket → payload (UI):', JSON.stringify(payload))
    await addTicket(eventId, payload)
    showTicketCreate.value = false
    await refreshTickets()
    toast.add({ title: 'Ticket ajouté', description: 'Le ticket a été créé avec succès.', color: 'success' })
  } catch (e: any) {
    toast.add({ title: 'Erreur lors de la création du ticket', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    ticketSubmitting.value = false
  }
}

const handleUpdateTicket = async (payload: any) => {
  if (!currentTicket.value) return
  try {
    ticketSubmitting.value = true
    if (process.dev) console.log('[UI] handleUpdateTicket → ticketId:', currentTicket.value.id, 'payload (UI):', JSON.stringify(payload))
    await updateTicket(eventId, currentTicket.value.id, payload)
    showTicketEdit.value = false
    await refreshTickets()
    toast.add({ title: 'Ticket mis à jour', description: 'Le ticket a été modifié avec succès.', color: 'success' })
  } catch (e: any) {
    toast.add({ title: 'Erreur lors de la mise à jour', description: getApiErrorMessage(e), color: 'error' })
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
    toast.add({ title: 'Ticket supprimé', description: 'Le ticket a été supprimé avec succès.', color: 'success' })
  } catch (e: any) {
    toast.add({ title: 'Erreur lors de la suppression', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    ticketSubmitting.value = false
  }
}

const handleUpdateEvent = preventMultipleSubmissions(async (data: any) => {
  await withLoading(async () => {
    // Préparer les données selon la documentation API
    const apiBody: any = {
      title: data.title,
      location: data.location,
      starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : undefined,
      ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : undefined,
      description: data.description,
      status: data.status,
      is_public: data.is_public,
      settings: {
        scan_enabled: data.settings?.scan_enabled,
        tags: data.settings?.tags || [],
        categories: data.settings?.categories || []
      }
    }
    
    console.log('Mise à jour de l\'événement en cours...', apiBody)
    console.log('Image reçue:', data.image ? `${data.image.name} (${data.image.size} bytes)` : 'Aucune image')
    console.log('Type de data.image:', typeof data.image)
    console.log('data.image est null?', data.image === null)
    console.log('data.image est undefined?', data.image === undefined)
    console.log('data.image est File?', data.image instanceof File)
    
    await updateEvent(eventId, apiBody, data.image)
    showEventEdit.value = false
    await fetchEventWithState(eventId)
    
    toast.add({
      title: 'Succès',
      description: 'L\'événement a été mis à jour avec succès',
      color: 'success'
    })
  }, 'Mise à jour de l\'événement...').catch((error: any) => {
    console.error('Erreur lors de la mise à jour:', error)
    // Les toasts d'erreur sont maintenant gérés automatiquement par myFetch
  })
})

const openDeleteConfirm = () => {
  showEventDeleteConfirm.value = true
}

const confirmDeleteEvent = async () => {
  if (!eventId) return
  try {
    eventDeleting.value = true
    await deleteEvent(eventId)
    showEventDeleteConfirm.value = false
    toast.add({ title: 'Événement supprimé', description: 'L’événement a été supprimé.', color: 'success' })
    await router.push('/organisateur/my-events')
  } catch (e) {
    toast.add({ title: 'Erreur lors de la suppression', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    eventDeleting.value = false
  }
}
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
