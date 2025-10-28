<template>
  <div class="fixed top-0 left-0 right-0 z-50 m-2">
    <!-- ========== HEADER ========== -->
    <header class="top-4 flex flex-wrap md:justify-start md:flex-nowrap w-full before:absolute before:inset-0 before:max-w-5xl before:mx-auto before:px-2 before:rounded-[26px] before:bg-white/95 before:backdrop-blur-md before:border before:border-gray-200">
      <nav class="relative container-custom w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 ps-5 pe-2 md:py-0">
        <div class="flex items-center">
          <!-- Logo -->
          <NuxtLink class="flex-none rounded-md text-xl inline-block p-0.5 font-semibold focus:outline-hidden focus:opacity-80" to="/" aria-label="Biso Ticket">
            <Logo size="h-10 w-auto" />
          </NuxtLink>
          <!-- End Logo -->

          <div class="ms-1 sm:ms-2">
          </div>
        </div>

        <!-- Button Group -->
        <div class="md:order-3 flex items-center gap-x-3">
          <div class="md:ps-3" v-if="!isAuthenticated">
            <NuxtLink class="group inline-flex items-center gap-x-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 font-medium text-sm text-nowrap text-white rounded-full transition-all hover:shadow-lg focus:outline-hidden" to="/connexion">
              Se connecter
            </NuxtLink>
          </div>
          
          <!-- Profile Button si connecté -->
          <div class="md:ps-3" v-else>
            <NuxtLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                {{ userInitials }}
              </div>
            </NuxtLink>
          </div>

          <div class="md:hidden">
            <button 
              type="button" 
              @click="toggleMenu"
              class="size-9 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-200 text-black disabled:opacity-50 disabled:pointer-events-none"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <svg 
                v-if="!isMenuOpen"
                class="shrink-0 size-4" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6"/>
                <line x1="3" x2="21" y1="12" y2="12"/>
                <line x1="3" x2="21" y1="18" y2="18"/>
              </svg>
              <svg 
                v-else
                class="shrink-0 size-4" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <!-- End Button Group -->

        <!-- Collapse -->
        <div 
          :class="[
            'overflow-hidden transition-all duration-300 basis-full grow',
            isMenuOpen ? 'block' : 'hidden md:block'
          ]"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-y-4 md:gap-y-3 py-4 md:py-0 md:ps-7">
            <NuxtLink 
              v-for="item in menuItems" 
              :key="item.name"
              :to="item.href"
              @click="isMenuOpen = false"
              :class="[
                'px-4 py-3 md:px-3 md:py-2 text-base md:text-sm font-medium transition-colors rounded-lg md:rounded-none',
                isActive(item.href) ? 'text-purple-600 bg-purple-50 md:bg-transparent font-semibold' : 'text-black hover:text-purple-600 hover:bg-gray-100 md:hover:bg-transparent'
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        <!-- End Collapse -->
      </nav>
    </header>
    <!-- ========== END HEADER ========== -->
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/api'

const menuItems = [
  { name: 'Accueil', href: '/' },
  { name: 'Événements', href: '/evenements' },
  { name: 'Mes billets', href: '/tickets/my-tickets' },
  { name: 'Organisateur', href: '/organisateur' },
  { name: 'Contact', href: '/contact' }     
]

const route = useRoute()
const isMenuOpen = ref(false)

// État d'authentification
const authToken = useCookie('auth_token')
const isAuthenticated = computed(() => !!authToken.value)

// Récupérer le profil utilisateur
const user = ref<User | null>(null)

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const { getProfile } = useAuth()
      user.value = await getProfile()
    } catch (error) {
      console.error('Erreur récupération profil:', error)
      user.value = null
    }
  }
})

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

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const isActive = (href: string) => {
  const currentUrl = route.path
  
  // Cas spécial pour la page d'accueil
  if (href === '/') {
    return currentUrl === '/' || currentUrl === ''
  }
  
  // Cas normaux : vérifier l'égalité exacte ou le préfixe
  const normalizedHref = href.replace(/\/$/, '')
  const normalizedCurrent = currentUrl.replace(/\/$/, '')
  
  return normalizedCurrent === normalizedHref || (normalizedCurrent.startsWith(normalizedHref + '/') && normalizedHref !== '')
}

// Fermeture du menu lors du changement de route
watch(() => route.path, () => {
  isMenuOpen.value = false
})
</script>