import type { PosSession, OfflineSale, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const usePos = () => {
  const { $myFetch } = useNuxtApp()

  const fetchPosSessions = async (params: {
    per_page?: number
    page?: number
    status?: string
  } = {}): Promise<PaginatedResponse<PosSession>> => {
    return $myFetch<PaginatedResponse<PosSession>>('/pos-sessions', {
      method: 'GET',
      params
    })
  }

  const openPosSession = async (): Promise<PosSession> => {
    const response = await $myFetch<{ session: PosSession }>('/pos-sessions', { method: 'POST' })
    return response.session
  }

  const closePosSession = async (sessionId: number): Promise<PosSession> => {
    const response = await $myFetch<{ session: PosSession }>(`/pos-sessions/${sessionId}`, {
      method: 'PUT',
      body: { status: 'closed' }
    })
    return response.session
  }

  const fetchOfflineSales = async (sessionId: number, params: {
    per_page?: number
    page?: number
    synced?: 0 | 1
  } = {}): Promise<PaginatedResponse<OfflineSale>> => {
    return $myFetch<PaginatedResponse<OfflineSale>>(`/pos-sessions/${sessionId}/offline-sales`, {
      method: 'GET',
      params
    })
  }

  const createOfflineSale = async (sessionId: number, saleData: {
    eventId: number
    ticketId: number
    quantity: number
    amount: number
    currency: string
  }): Promise<OfflineSale> => {
    const response = await $myFetch<{ sale: OfflineSale }>(`/pos-sessions/${sessionId}/offline-sales`, {
      method: 'POST',
      body: saleData
    })
    return response.sale
  }

  const markSaleAsSynced = async (sessionId: number, saleId: number): Promise<OfflineSale> => {
    const response = await $myFetch<{ sale: OfflineSale }>(`/pos-sessions/${sessionId}/offline-sales/${saleId}`, {
      method: 'PUT',
      body: { synced: true }
    })
    return response.sale
  }

  const syncOfflineSales = async (sessionId: number): Promise<{
    synced_ids: number[]
  }> => {
    return $myFetch<{
      synced_ids: number[]
    }>(`/pos-sessions/${sessionId}/offline-sales/sync`, { method: 'POST' })
  }

  return {
    fetchPosSessions,
    openPosSession,
    closePosSession,
    fetchOfflineSales,
    createOfflineSale,
    markSaleAsSynced,
    syncOfflineSales
  }
}
