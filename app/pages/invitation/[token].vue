<template>
  <div>
    <Suspense>
      <template #default>
        <component :is="currentTemplate" :invitation="invitation" :event="event" />
      </template>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p class="text-gray-600 text-lg">Chargement de l'invitation...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ 
  layout: false, 
  ssr: false,
  client: true 
})

// Fonction pour charger dynamiquement un template basé sur le design_key
const loadTemplateComponent = async (designKey: string) => {
  console.log('Chargement dynamique du template:', designKey)
  
  try {
    // Charger directement le composant avec le design_key + extension .vue
    const component = await import(`~/components/invitation/${designKey}.vue`)
    console.log(`Composant ${designKey}.vue chargé avec succès`)
    return component.default || component
  } catch (error) {
    console.warn(`Composant ${designKey} non trouvé, utilisation du template par défaut`)
    // Fallback vers le template par défaut
    const fallback = await import('~/components/invitation/template_default.vue')
    return fallback.default || fallback
  }
}


const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const { $myFetch } = useNuxtApp()
const toast = useToast()

const templateKey = ref('template_default')
const invitation = ref<any>(null)
const event = ref<any>(null)

const load = async () => {
  // Vérifier que nous sommes côté client
  if (process.server) return
  
  try {
    const res = await $myFetch<any>(`/public/invitations/${token.value}`)
    const data = res?.data || res
    invitation.value = data?.invitation || data
    event.value = invitation.value?.event || data?.event || null
    
    // Récupérer le design_key du template d'invitation
    const designKey = invitation.value?.invitationTemplate?.designKey || 
                     invitation.value?.invitation_template?.design_key || 
                     'template_default'
    
    templateKey.value = designKey
    console.log('Template key détecté:', templateKey.value)
  } catch (_e) {
    toast.add({ title: 'Introuvable', description: 'Invitation introuvable.', color: 'error' })
  }
}

onMounted(load)

const currentTemplate = computed(() => {
  const key = String(templateKey.value || '').toLowerCase()
  console.log('Sélection du template pour key:', key)
  
  if (!key) return null
  
  return defineAsyncComponent(() => loadTemplateComponent(key))
})
</script>


