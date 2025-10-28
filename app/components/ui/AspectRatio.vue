<template>
  <div :class="aspectRatioClasses" :style="aspectRatioStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  ratio?: number
}

const props = withDefaults(defineProps<Props>(), {
  ratio: 1
})

const aspectRatioClasses = computed(() => {
  return 'relative w-full overflow-hidden'
})

const aspectRatioStyle = computed(() => {
  return {
    aspectRatio: props.ratio.toString()
  }
})
</script>
