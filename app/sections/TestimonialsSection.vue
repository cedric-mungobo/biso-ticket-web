<template>
  <section class="py-16 md:py-24 ">
    <div class="container mx-auto px-4 md:px-8 lg:px-16">
      <!-- Header -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="text-center mb-12"
      >
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos organisateurs</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les témoignages de nos organisateurs qui font confiance à Biso Ticket
        </p>
      </div>

      <!-- Marquee Testimonials -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative"
      >
        <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div class="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5" id="row1"></div>
        <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
      </div>

      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative"
      >
        <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div class="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-5 pb-10" id="row2"></div>
        <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Données des témoignages
const testimonialsData = [
  {
    name: 'Marie Kabila',
    handle: '@marie_events',
    date: 'Mars 2025',
    testimonial: 'Biso Ticket a révolutionné la gestion de mes événements. La billetterie en ligne est intuitive et les paiements mobile money facilitent tout.'
  },
  {
    name: 'Jean Mputu',
    handle: '@jean_organizer',
    date: 'Février 2025',
    testimonial: 'Interface simple, paiements sécurisés. Mes participants adorent la facilité de réservation. Je recommande vivement !'
  },
  {
    name: 'Sarah Tshisekedi',
    handle: '@sarah_events',
    date: 'Janvier 2025',
    testimonial: 'Gestion complète de A à Z. Les invitations digitales sont magnifiques et l\'application mobile fonctionne parfaitement.'
  },
  {
    name: 'David Kabila',
    handle: '@david_productions',
    date: 'Décembre 2024',
    testimonial: 'Plateforme exceptionnelle ! Les statistiques en temps réel m\'aident à optimiser mes événements. Service client réactif.'
  },
  {
    name: 'Grace Mbuyi',
    handle: '@grace_events',
    date: 'Novembre 2024',
    testimonial: 'Biso Ticket m\'a fait gagner un temps précieux. La synchronisation avec les réseaux sociaux est parfaite.'
  },
  {
    name: 'Patrick Mwanza',
    handle: '@patrick_org',
    date: 'Octobre 2024',
    testimonial: 'Solution complète et professionnelle. Mes événements ont gagné en crédibilité grâce à Biso Ticket.'
  }
]

const createTestimonialCard = (testimonial: any) => `
  <div class="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 ">
    <div class="flex gap-2">
      <div class="size-11 rounded-full bg-primary-200 flex items-center justify-center">
        <span class="text-primary-600 font-semibold text-sm">
          ${testimonial.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1">
          <p class="font-semibold text-gray-900">${testimonial.name}</p>
          <svg class="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#8B5CF6" />
          </svg>
        </div>
        <span class="text-xs text-gray-500">${testimonial.handle}</span>
      </div>
    </div>
    <p class="text-sm py-4 text-gray-800">${testimonial.testimonial}</p>
    <div class="flex items-center justify-end text-gray-500 text-xs">
      <p>${testimonial.date}</p>
    </div>
  </div>
`

const renderTestimonials = (target: HTMLElement) => {
  const doubled = [...testimonialsData, ...testimonialsData]
  doubled.forEach(testimonial => {
    target.insertAdjacentHTML('beforeend', createTestimonialCard(testimonial))
  })
}

onMounted(() => {
  const row1 = document.getElementById('row1')
  const row2 = document.getElementById('row2')
  
  if (row1 && row2) {
    renderTestimonials(row1)
    renderTestimonials(row2)
  }
})
</script>

<style scoped>
@keyframes marqueeScroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-inner {
  animation: marqueeScroll 25s linear infinite;
}

.marquee-reverse {
  animation-direction: reverse;
}
</style>
