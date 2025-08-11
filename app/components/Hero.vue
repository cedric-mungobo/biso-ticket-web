<template>
  <!-- Hero -->
  <div class="px-1 sm:px-6 lg:px-8">
    <div class="min-h-[500px] h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] flex flex-col bg-[url('/assets/images/hero.jpg')] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden">
      <!-- Overlay sombre pour améliorer la lisibilité -->
      <div class="absolute inset-0 bg-black/40 md:bg-black/30"></div>
      
      <!-- Contenu principal -->
      <div class="relative z-10 mt-auto w-full md:w-2/3 lg:max-w-2xl ps-4 pb-4 md:ps-10 md:pb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-white font-bold mb-4 md:mb-6 leading-tight">
          Biso Ticket
        </h1>
        <p class="text-3xl sm:text-3xl md:text-4xl lg:text-4xl text-white/95 mb-6 md:mb-8 leading-relaxed max-w-lg">
          Organisez, trouvez et réservez vos billets pour les meilleurs événements
        </p>
        
        <!-- Boutons d'action -->
        <div class="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto p-2">
          <NuxtLink 
            to="/evenements" 
            class="group w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-primary-600 text-primary-50 font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-primary-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          >
            
            <span class="hidden sm:inline">Découvrir les événements</span>
            <span class="sm:hidden">Découvrir</span>
            <svg class="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </NuxtLink>
          
          <NuxtLink 
            to="/organisateur" 
            class="group w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-white hover:text-neutral-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <span class="hidden sm:inline">Organiser un événement</span>
            <span class="sm:hidden">Organiser</span>
            <svg class="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <!-- End Hero -->
</template>