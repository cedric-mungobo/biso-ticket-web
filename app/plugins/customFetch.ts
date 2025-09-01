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
      
      try {
        // @ts-ignore - certaines implémentations exposent _data
        const responseData = (response as any)._data
        
        if (responseData) {
          // Format API Biso Ticket: { status: false, message: "...", errors: { } }
          // Mais pour les erreurs 422, l'API envoie directement { message: "...", errors: { } }
          if (responseData.status === false) {
            errorMessage = responseData.message || errorMessage
            errorDetails = responseData.errors || {}
          } else if (responseData.message) {
            errorMessage = responseData.message
            errorDetails = responseData.errors || {}
          }
        }
      } catch (_e) {
        console.error('Error parsing response:', _e) // Debug
        // Si on ne peut pas parser la réponse, utiliser les messages par défaut
      }

      // Gérer les erreurs API selon la nouvelle structure
      if (response.status === 401) {
        console.error('Erreur 401: Accès non autorisé - Token expiré ou invalide')
        // Nettoyer le token invalide
        const token = useCookie('auth_token')
        token.value = null
        errorMessage = 'Session expirée. Veuillez vous reconnecter.'
      } else if (response.status === 422) {
        console.error('Erreur 422: Données de validation invalides')
        if (Object.keys(errorDetails).length > 0) {
          // Stocker les erreurs de validation globalement
          validationErrors.value = errorDetails
        } else {
          errorMessage = 'Données de validation invalides'
        }
      } else if (response.status === 404) {
        console.error('Erreur 404: Ressource non trouvée')
        errorMessage = 'Ressource non trouvée'
      } else if (response.status >= 500) {
        console.error('Erreur serveur:', response.status)
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.'
      }

      // Afficher le toast d'erreur
      try {
        const toast = useToast()
        toast.add({
          title: 'Erreur',
          description: errorMessage,
          color: 'error'
        })
      } catch (_e) {
        // Si useToast n'est pas disponible (par exemple côté serveur), ignorer
        console.warn('Impossible d\'afficher le toast d\'erreur:', _e)
      }

      // Logging dev (erreurs)
      if (process.dev) {
        try {
          // @ts-ignore
          const meta = options._meta || {}
          const durationMs = meta.startedAt ? Math.round(performance.now() - meta.startedAt) : undefined
          // @ts-ignore
          const data = (response as any)?._data
          const preview = typeof data === 'string' ? data.slice(0, 200) : JSON.stringify(data)?.slice(0, 200)
          console.warn('[API]', meta.method || options.method || 'GET', String(request), '→', response.status, durationMs ? `${durationMs}ms` : '', preview)
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
