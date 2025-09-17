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
        <div v-if="isLoading" class="space-y-4">
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">Connexion en cours...</h2>
          <p class="text-gray-600">Veuillez patienter pendant que nous vous connectons avec Google.</p>
        </div>

        <!-- Contenu de succès -->
        <div v-else-if="success" class="space-y-4">
          <div class="flex justify-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:check" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">Connexion réussie !</h2>
          <p class="text-gray-600">Redirection vers votre tableau de bord...</p>
        </div>

        <!-- Contenu d'erreur -->
        <div v-else-if="error" class="space-y-4">
          <div class="flex justify-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:x-mark" class="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">Erreur de connexion</h2>
          <p class="text-gray-600">{{ error }}</p>
          <div class="space-y-3">
            <UButton 
              @click="retryAuth" 
              color="primary" 
              size="lg"
              :loading="isRetrying"
            >
              Réessayer
            </UButton>
            <UButton 
              @click="goToLogin" 
              variant="outline" 
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

// SEO pour la page de callback
import { useSEO } from '~/composables/useSEO'
const { setAuthSEO } = useSEO()
setAuthSEO('login')

// State
const isLoading = ref(true)
const success = ref(false)
const error = ref('')
const isRetrying = ref(false)

// Composables
import { useGoogleAuth } from '~/composables/useGoogleAuth'
import { useAuthRedirect } from '~/composables/useAuthRedirect'
const { handleGoogleCallback } = useGoogleAuth()
const { login } = useAuth()
const { redirectAfterAuth } = useAuthRedirect()
const router = useRouter()
const toast = useToast()

/**
 * Gère le callback de Google OAuth
 */
const processGoogleCallback = async () => {
  try {
    isLoading.value = true
    error.value = ''

    // Récupérer les paramètres de l'URL
    const route = useRoute()
    const code = route.query.code as string
    const state = route.query.state as string
    const errorParam = route.query.error as string

    // Vérifier s'il y a une erreur de Google
    if (errorParam) {
      throw new Error('Authentification Google annulée ou échouée')
    }

    // Vérifier que nous avons le code et le state
    if (!code || !state) {
      throw new Error('Paramètres de callback manquants')
    }

    // Appeler l'API backend pour finaliser l'authentification
    const authData = await handleGoogleCallback(code, state)

    // Utiliser le composable useAuth pour gérer la connexion
    await login({
      identifier: authData.user.email,
      password: '', // Pas de mot de passe pour Google OAuth
      googleAuth: true,
      user: authData.user,
      token: authData.token
    })

    success.value = true
    toast.add({ 
      title: 'Connexion réussie', 
      description: `Bienvenue ${authData.user.name} !`, 
      color: 'success' 
    })

    // Rediriger vers la page d'accueil après un délai
    setTimeout(async () => {
      await redirectAfterAuth()
    }, 2000)

  } catch (err: any) {
    // Log technique détaillé (dev seulement)
    console.error('Erreur callback Google:', err)
    
    // Message utilisateur-friendly (pas d'erreur technique)
    let userMessage = 'Une erreur est survenue lors de la connexion'
    
    if (err?.status === 500) {
      userMessage = 'Service temporairement indisponible. Veuillez réessayer dans quelques instants.'
    } else if (err?.status === 401) {
      userMessage = 'Session expirée. Veuillez vous reconnecter.'
    } else if (err?.status === 403) {
      userMessage = 'Accès refusé. Veuillez contacter le support.'
    } else if (err?.status === 404) {
      userMessage = 'Service non trouvé. Veuillez réessayer.'
    } else if (err?.status === 0 || !err?.status) {
      userMessage = 'Problème de connexion. Vérifiez votre internet.'
    }
    
    error.value = userMessage
    isLoading.value = false
  }
}

/**
 * Réessayer l'authentification
 */
const retryAuth = async () => {
  isRetrying.value = true
  try {
    await processGoogleCallback()
  } finally {
    isRetrying.value = false
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
