import { useAuthRedirect } from "./useAuthRedirect"
import { useAuthState } from "./useAuthState"
import type { GoogleAuthResponse, GoogleCallbackResponse } from '~/types/api'

export const useGoogleAuth = () => {
  const { $customFetch } = useNuxtApp()
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
      const response = await $customFetch<GoogleAuthResponse>('/auth/google')
      
      if (!response.status) {
        throw new Error(response.message || 'Erreur lors de la récupération de l\'URL de redirection')
      }

      const { redirect_url, state } = response.data

      // 2. Stocker le state en cookie pour validation
      const stateCookie = useCookie('google_oauth_state', { 
        path: '/', 
        maxAge: 10 * 60, // 10 minutes
        httpOnly: false, // Accessible côté client
        secure: true, // HTTPS uniquement en production
        sameSite: 'lax'
      })
      stateCookie.value = state

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
      // Vérifier le state pour la sécurité
      const stateCookie = useCookie('google_oauth_state')
      const storedState = stateCookie.value
      if (!state || !storedState || state !== storedState) {
        throw new Error('State invalide - sécurité compromise')
      }

      // Nettoyer le state
      stateCookie.value = null

      // Appeler l'API backend pour finaliser l'authentification
      const response = await $customFetch<GoogleCallbackResponse>(`/auth/google/callback?code=${code}&state=${state}`)
      
      if (!response.status) {
        throw new Error(response.message || 'Erreur lors de l\'authentification Google')
      }

      return response.data

    } catch (error: any) {
      console.error('Erreur callback Google:', error)
      const message = error?.data?.message || error?.message || 'Erreur lors de l\'authentification Google'
      toast.add({ 
        title: 'Erreur d\'authentification', 
        description: message, 
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
      await $customFetch('/auth/google/logout', {
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