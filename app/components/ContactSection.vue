<template>
  <!-- Contact Section -->
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
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
            Nos contacts
          </h3>

          <!-- Grid -->
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <div class="flex gap-4">
              <svg class="shrink-0 size-5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>

              <div class="grow">
                <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                  WhatsApp
                </p>
                <p class="text-lg font-medium text-black dark:text-white">
                  +243 899 267 530
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  Réponse rapide garantie
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <svg class="shrink-0 size-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
              </svg>

              <div class="grow">
                <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                  Email
                </p>
                <p class="text-lg font-medium text-black dark:text-white">
                  <a class="hover:text-blue-600 transition-colors" href="mailto:contact@bisoticket.com">
                    contact@bisoticket.com
                  </a>
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  Pour les demandes détaillées
                </p>
              </div>
            </div>
          </div>
          <!-- End Grid -->
        </div>

        <div>
          <h3 class="mb-5 font-semibold text-black dark:text-white">
            Localisation
          </h3>

          <!-- Grid -->
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <div class="flex gap-4">
              <svg class="shrink-0 size-5 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>

              <div class="grow">
                <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                  📍 Service basé à Kinshasa
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  Disponible partout en RDC
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
