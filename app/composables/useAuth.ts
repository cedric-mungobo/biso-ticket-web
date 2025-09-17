import { useAuthState } from "./useAuthState"
import type { User, AuthResponse, LoginRequest, RegisterRequest, ProfileUpdateRequest } from '~/types/api'

// Interface pour l'authentification Google
interface GoogleLoginRequest {
  identifier: string
  password: string
  googleAuth?: boolean
  user?: User
  token?: string
}

// Composable de type repository avec gestion localStorage comme dans l'exemple
export const useAuth = () => {
  const { $myFetch } = useNuxtApp()
  const { setAuth, clearAuth, updateUser } = useAuthState()
  
  // State pour la gestion de l'authentification (pattern Next.js)
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(true)

  // Initialiser l'état depuis localStorage au montage
  onMounted(() => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUserData = localStorage.getItem('user_data')
      
        if (storedToken && storedUserData) {
          try {
            token.value = storedToken
            const parsedUser = JSON.parse(storedUserData) as User
            user.value = parsedUser
            // Synchroniser avec useAuthState
            setAuth(parsedUser, token.value)
          } catch (error) {
            console.error('Erreur lors du parsing des données utilisateur:', error)
            // Nettoyer les données corrompues
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
          }
        }
      
      loading.value = false
    }
  })

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await $myFetch<any>('/register', {
      method: 'POST',
      body: userData
    })
    
    const tokenValue = (response as any)?.token ?? (response as any)?.data?.token ?? null
    const userValue = (response as any)?.user ?? (response as any)?.data?.user ?? null
    
    if (tokenValue && userValue) {
      setAuth(userValue, tokenValue)
      // Stocker dans localStorage
      if (process.client) {
        localStorage.setItem('auth_token', tokenValue)
        localStorage.setItem('user_data', JSON.stringify(userValue))
      }
    }
    
    return response as AuthResponse
  }

  const login = async (credentials: LoginRequest | GoogleLoginRequest): Promise<AuthResponse> => {
    // Si c'est une authentification Google, on stocke directement les données
    if ('googleAuth' in credentials && credentials.googleAuth) {
      if (credentials.token && credentials.user) {
        setAuth(credentials.user, credentials.token)
        // Stocker dans localStorage
        if (process.client) {
          localStorage.setItem('auth_token', credentials.token)
          localStorage.setItem('user_data', JSON.stringify(credentials.user))
        }
      }
      
      return {
        user: credentials.user || {} as User,
        token: credentials.token || ''
      }
    }

    // Authentification classique
    const response = await $myFetch<any>('/login', {
      method: 'POST',
      body: credentials
    })
    
    const tokenValue = (response as any)?.token ?? (response as any)?.data?.token ?? null
    const userValue = (response as any)?.user ?? (response as any)?.data?.user ?? null
    
    if (tokenValue && userValue) {
      setAuth(userValue, tokenValue)
      // Stocker dans localStorage
      if (process.client) {
        localStorage.setItem('auth_token', tokenValue)
        localStorage.setItem('user_data', JSON.stringify(userValue))
      }
    }
    
    return response as AuthResponse
  }

  const logout = async (): Promise<void> => {
    try {
      await $myFetch('/logout', { method: 'POST' })
    } finally {
      clearAuth()
      // Nettoyer localStorage
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
  }

  const getProfile = async (): Promise<User> => {
    const response = await $myFetch<any>('/profile')
    console.log('API Profile response:', response)
    // L'API renvoie { status, message, data: User }
    if (response?.status && response?.data) {
      return response.data as User
    }
    return response as User
  }

  const updateProfile = async (profileData: ProfileUpdateRequest): Promise<User> => {
    const response = await $myFetch<{ user: User }>('/profile', {
      method: 'PUT',
      body: profileData
    })
    
    // Mettre à jour l'état local
    if (response.user) {
      updateUser(response.user)
      // Mettre à jour localStorage
      if (process.client) {
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
    }
    
    return response.user
  }

  const changePassword = async (passwordData: { password: string }): Promise<{ message: string }> => {
    return $myFetch<{ message: string }>('/profile/password', {
      method: 'PUT',
      body: passwordData
    })
  }

  return {
    // State (pattern Next.js)
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    // Actions
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
  }
}