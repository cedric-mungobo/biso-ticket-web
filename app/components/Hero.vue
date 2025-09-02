<template>
  <div>
    <main>
     

      <section class="overflow-hidden  flex flex-col justify-center items-center min-h-[90dvh] ">
         <!-- Hero Section -->
    <div class="relative">
      <!-- Announcement Banner -->
      <div class="flex justify-center  ">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Biso Ticket plateforme de billetterie</span>
          <button class="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-gray-700">
            Découvrir
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Hero Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-left sm:text-center py-8 sm:py-10">
        <h1 class="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
          Organisez, vendez, contrôlez
        </h1>
        
        <p class="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          Biso Ticket simplifie vos événements.
          Créez vos billets, recevez les paiements mobile money,
          envoyez des invitations électroniques, et gérez l'accès avec des QR codes anti-fraude.
          Concert, Festival, Mariages, soirées privées ou événements pro — tout est là.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3 sm:gap-4">
          <button class="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors text-sm sm:text-base">
            Organiser un événement
          </button>
          <button class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-primary-700 hover:text-primary-900 transition-colors text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Voir les événements
          </button>
        </div>
      </div>
    </div>

      </section>

  
    </main>
  </div>



</template>

<script setup>

const companies = [
  {
    name: 'Nvidia',
    class: 'h-5 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/nvidia.svg',
    alt: 'Nvidia Logo',
    height: '20'
  },
  {
    name: 'Column',
    class: 'h-4 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/column.svg',
    alt: 'Column Logo',
    height: '16'
  },
  {
    name: 'GitHub',
    class: 'h-4 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/github.svg',
    alt: 'GitHub Logo',
    height: '16'
  },
  {
    name: 'Nike',
    class: 'h-5 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/nike.svg',
    alt: 'Nike Logo',
    height: '20'
  },
  {
    name: 'Laravel',
    class: 'h-4 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/laravel.svg',
    alt: 'Laravel Logo',
    height: '16'
  },
  {
    name: 'Lilly',
    class: 'h-7 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/lilly.svg',
    alt: 'Lilly Logo',
    height: '28'
  },
  {
    name: 'Lemon Squeezy',
    class: 'h-5 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/lemonsqueezy.svg',
    alt: 'Lemon Squeezy Logo',
    height: '20'
  },
  {
    name: 'OpenAI',
    class: 'h-6 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/openai.svg',
    alt: 'OpenAI Logo',
    height: '24'
  },
  {
    name: 'Tailwind CSS',
    class: 'h-4 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/tailwindcss.svg',
    alt: 'Tailwind CSS Logo',
    height: '16'
  },
  {
    name: 'Vercel',
    class: 'h-5 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/vercel.svg',
    alt: 'Vercel Logo',
    height: '20'
  },
  {
    name: 'Zapier',
    class: 'h-5 w-fit dark:invert',
    src: 'https://html.tailus.io/blocks/customers/zapier.svg',
    alt: 'Zapier Logo',
    height: '20'
  }
]
</script>



<style scoped>

</style>