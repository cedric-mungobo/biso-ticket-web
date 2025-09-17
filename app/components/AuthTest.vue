<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Test d'authentification</h2>
    
    <!-- État de l'authentification -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">État actuel :</h3>
      <div class="space-y-2">
        <p><strong>Chargement :</strong> {{ loading ? 'Oui' : 'Non' }}</p>
        <p><strong>Utilisateur connecté :</strong> {{ user ? 'Oui' : 'Non' }}</p>
        <p><strong>Token présent :</strong> {{ token ? 'Oui' : 'Non' }}</p>
        <p v-if="user"><strong>Nom :</strong> {{ user.name }}</p>
        <p v-if="user"><strong>Email :</strong> {{ user.email }}</p>
      </div>
    </div>

    <!-- Actions de test -->
    <div class="space-y-4">
      <UButton 
        @click="testLogout" 
        color="red" 
        variant="outline"
        :disabled="!user"
      >
        Test Déconnexion
      </UButton>
      
      <UButton 
        @click="testLocalStorage" 
        color="blue" 
        variant="outline"
      >
        Vérifier localStorage
      </UButton>
      
      <UButton 
        @click="simulateGoogleCallback" 
        color="green" 
        variant="outline"
      >
        Simuler callback Google
      </UButton>
    </div>

    <!-- Résultats des tests -->
    <div v-if="testResults" class="mt-6 p-4 bg-gray-100 rounded">
      <h4 class="font-semibold mb-2">Résultats des tests :</h4>
      <pre class="text-sm">{{ testResults }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user, token, loading, logout } = useAuth()
const testResults = ref('')

const testLogout = async () => {
  try {
    await logout()
    testResults.value = 'Déconnexion réussie - localStorage nettoyé'
  } catch (error) {
    testResults.value = `Erreur lors de la déconnexion: ${error}`
  }
}

const testLocalStorage = () => {
  if (process.client) {
    const authToken = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    testResults.value = JSON.stringify({
      authToken: authToken ? 'Présent' : 'Absent',
      userData: userData ? 'Présent' : 'Absent',
      userDataParsed: userData ? JSON.parse(userData) : null
    }, null, 2)
  } else {
    testResults.value = 'localStorage non disponible côté serveur'
  }
}

const simulateGoogleCallback = () => {
  if (process.client) {
    // Simuler des données Google OAuth
    const mockToken = 'mock_google_token_12345'
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      telephone: '+243123456789',
      google_id: 'google_12345',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Stocker dans localStorage comme le ferait le callback
    localStorage.setItem('auth_token', mockToken)
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    testResults.value = 'Données Google simulées stockées dans localStorage. Rechargez la page pour voir l\'effet.'
  } else {
    testResults.value = 'Simulation non disponible côté serveur'
  }
}
</script>
