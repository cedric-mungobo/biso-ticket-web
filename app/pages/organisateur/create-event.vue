<template>
  <OrganizerNavigation>
    <div class="md:p-4 p-2 max-w-4xl mx-auto">
      <!-- En-tête de la page -->
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Créer un événement
        </h1>
        <p class="text-lg text-gray-600">
          Créez et configurez un nouvel événement
        </p>
      </div>

      <!-- Formulaire de création -->
      <div class="bg-white rounded-2xl shadow-md md:p-8 p-4 border border-gray-200 relative">
        <!-- Overlay de loading -->
        <LoadingOverlay
          :show="loading"
          title="Création de l'événement..."
          description="Veuillez patienter"
          color="primary"
          :size="48"
        />

        <form class="space-y-6" @submit.prevent="submitForm">
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              id="title"
              type="text"
              v-model="formData.title"
              required
              placeholder="Ex: Concert de Jazz"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <!-- Lieu -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Lieu</label>
            <input
              id="location"
              type="text"
              v-model="formData.location"
              placeholder="Ex: Kinshasa, Salle des fêtes"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Description de l'événement"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Début -->
            <div>
              <label for="starts_at" class="block text-sm font-medium text-gray-700">Date/heure de début</label>
              <input
                id="starts_at"
                type="datetime-local"
                v-model="formData.starts_at"
                required
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <!-- Fin -->
            <div>
              <label for="ends_at" class="block text-sm font-medium text-gray-700">Date/heure de fin (optionnel)</label>
              <input
                id="ends_at"
                type="datetime-local"
                v-model="formData.ends_at"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Statut -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
              <select
                id="status"
                v-model="formData.status"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="ended">Terminé</option>
                <option value="cancelled">Annulé</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>

            <!-- Public -->
            <div class="flex items-center gap-3 mt-6">
              <input id="is_public" type="checkbox" v-model="formData.is_public" class="rounded border border-gray-300 text-primary-600 focus:ring-primary-500" />
              <label for="is_public" class="text-sm text-gray-700">Rendre l'événement public</label>
            </div>
          </div>

          <!-- Scan activé -->
          <div class="flex items-center gap-3">
            <input id="scan_enabled" type="checkbox" v-model="formData.settings.scan_enabled" class="rounded border border-gray-300 text-primary-600 focus:ring-primary-500" />
            <label for="scan_enabled" class="text-sm text-gray-700">Activer le scan à l'entrée</label>
          </div>

          <!-- Catégories prédéfinies (presets) -->
          <div>
            <label for="presetCategories" class="block text-sm font-medium text-gray-700">Catégories prédéfinies</label>
            <div class="mt-2">
              <div v-if="presetLoading" class="text-sm text-gray-500">Chargement des catégories…</div>
              <div v-else-if="presetCategories.length === 0" class="text-sm text-gray-500">Aucune catégorie prédéfinie</div>
              <select
                v-else
                id="presetCategories"
                multiple
                size="6"
                v-model="formData.settings.categories"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
              >
                <option v-for="cat in presetCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Astuce: Maintenez Cmd/Ctrl pour sélectionner plusieurs catégories.</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
              <input
                id="tags"
                type="text"
                v-model="tagsText"
                placeholder="ex: music, live, 2025"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- Image -->
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">Image de couverture (≤ 5MB)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" :disabled="loading" class="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50">
              <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
              Créer l'événement
            </button>
            <button type="button" @click="handleCancel" :disabled="loading" class="inline-flex items-center rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Annuler
            </button>
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
const { createEvent, fetchEventCategories } = useOrganizerEvents()
const router = useRouter()
const toast = useToast()
const { isLoading, withLoading, preventMultipleSubmissions } = useLoading()

// État du formulaire selon la documentation API
const formData = reactive({
  title: '',
  location: '',
  description: '',
  starts_at: '',
  ends_at: '',
  status: 'draft' as const,
  is_public: true,
  image: null as File | null,
  settings: {
    scan_enabled: true,
    tags: [] as string[],
    categories: [] as string[]
  }
})

// Champs texte pour tags & catégories
const tagsText = ref('')
// plus de champ texte catégories; tout passe par le multi-select

// Presets de catégories
const presetCategories = ref<string[]>([])
const presetLoading = ref(false)

onMounted(async () => {
  try {
    presetLoading.value = true
    presetCategories.value = await fetchEventCategories()
  } finally {
    presetLoading.value = false
  }
})

// Utilisation du loading du composable
const loading = isLoading

// Gestion de la soumission avec protection contre les envois multiples
const handleSubmit = preventMultipleSubmissions(async (data: any) => {
  await withLoading(async () => {
    // Préparer les données selon la documentation API
    const apiBody: any = {
      title: data.title,
      location: data.location,
      starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : undefined,
      ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : undefined,
      description: data.description,
      status: data.status,
      is_public: data.is_public,
      settings: {
        scan_enabled: data.settings?.scan_enabled,
        tags: data.settings?.tags || [],
        categories: data.settings?.categories || []
      }
    }
    
    console.log('Création de l\'événement en cours...', apiBody)
    console.log('Description:', data.description)
    console.log('Image reçue:', data.image ? `${data.image.name} (${data.image.size} bytes)` : 'Aucune image')
    const event = await createEvent(apiBody, data.image)
    
    if (event) {
      console.log('Événement créé avec succès:', event)
      useAppToast().showSuccess('Succès', 'L\'événement a été créé avec succès')
      await router.push(`/organisateur/events/${event.id}`)
    }
  }, 'Création de l\'événement...').catch((error: any) => {
    console.error('Erreur lors de la création:', error)
    // Les toasts d'erreur sont maintenant gérés automatiquement par myFetch
  })
})

// Soumission via formulaire natif
const submitForm = () => {
  formData.settings.tags = tagsText.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
  // Catégories: uniquement depuis le multi-select
  const preselected = Array.isArray(formData.settings.categories) ? formData.settings.categories : []
  formData.settings.categories = Array.from(new Set(preselected))
  handleSubmit(formData)
}

// Gestion du fichier image
const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] || null
  formData.image = file
}

// Gestion de l'annulation
const handleCancel = () => {
  router.push('/organisateur')
}
</script>
