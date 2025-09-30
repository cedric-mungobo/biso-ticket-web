import type { Sponsor, SponsorFormData, SponsorsResponse, EventSponsor, EventSponsorFormData } from '../types/sponsors'

export const useSponsors = () => {
  const { $myFetch } = useNuxtApp()

  // Récupérer la liste des sponsors
  const fetchSponsors = async (params?: { is_active?: boolean; per_page?: number; page?: number }): Promise<Sponsor[]> => {
    try {
      const queryParams = new URLSearchParams()
      if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))
      if (params?.page) queryParams.append('page', String(params.page))

      const response = await $myFetch<SponsorsResponse>(`/sponsors?${queryParams.toString()}`)
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la récupération des sponsors:', error)
      throw new Error('Impossible de récupérer les sponsors')
    }
  }

  // Récupérer un sponsor par ID
  const fetchSponsor = async (sponsorId: number): Promise<Sponsor> => {
    try {
      const response = await $myFetch<{ data: Sponsor }>(`/sponsors/${sponsorId}`)
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la récupération du sponsor:', error)
      throw new Error('Impossible de récupérer le sponsor')
    }
  }

  // Créer un nouveau sponsor (JSON)
  const createSponsor = async (sponsorData: SponsorFormData): Promise<Sponsor> => {
    try {
      const response = await $myFetch<{ data: Sponsor }>('/sponsors', {
        method: 'POST',
        body: sponsorData
      })
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la création du sponsor:', error)
      throw new Error('Impossible de créer le sponsor')
    }
  }


  // Créer un sponsor avec upload de logo
  const createSponsorWithLogo = async (formData: FormData): Promise<Sponsor> => {
    try {
      // Envoyer directement le FormData sans conversion
      const response = await $myFetch<{ data: Sponsor }>('/sponsors', {
        method: 'POST',
        body: formData
      })
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la création du sponsor avec logo:', error)
      throw new Error('Impossible de créer le sponsor avec logo')
    }
  }

  // Mettre à jour un sponsor
  const updateSponsor = async (sponsorId: number, sponsorData: FormData | Partial<SponsorFormData>): Promise<Sponsor> => {
    try {
      const response = await $myFetch<{ data: Sponsor }>(`/sponsors/${sponsorId}`, {
        method: 'PUT',
        body: sponsorData
      })
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la mise à jour du sponsor:', error)
      throw new Error('Impossible de mettre à jour le sponsor')
    }
  }

  // Supprimer un sponsor
  const deleteSponsor = async (sponsorId: number): Promise<void> => {
    try {
      await $myFetch(`/sponsors/${sponsorId}`, {
        method: 'DELETE'
      })
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la suppression du sponsor:', error)
      throw new Error('Impossible de supprimer le sponsor')
    }
  }

  // Récupérer les sponsors d'un événement
  const fetchEventSponsors = async (eventId: number): Promise<EventSponsor[]> => {
    try {
      const response = await $myFetch<{ data: EventSponsor[] }>(`/events/${eventId}/sponsors`)
      return response.data || []
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la récupération des sponsors de l\'événement:', error)
      throw new Error('Impossible de récupérer les sponsors de l\'événement')
    }
  }

  // Ajouter un sponsor à un événement
  const addEventSponsor = async (eventId: number, sponsorData: EventSponsorFormData): Promise<EventSponsor> => {
    try {
      const response = await $myFetch<{ data: EventSponsor }>(`/events/${eventId}/sponsors`, {
        method: 'POST',
        body: sponsorData
      })
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de l\'ajout du sponsor à l\'événement:', error)
      throw new Error('Impossible d\'ajouter le sponsor à l\'événement')
    }
  }

  // Mettre à jour un sponsor d'événement
  const updateEventSponsor = async (eventId: number, eventSponsorId: number, sponsorData: Partial<EventSponsorFormData>): Promise<EventSponsor> => {
    try {
      const response = await $myFetch<{ data: EventSponsor }>(`/events/${eventId}/sponsors/${eventSponsorId}`, {
        method: 'PUT',
        body: sponsorData
      })
      return response.data
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la mise à jour du sponsor de l\'événement:', error)
      throw new Error('Impossible de mettre à jour le sponsor de l\'événement')
    }
  }

  // Supprimer un sponsor d'un événement
  const removeEventSponsor = async (eventId: number, eventSponsorId: number): Promise<void> => {
    try {
      await $myFetch(`/events/${eventId}/sponsors/${eventSponsorId}`, {
        method: 'DELETE'
      })
    } catch (error: any) {
      if (process.dev) console.error('Erreur lors de la suppression du sponsor de l\'événement:', error)
      throw new Error('Impossible de supprimer le sponsor de l\'événement')
    }
  }

  return {
    fetchSponsors,
    fetchSponsor,
    createSponsor,
    createSponsorWithLogo,
    updateSponsor,
    deleteSponsor,
    fetchEventSponsors,
    addEventSponsor,
    updateEventSponsor,
    removeEventSponsor
  }
}
