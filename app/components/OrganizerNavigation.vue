<template>
  <div class=" max-w-5xl mx-auto py-16 p-1">
    <!-- Mobile Menu -->
    <div class="">
      <!-- Menu Container -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="bg-white border border-gray-200 rounded-2xl  p-2"
      >
        <ul class="flex flex-row overflow-x-auto scrollbar-hide gap-2">
          <li v-for="item in menuItems" :key="item.id" class="flex-shrink-0">
            <a 
              @click="navigateTo(item.route)"
              :class="[
                'flex flex-row items-center px-4 py-3 focus:outline-none transition-all duration-200 rounded-xl min-w-[80px] whitespace-nowrap gap-2',
                isActiveLink(item.route) 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              ]"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5 hidden lg:block',
                  isActiveLink(item.route) ? 'text-purple-600' : 'text-gray-500'
                ]"
              />
              <span class="text-xs font-medium text-center">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Main Content -->
    <main 
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible-once="{ opacity: 1, y: 0 }"
      :delay="200"
      :duration="1200"
      class="flex-1 overflow-auto mt-8"
    >
      <div class="">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  Plus, 
  Calendar, 
  BarChart3
} from 'lucide-vue-next'

// Array des éléments du menu
const menuItems = [
  {
    id: 'create',
    label: 'Créer mon événement',
    icon: Plus,
    route: '/organisateur/create-event'
  },
  {
    id: 'events',
    label: 'Mes événements',
    icon: Calendar,
    route: '/organisateur/my-events'
  },
  {
    id: 'statistics',
    label: 'Statistiques événements',
    icon: BarChart3,
    route: '/organisateur/statistics'
  }
]

// Fonction pour vérifier si un lien est actif
const isActiveLink = (route) => {
  const currentRoute = useRoute()
  return currentRoute.path === route
}
</script>

<style scoped>
/* Scrollbar personnalisée pour le contenu principal */
main::-webkit-scrollbar {
  width: 4px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

main::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

/* Scrollbar pour Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

/* Masquer la scrollbar pour le menu horizontal */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}
</style>