// Types pour les formulaires de réservation
interface ReservationFormField {
  id: number
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date'
  is_required: boolean
  is_active: boolean
  sort_order: number
  placeholder?: string
  help_text?: string
  validation_rules?: {
    min?: number
    max?: number
    pattern?: string
  }
  options?: Array<{
    value: string
    label: string
  }>
}

interface ReservationFormSettings {
  confirmation_message?: string
  email_notifications?: boolean
  require_approval?: boolean
}

interface ReservationForm {
  id: number
  event_id: number
  title: string
  description?: string
  is_active: boolean
  requires_payment: boolean
  fixed_price?: string
  max_reservations?: number
  reservation_starts_at?: string
  reservation_ends_at?: string
  settings: ReservationFormSettings
  fields: ReservationFormField[]
  event: {
    id: number
    title: string
    slug: string
    status: string
  }
  created_at: string
  updated_at: string
}

export const useReservationForms = () => {
  const { $myFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère tous les formulaires de réservation
   */
  const fetchReservationForms = async (params: {
    event_id?: number
    is_active?: boolean
    per_page?: number
    page?: number
  } = {}): Promise<{
    data: ReservationForm[]
    meta: {
      current_page: number
      from: number
      last_page: number
      per_page: number
      to: number
      total: number
    }
  }> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>('/reservation-forms', {
        method: 'GET',
        params
      })
      
      // L'API retourne directement {data: [formulaires...]}
      // On doit adapter le format pour correspondre à l'interface attendue
      const forms = response?.data ?? []
      
      if (process.client && process.dev) {
        console.log('[API] /reservation-forms', { params, raw: response, forms: forms.length })
      }

      // Retourner dans le format attendu par le composant
      return {
        data: forms,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: params.per_page || 50,
          to: forms.length,
          total: forms.length
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des formulaires'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère un formulaire de réservation par ID
   */
  const fetchReservationForm = async (id: number): Promise<ReservationForm> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservation-forms/${id}`, {
        method: 'GET'
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const form = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] /reservation-forms/:id', { id, raw: response, form })
      }

      return form
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération du formulaire'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Crée un nouveau formulaire de réservation
   */
  const createReservationForm = async (formData: Partial<ReservationForm>): Promise<ReservationForm> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>('/reservation-forms', {
        method: 'POST',
        body: formData
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const form = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] POST /reservation-forms', { formData, raw: response, form })
      }

      return form
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la création du formulaire'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Met à jour un formulaire de réservation
   */
  const updateReservationForm = async (id: number, formData: Partial<ReservationForm>): Promise<ReservationForm> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservation-forms/${id}`, {
        method: 'PUT',
        body: formData
      })
      
      // Déballer l'enveloppe standard { status, message, data }
      const form = response?.data ?? response
      
      if (process.client && process.dev) {
        console.log('[API] PUT /reservation-forms/:id', { id, formData, raw: response, form })
      }

      return form
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la mise à jour du formulaire'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprime un formulaire de réservation
   */
  const deleteReservationForm = async (id: number): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $myFetch<any>(`/reservation-forms/${id}`, {
        method: 'DELETE'
      })
      
      if (process.client && process.dev) {
        console.log('[API] DELETE /reservation-forms/:id', { id, raw: response })
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression du formulaire'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
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
   * Vérifie si un formulaire est actif
   */
  const isFormActive = (form: ReservationForm): boolean => {
    if (!form.is_active) return false
    
    const now = new Date()
    const startDate = form.reservation_starts_at ? new Date(form.reservation_starts_at) : null
    const endDate = form.reservation_ends_at ? new Date(form.reservation_ends_at) : null
    
    if (startDate && now < startDate) return false
    if (endDate && now > endDate) return false
    
    return true
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchReservationForms,
    fetchReservationForm,
    createReservationForm,
    updateReservationForm,
    deleteReservationForm,
    formatReservationDate,
    isFormActive
  }
}
