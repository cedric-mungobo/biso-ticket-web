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

    const response = await $myFetch<any>(`/events/${eventId}/invitations`, {
      method: 'POST',
      body
    })
    // Envoyer aussi en camelCase pour compatibilité backend si nécessaire
    // (certains endpoints peuvent accepter l'un ou l'autre)
    if (!response || typeof response !== 'object') return response as Invitation
    const unwrapped = unwrap(response)
    return (unwrapped?.invitation ?? unwrapped) as Invitation
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

  return {
    fetchEventInvitations,
    createInvitation,
    updateInvitation,
    deleteInvitation,
    fetchInvitationTemplates,
    fetchInvitationTemplate
  }
}
