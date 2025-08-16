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
      <!-- Hero Section -->
      <div class="max-sm:px-1  max-sm:pt-20">
        <Hero />
      </div>

      <!-- Discover Section -->
       <section class=" mt-10   ">
      <EventsSection 
        :events="events"
        :loading="loading"
        :error="error"
        @retry="fetchFeaturedEvents"
      />
      </section>
      <!-- Our Approach Section -->
      <div class="w-full container mx-auto px-1 sm:px-0 lg:px-8">
        <OurApproach class="my-10" />
      </div>

      <!-- Services Section -->
      <div class="w-full ">
        <ServicesSection class="my-10" />
      </div>
  
      <!-- Testimonials Section -->
      <TestimonialsSection />
  
      <!-- Contact Section -->
      <ContactSection />
    </main>
    <!-- ========== END MAIN CONTENT ========== -->

  </div>  


</template>

