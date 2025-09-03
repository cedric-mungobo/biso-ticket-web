<template>
  <div class="w-full flex flex-col items-center">
   

    <!-- Conteneur du carousel -->
    <div class="carousel-wrapper max-w-5xl w-full">
      <!-- Conteneur des cartes -->
      <div class="relative">
        <div 
          ref="carouselTrack"
          class="carousel-track"
          :style="{ transform: `translateX(${carouselOffset}px)` }"
        >
          <!-- Dupliquer les événements pour l'effet infini -->
          <div
            v-for="(event, index) in [...displayedEvents, ...displayedEvents]"
            :key="`${event.id}-${index}`"
            class="carousel-item"
          >
            <EventCard
              :event-id="event.id"
              :title="event.title"
              :image="event.imageUrl"
              :date="event.startsAt"
              :location="event.location"
              :categories="event.settings?.categories || []"
              :slug="event.slug"
              class="carousel-card"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Interface pour les événements
interface Event {
  id: number | string
  title: string
  imageUrl?: string
  startsAt: string
  location?: string
  slug: string
  settings?: {
    categories?: string[]
  }
}

// Props
interface Props {
  events?: Event[]
  maxEvents?: number
  title?: string
  subtitle?: string
  autoplayInterval?: number
  cardWidth?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
  maxEvents: 4,
  title: 'Nos événements',
  subtitle: '',
  autoplayInterval: 3000,
  cardWidth: 272, // w-64 + gap
  gap: 16
})

// Refs
const carouselTrack = ref<HTMLElement | null>(null)

// État du carousel
const carouselOffset = ref(0)
const autoplayInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const displayedEvents = computed(() => {
  return props.events.slice(0, props.maxEvents)
})

const totalCardWidth = computed(() => {
  return props.cardWidth + props.gap
})

// Méthodes du carousel
const startInfiniteScroll = (): NodeJS.Timeout | null => {
  if (displayedEvents.value.length <= 1) return null
  
  const interval = setInterval(() => {
    carouselOffset.value -= totalCardWidth.value
    
    // Reset pour l'effet infini
    if (Math.abs(carouselOffset.value) >= displayedEvents.value.length * totalCardWidth.value) {
      carouselOffset.value = 0
    }
  }, props.autoplayInterval)
  
  return interval
}

const stopInfiniteScroll = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  autoplayInterval.value = startInfiniteScroll()
})

onUnmounted(() => {
  stopInfiniteScroll()
})

// Watchers
watch(() => displayedEvents.value, () => {
  carouselOffset.value = 0
  stopInfiniteScroll()
  autoplayInterval.value = startInfiniteScroll()
}, { deep: true })
</script>

<style scoped>
/* Styles du carousel */
.carousel-wrapper {
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.carousel-track {
  display: flex;
  transition: transform 1000ms ease-in-out;
  gap: 1rem;
  transform: translateX(0);
  align-items: stretch; /* Assure que toutes les cartes ont la même hauteur */
}

.carousel-item {
  flex-shrink: 0;
  width: 16rem; /* w-64 */
  height: 20rem; /* Hauteur fixe pour toutes les cartes */
  will-change: transform;
}

@media (min-width: 640px) {
  .carousel-item {
    width: 18rem; /* w-72 */
    height: 22rem; /* Hauteur fixe plus grande sur desktop */
  }
}

.carousel-card {
  height: 100%;
  transform: scale(1);
  transition: all 300ms ease-in-out;
  display: flex;
  flex-direction: column;
}

.carousel-card:hover {
  transform: scale(1.05);
}

/* Effet de flou sur les bords */
.carousel-wrapper::before,
.carousel-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3rem;
  z-index: 5;
  pointer-events: none;
}

.carousel-wrapper::before {
  left: 0;
  background: linear-gradient(to right, rgba(26, 25, 25, 1), transparent);
}

.carousel-wrapper::after {
  right: 0;
  background: linear-gradient(to left, rgba(26, 25, 25, 1), transparent);
}

/* Responsive */
@media (max-width: 640px) {
  .carousel-wrapper::before,
  .carousel-wrapper::after {
    width: 1.5rem;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none;
  }
  
  .carousel-card {
    transition: none;
  }
  
  .carousel-indicator {
    transition: none;
  }
}
</style>
