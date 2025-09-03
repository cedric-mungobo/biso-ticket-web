<template>
  <div class="">
    <!-- Speed Dial FAB (Mobile) -->
    <div class="lg:hidden fixed bottom-40 right-6 group">
      <!-- Speed Dial Menu -->
      <div 
        :class="[
          'flex flex-col justify-end py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-xs',
          isMobileMenuOpen ? 'block' : 'hidden'
        ]"
      >
        <ul class="text-sm text-gray-500">
          <li>
            <button 
              type="button"
              @click="navigateTo('/organisateur/create-event'); closeMobileMenu()"
              class="flex items-center w-full px-5 py-2 border-b border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              <Plus class="w-3.5 h-3.5 me-2" />
              <span class="text-sm font-medium">Créer un événement</span>
            </button>
          </li>
          <li>
            <button 
              type="button"
              @click="navigateTo('/organisateur/my-events'); closeMobileMenu()"
              class="flex items-center w-full px-5 py-2 border-b border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              <Calendar class="w-3.5 h-3.5 me-2" />
              <span class="text-sm font-medium">Mes événements</span>
            </button>
          </li>
          <li>
            <button 
              type="button"
              @click="navigateTo('/organisateur/statistics'); closeMobileMenu()"
              class="flex items-center w-full px-5 py-2 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              <BarChart3 class="w-3.5 h-3.5 me-2" />
              <span class="text-sm font-medium">Rapport</span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- Main FAB Button -->
      <button 
        type="button" 
        @click="toggleMobileMenu"
        class="flex items-center justify-center ml-auto text-white bg-primary-600 rounded-lg px-4 py-1 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 focus:outline-none"
      >
        <svg 
          class="w-4 h-4 mr-2" 
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 17 14"
        >
          <path 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
        <span class="text-sm font-medium">Menu</span>
        <span class="sr-only">Ouvrir le menu</span>
      </button>
    </div>
    
    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto   md:p-6">
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

// State pour le menu mobile
const isMobileMenuOpen = ref(false)

// Toggle menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Fermer le menu mobile
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fermer le menu mobile avec la touche Escape
onMounted(() => {
  const handleEscape = (event) => {
    if (event.key === 'Escape' && isMobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
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
</style>