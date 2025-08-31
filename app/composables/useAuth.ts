import type { User, AuthResponse, LoginRequest, RegisterRequest, ProfileUpdateRequest } from '~/types/api'

// Composable de type repository (pas de state/loading/error internes)
export const useAuth = () => {
  const { $myFetch } = useNuxtApp()

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await $myFetch<any>('/register', {
      method: 'POST',
      body: userData
    })
    const token = useCookie('auth_token', { path: '/' })
    token.value = (response as any)?.token ?? (response as any)?.data?.token ?? null
    return response as AuthResponse
  }

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await $myFetch<any>('/login', {
      method: 'POST',
      body: credentials
    })
    const token = useCookie('auth_token', { path: '/' })
    token.value = (response as any)?.token ?? (response as any)?.data?.token ?? null
    return response as AuthResponse
  }

  const logout = async (): Promise<void> => {
    try {
      await $myFetch('/logout', { method: 'POST' })
    } finally {
      const token = useCookie('auth_token')
      token.value = null
    }
  }

  const getProfile = async (): Promise<User> => {
    const response = await $myFetch<any>('/profile')
    // L'API renvoie { status, message, data: User }
    return (response?.data ?? response) as User
  }

  const updateProfile = async (profileData: ProfileUpdateRequest): Promise<User> => {
    const response = await $myFetch<{ user: User }>('/profile', {
      method: 'PUT',
      body: profileData
    })
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
