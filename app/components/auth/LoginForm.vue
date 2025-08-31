<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Connexion
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Connectez-vous à votre compte Biso Ticket
        </p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email ou Téléphone
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="votre@email.com"
            :disabled="isLoading"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Votre mot de passe"
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              :disabled="isLoading"
            >
              <Icon
                :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>

        <!-- Options -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Se souvenir de moi
            </span>
          </label>
          
          <NuxtLink
            to="/mot-de-passe-oublie"
            class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Mot de passe oublié ?
          </NuxtLink>
        </div>

        <!-- Message d'erreur -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          :disabled="isLoading || !form.email || !form.password"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Icon
            v-if="isLoading"
            name="heroicons:arrow-path"
            class="w-5 h-5 mr-2 animate-spin"
          />
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Lien d'inscription -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Pas encore de compte ?
          <NuxtLink
            to="/inscription"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Créer un compte
          </NuxtLink>
        </p>
      </div>

      <!-- Séparateur -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Ou continuer avec
            </span>
          </div>
        </div>

        <!-- Boutons sociaux -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name="simple-icons:google" class="w-5 h-5" />
            <span class="ml-2">Google</span>
          </button>

          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name="simple-icons:facebook" class="w-5 h-5" />
            <span class="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
const { login, isLoading, error } = useAuth()
const router = useRouter()

// État du formulaire
const form = ref({
  email: '',
  password: '',
  remember: false
})

// État local
const showPassword = ref(false)

// Gestion de la connexion
const handleLogin = async () => {
  try {
    await login({
      email: form.value.email,
      password: form.value.password
    })
    
    // Redirection après connexion réussie
    await router.push('/')
    
    // Notification de succès
    // TODO: Implémenter un système de notification
    console.log('Connexion réussie !')
    
  } catch (err) {
    // L'erreur est déjà gérée par le composable useAuth
    console.error('Erreur de connexion:', err)
  }
}

// Validation en temps réel
const isFormValid = computed(() => {
  return form.value.email && form.value.password
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
