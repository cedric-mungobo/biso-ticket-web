<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Marquee Cards Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Composant réutilisable pour afficher des cartes en défilement continu
        </p>
      </div>

      <!-- Exemple 1: Cartes par défaut -->
      <section class="mb-16">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
          Exemple 1: Cartes par défaut
        </h2>
        <MarqueeCards 
          :cards="defaultCards"
          @card-click="handleCardClick"
        />
      </section>

      <!-- Exemple 2: Cartes personnalisées avec vitesse différente -->
      <section class="mb-16">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
          Exemple 2: Vitesse personnalisée (plus rapide)
        </h2>
        <MarqueeCards 
          :cards="customCards"
          :speed="1500"
          @card-click="handleCardClick"
        />
      </section>

      <!-- Exemple 3: Sans pause au survol -->
      <section class="mb-16">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
          Exemple 3: Sans pause au survol
        </h2>
        <MarqueeCards 
          :cards="eventCards"
          :pause-on-hover="false"
          @card-click="handleCardClick"
        />
      </section>

      <!-- Message de clic -->
      <div v-if="clickedCard" class="text-center">
        <div class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-lg">
          Carte cliquée: <strong>{{ clickedCard.title }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarqueeCard } from '~/types/marquee'

// Métadonnées de la page
useHead({
  title: 'Marquee Cards Demo - Biso Ticket',
  meta: [
    { name: 'description', content: 'Démonstration du composant MarqueeCards réutilisable' }
  ]
})

// Utilisation du composable
const { getDefaultEventCards, getServiceCards, getTestimonialCards } = useMarqueeCards()

// État pour afficher la carte cliquée
const clickedCard = ref<MarqueeCard | null>(null)

// Données des cartes
const defaultCards = getDefaultEventCards()
const customCards = getServiceCards()
const eventCards = getTestimonialCards()

/**
 * Gère le clic sur une carte
 */
const handleCardClick = (card: MarqueeCard): void => {
  clickedCard.value = card
  
  // Effacer le message après 3 secondes
  setTimeout(() => {
    clickedCard.value = null
  }, 3000)
  
  console.log('Carte cliquée:', card)
}
</script>
