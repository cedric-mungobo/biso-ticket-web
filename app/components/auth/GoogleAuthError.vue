<template>
  <div v-if="error" class="rounded-md bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          Erreur d'authentification Google
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ error }}</p>
        </div>
        <div class="mt-4">
          <div class="-mx-2 -my-1.5 flex">
            <button
              @click="$emit('retry')"
              class="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              Réessayer
            </button>
            <button
              @click="$emit('dismiss')"
              class="ml-3 bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  error: string
}

defineProps<Props>()

defineEmits<{
  retry: []
  dismiss: []
}>()
</script>
