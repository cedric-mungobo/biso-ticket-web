<template>
  <OrganizerNavigation page-title="Tableau de bord">
    <div class="p-6 lg:p-8">
      <!-- En-tête de la page -->
      <div class="text-center mb-8 lg:mb-12">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p class="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Gérez vos événements, créez de nouveaux événements et suivez vos statistiques
        </p>
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <!-- Carte Créer un événement -->
        <div class="bg-white rounded-lg shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-md bg-blue-100 mb-3 lg:mb-4">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">Créer un événement</h3>
            <p class="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">Créez et configurez un nouvel événement</p>
            <NuxtLink
              to="/organisateur/create-event"
              class="w-full bg-primary-600 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-primary-700 transition-colors block text-center text-sm lg:text-base"
            >
              Créer
            </NuxtLink>
          </div>
        </div>

        <!-- Carte Mes événements -->
        <div class="bg-white rounded-lg shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-md bg-black mb-3 lg:mb-4">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">Mes événements</h3>
            <p class="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">Gérez vos événements existants</p>
            <NuxtLink
              to="/organisateur/my-events"
              class="w-full bg-black text-white px-3 lg:px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors block text-center text-sm lg:text-base"
            >
              Voir
            </NuxtLink>
          </div>
        </div>

        <!-- Carte Statistiques -->
        <div class="bg-white rounded-lg shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-md bg-purple-100 mb-3 lg:mb-4">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">Statistiques</h3>
            <p class="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">Consultez vos performances</p>
            <NuxtLink
              to="/organisateur/statistics"
              class="w-full bg-secondary-600 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-secondary-700 transition-colors block text-center text-sm lg:text-base"
            >
              Voir
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Section d'information -->
      <div class="mt-8 lg:mt-12 bg-primary-50 rounded-lg p-4 lg:p-6">
        <div class="text-center">
          <h3 class="text-base lg:text-lg font-medium text-primary-900 mb-2">
            Devenez organisateur d'événements
          </h3>
          <p class="text-sm lg:text-base text-primary-700 mb-3 lg:mb-4">
            Créez des événements mémorables et gérez vos réservations en toute simplicité
          </p>
        </div>
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

// Page organisateur
</script>
  