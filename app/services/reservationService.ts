import type { Event } from '~/types/events'
import type { 
  ReservationRequest, 
  ReservationAPIResponse, 
  AvailabilityCheckResponse, 
  TicketInfoResponse,
  ReservationResponse,
  APIError,
  PaymentStatusResponse,
  PaymentStatusError
} from '~/types/reservation'

export class ReservationService {

  // Créer une requête de réservation selon la nouvelle API
  createReservationRequest(
    selectedTickets: Array<{ ticketId: number; quantity: number }>,
    event: Event,
    paymentData?: {
      payment_method?: 'mobile_money' | 'card'
      payment_currency?: 'USD' | 'CDF'
      telephone?: string
    }
  ): ReservationRequest {
    const baseRequest = {
      tickets: selectedTickets.map(ticket => ({
        ticket_id: ticket.ticketId,
        quantity: ticket.quantity
      }))
    }

    // Vérifier si des tickets sont payants
    const hasPaidTickets = selectedTickets.some(selection => {
      const ticket = event.tickets?.find(t => t.id === selection.ticketId)
      return ticket && parseFloat(ticket.price) > 0
    })

    if (!hasPaidTickets) {
      // Tickets gratuits - aucun champ de paiement requis
      return baseRequest
    }

    // Tickets payants - champs de paiement requis
    if (!paymentData?.payment_method || !paymentData?.payment_currency) {
      throw new Error('Méthode de paiement et devise requises pour les tickets payants')
    }

    const request: ReservationRequest = {
      ...baseRequest,
      payment_method: paymentData.payment_method,
      payment_currency: paymentData.payment_currency
    }

    // Ajouter le téléphone seulement pour mobile money
    if (paymentData.payment_method === 'mobile_money') {
      if (!paymentData.telephone) {
        throw new Error('Numéro de téléphone requis pour le paiement mobile money')
      }
      request.telephone = this.formatPhoneNumber(paymentData.telephone)
    }

    // Validation spéciale pour les cartes (USD uniquement)
    if (paymentData.payment_method === 'card' && paymentData.payment_currency !== 'USD') {
      throw new Error('Le paiement par carte est uniquement supporté en USD')
    }

    return request
  }

  // Validation intelligente selon le type de ticket
  validateReservationRequest(request: ReservationRequest, event: Event): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Vérifier si des tickets sont payants
    const hasPaidTickets = request.tickets.some(selection => {
      const ticket = event.tickets?.find(t => t.id === selection.ticket_id)
      return ticket && parseFloat(ticket.price) > 0
    })

    if (hasPaidTickets) {
      // Validation pour tickets payants
      if (!request.payment_method) {
        errors.push('Méthode de paiement requise pour les tickets payants')
      }
      if (!request.payment_currency) {
        errors.push('Devise de paiement requise pour les tickets payants')
      }
      if (request.payment_method === 'mobile_money' && !request.telephone) {
        errors.push('Numéro de téléphone requis pour le paiement mobile money')
      }
      if (request.payment_method === 'card' && request.payment_currency !== 'USD') {
        errors.push('Le paiement par carte est uniquement supporté en USD')
      }
    }

    // Validation du format du téléphone si présent
    if (request.telephone && !this.validatePhoneNumber(request.telephone)) {
      errors.push('Format de téléphone invalide. Utilisez le format: 243XXXXXXXXX')
    }

    return { valid: errors.length === 0, errors }
  }

  // Vérifier la disponibilité d'un ticket
  async checkTicketAvailability(
    ticketId: number,
    quantity: number
  ): Promise<AvailabilityCheckResponse> {
    const { useAPI } = await import('~/composables/useAPI')
    
    const { data, error } = await useAPI<AvailabilityCheckResponse>(
      `/tickets/simple/check-availability?ticket_id=${ticketId}&quantity=${quantity}`
    )

    if (error.value) {
      console.error('❌ Erreur API lors de la vérification de disponibilité:', error.value)
      throw new Error(error.value.message || 'Erreur lors de la vérification de disponibilité')
    }

    if (!data.value?.success) {
      console.error('❌ Réponse API échouée pour la disponibilité:', data.value)
      throw new Error('Vérification de disponibilité échouée')
    }

    return data.value
  }

  // Récupérer les informations d'un ticket
  async getTicketInfo(ticketId: number): Promise<TicketInfoResponse> {
    const { useAPI } = await import('~/composables/useAPI')
    
    const { data, error } = await useAPI<TicketInfoResponse>(
      `/tickets/simple/info/${ticketId}`
    )

    if (error.value) {
      console.error('❌ Erreur API lors de la récupération des informations du ticket:', error.value)
      throw new Error(error.value.message || 'Erreur lors de la récupération des informations du ticket')
    }

    if (!data.value?.success) {
      console.error('❌ Réponse API échouée pour les informations du ticket:', data.value)
      throw new Error('Récupération des informations du ticket échouée')
    }

    return data.value
  }

  // Effectuer la réservation avec la nouvelle API
  async performReservation(
    selectedTickets: Array<{ ticketId: number; quantity: number }>,
    event: Event,
    paymentData?: {
      payment_method?: 'mobile_money' | 'card'
      payment_currency?: 'USD' | 'CDF'
      telephone?: string
    }
  ): Promise<ReservationAPIResponse> {
    // Validation
    const request = this.createReservationRequest(selectedTickets, event, paymentData)
    const validation = this.validateReservationRequest(request, event)
    
    if (!validation.valid) {
      throw new Error(`Validation échouée: ${validation.errors.join(', ')}`)
    }

    console.log('📤 Données de réservation envoyées:', {
      request,
      selectedTickets,
      event: {
        id: event.id,
        name: event.name,
        tickets: event.tickets?.map(t => ({ id: t.id, type: t.type, price: t.price }))
      },
      paymentData
    })

    // Appel API avec la nouvelle structure
    const { useAPI } = await import('~/composables/useAPI')
    
    const { data, error } = await useAPI<ReservationResponse>('/tickets/simple/reserve', {
      method: 'POST',
      body: request
    })

    // Logging détaillé de la réponse API (même en cas d'erreur)
    console.log('📥 Réponse API brute:', {
      data: data.value,
      error: error.value,
      status: error.value?.statusCode || 'N/A',
      message: error.value?.message || 'N/A'
    })

    if (error.value) {
      console.error('❌ Erreur API lors de la réservation:', {
        error: error.value,
        statusCode: error.value.statusCode,
        message: error.value.message,
        details: error.value.data || error.value.response || 'Aucun détail'
      })
      
      // Essayer d'extraire le message d'erreur de la réponse
      let errorMessage = error.value.message || 'Erreur lors de la réservation'
      
      if (error.value.data) {
        try {
          const errorData = typeof error.value.data === 'string' ? JSON.parse(error.value.data) : error.value.data
          if (errorData.message) {
            errorMessage = errorData.message
          }
          if (errorData.error_code) {
            errorMessage += ` (Code: ${errorData.error_code})`
          }
          if (errorData.details) {
            errorMessage += ` - Détails: ${JSON.stringify(errorData.details)}`
          }
        } catch (parseError) {
          console.log('⚠️ Impossible de parser les détails d\'erreur:', error.value.data)
        }
      }
      
      throw new Error(errorMessage)
    }

    if (!data.value?.success) {
      console.error('❌ Réponse API échouée (success: false):', {
        success: data.value?.success,
        message: data.value?.message,
        error_code: data.value && 'error_code' in data.value ? data.value.error_code : 'N/A',
        details: data.value && 'details' in data.value ? data.value.details : 'N/A',
        fullResponse: data.value
      })
      
      // Construire un message d'erreur complet avec tous les détails du backend
      let errorMessage = data.value?.message || 'Réservation échouée'
      
      // Ajouter le code d'erreur si disponible
      if (data.value && 'error_code' in data.value && data.value.error_code) {
        errorMessage += ` (Code: ${data.value.error_code})`
      }
      
      // Ajouter les détails si disponibles
      if (data.value && 'details' in data.value && data.value.details) {
        if (typeof data.value.details === 'string') {
          errorMessage += ` - ${data.value.details}`
        } else if (typeof data.value.details === 'object') {
          // Traiter les détails structurés
          const details = data.value.details
          if (details.missing_field) {
            errorMessage += ` - Champ manquant: ${details.missing_field}`
          }
          if (details.required_for) {
            errorMessage += ` - Requis pour: ${details.required_for}`
          }
          if (details.supported_currencies) {
            errorMessage += ` - Devises supportées: ${details.supported_currencies.join(', ')}`
          }
          // Ajouter d'autres détails non traités
          const otherDetails = Object.entries(details)
            .filter(([key]) => !['missing_field', 'required_for', 'supported_currencies'].includes(key))
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
          if (otherDetails) {
            errorMessage += ` - Autres détails: ${otherDetails}`
          }
        }
      }
      
      // Créer une erreur avec le message complet du backend
      const backendError = new Error(errorMessage)
      // Ajouter les données du backend pour un accès ultérieur
      ;(backendError as any).backendData = data.value
      ;(backendError as any).isBackendError = true
      
      throw backendError
    }

    console.log('✅ Réservation réussie:', data.value)
    return data.value
  }

  // Valider le numéro de téléphone congolais
  validatePhoneNumber(phone: string): boolean {
    // Format: +243XXXXXXXXX ou 243XXXXXXXXX
    const phoneRegex = /^(\+243|243)?[0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Formater le numéro de téléphone pour l'API
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\s/g, '')
    if (cleaned.startsWith('+243')) {
      return cleaned.substring(1) // Enlever le +
    }
    if (cleaned.startsWith('243')) {
      return cleaned
    }
    // Si c'est juste 9 chiffres, ajouter 243
    if (cleaned.length === 9 && /^[0-9]{9}$/.test(cleaned)) {
      return `243${cleaned}`
    }
    return cleaned
  }

  // Méthode utilitaire pour déterminer si des tickets sont payants
  hasPaidTickets(selectedTickets: Array<{ ticketId: number; quantity: number }>, event: Event): boolean {
    return selectedTickets.some(selection => {
      const ticket = event.tickets?.find(t => t.id === selection.ticketId)
      return ticket && parseFloat(ticket.price) > 0
    })
  }

  // Méthode utilitaire pour obtenir le prix total
  calculateTotalPrice(selectedTickets: Array<{ ticketId: number; quantity: number }>, event: Event): number {
    return selectedTickets.reduce((total, selection) => {
      const ticket = event.tickets?.find(t => t.id === selection.ticketId)
      if (ticket) {
        return total + (parseFloat(ticket.price) * selection.quantity)
      }
      return total
    }, 0)
  }

  // Vérifier le statut de paiement d'une réservation
  async checkPaymentStatus(reference: string, token: string): Promise<PaymentStatusResponse | PaymentStatusError> {
    if (!reference) {
      throw new Error('Référence de réservation requise')
    }
    
    if (!token) {
      throw new Error('Token d\'authentification requis')
    }

    try {
      const { useAPI } = await import('~/composables/useAPI')
      
      const { data, error } = await useAPI(`/tickets/payments/check?reference=${reference}`, {
        method: 'GET'
      })

      if (error.value) {
        console.error('❌ Erreur API lors de la vérification du statut de paiement:', error.value)
        
        // Capturer la réponse complète de l'API
        let errorDetails = ''
        if (error.value.data) {
          try {
            const errorData = typeof error.value.data === 'string' ? error.value.data : JSON.stringify(error.value.data)
            errorDetails = `\nDétails de la réponse: ${errorData}`
          } catch (parseError) {
            errorDetails = `\nDétails de la réponse: ${error.value.data}`
          }
        }
        
        // Gérer spécifiquement les erreurs 404
        if (error.value.statusCode === 404) {
          throw new Error(`Endpoint non trouvé (404) pour la référence: ${reference}.${errorDetails}\n\nL'endpoint /tickets/payments/check n'existe pas sur le serveur.`)
        }
        
        // Gérer les autres erreurs avec détails
        const errorMessage = error.value.message || 'Erreur lors de la vérification du statut de paiement'
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      // Vérifier et retourner la réponse de l'API
      if (!data.value || typeof data.value !== 'object') {
        throw new Error('Réponse API invalide')
      }
      
      // Vérifier si c'est une réponse de succès ou d'erreur
      const response = data.value as any
      
      // Nouvelle structure de réponse (sans data wrapper)
      if (response.reference && response.status && response.success !== undefined) {
        return response as PaymentStatusResponse
      } 
      // Structure ancienne avec data wrapper
      else if (response.success === true && response.data) {
        return response as PaymentStatusResponse
      } 
      // Réponse d'erreur
      else if (response.success === false) {
        return response as PaymentStatusError
      } 
      // Structure inconnue
      else {
        console.warn('⚠️ Structure de réponse inattendue:', response)
        throw new Error('Format de réponse API invalide')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du statut de paiement:', error)
      throw error
    }
  }
}

// Instance singleton du service
export const reservationService = new ReservationService()
