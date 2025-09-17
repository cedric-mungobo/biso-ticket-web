<template>
  <UButton
    :loading="isLoading"
    :disabled="disabled"
    @click="handleGoogleLogin"
    variant="outline"
    color="gray"
    size="lg"
    block
    class="google-auth-button"
  >
    <template #leading>
      <Icon name="logos:google-icon" class="w-5 h-5" />
    </template>
    {{ loadingText }}
  </UButton>
</template>

<script lang="ts" setup>
interface Props {
  loadingText?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'Connexion avec Google...',
  disabled: false
})

// Emits
const emit = defineEmits<{
  success: [user: any]
  error: [error: string]
}>()

// State
const isLoading = ref(false)

// Composables
const { loginWithGoogle } = useGoogleAuth()
const toast = useToast()

/**
 * Gère la connexion Google
 */
const handleGoogleLogin = async () => {
  try {
    isLoading.value = true
    await loginWithGoogle()
    // La redirection se fait automatiquement dans loginWithGoogle
  } catch (error: any) {
    const message = error?.message || 'Erreur lors de la connexion Google'
    emit('error', message)
    toast.add({ 
      title: 'Erreur de connexion', 
      description: message, 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.google-auth-button {
  @apply border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400;
}

.google-auth-button:hover {
  @apply shadow-sm;
}

.google-auth-button:focus {
  @apply ring-2 ring-blue-500 ring-offset-2;
}
</style>
