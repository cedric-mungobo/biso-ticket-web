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
    <div class="space-y-2">
      <div
        v-for="(errors, field) in validationErrors"
        :key="field"
        class="text-sm"
      >
        <div class="font-medium text-red-800">
          <strong>{{ field }}:</strong>
        </div>
        <ul class="ml-4 list-disc list-inside space-y-1">
          <li
            v-for="error in errors"
            :key="error"
            class="text-red-700"
          >
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Accéder aux erreurs de validation globales
const { $validationErrors, $hasValidationErrors, $clearValidationErrors } = useNuxtApp()

const validationErrors = $validationErrors as Ref<Record<string, string[]>>
const hasValidationErrors = $hasValidationErrors as ComputedRef<boolean>
const clearValidationErrors = $clearValidationErrors as () => void

// Debug: Log des erreurs
watch(validationErrors, (newErrors) => {
  console.log('ValidationErrorsAlert - Errors changed:', newErrors)
}, { deep: true })

watch(hasValidationErrors, (hasErrors) => {
  console.log('ValidationErrorsAlert - Has errors:', hasErrors)
  console.log('ValidationErrorsAlert - Should show alert:', hasErrors)
})

// Fonction pour fermer l'alerte
const clearErrors = () => {
  clearValidationErrors()
}
</script>
