export const useGoogleAuth = () => {
  const { $myFetch } = useNuxtApp()
  const { setAuth, clearAuth } = useAuthState()
  
  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await $myFetch<any>('/api/auth/google', {
        method: 'POST',
        body: {
          token: idToken
        }
      })
      
      if (response.status) {
        // Stocker le token d'accès et les données utilisateur
        const accessToken = response.data.access_token
        const user = response.data.user
        
        // Utiliser le système d'authentification existant
        setAuth(user, accessToken)
        
        return { success: true, user, accessToken }
      }
      
      throw new Error(response.message || 'Erreur de connexion')
    } catch (error: any) {
      console.error('Erreur de connexion Google:', error)
      return { success: false, error: error.message }
    }
  }
  
  const logout = async () => {
    try {
      const { token } = useAuthState()
      
      if (token.value) {
        await $myFetch<any>('/api/auth/google/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
      }
      
      // Utiliser le système d'authentification existant
      clearAuth()
      
      return { success: true }
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error)
      return { success: false, error: error.message }
    }
  }
  
  return {
    loginWithGoogle,
    logout
  }
}
