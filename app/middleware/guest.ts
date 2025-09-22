export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthState()
  const { redirectAfterAuth } = useAuthRedirect()
  
  // Exclure les pages de réservation publique - les utilisateurs connectés peuvent y accéder
  if (to.path.includes('/evenements/') && to.path.includes('/reservation/')) {
    return
  }
  
  // Rediriger les utilisateurs connectés vers l'app
  if (isAuthenticated.value) {
    return redirectAfterAuth('/profile')
  }
})
