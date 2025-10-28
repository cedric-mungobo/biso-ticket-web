<template>
  <div :class="taglineClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const taglineClasses = computed(() => {
  const baseClasses = 'inline-flex items-center gap-2 text-sm font-medium'
  
  const variantClasses = {
    default: 'text-primary',
    ghost: 'text-muted-foreground'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]}`
})
</script>
