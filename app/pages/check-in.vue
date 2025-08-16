<template>
  <div class=" pt-24 bg-gray-50 py-8">
    <div class=" container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Check-in
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Scannez votre billet ou entrez votre code pour valider votre présence à l'événement
        </p>
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Scanner QR Code -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v1M5 20a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Scanner QR Code</h3>
            <p class="text-gray-600">Scannez le QR code de votre billet</p>
          </div>
          
          <div class="text-center">
            <button class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Scanner
            </button>
          </div>
        </div>

        <!-- Code manuel -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h3a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h3m-3 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Code manuel</h3>
            <p class="text-gray-600">Entrez votre code de billet manuellement</p>
          </div>
          
          <div class="space-y-4">
            <input 
              type="text" 
              placeholder="Entrez votre code de billet"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Valider
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-medium text-blue-900 mb-4">
          Comment procéder au check-in ?
        </h3>
        <div class="space-y-3 text-blue-800">
          <div class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium text-blue-800 mr-3 mt-0.5">1</span>
            <p>Préparez votre billet ou votre téléphone avec le QR code</p>
          </div>
          <div class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium text-blue-800 mr-3 mt-0.5">2</span>
            <p>Scannez le QR code ou entrez le code manuellement</p>
          </div>
          <div class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium text-blue-800 mr-3 mt-0.5">3</span>
            <p>Confirmez votre présence et recevez votre confirmation</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Page check-in
</script>
