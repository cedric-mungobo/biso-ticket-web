<template>
  <div>
    <!-- Hero Section -->
  <!-- Hero Section -->
<div class=" flex flex-col items-center justify-center text-sm px-2 pt-5 md:px-16 lg:px-24 xl:px-32 text-gray-900 min-h-screen md:py-10">
 
    <!-- Badge d'annonce avec animation slide depuis le haut -->
    <NuxtLink 
      to="/inscription" 
      v-motion
      :initial="{ opacity: 0, y: -50 }"
      :visible-once="{ opacity: 1, y: 0 }"
      :delay="200"
      :duration="1200"
      class="group flex items-center gap-2 rounded-full p-1 pr-3 md:mt-16 mb-2 mt-16 text-purple-700 bg-purple-100"
    >
        <span class="bg-purple-600 text-white text-xs px-3.5 py-1 rounded-full">
            NEW
        </span>
        <p class="flex items-center gap-1 max-sm:text-[10px]">
            <span>Digitalisez votre événement — c'est gratuit ! </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right group-hover:translate-x-0.5 transition duration-300"><path d="m9 18 6-6-6-6"/></svg>
        </p>
    </NuxtLink> 
    <!-- Titre principal avec animation fade -->
    <h1 
      v-motion
      :initial="{ opacity: 0, x: 50 }"
      :visible-once="{ opacity: 1 , x: 0}"
      :delay="200"
      :duration="1200"
      class="text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-2xl text-center"
    >
        Passez au digital pour vos 
        <span class="bg-gradient-to-r from-purple-500 to-purple-300 px-3 rounded-xl text-nowrap">événements.</span>
    </h1>
    <!-- Sous-titre avec animation slide depuis le bas -->
    <p 
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible-once="{ opacity: 1, y: 0 }"
      :delay="200"
      :duration="1200"
      class="text-base text-center text-gray-600 max-w-lg mt-6"
    >
        Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales.
    </p>
    <!-- Boutons d'action avec animation pop -->
    <div 
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :visible-once="{ opacity: 1, scale: 1 }"
      :delay="200"
      :duration="1200"
      class="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md md:max-w-none mx-auto"
    >
          <NuxtLink 
            to="/organisateur" 
            class="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-7 h-11 w-full md:w-auto flex items-center justify-center transition-colors duration-200"
          >
            Créer mon événement
          </NuxtLink>
        <NuxtLink 
          to="/evenements" 
          class="flex items-center justify-center gap-2 border border-purple-600 hover:bg-purple-50 transition rounded-full px-6 h-11 text-gray-700 w-full md:w-auto"
        >
            <Icon name="lucide:calendar" class="w-5 h-5" />
            <span>Voir les événements</span>
        </NuxtLink>
    </div>
    <!-- Liste des fonctionnalités avec animation stagger -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible-once="{ opacity: 1, y: 0 }"
      :delay="200"
      :duration="1200"
      class="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12"
    >
        <p class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check size-5 text-purple-600"><path d="M20 6 9 17l-5-5"/></svg>
            <span class="text-gray-500">recevez les paiements mobile money</span>
        </p>
        <p class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check size-5 text-purple-600"><path d="M20 6 9 17l-5-5"/></svg>
            <span class="text-gray-500"> acheter les billets en ligne via mobile money</span>
        </p>
        <p class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check size-5 text-purple-600"><path d="M20 6 9 17l-5-5"/></svg>
            <span class="text-gray-500">Configuration en 3 minutes</span>
        </p>
    </div>

    <!-- Section Marquee Cards - Affichée seulement s'il y a des événements -->
    <div 
      v-if="!pending && displayEvents.length > 0" 
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible-once="{ opacity: 1, y: 0 }"
      :delay="200"
      :duration="1200"
      class="mt-20 w-full"
    >
        <div class="text-center mb-8">
            <h2 
              v-motion
              :initial="{ opacity: 0 }"
              :visible-once="{ opacity: 1 }"
              :delay="200"
              :duration="1200"
              class="text-2xl font-semibold text-gray-800 mb-2"
            >
              Événements mis en avant
            </h2>
            <p 
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visible-once="{ opacity: 1, y: 0 }"
              :delay="200"
              :duration="1200"
              class="text-gray-600"
            >
              Découvrez nos événements exceptionnels
            </p>
        </div>
        
        <!-- Marquee Cards -->
        <MarqueeEventCards 
            :cards="displayEvents"
            :speed="3000"
            @card-click="handleEventClick"
        />
    </div>
    
    <!-- Indicateur de chargement -->
    <div v-if="pending" class="mt-20 w-full">
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    </div>

    <!-- Indicateur d'erreur (pour debug) -->
    <div v-if="error" class="mt-20 w-full">
        <div class="text-center text-red-500">
            <p>Erreur lors du chargement des événements</p>
            <p class="text-sm">{{ error }}</p>
        </div>
    </div>
 
</div>
  </div>
</template>

<script setup lang="ts">
import type { MarqueeCard } from '~/types/marquee'

// Utilisation du composable existant
const { fetchFeaturedEvents } = useEvents()

// Récupération des événements mis en avant uniquement
const { data: eventsData, pending, error } = await useAsyncData('hero:featured-events', async () => {
  try {
    // Récupérer uniquement les événements mis en avant
    const featuredResult = await fetchFeaturedEvents({
      limit: 6
    })
    
    console.log('Événements mis en avant récupérés:', featuredResult)
    return featuredResult
    
  } catch (err) {
    console.error('Erreur lors de la récupération des événements mis en avant:', err)
    // Retourner un tableau vide en cas d'erreur
    return { items: [] }
  }
}, {
  server: false, // Désactiver le SSR pour éviter les erreurs 404
  lazy: true,
  default: () => ({ items: [] })
})

// Transformation des données pour le marquee
const displayEvents = computed(() => {
  const events = eventsData.value?.items || []
  
  // Si pas d'événements, retourner un tableau vide
  if (events.length === 0) {
    return []
  }

  // Transformation des données API - uniquement les vrais événements
  return events
    .filter((event: any) => event && event.id && event.title) // Filtrer les événements valides
    .map((event: any) => ({
      id: event.id,
      title: event.title,
      image: event.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=60',
      category: event.settings?.categories?.[0] || 'Événement',
      date: event.startsAt,
      location: event.location,
      slug: event.slug
    }))
})

/**
 * Gère le clic sur un événement dans le marquee
 */
const handleEventClick = (card: MarqueeCard): void => {
  // Redirection vers la page de l'événement (utilise le slug si disponible, sinon l'ID)
  const eventPath = card.slug ? `/evenements/${card.slug}` : `/evenements/${card.id}`
  navigateTo(eventPath)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>s