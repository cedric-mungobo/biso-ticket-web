<script setup lang="ts">
// Utilisation du composable useEvents
const { fetchPublicEvents, formatDate } = useEvents()

// Récupération des événements avec useAsyncData
const { data, pending: loading, error, refresh } = await useAsyncData('featured:events', async () => {
  try {
    console.log('[DEBUG] Starting fetchPublicEvents...')
    const result = await fetchPublicEvents({
      per_page: 6,
      page: 1,
      date_filter: 'all'
    })
    console.log('[DEBUG] fetchPublicEvents result:', result)
    return result
  } catch (err) {
    console.error('[DEBUG] fetchPublicEvents error:', err)
    throw err
  }
}, { server: false })

const events = computed(() => {
  const result = Array.isArray(data.value?.items) ? data.value!.items : []
  return result
})
</script>

<template>
  <div>
    <main id="content">
      <HeroAnimated :events="events" :max-events="4" />

      
      <!-- Our Approach Section -->
      <div class="w-full container mx-auto px-1 sm:px-0 lg:px-8">
        <OurApproach class="" />
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

