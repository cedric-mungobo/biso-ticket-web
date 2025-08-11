<template>
  <main class="px-4 py-8 md:px-8  pt-20  lg:px-12">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
        Découvrez les événements à venir
      </h1>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted,nextTick } from 'vue'


// Utilisation du composable useEvents
const { 
  events, 
  loading, 
  error, 
  fetchEvents, 
  formatDate 
} = useEvents()

// Récupération des événements au montage du composant
onMounted(() => {
  nextTick(() => {
    fetchEvents()
  })
})
</script>