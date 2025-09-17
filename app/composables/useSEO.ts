/**
 * Composable SEO centralisé pour Biso Ticket
 * Gère toutes les métadonnées SEO, Open Graph, Twitter Cards, etc.
 */

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'event'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

export const useSEO = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  
  // Configuration par défaut
  const defaultConfig: SEOConfig = {
    siteName: 'Biso Ticket',
    locale: 'fr_FR',
    type: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@bisoticket',
    twitterCreator: '@bisoticket',
    keywords: ['billet', 'événement', 'ticket', 'réservation', 'Kinshasa', 'RDC', 'Congo','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets en ligne avec mobile money : orange money, airtel money, m-pesa','les invitation eletronique  pour mon mariage','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets en ligne avec mobile money : orange money, airtel money, m-pesa','les invités de votre événement','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets','organisateur événement à Kinshasa', 'ticket en ligne','vendre mes billets en ligne avec mobile money : orange money, airtel money, m-pesa','les invités de votre événement'],
    image: '/images/logo.png',
    url: `https://bisoticket.com${route.path}`
  }

  /**
   * Génère les métadonnées SEO complètes
   */
  const generateSEOMeta = (customConfig: Partial<SEOConfig> = {}) => {
    const seoConfig = { ...defaultConfig, ...customConfig }
    
    // URL canonique
    const canonical = seoConfig.canonical || seoConfig.url
    
    // Image complète avec domaine
    const fullImageUrl = seoConfig.image?.startsWith('http') 
      ? seoConfig.image 
      : `https://bisoticket.com${seoConfig.image}`
    
    // Titre complet
    const fullTitle = seoConfig.title 
      ? `${seoConfig.title} - ${seoConfig.siteName}`
      : seoConfig.siteName

    return {
      title: fullTitle,
      meta: [
        // Métadonnées de base
        { name: 'description', content: seoConfig.description },
        { name: 'keywords', content: seoConfig.keywords?.join(', ') },
        { name: 'author', content: seoConfig.author || seoConfig.siteName },
        { name: 'robots', content: `${seoConfig.noindex ? 'noindex' : 'index'}, ${seoConfig.nofollow ? 'nofollow' : 'follow'}` },
        
        // Open Graph
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: seoConfig.description },
        { property: 'og:image', content: fullImageUrl },
        { property: 'og:url', content: canonical },
        { property: 'og:type', content: seoConfig.type },
        { property: 'og:site_name', content: seoConfig.siteName },
        { property: 'og:locale', content: seoConfig.locale },
        
        // Twitter Cards
        { name: 'twitter:card', content: seoConfig.twitterCard },
        { name: 'twitter:site', content: seoConfig.twitterSite },
        { name: 'twitter:creator', content: seoConfig.twitterCreator },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: seoConfig.description },
        { name: 'twitter:image', content: fullImageUrl },
        
        // Métadonnées spécifiques aux articles/événements
        ...(seoConfig.publishedTime ? [{ property: 'article:published_time', content: seoConfig.publishedTime }] : []),
        ...(seoConfig.modifiedTime ? [{ property: 'article:modified_time', content: seoConfig.modifiedTime }] : []),
        ...(seoConfig.author ? [{ property: 'article:author', content: seoConfig.author }] : []),
        ...(seoConfig.section ? [{ property: 'article:section', content: seoConfig.section }] : []),
        ...(seoConfig.tags?.map(tag => ({ property: 'article:tag', content: tag })) || []),
      ],
      link: [
        // URL canonique
        { rel: 'canonical', href: canonical },
        
        // Favicons
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        
        // Manifest
        { rel: 'manifest', href: '/manifest.json' },
      ]
    }
  }

  /**
   * Applique les métadonnées SEO à la page courante
   */
  const setSEO = (config: Partial<SEOConfig> = {}) => {
    const seoMeta = generateSEOMeta(config)
    useHead(seoMeta)
  }

  /**
   * Génère les métadonnées pour un événement
   */
  const setEventSEO = (event: any) => {
    const eventConfig: Partial<SEOConfig> = {
      title: event.title,
      description: event.description || `Rejoignez-nous pour ${event.title} le ${formatEventDate(event.startsAt)} à ${event.location}`,
      type: 'event',
      image: event.imageUrl || '/images/event-default.jpg',
      url: `https://bisoticket.com/evenements/${event.slug}`,
      publishedTime: event.createdAt,
      modifiedTime: event.updatedAt,
      author: event.organizer?.name || 'Biso Ticket',
      section: 'Événements',
      tags: [
        ...(event.settings?.categories || []),
        ...(event.settings?.tags || []),
        'événement',
        'billet',
        'réservation'
      ],
      keywords: [
        event.title,
        event.location,
        'événement',
        'billet',
        'réservation',
        'Kinshasa',
        'RDC',
        'Congo',
        ...(event.settings?.categories || []),
        ...(event.settings?.tags || [])
      ]
    }
    
    setSEO(eventConfig)
  }

  /**
   * Génère les métadonnées pour la page d'accueil
   */
  const setHomeSEO = () => {
    const homeConfig: Partial<SEOConfig> = {
      title: 'Plateforme de billetterie et gestion d\'événements',
      description: 'Biso Ticket - La plateforme de référence pour créer, gérer et vendre des billets d\'événements en RDC. Outils complets pour organisateurs et expérience fluide pour participants.',
      keywords: [
        'billet événement',
        'gestion événement',
        'plateforme billetterie',
        'vente billet',
        'réservation événement',
        'Kinshasa',
        'RDC',
        'Congo',
        'organisateur événement',
        'ticket en ligne'
      ],
      image: '/images/hero.jpg',
      type: 'website'
    }
    
    setSEO(homeConfig)
  }

  /**
   * Génère les métadonnées pour la page événements
   */
  const setEventsSEO = () => {
    const eventsConfig: Partial<SEOConfig> = {
      title: 'Événements',
      description: 'Découvrez tous les événements disponibles sur Biso Ticket. Concerts, conférences, festivals et bien plus encore. Réservez vos billets en toute sécurité.',
      keywords: [
        'événements',
        'concerts',
        'conférences',
        'festivals',
        'billets',
        'réservation',
        'Kinshasa',
        'RDC'
      ],
      type: 'website'
    }
    
    setSEO(eventsConfig)
  }

  /**
   * Génère les métadonnées pour les pages d'authentification
   */
  const setAuthSEO = (type: 'login' | 'register') => {
    const authConfig: Partial<SEOConfig> = {
      title: type === 'login' ? 'Connexion' : 'Inscription',
      description: type === 'login' 
        ? 'Connectez-vous à votre compte Biso Ticket pour gérer vos événements et réservations.'
        : 'Créez votre compte Biso Ticket pour commencer à organiser des événements et réserver des billets.',
      noindex: true, // Pages d'auth non indexées
      type: 'website'
    }
    
    setSEO(authConfig)
  }

  /**
   * Génère les métadonnées pour l'espace organisateur
   */
  const setOrganizerSEO = (page: string) => {
    const organizerConfig: Partial<SEOConfig> = {
      title: `Espace Organisateur - ${page}`,
      description: 'Gérez vos événements, créez de nouveaux événements et suivez vos statistiques avec Biso Ticket.',
      noindex: true, // Espace privé non indexé
      type: 'website'
    }
    
    setSEO(organizerConfig)
  }

  /**
   * Formate une date d'événement pour le SEO
   */
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'))
      return date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  return {
    generateSEOMeta,
    setSEO,
    setEventSEO,
    setHomeSEO,
    setEventsSEO,
    setAuthSEO,
    setOrganizerSEO,
    formatEventDate
  }
}
