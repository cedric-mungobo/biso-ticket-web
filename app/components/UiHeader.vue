<template>
  <div>
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 flex items-center justify-between py-3 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/80 text-gray-900 text-sm">
      <NuxtLink to="/">
        <Logo size="h-10 w-auto" />
      </NuxtLink>
      <!-- Left side: Logo + Navigation -->
      <div class="flex items-center gap-8">

        <div class="hidden md:flex items-center gap-8 transition duration-500">
          <NuxtLink to="/" class="hover:text-purple-500 transition">
            Accueil
          </NuxtLink>
          <NuxtLink to="/evenements" class="hover:text-purple-500 transition">
            Événements
          </NuxtLink>
          <NuxtLink to="/tickets/my-tickets" class="hover:text-purple-500 transition">
            Mes billets
          </NuxtLink>
          <NuxtLink to="/contact" class="hover:text-purple-500 transition">
            Contact
          </NuxtLink>
          <NuxtLink to="/organisateur" class="hover:text-purple-500 transition">
            Organisateur
          </NuxtLink>
        </div>
      </div>

      <!-- Right side: Auth + Commencer + Social Icons -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="!isAuthenticated">
          <button 
            class="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            @click="handleInscription"
          >
            Inscription
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
              {{ userInitials }}
            </div>
            <span class="text-sm text-gray-700">{{ (user as any)?.name || 'Utilisateur' }}</span>
          </NuxtLink>
        </template>
        
        <button 
          class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded-full text-white"
          @click="handleGetStarted"
        >
          Commencer
        </button>

        <!-- Social Media Icons -->
        <div class="flex items-center gap-2">
          <a 
            href="https://web.facebook.com/profile.php?id=61573688042341&_rdc=1&_rdr" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/biso_ticket/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 text-gray-600 hover:text-black transition-colors"
            aria-label="TikTok"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="md:hidden flex items-center gap-2">
          <template v-if="!isAuthenticated">
          <button 
            class="px-3 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors text-sm"
            @click="handleInscription"
          >
            Inscription
          </button>
          </template>
          <template v-else>
            <NuxtLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs">
                {{ userInitials }}
              </div>
              <span class="text-xs text-gray-700 font-medium">{{ (user as any)?.name || 'Utilisateur' }}</span>
            </NuxtLink>
          </template>
        
        <!-- Social Media Icons Mobile -->
        <div class="flex items-center gap-1">
          <a 
            href="https://web.facebook.com/profile.php?id=61573688042341&_rdc=1&_rdr" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1.5 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/biso_ticket/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1.5 text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1.5 text-gray-600 hover:text-black transition-colors"
            aria-label="TikTok"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>

        <button
          ref="openMenuButton"
          class="active:scale-90 transition"
          @click="toggleMobileMenu"
        >
          <Icon name="lucide:menu" class="w-6 h-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <div 
      ref="mobileNavLinks"
      class="fixed inset-0 z-[100] bg-black/40 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <NuxtLink to="/" @click="closeMobileMenu">
        Accueil
      </NuxtLink>
      <NuxtLink to="/evenements" @click="closeMobileMenu">
        Événements
      </NuxtLink>
      <NuxtLink to="/tickets/my-tickets" @click="closeMobileMenu">
        Mes billets
      </NuxtLink>
      <NuxtLink to="/contact" @click="closeMobileMenu">
        Contact
      </NuxtLink>
      <NuxtLink to="/organisateur" @click="closeMobileMenu">
        Organisateur
            </NuxtLink>
      
      <!-- Affichage conditionnel selon l'état de connexion -->
      <template v-if="!isAuthenticated">
        <button 
          @click="handleInscriptionAndClose" 
          class="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
        >
          Inscription
        </button>
      </template>
      <template v-else>
        <div class="mt-4 flex items-center justify-between gap-3 px-6 py-3 bg-purple-50 rounded-full">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ userInitials }}
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900">{{ (user as any)?.name || 'Utilisateur' }}</p>
              <p class="text-xs text-gray-500">Connecté</p>
            </div>
          </div>
          <button 
            @click="handleLogout" 
            class="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </template>
      
      <button 
        ref="closeMenuButton"
        class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex"
        @click="closeMobileMenu"
      >
        <Icon name="lucide:x" class="w-6 h-6" />
      </button>
    </div>
</div>
</template>

<script setup lang="ts">
import type { User } from '~/types/api'

// État réactif pour le menu mobile
const isMobileMenuOpen = ref(false)

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

// Références aux éléments DOM
const openMenuButton = ref<HTMLButtonElement>()
const closeMenuButton = ref<HTMLButtonElement>()
const mobileNavLinks = ref<HTMLDivElement>()

/**
 * Ouvre le menu mobile
 */
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * Ferme le menu mobile
 */
const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

/**
 * Gère l'action "Inscription"
 */
const handleInscription = (): void => {
  // Redirection vers la page d'inscription
  navigateTo('/inscription')
}

/**
 * Gère l'action "Inscription" et ferme le menu mobile
 */
const handleInscriptionAndClose = (): void => {
  closeMobileMenu()
  navigateTo('/inscription')
}

/**
 * Gère l'action "Commencer"
 */
const handleGetStarted = (): void => {
  // Redirection vers la page d'inscription ou de connexion
  navigateTo('/inscription')
}

/**
 * Gère la déconnexion
 */
const handleLogout = async (): Promise<void> => {
  try {
    await logout()
    closeMobileMenu()
    await navigateTo('/')
  } catch (e) {
    console.error('Erreur lors de la déconnexion:', e)
  }
}

// Gestion des événements clavier pour l'accessibilité
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Écoute des événements clavier
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// Nettoyage des événements
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Fermeture du menu lors du changement de route
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
</style>


