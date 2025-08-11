<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-3xl font-bold text-white mb-2">Biso Ticket</h1>
        </NuxtLink>
        <p class="text-neutral-400">Créez votre compte</p>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="bg-neutral-800/50 backdrop-blur-md rounded-2xl p-8 border border-neutral-700/50">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Nom complet -->
          <div>
            <label for="name" class="block text-sm font-medium text-neutral-300 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre nom complet"
              :disabled="isLoading"
            />
          </div>

          <!-- Numéro de téléphone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-neutral-300 mb-2">
              Numéro de téléphone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: +33 6 12 34 56 78"
              :disabled="isLoading"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-300 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre adresse email"
              :disabled="isLoading"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-300 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Créez un mot de passe sécurisé"
              :disabled="isLoading"
            />
          </div>

          <!-- Confirmation du mot de passe -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-neutral-300 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirmez votre mot de passe"
              :disabled="isLoading"
            />
          </div>

          <!-- Validation des mots de passe -->
          <div v-if="form.password && form.password_confirmation" class="text-sm">
            <div v-if="passwordsMatch" class="text-green-400">
              ✓ Les mots de passe correspondent
            </div>
            <div v-else class="text-red-400">
              ✗ Les mots de passe ne correspondent pas
            </div>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="isLoading || !passwordsMatch || !isFormValid"
            class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mt-6"
          >
            <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isLoading ? 'Création du compte...' : 'Créer mon compte' }}
          </button>

          <!-- Message d'erreur -->
          <div v-if="error" class="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {{ error }}
          </div>

          <!-- Message de succès -->
          <div v-if="success" class="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            {{ success }}
          </div>
        </form>

        <!-- Lien vers la connexion -->
        <div class="mt-6 text-center">
          <p class="text-neutral-400 text-sm">
            Déjà un compte ?
            <NuxtLink to="/connexion" class="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200">
              Se connecter
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
import { ref, reactive, computed } from 'vue'

// Meta de la page
definePageMeta({
  title: 'Inscription - Biso Ticket',
  description: 'Créez votre compte Biso Ticket'
})

// État du formulaire
const form = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// État de l'interface
const error = ref('')
const success = ref('')
const isLoading = ref(false)

// Composables
const { register } = useAuth()
const router = useRouter()

// Computed properties pour la validation
const passwordsMatch = computed(() => {
  return form.password && form.password_confirmation && form.password === form.password_confirmation
})

const isFormValid = computed(() => {
  return form.name && form.phone && form.email && form.password && form.password_confirmation
})

// Gestion de l'inscription
const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''
    isLoading.value = true
    
    if (!passwordsMatch.value) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }

    const result = await register({
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    
    if (result.success) {
      success.value = 'Compte créé avec succès ! Redirection...'
      
      // Redirection vers la page d'accueil après 2 secondes
      setTimeout(async () => {
        await router.push('/')
      }, 2000)
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de l\'inscription'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
