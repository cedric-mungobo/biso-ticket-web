export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ request, options, error }) {
      // Récupérer le token depuis localStorage
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          options.headers.set('Authorization', `Bearer ${token}`)
        }
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
  