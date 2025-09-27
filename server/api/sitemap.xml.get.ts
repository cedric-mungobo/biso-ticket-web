/**
 * Génération dynamique du sitemap.xml
 * Inclut toutes les pages publiques et les événements
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = 'https://bisoticket.com'
  
  // Pages statiques avec métadonnées SEO optimisées
  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: new Date().toISOString(),
      // Métadonnées SEO de la page d'accueil
      title: 'Passez au digital pour vos événements avec Biso Ticket',
      description: 'Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales. Recevez les paiements mobile money, achetez les billets en ligne via mobile money, configuration en 3 minutes.',
      keywords: 'événements digitaux, billets en ligne, invitations digitales, mobile money, paiement mobile, gestion événement, vente billets, réservation événement, Kinshasa, RDC, Congo, organisateur événement, ticket en ligne, Orange Money, Airtel Money, M-Pesa'
    },
    {
      url: '/evenements',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: new Date().toISOString(),
      title: 'Événements - Biso Ticket',
      description: 'Découvrez tous les événements disponibles sur Biso Ticket. Concerts, conférences, festivals et bien plus encore. Réservez vos billets en toute sécurité.',
      keywords: 'événements, concerts, conférences, festivals, billets, réservation, Kinshasa, RDC'
    },
    {
      url: '/connexion',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: new Date().toISOString(),
      title: 'Connexion - Biso Ticket',
      description: 'Connectez-vous à votre compte Biso Ticket pour gérer vos événements et réservations.'
    },
    {
      url: '/inscription',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: new Date().toISOString(),
      title: 'Inscription - Biso Ticket',
      description: 'Créez votre compte Biso Ticket pour commencer à organiser des événements et réserver des billets.'
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: new Date().toISOString(),
      title: 'Contact - Biso Ticket',
      description: 'Contactez l\'équipe Biso Ticket pour toute question ou assistance concernant la gestion de vos événements.'
    }
  ]

  // Récupération des événements publics depuis l'API
  let eventPages: any[] = []
  
  try {
    const eventsResponse = await $fetch(`${config.public.apiBaseUrl}/public/events`, {
      method: 'GET',
      params: {
        per_page: 1000, // Récupérer tous les événements
        status: 'active'
      }
    })
    
    if (eventsResponse && (eventsResponse as any).data?.items) {
      eventPages = (eventsResponse as any).data.items.map((event: any) => ({
        url: `/evenements/${event.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: event.updatedAt || event.createdAt || new Date().toISOString()
      }))
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements pour le sitemap:', error)
    // En cas d'erreur, on continue sans les événements
  }

  // Génération du XML avec métadonnées SEO enrichies
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${[...staticPages, ...eventPages].map(page => {
  let urlContent = `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`
  
  // Ajouter les métadonnées SEO si disponibles
  if (page.title) {
    urlContent += `
    <image:image>
      <image:title><![CDATA[${page.title}]]></image:title>`
    if (page.description) {
      urlContent += `
      <image:caption><![CDATA[${page.description}]]></image:caption>`
    }
    urlContent += `
    </image:image>`
  }
  
  urlContent += `
  </url>`
  return urlContent
}).join('\n')}
</urlset>`

  // Définir les headers pour le XML
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache 1 heure
  
  return sitemap
})
