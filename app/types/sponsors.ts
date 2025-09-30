export interface Sponsor {
  id?: number
  name: string
  logo_url?: string
  website_url?: string
  description?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SponsorFormData {
  name: string
  logo_url?: string
  website_url?: string
  description?: string
  is_active: boolean
}

export interface SponsorsResponse {
  data: Sponsor[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface EventSponsor {
  id: number
  event_id: number
  sponsor_id: number
  sponsorship_type: 'general' | 'main' | 'co_sponsor' | 'media' | 'other'
  display_order: number
  sponsor: Sponsor
}

export interface EventSponsorFormData {
  sponsor_id: number
  sponsorship_type: 'general' | 'main' | 'co_sponsor' | 'media' | 'other'
  display_order: number
}

export const SPONSORSHIP_TYPES = {
  general: { label: 'Général', color: 'gray', icon: 'i-heroicons-building-office' },
  main: { label: 'Principal', color: 'primary', icon: 'i-heroicons-star' },
  co_sponsor: { label: 'Co-sponsor', color: 'secondary', icon: 'i-heroicons-handshake' },
  media: { label: 'Média', color: 'info', icon: 'i-heroicons-megaphone' },
  other: { label: 'Autre', color: 'neutral', icon: 'i-heroicons-ellipsis-horizontal' }
} as const

export type SponsorshipType = keyof typeof SPONSORSHIP_TYPES
