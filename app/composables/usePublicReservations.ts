import type { ReservationForm, ReservationFormField } from '~/types/reservation'

export const usePublicReservations = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère un formulaire de réservation par slug d'événement et ID public
   */
  const fetchReservationFormByEventAndPublicId = async (eventSlug: string, publicId: string): Promise<ReservationForm> => {
    try {
      loading.value = true
      error.value = null

      // Essayer d'abord l'endpoint avec public_id
      let response
      try {
        response = await $myFetch<any>(`/public/events/${eventSlug}/reservation-forms/${publicId}`, {
          method: 'GET'
        })
      } catch (firstErr) {
        // Si ça échoue, essayer avec l'ID numérique
        console.log('Premier endpoint échoué, essai avec ID numérique:', firstErr)
        response = await $myFetch<any>(`/public/reservation-forms/${publicId}`, {
          method: 'GET'
        })
      }
      
      // Déballer l'enveloppe standard { status, message, data }
      const form = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] fetchReservationFormByEventAndPublicId', { eventSlug, publicId, raw: response, form })
      }

      return form
    } catch (err: any) {
      // Message utilisateur-friendly (jamais d'erreur technique)
      let errorMessage = 'Impossible de charger le formulaire. Veuillez réessayer.'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Formulaire de réservation introuvable.'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
      }
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère un formulaire de réservation par ID
   */
  const fetchReservationFormById = async (id: number): Promise<ReservationForm> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/public/reservation-forms/${id}`, {
        method: 'GET'
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const form = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] /public/reservation-forms/:id', { id, raw: response, form })
      }

      return form
    } catch (err: any) {
      // Message utilisateur-friendly (jamais d'erreur technique)
      let errorMessage = 'Impossible de charger le formulaire. Veuillez réessayer.'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Formulaire de réservation introuvable.'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
      }
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Soumet une réservation
   */
  const submitReservation = async (reservationData: {
    reservation_form_id: number
    data: Record<string, any>
    payment_method?: string
  }): Promise<{
    id: number
    status: string
    message: string
  }> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>('/public/reservations', {
        method: 'POST',
        body: reservationData
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const result = response?.data ?? response
      const message = response?.message || 'Réservation soumise avec succès'
      
      if (process.client && process.dev) {
        console.log('[API] POST /public/reservations', { reservationData, raw: response, result })
      }

      return {
        id: result.id,
        status: result.status,
        message
      }
    } catch (err: any) {
      // Message utilisateur-friendly (jamais d'erreur technique)
      let errorMessage = 'Impossible de soumettre la réservation. Veuillez réessayer.'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Le formulaire de réservation n\'est plus disponible.'
      } else if (err?.response?.status === 422) {
        errorMessage = 'Veuillez vérifier les informations saisies.'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
      }
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Vérifie si un formulaire est actif
   */
  const isFormAvailable = (form: ReservationForm): boolean => {
    // Vérifier seulement si le formulaire est actif (support des deux formats)
    const isActive = form?.is_active || form?.isActive
    console.log('Vérification isActive:', { 
      form: form?.title, 
      is_active: form?.is_active, 
      isActive: form?.isActive, 
      result: isActive 
    })
    return !!isActive
  }

  /**
   * Formate la date de réservation
   */
  const formatReservationDate = (date: string | null): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Valide les données du formulaire selon les règles de validation
   */
  const validateFormData = (formData: Record<string, any>, fields: ReservationFormField[]): { isValid: boolean; errors: Record<string, string[]> } => {
    const errors: Record<string, string[]> = {}
    
    fields.forEach(field => {
      if (!field.is_active) return
      
      const value = formData[field.name]
      const fieldErrors: string[] = []
      
      // Vérifier si le champ est requis
      if (field.is_required && (!value || value.toString().trim() === '')) {
        fieldErrors.push(`${field.label} est requis`)
      }
      
      // Vérifier les règles de validation
      if (value && field.validation_rules) {
        const rules = field.validation_rules
        
        // Validation de longueur minimale
        if (rules.min && value.toString().length < rules.min) {
          fieldErrors.push(`${field.label} doit contenir au moins ${rules.min} caractères`)
        }
        
        // Validation de longueur maximale
        if (rules.max && value.toString().length > rules.max) {
          fieldErrors.push(`${field.label} ne peut pas dépasser ${rules.max} caractères`)
        }
        
        // Validation par pattern (regex)
        if (rules.pattern && !new RegExp(rules.pattern).test(value.toString())) {
          fieldErrors.push(`${field.label} n'est pas au bon format`)
        }
      }
      
      // Validation spécifique par type
      if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
        fieldErrors.push(`${field.label} doit être une adresse email valide`)
      }
      
      if (value && field.type === 'tel' && !/^[\+]?[0-9\s\-\(\)]+$/.test(value.toString())) {
        fieldErrors.push(`${field.label} doit être un numéro de téléphone valide`)
      }
      
      if (value && field.type === 'number' && isNaN(Number(value))) {
        fieldErrors.push(`${field.label} doit être un nombre valide`)
      }
      
      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors
      }
    })
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchReservationFormByEventAndPublicId,
    fetchReservationFormById,
    submitReservation,
    isFormAvailable,
    formatReservationDate,
    validateFormData
  }
}
