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
    const variables: string[] = []
    
    // Variables avec crochets [VARIABLE]
    const bracketedRegex = /\[([A-Z_]+)\]/g
    const bracketedMatches = message.match(bracketedRegex)
    if (bracketedMatches) {
      variables.push(...bracketedMatches.map(match => match.slice(1, -1)))
    }
    
    // Variables sans crochets (dans le HTML)
    const unbracketedRegex = /\b(DATE|TIME|LOCATION|GUEST_NAME|EVENT_TITLE|TABLE|YEARS)\b/g
    const unbracketedMatches = message.match(unbracketedRegex)
    if (unbracketedMatches) {
      variables.push(...unbracketedMatches)
    }
    
    return [...new Set(variables)]
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
    
    // Gérer les titres dans les balises HTML existantes (éviter les balises imbriquées)
    // Si on trouve [##texte##] dans une balise <h1>, on remplace juste le contenu
    formatted = formatted.replace(/<h1[^>]*>\[##(.*?)##\]<\/h1>/g, '<h1 class="text-xl sm:text-2xl lg:text-3xl font-bold  text-center">$1</h1>')
    formatted = formatted.replace(/<h2[^>]*>\[##(.*?)##\]<\/h2>/g, '<h2 class="text-lg sm:text-xl lg:text-2xl font-semibold  text-center">$1</h2>')
    formatted = formatted.replace(/<h3[^>]*>\[##(.*?)##\]<\/h3>/g, '<h3 class="text-base sm:text-lg lg:text-xl font-medium  text-center">$1</h3>')
    
    // Titre principal: [#titre#] → <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-center">titre</h1>
    formatted = formatted.replace(/\[#(.*?)#\]/g, '<h1 class="text-xl sm:text-2xl lg:text-3xl font-bold  text-center">$1</h1>')
    
    // Sous-titre: [##sous-titre##] → <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 text-center">sous-titre</h2>
    formatted = formatted.replace(/\[##(.*?)##\]/g, '<h2 class="text-lg sm:text-xl lg:text-2xl font-semibold  text-center">$1</h2>')
    
    // Sous-sous-titre: [###sous-sous-titre###] → <h3 class="text-base sm:text-lg lg:text-xl font-medium mb-1 text-center">sous-sous-titre</h3>
    formatted = formatted.replace(/\[###(.*?)###\]/g, '<h3 class="text-base sm:text-lg lg:text-xl font-medium  text-center">$1</h3>')

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

    // Titres: [#texte#] → <h1 class="text-3xl font-bold mb-4 text-center">texte</h1>
    formatted = formatted.replace(/\[#(.*?)#\]/g, '<h1 class="text-3xl font-bold mb-4 text-center">$1</h1>')
    formatted = formatted.replace(/\[##(.*?)##\]/g, '<h2 class="text-2xl font-bold mb-3 text-center">$1</h2>')
    formatted = formatted.replace(/\[###(.*?)###\]/g, '<h3 class="text-xl font-bold mb-2 text-center">$1</h3>')

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



    // Récupérer le nom de la table depuis différentes sources possibles
    const tableName = invitationData?.guestTableName || 
                     invitationData?.guest_table_name || 
                     invitationData?.table_name ||
                     invitationData?.tableName ||
                     null

    // Si pas de table assignée, ne rien afficher (pas de fallback [TABLE])
    const finalTableName = tableName || ''

    // Remplacer les variables dynamiques (avec et sans crochets)
    const replaceVariable = (pattern: RegExp, value: string, fallback: string) => {
      return processedMessage.replace(pattern, value || fallback)
    }

    // Variables avec crochets [VARIABLE]
    processedMessage = replaceVariable(/\[DATE\]/g, eventData?.startsAt ? formatDate(eventData.startsAt) : '', '[DATE]')
    processedMessage = replaceVariable(/\[TIME\]/g, eventData?.startsAt ? formatTime(eventData.startsAt) : '', '[TIME]')
    processedMessage = replaceVariable(/\[LOCATION\]/g, eventData?.location || '', '[LOCATION]')
    processedMessage = replaceVariable(/\[GUEST_NAME\]/g, invitationData?.guestName || invitationData?.guest_name || '', '[GUEST_NAME]')
    processedMessage = replaceVariable(/\[EVENT_TITLE\]/g, eventData?.title || '', '[EVENT_TITLE]')
    processedMessage = replaceVariable(/\[TABLE\]/g, finalTableName, '[TABLE]')
    processedMessage = replaceVariable(/\[YEARS\]/g, '', '[YEARS]') // Variable spéciale pour les anniversaires

    // Corriger les titres mal formatés (sans crochets) AVANT le formatage
    console.log('🔧 Message avant correction des titres:', processedMessage)
    
    // Corriger les titres mal formatés dans le contenu HTML
    processedMessage = processedMessage.replace(/>##\s*(.*?)\s*##</g, '>[##$1##]<')
    processedMessage = processedMessage.replace(/>#\s*(.*?)\s*#</g, '>[$1]<')
    processedMessage = processedMessage.replace(/>###\s*(.*?)\s*###</g, '>[###$1###]<')
    
    // Corriger aussi les titres en début de ligne
    processedMessage = processedMessage.replace(/^##\s*(.*?)\s*##$/gm, '[##$1##]')
    processedMessage = processedMessage.replace(/^#\s*(.*?)\s*#$/gm, '[$1]')
    processedMessage = processedMessage.replace(/^###\s*(.*?)\s*###$/gm, '[###$1###]')
    
    console.log('🔧 Message après correction des titres:', processedMessage)

    // Appliquer le formatage avancé AVANT le remplacement des variables sans crochets
    processedMessage = applyFormatting(processedMessage)

    // Variables sans crochets (pour le HTML direct) - APRÈS le formatage
    processedMessage = replaceVariable(/\bDATE\b/g, eventData?.startsAt ? formatDate(eventData.startsAt) : '', 'DATE')
    processedMessage = replaceVariable(/\bTIME\b/g, eventData?.startsAt ? formatTime(eventData.startsAt) : '', 'TIME')
    processedMessage = replaceVariable(/\bLOCATION\b/g, eventData?.location || '', 'LOCATION')
    processedMessage = replaceVariable(/\bGUEST_NAME\b/g, invitationData?.guestName || invitationData?.guest_name || '', 'GUEST_NAME')
    processedMessage = replaceVariable(/\bEVENT_TITLE\b/g, eventData?.title || '', 'EVENT_TITLE')
    processedMessage = replaceVariable(/\bTABLE\b/g, finalTableName, 'TABLE')
    processedMessage = replaceVariable(/\bYEARS\b/g, '', 'YEARS') // Variable spéciale pour les anniversaires


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

  // Fonction pour convertir le HTML en texte simple pour l'édition
  const htmlToSimpleText = (html: string): string => {
    if (!html) return ''
    
    let text = html
    
    // Remplacer les balises HTML par des équivalents texte avec la syntaxe personnalisée
    text = text.replace(/<h1[^>]*>/g, '[#')
    text = text.replace(/<h2[^>]*>/g, '[##')
    text = text.replace(/<h3[^>]*>/g, '[###')
    text = text.replace(/<\/h1>/g, '#]')
    text = text.replace(/<\/h2>/g, '##]')
    text = text.replace(/<\/h3>/g, '###]')
    
    text = text.replace(/<strong[^>]*>/g, '[**')
    text = text.replace(/<\/strong>/g, '**]')
    
    text = text.replace(/<em[^>]*>/g, '[*')
    text = text.replace(/<\/em>/g, '*]')
    
    text = text.replace(/<u[^>]*>/g, '[_')
    text = text.replace(/<\/u>/g, '_]')
    
    text = text.replace(/<s[^>]*>/g, '[~')
    text = text.replace(/<\/s>/g, '~]')
    
    text = text.replace(/<code[^>]*>/g, '[`')
    text = text.replace(/<\/code>/g, '`]')
    
    text = text.replace(/<div[^>]*class="[^"]*text-center[^"]*"[^>]*>/g, '[>')
    text = text.replace(/<div[^>]*class="[^"]*text-right[^"]*"[^>]*>/g, '[>')
    text = text.replace(/<div[^>]*class="[^"]*text-left[^"]*"[^>]*>/g, '[<')
    text = text.replace(/<\/div>/g, '<]')
    
    text = text.replace(/<hr[^>]*>/g, '[---]')
    text = text.replace(/<br\s*\/?>/g, '\n')
    
    // Nettoyer les autres balises HTML
    text = text.replace(/<[^>]*>/g, '')
    
    // Corriger les titres mal formatés (sans crochets)
    text = text.replace(/^##\s*(.*?)\s*##$/gm, '[##$1##]')
    text = text.replace(/^#\s*(.*?)\s*#$/gm, '[$1]')
    text = text.replace(/^###\s*(.*?)\s*###$/gm, '[###$1###]')
    
    // Nettoyer les espaces multiples et les retours à la ligne
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n')
    text = text.replace(/[ \t]+/g, ' ')
    text = text.trim()
    
    return text
  }

  // Fonction pour convertir le texte simple en HTML
  const simpleTextToHtml = (text: string): string => {
    if (!text) return ''
    
    let html = text
    
    // Appliquer le formatage personnalisé existant
    html = applyFormatting(html)
    
    // Convertir les retours à la ligne en HTML
    html = html.replace(/\n/g, '<br>')
    
    return html
  }

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
    applySpecialEffects,
    htmlToSimpleText,
    simpleTextToHtml
  }
}

/**
 * Hook pour traiter les variables dans un message d'invitation
 */
export const useProcessedInvitationMessage = (data: InvitationData, message: string) => {
  const { processMessage } = useInvitationVariables(data)
  
  return computed(() => processMessage(message))
}
