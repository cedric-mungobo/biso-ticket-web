<template>
  <div class="min-h-screen ">
    <!-- Header Section -->
    <div class=" border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Blog Biso Ticket
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos conseils, actualités et guides pour réussir vos événements
          </p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Article 1 -->
        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div class="p-6">
            <div class="text-sm text-purple-600 font-medium mb-2">Conseils</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              <NuxtLink to="/blog/comment-organiser-evenement-reussi" class="hover:text-purple-600 transition">
                Comment organiser un événement réussi
              </NuxtLink>
            </h3>
            <p class="text-gray-600 mb-4">
              Découvrez les étapes clés pour organiser un événement qui marquera les esprits...
            </p>
            <NuxtLink to="/blog/comment-organiser-evenement-reussi" class="text-purple-600 hover:text-purple-700 font-medium">
              Lire la suite →
            </NuxtLink>
          </div>
        </article>

        <!-- Article 2 -->
        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="p-6">
            <div class="text-sm text-blue-600 font-medium mb-2">Actualités</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              <NuxtLink to="/blog/nouveautes-biso-ticket" class="hover:text-blue-600 transition">
                Nouveautés Biso Ticket
              </NuxtLink>
            </h3>
            <p class="text-gray-600 mb-4">
              Les dernières fonctionnalités et améliorations de notre plateforme...
            </p>
            <NuxtLink to="/blog/nouveautes-biso-ticket" class="text-blue-600 hover:text-blue-700 font-medium">
              Lire la suite →
            </NuxtLink>
          </div>
        </article>

        <!-- Article 3 -->
        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-r from-green-500 to-green-600"></div>
          <div class="p-6">
            <div class="text-sm text-green-600 font-medium mb-2">Guide</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              <NuxtLink to="/blog/optimiser-ventes-billets" class="hover:text-green-600 transition">
                Optimiser vos ventes de billets
              </NuxtLink>
            </h3>
            <p class="text-gray-600 mb-4">
              Stratégies éprouvées pour maximiser vos ventes et atteindre vos objectifs...
            </p>
            <NuxtLink to="/blog/optimiser-ventes-billets" class="text-green-600 hover:text-green-700 font-medium">
              Lire la suite →
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Prêt à créer votre événement ?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Commencez dès maintenant avec Biso Ticket
        </p>
        <NuxtLink 
          to="/organisateur" 
          class="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
        >
          Créer mon événement
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO pour la page blog
import { useSEO } from '~/composables/useSEO'
const { setSEO } = useSEO()
setSEO({
  title: 'Blog - Biso Ticket',
  description: 'Découvrez nos conseils, actualités et guides pour réussir vos événements avec Biso Ticket. Conseils d\'organisation, stratégies de vente et dernières nouveautés.',
  keywords: ['blog', 'conseils événement', 'organisation événement', 'vente billets', 'actualités', 'guides', 'Biso Ticket'],
  type: 'website'
})
</script>
