<template>
  <OrganizerNavigation>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Rapport global</h1>
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
        <LoadingOverlay :show="pending" title="Chargement du rapport global..." description="Veuillez patienter" color="primary" :size="48" />
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">{{ error }}</div>
        <div v-else-if="report" ref="reportRef" class="space-y-6">
          <UCard>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Utilisateurs</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.users_total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Événements</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.events_total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Paiements validés</div>
                <div class="text-xl font-semibold text-primary-600">{{ report.kpis?.payments_paid_total ?? '—' }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div class="text-xs text-gray-500">Chiffre d’affaires (période)</div>
                <div class="text-xl font-semibold text-gray-900">{{ report.kpis?.revenue_period ?? '—' }} {{ filters.currency }}</div>
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
            <h3 class="text-base font-semibold text-gray-900 mb-3">Commissions (période)</h3>
            <div class="rounded-lg border border-gray-200 p-4 bg-gray-50">
              <div class="text-xs text-gray-500">Total commissions</div>
              <div class="text-xl font-semibold text-gray-900">{{ report.commissions?.commission_revenue_period ?? '—' }} {{ filters.currency }}</div>
            </div>
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

const filters = reactive<{ period: 'day'|'7d'|'30d'|'custom'; currency: 'USD'|'CDF'; from?: string; to?: string }>({ period: '7d', currency: 'CDF' })
const report = ref<any | null>(null)
const error = ref<string | null>(null)
const reportRef = ref<HTMLElement | null>(null)
const { $pdfMake } = useNuxtApp()

const { fetchGlobalReportSummary } = useOrganizerEvents()

const { pending, refresh } = await useAsyncData('organizer-global-report', async () => {
  try {
    error.value = null
    const params: any = { period: filters.period, currency: filters.currency }
    if (filters.period === 'custom') {
      params.from = filters.from
      params.to = filters.to
    }
    const res = await fetchGlobalReportSummary(params)
    report.value = res?.data ?? res
    return report.value
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors du chargement du rapport global'
    return null
  }
}, { server: false })

let refreshTimer: any = null
const scheduleRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => { refresh() }, 250)
}
watch(() => filters.currency, scheduleRefresh)
watch(() => filters.period, (p) => { if (p === 'custom') { if (filters.from && filters.to) scheduleRefresh() } else scheduleRefresh() })
watch(() => [filters.from, filters.to], ([from, to]) => { if (filters.period === 'custom' && from && to) scheduleRefresh() })

const formatNumber = (n: number | string | undefined) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v)
}

const exportPdf = () => {
  try {
    if ($pdfMake && report.value) {
      const nowStr = new Date().toLocaleString('fr-FR')
      const k = report.value.kpis || {}
      const inv = report.value.invitations || {}
      const sc = report.value.scans || {}
      const comm = report.value.commissions || {}
      const trend = Array.isArray(report.value.trend7d) ? report.value.trend7d : []
      const cur = report.value?.filters?.currency || filters.currency

      const table = (rows: any[]) => ({
        table: {
          headerRows: 1,
          widths: ['*', 'auto'],
          body: [
            [ { text: 'Indicateur', bold: true }, { text: 'Valeur', bold: true, alignment: 'right' } ],
            ...rows.map(r => [ r[0], { text: String(r[1]), alignment: 'right' } ])
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? '#f3f4f6' : undefined)
        }
      })

      const docDefinition: any = {
        pageMargins: [40, 60, 40, 60],
        defaultStyle: { fontSize: 10, lineHeight: 1.2 },
        content: [
          { text: 'Biso Ticket — Rapport global', style: 'header' },
          { text: `Période: ${report.value?.filters?.period || filters.period}   •   Devise: ${cur}`, color: '#6b7280', margin: [0, 0, 0, 12] },

          { text: 'KPIs', style: 'section' },
          table([
            ['Utilisateurs', formatNumber(k.users_total)],
            ['Événements', formatNumber(k.events_total)],
            ['Paiements validés', formatNumber(k.payments_paid_total)],
            ['Chiffre d’affaires (période)', `${formatNumber(k.revenue_period)} ${cur}`]
          ]),

          { text: 'Invitations', style: 'section' },
          table([
            ['Total', formatNumber(inv.total)],
            ['En attente', formatNumber(inv.pending)],
            ['Envoyées', formatNumber(inv.sent)],
            ['Vues', formatNumber(inv.viewed)],
            ['Confirmées', formatNumber(inv.confirmed)],
            ['Créées (période)', formatNumber(inv.created_period)],
            ['Confirmées (période)', formatNumber(inv.confirmed_period)],
            ['Conversion / Vue', `${formatNumber(inv.conversion_rate)}% / ${formatNumber(inv.view_rate)}%`]
          ]),

          { text: 'Tendance (7 jours)', style: 'section' },
          (trend.length ? {
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [ { text: 'Date', bold: true }, { text: 'Total', bold: true, alignment: 'right' } ],
                ...trend.map((t: any) => [ t.date, { text: String(t.total), alignment: 'right' } ])
              ]
            },
            layout: { fillColor: (rowIndex: number) => (rowIndex === 0 ? '#f3f4f6' : undefined) }
          } : { text: 'Aucune donnée', italics: true, color: '#6b7280' }),

          { text: 'Scans', style: 'section' },
          table([
            ['Total scans', formatNumber(sc.total)],
            ['Valides', formatNumber(sc.valid_period)],
            ['Doublons', formatNumber(sc.duplicate_period)],
            ['Invalides', formatNumber(sc.invalid_period)],
            ['Tentatives', formatNumber(sc.attempts_period)]
          ]),

          { text: 'Commissions (période)', style: 'section' },
          table([
            ['Total commissions', `${formatNumber(comm.commission_revenue_period)} ${cur}`]
          ])
        ],
        styles: {
          header: { fontSize: 18, bold: true, color: '#111827' },
          section: { fontSize: 13, bold: true, color: '#111827', margin: [0, 8, 0, 6] }
        },
        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            { text: `Page ${currentPage}/${pageCount}`, alignment: 'left', fontSize: 8, margin: [40, 0, 0, 0] },
            { text: `Rapport généré par Biso Ticket - ${nowStr}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
          ]
        })
      }

      const filename = `rapport-global-${new Date().toISOString().slice(0,10)}.pdf`
      $pdfMake.createPdf(docDefinition).download(filename)
      return
    }
    window.print()
  } catch {
    window.print()
  }
}
</script>
