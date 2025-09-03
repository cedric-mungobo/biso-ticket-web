<template>
  <NuxtLink :to="`/evenements/${slug}`"> 
    <article 
      ref="cardRef"
      class="rounded-xl border bg-white transition-all hover:shadow-lg border-primary-400 hover:border-primary-300 group event-card-animated"
    >
      <div class="p-2">
        <!-- Catégories + date -->
        <div class="text-xs font-semibold mb-3 flex justify-between items-center">
          <div class="flex flex-wrap items-center gap-2">
            <template v-if="categories && categories.length">
              <span
                v-for="cat in categories"
                :key="cat"
                class="inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] leading-none font-medium category-badge border"
                :class="getCategoryClass(cat)"
              >
                {{ cat }}
              </span>
            </template>
            <template v-else-if="category">
              <span
                class="inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] leading-none font-medium category-badge border"
                :class="getCategoryClass(category)"
              >
                {{ category }}
              </span>
            </template>
          </div>
          <span>{{ formatDate }}</span>
        </div>

        <!-- Titre de l'événement avec animation -->
        <h3 class="text-[15px] leading-5 md:text-base font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-200 event-title">
          {{ title }}
        </h3>

        <!-- Image de l'événement avec animation -->
        <div class="rounded-lg overflow-hidden aspect-square w-full group-hover:scale-[1.02] transition-transform duration-300 event-image-container">
          <NuxtImg
            v-if="image"
            :src="image"
            :alt="title"
            class="h-full w-full object-cover event-image"
            loading="lazy"
            placeholder
            format="webp"
            quality="80"
            sizes="sm:100vw md:50vw lg:400px"
          />
          <div
            v-else
            class="h-full w-full bg-gradient-to-br from-primary-100 to-teal-200 flex items-center justify-center event-placeholder"
          >
            <svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>

      
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Props {
  category?: string
  categories?: string[]
  title: string
  image?: string
  date?: string
  description?: string
  location?: string
  eventId?: number | string
  slug: string
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  date: new Date().toISOString(),
  description: '',
  location: '',
  eventId: undefined,
  categories: () => []
})

// Référence pour l'animation
const cardRef = ref<HTMLElement>()

// Composable GSAP
const { 
  animateIn, 
  createScrollAnimation, 
  accessibleAnimation,
  prefersReducedMotion 
} = useGSAP()

// Classes par catégorie
const getCategoryClass = (raw: string) => {
  const category = (raw || '').toLowerCase()
  switch (category) {
    case 'image':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'code':
      return 'bg-primary-50 text-primary-700 border-primary-200'
    case 'rédaction':
    case 'redaction':
      return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'événement':
    case 'evenement':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'concert':
      return 'bg-pink-50 text-pink-700 border-pink-200'
    case 'théâtre':
    case 'theatre':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'sport':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'conference':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'live':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// Formatage de la date
const formatDate = computed(() => {
  if (!props.date) return 'Date à définir'
  
  try {
    // Gérer le format "2025-08-16 20:00:00"
    let date: Date
    
    if (typeof props.date === 'string') {
      // Remplacer l'espace par 'T' pour la compatibilité ISO
      const isoDate = props.date.replace(' ', 'T')
      date = new Date(isoDate)
    } else {
      date = new Date(props.date)
    }
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date à définir'
    }
    
    // Formater la date en français
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Erreur de formatage de date:', error, props.date)
    return 'Date à définir'
  }
})

// Animation d'entrée de la carte
const animateCardEnter = () => {
  if (prefersReducedMotion() || !cardRef.value) return
  
  accessibleAnimation(
    cardRef.value,
    () => animateIn(cardRef.value!, {
      duration: 1.2,
      y: 30,
      scale: 0.95,
      ease: 'power2.out'
    })
  )
}

// Configuration des animations au montage
onMounted(async () => {
  await nextTick()
  
  // Configuration des animations au scroll
  if (cardRef.value) {
    createScrollAnimation(cardRef.value, {
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => {
        // Délai pour l'animation séquentielle
        setTimeout(animateCardEnter, 100)
      }
    })
  }
})
</script>

<style scoped>
/* Animations pour les cartes d'événements */
.event-card-animated {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-card-animated.animated {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animation des éléments internes */
.category-badge {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-title {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-image-container {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-image {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-placeholder {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-actions {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-date {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-link {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effets de hover améliorés */
.event-card-animated:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.event-card-animated:hover .category-badge {
  transform: scale(1.05);
}

.event-card-animated:hover .event-title {
  transform: translateX(4px);
}

.event-card-animated:hover .event-image-container {
  transform: scale(1.05);
}

.event-card-animated:hover .event-link {
  transform: translateX(4px);
}

/* Optimisations pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .event-card-animated,
  .category-badge,
  .event-title,
  .event-image-container,
  .event-image,
  .event-placeholder,
  .event-actions,
  .event-date,
  .event-link {
    transition: none;
  }
  
  .event-card-animated:hover {
    transform: none;
  }
  
  .event-card-animated:hover .category-badge,
  .event-card-animated:hover .event-title,
  .event-card-animated:hover .event-image-container,
  .event-card-animated:hover .event-link {
    transform: none;
  }
}

/* Classe pour limiter le texte à 2 lignes */
.line-clamp-2 {
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Optimisations de performance */
* {
  will-change: transform, opacity;
}
</style>
