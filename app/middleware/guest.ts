export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthState()
  
  // Rediriger les utilisateurs connectés vers l'app
  if (isAuthenticated.value) {
    return navigateTo('/profile')
  }
})
