<template>
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4 mr-2 text-blue-500" />
      Variables disponibles
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
    
    <div class="mt-3 pt-3 border-t border-gray-200">
      <div class="text-xs text-gray-500">
        <UIcon name="i-heroicons-light-bulb" class="w-3 h-3 mr-1 inline" />
        <strong>Astuce :</strong> Utilisez ces variables dans votre message personnalisé. Elles seront automatiquement remplacées par les vraies valeurs.
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
