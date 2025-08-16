<template>
  <div class=" pt-24 bg-gray-50 py-8">
    <div class=" container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Espace Organisateur
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Gérez vos événements, créez de nouveaux événements et suivez vos statistiques
        </p>
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Carte Créer un événement -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 mb-4">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Créer un événement</h3>
            <p class="text-gray-600 mb-4">Créez et configurez un nouvel événement</p>
            <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Créer
            </button>
          </div>
        </div>

        <!-- Carte Mes événements -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Mes événements</h3>
            <p class="text-gray-600 mb-4">Gérez vos événements existants</p>
            <button class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Voir
            </button>
          </div>
        </div>

        <!-- Carte Statistiques -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 mb-4">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Statistiques</h3>
            <p class="text-gray-600 mb-4">Consultez vos performances</p>
            <button class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Voir
            </button>
          </div>
        </div>
      </div>

      <!-- Section d'information -->
      <div class="mt-12 bg-blue-50 rounded-lg p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-blue-900 mb-2">
            Devenez organisateur d'événements
          </h3>
          <p class="text-blue-700 mb-4">
            Créez des événements mémorables et gérez vos réservations en toute simplicité
          </p>
          <button class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Page organisateur
</script>
