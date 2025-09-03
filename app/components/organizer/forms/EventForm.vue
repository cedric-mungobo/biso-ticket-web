<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Message d'erreur général -->
      <div v-if="formErrors.general" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ formErrors.general }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Titre de l'événement -->
        <FormInput
          v-model="formData.title"
          label="Titre de l'événement"
          placeholder="Ex: Concert de Jazz"
          :error="formErrors.title"
          id="title"
          required
        />

        <!-- Lieu -->
        <FormInput
          v-model="locationValue"
          label="Lieu de l'événement"
          placeholder="Ex: Salle des fêtes, Stade, Théâtre"
          :error="formErrors.location"
          id="location"
        />

        <!-- Date et heure de début -->
        <FormInput
          v-model="formData.starts_at"
          label="Date et heure de début"
          type="datetime-local"
          :error="formErrors.starts_at"
          id="starts_at"
          required
        />

        <!-- Date et heure de fin -->
        <FormInput
          v-model="endsAtValue"
          label="Date et heure de fin"
          type="datetime-local"
          :error="formErrors.ends_at"
          id="ends_at"
        />

        <!-- Description -->
        <div class="md:col-span-2">
          <FormTextarea
            v-model="descriptionValue"
            label="Description"
            placeholder="Décrivez votre événement en détail..."
            :rows="4"
            :error="formErrors.description"
            id="description"
          />
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <UInputTags
            v-model="formData.settings!.tags"
            placeholder="Ajouter un tag et appuyer Entrée"
            :max="10"
            id="tags"
            class="w-full"
          />
        </div>

        <!-- Catégories -->
        <div>
          <label for="categories" class="block text-sm font-medium text-gray-700 mb-2">
            Catégories
          </label>
          <USelect
            v-model="formData.settings!.categories"
            :items="presetsCategories"
            multiple
            id="categories"
            class="w-full"
            :error="formErrors.categories"
          />
          <p v-if="formErrors.categories" class="mt-1 text-sm text-red-600">{{ formErrors.categories }}</p>
        </div>

        <!-- Statut -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <USelect
            v-model="formData.status"
            :items="[
              { label: 'Brouillon', value: 'draft' },
              { label: 'Actif', value: 'active' },
              { label: 'Terminé', value: 'ended' },
              { label: 'Annulé', value: 'cancelled' },
              { label: 'Suspendu', value: 'suspended' }
            ]"
            id="status"
            class="w-full"
            :error="formErrors.status"
          />
        </div>

        <!-- Options d'événement -->
        <div class="md:col-span-2 space-y-4">
          <!-- Événement public -->
          <div class="flex items-center gap-3">
            <input
              v-model="formData.is_public"
              type="checkbox"
              id="is_public"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="is_public" class="text-sm font-medium text-gray-700">
              Événement public
            </label>
          </div>

          <!-- Scan QR activé -->
          <div class="flex items-center gap-3">
            <input
              v-model="formData.settings!.scan_enabled"
              type="checkbox"
              id="scan_enabled"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="scan_enabled" class="text-sm font-medium text-gray-700">
              Activer le scan QR pour l'accès
            </label>
          </div>
        </div>
      </div>



      <!-- Image -->
      <div class="md:col-span-2">
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          Image de l'événement
        </label>
        <div v-if="currentImageUrl && !imageFiles.length" class="mb-4">
          <img 
            :src="currentImageUrl" 
            alt="Image actuelle" 
            class="h-32 w-full object-cover rounded-lg border"
          />
          <p class="text-xs text-gray-500 mt-1">Image actuelle</p>
        </div>
        
        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        <p class="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF. Taille max: 5 MB</p>
        <p v-if="formErrors.image" class="mt-1 text-sm text-red-600">{{ formErrors.image }}</p>
      </div>

      <!-- Boutons d'action -->
      <div class="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'En cours...' : (isEditMode ? 'Mettre à jour' : 'Créer l\'événement') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface EventFormData {
  title: string
  location?: string
  starts_at: string
  ends_at?: string
  description?: string
  status?: 'draft' | 'active' | 'ended' | 'cancelled' | 'suspended'
  is_public?: boolean
  settings?: {
    scan_enabled?: boolean
    tags?: string[]
    categories?: string[]
    default_invitation_template_id?: number
  }
}

interface Props {
  modelValue?: EventFormData
  submitting?: boolean
  isEditMode?: boolean
  currentImageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
  isEditMode: false,
  currentImageUrl: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: EventFormData]
  'submit': [data: EventFormData & { image?: File }]
  'cancel': []
}>()

// Composables
const { fetchEventCategories } = useOrganizerEvents()
const { initMobileOptimizations, isMobile } = useMobileOptimization()

// État du formulaire selon la documentation API
const formData = ref<EventFormData>({
  title: '',
  starts_at: '',
  status: 'draft',
  is_public: true,
  settings: {
    scan_enabled: true,
    tags: [],
    categories: []
  }
})

const formErrors = ref<Record<string, string>>({})
const imageFiles = ref<File[]>([])

const presetsCategories = ref<string[]>([])

// Computed properties pour gérer les valeurs undefined
const locationValue = computed({
  get: () => formData.value.location || '',
  set: (value: string) => {
    formData.value.location = value || undefined
  }
})

const endsAtValue = computed({
  get: () => formData.value.ends_at || '',
  set: (value: string) => {
    formData.value.ends_at = value || undefined
  }
})

const descriptionValue = computed({
  get: () => formData.value.description || '',
  set: (value: string) => {
    formData.value.description = value || undefined
  }
})

// Charger les catégories prédéfinies
const loadCategories = async () => {
  try {
    console.log('Chargement des catégories...')
    const categories = await fetchEventCategories()
    console.log('Catégories récupérées:', categories)
    presetsCategories.value = categories
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    presetsCategories.value = []
  }
}

// Gestion du changement d'image
const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Vérification que le fichier existe
    if (!file) {
      formErrors.value.image = 'Aucun fichier sélectionné'
      return
    }
    
    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      formErrors.value.image = 'L\'image ne doit pas dépasser 5 MB'
      return
    }
    
    // Validation du type
    if (!file.type.startsWith('image/')) {
      formErrors.value.image = 'Veuillez sélectionner un fichier image valide'
      return
    }
    
    // Effacer les erreurs précédentes
    delete formErrors.value.image
    imageFiles.value = [file]
  } else {
    imageFiles.value = []
  }
}

// Gestion de la soumission
const handleSubmit = () => {
  // Réinitialiser les erreurs
  formErrors.value = {}
  
  const submitData = {
    ...formData.value,
    image: imageFiles.value.length > 0 ? imageFiles.value[0] : undefined
  }
  
  emit('submit', submitData)
}

// Fonction simple pour afficher les erreurs backend
const displayBackendErrors = (error: any) => {
  formErrors.value = {}
  
  if (error?.message) {
    formErrors.value.general = error.message;
  } else {
    formErrors.value.general = 'Une erreur est survenue';
  }
}

// Exposer la fonction pour le parent
defineExpose({
  displayBackendErrors
})

// Gestion de l'annulation
const handleCancel = () => {
  emit('cancel')
}

// Mettre à jour le formulaire quand le modelValue parent change
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    formData.value = {
      title: newValue.title || '',
      location: newValue.location,
      starts_at: newValue.starts_at || '',
      ends_at: newValue.ends_at,
      description: newValue.description,
      status: newValue.status || 'draft',
      is_public: newValue.is_public ?? true,
      settings: {
        scan_enabled: newValue.settings?.scan_enabled,
        tags: newValue.settings?.tags || [],
        categories: newValue.settings?.categories || [],
        default_invitation_template_id: newValue.settings?.default_invitation_template_id
      }
    }
    
    // En mode édition, réinitialiser imageFiles
    if (props.isEditMode) {
      imageFiles.value = []
    }
  }
}, { immediate: true, deep: true })

// Émettre les changements vers le parent
watch(formData, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Charger les données au montage
onMounted(() => {
  loadCategories()
  
  // Initialiser les optimisations mobiles
  if (isMobile.value) {
    initMobileOptimizations()
  }
})
</script>

<style scoped>
/* Optimisations mobiles minimales */
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px; /* Évite le zoom automatique sur iOS */
    min-height: 44px;
  }
  
  button {
    min-height: 44px;
  }
  
  .grid {
    gap: 1rem;
  }
}
</style>