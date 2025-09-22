export default defineNuxtRouteMiddleware((to) => {
  // Exclure complètement les pages de réservation publique
  if (to.path.includes('/evenements/') && to.path.includes('/reservation/')) {
    return
  }
  
  // Exclure aussi les autres pages publiques
  if (to.path.includes('/invitation/')) {
    return
  }
  
  const { isAuthenticated } = useAuthState()
  const { redirectAfterAuth } = useAuthRedirect()
  
  // Rediriger les utilisateurs connectés vers l'app
  if (isAuthenticated.value) {
    return redirectAfterAuth('/profile')
  }
})

