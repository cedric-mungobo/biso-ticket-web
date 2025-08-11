<template>
  <article class="rounded-xl border bg-white transition-all hover:shadow-lg border-primary-400 hover:border-primary-300 group">
    <div class="p-4">
      <!-- Badge de catégorie -->
      <div class="text-xs font-semibold mb-3">
        <span
          class="inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] leading-none font-medium"
          :class="categoryColorClass"
        >
          {{ category }}
        </span>
      </div>

      <!-- Titre de l'événement -->
      <h3 class="text-[15px] leading-5 md:text-base font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-200">
        {{ title }}
      </h3>

      <!-- Image de l'événement -->
      <div class="rounded-lg overflow-hidden aspect-square w-full group-hover:scale-[1.02] transition-transform duration-300">
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="title"
          class="h-full w-full object-cover"
          loading="lazy"
          placeholder
          format="webp"
          quality="80"
          sizes="sm:100vw md:50vw lg:400px"
        />
        <div
          v-else
          class="h-full w-full bg-gradient-to-br from-primary-100 to-teal-200 flex items-center justify-center"
        >
          <svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4 flex justify-between items-center">
        <span class="text-sm text-gray-500">
          {{ formatDate }}
        </span>
        <button class="text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline transition-all duration-200">
          Voir détails →
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '~/types/events'

interface Props {
  category: string
  title: string
  image?: string
  date?: string
  description?: string
  location?: string
  eventId?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  date: new Date().toISOString(),
  description: '',
  location: '',
  eventId: undefined
})

// Couleur du badge selon la catégorie
const categoryColorClass = computed(() => {
  const category = props.category.toLowerCase()
  
  switch (category) {
    case 'image':
      return 'bg-sky-50 text-sky-700 border border-sky-200'
    case 'code':
      return 'bg-primary-50 text-primary-700 border border-primary-200'
    case 'rédaction':
      return 'bg-violet-50 text-violet-700 border border-violet-200'
    case 'événement':
      return 'bg-orange-50 text-orange-700 border border-orange-200'
    case 'concert':
      return 'bg-pink-50 text-pink-700 border border-pink-200'
    case 'théâtre':
      return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'sport':
      return 'bg-red-50 text-red-700 border border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200'
  }
})

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
</script>

<style scoped>
/* Optimisations pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .group-hover\:scale-\[1\.02\]:hover,
  .transition-transform,
  .transition-colors {
    transition: none;
  }
  
  .group-hover\:scale-\[1\.02\]:hover {
    transform: none;
  }
}

/* Classe pour limiter le texte à 2 lignes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
