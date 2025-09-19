export default defineNuxtRouteMiddleware((to) => {
  // Vérifie uniquement la présence du token d'authentification
  const token = useCookie('auth_token')

  if (!token.value) {
    const redirectUrl = to.fullPath

    useAppToast().showError('Vous devez être connecté pour accéder à cette page', 'Veuillez vous connecter pour accéder à cette page')
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
