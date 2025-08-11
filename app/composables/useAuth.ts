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

// Cookies pour la persistance des données
const authTokenCookie = useCookie('auth_token', {
  default: () => null as string | null,
  maxAge: 60 * 60 * 24 * 7, // 7 jours
  secure: true,
  sameSite: 'strict'
})

const authUserCookie = useCookie('auth_user', {
  default: () => null as any,
  maxAge: 60 * 60 * 24 * 7, // 7 jours
  secure: true,
  sameSite: 'strict'
})

// État de l'authentification
const isLoading = ref(false)
const isAuthenticated = ref(false)
const user = ref<any>(null)
const token = ref<string | null>(null)

// Initialiser l'état depuis les cookies
const initializeAuth = () => {
  if (authTokenCookie.value && authUserCookie.value) {
    token.value = authTokenCookie.value
    user.value = authUserCookie.value
    isAuthenticated.value = true
  }
}

// Sauvegarder l'état dans les cookies
const saveAuthState = (userData: any, userToken: string) => {
  authTokenCookie.value = userToken
  authUserCookie.value = userData
  token.value = userToken
  user.value = userData
  isAuthenticated.value = true
}

// Nettoyer l'état d'authentification
const clearAuthState = () => {
  authTokenCookie.value = null
  authUserCookie.value = null
  token.value = null
  user.value = null
  isAuthenticated.value = false
}

// Getters
const userRole = computed(() => {
  return user.value?.role || null
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
      // Sauvegarder l'état d'authentification
      saveAuthState(response.value.data.user, response.value.data.token)
      
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
      // Sauvegarder l'état d'authentification
      saveAuthState(response.value.data.user, response.value.data.token)
      
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
    // Nettoyer l'état d'authentification
    clearAuthState()
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
      // Mettre à jour les données utilisateur
      user.value = response.value.data
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.value.data))
      }
      return response.value.data
    }
  } catch (error: any) {
    console.error('Erreur de récupération du profil:', error)
    
    if (error.status === 401) {
      // Déconnexion automatique en cas d'erreur d'authentification
      clearAuthState()
      throw new Error('Session expirée. Veuillez vous reconnecter')
    } else {
      throw new Error('Erreur de récupération du profil')
    }
  } finally {
    isLoading.value = false
  }
}

// Forcer le rafraîchissement de la session
const refreshSession = async () => {
  try {
    // Vérifier si le token existe et est valide
    if (token.value) {
      // Optionnel : vérifier la validité du token avec l'API
      // Pour l'instant, on considère que le token est valide
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement de la session:', error)
    clearAuthState()
  }
}

// Initialiser l'authentification au chargement
if (process.client) {
  initializeAuth()
}

export const useAuth = () => {
  return {
    // État
    user: readonly(user),
    isLoading: readonly(isLoading),
    token: readonly(token),
    
    // Getters
    isAuthenticated: readonly(isAuthenticated),
    userRole,
    
    // Actions
    login,
    register,
    logout,
    fetchUserProfile,
    refreshSession,
    initializeAuth
  }
}
