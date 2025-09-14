<template>
  <div 
    class="overflow-hidden w-full relative max-w-6xl mx-auto"
    @mouseenter="setStopScroll(true)"
    @mouseleave="setStopScroll(false)"
  >
    <!-- Gradient gauche -->
    <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent dark:from-gray-950 dark:to-transparent" />
    
    <!-- Container du marquee -->
    <div 
      class="marquee-inner flex w-fit"
      :style="{ 
        animationPlayState: stopScroll ? 'paused' : 'running',
        animationDuration: `${cardData.length * 2500}ms`
      }"
    >
      <div class="flex">
        <!-- Dupliquer les cartes pour l'effet de boucle -->
        <div 
          v-for="(card, index) in [...cardData, ...cardData]" 
          :key="`${card.id}-${index}`"
          class="w-56 mx-4 h-80 relative group hover:scale-90 transition-all duration-300 cursor-pointer"
          @click="handleCardClick(card)"
        >
          <!-- Image de la carte -->
          <NuxtImg
            :src="card.image"
            :alt="card.title"
            class="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          
          <!-- Overlay au hover -->
          <div class="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20 rounded-lg">
            <p class="text-white text-lg font-semibold text-center">{{ card.title }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gradient droite -->
    <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent dark:from-gray-950 dark:to-transparent" />
  </div>
</template>

<script setup lang="ts">
import type { MarqueeCardsProps, MarqueeCardsEmits } from '~/types/marquee'

const props = withDefaults(defineProps<MarqueeCardsProps>(), {
  speed: 2500,
  pauseOnHover: true
})

const emit = defineEmits<MarqueeCardsEmits>()

// État pour contrôler la pause
const stopScroll = ref(false)

// Données des cartes (dupliquées pour l'effet de boucle)
const cardData = computed(() => props.cards)

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
</script>

<style scoped>
.marquee-inner {
  animation: marqueeScroll linear infinite;
}

@keyframes marqueeScroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Support du mode sombre */
@media (prefers-color-scheme: dark) {
  .marquee-inner {
    /* Ajustements pour le mode sombre si nécessaire */
  }
}
</style>
