<script setup lang="ts">
import HeroSection from '@/sections/heroSection.vue'
import FeaturesSection from '@/sections/FeaturesSection.vue'
import ShowcaseSection from '@/sections/ShowcaseSection.vue'
import TestimonialsSection from '@/sections/TestimonialsSection.vue'
import CtaSection from '@/sections/CtaSection.vue'
// Utilisation du composable useEvents
const { fetchPublicEvents, formatDate } = useEvents()

// Récupération des événements avec useAsyncData optimisé
const { data, pending: loading, error, refresh } = await useAsyncData('featured:events', async () => {
  try {
    if (process.dev) {
      console.log('[DEBUG] Starting fetchPublicEvents...')
    }
    const result = await fetchPublicEvents({
      per_page: 6,
      page: 1,
      date_filter: 'all'
    })
    if (process.dev) {
      console.log('[DEBUG] fetchPublicEvents result:', result)
    }
    return result
  } catch (err) {
    if (process.dev) {
      console.error('[DEBUG] fetchPublicEvents error:', err)
    }
    throw err
  }
}, { 
  server: true, // Activer le SSR pour un chargement plus rapide
  lazy: true, // Chargement paresseux
  default: () => ({ items: [] }) // Valeur par défaut
})

const events = computed(() => {
  const result = Array.isArray(data.value?.items) ? data.value!.items : []
  return result
})
</script>

<template>
  <div>
    <main id="content">
      <HeroSection />
      <!-- <HeroAnimated :events="events" :max-events="4" :enable-animations="false" />

       -->
      <!-- Features Section -->
      <FeaturesSection />

      <!-- Showcase Section -->
      <ShowcaseSection />

  
      <!-- Testimonials Section -->
      <TestimonialsSection />

      <!-- CTA Section -->
      <CtaSection />
  
      <!-- Contact Section -->
      <ContactSection />
    </main>
    <!-- ========== END MAIN CONTENT ========== -->

  </div>  


</template>

