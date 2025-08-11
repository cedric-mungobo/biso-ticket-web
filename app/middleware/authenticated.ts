export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
