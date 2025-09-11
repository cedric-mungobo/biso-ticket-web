<template>
  <div
    class="relative h-[80dvh] w-full bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out"
    :style="{
      backgroundImage: `url(${image})`,
      transform: isClient ? `translateY(${scrollY * 0.5}px)` : 'none'
    }"
  >
    <!-- Overlay avec dégradé pour la lisibilité du titre -->
    <div 
      class="absolute inset-0 transition-opacity duration-300"
      :class="overlayClass"
    ></div>
    
    <!-- Overlay supplémentaire pour le texte -->
    <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- Titre en bas avec dégradé -->
    <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
      <h1 
        :class="titleClass"
        :style="titleStyle"
      >
        {{ title }}
      </h1>
      
      <!-- Sous-titre optionnel -->
      <p 
        v-if="subtitle"
        :class="subtitleClass"
        :style="subtitleStyle"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  image: string
  title: string
  subtitle?: string
  scrollY?: number
  overlayType?: 'dark' | 'light' | 'none'
  titleSize?: 'sm' | 'md' | 'lg' | 'xl'
  textAlign?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  scrollY: 0,
  overlayType: 'dark',
  titleSize: 'lg',
  textAlign: 'center'
})

const isClient = ref(false)

// Classes pour l'overlay
const overlayClass = computed(() => {
  switch (props.overlayType) {
    case 'dark':
      return 'bg-gradient-to-t from-black/90 via-black/60 to-black/20'
    case 'light':
      return 'bg-gradient-to-t from-white/90 via-white/60 to-white/20'
    case 'none':
      return ''
    default:
      return 'bg-gradient-to-t from-black/90 via-black/60 to-black/20'
  }
})

// Classes pour le titre
const titleClass = computed(() => {
  const sizeClasses = {
    sm: 'text-2xl sm:text-3xl md:text-4xl',
    md: 'text-3xl sm:text-4xl md:text-5xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return [
    sizeClasses[props.titleSize],
    alignClasses[props.textAlign],
    'font-bold text-white leading-tight'
  ].join(' ')
})

// Style pour le titre
const titleStyle = computed(() => ({
  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)',
  color: 'white'
}))

// Classes pour le sous-titre
const subtitleClass = computed(() => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return [
    'text-lg sm:text-xl md:text-2xl',
    'font-medium text-white/90 mt-2',
    alignClasses[props.textAlign]
  ].join(' ')
})

// Style pour le sous-titre
const subtitleStyle = computed(() => ({
  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
}))

onMounted(() => {
  isClient.value = true
})
</script>

<style scoped>
/* Animation d'apparition */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1, p {
  animation: fadeInUp 0.8s ease-out;
}

p {
  animation-delay: 0.2s;
}

/* Amélioration de la lisibilité du titre */
h1 {
  text-shadow: 
    2px 2px 4px rgba(0,0,0,0.8),
    0 0 8px rgba(0,0,0,0.6),
    0 0 16px rgba(0,0,0,0.4);
}
</style>
