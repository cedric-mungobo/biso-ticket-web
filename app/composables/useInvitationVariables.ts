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

  // Fonction pour appliquer le formatage avancé
  const applyFormatting = (text: string): string => {
    let formatted = text

    // Formatage de base
    formatted = applyBasicFormatting(formatted)
    
    // Alignement
    formatted = applyAlignment(formatted)
    
    // Titres
    formatted = applyTitles(formatted)
    
    // Couleurs
    formatted = applyColors(formatted)
    
    // Effets spéciaux
    formatted = applySpecialEffects(formatted)

    return formatted
  }

  // Formatage de base (gras, italique, code)
  const applyBasicFormatting = (text: string): string => {
    let formatted = text
    
    // Gras: [**texte**] → <strong>texte</strong>
    formatted = formatted.replace(/\[\*\*(.*?)\*\*\]/g, '<strong>$1</strong>')
    
    // Italique: [*texte*] → <em>texte</em>
    formatted = formatted.replace(/\[\*(.*?)\*\]/g, '<em>$1</em>')
    
    // Code: [`texte`] → <code>texte</code>
    formatted = formatted.replace(/\[`(.*?)`\]/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    
    // Souligné: [_texte_] → <u>texte</u>
    formatted = formatted.replace(/\[_(.*?)_\]/g, '<u>$1</u>')
    
    // Barré: [~texte~] → <s>texte</s>
    formatted = formatted.replace(/\[~(.*?)~\]/g, '<s>$1</s>')

    return formatted
  }

  // Alignement du texte
  const applyAlignment = (text: string): string => {
    let formatted = text
    
    // Centré: [>texte>] → <div class="text-center">texte</div>
    formatted = formatted.replace(/\[>(.*?)>\]/g, '<div class="text-center">$1</div>')
    
    // Aligné à gauche: [<texte<] → <div class="text-left">texte</div>
    formatted = formatted.replace(/\[<(.*?)<\]/g, '<div class="text-left">$1</div>')
    
    // Aligné à droite: [>texte<] → <div class="text-right">texte</div>
    formatted = formatted.replace(/\[>(.*?)<\]/g, '<div class="text-right">$1</div>')

    return formatted
  }

  // Titres
  const applyTitles = (text: string): string => {
    let formatted = text
    
    // Titre principal: [#titre#] → <h1 class="text-3xl font-bold mb-4">titre</h1>
    formatted = formatted.replace(/\[#(.*?)#\]/g, '<h1 class="text-3xl font-bold mb-4 text-center">$1</h1>')
    
    // Sous-titre: [##sous-titre##] → <h2 class="text-2xl font-semibold mb-3">sous-titre</h2>
    formatted = formatted.replace(/\[##(.*?)##\]/g, '<h2 class="text-2xl font-semibold mb-3 text-center">$1</h2>')
    
    // Sous-sous-titre: [###sous-sous-titre###] → <h3 class="text-xl font-medium mb-2">sous-sous-titre</h3>
    formatted = formatted.replace(/\[###(.*?)###\]/g, '<h3 class="text-xl font-medium mb-2 text-center">$1</h3>')

    return formatted
  }

  // Couleurs
  const applyColors = (text: string): string => {
    let formatted = text
    
    // Rouge: [red:texte] → <span class="text-red-600">texte</span>
    formatted = formatted.replace(/\[red:(.*?)\]/g, '<span class="text-red-600 font-medium">$1</span>')
    
    // Bleu: [blue:texte] → <span class="text-blue-600">texte</span>
    formatted = formatted.replace(/\[blue:(.*?)\]/g, '<span class="text-blue-600 font-medium">$1</span>')
    
    // Vert: [green:texte] → <span class="text-green-600">texte</span>
    formatted = formatted.replace(/\[green:(.*?)\]/g, '<span class="text-green-600 font-medium">$1</span>')
    
    // Orange: [orange:texte] → <span class="text-orange-600">texte</span>
    formatted = formatted.replace(/\[orange:(.*?)\]/g, '<span class="text-orange-600 font-medium">$1</span>')
    
    // Violet: [purple:texte] → <span class="text-purple-600">texte</span>
    formatted = formatted.replace(/\[purple:(.*?)\]/g, '<span class="text-purple-600 font-medium">$1</span>')
    
    // Gris: [gray:texte] → <span class="text-gray-600">texte</span>
    formatted = formatted.replace(/\[gray:(.*?)\]/g, '<span class="text-gray-600">$1</span>')

    return formatted
  }

  // Effets spéciaux
  const applySpecialEffects = (text: string): string => {
    let formatted = text
    
    // Mise en évidence: [!texte!] → <mark class="bg-yellow-200 px-1 rounded">texte</mark>
    formatted = formatted.replace(/\[!(.*?)!\]/g, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    
    // Citation: [>citation>] → <blockquote class="border-l-4 border-gray-300 pl-4 italic">citation</blockquote>
    formatted = formatted.replace(/\[>(.*?)>\]/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
    
    // Séparateur: [---] → <hr class="my-4 border-gray-300">
    formatted = formatted.replace(/\[---\]/g, '<hr class="my-4 border-gray-300">')
    
    // Espacement: [br] → <br>
    formatted = formatted.replace(/\[br\]/g, '<br>')

    return formatted
  }

  // Fonction pour traiter un message avec les variables dynamiques
  const processMessage = (message: string): ProcessedMessage => {
    if (!message) {
      return { text: '', hasVariables: false, variables: [] }
    }

    let processedMessage = message
    const eventData = data.event || data.invitation?.event
    const invitationData = data.invitation

    // Debug: Log des données pour comprendre la structure
    if (process.dev) {
      console.log('🔍 Debug useInvitationVariables:', {
        eventData,
        invitationData,
        guestTableName: invitationData?.guestTableName,
        guest_name: invitationData?.guest_name,
        table_name: invitationData?.table_name
      })
    }

    // Récupérer le nom de l'organisateur depuis différentes sources possibles
    const organizerName = eventData?.organizer?.name || 
                         eventData?.organizerName || 
                         eventData?.user?.name || 
                         data.invitation?.organizer?.name ||
                         'Organisateur'

    // Récupérer le nom de la table depuis différentes sources possibles
    const tableName = invitationData?.guestTableName || 
                     invitationData?.guest_table_name || 
                     invitationData?.table_name ||
                     invitationData?.tableName ||
                     null

    // Si pas de table assignée, ne rien afficher (pas de fallback [TABLE])
    const finalTableName = tableName || ''

    // Remplacer les variables dynamiques
    processedMessage = processedMessage.replace(/\[DATE\]/g, eventData?.startsAt ? formatDate(eventData.startsAt) : '[DATE]')
    processedMessage = processedMessage.replace(/\[TIME\]/g, eventData?.startsAt ? formatTime(eventData.startsAt) : '[TIME]')
    processedMessage = processedMessage.replace(/\[LOCATION\]/g, eventData?.location || '[LOCATION]')
    processedMessage = processedMessage.replace(/\[GUEST_NAME\]/g, invitationData?.guestName || invitationData?.guest_name || '[GUEST_NAME]')
    processedMessage = processedMessage.replace(/\[EVENT_TITLE\]/g, eventData?.title || '[EVENT_TITLE]')
    processedMessage = processedMessage.replace(/\[ORGANIZER_NAME\]/g, organizerName)
    processedMessage = processedMessage.replace(/\[TABLE\]/g, finalTableName)
    processedMessage = processedMessage.replace(/\[YEARS\]/g, '[YEARS]') // Variable spéciale pour les anniversaires

    // Appliquer le formatage avancé
    processedMessage = applyFormatting(processedMessage)

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
    { key: 'TABLE', label: 'Table assignée à l\'invité', example: 'Table A' },
    { key: 'YEARS', label: 'Nombre d\'années (anniversaires)', example: '25' }
  ]

  // Fonction pour obtenir les options de formatage disponibles
  const getFormattingOptions = () => [
    {
      category: 'Formatage de base',
      options: [
        { syntax: '[**texte**]', description: 'Texte en gras', example: '**Important**' },
        { syntax: '[*texte*]', description: 'Texte en italique', example: '*Élégant*' },
        { syntax: '[`texte`]', description: 'Code ou texte technique', example: '`Code`' },
        { syntax: '[_texte_]', description: 'Texte souligné', example: '_Souligné_' },
        { syntax: '[~texte~]', description: 'Texte barré', example: '~Barré~' }
      ]
    },
    {
      category: 'Alignement',
      options: [
        { syntax: '[>texte>]', description: 'Texte centré', example: '>Centré<' },
        { syntax: '[<texte<]', description: 'Texte aligné à gauche', example: '<Gauche<' },
        { syntax: '[>texte<]', description: 'Texte aligné à droite', example: '>Droite<' }
      ]
    },
    {
      category: 'Titres',
      options: [
        { syntax: '[#titre#]', description: 'Titre principal', example: '#Titre principal#' },
        { syntax: '[##sous-titre##]', description: 'Sous-titre', example: '##Sous-titre##' },
        { syntax: '[###sous-sous-titre###]', description: 'Sous-sous-titre', example: '###Sous-sous-titre###' }
      ]
    },
    {
      category: 'Couleurs',
      options: [
        { syntax: '[red:texte]', description: 'Texte en rouge', example: 'red:Important' },
        { syntax: '[blue:texte]', description: 'Texte en bleu', example: 'blue:Information' },
        { syntax: '[green:texte]', description: 'Texte en vert', example: 'green:Succès' },
        { syntax: '[orange:texte]', description: 'Texte en orange', example: 'orange:Attention' },
        { syntax: '[purple:texte]', description: 'Texte en violet', example: 'purple:Élégant' },
        { syntax: '[gray:texte]', description: 'Texte en gris', example: 'gray:Secondaire' }
      ]
    },
    {
      category: 'Effets spéciaux',
      options: [
        { syntax: '[!texte!]', description: 'Mise en évidence', example: '!Important!' },
        { syntax: '[>citation>]', description: 'Citation', example: '>Citation<' },
        { syntax: '[---]', description: 'Séparateur horizontal', example: '---' },
        { syntax: '[br]', description: 'Retour à la ligne', example: 'br' }
      ]
    }
  ]

  return {
    formatTime,
    formatDate,
    processMessage,
    extractVariables,
    getAvailableVariables,
    getFormattingOptions,
    applyFormatting,
    applyBasicFormatting,
    applyAlignment,
    applyTitles,
    applyColors,
    applySpecialEffects
  }
}

/**
 * Hook pour traiter les variables dans un message d'invitation
 */
export const useProcessedInvitationMessage = (data: InvitationData, message: string) => {
  const { processMessage } = useInvitationVariables(data)
  
  return computed(() => processMessage(message))
}
