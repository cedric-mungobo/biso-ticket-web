export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Attendre que l'authentification soit initialisée
  if (isLoading.value) {
    return
  }

  // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
  if (!isAuthenticated.value) {
    // Sauvegarder l'URL de destination pour rediriger après connexion
    const redirectUrl = to.fullPath
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
