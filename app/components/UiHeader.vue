<template>
  <div class="fixed top-0 left-0 right-0 z-50 w-full">
    <div class="container mx-auto rounded-2xl p-2">
      <header class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/30">
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

        <!-- Menu Mobile Toggle -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-800 hover:bg-white/20 transition-colors"
          aria-label="Menu"
        >
          <Icon
            :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
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

          <!-- Actions Mobile -->
          <div class="pt-4 border-t border-white/30 space-y-2">
          <template v-if="!isAuthenticated">
              <UButton color="primary" block to="/connexion" @click="closeMobileMenu">Connexion</UButton>
              <UButton color="neutral" variant="outline" block to="/inscription" @click="closeMobileMenu">Inscription</UButton>
          </template>
          <template v-else>
              <UButton color="neutral" block to="/profile" @click="closeMobileMenu">Mon profil</UButton>
            <UButton color="neutral" variant="ghost" block @click="handleLogout">Se déconnecter</UButton>
          </template>
          </div>
        </div>
      </div>
      </header>
    </div>
</div>
</template>

<script setup lang="ts">
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
const { data: user } = await useAsyncData('uiheader:profile', () => getProfile(), { server: false, immediate: false })

const userInitials = computed(() => {
  const name = (user.value as any)?.name || ''
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


