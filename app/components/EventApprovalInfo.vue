<template>
  <div v-if="event?.approvedAt" class="bg-green-50 border border-green-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-green-800 mb-1">
          Événement approuvé
        </h3>
        <p class="text-sm text-green-700 mb-2">
          Votre événement a été approuvé et peut maintenant vendre des billets.
        </p>
        <div class="text-xs text-green-600">
          <div class="flex flex-wrap gap-4">
            <span>
              <strong>Approuvé le :</strong> {{ formattedApprovalDate }}
            </span>
            <span v-if="approvalTimeAgo">
              <strong>Temps écoulé :</strong> {{ approvalTimeAgo }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  event: any
}

const props = defineProps<Props>()

// Utilisation du composable pour la logique d'approbation
const { formatApprovalDate, getApprovalTimeAgo } = useEventApproval()

// Computed properties
const formattedApprovalDate = computed(() => formatApprovalDate(props.event?.approvedAt || ''))
const approvalTimeAgo = computed(() => getApprovalTimeAgo(props.event?.approvedAt || ''))
</script>
