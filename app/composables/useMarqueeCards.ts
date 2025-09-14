import type { MarqueeCard } from '~/types/marquee'

/**
 * Composable pour gérer les données des cartes Marquee
 */
export const useMarqueeCards = () => {
  /**
   * Génère des cartes d'événements par défaut
   */
  const getDefaultEventCards = (): MarqueeCard[] => [
    {
      id: 1,
      title: "Concert Biso",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=60",
      category: "Musique",
      date: "2025-03-15"
    },
    {
      id: 2,
      title: "Conférence Tech",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60",
      category: "Technologie",
      date: "2025-03-20"
    },
    {
      id: 3,
      title: "Workshop Design",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=60",
      category: "Formation",
      date: "2025-03-25"
    },
    {
      id: 4,
      title: "Festival Summer",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=60",
      category: "Festival",
      date: "2025-06-15"
    },
    {
      id: 5,
      title: "Gala de Charité",
      image: "https://images.unsplash.com/photo-1511578314322-379fbe9e6fde?w=1200&auto=format&fit=crop&q=60",
      category: "Charité",
      date: "2025-04-10"
    },
    {
      id: 6,
      title: "Séminaire Business",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=60",
      category: "Business",
      date: "2025-04-18"
    }
  ]

  /**
   * Génère des cartes de services par défaut
   */
  const getServiceCards = (): MarqueeCard[] => [
    {
      id: 7,
      title: "Gestion d'événements",
      image: "https://images.unsplash.com/photo-1543487945-139a97f387d5?w=1200&auto=format&fit=crop&q=60",
      description: "Organisez vos événements facilement"
    },
    {
      id: 8,
      title: "Billetterie en ligne",
      image: "https://images.unsplash.com/photo-1529254479751-faeedc59e78f?w=1200&auto=format&fit=crop&q=60",
      description: "Vendez vos billets en toute sécurité"
    },
    {
      id: 9,
      title: "Invitations digitales",
      image: "https://images.unsplash.com/photo-1618327907215-4e514efabd41?w=1200&auto=format&fit=crop&q=60",
      description: "Créez des invitations personnalisées"
    },
    {
      id: 10,
      title: "Paiements FlexPay",
      image: "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=1200&auto=format&fit=crop&q=60",
      description: "Acceptez les paiements mobiles"
    }
  ]

  /**
   * Génère des cartes de témoignages
   */
  const getTestimonialCards = (): MarqueeCard[] => [
    {
      id: 11,
      title: "Excellent service !",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=60",
      author: "Marie K.",
      rating: 5
    },
    {
      id: 12,
      title: "Très facile à utiliser",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200&auto=format&fit=crop&q=60",
      author: "Jean L.",
      rating: 5
    },
    {
      id: 13,
      title: "Interface intuitive",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&auto=format&fit=crop&q=60",
      author: "Sophie M.",
      rating: 4
    }
  ]

  /**
   * Filtre les cartes par catégorie
   */
  const filterCardsByCategory = (cards: MarqueeCard[], category: string): MarqueeCard[] => {
    return cards.filter(card => card.category === category)
  }

  /**
   * Recherche dans les cartes par titre
   */
  const searchCards = (cards: MarqueeCard[], query: string): MarqueeCard[] => {
    const lowercaseQuery = query.toLowerCase()
    return cards.filter(card => 
      card.title.toLowerCase().includes(lowercaseQuery) ||
      (card.description && card.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  return {
    getDefaultEventCards,
    getServiceCards,
    getTestimonialCards,
    filterCardsByCategory,
    searchCards
  }
}
