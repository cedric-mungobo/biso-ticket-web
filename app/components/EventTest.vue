<template>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <h3 class="text-lg font-semibold text-blue-800 mb-2">🧪 Test - Événement de démonstration</h3>
    <p class="text-blue-700 mb-3">
      Ce composant permet de tester la page de détail d'événement avec des données simulées.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 class="font-medium text-blue-800 mb-2">Test avec ID :</h4>
        <NuxtLink 
          to="/evenements/1"
          class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Tester avec ID 1
        </NuxtLink>
      </div>
      
      <div>
        <h4 class="font-medium text-blue-800 mb-2">Test avec Slug :</h4>
        <NuxtLink 
          to="/evenements/concert-rock-2024"
          class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Tester avec slug
        </NuxtLink>
      </div>
    </div>
    
    <div class="mt-4 p-3 bg-white rounded border border-blue-200">
      <h4 class="font-medium text-blue-800 mb-2">Données de test disponibles :</h4>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>• ID 1 : Événement de test</li>
        <li>• Slug "concert-rock-2024" : Concert de démonstration</li>
        <li>• Vérifiez que l'API retourne bien les données</li>
        <li>• Testez les composants de partage et calendrier</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant de test pour la page de détail d'événement
</script>
