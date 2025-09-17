<template>
  <div class=" h-full md:py-36 py-16  flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <!-- User Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Logo
              class="w-10  object-cover"
            />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Connexion</h1>
          <p class="text-gray-600">Entrez vos identifiants pour accéder à votre compte.</p>
        </div>

     

        <!-- Bouton Google -->
        <div class="mb-6">
          <GoogleLoginButton />
        </div>

        

        <!-- Séparateur -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email ou Téléphone -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
              Email ou Téléphone <span class="text-red-500">*</span>
            </label>
            <UInput
              id="identifier"
              v-model="identifier"
              autocomplete="email|phone"
              type="text"
              required
              placeholder="Email ou téléphone"
              class="w-full  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div class="relative">
              <UInput
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Entrez votre mot de passe"
                class="w-full  pr-10  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                aria-label="Afficher/Masquer le mot de passe"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
                  se souvenir de moi   
            </label>
          </div>

          <!-- Submit Button -->
          <UButton
            type="submit"
            block
            color="primary"
            size="lg"
            :disabled="!identifier || !password"
            :loading="isLoading"
            icon="i-heroicons-arrow-right-16-solid"
          >
            Se connecter
          </UButton>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-500 text-sm">Pas de compte ?
            <NuxtLink to="/inscription" class="text-primary-600 hover:text-primary-500 font-medium">S'inscrire</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Meta de la page
definePageMeta({
  middleware: ['guest']
})

// SEO pour la page de connexion
import { useSEO } from '~/composables/useSEO'
import { useAuthRedirect } from '~/composables/useAuthRedirect'
const { setAuthSEO } = useSEO()
setAuthSEO('login')

// State
const identifier = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
const phoneIntl = /^\+?[1-9][0-9]{6,14}$/
const isDev = process.dev

// Composables
const { login } = useAuth()
const { redirectAfterAuth } = useAuthRedirect()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Import explicite du composant GoogleLoginButton
import GoogleLoginButton from '~/components/GoogleLoginButton.vue'

// Variable pour afficher le debug (temporaire)
const showDebug = ref(true) // Changez à false en production

// Extrait un message lisible depuis les erreurs ofetch/backend (incl. 422)
const extractErrorMessage = (e: any): string => {
  // Formats possibles: e.data.message, e.response._data.message, e.message
  const direct = e?.data?.message || e?.response?._data?.message || e?.message
  if (direct) return String(direct)
  // Si erreurs de validation: prendre la première
  const errors = (e?.data?.errors || e?.response?._data?.errors) as Record<string, unknown> | undefined
  if (errors && typeof errors === 'object') {
    const keys = Object.keys(errors)
    const firstKey = keys.length ? keys[0] : undefined
    const firstVal = firstKey ? (errors as Record<string, unknown>)[firstKey] : undefined
    if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
    if (typeof firstVal === 'string') return firstVal
  }
  return 'Une erreur est survenue.'
}

const handleSubmit = async () => {
  try {
    if (!identifier.value || !password.value) {
      toast.add({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', color: 'warning' })
      return
    }
    const value = identifier.value.trim()
    const isEmail = emailRegex.test(value)
    const isPhone = phoneIntl.test(value.replace(/\s/g, ''))
    if (!isEmail && !isPhone) {
      toast.add({ title: 'Identifiant invalide', description: 'Saisissez un email ou un numéro de téléphone valide.', color: 'error' })
      return
    }
    isLoading.value = true
    await login({ identifier: value, password: password.value.trim() })
    await redirectAfterAuth()
  } catch (err: any) {
    const message = extractErrorMessage(err)
    toast.add({ title: 'Connexion échouée', description: message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}

// Gestion des erreurs Google
const handleGoogleError = (error: string) => {
  toast.add({ title: 'Erreur Google', description: error, color: 'error' })
}

// Gestion du succès Google
const handleGoogleSuccess = (user: any) => {
  console.log('Connexion Google réussie:', user)
  // La redirection est gérée automatiquement dans le composant
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
