<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Nom du sponsor -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Nom du sponsor <span class="text-red-500">*</span>
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        @input="clearError('name'); emit('update:modelValue', form)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.name }"
        placeholder="Ex: Coca-Cola"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Logo -->
    <div>
      <label for="logo" class="block text-sm font-medium text-gray-700 mb-2">
        Logo du sponsor
      </label>
      <div class="flex items-center gap-4">
        <div v-if="logoPreview" class="flex-shrink-0">
          <img :src="logoPreview" alt="Aperçu du logo" class="w-16 h-16 object-contain border border-gray-300 rounded-lg" />
        </div>
        <div class="flex-1">
          <input
            id="logo"
            ref="logoInput"
            type="file"
            accept="image/*"
            @change="handleLogoChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p class="mt-1 text-xs text-gray-500">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
        </div>
      </div>
      <p v-if="errors.logo" class="mt-1 text-sm text-red-600">{{ errors.logo }}</p>
    </div>

    <!-- URL du site web -->
    <div>
      <label for="website_url" class="block text-sm font-medium text-gray-700 mb-2">
        Site web
      </label>
      <input
        id="website_url"
        v-model="form.website_url"
        type="url"
        @input="clearError('website_url'); emit('update:modelValue', form)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.website_url }"
        placeholder="https://www.example.com"
      />
      <p v-if="errors.website_url" class="mt-1 text-sm text-red-600">{{ errors.website_url }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        @input="clearError('description'); emit('update:modelValue', form)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.description }"
        placeholder="Description du sponsor..."
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <!-- Statut actif -->
    <div class="flex items-center">
      <input
        id="is_active"
        v-model="form.is_active"
        type="checkbox"
        @change="emit('update:modelValue', form)"
        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      <label for="is_active" class="ml-2 block text-sm text-gray-700">
        Sponsor actif
      </label>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <UButton
        type="button"
        variant="ghost"
        @click="$emit('cancel')"
        :disabled="submitting"
      >
        Annuler
      </UButton>
      <UButton
        type="submit"
        :loading="submitting"
        :disabled="submitting"
        color="primary"
      >
        {{ submitLabel }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Sponsor, SponsorFormData } from '~/types/sponsors'

interface Props {
  modelValue: SponsorFormData
  submitting?: boolean
  submitLabel?: string
}

interface Emits {
  (e: 'update:modelValue', value: SponsorFormData): void
  (e: 'submit', value: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
  submitLabel: 'Enregistrer'
})

const emit = defineEmits<Emits>()

const form = ref<SponsorFormData>({ ...props.modelValue })
const errors = ref<Record<string, string>>({})
const logoInput = ref<HTMLInputElement>()
const logoPreview = ref<string>('')

// Watcher pour synchroniser avec le modelValue
watch(() => props.modelValue, (newValue) => {
  form.value = { ...newValue }
  if (newValue.logo_url) {
    logoPreview.value = newValue.logo_url
  } else {
    logoPreview.value = ''
  }
}, { deep: true })

// Watcher pour émettre les changements - supprimé pour éviter la boucle infinie
// Les changements sont émis directement dans les @input des champs

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.logo = 'Le fichier est trop volumineux (max 5MB)'
      return
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      errors.value.logo = 'Veuillez sélectionner un fichier image'
      return
    }

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    clearError('logo')
  }
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom du sponsor est requis'
  }

  if (form.value.website_url && !isValidUrl(form.value.website_url)) {
    errors.value.website_url = 'Veuillez entrer une URL valide'
  }

  return Object.keys(errors.value).length === 0
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const resetForm = () => {
  form.value = { name: '', logo_url: '', website_url: '', description: '', is_active: true }
  logoPreview.value = ''
  if (logoInput.value) {
    logoInput.value.value = ''
  }
  errors.value = {}
}

const handleSubmit = () => {
  if (validateForm()) {
    // Créer un objet JSON au lieu de FormData pour éviter les problèmes de type
    const sponsorData = {
      name: form.value.name,
      website_url: form.value.website_url || '',
      description: form.value.description || '',
      is_active: form.value.is_active, // Boolean direct
      logo: logoInput.value?.files?.[0] || null // Fichier ou null
    }
    
    emit('submit', sponsorData)
  }
}

// Exposer la fonction resetForm pour utilisation parent
defineExpose({ resetForm })
</script>
