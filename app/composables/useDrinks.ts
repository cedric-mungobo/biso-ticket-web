import type { Drink, DrinkCategory } from '../types/drinks'

export const useDrinks = () => {
  const { $myFetch } = useNuxtApp()
  const toast = useToast()

  // Types pour les boissons
  interface DrinkFormData {
    name: string
    category: DrinkCategory
  }

  interface DrinksResponse {
    data: Drink[]
  }

  // Récupérer les boissons d'un événement
  const fetchEventDrinks = async (eventId: number): Promise<Drink[]> => {
    try {
      const response = await $myFetch<DrinksResponse>(`/events/${eventId}/drinks`)
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la récupération des boissons:', error)
      throw new Error('Impossible de récupérer les boissons')
    }
  }

  // Ajouter des boissons à un événement
  const addEventDrinks = async (eventId: number, drinks: DrinkFormData[]): Promise<Drink[]> => {
    try {
      const response = await $myFetch<DrinksResponse>(`/events/${eventId}/drinks`, {
        method: 'POST',
        body: { drinks }
      })
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de l\'ajout des boissons:', error)
      throw new Error('Impossible d\'ajouter les boissons')
    }
  }

  // Modifier les boissons d'un événement
  const updateEventDrinks = async (eventId: number, drinks: DrinkFormData[]): Promise<Drink[]> => {
    try {
      const response = await $myFetch<DrinksResponse>(`/events/${eventId}/drinks`, {
        method: 'PUT',
        body: { drinks }
      })
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la mise à jour des boissons:', error)
      throw new Error('Impossible de mettre à jour les boissons')
    }
  }

  // Supprimer toutes les boissons d'un événement
  const deleteEventDrinks = async (eventId: number): Promise<void> => {
    try {
      await $myFetch(`/events/${eventId}/drinks`, {
        method: 'DELETE'
      })
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la suppression des boissons:', error)
      throw new Error('Impossible de supprimer les boissons')
    }
  }

  // Validation des données de boisson
  const validateDrink = (drink: Partial<DrinkFormData>): string[] => {
    const errors: string[] = []
    
    if (!drink.name || drink.name.trim().length === 0) {
      errors.push('Le nom de la boisson est requis')
    }
    
    if (!drink.category) {
      errors.push('La catégorie de la boisson est requise')
    }
    
    return errors
  }

  // Validation de plusieurs boissons
  const validateDrinks = (drinks: Partial<DrinkFormData>[]): Record<number, string[]> => {
    const errors: Record<number, string[]> = {}
    
    drinks.forEach((drink, index) => {
      const drinkErrors = validateDrink(drink)
      if (drinkErrors.length > 0) {
        errors[index] = drinkErrors
      }
    })
    
    return errors
  }

  return {
    fetchEventDrinks,
    addEventDrinks,
    updateEventDrinks,
    deleteEventDrinks,
    validateDrink,
    validateDrinks
  }
}
