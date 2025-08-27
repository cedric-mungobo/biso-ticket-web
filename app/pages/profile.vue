<template>
    <div>
      <div class="pt-24">
        <div class="max-w-5xl mx-auto px-4">
          <!-- En-tête du profil -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-neutral-900">Mon Profil</h1>
            <p class="text-neutral-600 mt-2">Gérez vos informations personnelles et vos événements</p>
            
          
          </div>
  
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Section gauche : Informations du profil -->
            <div class="w-full md:w-1/3">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <!-- Avatar -->
                <div class="flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4">
                  <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <!-- Nom de l'utilisateur -->
                <h3 class="text-xl font-semibold text-neutral-900 text-center mb-2">
                  <span v-if="loading" class="inline-block w-32 h-6 bg-gray-200 rounded animate-pulse"></span>
                  <span v-else>{{ userData?.name || 'Utilisateur' }}</span>
                </h3>
                
                <!-- Statut -->
                <div class="text-center">
                  <span v-if="loading" class="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse"></span>
                  <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Section droite : Détails du profil -->
            <div class="w-full md:w-2/3">
              <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-neutral-900 mb-6">Informations personnelles</h2>
                
                <!-- État de chargement -->
                <div v-if="loading" class="space-y-4">
                  <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div class="flex-1">
                      <div class="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div class="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Informations chargées -->
                <div v-else class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Nom complet:</span>
                      <span class="text-neutral-600 ml-2">{{ userData?.name || 'Non renseigné' }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Email:</span>
                      <span class="text-neutral-600 ml-2">{{ userData?.email || 'Non renseigné' }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Téléphone:</span>
                      <span class="text-neutral-600 ml-2">{{ userData?.phone_number || 'Non renseigné' }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Rôle:</span>
                      <span class="text-neutral-600 ml-2">{{ userData?.role || 'Utilisateur' }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Bouton de modification -->
                <div class="mt-6">
                  <button class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier le profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'

  definePageMeta({
    middleware: 'authenticated'

  })
  
  // Composables
  const { user, token, isAuthenticated, fetchUserProfile } = useAuth()
  
  // État local
  const userData = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Debug de l'état d'authentification
  const debugAuth = () => {
    console.log('🔍 DEBUG AUTHENTIFICATION:')
    console.log('user.value:', user.value)
    console.log('token.value:', token.value)
    console.log('isAuthenticated.value:', isAuthenticated.value)
    console.log('localStorage auth_token:', process.client ? localStorage.getItem('auth_token') : 'N/A')
    console.log('localStorage auth_user:', process.client ? localStorage.getItem('auth_user') : 'N/A')
  }
  
  // Interface pour l'utilisateur selon l'API
  interface User {
    id: number
    name: string
    email: string
    phone_number: string
    role: string
    created_at: string
    updated_at: string
  }
  
  // Fonction pour charger le profil utilisateur
  const loadUserProfile = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Debug de l'état d'authentification
      debugAuth()
      
      // Vérifier si l'utilisateur est connecté
      if (!isAuthenticated.value || !token.value) {
        console.warn('⚠️ Utilisateur non connecté ou token manquant')
        error.value = 'Utilisateur non connecté. Veuillez vous connecter.'
        return
      }
      
      console.log('🔑 Tentative de chargement du profil avec fetchUserProfile')
      
      // Utiliser la fonction existante de useAuth
      const profileData = await fetchUserProfile()
      userData.value = profileData
      
      console.log('✅ Profil utilisateur chargé:', userData.value)
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement du profil:', err)
      error.value = err.message || 'Erreur lors du chargement du profil'
    } finally {
      loading.value = false
    }
  }
  
  // Charger les données au montage
  onMounted(async () => {
    await loadUserProfile()
  })
</script>