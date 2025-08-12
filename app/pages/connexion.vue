<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-3xl font-bold text-primary-500 mb-2">Biso Ticket</h1>
        </NuxtLink>
        <p class="text-primary-950">Connectez-vous à votre compte</p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="rounded-2xl p-8  border-1 border-primary-100 ">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Indentifiant -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-primary-950 mb-2">
              Email ou Téléphone
            </label>
            <input
              id="identifier"
              v-model="form.identifier"
              type="text"
              required
              class="w-full px-4 py-3  border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre email ou téléphone"
              :disabled="isLoading"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-primary-950 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3  border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre mot de passe"
              :disabled="isLoading"
            />
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <!-- Message d'erreur -->
          <div v-if="error" class="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {{ error }}
          </div>
        </form>

        <!-- Lien vers l'inscription -->
        <div class="mt-6 text-center">
          <p class="text-neutral-400 text-sm">
            Pas encore de compte ?
            <NuxtLink to="/inscription" class="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200">
              Créer un compte
            </NuxtLink>
          </p>
        </div>

        <!-- Retour à l'accueil -->
        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-neutral-500 hover:text-neutral-400 text-sm transition-colors duration-200">
            ← Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

// Meta de la page
definePageMeta({
  title: 'Connexion - Biso Ticket',
  description: 'Connectez-vous à votre compte Biso Ticket',
  middleware: ['guest']
})

// État du formulaire
const form = reactive({
  identifier: '',
  password: ''
})

// État de l'interface
const error = ref('')
const isLoading = ref(false)

// Composables
const { login, refreshSession } = useAuth()
const router = useRouter()

// Gestion de la connexion
const handleLogin = async () => {
  try {
    error.value = ''
    isLoading.value = true
    
    const result = await login(form.identifier, form.password)
    
    if (result.success) {
      // Récupérer l'URL de redirection depuis les paramètres de l'URL
      const route = useRoute()
      const redirectUrl = route.query.redirect as string
      
      // Rediriger vers la page d'origine ou vers l'accueil par défaut
      if (redirectUrl && redirectUrl !== '/connexion') {
        await router.push(decodeURIComponent(redirectUrl))
      } else {
        await router.push('/')
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
