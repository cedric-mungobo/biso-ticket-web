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

// Composable de type repository (pas de state/loading/error internes)
export const useAuth = () => {
  const { $myFetch } = useNuxtApp()
  const { setAuth, clearAuth, updateUser } = useAuthState()

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await $myFetch<any>('/register', {
      method: 'POST',
      body: userData
    })
    
    const tokenValue = (response as any)?.token ?? (response as any)?.data?.token ?? null
    const userValue = (response as any)?.user ?? (response as any)?.data?.user ?? null
    
    if (tokenValue && userValue) {
      setAuth(userValue, tokenValue)
    }
    
    return response as AuthResponse
  }

  const login = async (credentials: LoginRequest | GoogleLoginRequest): Promise<AuthResponse> => {
    // Si c'est une authentification Google, on stocke directement les données
    if ('googleAuth' in credentials && credentials.googleAuth) {
      if (credentials.token && credentials.user) {
        setAuth(credentials.user, credentials.token)
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
    }
    
    return response as AuthResponse
  }

  const logout = async (): Promise<void> => {
    try {
      await $myFetch('/logout', { method: 'POST' })
    } finally {
      clearAuth()
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
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
  }
}