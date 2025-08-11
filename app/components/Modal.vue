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
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        <!-- Modal Content -->
        <div
          class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl"
          @click.stop
        >
          <!-- Header -->
          <div v-if="$slots.header || title" class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
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
          <div class="px-6 py-4">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
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
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
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
</style>
