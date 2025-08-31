import type { Scan, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const useScans = () => {
  const { $myFetch } = useNuxtApp()

  const fetchEventScans = async (eventId: number, params: {
    per_page?: number
    page?: number
  } = {}): Promise<PaginatedResponse<Scan>> => {
    return $myFetch<PaginatedResponse<Scan>>(`/events/${eventId}/scans`, {
      method: 'GET',
      params
    })
  }

  const createScan = async (eventId: number, scanData: {
    ticketId: number
    participantId: number
    location?: string
    device?: string
  }): Promise<Scan> => {
    const response = await $myFetch<{ scan: Scan }>(`/events/${eventId}/scans`, {
      method: 'POST',
      body: scanData
    })
    return response.scan
  }

  const scanQRCode = async (eventId: number, qrData: {
    qr_code: string
    location?: string
    device?: string
  }): Promise<Scan> => {
    const response = await $myFetch<{ scan: Scan }>(`/events/${eventId}/scans/qr`, {
      method: 'POST',
      body: qrData
    })
    return response.scan
  }

  const validateTicket = (ticket: any, eventId: number): {
    valid: boolean
    message: string
    reason?: string
  } => {
    try {
      if (ticket.eventId !== eventId) {
        return { valid: false, message: 'Ticket invalide pour cet événement', reason: 'wrong_event' }
      }
      if (ticket.end_date && new Date(ticket.end_date) < new Date()) {
        return { valid: false, message: 'Ticket expiré', reason: 'expired' }
      }
      if (!ticket.is_available || ticket.available <= 0) {
        return { valid: false, message: 'Ticket non disponible', reason: 'unavailable' }
      }
      return { valid: true, message: 'Ticket valide' }
    } catch (error) {
      return { valid: false, message: 'Erreur lors de la validation du ticket', reason: 'validation_error' }
    }
  }

  const formatScanDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Date invalide'
    }
  }

  const getScanStats = (eventId: number) => {
    // à implémenter côté appelant, ce composable n'entretient pas d'état
    return { totalScans: 0, todayScans: 0, uniqueParticipants: 0 }
  }

  return {
    fetchEventScans,
    createScan,
    scanQRCode,
    validateTicket,
    formatScanDate,
    getScanStats
  }
}
