<template>
  <OrganizerNavigation>
    <div class="container mx-auto px-2 sm:px-6 lg:px-8 ">
      <div class="mb-6">
        <NuxtLink :to="backUrl" class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'évènement
        </NuxtLink>
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Invitations</h1>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
            <UButton size="sm" color="primary" @click="showAddGuest=true"><UIcon name="i-heroicons-user-plus" class="w-4 h-4 mr-1" /> Ajouter invité</UButton>
            <UButton size="sm" color="neutral" @click="showImport=true"><UIcon name="i-heroicons-arrow-up-tray" class="w-4 h-4 mr-1" /> Importer</UButton>
            <UButton size="sm" color="warning" @click="showTemplate=true"><UIcon name="i-heroicons-swatch" class="w-4 h-4 mr-1" /> Template</UButton>
            <UButton size="sm" color="neutral" @click="showMessage=true"><UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 mr-1" /> Message</UButton>
            <UButton size="sm" color="success" @click="openBuyCredits"><UIcon name="i-heroicons-credit-card" class="w-4 h-4 mr-1" /> Acheter crédits</UButton>
          </div>
        </div>
      </div>

     
      <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 space-y-4">
        <!-- Stats cards -->
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div class="text-xs text-gray-500">Total</div>
            <div class="text-xl font-semibold text-gray-900">{{ totalCount }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div class="text-xs text-gray-500">En attente</div>
            <div class="text-xl font-semibold text-amber-600">{{ pendingCount }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div class="text-xs text-gray-500">Envoyé</div>
            <div class="text-xl font-semibold text-primary-600">{{ sentCount }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div class="text-xs text-gray-500">Confirmé</div>
            <div class="text-xl font-semibold text-green-600">{{ confirmedCount }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 bg-white">
            <div class="text-xs text-gray-500">Crédits</div>
            <div class="text-xl font-semibold text-gray-900">{{ credits?.balance ?? 0 }}</div>
          </div>
        </div>
        <div v-if="pending" class="space-y-2">
          <USkeleton class="h-6 w-1/2" />
          <USkeleton class="h-10 w-full" />
        </div>
        <div v-else>
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2">
              <label for="status" class="text-sm text-gray-700">Statut</label>
              <select id="status" v-model="statusFilter" class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500">
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="sent">Envoyé</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label for="search" class="text-sm text-gray-700">Recherche</label>
              <input id="search" v-model="searchQuery" type="text" placeholder="Nom, email, téléphone..." class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500" />
            </div>
          </div>

          <div v-if="filtered.length===0" class="text-sm text-gray-500">Aucun invité.</div>
          <div v-else class="overflow-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-gray-600 border-b">
                  <th class="py-2 pr-4">Nom</th>
                 
                  <th class="py-2 pr-4">Table</th>
                  <th class="py-2 pr-4">Statut</th>
                  <th class="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inv in filtered" :key="inv.id" class="border-b last:border-0">
                
                  <td class="py-2 pr-4">{{ inv.guestName || '—' }}</td>

                  <td class="py-2 pr-4">{{ inv.guestTableName || '—' }}</td>
                  <td class="py-2 pr-4 capitalize">{{ statusLabel(inv.status) }}</td>
                  <td class="py-2 pr-4">
                    <UButton size="xs" variant="ghost" color="primary" :loading="sendingIds.has(inv.id)" @click="onShare(inv)"><UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 mr-1" /> Envoyer</UButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-2">
            <div class="text-xs text-gray-600">Page {{ currentPage }} / {{ totalPages }}</div>
            <div class="flex items-center gap-2">
              <UButton size="xs" variant="ghost" :disabled="currentPage <= 1 || pending" @click="prevPage">Précédent</UButton>
              <UButton size="xs" variant="ghost" :disabled="currentPage >= totalPages || pending" @click="nextPage">Suivant</UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <Modal v-model="showTemplate" title="Choisir un template">
        <div class="space-y-2">
            
          <div v-if="templatesPending" class="space-y-2">
            <USkeleton class="h-6 w-1/2" />
            <USkeleton class="h-32 w-full" />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="t in templates" :key="t.id" class="border rounded-lg p-3">
              <div class="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <img :src="t.previewImageUrl" :alt="t.title" class="h-full w-full object-cover" />
              </div>
              <div class="mt-2 font-medium text-gray-900">{{ t.title }}</div>
              <div class="text-xs text-gray-600">{{ t.designKey }}</div>
              <div class="mt-2 text-right">
                <UButton size="xs" color="primary">Sélectionner</UButton>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showTemplate=false">Fermer</UButton>
        </template>
      </Modal>

      <Modal v-model="showMessage" title="Configurer le message">
        <div class="space-y-3">
          <label class="block text-sm text-gray-700">Sujet</label>
          <input v-model="message.subject" type="text" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
          <label class="block text-sm text-gray-700">Message</label>
          <textarea v-model="message.body" rows="5" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showMessage=false">Fermer</UButton>
          <UButton color="primary" @click="saveMessage">Enregistrer</UButton>
        </template>
      </Modal>

      <Modal v-model="showAddGuest" title="Ajouter un invité">
        <div class="space-y-3">
          <input v-model="newGuest.name" placeholder="Nom" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
          <input v-model="newGuest.email" placeholder="Email" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
          <input v-model="newGuest.phone" placeholder="Téléphone" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
          <input v-model="newGuest.table" placeholder="Table" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showAddGuest=false">Annuler</UButton>
          <UButton color="primary" @click="addGuest">Ajouter</UButton>
        </template>
      </Modal>

      <Modal v-model="showImport" title="Importer des invités (CSV)">
        <div class="space-y-3">
          <input type="file" accept=".csv" @change="onImportFile" class="w-full text-sm" />
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showImport=false">Fermer</UButton>
          <UButton color="primary">Importer</UButton>
        </template>
      </Modal>

      <!-- Acheter des crédits -->
      <Modal v-model="showBuyCredits" title="Acheter des crédits d'invitation">
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Crédits</label>
              <input v-model.number="buy.credits" type="number" min="1" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Devise</label>
              <select v-model="buy.currency" class="rounded-lg border border-gray-300 px-3 py-1 w-full">
                <option value="CDF">CDF</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div class>
              <label class="block text-sm text-gray-700 mb-1">Téléphone (E.164)</label>
              <input v-model="buy.phone" type="tel" placeholder="2438XXXXXXXX" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
            </div>
          </div>

          <!-- Prix -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div class="text-xs text-gray-500">Prix unitaire (USD)</div>
              <div class="text-lg font-semibold text-gray-900">
                <template v-if="pricePending"><USkeleton class="h-6 w-24" /></template>
                <template v-else>{{ unitPriceUsd }}</template>
              </div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div class="text-xs text-gray-500">Total (USD)</div>
              <div class="text-lg font-semibold text-gray-900">
                <template v-if="pricePending"><USkeleton class="h-6 w-28" /></template>
                <template v-else>{{ totalUsd }}</template>
              </div>
              <div v-if="buy.currency==='CDF'" class="mt-1 text-xs text-gray-500">Le montant en CDF sera calculé lors du paiement.</div>
            </div>
          </div>

          <div v-if="paymentNoticeActive" class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            Une notification de paiement a été envoyée au {{ buy.phone }}. Veuillez confirmer.
            <div class="mt-1 text-xs text-amber-700">Expiration dans {{ countdown }}s…</div>
          </div>
        </div>
        <template #footer>
          <UButton variant="ghost" :disabled="buySubmitting" @click="closeBuyCredits">Fermer</UButton>
          <UButton color="primary" :loading="buySubmitting" :disabled="paymentNoticeActive" @click="submitBuyCredits">Payer</UButton>
        </template>
      </Modal>

     
    </div>
  </OrganizerNavigation>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: 'authenticated', ssr: false })

const route = useRoute()
const eventId = Number(route.params.id)
const backUrl = computed(() => `/organisateur/events/${eventId}`)

const { fetchEventInvitations, fetchInvitationTemplates, createInvitation, createInvitationsBatch, shareInvitation } = useInvitations()
const toast = useToast()

const statusFilter = ref<'all'|'pending'|'sent'|'confirmed'|'cancelled'>('all')
const searchQuery = ref('')
const { pending, data, refresh } = await useAsyncData<{ items: any[]; meta: any }>(
  `organizer-event-${eventId}-invitations`,
  () => fetchEventInvitations(eventId, { per_page: perPage.value, page: currentPage.value }),
  { server: false, default: () => ({ items: [], meta: null }) }
)
const invitations = computed<any[]>(() => Array.isArray((data.value as any)?.items) ? (data.value as any).items : [])
const perPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Number((data.value as any)?.meta?.lastPage || 1)))
watch([perPage, currentPage], () => { refresh() })
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
onMounted(() => { refresh() })
const totalCount = computed(() => invitations.value.length)
const pendingCount = computed(() => invitations.value.filter(i => String(i.status || '').toLowerCase() === 'pending').length)
const sentCount = computed(() => invitations.value.filter(i => String(i.status || '').toLowerCase() === 'sent').length)
const confirmedCount = computed(() => invitations.value.filter(i => String(i.status || '').toLowerCase() === 'confirmed').length)
const filtered = computed<any[]>(() => {
  const list = Array.isArray(invitations.value) ? invitations.value : []
  const status = (statusFilter.value || 'all').toLowerCase()
  const byStatus = status === 'all' ? list : list.filter((i:any) => String(i.status || '').toLowerCase() === status)
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return byStatus
  return byStatus.filter((i:any) => {
    const hay = [i.guestName, i.guestEmail, i.guestPhone, i.guestTableName, i.token]
      .map((v:any) => String(v || '').toLowerCase()).join(' ')
    return hay.includes(q)
  })
})

const sendingIds = reactive(new Set<number>())
const onShare = async (inv: any) => {
  try {
    sendingIds.add(inv.id)
    await shareInvitation(eventId, inv.id)
    toast.add({ title: 'Invitation envoyée', description: `Partage effectué pour ${inv.guestName || 'invité'}.`, color: 'success' })
    await refresh()
  } catch (_e) {
    const e: any = _e
    const resp = e?.response
    const data = resp?._data || resp?.data || {}
    const msg = data?.message || e?.message || 'Une erreur est survenue.'
    toast.add({ title: 'Erreur', description: String(msg), color: 'error' })
  } finally {
    sendingIds.delete(inv.id)
  }
}

const statusLabel = (s?: string) => {
  const k = String(s || 'pending').toLowerCase()
  if (k === 'pending') return 'en attente'
  if (k === 'sent') return 'envoyé'
  if (k === 'confirmed') return 'confirmé'
  if (k === 'cancelled') return 'annulé'
  return k
}

// Templates
const showTemplate = ref(false)
const { pending: templatesPending, data: templatesData } = await useAsyncData<{ items: any[]; meta: any }>(
  `invitations-templates`,
  () => fetchInvitationTemplates({ per_page: 50 }),
  { server: false, default: () => ({ items: [], meta: null }) }
)
const templates = computed<any[]>(() => Array.isArray((templatesData.value as any)?.items) ? (templatesData.value as any).items : [])

// Credits
const { fetchCreditBalance } = useCredits()
const { pending: creditsPending, data: creditsData } = await useAsyncData(`invitations-credits`, () => fetchCreditBalance(), { server: false })
const credits = computed(() => creditsData.value || { balance: 0 })

// Prix crédits
const { fetchCreditPrice } = useCredits()
const { pending: pricePending, data: priceData } = await useAsyncData(`invitations-credit-price`, () => fetchCreditPrice(), { server: false })
const unitPriceUsd = computed(() => (priceData.value?.unitPriceUsd ?? 0).toFixed(2))
const totalUsd = computed(() => (Number(priceData.value?.unitPriceUsd || 0) * Math.max(0, Number(buy?.credits || 0))).toFixed(2))

// Message config (local UI state)
const showMessage = ref(false)
const message = reactive({ subject: '', body: '' })
const saveMessage = () => { showMessage.value = false }

// Acheter crédits
const showBuyCredits = ref(false)
const buySubmitting = ref(false)
const paymentNoticeActive = ref(false)
const countdown = ref(60)
let countdownTimer: any = null
const buy = reactive({ credits: 10, currency: 'CDF', phone: '' })
const { purchaseAndPayCredits } = useCredits()
const openBuyCredits = () => { showBuyCredits.value = true }
const closeBuyCredits = () => {
  showBuyCredits.value = false
  paymentNoticeActive.value = false
  clearInterval(countdownTimer)
  countdown.value = 60
}
const startCountdown = () => {
  paymentNoticeActive.value = true
  countdown.value = 60
  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(countdownTimer)
  }, 1000)
}
const submitBuyCredits = async () => {
  if (!buy.phone || !/^\d{12}$/.test(buy.phone)) {
    toast.add({ title: 'Téléphone invalide', description: 'Format attendu: 243XXXXXXXXX', color: 'warning' })
    return
  }
  if (!buy.credits || buy.credits < 1) {
    toast.add({ title: 'Crédits invalides', description: 'Saisissez un nombre de crédits ≥ 1.', color: 'warning' })
    return
  }
  try {
    buySubmitting.value = true
    await purchaseAndPayCredits({ credits: buy.credits as any, currency: buy.currency as any, phone: buy.phone })
    toast.add({ title: 'Paiement initié', description: 'Une notification de paiement a été envoyée. Veuillez confirmer.', color: 'success' })
    startCountdown()
  } catch (_e) {
    const e: any = _e
    const resp = e?.response
    const data = resp?._data || resp?.data || {}
    const msg = data?.message || e?.message || 'Une erreur est survenue.'
    toast.add({ title: 'Erreur', description: String(msg), color: 'error' })
  } finally {
    buySubmitting.value = false
  }
}

// Add guest modal
const showAddGuest = ref(false)
const newGuest = reactive({ name: '', email: '', phone: '', table: '' })
const addSubmitting = ref(false)
const addGuest = async () => {
  if (!newGuest.name?.trim()) {
    toast.add({ title: 'Nom requis', description: 'Veuillez saisir le nom de l\'invité.', color: 'warning' })
    return
  }
  try {
    addSubmitting.value = true
    await createInvitation(eventId, {
      guestName: newGuest.name.trim(),
      guestEmail: newGuest.email?.trim() || undefined,
      guestPhone: newGuest.phone?.trim() || undefined,
      guestTableName: newGuest.table?.trim() || undefined
    })
    toast.add({ title: 'Invité ajouté', description: 'L\'invité a été ajouté avec succès.', color: 'success' })
    showAddGuest.value = false
    newGuest.name = ''; newGuest.email = ''; newGuest.phone = ''; newGuest.table = ''
    await refresh()
  } catch (_e) {
    const e: any = _e
    const resp = e?.response
    const data = resp?._data || resp?.data || {}
    const msg = data?.message || e?.message || 'Une erreur est survenue.'
    toast.add({ title: 'Erreur', description: String(msg), color: 'error' })
  } finally {
    addSubmitting.value = false
  }
}

// Import modal
const showImport = ref(false)
const onImportFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    try {
      const text = String(reader.result || '')
      // CSV très simple: name,email,phone,table (ligne d'entête optionnelle)
      const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean)
      const [maybeHeader, ...dataRows] = rows
      const hasHeader = /name|nom|email|phone|téléphone|table/i.test(maybeHeader)
      const lines = hasHeader ? dataRows : rows
      const batch = lines.map((line) => {
        const [name, email, phone, table] = line.split(',').map((s) => (s || '').trim())
        return { guestName: name, guestEmail: email || undefined, guestPhone: phone || undefined, guestTableName: table || undefined }
      }).filter(i => i.guestName)
      if (batch.length === 0) {
        toast.add({ title: 'Fichier vide', description: 'Aucune ligne valide détectée.', color: 'warning' })
        return
      }
      await createInvitationsBatch(eventId, batch)
      toast.add({ title: 'Import réussi', description: `${batch.length} invités importés.`, color: 'success' })
      showImport.value = false
      await refresh()
    } catch (_e) {
      const e: any = _e
      toast.add({ title: 'Erreur import', description: e?.message || 'Impossible de traiter le CSV.', color: 'error' })
    }
  }
  reader.readAsText(file)
}
</script>


