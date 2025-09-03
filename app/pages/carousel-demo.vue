<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <!-- En-tête -->
    <div class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold text-white mb-4">
        Démonstration du Carousel d'Événements
      </h1>
      <p class="text-gray-300 text-lg">
        Composant réutilisable avec de nombreuses options de configuration
      </p>
    </div>

    <!-- Section 1: Carousel basique -->
    <section class="py-16 bg-gradient-to-t to-[#1a1919] from-[#06060e]">
      <div class="container mx-auto px-4">
        <EventsCarousel
          :events="events"
          :max-events="4"
          title="Carousel Basique"
          subtitle="Configuration par défaut avec autoplay"
          :autoplay="true"
          :autoplay-interval="3000"
          :show-navigation="true"
          :show-indicators="true"
          :show-controls="true"
          :show-stats="true"
          @event-change="onEventChange"
          @autoplay-toggle="onAutoplayToggle"
        />
      </div>
    </section>

    <!-- Section 2: Carousel sans autoplay -->
    <section class="py-16 bg-gray-800">
      <div class="container mx-auto px-4">
        <EventsCarousel
          :events="events"
          :max-events="6"
          title="Carousel Manuel"
          subtitle="Navigation manuelle uniquement"
          :autoplay="false"
          :show-navigation="true"
          :show-indicators="true"
          :show-controls="false"
          :show-stats="false"
        />
      </div>
    </section>

    <!-- Section 3: Carousel minimal -->
    <section class="py-16 bg-gradient-to-b from-[#1a1919] to-[#06060e]">
      <div class="container mx-auto px-4">
        <EventsCarousel
          :events="events"
          :max-events="3"
          title="Carousel Minimal"
          subtitle="Interface épurée"
          :autoplay="true"
          :autoplay-interval="5000"
          :show-navigation="false"
          :show-indicators="true"
          :show-controls="false"
          :show-stats="false"
        />
      </div>
    </section>

    <!-- Contrôles de démonstration -->
    <section class="py-16 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-6">
            Contrôles de Démonstration
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              @click="addEvent"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter un événement
            </button>
            
            <button
              @click="removeEvent"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer un événement
            </button>
            
            <button
              @click="shuffleEvents"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Mélanger les événements
            </button>
            
            <button
              @click="clearEvents"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Vider la liste
            </button>
          </div>

          <!-- Statistiques -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Statistiques</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Événements:</span>
                <span class="text-white ml-2">{{ events.length }}</span>
              </div>
              <div>
                <span class="text-gray-400">Dernier changement:</span>
                <span class="text-white ml-2">{{ lastEventChange || 'Aucun' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// SEO Meta
useHead({
  title: 'Démonstration Carousel - Biso Ticket',
  meta: [
    {
      name: 'description',
      content: 'Démonstration du composant carousel d\'événements avec différentes configurations.'
    }
  ]
})

// État local
const events = ref([
  {
    id: 1,
    title: 'Concert Jazz en Plein Air',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop',
    startsAt: '2025-02-15T20:00:00Z',
    location: 'Parc de la Paix, Kinshasa',
    settings: { categories: ['concert', 'jazz'] }
  },
  {
    id: 2,
    title: 'Festival de Musique Électronique',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&auto=format&fit=crop',
    startsAt: '2025-03-01T18:00:00Z',
    location: 'Stade des Martyrs',
    settings: { categories: ['festival', 'électronique'] }
  },
  {
    id: 3,
    title: 'Conférence Tech Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop',
    startsAt: '2025-02-20T09:00:00Z',
    location: 'Centre de Conférences',
    settings: { categories: ['conférence', 'tech'] }
  },
  {
    id: 4,
    title: 'Mariage Élégant',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop',
    startsAt: '2025-02-28T16:00:00Z',
    location: 'Hôtel Pullman',
    settings: { categories: ['mariage', 'cérémonie'] }
  },
  {
    id: 5,
    title: 'Tournoi de Football',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&auto=format&fit=crop',
    startsAt: '2025-03-10T15:00:00Z',
    location: 'Stade TP Mazembe',
    settings: { categories: ['sport', 'football'] }
  }
])

const lastEventChange = ref<string | null>(null)

// Méthodes
const onEventChange = (event: any, index: number) => {
  lastEventChange.value = `${event.title} (${index + 1})`
  console.log('Événement changé:', event.title, 'Index:', index)
}

const onAutoplayToggle = (isActive: boolean) => {
  console.log('Autoplay:', isActive ? 'activé' : 'désactivé')
}

const addEvent = () => {
  const newId = Math.max(...events.value.map(e => Number(e.id))) + 1
  events.value.push({
    id: newId,
    title: `Nouvel Événement ${newId}`,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop',
    startsAt: new Date().toISOString(),
    location: 'Lieu à définir',
    settings: { categories: ['nouveau'] }
  })
}

const removeEvent = () => {
  if (events.value.length > 1) {
    events.value.pop()
  }
}

const shuffleEvents = () => {
  events.value = events.value.sort(() => Math.random() - 0.5)
}

const clearEvents = () => {
  events.value = []
}
</script>

<style scoped>
/* Styles spécifiques à la page de démonstration */
</style>
