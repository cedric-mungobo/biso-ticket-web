export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthState()
  const { redirectAfterAuth } = useAuthRedirect()
  
  // Rediriger les utilisateurs connectés vers l'app
  if (isAuthenticated.value) {
    return redirectAfterAuth('/profile')
  }
})
