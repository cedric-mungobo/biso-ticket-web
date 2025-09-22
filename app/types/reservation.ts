export interface ReservationFormField {
  id: number
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date'
  is_required?: boolean
  required?: boolean
  is_active?: boolean
  isActive?: boolean
  sort_order?: number
  sortOrder?: number
  placeholder?: string
  help_text?: string
  helpText?: string
  validation_rules?: {
    min?: number
    max?: number
    pattern?: string
  }
  validationRules?: {
    min?: number
    max?: number
    pattern?: string
  }[]
  options?: Array<{
    value: string
    label: string
  }>
}

export interface ReservationFormSettings {
  confirmation_message?: string
  email_notifications?: boolean
  require_approval?: boolean
}

export interface ReservationForm {
  id: number
  event_id?: number
  eventId?: number
  title: string
  description?: string
  is_active?: boolean
  isActive?: boolean
  requires_payment?: boolean
  paymentRequired?: boolean
  fixed_price?: string
  fixedPrice?: string
  max_reservations?: number
  maxReservations?: number
  reservation_starts_at?: string
  reservationStartsAt?: string
  reservation_ends_at?: string
  reservationEndsAt?: string
  public_id?: string
  publicId?: string
  settings: ReservationFormSettings
  fields: ReservationFormField[]
  event?: {
    id: number
    title: string
    slug: string
    status: string
    image_url?: string
    image?: string
  }
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

export interface ReservationFormCreateData {
  event_id: number
  title: string
  description?: string
  is_active?: boolean
  requires_payment?: boolean
  fixed_price?: string
  max_reservations?: number
  reservation_starts_at?: string
  reservation_ends_at?: string
  settings?: ReservationFormSettings
  fields?: Omit<ReservationFormField, 'id'>[]
}

export interface ReservationFormUpdateData extends Partial<ReservationFormCreateData> {
  id: number
}

// Types pour les réservations
export interface Reservation {
  id: number
  reservation_form_id: number
  event_id: number
  user_id: number
  status: 'pending' | 'confirmed' | 'cancelled'
  data: Record<string, any>
  total_amount?: string
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_reference?: string
  confirmed_at?: string
  cancelled_at?: string
  reservation_form: {
    id: number
    title: string
    event_id: number
  }
  event: {
    id: number
    title: string
    slug: string
  }
  user: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface ReservationFilters {
  reservation_form_id?: number
  event_id?: number
  status?: 'pending' | 'confirmed' | 'cancelled'
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
  per_page?: number
  page?: number
}