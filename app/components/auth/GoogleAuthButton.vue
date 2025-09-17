<template>
  <UButton
    :loading="isLoading"
    :disabled="disabled"
    @click="handleGoogleLogin"
    variant="outline"
    color="neutral"
    size="lg"
    block
    class="google-auth-button"
  >
    <template #leading>
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
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
  border-color: rgb(209 213 219);
  color: rgb(55 65 81);
}

.google-auth-button:hover {
  background-color: rgb(249 250 251);
  border-color: rgb(156 163 175);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.google-auth-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246);
}
</style>
