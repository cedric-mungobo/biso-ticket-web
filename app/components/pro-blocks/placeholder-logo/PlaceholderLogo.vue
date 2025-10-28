<template>
  <div :class="logoClasses">
    <div class="h-8 w-32 bg-gray-200 rounded flex items-center justify-center">
      <span class="text-gray-500 text-sm font-medium">Logo</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const logoClasses = computed(() => {
  return props.className || ''
})
</script>
