<template>
  <div>
   
    <component :is="currentTemplate" :invitation="invitation" :event="event" />
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
const loadTemplateComponent = (designKey: string) => {
  console.log('Chargement dynamique du template:', designKey)
  
  // Chargement direct du composant basé sur le design_key
  const loadComponent = async () => {
    try {
      console.log(`Tentative de chargement de: ~/components/invitation/${designKey}.vue`)
      
      // Charger directement le composant avec le design_key
      const component = await import(`~/components/invitation/${designKey}.vue`)
      console.log(`Composant ${designKey} chargé avec succès`)
      return component.default || component
    } catch (error) {
      console.warn(`Composant ${designKey} non trouvé, erreur:`, error)
      console.log('Utilisation du template par défaut')
      // Fallback vers le template par défaut
      const fallback = await import('~/components/invitation/template_default.vue')
      return fallback.default || fallback
    }
  }
  
  return defineAsyncComponent(loadComponent)
}


const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const { $myFetch } = useNuxtApp()
const toast = useToast()

const templateKey = ref('default')
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
    
    templateKey.value = designKey.toLowerCase()
    console.log('Template key détecté:', templateKey.value)
  } catch (_e) {
    toast.add({ title: 'Introuvable', description: 'Invitation introuvable.', color: 'error' })
  }
}

onMounted(load)

const currentTemplate = computed(() => {
  const key = String(templateKey.value || '').toLowerCase()
  console.log('Sélection du template pour key:', key)
  
  // Chargement dynamique du composant basé sur le design_key
  return loadTemplateComponent(key)
})
</script>


