<template>
  <UAlert
    v-if="!isEventApproved"
    color="warning"
    variant="soft"
    :title="bannerTitle"
    :description="bannerMessage"
    icon="i-heroicons-exclamation-triangle"
  >
    <template #actions>
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <UButton
          to="/contact"
          variant="ghost"
          color="warning"
          size="sm"
          class="justify-start"
        >
          <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2" />
          Contacter le support
        </UButton>
        <div class="text-xs text-warning-600 flex flex-wrap items-center gap-1">
          <span>Statut actuel : {{ eventStatusLabel }}</span>
          <span v-if="approvalStatus" class="flex items-center gap-1">
            <span>•</span>
            <span>Validation : {{ approvalStatusLabel }}</span>
          </span>
          <span v-if="formattedApprovalDate" class="flex items-center gap-1">
            <span>•</span>
            <span>Approuvé le : {{ formattedApprovalDate }}</span>
            <span v-if="approvalTimeAgo" class="text-warning-500">
              ({{ approvalTimeAgo }})
            </span>
          </span>
        </div>
      </div>
    </template>
  </UAlert>
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
