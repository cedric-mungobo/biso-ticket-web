<template>
  <div class="fixed top-0 left-0 right-0 z-50 w-full">
    <div class="container mx-auto rounded-2xl p-2">
      <header class="bg-white/10 backdrop-blur-xl rounded-2xl  border  border-primary-200">
      <div class="flex items-center justify-between px-4 py-1.5 md:py-3">
        <!-- Logo -->
      <NuxtLink to="/" aria-label="Biso Ticket" class="inline-flex items-center gap-2">
        <img src="/logo.png" alt="Biso Ticket" class="h-8 w-auto" loading="eager" />
      </NuxtLink>

        <!-- Navigation Desktop -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              item.active
                ? 'text-primary-500 font-semibold'
                : 'text-gray-800 hover:text-primary-500'
            ]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Actions Desktop -->
        <div class="hidden md:flex items-center gap-2">
        <template v-if="!isAuthenticated">
          <UButton color="neutral" variant="outline" to="/inscription">Inscription</UButton>
          <UButton color="primary" to="/connexion">Connexion</UButton>
        </template>
        <template v-else>
          <UButton color="neutral" variant="subtle" class="rounded-full" to="/profile">
            {{ userInitials }}
          </UButton>
          <UButton color="neutral" variant="ghost" @click="handleLogout">Se déconnecter</UButton>
        </template>
      </div>

        <!-- Actions Mobile (avant le menu burger) -->
        <div class="md:hidden flex items-center gap-1">
          <template v-if="!isAuthenticated">
            <UButton color="neutral" variant="outline" size="md" to="/inscription">Inscription</UButton>
            <UButton color="primary" size="md" to="/connexion">Connexion</UButton>
          </template>
          <template v-else>
            <UButton color="neutral" variant="subtle" size="sm" to="/profile">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                  {{ userInitials }}
                </div>
                <span v-if="(user as any)?.name" class="text-sm">{{ (user as any)?.name }}</span>
                <span v-else class="text-sm">Profil</span>
              </div>
            </UButton>
          </template>
        </div>

        <!-- Menu Mobile Toggle -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-800 hover:bg-white/20 transition-colors"
          aria-label="Menu"
        >
          <Icon
            :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:queue-list'"
            class="w-6 h-6"
          />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-white/30 bg-white/20 backdrop-blur-xl rounded-b-2xl"
      >
        <div class="px-4 py-4 space-y-4">
          <!-- Navigation Mobile -->
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in items"
              :key="item.to"
              :to="item.to"
              @click="closeMobileMenu"
              :class="[
                'block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                item.active
                  ? 'text-primary-500 font-semibold bg-primary-50/50'
                  : 'text-gray-800 hover:text-primary-500 hover:bg-primary-50/30'
              ]"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Actions Mobile (déconnexion seulement dans le menu) -->
          <div v-if="isAuthenticated" class="pt-4 border-t border-white/30 space-y-2">
            <UButton color="neutral" variant="ghost" block @click="handleLogout">Se déconnecter</UButton>
          </div>
        </div>
      </div>
      </header>
    </div>
</div>
</template>

<script setup lang="ts">
import type { User } from '~/types/api'

interface NavigationMenuItem {
  label: string
  to: string
  active: boolean
}

const route = useRoute()

// État du menu mobile
const isMobileMenuOpen = ref(false)

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Accueil', to: '/', active: route.path === '/' },
  { label: 'Événements', to: '/evenements', active: route.path.startsWith('/evenements') },
  { label: 'Organisateur', to: '/organisateur', active: route.path.startsWith('/organisateur') },
  { label: 'Mes billets', to: '/tickets/my-tickets', active: route.path.startsWith('/tickets') },
  { label: 'Contact', to: '/contact', active: route.path.startsWith('/contact') }
])

// Auth minimal basé sur le cookie / composable
const { getProfile, logout } = useAuth()
const authToken = useCookie('auth_token')
const isAuthenticated = computed(() => !!authToken.value)

// Récupérer le profil utilisateur seulement si connecté
const user = ref<User | null>(null)

// Fonction pour récupérer le profil
const fetchUserProfile = async () => {
  if (!authToken.value) {
    user.value = null
    return
  }
  try {
    console.log('Récupération du profil...')
    const profile = await getProfile()
    console.log('Profil récupéré:', profile)
    user.value = profile
  } catch (error) {
    console.error('Erreur récupération profil:', error)
    user.value = null
  }
}

// Rafraîchir le profil quand l'utilisateur se connecte
watch(isAuthenticated, (newValue) => {
  console.log('Auth state changed:', newValue)
  if (newValue) {
    fetchUserProfile()
  } else {
    user.value = null
  }
})

// Récupérer le profil au montage si déjà connecté
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserProfile()
  }
})

const userInitials = computed(() => {
  const name = (user.value as any)?.name || ''
  console.log('User data:', user.value, 'Name:', name)
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Gestion du menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fermer le menu mobile lors du changement de route
watch(() => route.path, () => {
  closeMobileMenu()
})

const handleLogout = async () => {
  try {
    await logout()
    closeMobileMenu()
    await navigateTo('/')
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
</style>


