<template>
  <div>
    <img src="/logo.png" alt="Biso Ticket" :class="size" loading="eager" />
  </div>
</template>

<script setup lang="ts">    
const props = defineProps<{
  size?: string
}>()
</script>
<style scoped>
.logo {
  width: 100%;
  height: 100%;
}
</style>