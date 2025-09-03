<template>
  <div>
    <main>
      <section class="overflow-hidden flex flex-col justify-center items-center min-h-[90dvh]">
         <!-- Hero Section -->
    <div class="relative">
      <!-- Announcement Banner -->
                    <div class="flex justify-center">
            <div ref="announcementRef" class="flex items-center gap-2 text-sm text-gray-600 opacity-0">
          <span>Biso Ticket plateforme de billetterie</span>
              <NuxtLink 
                to="/evenements" 
                class="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
            Découvrir
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
              </NuxtLink>
        </div>
      </div>

      <!-- Main Hero Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-left sm:text-center py-8 sm:py-10">
            <!-- Titre principal avec animation de frappe -->
            <h1 
              ref="titleRef" 
              class="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight opacity-0"
            >
              <span class="inline-block">Organisez,</span>
              <span class="inline-block ml-2">vendez,</span>
              <span class="inline-block ml-2">contrôlez</span>
        </h1>
        
            <!-- Sous-titre avec animation de révélation -->
            <p 
              ref="subtitleRef" 
              class="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed opacity-0"
            >
              <span class="inline-block">Biso Ticket simplifie vos événements.</span>
              <br class="hidden sm:block">
              <span class="inline-block">Créez vos billets, recevez les paiements mobile money,</span>
              <br class="hidden sm:block">
              <span class="inline-block">envoyez des invitations électroniques, et gérez l'accès avec des QR codes anti-fraude.</span>
              <br class="hidden sm:block">
              <span class="inline-block">Concert, Festival, Mariages, soirées privées ou événements pro — tout est là.</span>
            </p>

                        <!-- CTA Buttons avec animation stagger -->
            <div 
              ref="buttonsRef" 
              class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3 sm:gap-4 opacity-0"
            >
              <NuxtLink 
                to="/organisateur/create-event" 
                class="hero-button w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
              >
            Organiser un événement
              </NuxtLink>
              <NuxtLink 
                to="/evenements" 
                class="hero-button w-full border rounded-md sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-primary-700 hover:text-primary-900 transition-all duration-300 transform hover:scale-105"
              >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Voir les événements
              </NuxtLink>
        </div>
      </div>
    </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// Références pour les éléments à animer
const announcementRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const buttonsRef = ref<HTMLElement>()

// Composable GSAP
const { 
  gsap, 
  createTimeline, 
  staggerAnimation, 
  accessibleAnimation, 
  prefersReducedMotion,
  isGSAPAvailable 
} = useGSAP()

// Animation principale du Hero
const animateHeroText = () => {
  if (!isGSAPAvailable() || prefersReducedMotion()) {
    // Fallback : afficher les éléments sans animation
    if (announcementRef.value) announcementRef.value.style.opacity = '1'
    if (titleRef.value) titleRef.value.style.opacity = '1'
    if (subtitleRef.value) subtitleRef.value.style.opacity = '1'
    if (buttonsRef.value) buttonsRef.value.style.opacity = '1'
    return
  }

  // Créer une timeline principale
  const tl = createTimeline({ delay: 0.3 })

  // Animation de l'annonce (entrée par le haut)
  if (announcementRef.value) {
    tl.fromTo(announcementRef.value, 
      { 
        y: -30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power2.out' 
      }
    )
  }

  // Animation du titre avec effet de frappe
  if (titleRef.value) {
    const titleSpans = titleRef.value.querySelectorAll('span')
    
    tl.fromTo(titleRef.value,
      { 
        y: 50, 
        opacity: 0, 
        scale: 0.9 
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: 'power3.out' 
      },
      '-=0.4'
    )

    // Animation des mots du titre avec stagger
    if (titleSpans.length > 0) {
      tl.fromTo(titleSpans,
        { 
          y: 30, 
          opacity: 0, 
          rotationX: 90 
        },
        { 
          y: 0, 
          opacity: 1, 
          rotationX: 0, 
          duration: 0.6, 
          stagger: 0.2, 
          ease: 'back.out(1.7)' 
        },
        '-=0.8'
      )
    }
  }

  // Animation du sous-titre avec révélation progressive
  if (subtitleRef.value) {
    const subtitleSpans = subtitleRef.value.querySelectorAll('span')
    
    tl.fromTo(subtitleRef.value,
      { 
        y: 40, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.0, 
        ease: 'power2.out' 
      },
      '-=0.6'
    )

    // Animation des phrases du sous-titre
    if (subtitleSpans.length > 0) {
      tl.fromTo(subtitleSpans,
        { 
          y: 20, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power2.out' 
        },
        '-=0.8'
      )
    }
  }

  // Animation des boutons avec effet de rebond
  if (buttonsRef.value) {
    const buttons = buttonsRef.value.querySelectorAll('.hero-button')
    
    tl.fromTo(buttonsRef.value,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power2.out' 
      },
      '-=0.4'
    )

    // Animation des boutons individuels
    if (buttons.length > 0) {
      tl.fromTo(buttons,
        { 
          y: 20, 
          opacity: 0, 
          scale: 0.8 
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'back.out(1.7)' 
        },
        '-=0.6'
      )
    }
  }
}

// Animation au scroll (optionnelle)
const setupScrollAnimations = () => {
  if (!isGSAPAvailable() || prefersReducedMotion()) return

  // Animation du titre au scroll
  if (titleRef.value) {
    gsap.fromTo(titleRef.value,
      { 
        y: 100, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.value,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }
}

// Initialiser les animations au montage du composant
onMounted(() => {
  nextTick(() => {
    accessibleAnimation(
      'hero-text',
      () => {
        animateHeroText()
        setupScrollAnimations()
      },
      () => {
        // Fallback pour les utilisateurs qui préfèrent moins de mouvement
        if (announcementRef.value) announcementRef.value.style.opacity = '1'
        if (titleRef.value) titleRef.value.style.opacity = '1'
        if (subtitleRef.value) subtitleRef.value.style.opacity = '1'
        if (buttonsRef.value) buttonsRef.value.style.opacity = '1'
      }
    )
  })
})

// Nettoyage au démontage
onUnmounted(() => {
  if (isGSAPAvailable()) {
    gsap.killTweensOf([announcementRef.value, titleRef.value, subtitleRef.value, buttonsRef.value])
  }
})
</script>



<style scoped>

</style>