/**
 * Génération dynamique du sitemap.xml
 * Inclut toutes les pages publiques et les événements
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = 'https://bisoticket.com'
  
  // Pages statiques
  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: new Date().toISOString()
    },
    {
      url: '/evenements',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: new Date().toISOString()
    },
    {
      url: '/connexion',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: new Date().toISOString()
    },
    {
      url: '/inscription',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: new Date().toISOString()
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: new Date().toISOString()
    }
  ]

  // Récupération des événements publics depuis l'API
  let eventPages: any[] = []
  
  try {
    const { $myFetch } = useNuxtApp()
    const eventsResponse = await $myFetch('/public/events', {
      method: 'GET',
      params: {
        per_page: 1000, // Récupérer tous les événements
        status: 'active'
      }
    })
    
    if (eventsResponse?.data?.items) {
      eventPages = eventsResponse.data.items.map((event: any) => ({
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

  // Génération du XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...eventPages].map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Définir les headers pour le XML
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache 1 heure
  
  return sitemap
})
