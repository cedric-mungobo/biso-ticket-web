<template>
  <NuxtLink :to="`/evenements/${slug}`"> 
    <article 
      class="w-full bg-black text-white rounded-2xl group flex flex-col h-full"
    >
      <div class="relative -mt-px overflow-hidden rounded-2xl">
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="title"
          class="aspect-square w-full rounded-2xl object-cover object-top"
          loading="lazy"
          placeholder
          format="webp"
          quality="75"
          sizes="sm:100vw md:50vw lg:320px"
          :decoding="'async'"
          :fetchpriority="'low'"
        />
        <div
          v-else
          class="aspect-square w-full bg-gradient-to-br from-primary-100 to-teal-200 flex items-center justify-center event-placeholder"
        >
          <svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <div class="absolute bottom-0 z-10 h-1/2 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
      </div>
      
      <div class="px-4 pb-4 flex flex-col flex-grow">
        <!-- Titre de l'événement - hauteur fixe -->
        <div class="mb-0 min-h-[40px] flex items-start">
          <h3 class="text-[15px] leading-5 md:text-base font-semibold text-white line-clamp-2">
            {{ title }}
          </h3>
        </div>

        <!-- Localisation -->
        <div v-if="location" class="mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-sm text-gray-300">{{ location }}</span>
        </div>

        <!-- Catégories et date en bas - toujours en bas -->
        <div class="mt-auto flex items-center justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <template v-if="categories && categories.length">
              <span
                v-for="cat in categories"
                :key="cat"
                class="inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] leading-none font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {{ cat }}
              </span>
            </template>
            <template v-else-if="category">
              <span
                class="inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] leading-none font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {{ category }}
              </span>
            </template>
          </div>
          <span class="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] text-transparent bg-clip-text">
            {{ formatDate }}
          </span>
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
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  date: new Date().toISOString(),
  location: '',
  eventId: undefined,
  categories: () => [],
  enableAnimations: true
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

/* Styles de base sans animations */
* {
  font-family: 'Poppins', sans-serif;
}

/* Classe pour limiter le texte à 2 lignes */
.line-clamp-2 {
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
