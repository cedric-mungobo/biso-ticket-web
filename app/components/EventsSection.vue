<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
    <div ref="headerRef" class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto opacity-0">
      <h1 class="font-medium text-black text-3xl sm:text-4xl dark:text-white">
        Découvrez les événements à venir
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        <span class="text-gray-600 dark:text-gray-400">Chargement des événements...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">Impossible de charger les événements</h3>
        <p class="text-red-600 mb-4">Vérifiez votre connexion internet et réessayez.</p>
        <button 
          @click="handleRetry"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else-if="events.length > 0" ref="eventsGridRef" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <EventCard
        v-for="(event, index) in events" 
        :key="event.id"
        :category="event.settings?.categories?.[0] || event.category"
        :title="event.title || event.name"
        :image="event.imageUrl || event.image_url || event.image"
        :date="event.startsAt || event.date_time"
        :description="event.description"
        :location="event.location"
        :eventId="event.id"
        :slug="event.slug"
        :data-index="index"
        class="event-card opacity-0"
      />
    </div>

    <!-- No Events State -->
    <div v-else class="text-center py-12">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Aucun événement disponible</h3>
        <p class="text-gray-600">Aucun événement n'est actuellement disponible. Revenez plus tard !</p>
      </div>
    </div>

    <!-- Call to Action -->
    <div v-if="events.length > 0" ref="ctaRef" class="mt-10 lg:mt-20 text-center opacity-0">
      <NuxtLink 
        to="/evenements"
        class="relative inline-block font-medium md:text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white"
      >
        Voir tous les événements
      </NuxtLink>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Props du composant - utilisation du type readonly retourné par useEvents
interface Props {
  events: readonly any[] // Type readonly pour correspondre au type retourné par useEvents
  loading: boolean
  error: string | null
}

// Émits du composant
interface Emits {
  (e: 'retry'): void
}

// Définition des props et emits
const props = withDefaults(defineProps<Props>(), {
  events: () => [],
  loading: false,
  error: null
})
const emit = defineEmits<Emits>()

// Références pour les animations GSAP
const headerRef = ref<HTMLElement>()
const eventsGridRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

// Stockage des triggers pour pouvoir les nettoyer
const scrollTriggers = ref<any[]>([])



// Fonction pour gérer la réessai
const handleRetry = () => {
  emit('retry')
}

// Fonction pour déclencher manuellement les animations
const triggerAnimations = () => {
  const { gsap } = useGSAP()
  
  // Animation simple du header
  if (headerRef.value) {
    gsap.to(headerRef.value, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })
  }
  
  // Animation des cartes avec stagger
  if (eventsGridRef.value) {
    const eventCards = eventsGridRef.value.querySelectorAll('.event-card')
    gsap.to(eventCards, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    })
  }
  
  // Animation du CTA
  if (ctaRef.value) {
    gsap.to(ctaRef.value, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })
  }
}

// Fonction pour réinitialiser l'état des animations
const resetAnimationState = () => {
  const { gsap } = useGSAP()
  
  const elements = [
    headerRef.value,
    eventsGridRef.value?.querySelectorAll('.event-card'),
    ctaRef.value
  ].filter(Boolean).flat()
  
  gsap.set(elements, {
    y: 0,
    opacity: 0,
    scale: 1
  })
}



// Fonction pour animer les éléments au scroll
const setupScrollAnimations = () => {
  const { gsap, ScrollTrigger } = useGSAP()
  
  // Nettoyer les triggers existants
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
  
  // Animation simple du header
  if (headerRef.value) {
    const headerTrigger = ScrollTrigger.create({
      trigger: headerRef.value,
      start: 'top 80%',
      onEnter: () => {
        if (headerRef.value) {
          gsap.to(headerRef.value, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          })
        }
      }
    })
    scrollTriggers.value.push(headerTrigger)
  }

  // Animation des cartes d'événements
  if (eventsGridRef.value && props.events.length > 0) {
    const eventCards = eventsGridRef.value.querySelectorAll('.event-card')
    
    eventCards.forEach((card, index) => {
      const cardTrigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
          })
        }
      })
      scrollTriggers.value.push(cardTrigger)
    })
  }

  // Animation du CTA
  if (ctaRef.value) {
    const ctaTrigger = ScrollTrigger.create({
      trigger: ctaRef.value,
      start: 'top 80%',
      onEnter: () => {
        if (ctaRef.value) {
          gsap.to(ctaRef.value, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          })
        }
      }
    })
    scrollTriggers.value.push(ctaTrigger)
  }
}

// Initialiser les animations au montage
onMounted(() => {
  setupScrollAnimations()
})

// Réinitialiser les animations quand les événements changent
watch(() => props.events, () => {
  if (props.events.length > 0) {
    // Attendre que le DOM soit mis à jour
    nextTick(() => {
      setupScrollAnimations()
    })
  }
}, { deep: true })

// Nettoyer les animations au démontage
onUnmounted(() => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
.event-card {
  transform: translateY(60px);
  opacity: 0;
}
</style>
