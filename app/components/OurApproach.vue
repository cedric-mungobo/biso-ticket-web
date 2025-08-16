<template>
  <div class="bg-gradient-to-r rounded-2xl from-primary-900 to-primary-950">
    <section>
      <!-- Layout principal -->
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[600px]">
        <!-- Image avec animation d'entrée -->
        <div 
          ref="imageContainer"
          class="lg:w-1/2 rounded-xl overflow-hidden"
        >
          <Transition
            name="fade-slide-up"
            appear
            @enter="onImageEnter"
            @leave="onImageLeave"
          >
            <img 
              class="w-full h-full object-cover rounded-xl" 
              :src="imageSrc" 
              :alt="imageAlt"
            >
          </Transition>
        </div>

        <!-- Timeline des étapes avec animations -->
        <div class="lg:w-1/2 p-2 lg:p-4 flex flex-col justify-center">
          <!-- Titre de la section avec animation -->
          <Transition
            name="fade-slide-left"
            appear
            @enter="onTitleEnter"
            @leave="onTitleLeave"
          >
            <div class="max-w-3xl mb-4 lg:mb-6">
              <h2 class="text-white font-semibold text-2xl md:text-4xl md:leading-tight">
                {{ title }}
              </h2>
              <p class="mt-1 text-secondary-200">
                {{ description }}
              </p>
            </div>
          </Transition>

          <!-- En-tête de la timeline -->
          <Transition
            name="fade-slide-left"
            appear
            @enter="onTimelineHeaderEnter"
            @leave="onTimelineHeaderLeave"
          >
            <div class="mb-4">
              <h3 class="text-secondary-200 text-xs font-medium uppercase">
                {{ timelineTitle }}
              </h3>
            </div>
          </Transition>

          <!-- Étapes de la timeline avec animations séquentielles -->
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            :ref="el => setStepRef(el, index)"
            class="flex gap-x-5 ms-1 opacity-0"
          >
            <!-- Icône avec ligne de connexion -->
            <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-secondary-200">
              <div class="relative z-10 size-8 flex justify-center items-center">
                <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                  {{ index + 1 }}
                </span>
              </div>
            </div>

            <!-- Contenu de l'étape -->
            <div class="grow pt-0.5 pb-8 sm:pb-12">
              <p class="text-sm lg:text-base text-neutral-400">
                <span class="text-white">{{ step.title }}:</span>
                {{ step.description }}
              </p>
            </div>
          </div>

          <!-- Bouton d'action avec animation -->
          <Transition
            name="fade-scale"
            appear
            @enter="onButtonEnter"
            @leave="onButtonLeave"
          >
            <a 
              v-if="ctaButton"
              :href="ctaButton.href"
              class="group inline-flex items-center gap-x-2 py-2 px-3 bg-secondary-200 font-medium text-sm text-neutral-800 rounded-full focus:outline-hidden hover:bg-secondary-300 transition-colors"
            >
              <svg 
                class="shrink-0 size-4" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                <path class="opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:delay-100 transition" d="M14.05 2a9 9 0 0 1 8 7.94"></path>
                <path class="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition" d="M14.05 6A5 5 0 0 1 18 10"></path>
              </svg>
              {{ ctaButton.text }}
            </a>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// Interface pour définir la structure d'une étape
interface Step {
  title: string
  description: string
}

// Interface pour le bouton d'action
interface CTAButton {
  text: string
  href: string
}

// Props du composant avec valeurs par défaut
interface Props {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  timelineTitle?: string
  steps?: Step[]
  ctaButton?: CTAButton
}

// Définition des props avec valeurs par défaut
const props = withDefaults(defineProps<Props>(), {
    title: 'Organiser votre événement avec Biso Ticket',
    description: 'Organisez votre événement à Kinshasa avec Biso Ticket, la plateforme de billetterie en ligne qui vous permet de créer, gérer et vendre vos billets facilement. Vos participants peuvent payer par mobile money (Orange Money, M-Pesa, Airtel Money).',
    imageSrc: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=480&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Features Image',
    timelineTitle: 'Étapes',
  steps: () => [
          {
        title: 'Créer votre événement',
        description: 'Créez votre événement en ajoutant toutes les informations nécessaires : nom, description, date, lieu et image.'
      },
      {
        title: 'Configurer vos billets',
        description: 'Définissez les types de billets, les prix et les quantités disponibles pour votre événement.'
      },
      {
        title: 'Partager et vendre',
        description: 'Partagez le lien de votre événement. Vos participants peuvent acheter leurs billets en ligne via mobile money (Orange Money, M-Pesa, Airtel Money).'
      },
      {
        title: 'Suivre vos performances',
        description: 'Surveillez en temps réel les ventes de billets et le succès de votre événement.'
      }
  ],
  ctaButton: () => ({
    text: 'Commencer à organiser',
    href: '/organisateur'
  })
})

// Références pour les animations
const imageContainer = ref<HTMLElement>()
const stepRefs = ref<HTMLElement[]>([])

// Composable GSAP
const { 
  animateIn, 
  staggerAnimation, 
  createScrollAnimation, 
  accessibleAnimation,
  prefersReducedMotion 
} = useGSAP()

// Fonction pour définir les références des étapes
const setStepRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    stepRefs.value[index] = el as HTMLElement
  }
}

// Animation d'entrée de l'image
const onImageEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.2,
      delay: 0.2,
      y: 60,
      scale: 0.95,
      ease: 'power3.out'
    })
  )
}

// Animation de sortie de l'image
const onImageLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.6,
      y: -30,
      scale: 0.95,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée du titre
const onTitleEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      delay: 0.3,
      y: 40,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie du titre
const onTitleLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.5,
      y: -20,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée de l'en-tête de la timeline
const onTimelineHeaderEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.7,
      delay: 0.4,
      y: 30,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie de l'en-tête de la timeline
const onTimelineHeaderLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.5,
      y: -15,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée du bouton
const onButtonEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.6,
      delay: 0.8,
      scale: 0.8,
      ease: 'back.out(1.7)'
    })
  )
}

// Animation de sortie du bouton
const onButtonLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.4,
      scale: 0.9,
      ease: 'power2.in'
    })
  )
}

// Animation des étapes au scroll
const animateSteps = () => {
  if (prefersReducedMotion()) return
  
  const validSteps = stepRefs.value.filter(ref => ref)
  if (validSteps.length === 0) return

  accessibleAnimation(
    validSteps,
    () => staggerAnimation(validSteps, {
      duration: 0.8,
      delay: 0.5,
      stagger: 0.15,
      y: 40,
      ease: 'power2.out'
    })
  )
}

// Configuration des animations au scroll
onMounted(async () => {
  await nextTick()
  
  // Créer l'animation au scroll pour le composant entier
  if (imageContainer.value) {
    createScrollAnimation(imageContainer.value, {
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => {
        // Déclencher l'animation des étapes quand l'image entre dans le viewport
        setTimeout(animateSteps, 200)
      }
    })
  }
})
</script>

<style scoped>
/* Transitions natives Vue.js */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}

.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.fade-slide-left-enter-active,
.fade-slide-left-leave-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-left-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.fade-slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Optimisations de performance */
* {
  will-change: transform, opacity;
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-up-enter-active,
  .fade-slide-up-leave-active,
  .fade-slide-left-enter-active,
  .fade-slide-left-leave-active,
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: none;
  }
  
  .fade-slide-up-enter-from,
  .fade-slide-up-leave-to,
  .fade-slide-left-enter-from,
  .fade-slide-left-leave-to,
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    transform: none;
    opacity: 1;
  }
}
</style>
