<template>
  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
      <UIcon name="i-heroicons-paint-brush" class="w-4 h-4 mr-2 text-purple-500" />
      Options de formatage
    </h4>
    
    <div class="space-y-4">
      <div v-for="category in formattingOptions" :key="category.category" class="space-y-2">
        <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ category.category }}</h5>
        <div class="grid grid-cols-1 gap-2">
          <div v-for="option in category.options" :key="option.syntax" class="flex items-start space-x-2">
            <code class="bg-white px-2 py-1 rounded border text-purple-600 font-mono text-xs flex-shrink-0 min-w-0">
              {{ option.syntax }}
            </code>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-gray-600 font-medium">{{ option.description }}</div>
              <div class="text-xs text-gray-500">{{ option.example }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 pt-3 border-t border-blue-200">
      <div class="text-xs text-blue-600">
        <UIcon name="i-heroicons-light-bulb" class="w-3 h-3 mr-1 inline" />
        <strong>Astuce :</strong> Combinez les options de formatage avec les variables dynamiques pour créer des invitations personnalisées !
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInvitationVariables } from '~/composables/useInvitationVariables'

// Récupérer les options de formatage disponibles
const { getFormattingOptions } = useInvitationVariables({})
const formattingOptions = getFormattingOptions()
</script>
