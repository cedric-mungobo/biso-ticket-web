// Repository: tickets payés du client

export interface ClientTicketEvent {
  id: number
  title: string
  startsAt: string
  endsAt?: string | null
  imageUrl?: string | null
}

export interface ClientTicketType {
  id: number
  name: string
  price: number
  currency: string
}

export interface ClientTicketItem {
  id: number
  event: ClientTicketEvent
  ticket: ClientTicketType
  quantity: number
  qrCode: string
  createdAt: string
}

// On ne normalise pas la réponse ici; on renvoie la réponse brute

interface ApiEnvelope<T> {
  status: boolean
  message: string
  data: T
}

interface ApiPaginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const useClientTickets = () => {
  const getHttp = () => {
    const { $customFetch, $myFetch, $api } = useNuxtApp() as any
    return $customFetch || $myFetch || $api
  }

  const fetchClientTickets = async (page = 1, perPage = 15): Promise<any> => {
    const http = getHttp()
    if (!http) throw new Error('Client HTTP indisponible')
    const url = `/client/tickets?page=${page}&per_page=${perPage}`
    if (process.dev) console.log('[ClientTickets] GET', url)
    const res = await http(url, { method: 'GET' })
    if (process.dev) console.log('[ClientTickets] raw response', res)
    return res
  }

  return {
    fetchClientTickets
  }
}


