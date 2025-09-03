<template>
  <div class="">
  <UForm :state="formData" @submit="handleSubmit" class="space-y-4">
    <!-- Message d'erreur général -->
    <UAlert
      v-if="formErrors.general"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      :title="formErrors.general"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    <div class="flex flex-col sm:flex-row gap-3 sm:justify-end mt-8 pt-6 border-t border-gray-200">
      <UButton
        variant="ghost"
        color="neutral"
        @click="handleCancel"
        class="w-full sm:w-auto"
      >
        Annuler
      </UButton>
      <UButton
        type="submit"
        :loading="submitting"
        color="primary"
        class="w-full sm:w-auto"
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
  :deep(input),
  :deep(textarea),
  :deep(select) {
    font-size: 16px; /* Évite le zoom automatique sur iOS */
    touch-action: manipulation;
  }
  
  /* Améliorer l'accessibilité des labels */
  label {
    touch-action: manipulation;
  }
  
  /* Optimiser les boutons pour le touch */
  :deep(.ui-button) {
    min-height: 44px; /* Taille minimale recommandée pour le touch */
  }
}
</style>