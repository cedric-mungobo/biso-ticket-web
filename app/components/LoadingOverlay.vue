<template>
  <div 
    v-if="show" 
    class="absolute h-dvh w-dvws fixed inset-0 backdrop-blur-md rounded-2xl flex items-center justify-center z-50"
    :class="[variantClasses.container, containerClass]"
  >
    <div class="text-center px-6">
      <!-- Logo Biso Ticket -->
      <div v-if="showLogo" class="mb-6">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br rounded-2xl flex items-center justify-center "
             >
          <Logo class="w-24 object-covers text-white" />
        </div>
      </div>
      
      <!-- Spinner animé avec gradient -->
      <div class="relative mb-6">
        <div 
          class="animate-spin rounded-full border-4 border-gray-200 mx-auto"
          :style="{ width: size + 'px', height: size + 'px' }"
        >
          <div 
            class="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
            :class="variantClasses.spinner"
            :style="{ animationDuration: '1.5s' }"
          ></div>
        </div>
        
        <!-- Points animés -->
        <div v-if="showDots" class="flex justify-center space-x-1 mt-4">
          <div class="w-2 h-2 rounded-full animate-bounce" 
               :class="variantClasses.dots"
               style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 rounded-full animate-bounce" 
               :class="variantClasses.dots"
               style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 rounded-full animate-bounce" 
               :class="variantClasses.dots"
               style="animation-delay: 300ms"></div>
        </div>
      </div>
      
      <!-- Titre avec gradient -->
      <h3 
        v-if="title" 
        class="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2"
        :class="[variantClasses.title, titleClass]"
      >
        {{ title }}
      </h3>
      
      <!-- Description stylée -->
      <p 
        v-if="description" 
        class="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto"
        :class="descriptionClass"
      >
        {{ description }}
      </p>
      
      <!-- Contenu personnalisé -->
      <div v-if="$slots.default" class="mt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  description?: string
  size?: number
  variant?: 'default' | 'minimal' | 'branded' | 'success' | 'error'
  showLogo?: boolean
  showDots?: boolean
  containerClass?: string
  titleClass?: string
  descriptionClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  description: '',
  size: 48,
  variant: 'branded',
  showLogo: true,
  showDots: true,
  containerClass: '',
  titleClass: '',
  descriptionClass: ''
})

// Classes dynamiques selon la variante
const variantClasses = computed(() => {
  const variants = {
    default: {
      container: 'bg-white/90',
      logo: 'from-gray-500 to-gray-600',
      spinner: 'border-t-gray-500 border-r-gray-400',
      dots: 'bg-gray-500',
      title: 'from-gray-800 to-gray-600'
    },
    minimal: {
      container: 'bg-white/80',
      logo: 'from-gray-400 to-gray-500',
      spinner: 'border-t-gray-400 border-r-gray-300',
      dots: 'bg-gray-400',
      title: 'from-gray-700 to-gray-500'
    },
    branded: {
      container: 'bg-gradient-to-br from-white/95 to-gray-50/95',
      logo: 'white',
      spinner: 'border-t-primary-500 border-r-primary-400',
      dots: 'bg-primary-500',
      title: 'from-gray-800 to-gray-600'
    },
    success: {
      container: 'bg-gradient-to-br from-green-50/95 to-emerald-50/95',
      logo: 'from-green-500 to-emerald-600',
      spinner: 'border-t-green-500 border-r-emerald-400',
      dots: 'bg-green-500',
      title: 'from-green-800 to-emerald-600'
    },
    error: {
      container: 'bg-gradient-to-br from-red-50/95 to-rose-50/95',
      logo: 'from-red-500 to-rose-600',
      spinner: 'border-t-red-500 border-r-rose-400',
      dots: 'bg-red-500',
      title: 'from-red-800 to-rose-600'
    }
  }
  return variants[props.variant]
})
</script>
