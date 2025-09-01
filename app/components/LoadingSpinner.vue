<template>
  <div 
    class="inline-flex items-center justify-center"
    :class="containerClass"
  >
    <div 
      class="animate-spin rounded-full border-b-2"
      :class="spinnerClass"
      :style="{ width: size + 'px', height: size + 'px' }"
    ></div>
    <span 
      v-if="text" 
      class="ml-2 text-sm font-medium"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'white'
  text?: string
  containerClass?: string
  textClass?: string
  spinnerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: 'primary',
  text: '',
  containerClass: '',
  textClass: '',
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
    neutral: 'border-gray-500',
    white: 'border-white'
  }
  return colorMap[props.color]
})

// Classe finale du spinner
const finalSpinnerClass = computed(() => {
  return props.spinnerClass || defaultSpinnerClass.value
})
</script>
