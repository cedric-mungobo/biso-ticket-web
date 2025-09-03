import type { Invitation, InvitationTemplate, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const useInvitations = () => {
  const { $myFetch } = useNuxtApp()

  const unwrapList = (res: any) => (res?.data?.items) || res?.items || res?.data || []
  const unwrapMeta = (res: any) => (res?.data?.meta) || res?.meta || null
  const unwrap = (res: any) => res?.data ?? res

  const fetchEventInvitations = async (eventId: number, params: {
    per_page?: number
    page?: number
    status?: string
  } = {}): Promise<{ items: Invitation[]; meta: any }> => {
    const res = await $myFetch<any>(`/events/${eventId}/invitations`, {
      method: 'GET',
      params
    })
    return { items: unwrapList(res) as Invitation[], meta: unwrapMeta(res) }
  }

  const createInvitation = async (eventId: number, invitationData: {
    guestName: string
    guestEmail?: string
    guestPhone?: string
    guestTableName?: string
    invitationTemplateId?: number
    metadata?: Record<string, any>
  }): Promise<Invitation> => {
    // Mapper en snake_case pour l'API
    const body: Record<string, any> = {}
    body.guest_name = invitationData.guestName
    if (invitationData.guestEmail !== undefined) body.guest_email = invitationData.guestEmail
    if (invitationData.guestPhone !== undefined) body.guest_phone = invitationData.guestPhone
    if (invitationData.guestTableName !== undefined) body.guest_table_name = invitationData.guestTableName
    if (invitationData.invitationTemplateId !== undefined) body.invitation_template_id = invitationData.invitationTemplateId
    if (invitationData.metadata !== undefined) body.metadata = invitationData.metadata

    if (process.dev) {
      // Log du payload simple (objet)
      // eslint-disable-next-line no-console
      console.log('[Invitations] Payload simple → POST /events/' + eventId + '/invitations', body)
    }

    // Essayer d'abord le format batch (plus tolérant côté backend)
    try {
      const payload = { invitations: [body] }
      if (process.dev) {
        // eslint-disable-next-line no-console
        console.log('[Invitations] Preferred batch payload → POST /events/' + eventId + '/invitations', payload)
      }
      const batchRes = await $myFetch<any>(`/events/${eventId}/invitations`, {
        method: 'POST',
        body: payload
      })
      const list = unwrapList(batchRes) as Invitation[]
      if (Array.isArray(list) && list.length > 0) return list[0] as Invitation
      // si la réponse batch n'est pas la liste attendue, tenter la création simple
      if (process.dev) {
        // eslint-disable-next-line no-console
        console.warn('[Invitations] Réponse batch inattendue, tentative en simple…')
      }
    } catch (_e) {
      // si batch échoue pour une autre raison qu'une 422 (crédits) on tentera simple ci-dessous
      const status = (_e as any)?.response?.status
      if (status && status !== 422) {
        if (process.dev) {
          // eslint-disable-next-line no-console
          console.warn('[Invitations] Batch failed with status', status, '→ fallback simple')
        }
      } else {
        // 422 ou pas de status: remonter l'erreur, inutile d'essayer simple
        throw _e
      }
    }

    // Tentative en format simple (objet)
    const response = await $myFetch<any>(`/events/${eventId}/invitations`, {
      method: 'POST',
      body
    })
    if (!response || typeof response !== 'object') return response as Invitation
    const unwrapped = unwrap(response)
    return (unwrapped?.invitation ?? unwrapped) as Invitation
  }

  const createInvitationsBatch = async (eventId: number, invitations: Array<{
    guestName: string
    guestEmail?: string
    guestPhone?: string
    guestTableName?: string
    invitationTemplateId?: number
    metadata?: Record<string, any>
  }>): Promise<Invitation[]> => {
    const payload = {
      invitations: invitations.map((i) => ({
        guest_name: i.guestName,
        guest_email: i.guestEmail,
        guest_phone: i.guestPhone,
        guest_table_name: i.guestTableName,
        invitation_template_id: i.invitationTemplateId,
        metadata: i.metadata
      }))
    }
    if (process.dev) {
      // Log du payload batch
      // eslint-disable-next-line no-console
      console.log('[Invitations] Payload batch → POST /events/' + eventId + '/invitations', {
        count: payload.invitations.length,
        preview: payload.invitations[0]
      })
    }
    const response = await $myFetch<any>(`/events/${eventId}/invitations`, {
      method: 'POST',
      body: payload
    })
    return unwrapList(response) as Invitation[]
  }

  const updateInvitation = async (
    eventId: number,
    invitationId: number,
    invitationData: Partial<{
      guestName: string
      guestEmail: string
      guestPhone: string
      guestTableName: string
      status: 'pending' | 'sent' | 'confirmed' | 'cancelled'
      metadata: Record<string, any>
    }>
  ): Promise<Invitation> => {
    const response = await $myFetch<{ invitation: Invitation }>(`/events/${eventId}/invitations/${invitationId}`, {
      method: 'PUT',
      body: invitationData
    })
    return response.invitation
  }

  const deleteInvitation = async (eventId: number, invitationId: number): Promise<boolean> => {
    await $myFetch(`/events/${eventId}/invitations/${invitationId}`, { method: 'DELETE' })
    return true
  }

  const fetchInvitationTemplates = async (params: {
    per_page?: number
    page?: number
  } = {}): Promise<{ items: InvitationTemplate[]; meta: any }> => {
    const res = await $myFetch<any>('/invitation-templates', {
      method: 'GET',
      params
    })
    return { items: unwrapList(res) as InvitationTemplate[], meta: unwrapMeta(res) }
  }

  const fetchInvitationTemplate = async (templateId: number): Promise<InvitationTemplate> => {
    const response = await $myFetch<{ template: InvitationTemplate }>(`/invitation-templates/${templateId}`, {
      method: 'GET'
    })
    return response.template
  }

  const shareInvitation = async (eventId: number, invitationId: number): Promise<Invitation> => {
    const response = await $myFetch<any>(`/events/${eventId}/invitations/${invitationId}/share`, {
      method: 'POST'
    })
    return unwrap(response) as Invitation
  }

  return {
    fetchEventInvitations,
    createInvitation,
    createInvitationsBatch,
    updateInvitation,
    deleteInvitation,
    fetchInvitationTemplates,
    fetchInvitationTemplate,
    shareInvitation
  }
}
