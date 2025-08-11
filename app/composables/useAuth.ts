import { ref, computed } from 'vue'

// Types pour les réponses API
interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: any
    token: string
    token_type: string
  }
}

interface ProfileResponse {
  success: boolean
  message: string
  data: any
}

// État de l'authentification
const isLoading = ref(false)

// Getters utilisant nuxt-auth-utils
const isAuthenticated = computed(() => {
  const { loggedIn } = useUserSession()
  return loggedIn.value
})

const userRole = computed(() => {
  const { user } = useUserSession()
  return (user.value as any)?.role || null
})

const user = computed(() => {
  const { user: sessionUser } = useUserSession()
  return sessionUser.value
})

// Connexion
const login = async (identifier: string, password: string) => {
  try {
    isLoading.value = true
    
    const { data: response, error } = await useAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { identifier, password }
    })

    if (error.value) {
      throw error.value
    }

    if (response.value?.success && response.value.data) {
      // Rafraîchir la session côté client
      const { fetch: refreshSession } = useUserSession()
      await refreshSession()
      
      return { success: true, user: response.value.data.user }
    } else {
      throw new Error(response.value?.message || 'Erreur de connexion')
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    
    if (error.status === 401) {
      throw new Error('Email/téléphone ou mot de passe incorrect')
    } else if (error.status === 422) {
      throw new Error('Données invalides')
    } else if (error.status >= 500) {
      throw new Error('Erreur serveur. Veuillez réessayer plus tard')
    } else {
      throw new Error('Erreur de connexion. Veuillez réessayer')
    }
  } finally {
    isLoading.value = false
  }
}

// Inscription
const register = async (userData: {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}) => {
  try {
    isLoading.value = true
    
    const { data: response, error } = await useAPI<AuthResponse>('/api/register', {
      method: 'POST',
      body: userData
    })

    if (error.value) {
      throw error.value
    }

    if (response.value?.success && response.value.data) {
      // Rafraîchir la session côté client
      const { fetch: refreshSession } = useUserSession()
      await refreshSession()
      
      return { success: true, user: response.value.data.user }
    } else {
      throw new Error(response.value?.message || 'Erreur d\'inscription')
    }
  } catch (error: any) {
    console.error('Erreur d\'inscription:', error)
    
    if (error.status === 422) {
      throw new Error('Données invalides')
    } else if (error.status === 409) {
      throw new Error('Un compte avec cet email ou téléphone existe déjà')
    } else if (error.status >= 500) {
      throw new Error('Erreur serveur. Veuillez réessayer plus tard')
    } else {
      throw new Error('Erreur d\'inscription. Veuillez réessayer')
    }
  } finally {
    isLoading.value = false
  }
}

// Déconnexion
const logout = async () => {
  try {
    // Appel à l'API de déconnexion
    const { error } = await useAPI('/api/logout', { method: 'POST' })
    
    if (error.value) {
      throw error.value
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    // Nettoyer la session côté client
    const { clear: clearSession } = useUserSession()
    await clearSession()
  }
}

// Récupération du profil utilisateur
const fetchUserProfile = async () => {
  try {
    isLoading.value = true
    
    const { data: response, error } = await useAPI<ProfileResponse>('/api/user/profile')

    if (error.value) {
      throw error.value
    }

    if (response.value?.success && response.value.data) {
      // La session est automatiquement mise à jour par nuxt-auth-utils
      return response.value.data
    }
  } catch (error: any) {
    console.error('Erreur de récupération du profil:', error)
    
    if (error.status === 401) {
      // Déconnexion automatique en cas d'erreur d'authentification
      const { clear: clearSession } = useUserSession()
      await clearSession()
      throw new Error('Session expirée. Veuillez vous reconnecter')
    } else {
      throw new Error('Erreur de récupération du profil')
    }
  } finally {
    isLoading.value = false
  }
}

export const useAuth = () => {
  return {
    // État
    user: readonly(user),
    isLoading: readonly(isLoading),
    
    // Getters
    isAuthenticated,
    userRole,
    
    // Actions
    login,
    register,
    logout,
    fetchUserProfile
  }
}
