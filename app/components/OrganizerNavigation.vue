<template>
  <div class="flex  pt-20 max-w-6xl mx-auto relative">
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
        'fixed top-24 left-0 h-[calc(100vh-6rem)] z-[50]',
        'w-64 bg-white shadow-lg border-r rounded-xl border-gray-200',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li v-for="item in navigationItems" :key="item.name">
            <NuxtLink
              :to="item.route"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                route.path === item.route 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
        
        <!-- Actions secondaires -->
        <div class="mt-8 space-y-2">
          <NuxtLink
            to="/"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Home class="w-5 h-5" />
            Retour au site
          </NuxtLink>
          
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut class="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-card border-b border-border px-2 py-2 relative">
        <!-- Bouton toggle mobile dans le header -->
        <button
          @click="toggleSidebar"
          class="lg:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-primary-500 text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          :aria-label="isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        >
          <Menu v-if="!isSidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
        
        <div class="flex items-center justify-between lg:ml-0 ml-8">
          <!-- Titre -->
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-primary rounded-full"></div>
            <h2 class="text-lg font-semibold text-foreground">{{ getCurrentPageTitle() }}</h2>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <!-- Actions personnalisées -->
            <template v-for="action in customActions" :key="action.label">
              <button
                @click="action.action"
                :class="getActionClasses(action.variant)"
              >
                <component :is="action.icon" class="w-4 h-4 mr-2" />
                {{ action.label }}
              </button>
            </template>
            
            <!-- Bouton Créer un événement -->
            <NuxtLink
              v-if="showCreateButton()"
              to="/organisateur/create-event"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Créer un événement
            </NuxtLink>
          </div>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="flex-1 md:p-6 overflow-auto">
        <div class="max-w-4xl mx-auto">
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

// Props pour personnaliser la top bar
const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  customActions: {
    type: Array,
    default: () => []
  }
})

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
  if (props.pageTitle) return props.pageTitle
  
  const currentItem = navigationItems.find(item => item.route === route.path)
  return currentItem ? currentItem.name : 'Espace Organisateur'
}

// Show create button only on certain pages
const showCreateButton = () => {
  if (!props.showCreateButton) return false
  return route.path === '/organisateur' || route.path === '/organisateur/my-events'
}

// Handle logout
const handleLogout = () => {
  // Ici vous pouvez ajouter la logique de déconnexion
  // Par exemple, appeler une API de déconnexion ou nettoyer le localStorage
  console.log('Déconnexion...')
  // Rediriger vers la page de connexion
  navigateTo('/connexion')
}

// Get action button classes based on variant
const getActionClasses = (variant) => {
  const baseClasses = 'inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium'
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`
    case 'secondary':
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`
    case 'danger':
      return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`
    default:
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`
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