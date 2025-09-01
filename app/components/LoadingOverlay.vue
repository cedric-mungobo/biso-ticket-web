<template>
  <div 
    v-if="show" 
    class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
    :class="containerClass"
  >
    <div class="text-center">
      <!-- Spinner personnalisable -->
      <div 
        class="animate-spin rounded-full border-b-2 mx-auto mb-4"
        :class="spinnerClass"
        :style="{ width: size + 'px', height: size + 'px' }"
      ></div>
      
      <!-- Titre -->
      <p 
        v-if="title" 
        class="text-lg font-medium text-gray-700"
        :class="titleClass"
      >
        {{ title }}
      </p>
      
      <!-- Description -->
      <p 
        v-if="description" 
        class="text-sm text-gray-500 mt-2"
        :class="descriptionClass"
      >
        {{ description }}
      </p>
      
      <!-- Contenu personnalisé -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  description?: string
  size?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  containerClass?: string
  titleClass?: string
  descriptionClass?: string
  spinnerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  description: '',
  size: 48,
  color: 'primary',
  containerClass: '',
  titleClass: '',
  descriptionClass: '',
  spinnerClass: ''
})

// Classes par défaut pour le spinner selon la couleur
const defaultSpinnerClass = computed(() => {
  const colorMap = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    neutral: 'border-gray-500'
  }
  return colorMap[props.color]
})

// Classe finale du spinner
const finalSpinnerClass = computed(() => {
  return props.spinnerClass || defaultSpinnerClass.value
})
</script>
