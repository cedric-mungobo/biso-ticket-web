<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <div class="w-full max-w-md">
      <UCard class="shadow-xl border border-neutral-200/60 bg-white/90 backdrop-blur rounded-2xl">
        <template #header>
          <div class="text-center">
            <NuxtLink to="/" class="inline-block">
              <h1 class="text-2xl font-bold text-primary-700">Biso Ticket</h1>
            </NuxtLink>
            <p class="text-neutral-600 text-sm mt-1">Connectez-vous à votre compte</p>
          </div>
        </template>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <UFormGroup label="Email ou Téléphone" name="identifier">
            <UInput
              v-model="form.identifier"
              :disabled="isLoading"
              placeholder="Entrez votre email ou téléphone"
              autocomplete="username"
              icon="i-heroicons-at-symbol-20-solid"
              size="lg"
              autofocus
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Mot de passe" name="password">
            <UInput
              v-model="form.password"
              :disabled="isLoading"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Entrez votre mot de passe"
              autocomplete="current-password"
              icon="i-heroicons-lock-closed-20-solid"
              size="lg"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  variant="link"
                  color="neutral"
                  :icon="showPassword ? 'i-heroicons-eye-slash-20-solid' : 'i-heroicons-eye-20-solid'"
                  aria-label="Afficher/Masquer le mot de passe"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="remember" label="Se souvenir de moi" size="sm" />
            <NuxtLink to="/" class="text-sm text-primary-600 hover:underline">Mot de passe oublié ?</NuxtLink>
          </div>

          <UButton type="submit" color="primary" size="lg" block :loading="isLoading" icon="i-heroicons-arrow-right-16-solid">
            Se connecter
          </UButton>

          <UAlert v-if="uiError" color="secondary" title="Erreur" :description="uiError" />
        </form>
        <template #footer>
          <div class="text-center space-y-2">
            <p class="text-neutral-500 text-sm">
              Pas encore de compte ?
              <NuxtLink to="/inscription" class="text-primary-600 hover:text-primary-700 font-medium">
                Créer un compte
              </NuxtLink>
            </p>
            <NuxtLink to="/" class="text-neutral-500 hover:text-neutral-400 text-sm block">
              ← Retour à l'accueil
            </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// Meta de la page
definePageMeta({
  title: 'Connexion - Biso Ticket',
  description: 'Connectez-vous à votre compte Biso Ticket',
  middleware: ['guest']
})

// État du formulaire
const form = reactive({
  identifier: '',
  password: ''
})

// UI state
const remember = ref(false)
const showPassword = ref(false)

// Composables
const { login } = useAuth()
const router = useRouter()
const route = useRoute()

// useAsyncData pour l'appel login (exécution manuelle)
const { pending: isLoading, error, data, execute } = await useAsyncData('auth:login', () =>
  login({ identifier: form.identifier, password: form.password })
, { immediate: false, server: false })

// Message d'erreur UI (ne jamais afficher l'erreur brute)
const uiError = computed(() => {
  const e = error.value as any
  if (!e) return ''
  // ofetch place souvent la réponse dans e.data
  return e?.data?.message || 'Email ou mot de passe invalide.'
})

// Gestion de la connexion
const handleLogin = async () => {
  await execute()
  console.log('[Login] response data:', data.value)
  console.log('[Login] error:', error.value)
  if (!error.value) {
    const redirectUrl = route.query.redirect as string
    if (redirectUrl && redirectUrl !== '/connexion') {
      await router.push(decodeURIComponent(redirectUrl))
    } else {
      await router.push('/')
    }
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
