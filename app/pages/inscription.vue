<template>
  <div class=" h-full md:py-18  flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <!-- Icône utilisateur -->
        <div class="flex justify-center mb-6">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <NuxtImg src="/logo.png" alt="Biso Ticket" class="w-10 h-10 object-contain" />

          </div>
        </div>

        <!-- En-tête -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Inscription</h1>
          <p class="text-gray-600">Créez votre compte pour commencer.</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Nom complet -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <UInput id="name" v-model="form.name" type="text" required placeholder="Entrez votre nom complet" class="w-full    rounded-md focus:outline-none focus:ring-2 " />
          </div>

          <!-- Téléphone -->
          <div>
            <label for="telephone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <UInput id="telephone" v-model="form.telephone" type="tel" required placeholder="Ex: +243 900 000 000" class="w-full    rounded-md " />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput id="email" v-model="form.email" type="email" required placeholder="Entrez votre email" class="w-full    rounded-md " />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <UInput id="password" v-model="form.password" type="password" required placeholder="Créez un mot de passe sécurisé" class="w-full    rounded-md " />
          </div>

          

          <!-- Bouton -->
          <UButton
            type="submit"
            block
            color="primary"
            size="lg"
            :disabled="isLoading || !isFormValid"
            :loading="isLoading"
            icon="i-heroicons-arrow-right-16-solid"
          >
            Créer mon compte
          </UButton>

          <!-- Erreur / Succès -->
          <!-- Erreur alimentée par toast: on laisse ce bloc optionnel vide pour l'instant -->
          <div v-if="success" class="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3">{{ success }}</div>
        </form>

        <!-- Lien connexion -->
        <div class="mt-6 text-center">
          <p class="text-gray-500 text-sm">Déjà un compte ?
            <NuxtLink to="/connexion" class="text-primary-600 hover:text-primary-500 font-medium">Se connecter</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

// Meta
definePageMeta({
  title: 'Inscription - Biso Ticket',
  description: 'Créez votre compte Biso Ticket',
  middleware: ['guest']
})

// Form state
const form = reactive({
  name: '',
  telephone: '',
  email: '',
  password: ''
})

const success = ref('')
const isLoading = ref(false)

// Composables
const { register } = useAuth()
const router = useRouter()
const toast = useToast()

const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
const phoneIntl = /^\+?[1-9][0-9]{6,14}$/

const isFormValid = computed(() => !!(form.name && form.telephone && form.email && form.password))

const extractErrorMessage = (e: any): string => {
  const direct = e?.data?.message || e?.response?._data?.message || e?.message
  if (direct) return String(direct)
  const errors = (e?.data?.errors || e?.response?._data?.errors) as Record<string, unknown> | undefined
  if (errors && typeof errors === 'object') {
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      const firstKey = keys[0] as keyof typeof errors
      const first = errors[firstKey]
      if (Array.isArray(first) && first.length) return String(first[0])
      if (typeof first === 'string') return first as string
    }
  }
  return 'Une erreur est survenue.'
}

const handleRegister = async () => {
  try {
    success.value = ''
    if (!form.name.trim()) return toast.add({ title: 'Nom requis', description: 'Veuillez saisir votre nom.', color: 'warning' })
    if (!emailRegex.test(form.email.trim())) return toast.add({ title: 'Email invalide', description: 'Saisissez une adresse email valide.', color: 'error' })
    if (!phoneIntl.test(form.telephone.replace(/\s/g, ''))) return toast.add({ title: 'Téléphone invalide', description: 'Saisissez un numéro valide (international).', color: 'error' })
    isLoading.value = true
    await register({
      name: form.name.trim(),
      email: form.email.trim(),
      telephone: form.telephone.trim(),
      password: form.password
    })
    success.value = 'Compte créé avec succès ! Redirection...'
    toast.add({ title: 'Bienvenue', description: 'Votre compte a été créé.' })
    await router.push('/')
  } catch (e: any) {
    const message = extractErrorMessage(e)
    toast.add({ title: 'Inscription échouée', description: message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
