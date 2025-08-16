<template>
  <!-- Testimonials Section -->
  <div class="py-10 md:py-16 lg:py-20 bg-secondary-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 md:items-center">
        <div class="relative h-80 md:h-150 bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img class="absolute inset-0 size-full object-cover rounded-2xl" src="https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Testimonials Image">
        </div>
        <!-- End Col -->

        <div class="pt-10 md:p-10">
          <blockquote class="max-w-4xl mx-auto">
            <p class="mb-6 md:text-lg">
              Une plateforme de confiance pour vos événements
            </p>

            <p class="text-xl sm:text-2xl lg:text-3xl lg:leading-normal text-gray-800 dark:text-neutral-200">
              Biso Ticket a révolutionné la façon dont nous organisons nos événements. La simplicité d'utilisation, la sécurité des paiements et le support client exceptionnel nous ont permis de nous concentrer sur l'essentiel : créer des expériences mémorables pour nos participants.
            </p>

            <footer class="mt-6 md:mt-10">
              <div class="border-neutral-700">
                <div class="mb-4">
                  <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                    Jean Marie
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">
                    Directeur des événements, Festival de Kinshasa
                  </p>
                </div>
                <button type="button" class="group inline-flex items-center gap-x-3 text-gray-800 dark:text-neutral-200 text-sm focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none">
                  <span class="size-8 md:size-10 flex flex-col justify-center items-center bg-black text-white rounded-full group-hover:scale-105 group-focus:scale-105 transition-transform duration-300 ease-out dark:bg-white dark:text-black">
                    <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                  </span>
                  Voir la démo
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
