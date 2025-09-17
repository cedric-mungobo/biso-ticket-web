<template>
  <div>
    <!-- Vérifier si le Client ID est configuré -->
    <div v-if="!isClientIdConfigured" class="p-4 bg-yellow-100 border border-yellow-400 rounded-md mb-4">
      <p class="text-yellow-800 text-sm">
        ⚠️ Google Client ID non configuré. Veuillez configurer GOOGLE_CLIENT_ID dans votre environnement.
      </p>
    </div>
    
    <!-- Indicateur de chargement -->
    <div v-if="isLoading && !error" class="p-4 text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Chargement du bouton Google...
      </div>
    </div>
    
    <!-- Bouton Google Sign-In personnalisé -->
    <div 
      v-show="!error && isClientIdConfigured"
      ref="googleSignInButton"
      class="google-signin-button"
      style="min-height: 40px; width: 100%;"
    ></div>
    
    <!-- Message d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Types pour l'API Google
interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

interface GoogleAccounts {
  id: {
    initialize: (config: any) => void
    renderButton: (element: HTMLElement, config: any) => void
  }
}

declare global {
  interface Window {
    google: {
      accounts: GoogleAccounts
    } | undefined
  }
}

const { loginWithGoogle } = useGoogleAuth()
const error = ref('')
const googleSignInButton = ref<HTMLElement>()
const isLoading = ref(false)
const isInitialized = ref(false)
const retryCount = ref(0)
const maxRetries = 10

// Vérifier si le Client ID est configuré
const config = useRuntimeConfig()
const isClientIdConfigured = computed(() => {
  const clientId = config.public.googleClientId
  return clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && clientId.length > 10
})

let checkGoogleInterval: NodeJS.Timeout | null = null

onMounted(() => {
  if (!isClientIdConfigured.value) {
    return
  }

  // Attendre un peu pour s'assurer que l'élément est bien monté
  nextTick(() => {
    isLoading.value = true
    // Charger le script Google Sign-In
    loadGoogleScript()
  })
})

onUnmounted(() => {
  // Nettoyer les intervalles
  if (checkGoogleInterval) {
    clearInterval(checkGoogleInterval)
    checkGoogleInterval = null
  }
})

const loadGoogleScript = () => {
  // Vérifier si le script est déjà chargé
  if (window.google && window.google.accounts) {
    // Attendre un peu pour s'assurer que l'élément est disponible
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 100)
    return
  }

  // Attendre que le script se charge (chargé globalement via nuxt.config.ts)
  checkGoogleInterval = setInterval(() => {
    if (window.google && window.google.accounts) {
      if (checkGoogleInterval) {
        clearInterval(checkGoogleInterval)
        checkGoogleInterval = null
      }
      setTimeout(() => {
        initializeGoogleSignIn()
      }, 100)
    }
  }, 100)
  
  // Timeout après 10 secondes
  setTimeout(() => {
    if (checkGoogleInterval) {
      clearInterval(checkGoogleInterval)
      checkGoogleInterval = null
    }
    if (!window.google) {
      isLoading.value = false
      error.value = 'Timeout lors du chargement de Google API'
    }
  }, 10000)
}

const initializeGoogleSignIn = () => {
  console.log('Tentative d\'initialisation Google Sign-In...')
  console.log('window.google:', !!window.google)
  console.log('googleSignInButton.value:', !!googleSignInButton.value)
  console.log('isInitialized:', isInitialized.value)
  console.log('retryCount:', retryCount.value)
  
  // Éviter les initialisations multiples
  if (isInitialized.value) {
    console.log('Google Sign-In déjà initialisé')
    return
  }

  if (!window.google) {
    console.warn('Google API non disponible')
    isLoading.value = false
    error.value = 'Google API non chargée'
    return
  }

  // Vérifier que l'API Google est complètement chargée
  if (!window.google.accounts || !window.google.accounts.id) {
    console.warn('Google Accounts API non disponible')
    error.value = 'API Google non disponible'
    isLoading.value = false
    return
  }

  if (!googleSignInButton.value) {
    retryCount.value++
    console.warn(`Élément bouton non disponible, tentative ${retryCount.value}/${maxRetries}...`)
    
    if (retryCount.value >= maxRetries) {
      console.error('Nombre maximum de tentatives atteint')
      isLoading.value = false
      error.value = 'Impossible de charger le bouton Google Sign-In'
      return
    }
    
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 500)
    return
  }

  try {
    console.log('Initialisation de Google Sign-In avec clientId:', config.public.googleClientId)
    console.log('Current origin:', window.location.origin)
    console.log('Current hostname:', window.location.hostname)

    window.google.accounts.id.initialize({
      client_id: config.public.googleClientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    })

    // Rendre le bouton
    window.google.accounts.id.renderButton(
      googleSignInButton.value,
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    )

    console.log('Bouton Google Sign-In initialisé avec succès')
    isInitialized.value = true
    isLoading.value = false
  } catch (err) {
    console.error('Erreur lors de l\'initialisation Google Sign-In:', err)
    error.value = 'Erreur lors de l\'initialisation Google'
    isLoading.value = false
  }
}

const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
  error.value = ''
  
  if (!response.credential) {
    error.value = 'Token de connexion manquant'
    return
  }
  
  try {
    const result = await loginWithGoogle(response.credential)
    
    if (result.success) {
      // Rediriger vers la page d'accueil ou dashboard
      await navigateTo('/app')
    } else {
      error.value = result.error || 'Erreur de connexion'
    }
  } catch (err) {
    console.error('Erreur de connexion:', err)
    error.value = 'Une erreur inattendue s\'est produite'
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* Fix pour le conflit de color-scheme */
:deep(.gsi-button) {
  color-scheme: auto;
}
</style>
