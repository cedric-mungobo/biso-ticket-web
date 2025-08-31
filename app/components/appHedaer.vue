<template>
  <div class="">
    <!-- ========== HEADER ========== -->
    <header class="fixed top-2 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
      <nav class="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 ps-5 pe-2 md:py-0 mx-2 lg:mx-auto bg-neutral-100/50 backdrop-blur-md rounded-[26px] border border-secondary-200">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" to="/" aria-label="Biso Ticket">
            <NuxtImg src="/images/logo.png" alt="Biso Ticket" class="w-24  object-contain" />
          </NuxtLink>
        </div>
        <!-- End Logo -->
        <!-- Navigation Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-800 focus:outline-hidden focus:text-neutral-800" to="/">
            Accueil
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-800 focus:outline-hidden focus:text-neutral-800" to="/evenements">
            Événements
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-800 focus:outline-hidden focus:text-neutral-800" to="/organisateur">
            Organisateur
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-800 focus:outline-hidden focus:text-neutral-800" to="/tickets/my-tickets">
            Mes billets
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-800 focus:outline-hidden focus:text-neutral-800" to="/contact">
            Contact
          </NuxtLink>
        </div>
        <!-- End Navigation Menu -->

        <!-- Button Group -->
        <div class="md:order-3 flex items-center gap-x-2">
       
          
          <!-- Boutons d'authentification (visibles uniquement si non connecté) -->
          <div v-if="!isAuthenticated" class="md:ps-3">
            <NuxtLink class="group inline-flex items-center gap-x-2 py-2 px-3 bg-primary-100 font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden hover:bg-primary-200 transition-colors duration-200 border border-primary-200" to="/connexion">
              Connexion
            </NuxtLink>
          </div>
          <div v-if="!isAuthenticated" class="md:ps-3">
            <NuxtLink class="group inline-flex items-center gap-x-2 py-2 px-3 bg-white font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden hover:bg-neutral-100 transition-colors duration-200 border border-neutral-300" to="/inscription">
              Inscription
            </NuxtLink>
          </div>

          <!-- Menu utilisateur (visible uniquement si connecté) -->
          <div v-if="isAuthenticated" class="relative user-menu">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-x-2 py-2 px-3 bg-white/20 backdrop-blur-md text-neutral-800 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
            >
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-neutral-800">{{ (user as any)?.name }}</span>
              <svg class="w-4 h-4 transition-transform duration-200 text-neutral-800" :class="{ 'rotate-180': isUserMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Menu déroulant utilisateur -->
            <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-neutral-200/50 py-2 z-50">
              <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100/50 transition-colors duration-200">
                Mon profil
              </NuxtLink>
              <NuxtLink to="/mes-evenements" class="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100/50 transition-colors duration-200">
                Mes événements
              </NuxtLink>
              <div class="border-t border-neutral-200/50 my-1"></div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-200"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
        <!-- End Button Group -->

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            type="button" 
            class="hs-collapse-toggle size-9 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white disabled:opacity-50 disabled:pointer-events-none"
            @click="toggleMobileMenu"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <!-- End Mobile Menu Button -->
      </nav>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden backdrop-blur-md rounded-b-[26px] w-full mx-2 bg-neutral-100/50 border border-neutral-200/50 border-t-0">
        <div class="px-6 py-4 space-y-3">
          <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/" @click="closeMobileMenu">
            Accueil
          </NuxtLink>
          <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/evenements" @click="closeMobileMenu">
            Événements
          </NuxtLink>
          <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/organisateur" @click="closeMobileMenu">
            Organisateur
          </NuxtLink>
          <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/tickets/my-tickets" @click="closeMobileMenu">
            Mes billets
          </NuxtLink>
          <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/contact" @click="closeMobileMenu">
            Contact
          </NuxtLink>
          <!-- Boutons d'authentification mobile (visibles uniquement si non connecté) -->
          <div v-if="!isAuthenticated" class="pt-4 space-y-3 border-t border-neutral-300">
            <NuxtLink class="block text-neutral-700 hover:text-neutral-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-neutral-100/50 rounded-lg" to="/connexion" @click="closeMobileMenu">
              Connexion
            </NuxtLink>
            <NuxtLink class="block bg-primary-500 text-white px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 hover:bg-primary-600 border border-primary-600" to="/inscription" @click="closeMobileMenu">
              Inscription
            </NuxtLink>
          </div>

          <!-- Menu utilisateur mobile (visible uniquement si connecté) -->
          <div v-if="isAuthenticated" class="pt-4 space-y-3 border-t border-neutral-300">
            <div class="flex items-center gap-x-3 px-3 py-2">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {{ userInitials }}
              </div>
              <span class="text-neutral-800 text-sm font-medium">{{ (user as any)?.name }}</span>
            </div>
            <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/profile" @click="closeMobileMenu">
              Mon profil
            </NuxtLink>
            <NuxtLink class="block text-black hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/mes-evenements" @click="closeMobileMenu">
              Mes événements
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left text-red-400 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
      <!-- End Mobile Menu -->
    </header>
    <!-- ========== END HEADER ========== -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

// Auth repository + cookie réactif
const { getProfile, logout } = useAuth()
const authToken = useCookie('auth_token')
const isAuthenticated = computed(() => !!authToken.value)

// Charger le profil uniquement si connecté
const { data: user, refresh: refreshUser } = await useAsyncData('nav:profile', () => getProfile(), {
  server: false,
  immediate: false
})

console.log('[Header] init token:', authToken.value)
console.log('[Header] init user:', user.value)

watch(authToken, async (val) => {
  console.log('[Header] token changed:', val)
  if (val) {
    console.log('[Header] refreshing user profile...')
    await refreshUser()
    console.log('[Header] user after refresh:', user.value)
  } else {
    user.value = null as any
    console.log('[Header] user cleared on logout')
  }
})

// Rafraîchir immédiatement si un token existe au montage (ex: retour de /connexion)
onMounted(async () => {
  if (authToken.value) {
    console.log('[Header] mounted with token, refreshing user...')
    await refreshUser()
    console.log('[Header] user after mount refresh:', user.value)
  }
})

// État local
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Computed properties
const userInitials = computed(() => {
  const userName = (user.value as any)?.name
  if (!userName) return 'U'
  return userName
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Méthodes
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = async () => {
  try {
    console.log('[Header] logout clicked')
    await logout()
    isUserMenuOpen.value = false
    // Redirection vers la page d'accueil après déconnexion
    await navigateTo('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Fermer le menu utilisateur quand on clique ailleurs
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      isUserMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */

/* Amélioration des bordures et de l'apparence */
header {
  filter: drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1)) drop-shadow(0 2px 4px -1px rgb(0 0 0 / 0.06));
}

/* Animation du menu mobile */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Amélioration des boutons */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

/* Amélioration des liens */
a {
  transition: all 0.2s ease;
}

a:hover {
  transform: translateY(-1px);
}
</style>