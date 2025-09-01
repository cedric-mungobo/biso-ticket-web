<template>
  <div class="">
  <UForm :state="formData" @submit="handleSubmit" class="space-y-2">
    <!-- Message d'erreur général -->
    <UAlert
      v-if="formErrors.general"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      :title="formErrors.general"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Titre de l'événement -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'événement <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="formData.title"
          placeholder="Ex: Concert de Jazz"
          :error="formErrors.title"
          id="title"
          class="w-full"
          :ui="{ base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6' }"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <!-- Lieu -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
          Lieu de l'événement
        </label>
        <UInput
          v-model="formData.location"
          placeholder="Ex: Salle des fêtes, Stade, Théâtre"
          :error="formErrors.location"
          id="location"
          class="w-full"
          :ui="{ base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6' }"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <!-- Date et heure de début -->
      <div>
        <label for="starts_at" class="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de début <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="formData.starts_at"
          id="starts_at"
          class="w-full"
          type="datetime-local"
          :error="formErrors.starts_at"
          :ui="{ base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6' }"
        />
      </div>

      <!-- Date et heure de fin -->
      <div>
        <label for="ends_at" class="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de fin
        </label>
        <UInput
          v-model="formData.ends_at"
          type="datetime-local"
          :error="formErrors.ends_at"
          id="ends_at"
          class="w-full"
          :ui="{ base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6' }"
        />
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <UTextarea
          v-model="formData.description"
          placeholder="Décrivez votre événement en détail..."
          :rows="4"
          :error="formErrors.description"
          id="description"
          class="w-full"
          :ui="{ base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none' }"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
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
          :ui="{ 
            base: 'relative disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none block w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6'
          }"
        />
        <p v-if="formErrors.categories" class="mt-1 text-sm text-red-600">{{ formErrors.categories }}</p>
      </div>

      <!-- Statut -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <select
          v-model="formData.status"
          id="status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 relative disabled:cursor-not-allowed disabled:opacity-75"
          :class="{ 'border-red-500': formErrors.status }"
          autocomplete="off"
        >
          <option value="draft">Brouillon</option>
          <option value="active">Actif</option>
          <option value="ended">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="suspended">Suspendu</option>
        </select>
        <p v-if="formErrors.status" class="mt-1 text-sm text-red-600">{{ formErrors.status }}</p>
      </div>

      <!-- Options d'événement -->
      <div class="md:col-span-2 space-y-4">
        <!-- Événement public -->
        <div class="flex items-center gap-2">
          <UCheckbox
            v-model="formData.is_public"
            id="is_public"
          />
          <label for="is_public" class="text-sm font-medium text-gray-700">
            Événement public
          </label>
        </div>

        <!-- Scan QR activé -->
        <div class="flex items-center gap-2">
          <UCheckbox
            v-model="formData.settings!.scan_enabled"
            id="scan_enabled"
          />
          <label for="scan_enabled" class="text-sm font-medium text-gray-700">
            Activer le scan QR pour l'accès
          </label>
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
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 relative disabled:cursor-not-allowed disabled:opacity-75"
          autocomplete="off"
        />
        <p class="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF. Taille max: 5 MB</p>
        <p v-if="formErrors.image" class="mt-1 text-sm text-red-600">{{ formErrors.image }}</p>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
      <UButton
        variant="ghost"
        color="neutral"
        @click="handleCancel"
      >
        Annuler
      </UButton>
      <UButton
        type="submit"
        :loading="submitting"
        color="primary"
      >
        {{ isEditMode ? 'Mettre à jour' : 'Créer l\'événement' }}
      </UButton>
    </div>
  </UForm>
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
/* Optimisations pour mobile */
@media (max-width: 768px) {
  /* Améliorer la réactivité des inputs sur mobile */
  :deep(.ui-input input),
  :deep(.ui-textarea textarea),
  :deep(.ui-select select) {
    touch-action: manipulation;
    -webkit-user-select: text;
    user-select: text;
    -webkit-tap-highlight-color: transparent;
    font-size: 16px; /* Évite le zoom automatique sur iOS */
  }
  
  /* Améliorer l'accessibilité des labels */
  label {
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
  }
  
  /* Optimiser les boutons pour le touch */
  :deep(.ui-button) {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px; /* Taille minimale recommandée pour le touch */
  }
  
  /* Améliorer l'espacement des inputs */
  .grid > div {
    margin-bottom: 1rem;
  }
  
  /* Optimiser les modals sur mobile */
  :deep(.ui-modal) {
    padding: 1rem;
  }
}

/* Styles globaux pour les inputs */
:deep(.ui-input),
:deep(.ui-textarea),
:deep(.ui-select) {
  position: relative;
  z-index: 1;
}

/* Améliorer le focus sur mobile */
:deep(.ui-input input:focus),
:deep(.ui-textarea textarea:focus),
:deep(.ui-select select:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(147, 58, 255, 0.2);
}

/* Prévenir les problèmes de z-index avec les overlays */
.relative {
  position: relative;
  z-index: 1;
}
</style>