import { ref, computed } from 'vue'

// Types
export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// État global d'authentification
const user = ref<User | null>(null)
const token = ref<string | null>(null)

// Computed properties
const isAuthenticated = computed(() => !!token.value && !!user.value)

// Initialisation depuis le localStorage
const initializeAuth = () => {
  if (process.client) {
    const storedToken = localStorage.getItem('biso_token')
    const storedUser = localStorage.getItem('biso_user')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        clearAuth()
      }
    }
  }
}

// Connexion
const login = async (identifier: string, password: string) => {
  try {
    const response = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: { identifier, password }
    })

    if (response.success) {
      user.value = response.data.user
      token.value = response.data.token
      
      // Stockage dans le localStorage
      if (process.client) {
        localStorage.setItem('biso_token', response.data.token)
        localStorage.setItem('biso_user', JSON.stringify(response.data.user))
      }
      
      return { success: true, user: response.data.user }
    } else {
      return { success: false, message: response.message }
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    throw error
  }
}

// Inscription
const register = async (userData: {
  name: string
  phone: string
  email: string
  password: string
  password_confirmation: string
}) => {
  try {
    const response = await $fetch('/api/v1/auth/register', {
      method: 'POST',
      body: userData
    })

    if (response.success) {
      user.value = response.data.user
      token.value = response.data.token
      
      // Stockage dans le localStorage
      if (process.client) {
        localStorage.setItem('biso_token', response.data.token)
        localStorage.setItem('biso_user', JSON.stringify(response.data.user))
      }
      
      return { success: true, user: response.data.user }
    } else {
      return { success: false, message: response.message }
    }
  } catch (error: any) {
    console.error('Erreur d\'inscription:', error)
    throw error
  }
}

// Déconnexion
const logout = async () => {
  try {
    // Appel à l'API de déconnexion si l'utilisateur est connecté
    if (token.value) {
      await $fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    clearAuth()
  }
}

// Nettoyage de l'état d'authentification
const clearAuth = () => {
  user.value = null
  token.value = null
  
  if (process.client) {
    localStorage.removeItem('biso_token')
    localStorage.removeItem('biso_user')
  }
}

// Récupération du profil utilisateur
const fetchProfile = async () => {
  if (!token.value) return null
  
  try {
    const response = await $fetch('/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (response.success) {
      user.value = response.data.user
      
      // Mise à jour du localStorage
      if (process.client) {
        localStorage.setItem('biso_user', JSON.stringify(response.data.user))
      }
      
      return response.data.user
    }
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error)
    
    // Si le token est invalide, déconnexion automatique
    if (error.status === 401) {
      clearAuth()
    }
    
    throw error
  }
  
  return null
}

// Vérification de l'authentification
const checkAuth = async () => {
  if (!token.value) return false
  
  try {
    await fetchProfile()
    return true
  } catch {
    return false
  }
}

// Middleware d'authentification
const requireAuth = () => {
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
}

// Middleware pour les utilisateurs non connectés
const requireGuest = () => {
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
}

// Headers d'authentification pour les requêtes API
const getAuthHeaders = () => {
  if (!token.value) return {}
  
  return {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

// Initialisation automatique
if (process.client) {
  initializeAuth()
}

export const useAuth = () => {
  return {
    // État
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    clearAuth,
    fetchProfile,
    checkAuth,
    
    // Middleware
    requireAuth,
    requireGuest,
    
    // Utilitaires
    getAuthHeaders
  }
}
