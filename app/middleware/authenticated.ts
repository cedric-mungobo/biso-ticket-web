export default defineNuxtRouteMiddleware((to) => {
  // Vérifie uniquement la présence du token d'authentification
  const token = useCookie('auth_token')

  if (!token.value) {
    const redirectUrl = to.fullPath
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
