<template>

      <!-- CTA Section -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="py-16 p-1 max-w-5xl mx-auto rounded-3xl text-center"
      >
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Prêt à digitaliser vos événements ?
          </h3>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'organisateurs qui font confiance à Biso Ticket pour leurs événements.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/organisateur" 
              class="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-colors"
            >
              Commencer gratuitement
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="inline-flex items-center justify-center px-8 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-full transition-colors"
            >
              Nous contacter
            </NuxtLink>
          </div>
        </div>
      </div>
</template>