import type { Reservation, ReservationFilters, ReservationResponse, ReservationStats } from '~/types/reservation'

export const useReservations = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère toutes les réservations avec statistiques
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
    stats: ReservationStats
  }> => {
    try {
      loading.value = true
      error.value = null

      // Construire l'URL avec les filtres
      let url = '/reservations'
      const queryParams = new URLSearchParams()
      
      // Nouveaux filtres
      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      if (filters.date_from) {
        queryParams.append('date_from', filters.date_from)
      }
      if (filters.date_to) {
        queryParams.append('date_to', filters.date_to)
      }
      if (filters.event_id) {
        queryParams.append('event_id', filters.event_id.toString())
      }
      if (filters.user_id) {
        queryParams.append('user_id', filters.user_id.toString())
      }
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.payment_status) {
        queryParams.append('payment_status', filters.payment_status)
      }
      if (filters.per_page) {
        queryParams.append('per_page', filters.per_page.toString())
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString())
      }
      
      // Filtres de compatibilité (legacy)
      if (filters.reservation_form_id) {
        queryParams.append('reservation_form_id', filters.reservation_form_id.toString())
      }
      
      if (queryParams.toString()) {
        url += '?' + queryParams.toString()
      }
      
      console.log('URL de requête:', url)
      
      const response = await $myFetch<ReservationResponse>(url, {
        method: 'GET'
      })
      
      // L'API retourne {data: [réservations...], pagination: {...}, stats: {...}}
      const reservations = response?.data ?? []
      const pagination = response?.pagination || {}
      const stats = response?.stats || { total: 0, by_status: { confirmed: 0, pending: 0, cancelled: 0 } }
      
      if (process.client && process.dev) {
        console.log('[API] /reservations', { filters, raw: response, reservations: reservations.length, pagination, stats })
      }

      // Retourner dans le format attendu par le composant
      return {
        data: reservations,
        meta: {
          current_page: pagination.current_page || 1,
          from: ((pagination.current_page || 1) - 1) * (pagination.per_page || 15) + 1,
          last_page: pagination.last_page || 1,
          per_page: pagination.per_page || filters.per_page || 15,
          to: Math.min((pagination.current_page || 1) * (pagination.per_page || 15), pagination.total || 0),
          total: pagination.total || reservations.length
        },
        stats
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

  /**
   * Exporte les réservations dans le format spécifié
   */
  const exportReservations = async (
    format: 'csv' | 'excel' | 'pdf', 
    filters: ReservationFilters = {}
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // Construire l'URL complète avec les filtres
      let url = 'https://api.bisoticket.com/api/reservations/export'
      const queryParams = new URLSearchParams()
      
      // Format d'export
      queryParams.append('format', format)
      
      // Appliquer les mêmes filtres que pour la récupération
      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      if (filters.date_from) {
        queryParams.append('date_from', filters.date_from)
      }
      if (filters.date_to) {
        queryParams.append('date_to', filters.date_to)
      }
      if (filters.event_id) {
        queryParams.append('event_id', filters.event_id.toString())
      }
      if (filters.user_id) {
        queryParams.append('user_id', filters.user_id.toString())
      }
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.payment_status) {
        queryParams.append('payment_status', filters.payment_status)
      }
      
      // Filtres de compatibilité (legacy)
      if (filters.reservation_form_id) {
        queryParams.append('reservation_form_id', filters.reservation_form_id.toString())
      }
      
      if (queryParams.toString()) {
        url += '?' + queryParams.toString()
      }
      
      console.log('🚀 Export des réservations:', { format, filters, url })
      console.log('🔗 URL complète:', `${url}?${queryParams.toString()}`)
      
      // Récupérer le token d'authentification
      const token = useCookie('auth_token').value
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }
      
      // Faire la requête pour télécharger le fichier avec fetch
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': format === 'pdf' ? 'application/pdf' : 
                   format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
                   'text/csv'
        }
      })
      
      if (!response.ok) {
        // Gestion d'erreurs selon le guide
        if (response.status === 401) {
          throw new Error('Non authentifié - Veuillez vous reconnecter')
        } else if (response.status === 422) {
          throw new Error('Paramètres invalides - Vérifiez les filtres')
        } else if (response.status === 500) {
          throw new Error('Erreur serveur - Réessayez plus tard')
        } else {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`)
        }
      }
      
      console.log('📡 Réponse du serveur:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      })
      
      // Récupérer le blob
      const blob = await response.blob()
      
      console.log('📄 Informations du blob:', {
        size: blob.size,
        type: blob.type,
        format: format
      })
      
      // Vérifier que le blob n'est pas vide
      if (blob.size === 0) {
        throw new Error('Le fichier exporté est vide')
      }
      
      // Pour le PDF, vérifier le contenu
      if (format === 'pdf') {
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4))
        console.log('📄 En-tête PDF:', pdfHeader)
        console.log('📄 Premiers 50 caractères:', String.fromCharCode(...uint8Array.slice(0, 50)))
        
        if (pdfHeader !== '%PDF') {
          console.warn('⚠️ Le fichier ne semble pas être un PDF valide')
          // Essayer de lire comme texte pour voir l'erreur
          const text = await blob.text()
          console.log('📋 Contenu reçu (texte):', text)
          console.log('📋 Taille du contenu:', text.length)
          
          // Essayer de parser comme JSON pour voir l'erreur du serveur
          try {
            const jsonData = JSON.parse(text)
            console.log('📋 Données JSON du serveur:', jsonData)
            throw new Error(`Erreur du serveur: ${jsonData.message || 'Format non supporté'}`)
          } catch (jsonErr) {
            console.log('📋 Ce n\'est pas du JSON, contenu brut:', text.substring(0, 200))
            throw new Error('Le serveur n\'a pas retourné un PDF valide')
          }
        }
      }
      
      // Créer l'URL de téléchargement
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Nom du fichier avec timestamp selon le guide
      const timestamp = new Date().toISOString().split('T')[0]
      const extension = format === 'excel' ? 'xlsx' : format
      const filename = `reservations_${timestamp}.${extension}`
      link.download = filename
      
      // Déclencher le téléchargement
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyer l'URL
      window.URL.revokeObjectURL(downloadUrl)
      
      console.log(`✅ ${format.toUpperCase()} téléchargé avec succès: ${filename}`)
      
      if (process.client && process.dev) {
        console.log('[API] /reservations/export', { format, filters, success: true })
      }
      
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de l\'export des réservations'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchReservations,
    fetchReservation,
    updateReservationStatus,
    deleteReservation,
    exportReservations,
    formatReservationDate,
    getStatusColor,
    getPaymentStatusColor,
    getStatusLabel,
    getPaymentStatusLabel
  }
}
