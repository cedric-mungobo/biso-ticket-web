import { useAuthRedirect } from "./useAuthRedirect"
import { useAuthState } from "./useAuthState"
import type { GoogleAuthResponse, GoogleCallbackResponse } from '~/types/api'

export const useGoogleAuth = () => {
  const { $myFetch } = useNuxtApp()
  const { redirectAfterAuth } = useAuthRedirect()
  const { isGoogleUser } = useAuthState()
  const router = useRouter()
  const toast = useToast()

  /**
   * Initie le processus d'authentification Google
   * Récupère l'URL de redirection et redirige vers Google
   */
  const loginWithGoogle = async (): Promise<void> => {
    try {
      // 1. Récupérer l'URL de redirection depuis l'API
      const response = await $myFetch<GoogleAuthResponse>('/auth/google')
      
      if (!response.status) {
        throw new Error(response.message || 'Erreur lors de la récupération de l\'URL de redirection')
      }

      const { redirect_url, state } = response.data

      // 2. Stocker le state en localStorage pour validation
      if (process.client) {
        localStorage.setItem('google_oauth_state', state)
        localStorage.setItem('google_oauth_state_timestamp', Date.now().toString())
      }
      
      console.log('🔍 [GoogleAuth] State stocké:', {
        state: state?.substring(0, 10) + '...',
        localStorageExists: process.client ? !!localStorage.getItem('google_oauth_state') : 'N/A'
      })

      // 3. Rediriger vers Google
      window.location.href = redirect_url

    } catch (error: any) {
      console.error('Erreur lors de la connexion Google:', error)
      const message = error?.data?.message || error?.message || 'Erreur lors de la connexion Google'
      toast.add({ 
        title: 'Erreur de connexion', 
        description: message, 
        color: 'error' 
      })
      throw error
    }
  }

  /**
   * Gère le callback de Google OAuth
   * Cette fonction est appelée depuis la page de callback
   */
  const handleGoogleCallback = async (code: string, state: string): Promise<GoogleCallbackResponse['data']> => {
    try {
      console.log('🔍 [GoogleAuth] Début du callback avec:', { 
        code: code?.substring(0, 20) + '...', 
        state: state?.substring(0, 10) + '...' 
      })

      // Vérifier le state pour la sécurité (localStorage uniquement)
      let storedState = null
      
      if (process.client) {
        const timestamp = localStorage.getItem('google_oauth_state_timestamp')
        const now = Date.now()
        const maxAge = 10 * 60 * 1000 // 10 minutes en millisecondes
        
        // Vérifier que le state n'a pas expiré
        if (timestamp && (now - parseInt(timestamp)) < maxAge) {
          storedState = localStorage.getItem('google_oauth_state')
        } else {
          console.log('🔍 [GoogleAuth] State localStorage expiré')
        }
      }
      
      console.log('🔍 [GoogleAuth] State validation:', { 
        received: state?.substring(0, 10) + '...', 
        stored: storedState?.substring(0, 10) + '...',
        receivedLength: state?.length,
        storedLength: storedState?.length,
        valid: state === storedState,
        localStorageExists: process.client ? !!localStorage.getItem('google_oauth_state') : 'N/A'
      })

      if (!state) {
        throw new Error('State manquant dans la réponse Google')
      }
      
      if (!storedState) {
        throw new Error('State manquant - session expirée')
      }
      
      if (state !== storedState) {
        throw new Error('State invalide - sécurité compromise')
      }

      // Nettoyer le state (localStorage uniquement)
      if (process.client) {
        localStorage.removeItem('google_oauth_state')
        localStorage.removeItem('google_oauth_state_timestamp')
      }

      // Construire l'URL de callback
      const callbackUrl = `/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
      console.log('🔍 [GoogleAuth] Appel API:', callbackUrl)

      // Appeler l'API backend pour finaliser l'authentification
      const response = await $myFetch<GoogleCallbackResponse>(callbackUrl)
      
      console.log('🔍 [GoogleAuth] Réponse API:', { 
        status: response.status, 
        hasData: !!response.data,
        message: response.message 
      })

      if (!response.status) {
        throw new Error(response.message || 'Erreur lors de l\'authentification Google')
      }

      return response.data

    } catch (error: any) {
      const { getGoogleAuthErrorMessage } = useErrorMessages()
      const userMessage = getGoogleAuthErrorMessage(error)
      
      toast.add({ 
        title: 'Erreur de connexion', 
        description: userMessage, 
        color: 'error' 
      })
      throw error
    }
  }

  /**
   * Déconnexion Google OAuth
   */
  const logoutGoogle = async (): Promise<void> => {
    try {
      await $myFetch('/auth/google/logout', {
        method: 'POST'
      })
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion Google:', error)
      // Ne pas afficher d'erreur pour la déconnexion
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté via Google
   */
  const isGoogleAuthenticated = (): boolean => {
    return isGoogleUser.value
  }

  return {
    loginWithGoogle,
    handleGoogleCallback,
    logoutGoogle,
    isGoogleAuthenticated
  }
}