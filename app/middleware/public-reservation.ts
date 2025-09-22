/**
 * Middleware pour les pages de réservation publique
 * Aucune authentification requise
 */
export default defineNuxtRouteMiddleware((to) => {
  // Cette page est publique, aucune vérification d'authentification
  // Les utilisateurs connectés et non-connectés peuvent y accéder
  return
})
