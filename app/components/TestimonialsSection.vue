<template>
  <!-- Testimonials Section -->
  <div class="py-10 md:py-16 lg:py-20 bg-secondary-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 md:items-center">
        <div 
          ref="imageRef"
          class="relative h-80 md:h-150 bg-gray-100 rounded-2xl dark:bg-neutral-800 testimonial-image"
        >
          <img class="absolute inset-0 size-full object-cover rounded-2xl" src="https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Testimonials Image">
        </div>
        <!-- End Col -->

        <div class="pt-10 md:p-10">
          <blockquote class="max-w-4xl mx-auto">
            <p 
              ref="subtitleRef"
              class="mb-6 md:text-lg testimonial-subtitle"
            >
              Une plateforme de confiance pour vos événements
            </p>

            <p 
              ref="quoteRef"
              class="text-xl sm:text-2xl lg:text-3xl lg:leading-normal text-gray-800 dark:text-neutral-200 testimonial-quote"
            >
              Biso Ticket a révolutionné la façon dont nous organisons nos événements. La simplicité d'utilisation, la sécurité des paiements et le support client exceptionnel nous ont permis de nous concentrer sur l'essentiel : créer des expériences mémorables pour nos participants.
            </p>

            <footer class="mt-6 md:mt-10">
              <div class="border-neutral-700">
                <div 
                  ref="authorRef"
                  class="mb-4 testimonial-author"
                >
                  <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                    Jean Marie
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">
                    Directeur des événements, Festival de Kinshasa
                  </p>
                </div>
                <button 
                  ref="ctaButtonRef"
                  type="button" 
                  class="group inline-flex items-center gap-x-3 text-gray-800 dark:text-neutral-200 text-sm focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none testimonial-cta"
                >
                  <span class="size-8 md:size-10 flex flex-col justify-center items-center bg-black text-white rounded-full group-hover:scale-105 group-focus:scale-105 transition-transform duration-300 ease-out dark:bg-white dark:text-black">
                    <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                  </span>
                  Voir la démo
                </button>
              </div>
            </footer>
          </blockquote>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
  </div>
  <!-- End Testimonials -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props du composant si nécessaire
interface Props {
  // Ajoutez des props ici si besoin
}

// Définition des props
const props = defineProps<Props>()

// Références pour les animations GSAP
const imageRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const quoteRef = ref<HTMLElement>()
const authorRef = ref<HTMLElement>()
const ctaButtonRef = ref<HTMLElement>()

// Stockage des triggers pour pouvoir les nettoyer
const scrollTriggers = ref<any[]>([])

// Composable GSAP
const { gsap, prefersReducedMotion } = useGSAP()

// Animation des éléments au scroll
const setupScrollAnimations = () => {
  if (prefersReducedMotion()) {
    console.log('❌ Animations désactivées (prefersReducedMotion)')
    return
  }
  
  console.log('🎯 Configuration des animations au scroll pour TestimonialsSection')
  
  // Attendre que le DOM soit complètement prêt
  setTimeout(() => {
    console.log('🎯 Tentative de configuration après délai...')
    
    // Nettoyer les triggers existants
    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
    
    // Animation de l'image
    if (imageRef.value) {
      console.log('🎯 Configuration animation image au scroll')
      gsap.fromTo(imageRef.value, 
        { 
          x: -60, 
          opacity: 0,
          scale: 0.9,
          rotationY: -10
        },
        { 
          x: 0, 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.value,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Image ENTER'),
            onLeave: () => console.log('🎯 Image LEAVE')
          }
        }
      )
    }
    
    // Animation du sous-titre
    if (subtitleRef.value) {
      console.log('🎯 Configuration animation sous-titre au scroll')
      gsap.fromTo(subtitleRef.value, 
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
          ease: "power2.out",
          scrollTrigger: {
            trigger: subtitleRef.value,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Sous-titre ENTER'),
            onLeave: () => console.log('🎯 Sous-titre LEAVE')
          }
        }
      )
    }
    
    // Animation de la citation principale
    if (quoteRef.value) {
      console.log('🎯 Configuration animation citation au scroll')
      gsap.fromTo(quoteRef.value, 
        { 
          y: 40, 
          opacity: 0,
          scale: 0.98
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.value,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Citation ENTER'),
            onLeave: () => console.log('🎯 Citation LEAVE')
          }
        }
      )
    }
    
    // Animation de l'auteur
    if (authorRef.value) {
      console.log('🎯 Configuration animation auteur au scroll')
      gsap.fromTo(authorRef.value, 
        { 
          y: 25, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: authorRef.value,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Auteur ENTER'),
            onLeave: () => console.log('🎯 Auteur LEAVE')
          }
        }
      )
    }
    
    // Animation du bouton CTA
    if (ctaButtonRef.value) {
      console.log('🎯 Configuration animation bouton CTA au scroll')
      gsap.fromTo(ctaButtonRef.value, 
        { 
          y: 30, 
          opacity: 0,
          scale: 0.9,
          rotation: -5
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ctaButtonRef.value,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Bouton CTA ENTER'),
            onLeave: () => console.log('🎯 Bouton CTA LEAVE')
          }
        }
      )
    }
    
    console.log('🎯 Configuration terminée pour TestimonialsSection')
  }, 2000) // Attendre 2 secondes
}

// Initialiser les animations au montage
onMounted(() => {
  console.log('🎯 TestimonialsSection monté - Configuration des animations...')
  setupScrollAnimations()
})

// Nettoyer les animations au démontage
onUnmounted(() => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */

/* États initiaux pour les animations GSAP au scroll */
.testimonial-image {
  opacity: 0;
  transform: translateX(-60px) scale(0.9) rotateY(-10deg);
}

.testimonial-subtitle {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.testimonial-quote {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

.testimonial-author {
  opacity: 0;
  transform: translateY(25px) scale(0.95);
}

.testimonial-cta {
  opacity: 0;
  transform: translateY(30px) scale(0.9) rotate(-5deg);
}
</style>
