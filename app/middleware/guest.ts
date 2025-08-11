import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Si l'utilisateur est déjà connecté, redirection vers la page d'accueil
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
