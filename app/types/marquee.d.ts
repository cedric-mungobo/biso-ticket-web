/**
 * Types pour le composant MarqueeCards
 */

export interface MarqueeCard {
  /** Identifiant unique de la carte */
  id: string | number
  /** Titre affiché sur la carte */
  title: string
  /** URL de l'image de la carte */
  image: string
  /** Propriétés additionnelles optionnelles */
  [key: string]: any
}

export interface MarqueeCardsProps {
  /** Tableau des cartes à afficher */
  cards: MarqueeCard[]
  /** Vitesse de défilement en millisecondes par carte (défaut: 2500) */
  speed?: number
  /** Pause au survol (défaut: true) */
  pauseOnHover?: boolean
}

export interface MarqueeCardsEmits {
  /** Événement émis lors du clic sur une carte */
  (e: 'card-click', card: MarqueeCard): void
}
