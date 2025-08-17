<template>
  <div v-if="!isEventDetailPage" class="fixed bottom-0 left-0 right-0 z-50 md:hidden">
    <nav class="mx-2 mb-2">
      <div class="max-w-5xl mx-auto bg-neutral-100/50 backdrop-blur-md rounded-[26px] p-1 border border-neutral-200/50 shadow-lg">
        <div class="flex items-center justify-around">
        
          <!-- Événements -->
          <NuxtLink 
            to="/evenements" 
            class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 group"
            :class="isActive('/evenements') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'"
          >
            <div class="w-8 h-8 flex items-center justify-center mb-1">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xs font-medium group-hover:text-primary-500 transition-colors">Événements</span>
          </NuxtLink>

          <!-- Organisateur -->
          <NuxtLink 
            to="/organisateur" 
            class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 group"
            :class="isActive('/organisateur') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'"
          >
            <div class="w-8 h-8 flex items-center justify-center mb-1">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <span class="text-xs font-medium group-hover:text-primary-500 transition-colors">Organisateur</span>
          </NuxtLink>

          <!-- Mes Billets -->
          <NuxtLink 
            to="/tickets/my-tickets" 
            class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 group"
            :class="isActive('/tickets/my-tickets') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'"
          >
            <div class="w-8 h-8 flex items-center justify-center mb-1">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium group-hover:text-primary-500 transition-colors">Mes Billets</span>
          </NuxtLink>

          <!-- Check-in -->
          <NuxtLink 
            to="/check-in" 
            class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 group"
            :class="isActive('/check-in') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'"
          >
            <div class="w-8 h-8 flex items-center justify-center mb-1">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xs font-medium group-hover:text-primary-500 transition-colors">Check-in</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Vérifier si le lien est actif
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Vérifier si on est sur une page de détail d'événement
const isEventDetailPage = computed(() => {
  return route.path.match(/^\/evenements\/[^\/]+$/)
})
</script>

<style scoped>
/* Animation de transition pour les icônes */
.nav-link {
  transition: all 0.2s ease-in-out;
}

.nav-link:hover {
  transform: translateY(-2px);
}

/* Style actif avec animation */
.nav-link.active {
  transform: scale(1.1);
}

/* Amélioration des bordures et de l'apparence */
nav {
  filter: drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1)) drop-shadow(0 2px 4px -1px rgb(0 0 0 / 0.06));
}

/* Amélioration des liens */
a {
  transition: all 0.2s ease;
}

a:hover {
  transform: translateY(-1px);
}

/* Style actif amélioré */
a[class*="text-primary-500"] {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
