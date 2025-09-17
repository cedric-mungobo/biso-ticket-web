<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">🔍 Diagnostic Google OAuth</h3>
    
    <div class="space-y-4">
      <!-- Test de connectivité API -->
      <div>
        <h4 class="font-medium mb-2">Test de connectivité API</h4>
        <UButton 
          @click="testApiConnectivity" 
          :loading="testingApi"
          size="sm"
          color="primary"
        >
          Tester la connexion API
        </UButton>
        <div v-if="apiTestResult" class="mt-2 p-2 rounded text-sm" :class="apiTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ apiTestResult.message }}
        </div>
      </div>

      <!-- Test de l'endpoint Google Auth -->
      <div>
        <h4 class="font-medium mb-2">Test endpoint Google Auth</h4>
        <UButton 
          @click="testGoogleAuthEndpoint" 
          :loading="testingGoogle"
          size="sm"
          color="primary"
        >
          Tester /auth/google
        </UButton>
        <div v-if="googleTestResult" class="mt-2 p-2 rounded text-sm" :class="googleTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ googleTestResult.message }}
        </div>
      </div>

      <!-- Informations de configuration -->
      <div>
        <h4 class="font-medium mb-2">Configuration actuelle</h4>
        <div class="text-sm space-y-1">
          <div><strong>API Base URL:</strong> {{ config.public.apiBaseUrl }}</div>
          <div><strong>Site URL:</strong> {{ config.public.siteUrl }}</div>
          <div><strong>State Cookie:</strong> {{ stateCookie || 'Non défini' }}</div>
        </div>
      </div>

      <!-- Logs de debug -->
      <div v-if="debugLogs.length > 0">
        <h4 class="font-medium mb-2">Logs de debug</h4>
        <div class="bg-black text-green-400 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
          <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { $myFetch } = useNuxtApp()
const toast = useToast()

// State
const testingApi = ref(false)
const testingGoogle = ref(false)
const apiTestResult = ref<{ success: boolean; message: string } | null>(null)
const googleTestResult = ref<{ success: boolean; message: string } | null>(null)
const debugLogs = ref<string[]>([])

// Cookie state
const stateCookie = useCookie('google_oauth_state').value

// Fonction pour ajouter des logs
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.push(`[${timestamp}] ${message}`)
  if (debugLogs.value.length > 20) {
    debugLogs.value.shift()
  }
}

// Test de connectivité API
const testApiConnectivity = async () => {
  testingApi.value = true
  apiTestResult.value = null
  addLog('Test de connectivité API...')
  
  try {
    const response = await $myFetch<any>('/health')
    addLog(`API Health: ${JSON.stringify(response)}`)
    apiTestResult.value = {
      success: true,
      message: `API accessible - Status: ${response.status || 'OK'}`
    }
  } catch (error: any) {
    addLog(`Erreur API: ${error.message}`)
    apiTestResult.value = {
      success: false,
      message: `Erreur: ${error.message}`
    }
  } finally {
    testingApi.value = false
  }
}

// Test de l'endpoint Google Auth
const testGoogleAuthEndpoint = async () => {
  testingGoogle.value = true
  googleTestResult.value = null
  addLog('Test endpoint /auth/google...')
  
  try {
    const response = await $myFetch<any>('/auth/google')
    addLog(`Google Auth Response: ${JSON.stringify(response)}`)
    googleTestResult.value = {
      success: true,
      message: `Endpoint accessible - Status: ${response.status}`
    }
  } catch (error: any) {
    addLog(`Erreur Google Auth: ${error.message}`)
    googleTestResult.value = {
      success: false,
      message: `Erreur: ${error.message}`
    }
  } finally {
    testingGoogle.value = false
  }
}

// Initialisation
onMounted(() => {
  addLog('Composant de diagnostic initialisé')
})
</script>
