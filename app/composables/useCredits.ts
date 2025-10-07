import type { CreditPurchase, CreditBalance, PaginatedResponse } from '~/types/api'

// Repository sans state/loading/error
export const useCredits = () => {
  const { $myFetch } = useNuxtApp()

  const purchaseAndPayCredits = async (purchaseData: CreditPurchase): Promise<{
    reference: string
    amount: number
    currency: string
    orderNumber: string
    provider: string
  }> => {
    return $myFetch<{
      reference: string
      amount: number
      currency: string
      orderNumber: string
      provider: string
    }>('/credits/purchase-and-pay', {
      method: 'POST',
      body: purchaseData
    })
  }

  const fetchCreditBalance = async (): Promise<CreditBalance> => {
    const res = await $myFetch<any>('/credits/balance', { method: 'GET' })
    return (res?.data || res) as CreditBalance
  }

  const fetchCreditPrice = async (): Promise<{ unitPriceUsd: number }> => {
    const response = await $myFetch<{
      success: boolean
      message: string
      data: { unitPriceUsd: number }
    }>('/credits/price', { method: 'GET' })
    
    // Retourner directement data pour maintenir la compatibilité
    return response.data || { unitPriceUsd: 0 }
  }

  const fetchCreditLedger = async (params: {
    per_page?: number
    page?: number
  } = {}): Promise<PaginatedResponse<{
    id: number
    delta: number
    balance_after: number
    reason: string
    meta: Record<string, any>
    created_at: string
  }>> => {
    return $myFetch<PaginatedResponse<{
      id: number
      delta: number
      balance_after: number
      reason: string
      meta: Record<string, any>
      created_at: string
    }>>('/credits/ledger', {
      method: 'GET',
      params
    })
  }

  const fetchCreditPurchases = async (params: {
    per_page?: number
    page?: number
  } = {}): Promise<PaginatedResponse<{
    id: number
    credits: number
    unit_price_usd: number
    amount_usd: number
    currency: string
    amount_currency: number
    status: string
    reference: string
    paid_at?: string
  }>> => {
    return $myFetch<PaginatedResponse<{
      id: number
      credits: number
      unit_price_usd: number
      amount_usd: number
      currency: string
      amount_currency: number
      status: string
      reference: string
      paid_at?: string
    }>>('/credits/purchases', {
      method: 'GET',
      params
    })
  }

  return {
    purchaseAndPayCredits,
    fetchCreditBalance,
    fetchCreditPrice,
    fetchCreditLedger,
    fetchCreditPurchases
  }
}
