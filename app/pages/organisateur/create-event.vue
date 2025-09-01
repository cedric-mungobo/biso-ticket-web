<template>
  <OrganizerNavigation 
    page-title="Créer un événement"
    :custom-actions="[
      {
        label: 'Aperçu',
        icon: 'Eye',
        action: () => previewEvent(),
        variant: 'secondary'
      },
      {
        label: 'Sauvegarder',
        icon: 'Save',
        action: () => saveDraft(),
        variant: 'primary'
      }
    ]"
  >
    <div class="md:p-8 p-2">
      <!-- En-tête de la page -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Créer un événement
        </h1>
        <p class="text-lg text-gray-600">
          Créez et configurez un nouvel événement
        </p>
      </div>

      <!-- Formulaire de création -->
      <div class="max-w-4xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Message d'erreur général -->
          <div v-if="formErrors.general || apiError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-red-800 font-medium">
                {{ formErrors.general || apiError }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom de l'événement -->
            <div>
              <FormInput
                v-model="formData.name"
                label="Nom de l'événement"
                id="name"
                type="text"
                required
                :error="formErrors.name"
                placeholder="Ex: Concert de Jazz"
              />
            </div>

            <!-- Catégorie -->
            <div>
              <FormInput
                v-model="formData.category"
                label="Catégorie"
                id="category"
                type="text"
                required
                :error="formErrors.category"
                placeholder="Ex: Musique, Sport, Culture"
              />
            </div>

            <!-- Date et heure -->
            <div>
              <FormInput
                v-model="formData.date_time"
                label="Date et heure"
                id="date_time"
                type="datetime-local"
                required
                :error="formErrors.date_time"
              />
            </div>

            <!-- Lieu -->
            <div>
              <FormInput
                v-model="formData.location"
                label="Lieu"
                id="location"
                type="text"
                required
                :error="formErrors.location"
                placeholder="Ex: Salle des fêtes, Stade, Théâtre"
              />
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <FormTextarea
                v-model="formData.description"
                label="Description"
                id="description"
                required
                :error="formErrors.description"
                placeholder="Décrivez votre événement en détail..."
                :rows="4"
              />
            </div>

            <!-- Image -->
            <div class="md:col-span-2">
              <FormFile
                v-model="formData.image"
                label="Image de l'événement"
                id="image"
                accept="image/*"
                :max-size="5 * 1024 * 1024"
                help-text="Formats acceptés: JPG, PNG, GIF. Taille max: 5 MB"
              />
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <!-- Test rapide de l'API -->
            <button
              type="button"
              @click="runQuickAPITest"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🚀 Test Rapide API
            </button>
            
            <!-- Bouton de diagnostic API -->
            <button
              type="button"
              @click="runAPIDiagnostic"
              :disabled="loading"
              class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🔍 Diagnostiquer l'API
            </button>
            
            <NuxtLink
              to="/organisateur"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
              <span v-else>Créer l'événement</span>
            </button>
          </div>

          <!-- Résultats du diagnostic API -->
          <div v-if="diagnosticResult" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-lg font-medium text-blue-900 mb-3">🔍 Résultats du diagnostic API</h3>
            <div class="space-y-3">
              <p class="text-blue-800 font-medium">{{ diagnosticResult.summary }}</p>
              
              <div v-if="diagnosticResult.details?.length" class="space-y-2">
                <h4 class="font-medium text-blue-700">Détails des tests :</h4>
                <div class="space-y-2">
                  <div v-for="(detail, index) in diagnosticResult.details" :key="index" class="pl-4 border-l-2 border-blue-300">
                    <p class="font-medium text-blue-700">{{ detail.test }}</p>
                    <p class="text-blue-600">{{ detail.result.message }}</p>
                    <details v-if="detail.result.details" class="mt-1">
                      <summary class="cursor-pointer text-sm text-blue-500 hover:text-blue-700">Voir les détails</summary>
                      <pre class="mt-2 text-xs text-blue-600 bg-blue-100 p-2 rounded overflow-auto">{{ JSON.stringify(detail.result.details, null, 2) }}</pre>
                    </details>
                  </div>
                </div>
              </div>
              
              <div v-if="diagnosticResult.recommendations?.length" class="mt-4">
                <h4 class="font-medium text-blue-700">Recommandations :</h4>
                <ul class="list-disc list-inside text-blue-600 space-y-1 mt-2">
                  <li v-for="(rec, index) in diagnosticResult.recommendations" :key="index">{{ rec }}</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

// Composables
const { createEvent, error: apiError, loading: apiLoading } = useOrganizerEvents()

// Utilitaires de test API
const { validateEventDataFormat, diagnoseAPI, quickAPITest } = await import('~/utils/apiTest')

// État du formulaire
const formData = ref({
  name: '',
  description: '',
  date_time: '',
  location: '',
  category: '',
  image: null as File | null
})

const loading = ref(false)
const formErrors = ref<Record<string, string>>({})
const diagnosticResult = ref<any>(null)

// Validation côté client
const validateForm = (): boolean => {
  formErrors.value = {}
  
  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Le nom de l\'événement est requis'
  }
  
  if (!formData.value.description.trim()) {
    formErrors.value.description = 'La description est requise'
  }
  
  if (!formData.value.date_time) {
    formErrors.value.date_time = 'La date et heure sont requises'
  } else {
    const selectedDate = new Date(formData.value.date_time)
    const now = new Date()
    if (selectedDate <= now) {
      formErrors.value.date_time = 'La date doit être dans le futur'
    }
  }
  
  if (!formData.value.location.trim()) {
    formErrors.value.location = 'Le lieu est requis'
  }
  
  if (!formData.value.category.trim()) {
    formErrors.value.category = 'La catégorie est requise'
  }
  
  return Object.keys(formErrors.value).length === 0
}

// Validation du format des données selon l'API
const validateDataFormat = (): boolean => {
  const validation = validateEventDataFormat(formData.value)
  
  if (!validation.valid) {
    console.error('❌ Erreurs de format des données:', validation.errors)
    validation.errors.forEach(error => {
      if (error.includes('Format de date corrigé:')) {
        formErrors.value.date_time = `Format de date incorrect. Utilisez: ${error.split(': ')[1]}`
      } else {
        formErrors.value.general = error
      }
    })
    return false
  }
  
  return true
}

// Diagnostic de l'API
const runAPIDiagnostic = async () => {
  try {
    diagnosticResult.value = null
    console.log('🔍 Démarrage du diagnostic API...')
    
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('auth_token')
    
    const result = await diagnoseAPI(token || undefined)
    diagnosticResult.value = result
    
    console.log('📊 Résultat du diagnostic:', result)
  } catch (error) {
    console.error('💥 Erreur lors du diagnostic:', error)
    diagnosticResult.value = {
      summary: 'Erreur lors du diagnostic',
      details: [],
      recommendations: ['Vérifiez la console pour plus de détails']
    }
  }
}

// Test rapide de l'API
const runQuickAPITest = async () => {
  try {
    console.log('🚀 Test rapide de l\'API...')
    const result = await quickAPITest()
    console.log('📊 Résultat du test rapide:', result)
    
    // Afficher le résultat dans l'interface
    if (result.success) {
      formErrors.value.general = `✅ ${result.message}`
      // Effacer l'erreur après 5 secondes
      setTimeout(() => {
        if (formErrors.value.general === `✅ ${result.message}`) {
          formErrors.value.general = ''
        }
      }, 5000)
    } else {
      formErrors.value.general = `❌ ${result.message}`
    }
  } catch (error) {
    console.error('💥 Erreur lors du test rapide:', error)
    formErrors.value.general = 'Erreur lors du test rapide de l\'API'
  }
}

// Gestion de la soumission
const handleSubmit = async () => {
  // Validation côté client
  if (!validateForm()) {
    console.error('❌ Erreurs de validation côté client:', formErrors.value)
    return
  }
  
  // Validation du format des données selon l'API
  if (!validateDataFormat()) {
    console.error('❌ Erreurs de format des données:', formErrors.value)
    return
  }
  
  loading.value = true
  
  try {
    console.log('📝 Données du formulaire avant envoi:', formData.value)
    
    // Mapper les champs UI -> API (doc: title, starts_at, ends_at?, status, is_public, settings, image)
    const startsAtIso = new Date(formData.value.date_time).toISOString()
    const apiBody: any = {
      title: formData.value.name.trim(),
      location: formData.value.location.trim(),
      starts_at: startsAtIso,
      status: 'draft',
      is_public: true,
      settings: {
        tags: formData.value.category ? [formData.value.category.trim()] : []
      }
    }
    const imageFile = formData.value.image || undefined
    
    console.log('🚀 Données préparées pour l\'API:', { apiBody, hasImage: Boolean(imageFile) })
    
    const event = await createEvent(apiBody, imageFile || undefined)
    if (event) {
      console.log('✅ Événement créé avec succès, redirection...')
      // Rediriger vers la page de l'événement créé
      await navigateTo(`/organisateur/events/${event.id}`)
    } else {
      console.error('❌ Échec de la création de l\'événement')
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la création:', error)
    
    // Afficher l'erreur dans l'interface
    if (error.message) {
      if (error.message.includes('422')) {
        formErrors.value.general = 'Erreur de validation: Veuillez vérifier les informations saisies'
      } else if (error.message.includes('401')) {
        formErrors.value.general = 'Session expirée. Veuillez vous reconnecter'
      } else if (error.message.includes('403')) {
        formErrors.value.general = 'Accès refusé. Vous n\'avez pas les permissions nécessaires'
      } else if (error.message.includes('validation')) {
        formErrors.value.general = error.message
      } else {
        formErrors.value.general = error.message
      }
    } else {
      formErrors.value.general = 'Erreur inattendue lors de la création de l\'événement'
    }
  } finally {
    loading.value = false
  }
}

// Actions personnalisées
const previewEvent = () => {
  console.log('Aperçu de l\'événement:', formData.value)
  // Logique pour l'aperçu
}

const saveDraft = () => {
  console.log('Sauvegarde du brouillon:', formData.value)
  // Logique pour sauvegarder le brouillon
}
</script>
