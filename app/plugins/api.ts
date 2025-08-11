export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    
    // Créer le cookie pour le token d'authentification
    const authTokenCookie = useCookie('auth_token', {
      default: () => null as string | null,
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      secure: true,
      sameSite: 'strict'
    })
    
    const api = $fetch.create({
      baseURL: config.public.apiBaseUrl,
      onRequest({ request, options, error }) {
        // Récupérer le token depuis le cookie
        const token = authTokenCookie.value
        if (token) {
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo('/connexion'))
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })
  