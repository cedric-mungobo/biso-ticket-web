// Types pour les événements
export interface Event {
  id: number
  name: string
  description: string
  date_time: string
  location: string
  image: string
  image_url: string
  category: string
  is_featured: number // Changé de boolean à number car l'API retourne 1 ou 0
  share_token?: string | null
  slug?: string | null
  organizer: {
    id: number
    name: string
    email: string
  }
  tickets: Array<{
    id: number
    type: string
    price: string
    quantity: number
    sold?: number
    available?: number
    formatted_price?: string
    has_available_tickets?: boolean
    end_date?: string
    devise: string
    bg_color?: string | null
    text_color?: string | null
    is_available?: boolean
    created_at?: string
    updated_at?: string
  }>
  tickets_count?: number
  min_price?: string
  max_price?: string
  participants_count?: number
  created_at?: string
  updated_at?: string
}

// Types pour les réponses API
export interface EventsResponse {
  success: boolean
  data: {
    events: Event[]
    pagination?: Pagination
  }
}

export interface EventResponse {
  success: boolean
  data: {
    event: Event
  }
}

// Types pour les filtres d'événements
export interface EventFilters {
  page?: number
  per_page?: number
  category?: string
  min_price?: number
  max_price?: number
  date_filter?: 'today' | 'tomorrow' | 'this_week' | 'all'
  search?: string
}

// Types pour la pagination
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Types pour les tickets
export interface Ticket {
  id: number
  type: string
  price: string
  quantity: number
  sold?: number
  available?: number
  formatted_price?: string
  has_available_tickets?: boolean
  end_date?: string
  devise: string
  bg_color?: string | null
  text_color?: string | null
  is_available?: boolean
  created_at?: string
}

// Types pour les participants
export interface Participant {
  id: number
  name: string
  email: string
  phone: string
  qr_code: string
  payment_status: string
  ticket: Ticket
  created_at: string
}
