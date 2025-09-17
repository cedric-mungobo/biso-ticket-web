/**
 * Middleware pour vérifier l'authentification Google
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté via Google
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isGoogleUser } = useAuthState()
  
  // Vérifier si l'utilisateur est connecté via Google
  if (!isGoogleUser.value) {
    return navigateTo('/connexion?error=google_auth_required')
  }
})
