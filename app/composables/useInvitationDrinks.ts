import type { Drink } from '~/types/drinks'

export const useInvitationDrinks = () => {
  const { $myFetch } = useNuxtApp()
  const toast = useToast()

  // Types pour les choix de boissons
  interface DrinkChoice {
    name: string
  }

  interface DrinkChoiceResponse {
    data: DrinkChoice[]
  }

  // Récupérer les choix de boissons d'un invité
  const fetchInvitationDrinkChoices = async (invitationId: number): Promise<DrinkChoice[]> => {
    try {
      const response = await $myFetch<DrinkChoiceResponse>(`/invitations/${invitationId}/drink-choice`)
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la récupération des choix de boissons:', error)
      throw new Error('Impossible de récupérer les choix de boissons')
    }
  }

  // Sauvegarder les choix de boissons d'un invité
  const saveInvitationDrinkChoices = async (invitationId: number, choices: DrinkChoice[]): Promise<DrinkChoice[]> => {
    try {
      const response = await $myFetch<DrinkChoiceResponse>(`/invitations/${invitationId}/drink-choice`, {
        method: 'PUT',
        body: { drink_choice: choices }
      })
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la sauvegarde des choix de boissons:', error)
      throw new Error('Impossible de sauvegarder les choix de boissons')
    }
  }

  // Validation des choix de boissons
  const validateDrinkChoices = (choices: DrinkChoice[]): string[] => {
    const errors: string[] = []
    
    if (choices.length === 0) {
      errors.push('Veuillez sélectionner au moins une boisson')
    }
    
    if (choices.length > 5) {
      errors.push('Vous ne pouvez pas sélectionner plus de 5 boissons')
    }
    
    // Vérifier les doublons
    const names = choices.map(c => c.name.toLowerCase())
    const uniqueNames = new Set(names)
    if (names.length !== uniqueNames.size) {
      errors.push('Vous ne pouvez pas sélectionner la même boisson plusieurs fois')
    }
    
    return errors
  }

  return {
    fetchInvitationDrinkChoices,
    saveInvitationDrinkChoices,
    validateDrinkChoices
  }
}
