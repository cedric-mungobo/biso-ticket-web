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

        <EventForm
          v-model="formData"
          :submitting="loading"
          :is-edit-mode="false"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </OrganizerNavigation>
</template>

<script lang="ts" setup>
// Définition de la page
definePageMeta({
  middleware: 'authenticated'
})

// Import explicite du composant
import EventForm from '~/components/organizer/forms/EventForm.vue'

// Composables
const { createEvent, error: apiError } = useOrganizerEvents()
const router = useRouter()
const toast = useToast()
const { isLoading, withLoading, preventMultipleSubmissions } = useLoading()

// État du formulaire selon la documentation API
const formData = ref({
  title: '',
  starts_at: '',
  status: 'draft' as const,
  is_public: true,
  settings: {
    scan_enabled: true,
    tags: [] as string[],
    categories: [] as string[]
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
    console.log('Image reçue:', data.image ? `${data.image.name} (${data.image.size} bytes)` : 'Aucune image')
    const event = await createEvent(apiBody, data.image)
    
    if (event) {
      console.log('Événement créé avec succès:', event)
      toast.add({
        title: 'Succès',
        description: 'L\'événement a été créé avec succès',
        color: 'success'
      })
      await router.push(`/organisateur/events/${event.id}`)
    }
  }, 'Création de l\'événement...').catch((error: any) => {
    console.error('Erreur lors de la création:', error)
    // Les toasts d'erreur sont maintenant gérés automatiquement par myFetch
  })
})

// Gestion de l'annulation
const handleCancel = () => {
  router.push('/organisateur')
}
</script>
