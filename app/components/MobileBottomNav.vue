<template>
  <div v-if="!isHiddenNav" class="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
    <nav class="mx-2 mb-2" role="navigation" aria-label="Navigation principale mobile">
      <div class="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-[26px] p-1 border border-primary-200/50 dark:border-neutral-800/50 shadow-lg">
        <div class="flex items-center justify-around" data-testid="mobile-bottom-nav">
          <NuxtLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"   
            :prefetch="true"
            :aria-label="item.label"
            class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 group"
            :class="isActive(item.to) ? 'text-primary-500' : 'text-black dark:text-neutral-300 hover:text-primary-500'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            <div class="w-5 h-5 flex items-center justify-center mb-1">
              <UIcon :name="getIconName(item.key, isActive(item.to))" class="w-5 h-5" aria-hidden="true" />
            </div>
            <span class="text-xs font-medium group-hover:text-primary-500 transition-colors">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
<!--  -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface NavItem {
  key: 'events' | 'organizer' | 'tickets' | 'checkin'
  to: string
  label: string
}

const navItems: NavItem[] = [
  { key: 'events', to: '/evenements', label: 'Événements' },
  { key: 'organizer', to: '/organisateur', label: 'Organisateur' },
  { key: 'tickets', to: '/tickets/my-tickets', label: 'Mes Billets' },
  { key: 'checkin', to: '/check-in', label: 'Check-in' }
]

// Lien actif
const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Cacher la nav sur certaines pages (détail/paiement/confirmation)
const isHiddenNav = computed(() => {
  if (/^\/evenements\/[^/]+(\/.*)?$/.test(route.path)) return true
  if (route.path.startsWith('/confirmation/')) return true
  return false
})

// Icônes Nuxt UI (Heroicons outline/solid)
const getIconName = (key: NavItem['key'], active: boolean) => {
  const solid = active
  switch (key) {
    case 'events':
      return solid ? 'i-heroicons-calendar-days-20-solid' : 'i-heroicons-calendar-days'
    case 'organizer':
      return solid ? 'i-heroicons-user-circle-20-solid' : 'i-heroicons-user-circle'
    case 'tickets':
      return solid ? 'i-heroicons-ticket-20-solid' : 'i-heroicons-ticket'
    case 'checkin':
      return solid ? 'i-heroicons-qr-code-20-solid' : 'i-heroicons-qr-code'
    default:
      return 'i-heroicons-ellipsis-horizontal'
  }
}
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
