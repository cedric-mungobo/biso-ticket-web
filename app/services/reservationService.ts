import type { Event } from '~/types/events'

export interface TicketReservation {
  ticket_id: number
  quantity: number
}

export interface ReservationRequest {
  tickets: TicketReservation[]
  pay_type: number // 1: Airtel, 2: Mpsa, 3: Orange
  telephone: string
}

export interface ReservationResponse {
  success: boolean
  message: string
  data: {
    participant: {
      id: number
      token: string
    }
    redirect_to_my_tickets: boolean
  }
}

export interface PaymentStatusRequest {
  pay_type: number
  payment_id: string
  language: 'fr' | 'en'
}

export interface PaymentStatusResponse {
  success: boolean
  data: {
    status: 'success' | 'failed' | 'pending'
    raw_data?: any
  }
}

export class ReservationService {

  // Créer une réservation à partir des tickets sélectionnés
  createReservationRequest(
    selectedTickets: Array<{ ticketId: number; quantity: number }>,
    payType: number,
    telephone: string
  ): ReservationRequest {
    return {
      tickets: selectedTickets.map(ticket => ({
        ticket_id: ticket.ticketId,
        quantity: ticket.quantity
      })),
      pay_type: payType,
      telephone: telephone.replace(/\s/g, '') // Supprimer les espaces
    }
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
}

// Instance singleton du service
export const reservationService = new ReservationService()
