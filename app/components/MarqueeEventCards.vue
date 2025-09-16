<template>
  <div class="w-full mx-auto max-w-5xl overflow-hidden relative">
    <!-- Gradient gauche -->
    <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
    
    <!-- Container du marquee -->
    <div 
      class="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5"
      :style="{ 
        animationPlayState: stopScroll ? 'paused' : 'running'
      }"
    >
      <!-- Dupliquer les cartes pour l'effet de boucle -->
      <div 
        v-for="(card, index) in [...cards, ...cards]" 
        :key="`${card.id}-${index}`"
        class="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 cursor-pointer"
        @click="handleCardClick(card)"
        @mouseenter="setStopScroll(true)"
        @mouseleave="setStopScroll(false)"
      >
        <!-- Image de l'événement -->
        <div class="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
          <img 
            :src="card.image" 
            :alt="card.title"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <!-- Badge de catégorie -->
          <div class="absolute top-2 left-2">
            <span class="px-2 py-1 text-xs font-semibold text-white bg-primary-600 rounded-full">
              {{ card.category }}
            </span>
          </div>
        </div>
        
        <!-- Contenu de la carte -->
        <div class="space-y-2">
          <h3 class="font-bold text-gray-900 text-lg line-clamp-2">
            {{ card.title }}
          </h3>
          <p class="text-sm text-gray-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {{ card.location }}
          </p>
          <p class="text-sm text-gray-500">
            {{ formatDate(card.date) }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Gradient droite -->
    <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
interface MarqueeCard {
  id: number
  title: string
  image: string
  category: string
  date: string
  location: string
  slug?: string
}

interface MarqueeEventCardsProps {
  cards: MarqueeCard[]
  speed?: number
  pauseOnHover?: boolean
}

interface MarqueeEventCardsEmits {
  (e: 'card-click', card: MarqueeCard): void
}

const props = withDefaults(defineProps<MarqueeEventCardsProps>(), {
  speed: 3000,
  pauseOnHover: true
})

const emit = defineEmits<MarqueeEventCardsEmits>()

// État pour contrôler la pause
const stopScroll = ref(false)

/**
 * Définit l'état de pause du scroll
 */
const setStopScroll = (value: boolean): void => {
  if (props.pauseOnHover) {
    stopScroll.value = value
  }
}

/**
 * Gère le clic sur une carte
 */
const handleCardClick = (card: MarqueeCard): void => {
  emit('card-click', card)
}

/**
 * Formate la date de l'événement
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
@keyframes marqueeScroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-inner {
  animation: marqueeScroll 25s linear infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
