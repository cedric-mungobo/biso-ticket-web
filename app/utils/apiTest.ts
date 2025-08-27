// Utilitaires de test et diagnostic pour l'API
import type { CreateEventData } from '~/composables/useOrganizerEvents'

/**
 * Test de connectivité API de base
 */
export const testAPIConnectivity = async (): Promise<{
  success: boolean
  message: string
  details?: any
}> => {
  try {
    console.log('🔍 Test de connectivité API...')
    
    // Utiliser l'endpoint /discover qui existe selon la documentation
    const response = await fetch('https://api.bisoticket.com/api/v1/discover', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: '✅ Connectivité API OK - Endpoint /discover accessible',
        details: {
          status: response.status,
          statusText: response.statusText,
          endpoint: '/discover',
          responseData: data
        }
      }
    } else {
      // Essayer de récupérer le message d'erreur selon la documentation API
      let errorMessage = `Erreur ${response.status}: ${response.statusText}`
      let errorDetails = null
      
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
        if (errorData.errors) {
          errorDetails = errorData.errors
        }
      } catch (parseError) {
        // Si on ne peut pas parser la réponse JSON
        console.warn('Impossible de parser la réponse d\'erreur:', parseError)
      }
      
      return {
        success: false,
        message: `❌ Erreur de connectivité: ${errorMessage}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          endpoint: '/discover',
          errorMessage,
          errorDetails
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `💥 Erreur de connectivité: ${error.message}`,
      details: {
        error: error.message,
        type: error.name,
        stack: error.stack
      }
    }
  }
}

/**
 * Test de l'endpoint de création d'événements
 */
export const testCreateEventEndpoint = async (token: string): Promise<{
  success: boolean
  message: string
  details?: any
}> => {
  try {
    console.log('🔍 Test de l\'endpoint de création d\'événements...')
    
    // Données de test minimales selon la documentation API
    const testData: CreateEventData = {
      name: 'Test Event API',
      description: 'Événement de test pour diagnostic API',
      date_time: '2025-12-25 20:00:00', // Format exact de la doc API
      location: 'Lieu de test',
      category: 'Test'
    }
    
    console.log('📝 Données de test:', testData)
    
    const response = await fetch('https://api.bisoticket.com/api/v1/events/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    })
    
    let responseData = null
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`
    let errorDetails = null
    
    try {
      responseData = await response.json()
      
      // Récupérer le message d'erreur selon la documentation API
      if (responseData.message) {
        errorMessage = responseData.message
      }
      if (responseData.errors) {
        errorDetails = responseData.errors
      }
    } catch (parseError) {
      console.warn('Impossible de parser la réponse JSON:', parseError)
    }
    
    if (response.ok) {
      return {
        success: true,
        message: '✅ Endpoint de création d\'événements fonctionnel',
        details: {
          status: response.status,
          data: responseData,
          sentData: testData
        }
      }
    } else {
      // Gestion spécifique selon les codes d'erreur de la documentation API
      let specificMessage = errorMessage
      
      switch (response.status) {
        case 401:
          specificMessage = 'Non autorisé - Token invalide ou expiré'
          break
        case 403:
          specificMessage = 'Accès refusé - Permissions insuffisantes'
          break
        case 404:
          specificMessage = 'Endpoint non trouvé - Vérifiez l\'URL de l\'API'
          break
        case 422:
          specificMessage = 'Erreur de validation - Données invalides'
          break
        case 500:
          specificMessage = 'Erreur serveur interne'
          break
        default:
          specificMessage = errorMessage
      }
      
      return {
        success: false,
        message: `❌ ${specificMessage}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          endpoint: '/events/create',
          errorMessage: specificMessage,
          errorDetails,
          responseData,
          sentData: testData,
          recommendations: getRecommendationsForError(response.status, errorDetails)
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `💥 Erreur lors du test: ${error.message}`,
      details: {
        error: error.message,
        type: error.name,
        stack: error.stack,
        endpoint: '/events/create'
      }
    }
  }
}

/**
 * Génère des recommandations spécifiques selon le type d'erreur
 */
const getRecommendationsForError = (status: number, errorDetails: any): string[] => {
  const recommendations: string[] = []
  
  switch (status) {
    case 401:
      recommendations.push('Vérifiez que votre token d\'authentification est valide')
      recommendations.push('Reconnectez-vous si nécessaire')
      break
    case 403:
      recommendations.push('Vérifiez que vous avez les permissions pour créer des événements')
      recommendations.push('Contactez l\'administrateur si nécessaire')
      break
    case 404:
      recommendations.push('Vérifiez que l\'URL de l\'API est correcte')
      recommendations.push('Vérifiez que l\'endpoint /events/create existe')
      break
    case 422:
      recommendations.push('Vérifiez le format des données envoyées')
      if (errorDetails) {
        Object.keys(errorDetails).forEach(field => {
          recommendations.push(`Champ "${field}": ${errorDetails[field].join(', ')}`)
        })
      }
      recommendations.push('Consultez la documentation API pour le format attendu')
      break
    case 500:
      recommendations.push('Erreur serveur - Réessayez plus tard')
      recommendations.push('Contactez le support si le problème persiste')
      break
    default:
      recommendations.push('Vérifiez la console pour plus de détails')
  }
  
  return recommendations
}

/**
 * Test de validation des données selon la documentation API
 */
export const validateEventDataFormat = (data: CreateEventData): {
  valid: boolean
  errors: string[]
  correctedData?: CreateEventData
} => {
  const errors: string[] = []
  
  // Vérification des champs requis
  if (!data.name?.trim()) errors.push('Le nom est requis')
  if (!data.description?.trim()) errors.push('La description est requise')
  if (!data.date_time) errors.push('La date et heure sont requises')
  if (!data.location?.trim()) errors.push('Le lieu est requis')
  if (!data.category?.trim()) errors.push('La catégorie est requise')
  
  // Vérification du format de date
  if (data.date_time) {
    try {
      const date = new Date(data.date_time)
      if (isNaN(date.getTime())) {
        errors.push('Format de date invalide')
      } else {
        // Convertir en format attendu par l'API
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        
        const correctedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        
        if (correctedDateTime !== data.date_time) {
          errors.push(`Format de date corrigé: ${correctedDateTime}`)
        }
      }
    } catch (error) {
      errors.push('Erreur de parsing de la date')
    }
  }
  
  // Vérification de la longueur des champs
  if (data.name && data.name.length > 255) errors.push('Le nom est trop long (max 255 caractères)')
  if (data.description && data.description.length > 1000) errors.push('La description est trop longue (max 1000 caractères)')
  if (data.location && data.location.length > 255) errors.push('Le lieu est trop long (max 255 caractères)')
  if (data.category && data.category.length > 100) errors.push('La catégorie est trop longue (max 100 caractères)')
  
  const valid = errors.length === 0
  
  // Données corrigées si nécessaire
  let correctedData: CreateEventData | undefined
  if (!valid) {
    correctedData = {
      name: data.name?.trim() || '',
      description: data.description?.trim() || '',
      date_time: data.date_time || '',
      location: data.location?.trim() || '',
      category: data.category?.trim() || '',
      image: data.image
    }
  }
  
  return { valid, errors, correctedData }
}

/**
 * Diagnostic complet de l'API
 */
export const diagnoseAPI = async (token?: string): Promise<{
  summary: string
  details: any[]
  recommendations: string[]
}> => {
  console.log('🔍 Démarrage du diagnostic API...')
  
  const results = []
  const recommendations = []
  
  // Test de connectivité
  const connectivityTest = await testAPIConnectivity()
  results.push({
    test: 'Connectivité API',
    result: connectivityTest
  })
  
  if (!connectivityTest.success) {
    recommendations.push('Vérifiez la connectivité réseau et l\'URL de l\'API')
  }
  
  // Test de l'endpoint si le token est disponible
  if (token) {
    const endpointTest = await testCreateEventEndpoint(token)
    results.push({
      test: 'Endpoint création événements',
      result: endpointTest
    })
    
    if (!endpointTest.success) {
      if (endpointTest.details?.status === 401) {
        recommendations.push('Token d\'authentification invalide ou expiré')
      } else if (endpointTest.details?.status === 422) {
        recommendations.push('Problème de validation des données - vérifiez le format')
      } else if (endpointTest.details?.status === 404) {
        recommendations.push('Endpoint non trouvé - vérifiez l\'URL de l\'API')
      }
    }
  } else {
    recommendations.push('Token d\'authentification requis pour tester l\'endpoint')
  }
  
  // Résumé
  const successCount = results.filter(r => r.result.success).length
  const totalCount = results.length
  
  const summary = `Diagnostic terminé: ${successCount}/${totalCount} tests réussis`
  
  return {
    summary,
    details: results,
    recommendations
  }
}

/**
 * Test rapide de l'API sans token (pour vérifier la connectivité de base)
 */
export const quickAPITest = async (): Promise<{
  success: boolean
  message: string
  details?: any
}> => {
  try {
    console.log('🚀 Test rapide de l\'API...')
    
    // Test de l'endpoint /discover (public, pas besoin de token)
    const response = await fetch('https://api.bisoticket.com/api/v1/discover', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: '✅ API accessible - Endpoint /discover fonctionnel',
        details: {
          status: response.status,
          endpoint: '/discover',
          hasData: !!data.data,
          eventsCount: data.data?.events?.length || 0
        }
      }
    } else {
      return {
        success: false,
        message: `❌ API accessible mais endpoint /discover retourne ${response.status}`,
        details: {
          status: response.status,
          endpoint: '/discover'
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `💥 Erreur de connectivité: ${error.message}`,
      details: {
        error: error.message,
        type: error.name
      }
    }
  }
}
