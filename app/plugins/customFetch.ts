import { $fetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Utiliser la base URL depuis la configuration runtime
  const baseURL = config.public.apiBaseUrl || 'http://api.bisoticket.com/api'
  
  // État global pour les erreurs de validation
  const validationErrors = ref<Record<string, string[]>>({})
  const hasValidationErrors = computed(() => Object.keys(validationErrors.value).length > 0)
  
  // Fonction pour nettoyer les erreurs
  const clearValidationErrors = () => {
    validationErrors.value = {}
  }
  
  // Fournir les erreurs de validation globalement
  nuxtApp.provide('validationErrors', validationErrors)
  nuxtApp.provide('hasValidationErrors', hasValidationErrors)
  nuxtApp.provide('clearValidationErrors', clearValidationErrors)

  const customFetch = $fetch.create({
    baseURL,
    onRequest({ request, options }) {
      // Nettoyer les erreurs de validation précédentes pour les requêtes POST/PUT/PATCH
      const method = options.method?.toUpperCase()
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        clearValidationErrors()
      }
      
      // Ajouter l'en-tête d'autorisation si un token existe
      const token = useCookie('auth_token').value
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
      
      // Headers par défaut
      options.headers.set('Accept', 'application/json')
      // Ne pas forcer Content-Type si on envoie un FormData (laisse le navigateur définir le boundary)
      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
      if (!isFormData) {
        options.headers.set('Content-Type', 'application/json')
      }

      // Logging (dev seulement)
      if (process.dev) {
        // @ts-ignore
        options._meta = { startedAt: performance.now(), url: String(request), method: options.method || 'GET' }
      }
    },
    onResponse({ request, response, options }) {
      if (process.dev) {
        try {
          // @ts-ignore
          const meta = options._meta || {}
          const durationMs = meta.startedAt ? Math.round(performance.now() - meta.startedAt) : undefined
          // @ts-ignore
          const data = (response as any)?._data
          const preview = typeof data === 'string' ? data.slice(0, 200) : JSON.stringify(data)?.slice(0, 200)
          console.log('[API]', meta.method || options.method || 'GET', String(request), '→', response.status, durationMs ? `${durationMs}ms` : '', preview)
        } catch (_e) {
          // noop
        }
      }
    },
    onResponseError({ request, response, options }) {
      // Extraire le message d'erreur de la réponse
      let errorMessage = 'Une erreur est survenue'
      let errorDetails = {}
      
      // Gérer les erreurs API selon les codes de statut HTTP standardisés
      switch (response.status) {
        case 400:
          // Requête invalide
          if (process.dev) console.error('Erreur 400: Requête invalide')
          errorMessage = 'Requête invalide. Vérifiez les paramètres envoyés.'
          break
          
        case 401:
          // Non authentifié
          if (process.dev) console.error('Erreur 401: Non authentifié')
          // Nettoyer le token invalide
          const token = useCookie('auth_token')
          token.value = null
          errorMessage = 'Non authentifié. Veuillez vous reconnecter.'
          break
          
        case 403:
          // Non autorisé
          if (process.dev) console.error('Erreur 403: Non autorisé')
          errorMessage = 'Non autorisé. Vous n\'avez pas les permissions nécessaires.'
          break
          
        case 404:
          // Ressource non trouvée
          if (process.dev) console.error('Erreur 404: Ressource non trouvée')
          errorMessage = 'Ressource non trouvée. L\'élément demandé n\'existe plus.'
          break
          
        case 422:
          // Erreur de validation
          if (process.dev) console.error('Erreur 422: Erreur de validation')
          if (Object.keys(errorDetails).length > 0) {
            // Stocker les erreurs de validation globalement
            validationErrors.value = errorDetails
            errorMessage = 'Erreur de validation. Vérifiez les informations saisies.'
          } else {
            errorMessage = 'Erreur de validation. Vérifiez les informations saisies.'
          }
          break
          
        case 500:
          // Erreur serveur
          if (process.dev) console.error('Erreur 500: Erreur serveur')
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.'
          break
          
        default:
          if (response.status >= 500) {
            // Autres erreurs serveur (5xx)
            if (process.dev) console.error('Erreur serveur:', response.status)
            errorMessage = 'Service temporairement indisponible. Veuillez réessayer.'
          } else if (response.status === 0 || !response.status) {
            // Erreur de réseau
            errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.'
          } else {
            // Autres erreurs client (4xx)
            errorMessage = `Erreur ${response.status}. Veuillez réessayer.`
          }
          break
      }

      // Essayer d'utiliser le message de l'API si disponible et plus spécifique
      try {
        // @ts-ignore - certaines implémentations exposent _data
        const responseData = (response as any)._data
        
        if (responseData) {
          // Format API Biso Ticket: { status: false, message: "...", errors: { } }
          // Mais pour les erreurs 422, l'API envoie directement { message: "...", errors: { } }
          let apiMessage = null
          if (responseData.status === false && responseData.message) {
            apiMessage = responseData.message
            errorDetails = responseData.errors || {}
          } else if (responseData.message) {
            apiMessage = responseData.message
            errorDetails = responseData.errors || {}
          }
          
          // Utiliser le message de l'API si :
          // 1. Il existe
          // 2. Il n'est pas trop technique (pas de stack trace, etc.)
          // 3. Il est plus spécifique que le message par défaut
          if (apiMessage && 
              !apiMessage.includes('Stack trace') && 
              !apiMessage.includes('Exception') &&
              !apiMessage.includes('Error:') &&
              !apiMessage.includes('could not be found') &&
              !apiMessage.includes('Route not found') &&
              !apiMessage.includes('404 Not Found') &&
              apiMessage.length < 200) {
            errorMessage = apiMessage
          }
        }
      } catch (_e) {
        // Log en dev seulement
        if (process.dev) console.error('Error parsing API response:', _e)
        // Si on ne peut pas parser la réponse, garder le message par défaut
      }

      // Afficher le toast d'erreur seulement si ce n'est pas une erreur de validation (422)
      // Les erreurs 422 sont gérées par les composants de formulaire
      if (response.status !== 422) {
        try {
          const { showError } = useAppToast()
          showError('Erreur', errorMessage)
        } catch (_e) {
          // Si useToast n'est pas disponible (par exemple côté serveur), ignorer
          console.warn('Impossible d\'afficher le toast d\'erreur:', _e)
        }
      }

      // Logging dev (erreurs) - masqué en production
      if (process.dev) {
        try {
          // @ts-ignore
          const meta = options._meta || {}
          const durationMs = meta.startedAt ? Math.round(performance.now() - meta.startedAt) : undefined
          console.warn('[API ERROR]', meta.method || options.method || 'GET', String(request), '→', response.status, durationMs ? `${durationMs}ms` : '')
        } catch (_e) {
          // noop
        }
      }
    },
  })

  // Fournir l'instance custom fetch globalement sous deux alias
  nuxtApp.provide('customFetch', customFetch)
  nuxtApp.provide('myFetch', customFetch)
})
