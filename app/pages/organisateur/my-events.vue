<template>
  <OrganizerNavigation 
   
  >
    <div class="p-6 lg:p-8 pb-20 lg:pb-8">
      <!-- En-tête de la page -->
      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Mes événements
        </h1>
        <p class="text-base lg:text-lg text-gray-600">
          Gérez tous vos événements créés
        </p>
      </div>

      <!-- Filtres et actions -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center space-x-4">
          <UInput v-model="searchQuery" placeholder="Rechercher un événement..." class="w-72" />
        </div>
        <UButton to="/organisateur/create-event" color="primary" variant="solid">Créer un événement</UButton>
      </div>

      <!-- Liste des événements -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des événements...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 mb-4">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Vous n\'avez pas encore créé d\'événements' }}
        </p>
        <UButton to="/organisateur/create-event" color="primary" variant="solid">Créer votre premier événement</UButton>
      </div>

      <!-- Liste des événements (Cartes) -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <UCard
            v-for="ev in filteredEvents"
            :key="ev.id"
            class="overflow-hidden"
          >
            <div class="flex items-start gap-3">
              <img
                v-if="ev.image_url"
                :src="ev.image_url"
                :alt="ev.name"
                class="w-28 h-20 object-cover rounded-md flex-shrink-0"
              />

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="text-sm font-semibold text-gray-900 line-clamp-1">{{ ev.name }}</h3>
                  <div class="flex items-center gap-1.5">
                    <UBadge :color="ev.status === 'active' ? 'success' : ev.status === 'draft' ? 'warning' : ev.status === 'ended' ? 'neutral' : 'primary'" variant="soft" class="capitalize">{{ ev.status }}</UBadge>
                    <UBadge v-if="ev.is_public" color="info" variant="soft">public</UBadge>
                  </div>
                </div>

                <div class="text-xs text-gray-500 mt-1">
                  <div>{{ formatDate(ev.date_time) }}</div>
                  <div class="line-clamp-1">{{ ev.location }}</div>
                </div>

                <div class="flex items-center gap-1.5 pt-2">
                  <UTooltip text="Voir l'événement">
                    <UButton :to="`/organisateur/events/${ev.id}?mode=view`" size="xs" variant="ghost" color="primary" aria-label="Voir">
                      <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                    </UButton>
                  </UTooltip>
                  <UTooltip text="Gérer">
                    <UButton :to="`/organisateur/events/${ev.id}`" size="xs" variant="ghost" color="success" aria-label="Gérer">
                      <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                    </UButton>
                  </UTooltip>
                  <UTooltip :text="copiedEventId === ev.id ? 'Copié' : 'Copier le lien'">
                    <UButton size="xs" variant="ghost" color="neutral" aria-label="Copier" @click="copyEventLink(Number(ev.id))">
                      <UIcon name="i-heroicons-clipboard" class="w-4 h-4" />
                    </UButton>
                  </UTooltip>
                  <UTooltip text="Supprimer">
                    <UButton size="xs" variant="ghost" color="error" aria-label="Supprimer" @click="handleDeleteEvent(Number(ev.id))">
                      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                    </UButton>
                  </UTooltip>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
// @ts-nocheck
// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

const UAvatar = resolveComponent('UAvatar')

type Event = {
  id: number
  name: string
  description: string
  date_time: string
  location: string
  category: string
  image?: string
}

const { fetchMyEvents, formatDate, events, loading, error, deleteEvent } = useOrganizerEvents()

const searchQuery = ref('')
const copiedEventId = ref<number | null>(null)
const showFilters = ref(false)

const columns: TableColumn<any>[] = [
  {
    id: 'image_url', accessorKey: 'image_url', header: 'Image',
    cell: ({ row }) => h(UAvatar, { src: row.original.image_url, alt: row.original.name, size: 'lg' })
  },
  { id: 'name', accessorKey: 'name', header: 'Titre' },
  { id: 'date_time', accessorKey: 'date_time', header: 'Date & Lieu' },
  { id: 'status', accessorKey: 'status', header: 'Statut' },
  { id: 'actions', accessorKey: 'actions', header: 'Actions' }
]

const exportEvents = () => {
  console.log('Export des événements...')
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const handleDeleteEvent = async (eventId: number) => {
  if (!eventId || isNaN(eventId)) {
    alert('Erreur: ID d\'événement invalide')
    return
  }
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
    try {
      await deleteEvent(eventId)
      await loadEvents()
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la suppression de l\'événement'
      if (error?.message?.includes('404')) errorMessage = 'Événement non trouvé ou déjà supprimé'
      else if (error?.message?.includes('403')) errorMessage = 'Permissions insuffisantes'
      else if (error?.message?.includes('422')) errorMessage = 'Impossible de supprimer (réservations existantes)'
      alert(errorMessage)
    }
  }
}

const filteredEvents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return events.value
  return events.value.filter((e: any) => {
    return [e.name, e.location, e.description, e.slug]
      .filter(Boolean)
      .some((v: string) => String(v).toLowerCase().includes(q))
  })
})

const loadEvents = async () => {
  try {
    await fetchMyEvents()
  } catch (err) {
    console.error('Erreur:', err)
  }
}

const copyEventLink = async (eventId: number) => {
  const eventUrl = `${window.location.origin}/evenements/${eventId}`
  try {
    await navigator.clipboard.writeText(eventUrl)
    copiedEventId.value = eventId
    setTimeout(() => {
      copiedEventId.value = null
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
