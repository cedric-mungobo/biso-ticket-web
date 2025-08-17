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
        <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom de l'événement -->
            <div class="md:col-span-2">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'événement *
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Soirée d'entreprise 2024"
              />
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Décrivez votre événement..."
              ></textarea>
            </div>

            <!-- Date et heure -->
            <div>
              <label for="date_time" class="block text-sm font-medium text-gray-700 mb-2">
                Date et heure *
              </label>
              <input
                id="date_time"
                v-model="formData.date_time"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- Lieu -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                id="location"
                v-model="formData.location"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Salle des fêtes, Paris"
              />
            </div>

            <!-- Catégorie -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                id="category"
                v-model="formData.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="business">Événement d'entreprise</option>
                <option value="wedding">Mariage</option>
                <option value="birthday">Anniversaire</option>
                <option value="conference">Conférence</option>
                <option value="concert">Concert</option>
                <option value="exhibition">Exposition</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <!-- Image -->
            <div>
              <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
                Image de l'événement
              </label>
              <input
                id="image"
                v-model="formData.image"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
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
const { createEvent } = useOrganizerEvents()

// État du formulaire
const formData = ref({
  name: '',
  description: '',
  date_time: '',
  location: '',
  category: '',
  image: ''
})

const loading = ref(false)

// Gestion de la soumission
const handleSubmit = async () => {
  loading.value = true
  
  try {
    const event = await createEvent(formData.value)
    if (event) {
      // Rediriger vers la page de l'événement créé
      await navigateTo(`/organisateur/events/${event.id}`)
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
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
