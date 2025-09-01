<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-2xl font-bold text-primary-700 mb-2">Biso Ticket</h1>
        </NuxtLink>
        <p class="text-neutral-600">Créez votre compte</p>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="rounded-2xl p-8 shadow-xl border border-neutral-200/60 bg-white/90 backdrop-blur">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <!-- Nom complet -->
          <div>
            <label for="name" class="block text-sm font-medium text-primary-950 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre nom complet"
              :disabled="isLoading"
            />
          </div>

          <!-- Numéro de téléphone -->
          <div>
            <label for="telephone" class="block text-sm font-medium text-primary-950 mb-2">
              Numéro de téléphone
            </label>
            <input
              id="telephone"
              v-model="form.telephone"
              type="tel"
              required
              class="w-full px-4 py-3 border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: +243 900 000 000"
              :disabled="isLoading"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary-950 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Entrez votre adresse email"
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
              class="w-full px-4 py-3 border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Créez un mot de passe sécurisé"
              :disabled="isLoading"
            />
          </div>

          <!-- Confirmation du mot de passe -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-primary-950 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="w-full px-4 py-3 border border-secondary-600/50 rounded-lg text-primary-500 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirmez votre mot de passe"
              :disabled="isLoading"
            />
          </div>

          <!-- Validation des mots de passe -->
          <div v-if="form.password && form.password_confirmation" class="text-sm">
            <div v-if="passwordsMatch" class="text-green-600">
              ✓ Les mots de passe correspondent
            </div>
            <div v-else class="text-red-600">
              ✗ Les mots de passe ne correspondent pas
            </div>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="isLoading || !passwordsMatch || !isFormValid"
            class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mt-6"
          >
            <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isLoading ? 'Création du compte...' : 'Créer mon compte' }}
          </button>

          <!-- Message d'erreur (sanitisé) -->
          <div v-if="uiError" class="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {{ uiError }}
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
  description: 'Créez votre compte Biso Ticket',
  middleware: ['guest']
})

// État du formulaire
const form = reactive({
  name: '',
  telephone: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// État de l'interface
const success = ref('')

// Composables
const { register } = useAuth()
const router = useRouter()

// useAsyncData pour l'appel register (exécution manuelle)
const { pending: isLoading, error: errorAsync, execute } = await useAsyncData('auth:register', () =>
  register({
    name: form.name,
    email: form.email,
    telephone: form.telephone,
    password: form.password
  })
, { immediate: false, server: false })

const uiError = computed(() => (errorAsync.value as any)?.data?.message || '')

// Computed properties pour la validation
const passwordsMatch = computed(() => {
  return form.password && form.password_confirmation && form.password === form.password_confirmation
})

const isFormValid = computed(() => {
  return form.name && form.telephone && form.email && form.password && form.password_confirmation
})

// Gestion de l'inscription
const handleRegister = async () => {
  success.value = ''
  if (!passwordsMatch.value) {
    // on s'appuie sur l'UI pour indiquer l'erreur
    return
  }
  await execute()
  if (!errorAsync.value) {
    success.value = 'Compte créé avec succès ! Redirection...'
    await router.push('/')
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
