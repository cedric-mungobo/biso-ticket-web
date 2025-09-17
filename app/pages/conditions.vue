<template>
  <!-- Page des conditions d'utilisation -->
  <div 
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :visible-once="{ opacity: 1, y: 0 }"
    :delay="200"
    :duration="1200" 
    class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24"
  >
    <div class="max-w-4xl mx-auto">
      <!-- En-tête de la page -->
      <div class="mb-8 sm:mb-12 text-center">
        <h1 class="font-bold text-black text-3xl sm:text-4xl lg:text-5xl dark:text-white mb-4">
          Conditions d'utilisation
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          En utilisant Biso Ticket, vous acceptez les présentes conditions :
        </p>
      </div>

      <!-- Contenu principal -->
      <div class="   p-6 sm:p-8 lg:p-10">
        <div class="prose prose-lg max-w-none dark:prose-invert">
          
          <!-- Section 1: Accès à la plateforme -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm mr-3">1</span>
              Accès à la plateforme
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              L'accès à nos services (création d'événements, achat de billets, invitations électroniques) nécessite la création d'un compte.
            </p>
          </section>

          <!-- Section 2: Utilisation responsable -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm mr-3">2</span>
              Utilisation responsable
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              Vous vous engagez à utiliser Biso Ticket de manière légale, éthique et à ne pas :
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 my-4">
              <li class="my-2">Diffuser de fausses informations</li>
              <li class="my-2">Frauder ou contourner le système de billetterie</li>
            </ul>
          </section>

          <!-- Section 3: Paiements et commissions -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-sm mr-3">3</span>
              Paiements et commissions
            </h2>
            <div class="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Les événements gratuits ne sont pas commissionnés.</p>
              <p>Les événements payants sont soumis à une commission de <span class="font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">7 %</span> (modifiable par billet).</p>
            </div>
          </section>

          <!-- Section 4: Propriété -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm mr-3">4</span>
              Propriété
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              Tous les contenus de la plateforme (logos, textes, systèmes de billetterie) restent la propriété de Biso Ticket.
            </p>
          </section>

          <!-- Section 5: Modification des conditions -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm mr-3">5</span>
              Modification des conditions
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              Biso Ticket se réserve le droit de modifier les présentes conditions. Toute modification sera signalée sur le site.
            </p>
          </section>

          <!-- Section 6: Contact -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm mr-3">6</span>
              Contact
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              Pour toute question :
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Email de contact</p>
                  <a 
                    href="mailto:contact@bisoticket.com" 
                    class="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    📧 contact@bisoticket.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- Note de mise à jour -->
          <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
              Dernière mise à jour : 17 septembre 2025
            </p>
          </div>
        </div>
      </div>

      <!-- Bouton de retour -->
      <div class="mt-8 text-center">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO pour la page des conditions d'utilisation
import { useSEO } from '~/composables/useSEO'

const { setSEO } = useSEO()
setSEO({
  title: 'Conditions d\'utilisation - Biso Ticket',
  description: 'Découvrez les conditions d\'utilisation de Biso Ticket pour la création d\'événements, la billetterie et la gestion des invitations électroniques.',
  keywords: ['conditions d\'utilisation', 'CGU', 'conditions générales', 'billetterie', 'événements', 'Biso Ticket', 'règles'],
  type: 'website'
})
</script>

<style scoped>
/* Animation pour les icônes numérotées */
.w-8.h-8 {
  transition: transform 0.2s ease-in-out;
}

.w-8.h-8:hover {
  transform: scale(1.1);
}
</style>
