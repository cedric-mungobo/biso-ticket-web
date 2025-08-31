import type { Invitation, InvitationTemplate, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const useInvitations = () => {
  const { $myFetch } = useNuxtApp()

  const fetchEventInvitations = async (eventId: number, params: {
    per_page?: number
    page?: number
    status?: string
  } = {}): Promise<PaginatedResponse<Invitation>> => {
    return $myFetch<PaginatedResponse<Invitation>>(`/events/${eventId}/invitations`, {
      method: 'GET',
      params
    })
  }

  const createInvitation = async (eventId: number, invitationData: {
    guestName: string
    guestEmail?: string
    guestPhone?: string
    guestTableName?: string
    invitationTemplateId?: number
    metadata?: Record<string, any>
  }): Promise<Invitation> => {
    const response = await $myFetch<{ invitation: Invitation }>(`/events/${eventId}/invitations`, {
      method: 'POST',
      body: invitationData
    })
    return response.invitation
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
  } = {}): Promise<PaginatedResponse<InvitationTemplate>> => {
    return $myFetch<PaginatedResponse<InvitationTemplate>>('/invitation-templates', {
      method: 'GET',
      params
    })
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
