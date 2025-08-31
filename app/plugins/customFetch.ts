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
        console.error('Erreur serveur:', response.status)
      }
    },
  })

  // Fournir l'instance custom fetch globalement sous deux alias
  nuxtApp.provide('customFetch', customFetch)
  nuxtApp.provide('myFetch', customFetch)
})
