<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Connexion à votre compte
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          créez un nouveau compte
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Affichage des erreurs générales -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erreur de connexion</h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ generalError }}
                </div>
              </div>
            </div>
          </div>

          <!-- Champ identifiant -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">
              Email ou téléphone
            </label>
            <div class="mt-1">
              <input
                id="identifier"
                v-model="form.identifier"
                name="identifier"
                type="text"
                required
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                  fieldErrors.identifier ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Entrez votre email ou téléphone"
              />
            </div>
            <p v-if="fieldErrors.identifier" class="mt-2 text-sm text-red-600">
              {{ fieldErrors.identifier }}
            </p>
          </div>

          <!-- Champ mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                  fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Entrez votre mot de passe"
              />
            </div>
            <p v-if="fieldErrors.password" class="mt-2 text-sm text-red-600">
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Bouton de connexion -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '../composables/useAuth'

// Définition des types
interface LoginForm {
  identifier: string
  password: string
}

// Composables
const auth = useAuth()

// État du formulaire
const form = reactive<LoginForm>({
  identifier: '',
  password: ''
})

// État de l'interface
const isLoading = ref(false)
const generalError = ref('')
const fieldErrors = reactive({
  identifier: '',
  password: ''
})

// Validation du formulaire
const validateForm = (): boolean => {
  let isValid = true
  
  // Reset des erreurs
  fieldErrors.identifier = ''
  fieldErrors.password = ''
  generalError.value = ''
  
  // Validation de l'identifiant
  if (!form.identifier.trim()) {
    fieldErrors.identifier = 'Email ou téléphone requis'
    isValid = false
  }
  
  // Validation du mot de passe
  if (!form.password) {
    fieldErrors.password = 'Mot de passe requis'
    isValid = false
  }
  
  return isValid
}

// Gestion de la connexion
const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    generalError.value = ''
    
    const result = await auth.login(form.identifier, form.password)
    
    if (result.success) {
      // Redirection vers la page d'accueil
      await navigateTo('/')
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    
    // Gestion des erreurs de validation
    if (error.status === 422 && error.data?.errors) {
      const errors = error.data.errors
      
      // Mise à jour des erreurs de champs
      if (errors.identifier) {
        fieldErrors.identifier = errors.identifier[0]
      }
      if (errors.password) {
        fieldErrors.password = errors.password[0]
      }
    } else {
      // Erreur générale
      generalError.value = error.message || 'Erreur de connexion'
    }
  } finally {
    isLoading.value = false
  }
}

// Meta de la page
definePageMeta({
  title: 'Connexion - Biso Ticket',
  layout: 'default',
  middleware: ['guest']
})
</script>

<style scoped>
/* Optimisations pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .transition-colors,
  .animate-spin {
    transition: none;
    animation: none;
  }
}
</style>
