<template>
  <div class="container mx-auto px-1 sm:px-0 lg:px-8">
    <div class="space-y-6">
      <!-- Ligne 1 : Services principaux -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          v-for="(service, index) in mainServices" 
          :key="service.id"
          :ref="el => setServiceRef(el, index)"
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-white min-h-[500px] flex flex-col service-card"
          :class="getServiceGradient(service.id)"
        >
          <div class="flex-1">
            <p class="text-sm font-medium opacity-90 mb-2">{{ service.badge.text }}</p>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {{ service.title }}
            </h2>
            <p class="text-lg opacity-90 leading-relaxed">
              {{ service.description }}
            </p>
          </div>
          
          <!-- Image en bas -->
          <div class="mt-6 flex-1 relative">
            <NuxtImg 
              :src="getServiceImage(service.id)" 
              :alt="service.title" 
              class="w-full aspect-video h-full object-cover rounded-xl"
              loading="lazy"
              placeholder
            />
            <!-- Fallback si l'image ne charge pas -->
            <div class="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span class="text-gray-500 text-sm">{{ service.title }}</span>
            </div>
          </div>
          
          <!-- Icône du service -->
          <div class="absolute top-8 right-8 z-20">
            <div class="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon"></path>
              </svg>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div class="absolute bottom-8 left-8 z-20">
            <button class="border border-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium hover:bg-white/10 transition-colors">
              {{ service.cta }}
            </button>
          </div>
        </div>
      </div>

      <!-- Ligne 2 : CTA Section -->
      <div 
        ref="ctaSectionRef"
        class="bg-gradient-to-br from-secondary-500 to-primary-500 rounded-3xl p-8 md:p-12 cta-section"
      >
        <div class="max-w-2xl">
          <h3 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Prêt à<br>organiser votre<br>
            <span class="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              événement ?
            </span>
          </h3>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            Rejoignez des milliers d'organisateurs qui font confiance à Biso Ticket pour leurs événements.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="bg-white text-orange-600 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors">
              Commencer maintenant
            </button>
            <button class="border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white/10 transition-colors">
              Voir la démo
            </button>
          </div>
        </div>
      </div>

      <!-- Ligne 3 : Service spécial (Invitation électronique) -->
      <div 
        v-if="digitalInvitationService"
        ref="digitalServiceRef"
        class="bg-gradient-to-r rounded-2xl from-primary-900 to-secondary-900 digital-service"
      >
        <section class="">
          <!-- Layout principal -->
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[600px]">
            <!-- Image/Video -->
            <div class="lg:w-1/2 rounded-xl overflow-hidden">
              <video 
                class="w-full h-full object-cover rounded-xl"
                autoplay 
                muted 
                loop 
                playsinline
              >
                <source src="/assets/videos/invitation-demo.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>

            <!-- Contenu texte -->
            <div class="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
              <!-- Titre de la section -->
              <div class="max-w-3xl mb-4 lg:mb-6">
                <h2 class="text-white font-semibold text-2xl md:text-4xl md:leading-tight">
                  {{ digitalInvitationService.title }}
                </h2>
                <p class="mt-1 text-secondary-200">
                  {{ digitalInvitationService.description }}
                </p>
              </div>

              <!-- Timeline des étapes -->
              <div class="mb-4">
                <h3 class="text-secondary-200 text-xs font-medium uppercase">
                  Fonctionnalités
                </h3>
              </div>

              <!-- Étapes de la timeline -->
              <div class="space-y-4">
                <div 
                  v-for="(feature, index) in digitalFeatures" 
                  :key="index"
                  :ref="el => setFeatureRef(el, index)"
                  class="flex gap-x-5 ms-1 feature-item"
                >
                  <!-- Icône avec ligne de connexion -->
                  <div class="relative">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                        {{ index + 1 }}
                      </span>
                    </div>
                  </div>
                  <!-- Contenu de l'étape -->
                  <div class="grow pt-0.5">
                    <p class="text-sm lg:text-base text-neutral-400">
                      <span class="text-white">{{ feature.title }}:</span>
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Bouton d'action -->
              <div class="mt-8">
                <button class="group inline-flex items-center gap-x-2 py-2 px-3 bg-secondary-200 font-medium text-sm text-neutral-800 rounded-full focus:outline-hidden hover:bg-secondary-300 transition-colors">
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
                  {{ digitalInvitationService.cta }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Service {
  id: string
  badge: {
    text: string
    color: string
    bgColor: string
    borderColor: string
  }
  title: string
  description: string
  icon: string
  gradient: {
    from: string
    to: string
  }
  iconColor: string
  tag: string
  cta: string
}

interface DigitalFeature {
  title: string
  description: string
}

// Références pour les animations GSAP
const serviceRefs = ref<HTMLElement[]>([])
const ctaSectionRef = ref<HTMLElement>()
const digitalServiceRef = ref<HTMLElement>()
const featureRefs = ref<HTMLElement[]>([])

// Stockage des triggers pour pouvoir les nettoyer
const scrollTriggers = ref<any[]>([])

// Composable GSAP
const { gsap, prefersReducedMotion } = useGSAP()

// Fonction pour définir les références des services
const setServiceRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    serviceRefs.value[index] = el as HTMLElement
  }
}

// Fonction pour définir les références des fonctionnalités
const setFeatureRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    featureRefs.value[index] = el as HTMLElement
  }
}

// Animation des éléments au scroll
const setupScrollAnimations = () => {
  if (prefersReducedMotion()) {
    console.log('❌ Animations désactivées (prefersReducedMotion)')
    return
  }
  
  console.log('🎯 Configuration des animations au scroll pour ServicesSection')
  
  // Attendre que le DOM soit complètement prêt
  setTimeout(() => {
    console.log('🎯 Tentative de configuration après délai...')
    
    // Nettoyer les triggers existants
    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
    
    // Animation des cartes de services
    const serviceCards = document.querySelectorAll('.service-card')
    console.log('🎯 Cartes de services trouvées:', serviceCards.length)
    
    serviceCards.forEach((card, index) => {
      console.log(`🎯 Configuration carte service ${index}:`, card)
      
      try {
        gsap.fromTo(card, 
          { 
            y: 60, 
            opacity: 0,
            scale: 0.95,
            rotationY: -5
          },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotationY: 0,
            duration: 1.0,
            ease: "power3.out",
                      scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log(`🎯 Carte service ${index} ENTER`),
            onLeave: () => console.log(`🎯 Carte service ${index} LEAVE`)
          }
          }
        )
        
        console.log(`🎯 Animation GSAP créée pour carte service ${index}`)
      } catch (error) {
        console.error(`❌ Erreur carte service ${index}:`, error)
      }
    })
    
    // Animation de la section CTA
    if (ctaSectionRef.value) {
      console.log('🎯 Configuration animation section CTA au scroll')
      gsap.fromTo(ctaSectionRef.value, 
        { 
          y: 50, 
          opacity: 0,
          scale: 0.98
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaSectionRef.value,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Section CTA ENTER'),
            onLeave: () => console.log('🎯 Section CTA LEAVE')
          }
        }
      )
    }
    
    // Animation du service digital
    if (digitalServiceRef.value) {
      console.log('🎯 Configuration animation service digital au scroll')
      gsap.fromTo(digitalServiceRef.value, 
        { 
          y: 60, 
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
            trigger: digitalServiceRef.value,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log('🎯 Service digital ENTER'),
            onLeave: () => console.log('🎯 Service digital LEAVE')
          }
        }
      )
    }
    
    // Animation des fonctionnalités
    const featureItems = document.querySelectorAll('.feature-item')
    console.log('🎯 Fonctionnalités trouvées:', featureItems.length)
    
    featureItems.forEach((feature, index) => {
      console.log(`🎯 Configuration fonctionnalité ${index}:`, feature)
      
      try {
        gsap.fromTo(feature, 
          { 
            x: -30, 
            opacity: 0,
            scale: 0.95
          },
          { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
                      scrollTrigger: {
            trigger: feature,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            markers: false,
            onEnter: () => console.log(`🎯 Fonctionnalité ${index} ENTER`),
              onLeave: () => console.log(`🎯 Fonctionnalité ${index} LEAVE`)
            }
          }
        )
        
        console.log(`🎯 Animation GSAP créée pour fonctionnalité ${index}`)
      } catch (error) {
        console.error(`❌ Erreur fonctionnalité ${index}:`, error)
      }
    })
    
    console.log('🎯 Configuration terminée pour ServicesSection')
  }, 2000) // Attendre 2 secondes
}

// Initialiser les animations au montage
onMounted(() => {
  console.log('🎯 ServicesSection monté - Configuration des animations...')
  setupScrollAnimations()
})

// Nettoyer les animations au démontage
onUnmounted(() => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
})

// Propriétés computed
const mainServices = computed(() => services.slice(0, 2)) // Prend les 2 premiers services
const digitalInvitationService = computed(() => services.find(s => s.id === 'digital-invitations'))

// Fonctions utilitaires
const getServiceGradient = (serviceId: string) => {
  const service = services.find(s => s.id === serviceId)
  if (!service) return 'from-gray-600 to-gray-800'
  
  // Mapping des gradients par service
  const gradients: Record<string, string> = {
    'online-ticketing': 'from-secondary-600 to-secondary-800',
    'wristband-tickets': 'from-primary-600 to-primary-800',
    'paper-tickets': 'from-secondary-600 to-secondary-800',
    'digital-invitations': 'from-primary-600 to-primary-800',
    'event-management': 'from-secondary-600 to-secondary-800',
    'customer-support': 'from-secondary-600 to-secondary-800'
  }
  
  return gradients[serviceId] || 'from-gray-600 to-gray-800'
}

const getServiceImage = (serviceId: string) => {
  // Mapping des images par service
  const images: Record<string, string> = {
    'online-ticketing': '/assets/images/ticket.jpg',
    'wristband-tickets': '/assets/images/bracelet.jpeg',
    'paper-tickets': '/assets/images/ticket.jpg',
    'digital-invitations': '/assets/images/hero.jpg',
    'event-management': '/assets/images/hero.jpg',
    'customer-support': '/assets/images/hero.jpg'
  }
  
  const imagePath = images[serviceId] || '/assets/images/hero.jpg'
  console.log(`Service ${serviceId}: Image path = ${imagePath}`)
  return imagePath
}

// Fonctionnalités digitales
const digitalFeatures: DigitalFeature[] = [
  {
    title: 'Templates modernes',
    description: 'Design élégant et personnalisable aux couleurs de votre événement'
  },
  {
    title: 'Animations interactives',
    description: 'Expérience utilisateur engageante et moderne'
  },
  {
    title: 'RSVP intégré',
    description: 'Gestion des confirmations et partage sur réseaux sociaux'
  }
]

const sliderPosition = ref(75)
const isDragging = ref(false)

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const slider = (event.target as HTMLElement).parentElement
  if (!slider) return
  
  const rect = slider.getBoundingClientRect()
  const newPosition = ((event.clientX - rect.left) / rect.width) * 100
  sliderPosition.value = Math.max(0, Math.min(100, newPosition))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Valeurs clés de Biso Ticket
const coreValues = ['Sécurité', 'Rapidité', 'Efficacité', 'Simplicité']

// Liste des services
const services: Service[] = [
  {
    id: 'online-ticketing',
    badge: {
      text: 'Service Premium',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    title: 'Billeterie en ligne',
    description: 'Biso Ticket une plateforme ultra-sécurisée qui vous permet de faire de la vente de billets en ligne avec paiement mobile money, cartes bancaires et transfert d\'argent. Gestion des stocks en temps réel, réservations instantanées et notifications automatiques pour vos participants.',
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    gradient: { from: 'from-blue-100', to: 'to-blue-200' },
    iconColor: 'text-blue-600',
    tag: 'Vente en ligne',
    cta: 'Découvrir'
  },
  {
    id: 'wristband-tickets',
    badge: {
      text: 'Solutions Physiques',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    title: 'Bracelets & Billets Papier',
    description: 'Bracelets d\'accès personnalisés et élégants avec QR code intégré, design personnalisable aux couleurs de votre événement. Parfaits pour festivals, concerts et événements d\'entreprise. Suivi des entrées en temps réel et statistiques détaillées. Billets papier de haute qualité avec design personnalisé, hologrammes de sécurité et QR codes uniques.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: { from: 'from-green-100', to: 'to-green-200' },
    iconColor: 'text-green-600',
    tag: 'Accès sécurisé',
    cta: 'Commander'
  },
  {
    id: 'paper-tickets',
    badge: {
      text: 'Papier',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    title: 'Billet papier',
    description: 'Billets papier imprimés de haute qualité avec design personnalisé, hologrammes de sécurité et QR codes uniques. Impression sur différents supports (papier couché, carton, etc.) pour tous types d\'événements traditionnels et professionnels.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    gradient: { from: 'from-orange-100', to: 'to-orange-200' },
    iconColor: 'text-orange-600',
    tag: 'Impression HD',
    cta: 'Imprimer'
  },
  {
    id: 'digital-invitations',
    badge: {
      text: 'Digital',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    title: 'Invitation électronique',
    description: 'Invitations 2.0 digitales élégantes et personnalisées pour vos événements privés, Mariage, soirées d\'entreprise et célébrations. Templates modernes, animations interactives, RSVP intégré et partage facile sur les réseaux sociaux.',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    gradient: { from: 'from-purple-100', to: 'to-purple-200' },
    iconColor: 'text-purple-600',
    tag: 'Design personnalisé',
    cta: 'Créer'
  },
  {
    id: 'event-management',
    badge: {
      text: 'Gestion',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    title: 'Gestion d\'événements',
    description: 'Plateforme complète et intuitive pour gérer tous les aspects de vos événements : planning, budgets, équipes, fournisseurs, marketing et analytics. Tableaux de bord en temps réel et outils de collaboration pour une organisation parfaite.',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    gradient: { from: 'from-red-100', to: 'to-red-200' },
    iconColor: 'text-red-600',
    tag: 'Plateforme complète',
    cta: 'Découvrir'
  },
  {
    id: 'customer-support',
    badge: {
      text: 'Support',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    title: 'Support client',
    description: 'Assistance 24/7 par une équipe d\'experts dédiée à votre réussite. Support multilingue, formation personnalisée, documentation complète et accompagnement sur mesure pour maximiser l\'impact de vos événements et optimiser votre ROI.',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z',
    gradient: { from: 'from-teal-100', to: 'to-teal-200' },
    iconColor: 'text-teal-600',
    tag: '24/7',
    cta: 'Contacter'
  }
]
</script>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* États initiaux pour les animations GSAP au scroll */
.service-card {
  opacity: 0;
  transform: translateY(60px) scale(0.95) rotateY(-5deg);
}

.cta-section {
  opacity: 0;
  transform: translateY(50px) scale(0.98);
}

.digital-service {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}

.feature-item {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
</style>

