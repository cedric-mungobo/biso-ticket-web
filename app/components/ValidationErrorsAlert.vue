<template>
  <div v-if="hasValidationErrors" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
    <div class="flex items-center gap-2 mb-2">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500" />
      <h3 class="font-semibold text-red-800">
        {{ Object.keys(validationErrors).length }} erreur{{ Object.keys(validationErrors).length > 1 ? 's' : '' }} de validation
      </h3>
      <UButton
        color="error"
        variant="ghost"
        size="xs"
        @click="clearErrors"
        class="ml-auto"
      >
        Fermer
      </UButton>
    </div>
    
    <!-- Détails des erreurs -->
    <div class="space-y-1">
      <ul class="list-disc list-inside space-y-1">
        <template
          v-for="(errors, field) in validationErrors"
          :key="field"
        >
          <li
            v-for="error in errors"
            :key="error"
            class="text-red-700 text-sm"
          >
            {{ error }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Accéder aux erreurs de validation globales
const { $validationErrors, $hasValidationErrors, $clearValidationErrors } = useNuxtApp()

const validationErrors = $validationErrors as Ref<Record<string, string[]>>
const hasValidationErrors = $hasValidationErrors as ComputedRef<boolean>
const clearValidationErrors = $clearValidationErrors as () => void



// Fonction pour fermer l'alerte
const clearErrors = () => {
  clearValidationErrors()
}
</script>
