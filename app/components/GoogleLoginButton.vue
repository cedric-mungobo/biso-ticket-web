<template>
  <div>
    <!-- Bouton Google Sign-In personnalisé -->
    <div 
      v-show="isClientIdConfigured"
      ref="googleSignInButton"
      class="w-full h-[40px] flex items-center justify-center"
      style="min-width: 100%; min-height: 40px; max-height: 40px;"
    ></div>
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
const { redirectAfterAuth } = useAuthRedirect()
const googleSignInButton = ref<HTMLElement>()
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

  nextTick(() => {
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
  if (window.google && window.google.accounts) {
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 100)
    return
  }

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
  
  setTimeout(() => {
    if (checkGoogleInterval) {
      clearInterval(checkGoogleInterval)
      checkGoogleInterval = null
    }
  }, 10000)
}

const initializeGoogleSignIn = () => {
  // Éviter les initialisations multiples
  if (isInitialized.value) {
    return
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    return
  }

  if (!googleSignInButton.value) {
    retryCount.value++
    
    if (retryCount.value >= maxRetries) {
      return
    }
    
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 500)
    return
  }

  try {
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
        height: '40px',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    )

    isInitialized.value = true
  } catch (err) {
    // Erreur silencieuse
  }
}

const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
  if (!response.credential) {
    return
  }
  
  try {
    const result = await loginWithGoogle(response.credential)
    
    if (result.success) {
      await redirectAfterAuth('/profile')
    }
  } catch (err) {
    // Erreur silencieuse
  }
}
</script>

<style scoped>
/* Fix pour le conflit de color-scheme et redimensionnement */
:deep(.gsi-button) {
  color-scheme: auto;
  width: 100% !important;
  height: 40px !important;
  min-height: 40px !important;
  max-height: 40px !important;
  min-width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
</style>
