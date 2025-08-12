<script setup lang="ts">
import { onMounted,nextTick } from 'vue'


// Utilisation du composable useEvents
const { 
  events, 
  loading, 
  error, 
  fetchFeaturedEvents, 
  formatDate 
} = useEvents()

// Récupération des événements au montage du composant
onMounted(() => {
  nextTick(() => {
    fetchFeaturedEvents()
  })
})
</script>

<template>
  <div>
    <main id="content">
      <div class="pt-20">
        <Hero />
      </div>

   

      <!-- discover -->
      <div class="max-w-7xl px-2 sm:px-0 lg:px-8 py-12 lg:py-24 mx-auto">
        <div class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
          <h1 class="font-medium text-black text-3xl sm:text-4xl dark:text-white">
            Découvrez les événements à venir
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center gap-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span class="text-gray-600 dark:text-gray-400">Chargement des événements...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button 
              @click="fetchFeaturedEvents"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Events Grid -->
        <div v-else-if="events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <EventCard
            v-for="event in events" 
            :key="event.id"
            :category="event.category"
            :title="event.name"
            :image="event.image_url || event.image"
            :date="event.date_time"
            :description="event.description"
            :location="event.location"
            :eventId="event.id"
          />
        </div>

        <!-- No Events State -->
        <div v-else class="text-center py-12">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Aucun événement disponible</h3>
            <p class="text-gray-600">Aucun événement n'est actuellement disponible. Revenez plus tard !</p>
          </div>
        </div>

        <div v-if="events.length > 0" class="mt-10 lg:mt-20 text-center">
          <NuxtLink 
            to="/evenements"
            class="relative inline-block font-medium md:text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white"
          >
            Voir tous les événements
          </NuxtLink>
        </div>
      </div>
      <!-- End Works -->
  

      <div class="px-1 sm:px-6 lg:px-8  ">
        <!-- Approach -->
        <OurApproach />
        <!-- End Approach -->
      </div>

      <!-- Nos Services -->
      <ServicesSection />
  
      <!-- Testimonials -->
      <div class="py-10 md:py-16 lg:py-20 bg-secondary-100">
        <div class="px-4 sm:px-6 lg:px-8">
          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 md:items-center">
            <div class="relative h-80 md:h-150 bg-gray-100 rounded-2xl dark:bg-neutral-800">
              <img class="absolute inset-0 size-full object-cover rounded-2xl" src="https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Testimonials Image">
            </div>
            <!-- End Col -->
  
            <div class="pt-10 md:p-10">
              <blockquote class="max-w-4xl mx-auto">
                <p class="mb-6 md:text-lg">
                  A Family Tradition of Rich, Aromatic Coffee
                </p>
  
                <p class="text-xl sm:text-2xl lg:text-3xl lg:leading-normal text-gray-800 dark:text-neutral-200">
                  Coffee has the power to connect generations – whether it's learning grandma's brewing techniques and trying to perfect them just like her or the intense memories triggered by the rich flavors and aromas of our favorite coffee blends.
                </p>
  
                <footer class="mt-6 md:mt-10">
                  <div class="border-neutral-700">
                    <button type="button" class="group inline-flex items-center gap-x-3 text-gray-800 dark:text-neutral-200 text-sm focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none">
                      <span class="size-8 md:size-10 flex flex-col justify-center items-center bg-black text-white rounded-full group-hover:scale-105 group-focus:scale-105 transition-transform duration-300 ease-in-out dark:bg-white dark:text-black">
                        <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                        </svg>
                      </span>
                      Watch the Video
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
  
      <!-- Contact -->
      <div class="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24 mx-auto">
        <div class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
          <h2 class="font-medium text-black text-2xl sm:text-4xl dark:text-white">
            Contacts
          </h2>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-6 md:gap-8 lg:gap-12">
          <div class="aspect-w-16 aspect-h-6 lg:aspect-h-14 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
            <img class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Contacts Image">
          </div>
          <!-- End Col -->
  
          <div class="space-y-8 lg:space-y-16">
            <div>
              <h3 class="mb-5 font-semibold text-black dark:text-white">
                Our address
              </h3>
  
              <!-- Grid -->
              <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                <div class="flex gap-4">
                  <svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
  
                  <div class="grow">
                    <p class="text-sm text-gray-600 dark:text-neutral-400">
                      United Kingdom
                    </p>
                    <address class="mt-1 text-black not-italic dark:text-white">
                      300 Bath Street, Tay House<br>
                      Glasgow G2 4JR
                    </address>
                  </div>
                </div>
              </div>
              <!-- End Grid -->
            </div>
  
            <div>
              <h3 class="mb-5 font-semibold text-black dark:text-white">
                Our contacts
              </h3>
  
              <!-- Grid -->
              <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                <div class="flex gap-4">
                  <svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
                  </svg>
  
                  <div class="grow">
                    <p class="text-sm text-gray-600 dark:text-neutral-400">
                      Email us
                    </p>
                    <p>
                      <a class="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white" href="mailto:example@site.so">
                        hello@example.so
                      </a>
                    </p>
                  </div>
                </div>
  
                <div class="flex gap-4">
                  <svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
  
                  <div class="grow">
                    <p class="text-sm text-gray-600 dark:text-neutral-400">
                      Call us
                    </p>
                    <p>
                      <a class="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white" href="mailto:example@site.so">
                        +44 222 777-000
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <!-- End Grid -->
            </div>
          </div>
          <!-- End Col -->
        </div>
      </div>
      <!-- End Contact -->
    </main>
    <!-- ========== END MAIN CONTENT ========== -->

  </div>  


</template>

