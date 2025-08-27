<template>
  <div class="form-field">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        type="file"
        @change="handleFileChange"
        :accept="accept"
        :required="required"
        :disabled="disabled"
        :multiple="multiple"
        :class="[
          'sr-only'
        ]"
        v-bind="$attrs"
      />
      
      <!-- Zone de drop personnalisée -->
      <div
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        :class="[
          'w-full p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors',
          'hover:border-primary-400 hover:bg-primary-50',
          'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium text-primary-600 hover:text-primary-500">
                Cliquez pour sélectionner
              </span>
              {{ multiple ? 'des fichiers' : 'un fichier' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ accept ? `Types acceptés: ${accept}` : 'Tous types de fichiers' }}
            </p>
            <p v-if="maxSize" class="text-xs text-gray-500">
              Taille max: {{ formatFileSize(maxSize) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fichiers sélectionnés -->
    <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="flex items-center justify-between p-2 bg-gray-100 rounded-md"
      >
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm text-gray-700">{{ file.name }}</span>
          <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
        </div>
        
        <button
          @click="removeFile(index)"
          type="button"
          class="text-red-500 hover:text-red-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    
    <p v-else-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: File | File[] | null
  label?: string
  id?: string
  accept?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  multiple?: boolean
  maxSize?: number // en bytes
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  multiple: false,
  modelValue: null
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
}>()

const selectedFiles = ref<File[]>([])

// Initialiser les fichiers sélectionnés
onMounted(() => {
  if (props.modelValue) {
    if (Array.isArray(props.modelValue)) {
      selectedFiles.value = [...props.modelValue]
    } else {
      selectedFiles.value = [props.modelValue]
    }
  }
})

// Déclencher l'input file
const triggerFileInput = () => {
  if (!props.disabled) {
    const input = document.getElementById(props.id || 'file-input') as HTMLInputElement
    input?.click()
  }
}

// Gérer le changement de fichier
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    const fileArray = Array.from(files)
    
    // Vérifier la taille des fichiers
    if (props.maxSize) {
      const oversizedFiles = fileArray.filter(file => file.size > props.maxSize!)
      if (oversizedFiles.length > 0) {
        console.error('Fichiers trop volumineux:', oversizedFiles)
        return
      }
    }
    
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...fileArray]
      emit('update:modelValue', selectedFiles.value)
    } else {
      selectedFiles.value = [fileArray[0]]
      emit('update:modelValue', fileArray[0])
    }
  }
}

// Gérer le drop de fichiers
const handleDrop = (event: DragEvent) => {
  if (props.disabled) return
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const fileArray = Array.from(files)
    
    if (props.maxSize) {
      const oversizedFiles = fileArray.filter(file => file.size > props.maxSize!)
      if (oversizedFiles.length > 0) {
        console.error('Fichiers trop volumineux:', oversizedFiles)
        return
      }
    }
    
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...fileArray]
      emit('update:modelValue', selectedFiles.value)
    } else {
      selectedFiles.value = [fileArray[0]]
      emit('update:modelValue', fileArray[0])
    }
  }
}

// Supprimer un fichier
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  
  if (props.multiple) {
    emit('update:modelValue', selectedFiles.value.length > 0 ? selectedFiles.value : null)
  } else {
    emit('update:modelValue', null)
  }
}

// Formater la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.form-field {
  @apply w-full;
}
</style>
