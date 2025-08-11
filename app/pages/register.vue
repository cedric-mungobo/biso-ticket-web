<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Biso Ticket</h1>
        <p class="text-gray-600">Créez votre compte</p>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Nom complet -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
              placeholder="John Doe"
              :disabled="isLoading"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <!-- Téléphone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.phone }"
              placeholder="+243123456789"
              :disabled="isLoading"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
              placeholder="john@example.com"
              :disabled="isLoading"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
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
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
                placeholder="Minimum 8 caractères"
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
            <p class="mt-1 text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          <!-- Confirmation du mot de passe -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              v-model="formData.password_confirmation"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password_confirmation }"
              placeholder="Répétez votre mot de passe"
              :disabled="isLoading"
            />
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
              {{ errors.password_confirmation }}
            </p>
          </div>

          <!-- Affichage des erreurs -->
          <ErrorDisplay
            :general-error="generalError"
            :validation-errors="validationErrors"
            :show-error-code="false"
            error-title="Erreur d'inscription"
          />

          <!-- Bouton d'inscription -->
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
              Création en cours...
            </span>
            <span v-else>Créer mon compte</span>
          </button>
        </form>

        <!-- Liens utiles -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Déjà un compte ?
            <NuxtLink to="/login" class="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
              Se connecter
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useErrorHandler } from '../composables/useErrorHandler'
import type { ValidationError } from '../types/errors'

// Définition des types
interface RegisterFormData {
  name: string
  phone: string
  email: string
  password: string
  password_confirmation: string
}

interface RegisterResponse {
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
const formData = reactive<RegisterFormData>({
  name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const generalError = ref('')
const errors = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const validationErrors = ref<ValidationError[]>([])

// Validation en temps réel
const isFormValid = computed(() => {
  return formData.name.trim() && 
         formData.phone.trim() && 
         formData.email.trim() && 
         formData.password.length >= 8 && 
         formData.password === formData.password_confirmation
})

// Validation du téléphone
const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Validation de l'email
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Gestion de l'inscription
const handleRegister = async () => {
  // Reset des erreurs
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  generalError.value = ''
  
  // Validation côté client
  let hasErrors = false
  
  if (!formData.name.trim()) {
    errors.name = 'Le nom est requis'
    hasErrors = true
  }
  
  if (!formData.phone.trim()) {
    errors.phone = 'Le numéro de téléphone est requis'
    hasErrors = true
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Format de téléphone invalide'
    hasErrors = true
  }
  
  if (!formData.email.trim()) {
    errors.email = 'L\'email est requis'
    hasErrors = true
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Format d\'email invalide'
    hasErrors = true
  }
  
  if (formData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    hasErrors = true
  }
  
  if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas'
    hasErrors = true
  }
  
  if (hasErrors) return

  isLoading.value = true

  try {
    const { register } = useAuth()
    const result = await register({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      password_confirmation: formData.password_confirmation
    })

    if (result.success) {
      // Message de succès et redirection
      // Note: Vous pourriez vouloir afficher un toast de succès ici
      await navigateTo('/')
    } else {
      generalError.value = result.message || 'Erreur lors de la création du compte'
    }
  } catch (error: any) {
    // Utilisation du gestionnaire d'erreurs centralisé
    const { handleError, handleValidationErrors, getFieldError } = useErrorHandler()
    
    // Gestion des erreurs de validation
    if (error.status === 422 && error.data?.errors) {
      const validationErrorsList = handleValidationErrors(error.data.errors)
      validationErrors.value = validationErrorsList
      
      // Mise à jour des erreurs de champs
      Object.keys(error.data.errors).forEach(key => {
        if (key in errors) {
          errors[key as keyof typeof errors] = getFieldError(key) || error.data.errors[key][0]
        }
      })
    } else {
      // Gestion des autres types d'erreurs
      const errorInfo = handleError(error, {
        showToast: false, // Pas de toast car on affiche déjà l'erreur dans l'UI
        logToConsole: true,
        redirectOnAuthError: false
      })
      
      // Affichage de l'erreur générale
      generalError.value = errorInfo.message
    }
  } finally {
    isLoading.value = false
  }
}

// Meta de la page
definePageMeta({
  title: 'Inscription - Biso Ticket',
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
