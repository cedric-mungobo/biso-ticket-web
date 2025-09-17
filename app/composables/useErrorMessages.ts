/**
 * Composable pour gérer les messages d'erreur utilisateur-friendly
 * Masque les erreurs techniques et affiche des messages clairs
 */
export const useErrorMessages = () => {
  /**
   * Convertit une erreur technique en message utilisateur-friendly
   * @param error - L'erreur technique
   * @param defaultMessage - Message par défaut si l'erreur n'est pas reconnue
   * @returns Message utilisateur-friendly
   */
  const getUserFriendlyMessage = (error: any, defaultMessage: string = 'Une erreur est survenue'): string => {
    // Log technique détaillé (dev seulement)
    if (process.dev) {
      console.error('Erreur technique:', {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        response: error?.response?._data
      })
    }

    // Messages utilisateur-friendly selon le type d'erreur
    if (error?.status === 500) {
      return 'Service temporairement indisponible. Veuillez réessayer dans quelques instants.'
    } else if (error?.status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.'
    } else if (error?.status === 403) {
      return 'Accès refusé. Veuillez contacter le support.'
    } else if (error?.status === 404) {
      return 'Service non trouvé. Veuillez réessayer.'
    } else if (error?.status === 422) {
      return 'Veuillez vérifier les informations saisies.'
    } else if (error?.status === 429) {
      return 'Trop de tentatives. Veuillez patienter avant de réessayer.'
    } else if (error?.status === 0 || !error?.status) {
      return 'Problème de connexion. Vérifiez votre internet.'
    } else if (error?.message?.includes('NetworkError') || error?.message?.includes('fetch')) {
      return 'Problème de connexion. Vérifiez votre internet.'
    } else if (error?.message?.includes('timeout')) {
      return 'La requête a pris trop de temps. Veuillez réessayer.'
    }

    // Message par défaut
    return defaultMessage
  }

  /**
   * Affiche un toast d'erreur avec un message utilisateur-friendly
   * @param error - L'erreur technique
   * @param title - Titre du toast (optionnel)
   * @param defaultMessage - Message par défaut (optionnel)
   */
  const showErrorToast = (error: any, title: string = 'Erreur', defaultMessage?: string) => {
    const toast = useToast()
    const message = getUserFriendlyMessage(error, defaultMessage)
    
    toast.add({
      title,
      description: message,
      color: 'error'
    })
  }

  /**
   * Messages d'erreur spécifiques pour l'authentification Google
   */
  const getGoogleAuthErrorMessage = (error: any): string => {
    if (error?.status === 500) {
      return 'Service temporairement indisponible. Veuillez réessayer dans quelques instants.'
    } else if (error?.status === 400) {
      if (error?.message?.includes('State invalide') || error?.data?.message?.includes('State invalide')) {
        return 'Session de sécurité expirée. Veuillez réessayer.'
      }
      return 'Données de connexion invalides. Veuillez réessayer.'
    } else if (error?.message?.includes('State invalide')) {
      return 'Session de sécurité expirée. Veuillez réessayer.'
    } else if (error?.message?.includes('Paramètres de callback manquants')) {
      return 'Données de connexion manquantes. Veuillez réessayer.'
    } else if (error?.message?.includes('Authentification Google annulée')) {
      return 'Connexion annulée. Veuillez réessayer si vous souhaitez vous connecter.'
    } else if (error?.message?.includes('State manquant')) {
      return 'Session expirée. Veuillez réessayer.'
    }
    
    return getUserFriendlyMessage(error, 'Erreur lors de la connexion avec Google')
  }

  return {
    getUserFriendlyMessage,
    showErrorToast,
    getGoogleAuthErrorMessage
  }
}
