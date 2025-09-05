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
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Rapports de ventes</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 space-y-4">
        <div v-if="loading" class="space-y-2">
          <USkeleton class="h-6 w-1/2" />
          <USkeleton class="h-10 w-full" />
        </div>
        <div v-else>
           
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4">
            <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">Payées</div>
                <div class="text-xl font-semibold text-primary-600">{{ paidCount }}</div>
              </div>
              <div class="mt-1 flex flex-wrap gap-2" v-if="Object.keys(paidStatsByCurrency).length">
                <div v-for="(stat, cur) in paidStatsByCurrency" :key="cur" class="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1">
                  <span class="text-xs font-medium text-gray-700">{{ cur }}</span>
                  <span class="text-[11px] text-gray-500">({{ stat.count }})</span>
                  <span class="text-xs text-primary-600 font-semibold">{{ formatAmount(stat.amount) }}</span>
                  <span class="text-[11px] text-gray-500">Com:</span>
                  <span class="text-[11px] text-gray-700">{{ formatAmount(stat.commission) }}</span>
                </div>
              </div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">En attente</div>
                <div class="text-xl font-semibold text-amber-600">{{ pendingCount }}</div>
              </div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">Échouées/Annulées</div>
                <div class="text-xl font-semibold text-red-600">{{ failedCount }}</div>
              </div>
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex flex-col py-4 sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2">
              <label for="statusFilter" class="text-sm text-gray-700">Statut</label>
              <select id="statusFilter" v-model="statusFilter" class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500">
                <option value="all">Toutes</option>
                <option value="pending">En attente</option>
                <option value="paid">Payées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label for="currencyFilter" class="text-sm text-gray-700">Devise</label>
              <select id="currencyFilter" v-model="currencyFilter" class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500">
                <option value="all">Toutes</option>
                <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label for="search" class="text-sm text-gray-700">Recherche</label>
              <input id="search" v-model="searchQuery" type="text" placeholder="#id, statut..." class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div class="flex items-center gap-2">
              <label for="perPage" class="text-sm text-gray-700">Par page</label>
              <select id="perPage" v-model.number="perPage" class="rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
            </div>
          </div>

          <!-- Table -->
          <div v-if="paginatedOrders.length === 0" class="text-sm text-gray-500">Aucune commande pour cet évènement.</div>
          <div v-else class="overflow-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-gray-600 border-b">
                  <th class="py-2 pr-4">ID</th>
                  <th class="py-2 pr-4">Client</th>
                  <th class="py-2 pr-4">Billets</th>
                  <th class="py-2 pr-4">Statut</th>
                  <th class="py-2 pr-4">Date</th>
                  <th class="py-2 pr-4">Total</th>
                  <th class="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in paginatedOrders" :key="o.id" class="border-b last:border-0">
                  <td class="py-2 pr-4 font-medium">#{{ o.id }}</td>
                  <td class="py-2 pr-4">{{ o.customerName || '—' }}</td>
                  <td class="py-2 pr-4">
                    <span v-if="o.items && o.items.length">
                      {{ o.items.map((it:any) => `${it.name || '—'} × ${it.quantity ?? 1}`).join(' · ') }}
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td class="py-2 pr-4 capitalize" :class="o.status === 'paid' ? 'text-primary-600' : (o.status === 'failed' ? 'text-red-600' : 'text-amber-600')">{{ getStatusLabel(o.status) }}</td>
                  <td class="py-2 pr-4">{{ formatDateTime((o as any).createdAt) }}</td>
                  <td class="py-2 pr-4">{{ o.totalAmount }} {{ o.currency || 'CDF' }}</td>
                  <td class="py-2 pr-4">
                    <UButton size="xs" variant="ghost" color="primary" @click="openPayments(o)">
                      <UIcon name="i-heroicons-credit-card" class="w-4 h-4 mr-1" /> Paiements
                    </UButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-2">
            <div class="text-xs text-gray-600">Page {{ currentPage }} / {{ totalPages }}</div>
            <div class="flex items-center gap-2">
              <UButton size="xs" variant="ghost" :disabled="currentPage <= 1" @click="prevPage">Précédent</UButton>
              <UButton size="xs" variant="ghost" :disabled="currentPage >= totalPages" @click="nextPage">Suivant</UButton>
            </div>
          </div>
        </div>
      </div>

      <Modal v-model="showPayments" title="Paiements de la commande">
        <div class="space-y-2">
            
          <div v-if="paymentsLoading" class="space-y-2">
            <USkeleton class="h-6 w-1/3" />
            <USkeleton class="h-6 w-2/3" />
          </div>
          
          <div v-else-if="currentPayments.length === 0" class="text-sm text-gray-500">Aucun paiement.</div>
          <div v-else class="divide-y divide-gray-200">
            <div v-for="p in currentPayments" :key="p.id" class="py-2">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-800">
                  {{ p.method }} — {{ p.amount }} {{ p.currency || 'CDF' }}
                  <span v-if="p.paidAt"> · {{ formatDateTime(p.paidAt) }}</span>
                </div>
                <UBadge :color="p.status === 'confirmed' ? 'success' : (p.status === 'failed' ? 'error' : 'warning')" variant="soft" class="capitalize">
                  {{ p.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <UButton variant="ghost" @click="showPayments=false">Fermer</UButton>
        </template>
      </Modal>
    </div>
  </OrganizerNavigation>
</template>

<script setup lang="ts">
// @ts-nocheck
import type { Order, Payment } from '~/types/api'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const eventId = Number(route.params.id)
const backUrl = computed(() => `/organisateur/events/${eventId}`)

// Chargement & données via useAsyncData (bonnes pratiques Nuxt)
const { pending: ordersPending, data: ordersData, refresh: refreshOrders } = await useAsyncData<Order[]>(
  `organizer-event-orders-${eventId}`,
  () => getEventOrders(eventId, { per_page: 50 }),
  { server: false, default: () => [] }
)
const loading = computed(() => ordersPending.value)
const orders = computed<Order[]>(() => ordersData.value || [])
const statusFilter = ref<'all'|'pending'|'paid'|'cancelled'>('paid')
const currencyFilter = ref<'all' | string>('all')
const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

const currencies = computed(() => Array.from(new Set((orders.value || []).map((o:any) => o.currency || 'CDF').filter(Boolean))))

const ordersByCurrency = computed(() => {
  const list = orders.value || []
  if (currencyFilter.value === 'all') return list
  return list.filter((o:any) => (o.currency || 'CDF') === currencyFilter.value)
})

const filteredOrders = computed(() => {
  const base = ordersByCurrency.value
  const byStatus = statusFilter.value === 'all' ? base : base.filter(o => String(o.status || '').toLowerCase() === statusFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return byStatus
  return byStatus.filter(o => `#${o.id}`.includes(q) || String(o.status).toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / perPage.value)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredOrders.value.slice(start, start + perPage.value)
})

watch([filteredOrders, perPage], () => { currentPage.value = 1 })

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const paidCount = computed(() => ordersByCurrency.value.filter(o => String(o.status).toLowerCase() === 'paid').length)
const pendingCount = computed(() => ordersByCurrency.value.filter(o => String(o.status).toLowerCase() === 'pending').length)
const failedCount = computed(() => ordersByCurrency.value.filter(o => ['failed','cancelled'].includes(String(o.status).toLowerCase())).length)

const getStatusLabel = (s: any) => {
  const k = String(s || '').toLowerCase()
  if (k === 'paid') return 'payée'
  if (k === 'pending') return 'en attente'
  if (k === 'failed') return 'échouée'
  if (k === 'cancelled') return 'annulée'
  return k
}

const paidStatsByCurrency = computed<Record<string, { amount: number; count: number; commission: number }>>(() => {
  const totals: Record<string, { amount: number; count: number; commission: number }> = {}
  const list = orders.value || []
  for (const o of list) {
    const isPaid = String(o.status || '').toLowerCase() === 'paid'
    if (!isPaid) continue
    const cur = (o as any).currency || 'CDF'
    if (currencyFilter.value !== 'all' && cur !== currencyFilter.value) continue
    const amt = Number((o as any).totalAmount || 0)
    if (!Number.isFinite(amt)) continue
    if (!totals[cur]) totals[cur] = { amount: 0, count: 0, commission: 0 }
    // Commission: somme (unitPrice * quantity * commissionRate/100) des items
    let orderCommission = 0
    const items = (o as any).items || []
    for (const it of items) {
      const rate = Number((it as any).commissionRate ?? 0)
      const unit = Number((it as any).unitPrice ?? 0)
      const qty = Number((it as any).quantity ?? 0)
      if (Number.isFinite(rate) && Number.isFinite(unit) && Number.isFinite(qty)) {
        orderCommission += unit * qty * (rate / 100)
      }
    }
    totals[cur].amount += amt
    totals[cur].count += 1
    totals[cur].commission += orderCommission
  }
  return totals
})

const formatAmount = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n)
const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

const showPayments = ref(false)
const paymentsLoading = ref(false)
const currentPayments = ref<Payment[]>([])
let currentOrderId: number | null = null

const { getEventOrders, getOrderPayments } = useOrders()

// Déclencher un rafraîchissement côté client au montage
onMounted(() => {
  refreshOrders()
})

const openPayments = async (order: any) => {
  currentOrderId = order.id
  showPayments.value = true
  paymentsLoading.value = true
  try {
    currentPayments.value = await getOrderPayments(eventId, order.id, { per_page: 50 })
  } catch (_e) {
    // L'API a déjà affiché un toast via customFetch; éviter l'erreur non interceptée
    currentPayments.value = []
  } finally {
    paymentsLoading.value = false
  }
}
</script>


