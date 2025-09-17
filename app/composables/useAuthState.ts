import type { User } from '~/types/api'

/**
 * Composable pour gérer l'état d'authentification de manière centralisée
 * Utilise useCookie pour la persistance et la réactivité
 */
export const useAuthState = () => {
  // Cookies réactifs
  const tokenCookie = useCookie('auth_token', { 
    path: '/', 
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    httpOnly: false,
    secure: true,
    sameSite: 'lax'
  })
  
  const userDataCookie = useCookie('user_data', { 
    path: '/', 
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    httpOnly: false,
    secure: true,
    sameSite: 'lax'
  })

  // État réactif calculé
  const isAuthenticated = computed(() => {
    return !!(tokenCookie.value && userDataCookie.value)
  })

  const user = computed<User | null>(() => {
    if (!userDataCookie.value) return null
    try {
      return JSON.parse(userDataCookie.value) as User
    } catch {
      return null
    }
  })

  const token = computed(() => tokenCookie.value)

  const isGoogleUser = computed(() => {
    return !!(user.value?.google_id)
  })

  // Actions
  const setAuth = (userData: User, authToken: string) => {
    tokenCookie.value = authToken
    userDataCookie.value = JSON.stringify(userData)
  }

  const clearAuth = () => {
    tokenCookie.value = null
    userDataCookie.value = null
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      const updatedUser = { ...user.value, ...userData }
      userDataCookie.value = JSON.stringify(updatedUser)
    }
  }

  return {
    // État
    isAuthenticated,
    user,
    token,
    isGoogleUser,
    
    // Actions
    setAuth,
    clearAuth,
    updateUser
  }
}
