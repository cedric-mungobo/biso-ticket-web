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
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Rapport — {{ eventTitle || '…' }}</h1>
      </div>

      <UCard class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label class="block text-sm text-gray-700">Période</label>
            <select v-model="filters.period" class="rounded-lg border border-gray-300 px-3 py-1 w-full">
              <option value="day">Aujourd'hui</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="custom">Personnalisée</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-700">Devise</label>
            <select v-model="filters.currency" class="rounded-lg border border-gray-300 px-3 py-1 w-full">
              <option value="CDF">CDF</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <div v-if="filters.period==='custom'" class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm text-gray-700">De</label>
                <input type="date" v-model="filters.from" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-700">À</label>
                <input type="date" v-model="filters.to" class="rounded-lg border border-gray-300 px-3 py-1 w-full" />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 sm:justify-end">
            <UButton color="neutral" variant="soft" @click="exportPdf">
              <UIcon name="i-heroicons-printer" class="w-4 h-4 mr-2" /> Exporter PDF
            </UButton>
            <UButton color="primary" :loading="pending" @click="refresh">Actualiser</UButton>
          </div>
        </div>
      </UCard>

      <div class="mt-6">
        <LoadingOverlay :show="pending" title="Chargement du rapport..." description="Veuillez patienter" color="primary" :size="48" />
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">{{ error }}</div>
        <div v-else-if="report" ref="reportRef" class="space-y-6">
          <UCard>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Paiements validés</div>
                <div class="text-xl font-semibold text-primary-600">{{ report.kpis?.payments_paid_total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Chiffre d’affaires (période)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.revenue_period ?? '—' }} {{ filters.currency }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tickets vendus (total)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.tickets_sold_total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tickets vendus (période)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.tickets_sold_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tickets payés (période)</div>
                <div class="text-xl font-semibold text-green-600">{{ report.kpis?.tickets_paid_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tickets échoués (période)</div>
                <div class="text-xl font-semibold text-red-600">{{ report.kpis?.tickets_failed_period ?? '—' }}</div>
              </div>
            </div>
          </UCard>

          <UCard>
            <h3 class="text-base font-semibold text-gray-900 mb-3">Tendance (7j)</h3>
           
            <div v-if="Array.isArray(report.trend7d) && report.trend7d.length" class="space-y-2">
              <div v-for="t in report.trend7d" :key="t.date" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ t.date }}</span>
                <span class="text-sm font-medium text-gray-900">{{ t.total }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">Aucune donnée</div>
          </UCard>

          <UCard>
            <h3 class="text-base font-semibold text-gray-900 mb-3">Scans (période)</h3>
            <div v-if="report.scans" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Total scans</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.scans.total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Valides</div>
                <div class="text-xl font-semibold text-green-600">{{ report.scans.valid_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Doublons</div>
                <div class="text-xl font-semibold text-amber-600">{{ report.scans.duplicate_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Invalides</div>
                <div class="text-xl font-semibold text-red-600">{{ report.scans.invalid_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tentatives</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.scans.attempts_period ?? '—' }}</div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">Aucune donnée de scans</div>
          </UCard>

          <UCard>
            <h3 class="text-base font-semibold text-gray-900 mb-3">Invitations</h3>
            <div v-if="report.invitations" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Total</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.invitations.total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">En attente</div>
                <div class="text-xl font-semibold text-amber-600">{{ report.invitations.pending ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Envoyées</div>
                <div class="text-xl font-semibold text-primary-600">{{ report.invitations.sent ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Vues</div>
                <div class="text-xl font-semibold text-blue-600">{{ report.invitations.viewed ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Confirmées</div>
                <div class="text-xl font-semibold text-green-600">{{ report.invitations.confirmed ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Créées (période)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.invitations.created_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Confirmées (période)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.invitations.confirmed_period ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Tx conversion / vue</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ report.invitations.conversion_rate ?? '—' }}% · {{ report.invitations.view_rate ?? '—' }}%
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">Aucune donnée d'invitations</div>
          </UCard>

          <UCard>
            <h3 class="text-base font-semibold text-gray-900 mb-3">Commissions (période)</h3>
            <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
              <div class="text-xs text-gray-500">Total commissions</div>
              <div class="text-xl font-semibold text-gray-900">{{ report.commissions?.commission_revenue_period ?? '—' }} {{ filters.currency }}</div>
            </div>
          </UCard>

          <UCard>
            <h3 class="text-base font-semibold text-gray-900 mb-3">Paiements récents</h3>
            <div v-if="report.recent?.payments && report.recent.payments.length" class="overflow-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-600 border-b">
                    <th class="py-2 pr-4">ID</th>
                    <th class="py-2 pr-4">Méthode</th>
                    <th class="py-2 pr-4">Montant</th>
                    <th class="py-2 pr-4">Statut</th>
                    <th class="py-2 pr-4">Payé le</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in report.recent.payments" :key="p.id" class="border-b last:border-0">
                    <td class="py-2 pr-4 font-medium">#{{ p.id }}</td>
                    <td class="py-2 pr-4">{{ p.method }}</td>
                    <td class="py-2 pr-4">{{ p.amount }} {{ p.currency || filters.currency }}</td>
                    <td class="py-2 pr-4 capitalize">{{ p.status }}</td>
                    <td class="py-2 pr-4">{{ formatDateTime(p.paidAt || p.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-sm text-gray-500">Aucun paiement récent</div>
          </UCard>

          <div v-if="report.filters" class="text-xs text-gray-500">
            Filtres: période {{ report.filters.period || filters.period }}, devise {{ report.filters.currency || filters.currency }}
          </div>
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

const filters = reactive<{ period: 'day'|'7d'|'30d'|'custom'; currency: 'USD'|'CDF'; from?: string; to?: string }>({ period: '7d', currency: 'CDF' })

const report = ref<any | null>(null)
const error = ref<string | null>(null)
const reportRef = ref<HTMLElement | null>(null)
const { $pdfMake } = useNuxtApp()

// Charger le titre de l'événement
const { fetchEventWithState, currentEvent } = useOrganizerEvents()
await fetchEventWithState(eventId)
const eventTitle = computed(() => (currentEvent.value?.name || currentEvent.value?.title || '').trim())

const { fetchEventReportSummary } = useOrganizerEvents()

const { pending, refresh } = await useAsyncData(`organizer-event-${eventId}-report`, async () => {
  try {
    error.value = null
    const params: any = { period: filters.period, currency: filters.currency }
    if (filters.period === 'custom') {
      params.from = filters.from
      params.to = filters.to
    }
    const res = await fetchEventReportSummary(eventId, params)
    report.value = res?.data ?? res
    return report.value
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors du chargement du rapport'
    return null
  }
}, { server: false })

const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

const formatNumber = (n: number | string | undefined) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v)
}

const slugify = (s: string) => (s || '')
  .toLowerCase()
  .normalize('NFD').replace(/\p{Diacritic}+/gu, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '')

// Auto-refresh sur changement de filtres
let refreshTimer: any = null
const scheduleRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    refresh()
  }, 250)
}

watch(() => filters.currency, () => {
  scheduleRefresh()
})

watch(() => filters.period, (p) => {
  if (p === 'custom') {
    if (filters.from && filters.to) scheduleRefresh()
  } else {
    scheduleRefresh()
  }
})

watch(() => [filters.from, filters.to], ([from, to]) => {
  if (filters.period === 'custom' && from && to) scheduleRefresh()
})

// Export PDF via impression de la section du rapport
const exportPdf = () => {
  try {
    // Si pdfmake est disponible via nuxt-pdfmake → génération PDF avec mise en page soignée
    if ($pdfMake && report.value) {
      const nowStr = new Date().toLocaleString('fr-FR')
      const k = report.value.kpis || {}
      const inv = report.value.invitations || {}
      const sc = report.value.scans || {}
      const comm = report.value.commissions || {}
      const trend = Array.isArray(report.value.trend7d) ? report.value.trend7d : []
      const cur = report.value?.filters?.currency || filters.currency

      const kpiLeftRows = [
        ['Paiements validés', formatNumber(k.payments_paid_total)],
        ['Chiffre d’affaires (période)', `${formatNumber(k.revenue_period)} ${cur}`],
        ['Tickets vendus (total)', formatNumber(k.tickets_sold_total)],
        ['Tickets vendus (période)', formatNumber(k.tickets_sold_period)],
        ['Tickets payés (période)', formatNumber(k.tickets_paid_period)],
        ['Tickets échoués (période)', formatNumber(k.tickets_failed_period)]
      ]
      const kpiRightRows = [
        ['Scans total', formatNumber(sc.total)],
        ['Scans valides', formatNumber(sc.valid_period)],
        ['Scans doublons', formatNumber(sc.duplicate_period)],
        ['Scans invalides', formatNumber(sc.invalid_period)],
        ['Scans tentatives', formatNumber(sc.attempts_period)]
      ]

      const invitationsRows = [
        ['Total', formatNumber(inv.total)],
        ['En attente', formatNumber(inv.pending)],
        ['Envoyées', formatNumber(inv.sent)],
        ['Vues', formatNumber(inv.viewed)],
        ['Confirmées', formatNumber(inv.confirmed)],
        ['Créées (période)', formatNumber(inv.created_period)],
        ['Confirmées (période)', formatNumber(inv.confirmed_period)],
        ['Conversion / Vue', `${formatNumber(inv.conversion_rate)}% / ${formatNumber(inv.view_rate)}%`]
      ]

      const tableWithHeader = (rows: any[]) => ({
        table: {
          headerRows: 1,
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Indicateur', style: 'th' },
              { text: 'Valeur', style: 'th', alignment: 'right' }
            ],
            ...rows.map(r => [ { text: r[0], style: 'tdLabel' }, { text: String(r[1]), style: 'tdValue', alignment: 'right' } ])
          ]
        },
        layout: {
          fillColor: (rowIndex: number, _node: any, _columnIndex: number) => (rowIndex === 0 ? '#f3f4f6' : undefined)
        }
      })

      const docDefinition: any = {
        pageMargins: [40, 60, 40, 60],
        defaultStyle: { fontSize: 10, lineHeight: 1.2 },
        content: [
          { text: `Biso Ticket — Rapport ${eventTitle.value || ''}`.trim(), style: 'header' },
          { text: `Période: ${report.value?.filters?.period || filters.period}   •   Devise: ${cur}`, style: 'meta', margin: [0, 0, 0, 14] },

          { text: 'Indicateurs clés', style: 'section' },
          {
            columns: [
              { width: '50%', stack: [ tableWithHeader(kpiLeftRows) ], margin: [0, 0, 6, 0] },
              { width: '50%', stack: [ tableWithHeader(kpiRightRows) ], margin: [6, 0, 0, 0] }
            ],
            columnGap: 12,
            margin: [0, 0, 0, 12]
          },

          { text: 'Invitations', style: 'section' },
          tableWithHeader(invitationsRows),

          { text: 'Tendance (7 jours)', style: 'section' },
          trend.length
            ? {
                table: {
                  headerRows: 1,
                  widths: ['*', 'auto'],
                  body: [
                    [ { text: 'Date', style: 'th' }, { text: 'Total', style: 'th', alignment: 'right' } ],
                    ...trend.map((t: any) => [ t.date, { text: String(t.total), alignment: 'right' } ])
                  ]
                },
                layout: {
                  fillColor: (rowIndex: number) => (rowIndex === 0 ? '#f3f4f6' : undefined)
                },
                margin: [0, 0, 0, 12]
              }
            : { text: 'Aucune donnée', italics: true, color: '#6b7280', margin: [0, 0, 0, 12] },

          { text: 'Commissions (période)', style: 'section' },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [ { text: 'Total commissions', style: 'th' }, { text: `${formatNumber(comm.commission_revenue_period)} ${cur}`, style: 'tdValue', alignment: 'right' } ]
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => (rowIndex === 0 ? '#f3f4f6' : undefined)
            }
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true, color: '#111827' },
          subheader: { fontSize: 12, color: '#374151' },
          meta: { fontSize: 9, color: '#6b7280' },
          section: { fontSize: 13, bold: true, color: '#111827', margin: [0, 8, 0, 6] },
          th: { bold: true, color: '#111827' },
          tdLabel: { color: '#374151' },
          tdValue: { bold: true, color: '#111827' }
        },
        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            { text: `Page ${currentPage}/${pageCount}`, alignment: 'left', fontSize: 8, margin: [40, 0, 0, 0] },
            { text: `Rapport généré par Biso Ticket - ${nowStr}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
          ]
        })
      }

      const titleSlug = slugify(eventTitle.value || '') || 'evenement'
      const filename = `rapport-${titleSlug}-${new Date().toISOString().slice(0,10)}.pdf`
      $pdfMake.createPdf(docDefinition).download(filename)
      return
    }

    // Fallback: impression de la section
    if (!reportRef.value) {
      window.print()
      return
    }
    const original = document.body.innerHTML
    const section = reportRef.value.innerHTML
    document.body.innerHTML = section
    window.print()
    document.body.innerHTML = original
    window.location.reload()
  } catch (_e) {
    window.print()
  }
}

</script>

<style scoped>
</style>


