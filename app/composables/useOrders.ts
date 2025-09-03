import type { Order, Payment } from '~/types/api'

// Repository sans state/loading/error
export const useOrders = () => {
  const { $myFetch } = useNuxtApp()

  const unwrapList = (res: any) => (res?.data?.items) || res?.items || []

  const createOrder = async (eventId: string | number, items: Array<{
    ticket_id: number
    quantity: number
  }>): Promise<Order> => {
    const response = await $myFetch<{ order: Order }>(`/client/events/${eventId}/orders`, {
      method: 'POST',
      body: { items }
    })
    return response.order
  }

  const getOrder = async (eventId: string | number, orderId: string | number): Promise<Order> => {
    const response = await $myFetch<{ order: Order }>(`/client/events/${eventId}/orders/${orderId}`, {
      method: 'GET'
    })
    return response.order
  }

  const createPayment = async (
    eventId: string | number,
    orderId: string | number,
    paymentData: {
      method: 'flexpay' | 'cash'
      status?: 'pending' | 'confirmed' | 'failed'
      reference?: string
      amount?: number
      currency?: 'USD' | 'CDF'
      metadata?: Record<string, any>
      gateway_reference?: string
      payload?: any
    }
  ): Promise<Payment> => {
    const response = await $myFetch<{ payment: Payment }>(`/client/events/${eventId}/orders/${orderId}/payments`, {
      method: 'POST',
      body: paymentData
    })
    return response.payment
  }

  const getEventOrders = async (
    eventId: string | number,
    params: { per_page?: number; page?: number } = {}
  ): Promise<Order[]> => {
    const res = await $myFetch<any>(`/events/${eventId}/orders`, { method: 'GET', params })
    return unwrapList(res) as Order[]
  }

  const getOrderPayments = async (
    eventId: string | number,
    orderId: string | number,
    params: { per_page?: number; page?: number } = {}
  ): Promise<Payment[]> => {
    const res = await $myFetch<any>(`/events/${eventId}/orders/${orderId}/payments`, { method: 'GET', params })
    return unwrapList(res) as Payment[]
  }

  return {
    createOrder,
    getOrder,
    createPayment,
    getEventOrders,
    getOrderPayments
  }
}
