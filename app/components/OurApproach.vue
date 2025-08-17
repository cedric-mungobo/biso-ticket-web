<template>
  <div class="bg-gradient-to-r rounded-2xl from-primary-900 to-primary-950">
    <section>
      <!-- Layout principal -->
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[600px]">
        <!-- Image avec animation GSAP -->
        <div 
          ref="imageContainer"
          class="lg:w-1/2 rounded-xl overflow-hidden"
        >
          <img 
            ref="imageRef"
            class="w-full h-full object-cover rounded-xl" 
            :src="imageSrc" 
            :alt="imageAlt"
          >
        </div>

        <!-- Timeline des étapes avec animations -->
        <div class="lg:w-1/2 p-2 lg:p-4 flex flex-col justify-center">
          <!-- Titre de la section avec animation séparée -->
          <div class="max-w-3xl mb-4 lg:mb-6">
            <!-- Titre principal avec animation GSAP -->
            <h2 
              ref="titleRef"
              class="text-white font-semibold text-2xl md:text-4xl md:leading-tight"
            >
              {{ title }}
            </h2>

            <!-- Description avec animation GSAP -->
            <p 
              ref="descriptionRef"
              class="mt-1 text-secondary-200"
            >
              {{ description }}
            </p>
          </div>

          <!-- En-tête de la timeline avec animation GSAP -->
          <div 
            ref="timelineHeaderRef"
            class="mb-4"
          >
            <h3 class="text-secondary-200 text-xs font-medium uppercase">
              {{ timelineTitle }}
            </h3>
          </div>

          <!-- Étapes de la timeline avec animations GSAP simples -->
          <div class="steps-container">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              :ref="el => setStepRef(el, index)"
              class="flex gap-x-5 ms-1 step-item"
              :data-index="index"
            >
              <!-- Icône avec ligne de connexion et animation -->
              <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-secondary-200 step-connector">
                <div class="relative z-10 size-8 flex justify-center items-center step-icon-container">
                  <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full step-icon">
                    {{ index + 1 }}
                  </span>
                </div>
              </div>

              <!-- Contenu de l'étape avec animation -->
              <div class="grow pt-0.5 pb-8 sm:pb-12 step-content">
                <p class="text-sm lg:text-base text-neutral-400 step-text">
                  <span class="text-white step-title">{{ step.title }}:</span>
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bouton d'action avec animation GSAP -->
          <a 
            v-if="ctaButton"
            ref="buttonRef"
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
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'


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
  steps?: any[]
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

// Références pour les animations GSAP
const imageRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const timelineHeaderRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()
const stepRefs = ref<HTMLElement[]>([])

// Composable GSAP
const { 
  gsap,
  createScrollAnimation,
  prefersReducedMotion 
} = useGSAP()

// Importer ScrollTrigger directement
let ScrollTrigger: any = null
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore
    ScrollTrigger = gsap.plugins.ScrollTrigger
    console.log('🎯 ScrollTrigger chargé directement:', !!ScrollTrigger)
  } catch (e) {
    console.log('❌ ScrollTrigger non disponible directement:', e)
  }
}

// Stockage des triggers pour pouvoir les nettoyer
const scrollTriggers = ref<any[]>([])

// Fonction pour définir les références des étapes
const setStepRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    stepRefs.value[index] = el as HTMLElement
    console.log(`🎯 Référence étape ${index} définie:`, el)
  }
}

// Animation d'entrée de l'image
const animateImage = () => {
  if (prefersReducedMotion() || !imageRef.value) return
  
  gsap.fromTo(imageRef.value, 
    { 
      y: 60, 
      opacity: 0,
      scale: 0.9
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      duration: 1.2,
      ease: "power3.out"
    }
  )
}

// Animation d'entrée du titre
const animateTitle = () => {
  if (prefersReducedMotion() || !titleRef.value) return
  
  gsap.fromTo(titleRef.value, 
    { 
      y: 40, 
      opacity: 0,
      scale: 0.95
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      duration: 1.0,
      ease: "power2.out"
    }
  )
}

// Animation d'entrée de la description
const animateDescription = () => {
  if (prefersReducedMotion() || !descriptionRef.value) return
  
  gsap.fromTo(descriptionRef.value, 
    { 
      y: 30, 
      opacity: 0
    },
    { 
      y: 0, 
      opacity: 1,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out"
    }
  )
}

// Animation d'entrée de l'en-tête de la timeline
const animateTimelineHeader = () => {
  if (prefersReducedMotion() || !timelineHeaderRef.value) return
  
  gsap.fromTo(timelineHeaderRef.value, 
    { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      duration: 0.8,
      delay: 0.6,
      ease: "power2.out"
    }
  )
}

// Animation d'entrée du bouton
const animateButton = () => {
  if (prefersReducedMotion() || !buttonRef.value) return
  
  gsap.fromTo(buttonRef.value, 
    { 
      scale: 0.8,
      opacity: 0
    },
    { 
      scale: 1, 
      opacity: 1,
      duration: 0.8,
      delay: 0.9,
      ease: "back.out(1.7)"
    }
  )
}



// Configuration des animations au montage
onMounted(async () => {
  await nextTick()
  
  console.log('🎯 onMounted - Vérification des références:')
  console.log('stepRefs.value:', stepRefs.value)
  console.log('Nombre d\'étapes dans props:', props.steps?.length)
  
  // Animation séquentielle des éléments principaux
  const mainTl = gsap.timeline({
    delay: 0.3,
    ease: "power2.out"
  })
  
  // Séquence d'animations
  mainTl
    .add(() => animateImage(), 0)
    .add(() => animateTitle(), 0.2)
    .add(() => animateDescription(), 0.4)
    .add(() => animateTimelineHeader(), 0.6)
    .add(() => animateButton(), 0.8)
    .add(() => animateSteps(), 1.0) // Animation des étapes après 1.0s
  
  // Debug: Vérifier que la timeline est bien créée
  console.log('🎯 Timeline GSAP créée:', mainTl)
  
  // Configuration des animations au scroll après un délai
  setTimeout(() => {
    console.log('🎯 Configuration des animations au scroll...')
    setupScrollAnimations()
  }, 1000) // Attendre 1 seconde pour s'assurer que tout est prêt
})

// Nettoyer les animations au démontage
onUnmounted(() => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
})



// Animation simple des étapes
const animateSteps = () => {
  if (prefersReducedMotion()) return
  
  console.log('🎯 animateSteps appelée')
  console.log('stepRefs.value:', stepRefs.value)
  
  // Attendre un peu plus longtemps pour que les références soient définies
  setTimeout(() => {
    const validSteps = stepRefs.value.filter(ref => ref)
    console.log('🎯 Étapes valides après timeout:', validSteps.length)
    
    if (validSteps.length === 0) {
      console.log('❌ Aucune étape valide trouvée')
      return
    }

    console.log('🎯 Animation des étapes déclenchée pour', validSteps.length, 'étapes')

    gsap.fromTo(validSteps, 
      { 
        y: 40, 
        opacity: 0,
        scale: 0.95
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }
    )
  }, 100) // Attendre 100ms
}

// Animation des étapes au scroll - Version simplifiée
const setupScrollAnimations = () => {
  if (prefersReducedMotion()) {
    console.log('❌ Animations désactivées (prefersReducedMotion)')
    return
  }
  
  console.log('🎯 setupScrollAnimations appelée')
  
  // Attendre que le DOM soit complètement prêt
  setTimeout(() => {
    console.log('🎯 Tentative de configuration après délai...')
    
    // Utiliser querySelector au lieu des refs
    const stepElements = document.querySelectorAll('.step-item')
    console.log('🎯 Étapes trouvées via querySelector:', stepElements.length)
    
    if (stepElements.length === 0) {
      console.log('❌ Aucune étape trouvée via querySelector')
      return
    }
    
    // Nettoyer les triggers existants
    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
    
    // Animation du titre et de la description au scroll
    if (titleRef.value) {
      console.log('🎯 Configuration animation titre au scroll')
      gsap.fromTo(titleRef.value, 
        { 
          y: 40, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.value,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
            onEnter: () => console.log('🎯 Titre ENTER'),
            onLeave: () => console.log('🎯 Titre LEAVE')
          }
        }
      )
    }
    
    if (descriptionRef.value) {
      console.log('🎯 Configuration animation description au scroll')
      gsap.fromTo(descriptionRef.value, 
        { 
          y: 30, 
          opacity: 0
        },
        { 
          y: 0, 
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.value,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
            onEnter: () => console.log('🎯 Description ENTER'),
            onLeave: () => console.log('🎯 Description LEAVE')
          }
        }
      )
    }
    
    // Animation simple avec ScrollTrigger direct pour les étapes
    stepElements.forEach((step, index) => {
      console.log(`🎯 Configuration étape ${index}:`, step)
      
      try {
        // Animation très simple au scroll
        gsap.fromTo(step, 
          { 
            y: 50, 
            opacity: 0,
            scale: 0.9
          },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              markers: true,
              onEnter: () => console.log(`🎯 Étape ${index} ENTER`),
              onLeave: () => console.log(`🎯 Étape ${index} LEAVE`)
            }
          }
        )
        
        console.log(`🎯 Animation GSAP créée pour étape ${index}`)
      } catch (error) {
        console.error(`❌ Erreur étape ${index}:`, error)
      }
    })
    
    console.log('🎯 Configuration terminée')
  }, 2000) // Attendre 2 secondes
}
</script>

<style scoped>
/* États initiaux pour les animations GSAP */
img, h2, p, h3, a {
  opacity: 0;
  transform: translateY(30px);
}

/* Le titre et la description commencent cachés pour les animations au scroll */
h2, p {
  opacity: 0;
  transform: translateY(30px);
}

/* Les étapes commencent cachées pour l'animation GSAP */
.step-item {
  opacity: 0;
  transform: translateY(60px) scale(0.9) rotateX(-15deg);
  visibility: visible;
  display: flex;
  transition: none; /* Pas de transitions CSS - GSAP gère tout */
}

/* Forcer la visibilité de tous les éléments des étapes */
.step-item * {
  opacity: 1;
  visibility: visible;
}

/* Pas de transitions CSS pour les étapes - GSAP gère tout */
.steps-list-enter-active,
.steps-list-leave-active {
  transition: none;
}

.steps-list-enter-from,
.steps-list-leave-to {
  /* GSAP gère ces états */
}

/* Effets de hover pour les étapes */
.step-item:hover .step-icon {
  transform: scale(1.1);
  border-color: #fbbf24;
  color: #fbbf24;
  transition: all 0.2s ease;
}

.step-item:hover .step-title {
  color: #fbbf24;
  transition: color 0.2s ease;
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>


