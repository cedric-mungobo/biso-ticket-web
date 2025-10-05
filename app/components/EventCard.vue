<template>
  <NuxtLink :to="`/evenements/${slug}`" class="block group p-[1sssspx] bg-primary-500 rounded-2xl">
    <article
      class="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/20 hover:border-purple-500/40 relative aspect-square"
    >
      <!-- Image en arrière-plan -->
      <div class="absolute inset-0 z-0">
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="title"
          class="w-full h-full object-cover"
          loading="lazy"
          placeholder
          format="webp"
          quality="60"
          sizes="sm:100vw md:50vw lg:320px"
          :decoding="'async'"
          :fetchpriority="'low'"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-purple-600/30 to-pink-600/30"
        />
      </div>
      
      <!-- Overlay pour la lisibilité -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
      
      <!-- Badge de statut -->
      <div class="absolute top-3 right-3 z-30">
        <div :class="`backdrop-blur-lg text-white text-xs px-2 py-1 rounded-full border ${statusInfo.color}`">
          {{ statusInfo.text }}
        </div>
      </div>
      
      <!-- Date en haut -->
      <div class="absolute top-3 left-3 z-30">
        <div class="backdrop-blur-lg text-white text-sm px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-2">
          <svg class="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span class="font-medium">{{ formatDate }}</span>
        </div>
      </div>
      
      <!-- Contenu texte en bas -->
      <div class="absolute bottom-0 left-0 right-0 p-5 z-20">
        <!-- Titre de l'événement -->
        <div class="mb-3">
          <h3 class="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-200 transition-colors duration-200">
            {{ title }}
          </h3>
        </div>

        <!-- Catégories -->
        <div class="mb-3 flex items-center gap-2">
          <template v-if="categories && categories.length">
            <span
              v-for="(cat, index) in categories.slice(0, 1)"
              :key="cat"
              class="inline-flex items-center rounded-full px-3 py-1 text-[11px] leading-none font-medium bg-white/30 backdrop-blur-md text-white border border-white/40"
            >
              {{ cat }}
            </span>
            <span
              v-if="categories.length > 1"
              class="inline-flex items-center rounded-full px-2 py-1 text-[11px] leading-none font-medium bg-white/25 backdrop-blur-md text-gray-200"
            >
              +{{ categories.length - 1 }}
            </span>
          </template>
          <template v-else-if="category">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-[11px] leading-none font-medium bg-white/30 backdrop-blur-md text-white border border-white/40"
            >
              {{ category }}
            </span>
          </template>
        </div>

        <!-- Localisation et bouton d'action sur la même ligne -->
        <div class="flex items-center justify-between">
          <!-- Localisation -->
          <div v-if="location" class="flex items-center gap-2 max-w-[60%]">
            <svg class="w-4 h-4 text-purple-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-sm text-gray-100 truncate">{{ location }}</span>
          </div>
          
          <!-- Bouton d'action -->
          <div class="flex items-center gap-1 text-purple-200 group-hover:text-white transition-colors duration-200 flex-shrink-0">
            <span class="text-xs font-medium">Voir</span>
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">

interface Props {
  category?: string
  categories?: string[]
  title: string
  image?: string
  date?: string
  location?: string
  eventId?: number | string
  slug: string
  enableAnimations?: boolean
  status?: 'draft' | 'active' | 'ended' | 'cancelled' | 'suspended'
  startsAt?: string
  endsAt?: string
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  date: new Date().toISOString(),
  location: '',
  eventId: undefined,
  categories: () => [],
  enableAnimations: true,
  status: 'active',
  startsAt: '',
  endsAt: ''
})



// Formatage de la date
const formatDate = computed(() => {
  // Utiliser startsAt si disponible, sinon date
  const dateToFormat = props.startsAt || props.date
  
  if (!dateToFormat) return 'Date à définir'
  
  try {
    // Gérer le format "2025-08-16 20:00:00"
    let date: Date
    
    if (typeof dateToFormat === 'string') {
      // Remplacer l'espace par 'T' pour la compatibilité ISO
      const isoDate = dateToFormat.replace(' ', 'T')
      date = new Date(isoDate)
    } else {
      date = new Date(dateToFormat)
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
    console.error('Erreur de formatage de date:', error, dateToFormat)
    return 'Date à définir'
  }
})

// Calcul du statut de l'événement
const eventStatus = computed(() => {
  const now = new Date()
  const startDate = props.startsAt ? new Date(props.startsAt.replace(' ', 'T')) : null
  const endDate = props.endsAt ? new Date(props.endsAt.replace(' ', 'T')) : null
  
  // Si le statut est explicitement défini, l'utiliser
  if (props.status && props.status !== 'active') {
    return props.status
  }
  
  // Calcul automatique basé sur les dates
  if (startDate && now < startDate) {
    return 'upcoming' // À venir
  }
  
  if (endDate && now > endDate) {
    return 'ended' // Terminé
  }
  
  if (startDate && endDate && now >= startDate && now <= endDate) {
    return 'live' // En cours
  }
  
  return 'active' // Actif par défaut
})

// Texte et couleur du statut
const statusInfo = computed(() => {
  switch (eventStatus.value) {
    case 'upcoming':
      return { text: 'À venir', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' }
    case 'live':
      return { text: 'En cours', color: 'bg-green-500/20 text-green-300 border-green-400/30' }
    case 'ended':
      return { text: 'Terminé', color: 'bg-gray-500/20 text-gray-300 border-gray-400/30' }
    case 'cancelled':
      return { text: 'Annulé', color: 'bg-red-500/20 text-red-300 border-red-400/30' }
    case 'suspended':
      return { text: 'Suspendu', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30' }
    case 'draft':
      return { text: 'Brouillon', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' }
    default:
      return { text: 'Disponible', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' }
  }
})

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Styles de base */
* {
  font-family: 'Inter', sans-serif;
}

/* Classe pour limiter le texte à 2 lignes */
.line-clamp-2 {
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Effet de brillance subtil au survol */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Animation du bouton */
.group:hover .group-hover\:translate-x-0\.5 {
  transform: translateX(0.25rem);
}

/* Amélioration du contraste et de la lisibilité */
@media (prefers-color-scheme: dark) {
  .group:hover .group-hover\:text-purple-300 {
    color: rgb(216, 180, 254);
  }
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
