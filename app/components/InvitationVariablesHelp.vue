<template>
  <div class="space-y-4">
    <!-- Variables dynamiques -->
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 mr-2 text-blue-500" />
        Variables dynamiques
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div v-for="variable in availableVariables" :key="variable.key" class="flex items-start">
          <code class="bg-white px-2 py-1 rounded border text-blue-600 font-mono text-xs mr-2 flex-shrink-0">
            [{{ variable.key }}]
          </code>
          <div class="flex-1 min-w-0">
            <div class="text-gray-600 font-medium">{{ variable.label }}</div>
            <div class="text-gray-500 text-xs">{{ variable.example }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Options de formatage -->
    <InvitationFormattingHelp />
    
    <div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
      <div class="text-xs text-amber-700">
        <UIcon name="i-heroicons-light-bulb" class="w-3 h-3 mr-1 inline" />
        <strong>Astuce :</strong> Combinez les variables dynamiques avec les options de formatage pour créer des invitations personnalisées !
        <br>Exemple : <code class="bg-white px-1 rounded">[**GUEST_NAME**]</code> affichera le nom en gras.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInvitationVariables } from '~/composables/useInvitationVariables'

// Récupérer les variables disponibles
const { getAvailableVariables } = useInvitationVariables({})
const availableVariables = getAvailableVariables()
</script>
