<template>
  <div class="relative" v-if="user">
    <!-- Bouton de menu -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
        <Icon 
          :name="isGoogleUser ? 'logos:google-icon' : 'heroicons:user'" 
          class="w-5 h-5 text-primary-600" 
        />
      </div>
      <div class="text-left">
        <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
        <p class="text-xs text-gray-500">{{ user.email }}</p>
      </div>
      <Icon 
        :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
        class="w-4 h-4 text-gray-400" 
      />
    </button>

    <!-- Menu déroulant -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
      >
        <!-- Profil -->
        <NuxtLink
          to="/profile"
          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="isOpen = false"
        >
          <Icon name="heroicons:user" class="w-4 h-4 mr-3" />
          Mon profil
        </NuxtLink>

        <!-- Mes tickets -->
        <NuxtLink
          to="/tickets"
          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="isOpen = false"
        >
          <Icon name="heroicons:ticket" class="w-4 h-4 mr-3" />
          Mes tickets
        </NuxtLink>

        <!-- Séparateur -->
        <div class="border-t border-gray-100 my-1"></div>

        <!-- Déconnexion -->
        <button
          @click="handleLogout"
          class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-3" />
          Se déconnecter
        </button>
      </div>
    </Transition>

    <!-- Overlay pour fermer le menu -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script lang="ts" setup>
// State
const isOpen = ref(false)

// Composables
const { user, isGoogleUser } = useAuthState()
const { logout } = useAuth()
const { logoutGoogle } = useGoogleAuth()
const router = useRouter()
const toast = useToast()

/**
 * Gère la déconnexion
 */
const handleLogout = async () => {
  try {
    isOpen.value = false
    
    // Déconnexion Google si nécessaire
    if (isGoogleUser.value) {
      await logoutGoogle()
    }
    
    // Déconnexion générale
    await logout()
    
    toast.add({ 
      title: 'Déconnexion', 
      description: 'Vous avez été déconnecté avec succès.', 
      color: 'green' 
    })
    
    // Rediriger vers la page d'accueil
    await router.push('/')
    
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error)
    toast.add({ 
      title: 'Erreur de déconnexion', 
      description: 'Une erreur est survenue lors de la déconnexion.', 
      color: 'error' 
    })
  }
}

// Fermer le menu avec Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isOpen.value = false
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
