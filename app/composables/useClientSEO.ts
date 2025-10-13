/**
 * Composable SEO optimisé pour le mode SPA (client-side only)
 * Permet d'optimiser le référencement même sans SSR
 */

export interface ClientSEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'event' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: any
}

export const useClientSEO = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  // Configuration par défaut pour le mode SPA
  const defaultConfig: ClientSEOConfig = {
    siteName: 'Biso Ticket',
    locale: 'fr_FR',
    type: 'website',
    twitterCard: 'summary_large_image',
    keywords: [
      'billet', 'événement', 'ticket', 'réservation',
      'Kinshasa', 'RDC', 'Congo', 'mobile money',
      'Orange Money', 'Airtel Money', 'M-Pesa'
    ],
    url: `https://bisoticket.com${route.path}`
  }

  /**
   * Applique les métadonnées SEO côté client
   */
  const setClientSEO = (customConfig: Partial<ClientSEOConfig> = {}) => {
    if (!process.client) return

    const seoConfig = { ...defaultConfig, ...customConfig }

    // URL canonique
    const canonical = seoConfig.url || `https://bisoticket.com${route.path}`

    // Image complète avec domaine
    const fullImageUrl = seoConfig.image?.startsWith('http')
      ? seoConfig.image
      : `https://bisoticket.com${seoConfig.image}`

    // Titre complet
    const fullTitle = seoConfig.title
      ? `${seoConfig.title} - ${seoConfig.siteName}`
      : seoConfig.siteName

    // Mettre à jour les meta tags
    useHead({
      title: fullTitle,
      meta: [
        // Métadonnées de base
        { name: 'description', content: seoConfig.description },
        { name: 'keywords', content: seoConfig.keywords?.join(', ') },
        { name: 'author', content: seoConfig.author || seoConfig.siteName },
        { name: 'robots', content: 'index, follow' },

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
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: seoConfig.description },
        { name: 'twitter:image', content: fullImageUrl },

        // Métadonnées temporelles
        ...(seoConfig.publishedTime ? [{ property: 'article:published_time', content: seoConfig.publishedTime }] : []),
        ...(seoConfig.modifiedTime ? [{ property: 'article:modified_time', content: seoConfig.modifiedTime }] : []),
      ],
      link: [
        // URL canonique
        { rel: 'canonical', href: canonical },

        // Préchargement des ressources critiques
        { rel: 'preconnect', href: 'https://api.bisoticket.com' },
        { rel: 'dns-prefetch', href: 'https://api.bisoticket.com' }
      ]
    })

    // Ajouter les données structurées (JSON-LD)
    if (seoConfig.structuredData) {
      useHead({
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(seoConfig.structuredData),
            key: 'structured-data'
          }
        ]
      })
    }
  }

  /**
   * Génère les métadonnées SEO pour un événement
   */
  const setEventSEOClient = (event: any) => {
    if (!event) return

    const eventConfig: Partial<ClientSEOConfig> = {
      title: `${event.title} - ${formatEventDate(event.startsAt)}`,
      description: generateEventDescription(event),
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
      ],
      image: event.imageUrl || '/images/event-default.jpg',
      url: `https://bisoticket.com/evenements/${event.slug}`,
      type: 'event',
      publishedTime: event.createdAt,
      modifiedTime: event.updatedAt,
      author: event.organizer?.name || 'Biso Ticket',

      // Données structurées Schema.org pour l'événement
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description || generateEventDescription(event),
        startDate: event.startsAt,
        endDate: event.endsAt || event.startsAt,
        location: {
          '@type': 'Place',
          name: event.location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.location
          }
        },
        image: event.imageUrl || 'https://bisoticket.com/images/event-default.jpg',
        url: `https://bisoticket.com/evenements/${event.slug}`,
        offers: event.tickets?.map((ticket: any) => ({
          '@type': 'Offer',
          name: ticket.name,
          price: ticket.price,
          priceCurrency: ticket.currency || 'USD',
          availability: ticket.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
          validFrom: event.startsAt
        })) || [],
        organizer: {
          '@type': 'Organization',
          name: event.organizer?.name || 'Biso Ticket',
          url: 'https://bisoticket.com'
        },
        performer: {
          '@type': 'Organization',
          name: event.organizer?.name || 'Biso Ticket'
        }
      }
    }

    setClientSEO(eventConfig)
  }

  /**
   * Génère une description optimisée pour l'événement
   */
  const generateEventDescription = (event: any): string => {
    const baseDesc = event.description || ''
    const dateStr = formatEventDateReadable(event.startsAt)

    if (baseDesc.length > 140) {
      return baseDesc.substring(0, 160).replace(/\s+\S*$/, '') + '...'
    }

    return `Rejoignez-nous pour ${event.title} le ${dateStr} à ${event.location}. ${baseDesc}`.substring(0, 160)
  }

  /**
   * Formate une date pour affichage dans les métadonnées
   */
  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString.replace(' ', 'T'))
      return date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  /**
   * Formate une date pour affichage lisible
   */
  const formatEventDateReadable = (dateString: string): string => {
    try {
      const date = new Date(dateString.replace(' ', 'T'))
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date à confirmer'
    }
  }

  /**
   * Configure le SEO pour la liste des événements
   */
  const setEventsListSEO = () => {
    const listConfig: Partial<ClientSEOConfig> = {
      title: 'Événements - Biso Ticket',
      description: 'Découvrez tous les événements disponibles sur Biso Ticket. Concerts, conférences, festivals et bien plus encore. Réservez vos billets en toute sécurité avec mobile money.',
      keywords: [
        'événements', 'concerts', 'conférences', 'festivals',
        'billets', 'réservation', 'Kinshasa', 'RDC', 'Congo',
        'mobile money', 'Orange Money', 'Airtel Money'
      ],
      type: 'website',

      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Événements - Biso Ticket',
        description: 'Découvrez tous les événements disponibles sur Biso Ticket',
        url: 'https://bisoticket.com/evenements'
      }
    }

    setClientSEO(listConfig)
  }

  /**
   * Configure le SEO pour la page d'accueil
   */
  const setHomeSEOClient = () => {
    const homeConfig: Partial<ClientSEOConfig> = {
      title: 'Passez au digital pour vos événements avec Biso Ticket',
      description: 'Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales. Recevez les paiements mobile money, achetez les billets en ligne via mobile money, configuration en 3 minutes.',
      keywords: [
        'événements digitaux', 'billets en ligne', 'invitations digitales',
        'mobile money', 'paiement mobile', 'gestion événement',
        'vente billets', 'réservation événement', 'Kinshasa', 'RDC'
      ],
      type: 'website',

      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Biso Ticket',
        description: 'Plateforme de gestion d\'événements et de billetterie pour l\'Afrique',
        url: 'https://bisoticket.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://bisoticket.com/evenements?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    }

    setClientSEO(homeConfig)
  }

  /**
   * Ajoute les meta tags pour le préchargement et la performance
   */
  const addPerformanceMeta = () => {
    if (!process.client) return

    useHead({
      link: [
        // Préchargement des domaines critiques
        { rel: 'preconnect', href: 'https://api.bisoticket.com' },
        { rel: 'preconnect', href: 'https://bisoticket.com' },

        // DNS prefetch pour les domaines secondaires
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.bisoticket.com' },

        // Préchargement des ressources critiques
        { rel: 'preload', href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
      ]
    })
  }

  return {
    setClientSEO,
    setEventSEOClient,
    setEventsListSEO,
    setHomeSEOClient,
    addPerformanceMeta,
    formatEventDate,
    formatEventDateReadable
  }
}
