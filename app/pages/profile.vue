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
                  {{ userData?.name || 'Utilisateur' }}
                </h3>
                
                <!-- Statut -->
                <div class="text-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Section droite : Détails du profil -->
            <div class="w-full md:w-2/3">
              <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-neutral-900 mb-6">Informations personnelles</h2>
                
                <div class="space-y-4">
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
                      <span class="text-neutral-600 ml-2">{{ userData?.phone || 'Non renseigné' }}</span>
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
  
          <!-- Section des événements -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-neutral-900">Mes événements</h3>
              <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer un événement
              </button>
            </div>
            
            <!-- État de chargement -->
            <div v-if="loading" class="text-center py-12">
              <div class="inline-flex items-center px-4 py-2 text-sm text-neutral-600">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement des événements...
              </div>
            </div>
            
            <!-- État d'erreur -->
            <div v-else-if="error" class="text-center py-12">
              <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h4>
                <p class="text-red-600 mb-4">{{ error }}</p>
                <button @click="loadUserEvents" class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                  Réessayer
                </button>
              </div>
            </div>
            
            <!-- Liste des événements -->
            <div v-else-if="userEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="event in userEvents" :key="event.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <!-- Image de l'événement -->
                <div v-if="event.image" class="h-48 bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <img 
                    :src="`https://api.bisoticket.com/storage/${event.image}`" 
                    :alt="event.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-else class="h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                  <svg class="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                </div>
                
                <!-- Contenu de l'événement -->
                <div class="p-6">
                  <h4 class="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">{{ event.name }}</h4>
                  <p v-if="event.description" class="text-sm text-neutral-600 mb-4 line-clamp-2">{{ event.description }}</p>
                  
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-sm text-neutral-600">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ formatDate(event.date_time || event.date) }}</span>
                    </div>
                    
                    <div v-if="event.location" class="flex items-center gap-2 text-sm text-neutral-600">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="line-clamp-1">{{ event.location }}</span>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="mt-4 flex items-center gap-2">
                    <button class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir
                    </button>
                    
                    <button class="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- État vide -->
            <div v-else class="text-center py-12">
              <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <svg class="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
                <h4 class="text-lg font-medium text-neutral-800 mb-2">Aucun événement créé</h4>
                <p class="text-neutral-600 mb-4">Vous n'avez pas encore créé d'événements. Commencez par en créer un !</p>
                <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Créer votre premier événement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  // Composables
  const { user, fetchUserProfile } = useAuth()
  
  // État local
  const userData = ref<any>(null)
  const userEvents = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Fonction pour charger le profil utilisateur
  const loadUserProfile = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Récupérer le profil depuis l'API
      const profileData = await fetchUserProfile()
      userData.value = profileData
      
      console.log('✅ Profil utilisateur chargé:', profileData)
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement du profil:', err)
      error.value = err.message || 'Erreur lors du chargement du profil'
    } finally {
      loading.value = false
    }
  }
  
  // Fonction pour charger les événements de l'utilisateur
  const loadUserEvents = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Pour l'instant, on utilise des données factices
      // TODO: Implémenter l'API pour récupérer les événements de l'utilisateur
      userEvents.value = [
        {
          id: 1,
          name: 'Concert Jazz en plein air',
          description: 'Une soirée exceptionnelle avec les meilleurs musiciens de jazz de la région.',
          date_time: '2024-06-15T19:00:00',
          location: 'Parc Central, Kinshasa',
          image: null
        },
        {
          id: 2,
          name: 'Festival de danse traditionnelle',
          description: 'Découvrez la richesse culturelle à travers la danse traditionnelle.',
          date_time: '2024-07-20T18:00:00',
          location: 'Centre Culturel, Kinshasa',
          image: null
        }
      ]
      
      console.log('✅ Événements utilisateur chargés:', userEvents.value)
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement des événements:', err)
      error.value = err.message || 'Erreur lors du chargement des événements'
    } finally {
      loading.value = false
    }
  }
  
  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      console.error('Erreur lors du formatage de la date:', e)
      return 'Date non définie'
    }
  }
</script>