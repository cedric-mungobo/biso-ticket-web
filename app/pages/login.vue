<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Biso Ticket</h1>
        <p class="text-gray-600">Connectez-vous à votre compte</p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email/Phone -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-2">
              Email ou Téléphone
            </label>
            <input
              id="identifier"
              v-model="credentials.identifier"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.identifier }"
              placeholder="john@example.com ou +243123456789"
              :disabled="isLoading"
            />
            <p v-if="errors.identifier" class="mt-1 text-sm text-red-600">
              {{ errors.identifier }}
            </p>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
                placeholder="Votre mot de passe"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                :disabled="isLoading"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Erreur générale -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-600">{{ generalError }}</p>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <!-- Liens utiles -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte ?
            <NuxtLink to="/register" class="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
              Créer un compte
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Définition des types
interface LoginCredentials {
  identifier: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      phone_number: string
      role: string
    }
    token: string
    token_type: string
  }
}

// État du composant
const credentials = reactive<LoginCredentials>({
  identifier: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const generalError = ref('')
const errors = reactive({
  identifier: '',
  password: ''
})

// Gestion de la connexion
const handleLogin = async () => {
  // Reset des erreurs
  errors.identifier = ''
  errors.password = ''
  generalError.value = ''
  
  // Validation
  if (!credentials.identifier.trim()) {
    errors.identifier = 'L\'email ou téléphone est requis'
    return
  }
  
  if (!credentials.password.trim()) {
    errors.password = 'Le mot de passe est requis'
    return
  }

  isLoading.value = true

  try {
    const { login } = useAuth()
    const result = await login(credentials.identifier, credentials.password)

    if (result.success) {
      // Redirection vers la page d'accueil
      await navigateTo('/')
    } else {
      generalError.value = result.message || 'Erreur de connexion'
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    
    if (error.status === 401) {
      generalError.value = 'Email/téléphone ou mot de passe incorrect'
    } else if (error.status === 422) {
      // Erreurs de validation
      if (error.data?.errors) {
        Object.keys(error.data.errors).forEach(key => {
          if (key === 'identifier') {
            errors.identifier = error.data.errors[key][0]
          } else if (key === 'password') {
            errors.password = error.data.errors[key][0]
          }
        })
      }
    } else {
      generalError.value = 'Erreur de connexion. Veuillez réessayer.'
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
