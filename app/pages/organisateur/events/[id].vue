<template>
  <OrganizerNavigation>
    <div class="">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <NuxtLink
              to="/organisateur/my-events"
              class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-2"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à mes événements
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ event?.name || (isLoading ? 'Chargement...' : '—') }}
            </h1>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UButton :to="`#tickets`" variant="solid" size="md" color="primary" class="shadow-sm">
              <UIcon name="i-heroicons-ticket" class="w-4 h-4 mr-1" /> Voir les tickets
            </UButton>
            <UButton @click="openCreateTicket()" variant="solid" size="md" color="success" class="shadow-sm">
              <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-1" /> Ajouter un ticket
            </UButton>
            <UButton :to="reportsUrl" variant="solid" size="md" color="neutral" class="shadow-sm">
              <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 mr-1" /> Rapports
            </UButton>
            <UButton @click="openEditEvent()" variant="solid" size="md" color="warning" class="shadow-sm">
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 mr-1" /> Éditer
            </UButton>
            <UButton @click="onDelete" variant="solid" size="md" color="error" class="shadow-sm">
              <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-1" /> Supprimer
            </UButton>
          </div>
        </div>

        <div v-if="isLoading" class="space-y-4">
          <USkeleton class="h-48 w-full" />
          <USkeleton class="h-6 w-1/2" />
          <USkeleton class="h-4 w-1/3" />
        </div>

        <div v-else-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
          {{ error }}
        </div>

        <div v-else-if="!event" class="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
          Événement introuvable ou indisponible.
        </div>

        <div v-else class="space-y-6">
          <UCard class="overflow-hidden">
            <img
              v-if="event?.image_url"
              :src="event.image_url"
              :alt="event?.name"
              class="w-full h-64 object-cover"
            />

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
          </UCard>

          <!-- Tickets -->
          <UCard id="tickets">
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-base font-semibold text-gray-900">Tickets</h3>
                <span class="text-xs text-gray-500" v-if="tickets && tickets.length">{{ tickets.length }} types</span>
              </div>

              <div v-if="ticketsLoading" class="space-y-2">
                <USkeleton class="h-6 w-full" />
                <USkeleton class="h-6 w-2/3" />
              </div>

              <div v-else-if="!tickets || tickets.length === 0" class="text-sm text-gray-500">
                Aucun ticket configuré.
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="t in tickets"
                  :key="t.id"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900">{{ t.type }}</span>
                    <UBadge variant="soft">{{ t.quantity }} disponibles</UBadge>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ t.price }} {{ t.devise || 'USD' }}
                    </div>
                    <UButton size="xs" variant="ghost" color="primary" @click="openViewTicket(t)">
                      <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                    </UButton>
                    <UButton size="xs" variant="ghost" color="warning" @click="openEditTicket(t)">
                      <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                    </UButton>
                    <UButton size="xs" variant="ghost" color="error" @click="openDeleteTicket(t)">
                      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Modals -->
      <Modal v-model="showTicketView" title="Détails du ticket">
        <div class="space-y-2">
          <div class="text-sm text-gray-600">
            <div><span class="font-medium">Type:</span> {{ currentTicket?.type }}</div>
            <div><span class="font-medium">Prix:</span> {{ currentTicket?.price }} {{ currentTicket?.devise }}</div>
            <div><span class="font-medium">Quantité:</span> {{ currentTicket?.quantity }}</div>
          </div>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showTicketView=false">Fermer</UButton>
        </template>
      </Modal>
      <Modal v-model="showTicketCreate" title="Ajouter un ticket">
        <TicketForm v-model="ticketForm" :submitting="submitting" submit-label="Ajouter" @cancel="showTicketCreate=false" @submit="handleCreateTicket" />
      </Modal>
      <Modal v-model="showTicketEdit" title="Éditer le ticket">
        <TicketForm v-model="ticketForm" :submitting="submitting" submit-label="Enregistrer" @cancel="showTicketEdit=false" @submit="handleUpdateTicket" />
      </Modal>
      <Modal v-model="showTicketDelete" title="Supprimer le ticket">
        <p class="text-sm text-gray-600">Confirmer la suppression du ticket "{{ currentTicket?.type }}" ?</p>
        <template #footer>
          <UButton variant="ghost" @click="showTicketDelete=false">Annuler</UButton>
          <UButton color="error" :loading="submitting" @click="handleDeleteTicket">Supprimer</UButton>
        </template>
      </Modal>
      <Modal v-model="showEventEdit" title="Éditer l'événement">
        <EventForm v-model="eventForm" :submitting="submitting" @cancel="showEventEdit=false" @submit="handleUpdateEvent" />
      </Modal>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// @ts-nocheck
import TicketForm from '~/components/organizer/forms/TicketForm.vue'
import EventForm from '~/components/organizer/forms/EventForm.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)

const { fetchEventWithState, fetchEventTickets, updateTicket, deleteTicket, updateEvent, deleteEvent, currentEvent, formatDate, loading, error } = useOrganizerEvents()

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
const reportsUrl = computed(() => `/organisateur/events/${eventId}?section=stats`)

const { pending } = await useAsyncData('organizer-event', () => fetchEventWithState(eventId))
const isLoading = computed(() => loading.value || pending.value)

const tickets = ref<any[]>([])
const { pending: ticketsPending, refresh: refreshTickets } = await useAsyncData('organizer-event-tickets', async () => {
  tickets.value = await fetchEventTickets(eventId)
})
const ticketsLoading = computed(() => ticketsPending.value)

const showTicketView = ref(false)
const showTicketCreate = ref(false)
const showTicketEdit = ref(false)
const showTicketDelete = ref(false)
const showEventEdit = ref(false)

const currentTicket = ref<any>(null)
const ticketForm = ref<any>({ type: '', price: 0, quantity: 1, devise: 'USD' })
const eventForm = ref<any>({})
const submitting = ref(false)

const openViewTicket = (t: any) => {
  currentTicket.value = t
  showTicketView.value = true
}

const openCreateTicket = () => {
  ticketForm.value = { type: '', price: 0, quantity: 1, devise: 'USD' }
  showTicketCreate.value = true
}

const openEditTicket = (t: any) => {
  currentTicket.value = t
  ticketForm.value = { ...t }
  showTicketEdit.value = true
}

const openDeleteTicket = (t: any) => {
  currentTicket.value = t
  showTicketDelete.value = true
}

const openEditEvent = () => {
  eventForm.value = {
    title: event.value?.name,
    location: event.value?.location,
    starts_at: event.value?.date_time ? new Date(event.value.date_time).toISOString().slice(0,16) : '',
    status: event.value?.status,
    is_public: event.value?.is_public,
    settings: { tags: event.value?.settings?.tags || [] }
  }
  showEventEdit.value = true
}

const handleCreateTicket = async (payload: any) => {
  try {
    submitting.value = true
    // add via existing addTicket from repository
    const { addTicket } = useOrganizerEvents()
    await addTicket(eventId, payload)
    showTicketCreate.value = false
    await refreshTickets()
    toast.add({ title: 'Ticket ajouté', description: 'Le ticket a été créé avec succès.', color: 'success' })
  } finally {
    submitting.value = false
  }
}

const handleUpdateTicket = async (payload: any) => {
  if (!currentTicket.value) return
  try {
    submitting.value = true
    await updateTicket(eventId, currentTicket.value.id, payload)
    showTicketEdit.value = false
    await refreshTickets()
    toast.add({ title: 'Ticket mis à jour', description: 'Le ticket a été modifié avec succès.', color: 'success' })
  } finally {
    submitting.value = false
  }
}

const handleDeleteTicket = async () => {
  if (!currentTicket.value) return
  try {
    submitting.value = true
    await deleteTicket(eventId, currentTicket.value.id)
    showTicketDelete.value = false
    await refreshTickets()
  } finally {
    submitting.value = false
  }
}

const handleUpdateEvent = async (payload: any) => {
  try {
    submitting.value = true
    await updateEvent(eventId, {
      title: payload.title,
      location: payload.location,
      starts_at: payload.starts_at,
      status: payload.status,
      is_public: payload.is_public,
      settings: { tags: payload.settings?.tags || [] }
    })
    showEventEdit.value = false
    await fetchEventWithState(eventId)
    toast.add({ title: 'Événement mis à jour', description: 'Les informations de l’événement ont été enregistrées.', color: 'success' })
  } finally {
    submitting.value = false
  }
}

const onDelete = async () => {
  if (!eventId) return
  if (confirm('Supprimer cet événement ? Cette action est irréversible.')) {
    try {
      await deleteEvent(eventId)
      await router.push('/organisateur/my-events')
    } catch (e) {
      alert('Erreur lors de la suppression')
    }
  }
}
</script>
