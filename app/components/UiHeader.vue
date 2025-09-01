<template>
  <div class="sticky top-0 z-50  container mx-auto rounded-2xl p-2">
  <UHeader
    class="rounded-2xl"
    mode="drawer"
    :toggle="{ color: 'primary', variant: 'subtle', class: 'rounded-full' }"
  >
    <template #title>
      <NuxtLink to="/" aria-label="Biso Ticket" class="inline-flex items-center gap-2">
        <img src="/logo.png" alt="Biso Ticket" class="h-8 w-auto" loading="eager" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <div class="flex items-center gap-2">
        <template v-if="!isAuthenticated">
          <UButton color="neutral" variant="outline" to="/inscription">Inscription</UButton>
          <UButton color="primary" to="/connexion">Connexion</UButton>
        </template>
        <template v-else>
          <UButton color="neutral" variant="subtle" class="rounded-full" to="/profile">
            {{ userInitials }}
          </UButton>
          <UButton color="neutral" variant="ghost" @click="handleLogout">Se déconnecter</UButton>
        </template>
      </div>
    </template>

    <template #body>
      <div class="space-y-4 p-2">
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
        <div class="flex items-center gap-2 pt-2 border-t border-neutral-200">
          <template v-if="!isAuthenticated">
            <UButton color="primary" block to="/connexion">Connexion</UButton>
            <UButton color="neutral" variant="outline" block to="/inscription">Inscription</UButton>
          </template>
          <template v-else>
            <UButton color="neutral" block to="/profile">Mon profil</UButton>
            <UButton color="neutral" variant="ghost" block @click="handleLogout">Se déconnecter</UButton>
          </template>
        </div>
      </div>
    </template>

  </UHeader>
</div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Accueil', to: '/', active: route.path === '/' },
  { label: 'Événements', to: '/evenements', active: route.path.startsWith('/evenements') },
  { label: 'Organisateur', to: '/organisateur', active: route.path.startsWith('/organisateur') },
  { label: 'Mes billets', to: '/tickets/my-tickets', active: route.path.startsWith('/tickets') },
  { label: 'Contact', to: '/contact', active: route.path.startsWith('/contact') }
])

// Auth minimal basé sur le cookie / composable
const { getProfile, logout } = useAuth()
const authToken = useCookie('auth_token')
const isAuthenticated = computed(() => !!authToken.value)
const { data: user } = await useAsyncData('uiheader:profile', () => getProfile(), { server: false, immediate: false })

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

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/')
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
</style>


