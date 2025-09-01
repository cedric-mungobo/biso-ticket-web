<template>
  <div class="flex   container mx-auto relative">
    <!-- Overlay mobile -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="lg:hidden fixed inset-0 bg-black/50 z-[40]"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'flex-col transition-transform duration-300 ease-in-out',
        'lg:relative lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:border-none',
        'fixed top-4 left-0 h-[calc(100vh-6rem)] z-[50]',
        'w-64 bg-white shadow-lg border-r rounded-xl border-gray-200',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li v-for="item in navigationItems" :key="item.name">
            <UButton
              :to="item.route"
              block
              :color="route.path === item.route ? 'primary' : 'neutral'"
              :variant="route.path === item.route ? 'soft' : 'ghost'"
              class="justify-start"
            >
              <component :is="item.icon" class="w-4 h-4 mr-2" />
              {{ item.name }}
            </UButton>
          </li>
        </ul>
        
        <!-- Actions secondaires -->
        <div class="mt-8 space-y-2">
          <UButton to="/" color="neutral" variant="ghost" block class="justify-start">
            <Home class="w-4 h-4 mr-2" />
            Retour au site
          </UButton>
          <UButton color="red" variant="soft" block class="justify-start" @click="handleLogout">
            <LogOut class="w-4 h-4 mr-2" />
            Déconnexion
          </UButton>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 class="text-lg font-semibold text-gray-900">{{ getCurrentPageTitle() }}</h1>
        <UButton
          @click="toggleSidebar"
          variant="ghost"
          size="sm"
          :icon="isSidebarOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
        />
      </div>
      
      <!-- Content Area -->
      <main class="flex-1 md:p-6 overflow-auto">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  LayoutDashboard, 
  Plus, 
  Calendar, 
  BarChart3,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-vue-next'



// Get route from Nuxt
const route = useRoute()

// State pour le toggle mobile
const isSidebarOpen = ref(false)

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Fermer la sidebar quand on change de route
watch(() => route.path, () => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
})

// Navigation items
const navigationItems = [
  { 
    name: 'Tableau de bord', 
    route: '/organisateur', 
    icon: LayoutDashboard
  },
  { 
    name: 'Créer un événement', 
    route: '/organisateur/create-event', 
    icon: Plus
  },
  { 
    name: 'Mes événements', 
    route: '/organisateur/my-events', 
    icon: Calendar
  },
  { 
    name: 'Statistiques', 
    route: '/organisateur/statistics', 
    icon: BarChart3
  }
]

// Get current page title
const getCurrentPageTitle = () => {
  const currentItem = navigationItems.find(item => item.route === route.path)
  return currentItem ? currentItem.name : 'Espace Organisateur'
}

// Handle logout
const handleLogout = async () => {
  try {
    const { logout } = useAuth()
    await logout()
    await navigateTo('/connexion')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Rediriger quand même vers la page de connexion
    await navigateTo('/connexion')
  }
}


</script>

<style scoped>
/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

::-webkit-scrollbar-corner {
  background: #f1f5f9;
}

/* Scrollbar pour Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

/* Scrollbar pour le contenu principal */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}

/* Scrollbar pour la sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}
</style>