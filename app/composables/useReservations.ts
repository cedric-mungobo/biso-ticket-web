import type { Reservation, ReservationFilters } from '~/types/reservation'

export const useReservations = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère toutes les réservations
   */
  const fetchReservations = async (filters: ReservationFilters = {}): Promise<{
    data: Reservation[]
    meta: {
      current_page: number
      from: number
      last_page: number
      per_page: number
      to: number
      total: number
    }
  }> => {
    try {
      loading.value = true
      error.value = null

      // Construire l'URL avec les filtres
      let url = '/reservations'
      const queryParams = new URLSearchParams()
      
      if (filters.reservation_form_id) {
        queryParams.append('reservation_form_id', filters.reservation_form_id.toString())
      }
      if (filters.event_id) {
        queryParams.append('event_id', filters.event_id.toString())
      }
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.per_page) {
        queryParams.append('per_page', filters.per_page.toString())
      }
      
      if (queryParams.toString()) {
        url += '?' + queryParams.toString()
      }
      
      console.log('URL de requête:', url)
      
      const response = await $myFetch<any>(url, {
        method: 'GET'
      })
      
      // L'API retourne directement {data: [réservations...]}
      const reservations = response?.data ?? []
      
      if (process.client && process.dev) {
        console.log('[API] /reservations', { filters, raw: response, reservations: reservations.length })
      }

      // Retourner dans le format attendu par le composant
      return {
        data: reservations,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: filters.per_page || 15,
          to: reservations.length,
          total: reservations.length
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des réservations'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère une réservation par ID
   */
  const fetchReservation = async (id: number): Promise<Reservation> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservations/${id}`, {
        method: 'GET'
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const reservation = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] /reservations/:id', { id, raw: response, reservation })
      }

      return reservation
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération de la réservation'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Met à jour le statut d'une réservation
   */
  const updateReservationStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Reservation> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservations/${id}`, {
        method: 'PUT',
        body: { status }
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const reservation = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] PUT /reservations/:id', { id, status, raw: response, reservation })
      }

      return reservation
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la mise à jour de la réservation'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprime une réservation
   */
  const deleteReservation = async (id: number): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservations/${id}`, {
        method: 'DELETE'
      })
      
      if (process.client && process.dev) {
        console.log('[API] DELETE /reservations/:id', { id, raw: response })
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression de la réservation'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Formate la date de réservation
   */
  const formatReservationDate = (date: string | null): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Obtient la couleur du badge selon le statut
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'error'
      default: return 'neutral'
    }
  }

  /**
   * Obtient la couleur du badge selon le statut de paiement
   */
  const getPaymentStatusColor = (paymentStatus: string): string => {
    switch (paymentStatus) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      case 'refunded': return 'neutral'
      default: return 'neutral'
    }
  }

  /**
   * Obtient le libellé du statut en français
   */
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Confirmée'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  /**
   * Obtient le libellé du statut de paiement en français
   */
  const getPaymentStatusLabel = (paymentStatus: string): string => {
    switch (paymentStatus) {
      case 'paid': return 'Payé'
      case 'pending': return 'En attente'
      case 'failed': return 'Échoué'
      case 'refunded': return 'Remboursé'
      default: return paymentStatus
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchReservations,
    fetchReservation,
    updateReservationStatus,
    deleteReservation,
    formatReservationDate,
    getStatusColor,
    getPaymentStatusColor,
    getStatusLabel,
    getPaymentStatusLabel
  }
}
