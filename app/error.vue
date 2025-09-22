<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

// Gestion sécurisée des erreurs avec valeurs par défaut
const errorMessage = computed(() => {
  if (!props.error) return 'Une erreur inattendue s\'est produite'
  
  // Gestion des erreurs d'hydratation
  if (props.error.message?.includes('Hydration') || props.error.message?.includes('mismatch')) {
    return 'Erreur de chargement de la page'
  }
  
  switch (props.error.statusCode) {
    case 404:
      return 'Page non trouvée'
    case 403:
      return 'Accès interdit'
    case 500:
      return 'Erreur serveur interne'
    default:
      return props.error.message || 'Une erreur s\'est produite'
  }
})

const handleGoHome = () => {
  if (props.error) {
    clearError()
  }
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white">
    <div class="text-center max-w-sm">
      <!-- Code d'erreur -->
      <h1 v-if="error?.statusCode" class="text-8xl font-light text-gray-300 mb-4">
        {{ error.statusCode }}
      </h1>
      
      <!-- Message d'erreur -->
      <p class="text-xl text-gray-600 mb-8">
        {{ errorMessage }}
      </p>
      
      <!-- Bouton d'action -->
      <button
        @click="handleGoHome"
        class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Animation simple */
.min-h-screen {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
