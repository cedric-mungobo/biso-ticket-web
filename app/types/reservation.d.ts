// Types pour l'API de réservation selon la documentation

export interface TicketReservation {
  ticket_id: number
  quantity: number
}

export interface ReservationRequest {
  tickets: TicketReservation[]
  telephone?: string // Optionnel selon le type de ticket
  payment_method?: 'mobile_money' | 'card' // Optionnel selon le type de ticket
  payment_currency?: 'USD' | 'CDF' // Optionnel selon le type de ticket
}

export interface ReservationAPIResponse {
  success: boolean
  message: string
  data: {
    reservation_id?: string
    payment_type?: 'mobile_money' | 'card' | 'free'
    payment_url?: string
    business_reference?: string
    amount?: number
    currency?: string
    phone?: string
    payment_status?: 'pending' | 'completed' | 'failed'
    participants?: Array<{
      id: number
      name: string
      email: string
      phone: string
      ticket_type: string
      qr_code: string
      status: string
    }>
    event?: any
    tickets?: Array<{
      ticket_id: number
      type: string
      quantity: number
      price: number
      currency: string
    }>
    created_at: string
  }
}

export interface AvailabilityCheckRequest {
  ticket_id: number
  quantity: number
}

export interface AvailabilityCheckResponse {
  success: boolean
  data: {
    available: boolean
    available_quantity: number
    message?: string
  }
}

export interface TicketInfoResponse {
  success: boolean
  data: {
    ticket: {
      id: number
      type: string
      price: number
      currency: string
      quantity: number
      available: number
      event_id: number
    }
  }
}

// Types pour les erreurs de l'API
export interface APIError {
  success: false
  message: string
  error_code?: string
  details?: {
    missing_field?: string
    required_for?: string
    supported_currencies?: string[]
  }
}

// Union type pour les réponses API
export type ReservationResponse = ReservationAPIResponse | APIError
