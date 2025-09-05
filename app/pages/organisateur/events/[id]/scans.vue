<template>
  <OrganizerNavigation>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink :to="backUrl" class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'évènement
        </NuxtLink>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Logs de scan</h1>
      </div>

      <UCard class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-sm text-gray-700">Par page</label>
            <select v-model.number="perPage" class="rounded-lg border border-gray-300 px-3 py-1 w-full">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton color="primary" :loading="pending" @click="refresh">Actualiser</UButton>
        </div>
      </UCard>

      <div class="mt-6">
        <LoadingOverlay :show="pending" title="Chargement des scans..." description="Veuillez patienter" color="primary" :size="48" />
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">{{ error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-600 border-b">
                <th class="py-2 pr-4">ID</th>
                <th class="py-2 pr-4">Ticket</th>
                <th class="py-2 pr-4">Participant</th>
                <th class="py-2 pr-4">Lieu/Device</th>
                <th class="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in scans" :key="s.id" class="border-b last:border-0">
                <td class="py-2 pr-4 font-medium">#{{ s.id }}</td>
                <td class="py-2 pr-4">{{ s.ticketId || s.ticket_id || '—' }}</td>
                <td class="py-2 pr-4">{{ s.participantId || s.participant_id || '—' }}</td>
                <td class="py-2 pr-4">{{ s.location || '—' }}<span v-if="s.device"> · {{ s.device }}</span></td>
                <td class="py-2 pr-4">{{ formatScanDate((s as any).createdAt || (s as any).created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script setup lang="ts">
// @ts-nocheck
import LoadingOverlay from '~/components/LoadingOverlay.vue'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const eventId = Number(route.params.id)
const backUrl = computed(() => `/organisateur/events/${eventId}`)

const perPage = ref(20)
const error = ref<string | null>(null)
const scans = ref<any[]>([])

const { fetchEventScans, formatScanDate } = useScans()

const { pending, refresh } = await useAsyncData(`organizer-event-${eventId}-scans`, async () => {
  try {
    error.value = null
    const res = await fetchEventScans(eventId, { per_page: perPage.value })
    const payload: any = (res as any)?.data ?? res
    scans.value = Array.isArray(payload?.items) ? payload.items : (Array.isArray(payload) ? payload : [])
    return scans.value
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors du chargement des scans'
    return []
  }
}, { server: false })

watch(perPage, () => refresh())

</script>

<style scoped>
</style>


