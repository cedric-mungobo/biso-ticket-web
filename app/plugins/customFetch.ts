import { $fetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Utiliser la base URL depuis la configuration runtime
  const baseURL = config.public.apiBaseUrl || 'http://api.bisoticket.com/api'

  const customFetch = $fetch.create({
    baseURL,
    onRequest({ request, options }) {
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
      // Gérer les erreurs API selon la nouvelle structure
      if (response.status === 401) {
        console.error('Erreur 401: Accès non autorisé - Token expiré ou invalide')
        // Nettoyer le token invalide
        const token = useCookie('auth_token')
        token.value = null
      } else if (response.status === 422) {
        console.error('Erreur 422: Données de validation invalides')
      } else if (response.status === 404) {
        console.error('Erreur 404: Ressource non trouvée')
      } else if (response.status >= 500) {
        // Essayer d'extraire un body JSON lisible pour debug
        try {
          // @ts-ignore - certaines implémentations exposent _data
          const body = (response as any)._data || null
          console.error('Erreur serveur:', response.status, body || '')
        } catch (_e) {
          console.error('Erreur serveur:', response.status)
        }
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
