<template>
  <div class="flex items-center justify-center space-x-2 text-blue-600">
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    <span class="text-sm font-medium">{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Connexion en cours...'
})
</script>
