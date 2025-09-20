<template>
  <!-- Contact Section -->
  <div    v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200" class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
    <div class="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
      <h2 class="font-medium text-black text-2xl sm:text-4xl dark:text-white">
        Contacts
      </h2>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="space-y-8 lg:space-y-12">
        <div>
          <h3 class="mb-5 font-semibold text-black dark:text-white">
            Nos contacts
          </h3>

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- WhatsApp Card -->
            <a 
              href="https://wa.me/243899267530?text=Bonjour%2C%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20services%20de%20billetterie%20BisoTicket."
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 hover:scale-105 cursor-pointer"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-900 mb-1">
                    WhatsApp
                  </h4>
                  <p class="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    +243 899 267 530
                  </p>
                  <p class="text-sm text-gray-500">
                    Cliquez pour nous contacter
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>

            <!-- Email Card -->
            <div class="bg-white rounded-xl p-6  hover:shadow-xl transition-shadow duration-300 border border-gray-200 ">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
                    </svg>
                  </div>
                </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900  mb-1">
                    Email
                  </h4>
                  <p class="text-xl font-medium text-gray-900  mb-2">
                    <a class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="mailto:contact@bisoticket.com">
                      contact@bisoticket.com
                    </a>
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Pour les demandes détaillées
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- End Grid -->
        </div>

        <div>
          <h3 class="mb-5 font-semibold text-black ">
            Localisation
          </h3>

       
        </div>
      </div>
    </div>
  </div>
  <!-- End Contact -->
</template>

<script setup lang="ts">
// Props du composant si nécessaire
interface Props {
  // Ajoutez des props ici si besoin
}

// Définition des props
const props = defineProps<Props>()
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
