<template>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Debug Google OAuth</h3>
    
    <div class="space-y-2">
      <div>
        <strong>Client ID:</strong> 
        <code class="bg-gray-200 px-2 py-1 rounded text-sm">
          {{ config.public.googleClientId }}
        </code>
      </div>
      
      <div>
        <strong>Current Origin:</strong> 
        <code class="bg-gray-200 px-2 py-1 rounded text-sm">
          {{ currentOrigin }}
        </code>
      </div>
      
      <div>
        <strong>Current Hostname:</strong> 
        <code class="bg-gray-200 px-2 py-1 rounded text-sm">
          {{ currentHostname }}
        </code>
      </div>
      
      <div>
        <strong>Google API Loaded:</strong> 
        <span :class="googleApiLoaded ? 'text-green-600' : 'text-red-600'">
          {{ googleApiLoaded ? '✅ Oui' : '❌ Non' }}
        </span>
      </div>
      
      <div>
        <strong>Google Accounts API:</strong> 
        <span :class="googleAccountsApi ? 'text-green-600' : 'text-red-600'">
          {{ googleAccountsApi ? '✅ Disponible' : '❌ Non disponible' }}
        </span>
      </div>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 rounded">
        <strong class="text-red-800">Erreur:</strong>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>
    
    <div class="mt-4">
      <h4 class="font-semibold mb-2">Instructions de configuration :</h4>
      <ol class="list-decimal list-inside space-y-1 text-sm text-gray-700">
        <li>Allez sur <a href="https://console.cloud.google.com/" target="_blank" class="text-blue-600 underline">Google Cloud Console</a></li>
        <li>Sélectionnez votre projet (Client ID: {{ config.public.googleClientId.split('-')[0] }})</li>
        <li>Naviguez vers "APIs & Services" > "Credentials"</li>
        <li>Cliquez sur votre OAuth 2.0 Client ID</li>
        <li>Dans "Authorized JavaScript origins", ajoutez :</li>
        <ul class="list-disc list-inside ml-4 mt-1">
          <li><code>{{ currentOrigin }}</code></li>
          <li><code>https://bisoticket.com</code></li>
        </ul>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const currentOrigin = ref('')
const currentHostname = ref('')
const googleApiLoaded = ref(false)
const googleAccountsApi = ref(false)
const error = ref('')

onMounted(() => {
  if (process.client) {
    currentOrigin.value = window.location.origin
    currentHostname.value = window.location.hostname
    googleApiLoaded.value = !!window.google
    googleAccountsApi.value = !!(window.google && window.google.accounts)
    
    // Vérifier si le Client ID est valide
    if (!config.public.googleClientId || config.public.googleClientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      error.value = 'Client ID Google non configuré ou invalide'
    }
  }
})
</script>
