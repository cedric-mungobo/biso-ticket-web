<template>
  <!-- Testimonials Section -->
  <div class="py-10 md:py-16 lg:py-20 bg-secondary-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 md:items-center">
        <div 
          ref="imageRef"
          class="relative h-80 md:h-150 bg-gray-100 rounded-2xl dark:bg-neutral-800 testimonial-image"
        >
          <img class="absolute inset-0 size-full object-cover rounded-2xl" src="https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Testimonials Image">
        </div>
        <!-- End Col -->

        <div class="pt-10 md:p-10">
          <blockquote class="max-w-4xl mx-auto">
            <p 
              ref="subtitleRef"
              class="mb-6 md:text-lg testimonial-subtitle"
            >
              <span class="text-primary-600 font-semibold">Témoignages</span>
            </p>
            <p 
              ref="quoteRef"
              class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white testimonial-quote"
            >
              "Biso Ticket a révolutionné la gestion de nos événements. Interface intuitive, paiements sécurisés, et un support client exceptionnel."
            </p>
            <footer class="mt-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img 
                    ref="authorRef"
                    class="size-12 rounded-full" 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Image description"
                  >
                </div>
                <div class="ml-4">
                  <div class="text-base font-semibold text-gray-900 dark:text-white">Marie Dubois</div>
                  <div class="text-base text-gray-500 dark:text-gray-400">Directrice Marketing, TechCorp</div>
                </div>
              </div>
            </footer>
          </blockquote>
          
          <!-- CTA Button -->
          <div class="mt-8" ref="ctaButtonRef">
            <UButton
              to="/evenements"
              size="lg"
              color="primary"
              variant="solid"
              class="w-full sm:w-auto"
            >
              Découvrir nos événements
              <UIcon name="i-heroicons-arrow-right" class="ml-2" />
            </UButton>
          </div>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant simplifié sans GSAP pour optimiser le bundle
const imageRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const quoteRef = ref<HTMLElement>()
const authorRef = ref<HTMLElement>()
const ctaButtonRef = ref<HTMLElement>()

// Fonction simplifiée sans animations
const setupScrollAnimations = () => {
  console.log('🎬 Composant simplifié sans GSAP')
}

// Lifecycle
onMounted(() => {
  setupScrollAnimations()
})

onUnmounted(() => {
  // Nettoyage simplifié
})
</script>

<style scoped>
/* Styles CSS simples pour remplacer les animations GSAP */
.testimonial-image {
  transition: transform 0.3s ease;
}

.testimonial-image:hover {
  transform: scale(1.02);
}

.testimonial-subtitle,
.testimonial-quote,
.testimonial-author {
  opacity: 1;
  transform: translateY(0);
}
</style>