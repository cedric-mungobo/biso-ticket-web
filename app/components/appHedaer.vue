<template>
  <div class="">
    <!-- ========== HEADER ========== -->
    <header class="fixed top-2 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-[26px] before:bg-neutral-800/30 before:backdrop-blur-md">
      <nav class="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 ps-5 pe-2 md:py-0 mx-2 lg:mx-auto">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" to="/" aria-label="Biso Ticket">
            <span class="text-white font-bold text-xl">Biso Ticket</span>
          </NuxtLink>
        </div>
        <!-- End Logo -->
        <!-- Navigation Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" to="/">
            Accueil
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" to="/evenements">
            Événements
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" to="/organisateur">
            Organisateur
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" to="/tickets/my-tickets">
            Mes billets
          </NuxtLink>
          <NuxtLink class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" to="/contact">
            Contact
          </NuxtLink>
        </div>
        <!-- End Navigation Menu -->

        <!-- Button Group -->
        <div class="md:order-3 flex items-center gap-x-2">
       
          
          <!-- Boutons d'authentification (visibles uniquement si non connecté) -->
          <div v-if="!isAuthenticated" class="md:ps-3">
            <NuxtLink class="group inline-flex items-center gap-x-2 py-2 px-2 bg-primary-100 font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden" to="/connexion">
              Connexion
            </NuxtLink>
          </div>
          <div v-if="!isAuthenticated" class="md:ps-3">
            <NuxtLink class="group inline-flex items-center gap-x-2 py-2 px-2 bg-white font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden hover:bg-neutral-100" to="/inscription">
              Inscription
            </NuxtLink>
          </div>

          <!-- Menu utilisateur (visible uniquement si connecté) -->
          <div v-if="isAuthenticated" class="relative user-menu">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-x-2 py-2 px-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium">{{ (user as any)?.name || 'Utilisateur' }}</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isUserMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Menu déroulant utilisateur -->
            <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                Mon profil
              </NuxtLink>
              <NuxtLink to="/mes-evenements" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                Mes événements
              </NuxtLink>
              <div class="border-t border-gray-200 my-1"></div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
      <div v-if="isMobileMenuOpen" class="md:hidden  backdrop-blur-md rounded-b-[26px] mx-2">
        <div class="px-6 py-4 space-y-3">
          <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/" @click="closeMobileMenu">
            Accueil
          </NuxtLink>
          <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/evenements" @click="closeMobileMenu">
            Événements
          </NuxtLink>
          <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/organisateur" @click="closeMobileMenu">
            Organisateur
          </NuxtLink>
          <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/tickets/my-tickets" @click="closeMobileMenu">
            Mes billets
          </NuxtLink>
          <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/contact" @click="closeMobileMenu">
            Contact
          </NuxtLink>
          <!-- Boutons d'authentification mobile (visibles uniquement si non connecté) -->
          <div v-if="!isAuthenticated" class="pt-4 space-y-3 border-t border-neutral-700">
            <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/connexion" @click="closeMobileMenu">
              Connexion
            </NuxtLink>
            <NuxtLink class="block bg-primary-500 text-neutral-800 px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 hover:bg-yellow-200" to="/inscription" @click="closeMobileMenu">
              Inscription
            </NuxtLink>
          </div>

          <!-- Menu utilisateur mobile (visible uniquement si connecté) -->
          <div v-if="isAuthenticated" class="pt-4 space-y-3 border-t border-neutral-700">
            <div class="flex items-center gap-x-3 px-3 py-2">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {{ userInitials }}
              </div>
              <span class="text-white text-sm font-medium">{{ (user as any)?.name || 'Utilisateur' }}</span>
            </div>
            <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/profile" @click="closeMobileMenu">
              Mon profil
            </NuxtLink>
            <NuxtLink class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" to="/mes-evenements" @click="closeMobileMenu">
              Mes événements
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left text-red-400 hover:text-red-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
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
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

// Composables
const { isAuthenticated, user, logout } = useAuth()

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
</style>