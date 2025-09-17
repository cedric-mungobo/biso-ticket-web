<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Logo class="w-12 h-12 object-contain" />
          </div>
        </div>

        <!-- Contenu de chargement -->
        <div v-if="loading" class="space-y-4">
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">Authentification en cours...</h2>
        </div>

        <!-- Contenu d'erreur -->
        <div v-else class="space-y-4">
          <div class="flex justify-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:x-mark" class="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">Erreur d'authentification</h2>
          <div class="space-y-3">
            <UButton 
              @click="goToLogin" 
              color="primary" 
              size="lg"
            >
              Retour à la connexion
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Meta de la page
definePageMeta({
  layout: false, // Pas de layout pour cette page
  middleware: ['guest'] // Seuls les utilisateurs non connectés peuvent accéder
})

// State
const loading = ref(true)
const router = useRouter()

/**
 * Gère le callback de Google OAuth selon le pattern fourni
 */
const processGoogleCallback = async () => {
  try {
    // Récupérer les paramètres de l'URL
    const route = useRoute()
    const token = route.query.token as string
    const user = route.query.user as string

    if (token && user) {
      try {
        // Stocker le token et les données utilisateur dans localStorage
        if (process.client) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user_data', user)
        }
        
        // Rediriger vers la page d'accueil
        await router.push('/app')
      } catch (error) {
        console.error('Erreur lors du traitement de l\'authentification:', error)
        await router.push('/connexion?error=auth_failed')
      }
    } else {
      loading.value = false
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'authentification:', error)
    await router.push('/connexion?error=auth_failed')
  }
}

/**
 * Retourner à la page de connexion
 */
const goToLogin = () => {
  router.push('/connexion')
}

// Traiter le callback au montage du composant
onMounted(() => {
  processGoogleCallback()
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>