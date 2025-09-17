<template>
  <div class="space-y-2">
    <!-- Boutons de catégorie -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie d'événement</label>
      <div class="flex flex-row flex-nowrap gap-1 overflow-x-auto">
        <UButton
          v-for="category in categoryOptions"
          :key="category.value"
          :variant="selectedCategory === category.value ? 'solid' : 'outline'"
          size="sm"
          @click="selectedCategory = category.value"
          class=" flex-shrink-0 whitespace-nowrap"
        >
          {{ category.label }}
        </UButton>
      </div>
    </div>

    <!-- Boutons de modèles -->
    <div v-if="selectedCategory">
      <label class="block text-sm font-medium text-gray-700 mb-1">Modèle de texte</label>
      <div class="flex flex-row flex-nowrap gap-2 overflow-x-auto">
        <UButton
          v-for="template in templateOptions"
          :key="template.value"
          :variant="selectedTemplate === template.value ? 'solid' : 'outline'"
          size="sm"
          class=" flex-shrink-0 whitespace-nowrap"
          @click="selectTemplate(template.value)"
        >
          {{ template.label }}
        </UButton>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInvitationTemplates, type InvitationTemplate } from '~/composables/useInvitationTemplates'

interface Props {
  eventData?: {
    date?: string
    location?: string
    childName?: string
    years?: number
    theme?: string
  }
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'template-selected': [template: InvitationTemplate, message: string]
}>()

const { 
  templates, 
  templatesByCategory, 
  getTemplateById, 
  formatTemplateMessage 
} = useInvitationTemplates()

const selectedCategory = ref<string>('')
const selectedTemplate = ref<string>('')

// Options pour les sélecteurs
const categoryOptions = computed(() => [
  { label: 'Mariage', value: 'mariage' },
  { label: 'Entreprise', value: 'entreprise' },
  { label: 'Anniversaire', value: 'anniversaire' },
  { label: 'Générique', value: 'generique' }
])

const templateOptions = computed(() => {
  if (!selectedCategory.value) return []
  
  const categoryTemplates = templatesByCategory.value[selectedCategory.value] || []
  return categoryTemplates.map(template => ({
    label: template.title,
    value: template.id
  }))
})


// Watchers
watch(selectedCategory, () => {
  selectedTemplate.value = ''
})

// Méthodes
const selectTemplate = (templateId: string) => {
  selectedTemplate.value = templateId
  const template = getTemplateById(templateId)
  if (template) {
    const message = formatTemplateMessage(template, props.eventData || {})
    emit('update:modelValue', message)
    emit('template-selected', template, message)
  }
}
</script>

<style scoped>
.prose {
  max-width: none;
}
</style>
