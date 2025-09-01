// Repository de paiement: centralise les appels API liés aux paiements

interface PaymentCheckPayload {
  code?: string | number
  status?: string | null
  message?: string
  orderNumber?: string | number
  reference?: string
  [key: string]: any
}

export const usePayments = () => {
  const getHttp = () => {
    const { $customFetch, $myFetch, $api } = useNuxtApp() as any
    return $customFetch || $myFetch || $api
  }

  const unwrap = (res: any) => {
    const payload = res?.data ?? res
    return payload?.data ?? payload
  }

  const checkPaymentStatusByReference = async (reference: string | null | undefined, orderNumber?: string | number | null): Promise<PaymentCheckPayload | null> => {
    if (!reference && !orderNumber) return null
    try {
      const http = getHttp()
      if (!http) return null
      const params = new URLSearchParams()
      if (reference) params.set('reference', String(reference))
      if (orderNumber != null) params.set('order_number', String(orderNumber))
      const url = `/client/payments/check?${params.toString()}`
      if (process.dev) console.log('[Payments] GET', url)
      const res = await http(url, { method: 'GET' })
      const data = unwrap(res)
      if (process.dev) console.log('[Payments] check by reference →', data)
      return data as PaymentCheckPayload
    } catch (error: any) {
      if (process.dev) console.warn('[Payments] check by reference failed', error?.response?.status || error?.status, error?.message)
      return null
    }
  }

  const checkPaymentStatusByOrderNumber = async (orderNumber: string | number | null | undefined): Promise<PaymentCheckPayload | null> => {
    if (!orderNumber) return null
    try {
      const http = getHttp()
      if (!http) return null
      const url = `/client/payments/check?order_number=${encodeURIComponent(String(orderNumber))}`
      if (process.dev) console.log('[Payments] GET', url)
      const res = await http(url, { method: 'GET' })
      const data = unwrap(res)
      if (process.dev) console.log('[Payments] check by order_number →', data)
      return data as PaymentCheckPayload
    } catch (error: any) {
      if (process.dev) console.warn('[Payments] check by order_number failed', error?.response?.status || error?.status, error?.message)
      return null
    }
  }

  return {
    checkPaymentStatusByReference,
    checkPaymentStatusByOrderNumber
  }
}


