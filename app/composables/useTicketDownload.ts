/**
 * Composable pour le téléchargement de billets par ID public
 */
export const useTicketDownload = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère une réservation par son ID public
   */
  const fetchReservationByPublicId = async (publicId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/public/reservations/${publicId}`, {
        method: 'GET'
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const reservation = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] /public/reservations/:publicId', { publicId, raw: response, reservation })
      }

      return reservation
    } catch (err: any) {
      // Message utilisateur-friendly (jamais d'erreur technique)
      let errorMessage = 'Impossible de charger le billet. Veuillez réessayer.'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Billet introuvable. Vérifiez votre référence.'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
      }
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Valide le format d'un ID public
   */
  const isValidPublicId = (publicId: string): boolean => {
    // Un ID public est généralement un UUID ou une chaîne alphanumérique
    return Boolean(publicId && publicId.length > 0 && /^[a-zA-Z0-9\-_]+$/.test(publicId))
  }

  /**
   * Formate la date de création
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    fetchReservationByPublicId,
    isValidPublicId,
    formatDate,
    loading: readonly(loading),
    error: readonly(error)
  }
}
