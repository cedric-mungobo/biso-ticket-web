// Fichier généré automatiquement - ne pas modifier manuellement
// Généré le: 2025-10-18T09:12:42.865Z
// Nombre de routes: 13

export const staticRoutes = [
  "/",
  "/connexion",
  "/contact",
  "/evenements",
  "/evenements/expobeton-rdc-10-edition",
  "/evenements/journee-magique-a-aqua-splash",
  "/evenements/karaoke-jazz",
  "/evenements/lancement-officiel-de-biso-ticket",
  "/evenements/le-futur-de-leducation",
  "/evenements/magie-denfance",
  "/evenements/mariage-de-steven-et-safi",
  "/evenements/tombola-comeback-titan",
  "/inscription"
]

export const eventRoutes = routes.filter(route => route.startsWith('/evenements/') && route !== '/evenements')
export const staticPageCount = routes.length
export const eventCount = eventRoutes.length
