export default defineNuxtRouteMiddleware((to) => {
  // Vérifie uniquement la présence du token d'authentification
  const token = useCookie('auth_token')

  if (!token.value) {
    const redirectUrl = to.fullPath

    const toast = useToast()
    toast.add({
      title: 'Vous devez être connecté pour accéder à cette page',
      description: 'Veuillez vous connecter pour accéder à cette page',
      color: 'error'
    })
    return navigateTo(`/connexion?redirect=${encodeURIComponent(redirectUrl)}`)
  }
})
