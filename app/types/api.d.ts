// Types pour la nouvelle API Biso Ticket

// Structure de base des réponses API
export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  errors?: Record<string, any>
}

// Types d'authentification
export interface User {
  id: number
  name: string
  email: string
  telephone?: string
  phone_number?: string
  role?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  identifier: string // email ou téléphone
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  telephone?: string
  password: string
}

export interface ProfileUpdateRequest {
  name?: string
  email?: string
  telephone?: string
  password?: string
}

// Types d'événements
export interface Event {

  id: number
  publicId : string,
  title: string
  slug: string
  location?: string
  description?: string
  startsAt: string
  endsAt?: string
  imageUrl?: string
  status: 'draft' | 'active' | 'ended' | 'cancelled' | 'suspended'
  isPublic: boolean
  organizerId: number
  settings: {
    scanEnabled: boolean
    categories: string[]
    priorities: string[]
    featured: boolean
    tags: string[]
    scanSecret: number,
    defaultInvitationTemplateId?: number
    defaultInvitationTemplate?: InvitationTemplate
  }
  createdAt: string
  updatedAt: string
}

export interface EventCreateRequest {
  title: string
  location?: string
  description?: string
  starts_at: string
  ends_at?: string
  status?: 'draft' | 'active' | 'ended' | 'cancelled' | 'suspended'
  is_public?: boolean
  settings?: {
    scan_enabled?: boolean
    categories?: string[]
    tags?: string[]
    default_invitation_template_id?: number
  }
}

// Types de tickets
export interface Ticket {
  id: number
  eventId: number
  name: string
  price: number
  currency: string
  quantity: number
  commissionRate: number
  createdAt: string
  updatedAt: string
}

export interface TicketCreateRequest {
  name: string
  price: number
  currency: string
  quantity: number
  commissionRate?: number
}

// Types d'invitations
export interface Invitation {
  id: number
  eventId: number
  invitationTemplateId?: number
  guestName: string
  guestEmail?: string
  guestPhone?: string
  guestTableName?: string
  token: string
  status: 'pending' | 'sent' | 'confirmed' | 'cancelled'
  sentAt?: string
  viewedAt?: string
  confirmedAt?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface InvitationTemplate {
  id: number
  organizerId: number
  title: string
  designKey: string
  previewImageUrl: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// Types de commandes et paiements
export interface Order {
  id: number
  eventId: number
  customerId: number
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled'
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  ticketId: number
  quantity: number
  unitPrice: number
}

export interface Payment {
  id: number
  orderId: number
  method: 'flexpay' | 'cash' | string
  status: 'pending' | 'confirmed' | 'failed'
  reference: string
  amount: number
  currency: string
  paidAt?: string
  metadata: Record<string, any>
  transactions: any[]
  createdAt: string
  updatedAt: string
}

// Types de crédits
export interface CreditPurchaseRequest {
  credits: number
  currency?: 'USD' | 'CDF'
  phone: string
}

export interface CreditPurchase {
  id: number
  credits: number
  unitPriceUsd: number
  amountUsd: number
  currency: string
  amountCurrency: number
  status: 'pending' | 'paid' | 'failed'
  reference: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreditBalance {
  balance: number
  unitPriceUsd: number
}

export interface CreditLedgerEntry {
  id: number
  delta: number
  balanceAfter: number
  reason: string
  meta: Record<string, any>
  createdAt: string
}

// Types de scan et POS
export interface Scan {
  id: number
  eventId: number
  ticketId: number
  participantId: number
  scannedAt: string
  location?: string
  device?: string
}

export interface PosSession {
  id: number
  organizerId: number
  status: 'open' | 'closed'
  openedAt: string
  closedAt?: string
  totalSales?: number
}

export interface OfflineSale {
  id: number
  posSessionId: number
  eventId: number
  ticketId: number
  quantity: number
  amount: number
  currency: string
  synced: boolean
  createdAt: string
  updatedAt: string
}

// Types de pagination
export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

// Types de commissions
export interface Commission {
  id: number
  eventId: number
  ticketId: number
  amount: number
  currency: string
  rate: number
  createdAt: string
  updatedAt: string
}

// Types de retraits (payouts)
export interface Payout {
  id: number
  organizerId: number
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  reference: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PayoutBalance {
  available: number
  limits: {
    min: number
    max: number
    dailyRequests: number
    dailyAmount: number
  }
}

// Types de presets
export interface EventCategoriesPreset {
  categories: string[]
}

// Types d'erreurs
export interface ApiError {
  status: false
  message: string
  errors?: Record<string, string[]>
}
