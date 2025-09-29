export type DrinkCategory = 'alcohol' | 'soft_drink' | 'hot_drink' | 'water' | 'other'

export interface Drink {
  id?: number
  name: string
  category: DrinkCategory
  eventId?: number
  createdAt?: string
  updatedAt?: string
}

export interface DrinkFormData {
  name: string
  category: DrinkCategory
}

export interface DrinksResponse {
  data: Drink[]
}

// Configuration des catégories de boissons
export const DRINK_CATEGORIES: Record<DrinkCategory, { label: string; color: string; icon: string }> = {
  alcohol: {
    label: 'Alcool',
    color: 'red',
    icon: 'i-heroicons-beaker'
  },
  soft_drink: {
    label: 'Boisson gazeuse',
    color: 'blue',
    icon: 'i-heroicons-cube'
  },
  hot_drink: {
    label: 'Boisson chaude',
    color: 'orange',
    icon: 'i-heroicons-fire'
  },
  water: {
    label: 'Eau',
    color: 'cyan',
    icon: 'i-heroicons-droplet'
  },
  other: {
    label: 'Autre',
    color: 'gray',
    icon: 'i-heroicons-question-mark-circle'
  }
}
