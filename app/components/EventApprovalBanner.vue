<template>
  <div v-if="!isEventApproved" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-amber-800 mb-1">
          {{ bannerTitle }}
        </h3>
        <p class="text-sm text-amber-700 mb-3">
          {{ bannerMessage }}
        </p>
        <div class="flex flex-col sm:flex-row gap-2">
          <NuxtLink 
            to="/contact"
            class="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contacter le support
          </NuxtLink>
          <span class="text-xs text-amber-600">
            Statut actuel : {{ eventStatusLabel }}
            <span v-if="approvalStatus" class="ml-2">
              • Validation : {{ approvalStatusLabel }}
            </span>
            <span v-if="formattedApprovalDate" class="ml-2">
              • Approuvé le : {{ formattedApprovalDate }}
              <span v-if="approvalTimeAgo" class="text-amber-500">
                ({{ approvalTimeAgo }})
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  event: any
  isEventApproved: boolean
}

const props = defineProps<Props>()

// Utilisation du composable pour la logique d'approbation
const {
  getEventStatusLabel,
  getApprovalStatusLabel,
  getApprovalBannerTitle,
  getApprovalBannerMessage,
  formatApprovalDate,
  getApprovalTimeAgo
} = useEventApproval()

// Computed properties
const eventStatusLabel = computed(() => getEventStatusLabel(props.event?.status || ''))
const approvalStatusLabel = computed(() => getApprovalStatusLabel(props.event?.approvalStatus || ''))
const bannerTitle = computed(() => getApprovalBannerTitle(props.event))
const bannerMessage = computed(() => getApprovalBannerMessage(props.event))
const approvalStatus = computed(() => props.event?.approvalStatus)
const formattedApprovalDate = computed(() => formatApprovalDate(props.event?.approvedAt || ''))
const approvalTimeAgo = computed(() => getApprovalTimeAgo(props.event?.approvedAt || ''))
</script>
