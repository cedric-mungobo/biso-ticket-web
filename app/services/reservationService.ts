import type { Event } from '~/types/events'
import type { 
  ReservationRequest, 
  ReservationAPIResponse, 
  AvailabilityCheckResponse, 
  TicketInfoResponse 
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

    // Appel API avec la nouvelle structure
    const { useAPI } = await import('~/composables/useAPI')
    
    const { data, error } = await useAPI<ReservationAPIResponse>('/tickets/simple/reserve', {
      method: 'POST',
      body: request
    })

    if (error.value) {
      console.error('❌ Erreur API lors de la réservation:', error.value)
      throw new Error(error.value.message || 'Erreur lors de la réservation')
    }

    if (!data.value?.success) {
      console.error('❌ Réponse API échouée:', data.value)
      throw new Error(data.value?.message || 'Réservation échouée')
    }

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
}

// Instance singleton du service
export const reservationService = new ReservationService()
