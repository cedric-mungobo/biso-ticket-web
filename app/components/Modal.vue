<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        @click="handleBackdropClick"
        style="touch-action: manipulation;"
      >
        <!-- Overlay -->
        <div 
          class="absolute inset-0 transition-all duration-300"
          :class="{
            'bg-black/40 backdrop-blur-sm': !isMobile,
            'bg-black/20 backdrop-blur-none': isMobile
          }"
        />
        
        <!-- Modal Content -->
        <div
          class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl my-8 flex flex-col max-h-[90vh]"
          :class="{
            'mobile-bottom-sheet': isMobile
          }"
          @click.stop
          style="touch-action: manipulation;"
        >
          <!-- Mobile Handle -->
          <div v-if="isMobile" class="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <!-- Header -->
          <div v-if="$slots.header || title" class="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </slot>
            <button
              v-if="showCloseButton"
              @click="$emit('update:modelValue', false)"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4 flex-1 overflow-y-auto">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 flex-shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Détection mobile
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}

// Fermer le modal avec la touche Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Optimisations pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .transition {
    transition: none;
  }
  
  .transform {
    transform: none;
  }
}

/* Bottom Sheet sur mobile */
.mobile-bottom-sheet {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: auto !important;
  margin: 0 !important;
  max-width: 100vw !important;
  width: 100vw !important;
  max-height: 85vh !important;
  height: auto !important;
  border-radius: 1rem 1rem 0 0 !important;
  transform: translateY(0) !important;
  animation: slideUp 0.3s ease-out !important;
}

/* Overlay mobile - pas de blur pour un effet plus natif */
@media (max-width: 768px) {
  .backdrop-blur-none {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Optimisations pour mobile */
@media (max-width: 768px) {
  .fixed {
    padding: 0;
    align-items: flex-end;
    padding-top: 0;
  }
  
  .max-w-md {
    max-width: 100vw;
    margin: 0;
    width: 100vw;
    max-height: 85vh;
    height: auto;
    min-height: auto;
  }
  
  /* Améliorer la scrollabilité sur mobile */
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Optimiser les boutons pour le touch */
  button {
    min-height: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Assurer que le contenu ne dépasse pas */
  .relative {
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Optimisations pour très petits écrans */
@media (max-width: 480px) {
  .fixed {
    padding: 0;
    padding-top: 0;
  }
  
  .max-w-md {
    max-width: 100vw;
    width: 100vw;
    max-height: 90vh;
    height: auto;
  }
  
  .relative {
    max-height: 90vh;
  }
  
  .mobile-bottom-sheet {
    max-height: 90vh !important;
  }
}

/* Prévenir les problèmes de z-index */
.fixed {
  z-index: 50;
}

/* Améliorer l'accessibilité */
@media (prefers-reduced-motion: no-preference) {
  .transform {
    transition: transform 0.2s ease-in-out;
  }
}
</style>
