<template>
  <div>
    <!-- Navigation -->
    <nav class="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/80 text-gray-900 text-sm">
      <NuxtLink to="/">
        <svg width="155" height="40" viewBox="0 0 155 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M45.904 28.28q-1.54 0-2.744-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.82 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.868 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.456.924-3.276.924m-7.196 5.32V14.56h3.08v3.612l-.532 3.276.532 3.248V33.6zm6.692-8.232q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128t.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.868.504 1.988.504M54.95 28V14.56h3.08V28zm3.08-7.476-1.064-.532q0-2.548 1.12-4.116 1.148-1.596 3.444-1.596 1.008 0 1.82.364.811.365 1.512 1.176l-2.016 2.072a2.1 2.1 0 0 0-.812-.56 3 3 0 0 0-1.036-.168q-1.287 0-2.128.812-.84.811-.84 2.548m14.156 7.756q-2.016 0-3.64-.896a7 7 0 0 1-2.548-2.52q-.924-1.596-.924-3.584t.924-3.556a6.87 6.87 0 0 1 2.492-2.52q1.596-.924 3.528-.924 1.876 0 3.304.868a6.05 6.05 0 0 1 2.268 2.38q.84 1.512.84 3.444 0 .336-.056.7a7 7 0 0 1-.112.756H67.23v-2.52h9.436l-1.148 1.008q-.056-1.232-.476-2.072a3 3 0 0 0-1.204-1.288q-.756-.448-1.876-.448-1.176 0-2.044.504a3.43 3.43 0 0 0-1.344 1.428q-.476.896-.476 2.156t.504 2.212 1.428 1.484q.924.504 2.128.504 1.037 0 1.904-.364a4 4 0 0 0 1.512-1.064l1.96 1.988a6.3 6.3 0 0 1-2.38 1.736 7.6 7.6 0 0 1-2.968.588m15.91 0q-1.54 0-2.745-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.821 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.869 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.455.924-3.276.924M80.898 28V7.84h3.08v10.024l-.532 3.248.532 3.276V28zm6.692-2.632q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128.001 1.204.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.87.504 1.988.504m15.067 2.912q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.644.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.976-.28V14.56h3.08V28zm1.54-15.904q-.783 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.813 0 1.316.532t.504 1.316q0 .784-.504 1.316t-1.316.532M118.169 28V7.84h3.08V28zm8.552 0V8.96h3.08V28zm-3.22-10.64v-2.8h9.52v2.8zm17.274 10.92q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.643.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.977-.28V14.56h3.08V28zm1.54-15.904q-.785 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.812 0 1.316.532t.504 1.316-.504 1.316-1.316.532"
            fill="#1f2937" />
          <path
            d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585"
            stroke="#1f2937" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>

      <div class="hidden md:flex items-center gap-8 transition duration-500">
        <NuxtLink to="/" class="hover:text-purple-500 transition">
          Accueil
        </NuxtLink>
        <NuxtLink to="/evenements" class="hover:text-purple-500 transition">
          Événements
        </NuxtLink>
        <NuxtLink to="/contact" class="hover:text-purple-500 transition">
          Contact
        </NuxtLink>
        <NuxtLink to="/organisateur" class="hover:text-purple-500 transition">
          Organisateur
        </NuxtLink>
      </div>

      <button 
        class="hidden md:block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded-full"
        @click="handleGetStarted"
      >
        Commencer
      </button>
      
      <button 
        ref="openMenuButton"
        class="md:hidden active:scale-90 transition"
        @click="toggleMobileMenu"
      >
        <Icon name="lucide:menu" class="w-6 h-6" />
      </button>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <div 
      ref="mobileNavLinks"
      class="fixed inset-0 z-[100] bg-black/40 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <NuxtLink to="/" @click="closeMobileMenu">
        Accueil
      </NuxtLink>
      <NuxtLink to="/evenements" @click="closeMobileMenu">
        Événements
      </NuxtLink>
      <NuxtLink to="/contact" @click="closeMobileMenu">
        Contact
      </NuxtLink>
      <NuxtLink to="/organisateur" @click="closeMobileMenu">
        Organisateur
      </NuxtLink>
      
      <button 
        ref="closeMenuButton"
        class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex"
        @click="closeMobileMenu"
      >
        <Icon name="lucide:x" class="w-6 h-6" />
      </button>
    </div>

    <!-- Hero Section -->
  <!-- Hero Section -->
<div class="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-32 text-gray-900 min-h-screen py-20">
    <!-- Background Effects -->
    <div class="absolute top-32 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
    <div class="absolute top-48 right-1/4 w-56 h-56 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-8"></div>
    <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-12"></div>
    <a href="https://prebuiltui.com" class="group flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-purple-700 bg-purple-100">
        <span class="bg-purple-600 text-white text-xs px-3.5 py-1 rounded-full">
            NEW
        </span>
        <p class="flex items-center gap-1">
            <span>Digitalisez votre événement — c’est gratuit ! </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right group-hover:translate-x-0.5 transition duration-300"><path d="m9 18 6-6-6-6"/></svg>
        </p>
    </a>
    <h1 class="text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-2xl text-center">
        Passez au digital pour vos 
        <span class="bg-gradient-to-r from-purple-500 to-purple-300 px-3 rounded-xl text-nowrap">événements.</span>
    </h1>
    <p class="text-base text-center text-gray-600 max-w-lg mt-6">
        Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales.</p>
        <div class="flex items-center gap-4 mt-8">
        <button class="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-7 h-11">
          Créer mon événement
        </button>
        <button class="flex items-center gap-2 border border-purple-600 hover:bg-purple-50 transition rounded-full px-6 h-11 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-icon lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
            <span>Voir les événements</span>
        </button>
    </div>
    <div class="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
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

    <!-- Section Marquee Cards -->
    <div class="mt-20 w-full">
        <div class="text-center mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">Découvrez nos événements</h2>
            <p class="text-gray-600">Des événements exceptionnels vous attendent</p>
        </div>
        <MarqueeCards 
            :cards="featuredEvents"
            :speed="3000"
            @card-click="handleEventClick"
        />
    </div>
 
</div>
  </div>
</template>

<script setup lang="ts">
import type { MarqueeCard } from '~/types/marquee'

// Utilisation du composable pour les cartes
const { getDefaultEventCards } = useMarqueeCards()

// État réactif pour le menu mobile
const isMobileMenuOpen = ref(false)

// Données des événements en vedette
const featuredEvents = computed(() => getDefaultEventCards())

// Références aux éléments DOM
const openMenuButton = ref<HTMLButtonElement>()
const closeMenuButton = ref<HTMLButtonElement>()
const mobileNavLinks = ref<HTMLDivElement>()

/**
 * Ouvre le menu mobile
 */
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * Ferme le menu mobile
 */
const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

/**
 * Gère l'action "Commencer"
 */
const handleGetStarted = (): void => {
  // Redirection vers la page d'inscription ou de connexion
  navigateTo('/inscription')
}

/**
 * Gère l'action "Voir la démo"
 */
const handleWatchDemo = (): void => {
  // Logique pour afficher la démo (modal, redirection, etc.)
  console.log('Affichage de la démo')
}

/**
 * Gère le clic sur un événement dans le marquee
 */
const handleEventClick = (card: MarqueeCard): void => {
  // Redirection vers la page de l'événement
  navigateTo(`/evenements/${card.id}`)
}

// Gestion des événements clavier pour l'accessibilité
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Écoute des événements clavier
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// Nettoyage des événements
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Fermeture du menu lors du changement de route
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>