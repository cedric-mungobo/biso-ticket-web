import { computed } from 'vue'

export interface InvitationData {
  event?: any
  invitation?: any
}

export interface ProcessedMessage {
  text: string
  hasVariables: boolean
  variables: string[]
}

/**
 * Composable pour traiter les variables dynamiques dans les messages d'invitation
 */
export const useInvitationVariables = (data: InvitationData) => {
  // Fonction pour formater l'heure
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'))
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Heure à confirmer'
    }
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'))
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Date à confirmer'
    }
  }

  // Fonction pour extraire les variables d'un message
  const extractVariables = (message: string): string[] => {
    const variableRegex = /\[([A-Z_]+)\]/g
    const matches = message.match(variableRegex)
    return matches ? [...new Set(matches.map(match => match.slice(1, -1)))] : []
  }

  // Fonction pour traiter un message avec les variables dynamiques
  const processMessage = (message: string): ProcessedMessage => {
    if (!message) {
      return { text: '', hasVariables: false, variables: [] }
    }

    let processedMessage = message
    const eventData = data.event || data.invitation?.event
    const invitationData = data.invitation

    // Récupérer le nom de l'organisateur depuis différentes sources possibles
    const organizerName = eventData?.organizer?.name || 
                         eventData?.organizerName || 
                         eventData?.user?.name || 
                         data.invitation?.organizer?.name ||
                         'Organisateur'

    // Remplacer les variables dynamiques
    processedMessage = processedMessage.replace(/\[DATE\]/g, eventData?.startsAt ? formatDate(eventData.startsAt) : '[DATE]')
    processedMessage = processedMessage.replace(/\[TIME\]/g, eventData?.startsAt ? formatTime(eventData.startsAt) : '[TIME]')
    processedMessage = processedMessage.replace(/\[LOCATION\]/g, eventData?.location || '[LOCATION]')
    processedMessage = processedMessage.replace(/\[GUEST_NAME\]/g, invitationData?.guestName || '[GUEST_NAME]')
    processedMessage = processedMessage.replace(/\[EVENT_TITLE\]/g, eventData?.title || '[EVENT_TITLE]')
    processedMessage = processedMessage.replace(/\[ORGANIZER_NAME\]/g, organizerName)
    processedMessage = processedMessage.replace(/\[YEARS\]/g, '[YEARS]') // Variable spéciale pour les anniversaires

    // Convertir les retours à la ligne en HTML
    processedMessage = processedMessage.replace(/\n/g, '<br>')

    const variables = extractVariables(message)
    const hasVariables = variables.length > 0

    return {
      text: processedMessage,
      hasVariables,
      variables
    }
  }

  // Fonction pour obtenir les variables disponibles
  const getAvailableVariables = () => [
    { key: 'DATE', label: 'Date de l\'événement', example: 'samedi 15 février 2025' },
    { key: 'TIME', label: 'Heure de l\'événement', example: '18:00' },
    { key: 'LOCATION', label: 'Lieu de l\'événement', example: 'Salle des fêtes' },
    { key: 'GUEST_NAME', label: 'Nom de l\'invité', example: 'Marie Dupont' },
    { key: 'EVENT_TITLE', label: 'Titre de l\'événement', example: 'Mariage de Marie et Jean' },
    { key: 'ORGANIZER_NAME', label: 'Nom de l\'organisateur', example: 'Marie et Jean' },
    { key: 'YEARS', label: 'Nombre d\'années (anniversaires)', example: '25' }
  ]

  return {
    formatTime,
    formatDate,
    processMessage,
    extractVariables,
    getAvailableVariables
  }
}

/**
 * Hook pour traiter les variables dans un message d'invitation
 */
export const useProcessedInvitationMessage = (data: InvitationData, message: string) => {
  const { processMessage } = useInvitationVariables(data)
  
  return computed(() => processMessage(message))
}
