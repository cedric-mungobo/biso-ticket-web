<script setup lang="ts">
import HeroSection from '@/sections/heroSection.vue'
import FeaturesSection from '@/sections/FeaturesSection.vue'
import ShowcaseSection from '@/sections/ShowcaseSection.vue'
import TestimonialsSection from '@/sections/TestimonialsSection.vue'
import CtaSection from '@/sections/CtaSection.vue'
import { useSEO } from '~/composables/useSEO'

// SEO pour la page d'accueil
const { setHomeSEO } = useSEO()
setHomeSEO()

// Debug SEO en développement
if (process.dev) {
  console.log('🔍 SEO Home page configuré')
}

// La logique des événements est maintenant gérée dans heroSection.vue
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

