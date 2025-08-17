<template>
  <!-- Hero -->
  <div class="w-full">
    <div class="min-h-[500px] w-full h-[70vh] sm:h-[90vh] md:h-[90vh] lg:h-[90vh] flex flex-col bg-[url('/assets/images/hero.jpg')] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden">
      <!-- Overlay sombre pour améliorer la lisibilité -->
      <div class="absolute inset-0 bg-black/40 md:bg-black/30"></div>
      
      <!-- Contenu principal avec animations -->
      <div class="relative z-10 mt-auto w-full md:w-2/3 lg:max-w-2xl ps-4 pb-4 md:ps-10 md:pb-10">
        <!-- Titre avec animation -->
        <Transition
          name="hero-title"
          appear
          @enter="onTitleEnter"
          @leave="onTitleLeave"
        >
          <h1 
            ref="titleRef"
            class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-white font-bold mb-4 md:mb-6 leading-tight"
          >
            Biso Ticket
          </h1>
        </Transition>

        <!-- Sous-titre avec animation -->
        <Transition
          name="hero-subtitle"
          appear
          @enter="onSubtitleEnter"
          @leave="onSubtitleLeave"
        >
          <p 
            ref="subtitleRef"
            class="text-3xl sm:text-3xl md:text-4xl lg:text-4xl text-white/95 mb-6 md:mb-8 leading-relaxed max-w-lg"
          >
            Organisez, trouvez et réservez vos billets pour les meilleurs événements
          </p>
        </Transition>
        
        <!-- Boutons d'action avec animation -->
        <Transition
          name="hero-buttons"
          appear
          @enter="onButtonsEnter"
          @leave="onButtonsLeave"
        >
          <div 
            ref="buttonsRef"
            class="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto p-2"
          >
            <NuxtLink 
              to="/evenements" 
              class="group w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-primary-600 text-primary-50 font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-primary-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              <span class="hidden sm:inline">Découvrir les événements</span>
              <span class="sm:hidden">Découvrir</span>
              <svg class="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
            
            <NuxtLink 
              to="/organisateur" 
              class="group w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-white hover:text-neutral-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <span class="hidden sm:inline">Organiser un événement</span>
              <span class="sm:hidden">Organiser</span>
              <svg class="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>
  </div>
  <!-- End Hero -->
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// Références pour les éléments à animer
const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const buttonsRef = ref<HTMLElement>()

// Composable GSAP
const { 
  animateIn, 
  createScrollAnimation, 
  accessibleAnimation,
  prefersReducedMotion 
} = useGSAP()

// Animation d'entrée du titre
const onTitleEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 2.2,
      delay: 0.5,
      y: 80,
      scale: 0.9,
      ease: 'power3.out'
    })
  )
}

// Animation de sortie du titre
const onTitleLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.0,
      y: -40,
      scale: 0.95,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée du sous-titre
const onSubtitleEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.8,
      delay: 1.2,
      y: 60,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie du sous-titre
const onSubtitleLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      y: -30,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée des boutons
const onButtonsEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.6,
      delay: 2.0,
      y: 40,
      scale: 0.8,
      ease: 'back.out(1.7)'
    })
  )
}

// Animation de sortie des boutons
const onButtonsLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      y: -20,
      scale: 0.9,
      ease: 'power2.in'
    })
  )
}

// Configuration des animations au montage
onMounted(async () => {
  await nextTick()
  
  // Configuration des animations au scroll
  if (titleRef.value) {
    createScrollAnimation(titleRef.value, {
      start: 'top 90%',
      end: 'bottom 10%'
    })
  }
  
  if (subtitleRef.value) {
    createScrollAnimation(subtitleRef.value, {
      start: 'top 85%',
      end: 'bottom 15%'
    })
  }
  
  if (buttonsRef.value) {
    createScrollAnimation(buttonsRef.value, {
      start: 'top 80%',
      end: 'bottom 20%'
    })
  }
})
</script>

<style scoped>
/* Transitions natives Vue.js pour le Hero */
.hero-title-enter-active,
.hero-title-leave-active {
  transition: all 2.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-title-enter-from {
  opacity: 0;
  transform: translateY(80px) scale(0.9);
}

.hero-title-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.95);
}

.hero-subtitle-enter-active,
.hero-subtitle-leave-active {
  transition: all 1.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-subtitle-enter-from {
  opacity: 0;
  transform: translateY(60px);
}

.hero-subtitle-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.hero-buttons-enter-active,
.hero-buttons-leave-active {
  transition: all 1.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-buttons-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.8);
}

.hero-buttons-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

/* Optimisations de performance */
* {
  will-change: transform, opacity;
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .hero-title-enter-active,
  .hero-title-leave-active,
  .hero-subtitle-enter-active,
  .hero-subtitle-leave-active,
  .hero-buttons-enter-active,
  .hero-buttons-leave-active {
    transition: none;
  }
  
  .hero-title-enter-from,
  .hero-title-leave-to,
  .hero-subtitle-enter-from,
  .hero-subtitle-leave-to,
  .hero-buttons-enter-from,
  .hero-buttons-leave-to {
    transform: none;
    opacity: 1;
  }
}

/* Animation de l'image de fond au hover */
.min-h-\[500px\]:hover {
  transform: scale(1.02);
  transition: transform 8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de l'overlay au hover */
.min-h-\[500px\]:hover .bg-black\/40 {
  background-color: rgba(0, 0, 0, 0.25);
  transition: background-color 0.8s ease;
}

.min-h-\[500px\]:hover .md\:bg-black\/30 {
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.8s ease;
}
</style>